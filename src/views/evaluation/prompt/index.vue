<template>
  <div class="container">
    <div class="left box">
      <div class="section-title">
        <span class="title-text">Prompt评估</span>
        <div class="title-decoration"></div>
      </div>
      <div class="text-header">
        <div class="text-item left-text">
          <el-icon :size="16" class="title-icon"><EditPen /></el-icon>
          待评估的prompt
        </div>
        <div class="text-item right-text">
          <el-icon :size="16" class="title-icon"><ChatLineRound /></el-icon>
          期待得到的模型回复
        </div>
      </div>

      <div class="input-row">
        <textarea
            class="input-styled"
            placeholder="请输入待评估的prompt..."
            style="resize: none;"
            v-model="promptText"
        ></textarea>
        <textarea
            class="input-styled"
            placeholder="请输入期待的模型回复..."
            style="resize: none;"
            v-model="expectedText"
        ></textarea>
      </div>

      <div class="select-section">
        <el-select
            v-model="selectedMetrics"
            multiple
            placeholder="请选择评估指标"
            class="metrics-select"
        >
          <el-option
              v-for="(metric, index) in metricsList"
              :key="index"
              :label="metric"
              :value="index"
              :disabled="true"
          />
        </el-select>
        <el-button type="primary" class="action-button" @click="startEvaluation">开始评估</el-button>
      </div>

      <div class="result-container" style="margin-top: 20px">
        <!-- 加载状态 -->
        <div v-if="isEvaluating" class="loading-box">
          <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
          <div class="loading-text">评估中，预计需要30秒...</div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!evaluationResult" class="empty-box">
          <el-icon :size="48" class="empty-icon"><DataBoard /></el-icon>
          <div class="empty-text">点击开始评估查看结果</div>
        </div>

        <!-- 结果展示 -->
        <div v-else class="chart-container">
          <div class="chart-switch">
            <el-tooltip effect="dark" :content="chartType === 'bar' ? '切换折线图' : '切换柱状图'" placement="left">
              <el-icon class="switch-icon" @click="toggleChartType">
                <SwitchButton />
              </el-icon>
            </el-tooltip>
          </div>
          <div v-show="chartType === 'bar'" ref="barChartDom" style="width: 100%; height: 300px;"></div>
          <div v-show="chartType === 'line'" ref="lineChartDom" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
    <div class="right box">
      <!-- 右栏内容 -->
      <el-button type="primary">right</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无逻辑
import {onMounted, ref, nextTick, onUnmounted} from "vue";
import * as echarts from 'echarts';
import {useRoute} from "vue-router";
import {getPromptTaskById, getAllMetrics, evaluatePromptTask} from "@/api/prompt.js";
import {ChatLineRound, EditPen} from "@element-plus/icons-vue";
import { SwitchButton } from '@element-plus/icons-vue';

const route = useRoute()
const id = route.params.id
const name = ref('')
const description = ref('')
const selectedMetrics = ref<number[]>([])
const metricsList = ref<string[]>([])
const promptText = ref<string>('');
const expectedText = ref<string>('');
const isEvaluating = ref(false)
const evaluationResult = ref<any>(null)
const chart = ref<HTMLElement | null>(null)
const chartType = ref<'bar' | 'line'>('bar');
const historyResults = ref<Array<{
  timestamp: number;
  scores: number[];
}>>([]);
const barChartDom = ref<HTMLElement | null>(null);
const lineChartDom = ref<HTMLElement | null>(null);
let barChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;

onMounted(async () => {
  const res = await getPromptTaskById(id)
  console.log(res)
  name.value = res.name
  description.value = res.description
  selectedMetrics.value = res.metrics;
  const res1 = await getAllMetrics();
  metricsList.value = res1.result;
  console.log(selectedMetrics);
})

async function startEvaluation() {
  try {
    isEvaluating.value = true;
    evaluationResult.value = null;

    const res = await evaluatePromptTask(
        id,
        promptText.value,
        expectedText.value
    );

    evaluationResult.value = res;

    // 保存历史记录
    historyResults.value.push({
      timestamp: Date.now(),
      scores: res.result.scores
    });

    await nextTick();
    renderChart();
  } catch (error) {
    console.error('评估失败:', error);
  } finally {
    isEvaluating.value = false;
  }
}

// 图表切换
// 修改后的切换函数
function toggleChartType() {
  chartType.value = chartType.value === 'bar' ? 'line' : 'bar';
  nextTick(() => {
    // 优先使用已有实例
    const existingInstance = chartType.value === 'bar'
        ? barChartInstance
        : lineChartInstance;

    if (!existingInstance) {
      renderChart();
    } else {
      existingInstance.resize();
    }
  });
}

// 绘制图表函数
// 修改后的renderChart函数
// 重构后的图表渲染
function renderChart() {
  if (!evaluationResult.value) return;

  // 根据图表类型选择容器
  const currentDom = chartType.value === 'bar' ? barChartDom.value : lineChartDom.value;
  if (!currentDom) {
    console.error('图表容器未找到');
    return;
  }
  // 销毁旧实例
  const oldInstance = echarts.getInstanceByDom(currentDom);
  if (oldInstance) oldInstance.dispose();

  // 创建新实例
  const chartInstance = echarts.init(currentDom);
  const option = chartType.value === 'bar' ? getBarOption() : getLineOption();
  chartInstance.setOption(option);

  // 保存实例引用
  if (chartType.value === 'bar') {
    barChartInstance = chartInstance;
  } else {
    lineChartInstance = chartInstance;
  }

  // 响应式调整
  const resizeHandler = () => chartInstance.resize();
  window.addEventListener('resize', resizeHandler);

  // 清理钩子
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    chartInstance.dispose();
    if (chartType.value === 'bar') {
      barChartInstance = null;
    } else {
      lineChartInstance = null;
    }
  });
}

// 柱状图配置
function getBarOption() {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].name}<br/>得分：${(params[0].value * 100).toFixed(1)}%`
    },
    xAxis: {
      type: 'category',
      data: selectedMetrics.value.map(i => metricsList.value[i]),
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: { formatter: (value: number) => `${value * 100}%` }
    },
    series: [{
      name: '评估分数',
      type: 'bar',
      barWidth: '60%',
      data: evaluationResult.value.result.scores,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) =>
            `${(params.value * 100).toFixed(1)}%`
      }
    }]
  };
}

// 折线图配置
function getLineOption() {
  const xAxisData = historyResults.value.map((_, index) => `第${index + 1}次`);
  const seriesData = selectedMetrics.value.map((metricIndex, i) => ({
    name: metricsList.value[metricIndex],
    type: 'line',
    showSymbol: true,
    data: historyResults.value.map(result => result.scores[i])
  }));

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return params.map(p => `${p.seriesName}<br/>${p.marker} ${(p.value * 100).toFixed(1)}%`).join('<br/>');
      }
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: { formatter: (value: number) => `${value * 100}%` }
    },
    legend: {
      data: seriesData.map(s => s.name),
      bottom: 0
    },
    series: seriesData
  };
}

onUnmounted(() => {
  if (chart.value) {
    const instance = echarts.getInstanceByDom(chart.value)
    instance?.dispose()
  }
})
</script>

<style scoped>
.result-container {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
  position: relative;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-icon {
  animation: rotate 2s linear infinite;
  margin-bottom: 16px;
  color: #3498db;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
}

.chart-container {
  height: 300px;
}

.select-section {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.metrics-select {
  flex: 3;
  :deep(.el-select__wrapper) {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.35);
    }

    &:focus-within {
      box-shadow: 0 0 5px rgba(0, 132, 255, 0.2);
    }
  }

  /* 多选标签样式 */
  :deep(.el-select__tags) {
    .el-tag {
      background: rgba(52, 152, 219, 0.15);
      border: 1px solid rgba(52, 152, 219, 0.3);
      border-radius: 6px;
      color: #2c3e50;
      .el-tag__close {
        color: rgba(44, 62, 80, 0.6);
        &:hover {
          background: rgba(52, 152, 219, 0.2);
        }
      }
    }
  }
}

/* 优化操作按钮 */
.action-button {
  flex: 1;
  height: 40px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9));
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  color: white;
  letter-spacing: 1px;
  transition: all 0.25s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

/* 下拉选项样式优化 */
:deep(.el-select-dropdown) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .el-select-dropdown__item {
    color: #2c3e50;
    &.selected {
      background: rgba(52, 152, 219, 0.1);
    }
    &:hover {
      background: rgba(52, 152, 219, 0.15);
    }
  }
}

/* 标题容器样式 */
.section-title {
  margin-bottom: 5px;
  position: relative;
}

/* 主标题文字 */
.title-text {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
  padding-left: 12px;
}

/* 装饰线 */
.title-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: linear-gradient(to bottom, #3498db, #2980b9);
  border-radius: 2px;
}

/* 可选底部装饰线 */
.title-decoration {
  width: 40px;
  height: 2px;
  background: rgba(52, 152, 219, 0.3);
  margin-top: 8px;
}

.text-header {
  display: flex;
  margin: 20px 0;
  gap: 31px;
  padding: 0 10px;
  position: relative;
}

.text-item {
  font-size: 16px;
  flex: 0 0 47%; /* 设置固定宽度 */
  margin: 0;
  font-weight: 500;
  color: #2c3e50;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.text-item:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.left-text::after {
  content: "";
  position: absolute;
  right: -11px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 60%;
  background: rgba(52, 152, 219, 0.3);
}

.left-text{
  margin-left: -8px;
}

.title-icon {
  color: #3498db;
  filter: drop-shadow(0 2px 2px rgba(52, 152, 219, 0.2));
}

.right-text {
  text-align: left; /* 右对齐文本 */
  padding-right: 20px; /* 微调位置 */
}

.input-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  position: relative;
  width: 100%;
}

.input-styled {
  flex: 1;
  max-width: 50%; /* 每个输入框小于一半 */
  height: 150px;
  font-size: 15px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease-in-out;
  text-align: left;
  vertical-align: top;
  padding: 15px 20px;  /* 上边距减少 */
  line-height: 1.5;
}

.input-styled:focus {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 5px rgba(0, 132, 255, 0.2);
}


.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  height: 100vh; /* 关键：高度占满整个屏幕 */
  box-sizing: border-box; /* 保证 padding 不挤压高度 */
}

.left,
.right {
  flex: 1;
}

.box {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  height: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

</style>
