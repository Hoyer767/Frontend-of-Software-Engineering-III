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
              v-for="metric in metricsList"
              :key="metric.name"
              :label="metric.description"
              :value="metric.name"
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
        <div v-else-if="!evaluationResult && !latestScore" class="empty-box">
          <el-icon :size="48" class="empty-icon"><DataBoard /></el-icon>
          <div class="empty-text">点击开始评估查看结果</div>
        </div>

        <!-- 结果展示 -->
        <div v-else class="chart-container">
          <div class="chart-switch">
            <div class="switch-row">
              <el-tooltip effect="dark" :content="chartType === 'bar' ? '切换折线图' : '切换柱状图'" placement="left">
                <el-icon class="switch-icon" @click="toggleChartType" :style="{ fontSize: '24px' }">
                  <Switch />
                </el-icon>
              </el-tooltip>

              <span class="chart-title">
      {{ chartType === 'bar' ? '本轮评估分数' : '多轮评估分数' }}
    </span>
            </div>
          </div>
          <div v-show="chartType === 'bar'" ref="barChartDom" style="width: 100%; height: 340px;"></div>
          <div v-show="chartType === 'line'" ref="lineChartDom" style="width: 100%; height: 340px;"></div>
        </div>
      </div>
    </div>
    <div class="right box">
      <div class="section-title">
        <span class="title-text">Prompt优化结果</span>
        <div class="title-decoration"></div>
      </div>
      <!-- 双栏展示 -->
      <div class="optimize-row">
        <!-- 原始Prompt -->
        <div class="prompt-card">
          <div class="card-header">
            <el-icon><Document /></el-icon>
            原始Prompt
          </div>
          <div class="card-content" v-if="!isEvaluating">
            <span class="typing-text">{{ displayedOriginal }}</span>
            <span class="typing-caret" v-show="showCaret"></span>
          </div>
          <div v-else class="optimize-loading">
            <el-icon class="loading-icon" :size="18" style="margin-bottom: 5px"><Loading /></el-icon>
            <div class="loading-text">优化中，预计需要30秒...</div>
          </div>
        </div>


        <!-- 优化后Prompt -->
        <div class="prompt-card">
          <div class="card-header">
            <el-icon><MagicStick /></el-icon>
            优化后Prompt
          </div>
          <div class="card-content" v-if="!isEvaluating">
            <span class="typing-text">{{ displayedOptimized }}</span>
            <span class="typing-caret" v-show="showCaret"></span>
          </div>
          <div v-else class="optimize-loading">
            <el-icon class="loading-icon" :size="18" style="margin-bottom: 5px"><Loading /></el-icon>
            <div class="loading-text">优化中，预计需要30秒...</div>
          </div>
        </div>
      </div>
      <!-- 优化说明 -->
      <div class="explain-card">
        <div class="card-header">
          <el-icon><Comment /></el-icon>
          优化说明
        </div>
        <div class="card-content" v-if="!isEvaluating">
          <span class="typing-text">{{ displayedExplanation }}</span>
          <span class="typing-caret" v-show="showCaret"></span>
        </div>
        <div v-else class="optimize-loading">
          <el-icon class="loading-icon" :size="25"><Loading /></el-icon>
          <div class="loading-text">优化中，预计需要30秒...</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无逻辑
import {onMounted, ref, nextTick, onUnmounted} from "vue";
import * as echarts from 'echarts';
import {useRoute} from "vue-router";
import {getPromptTaskById, getAllMetrics, evaluatePromptTask, promptOptimization} from "@/api/prompt.js";
import {ChatLineRound, EditPen, DataAnalysis, Switch} from "@element-plus/icons-vue";
import { SwitchButton } from '@element-plus/icons-vue';

interface MetricItem {
  name: string;
  description: string;
}

const route = useRoute()
const id = route.params.id
const name = ref('')
const description = ref('')
const promptText = ref<string>('');
const expectedText = ref<string>('');
const isEvaluating = ref(false)
const evaluationResult = ref<any>(null)
const chart = ref<HTMLElement | null>(null)
const chartType = ref<'bar' | 'line'>('bar');
const historyResults = ref<Array<{
  timestamp: number;
  scores: Record<string, number>; // 改为字典格式存储
}>>([]);
const barChartDom = ref<HTMLElement | null>(null);
const lineChartDom = ref<HTMLElement | null>(null);
let barChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;
const displayedOriginal = ref('');
const displayedOptimized = ref('');
const displayedExplanation = ref('');
const showCaret = ref(true);
const metricsList = ref<MetricItem[]>([])
const selectedMetrics = ref<string[]>([])
const custom_metrics = ref<string>('')
const latestScore = ref<Record<string, number>>({});
const drawHistory = ref<boolean>(false)
const historyPrompts = ref<string[]>([]);

// 打字机动画函数
const typeWriter = (target: Ref<string>, text: string) => {
  let index = 0;
  target.value = '';

  const typing = () => {
    if (index < text.length) {
      target.value += text.charAt(index);
      index++;
      setTimeout(typing, 20);
    } else {
      showCaret.value = false;
    }
  };

  typing();
};

function parseAndStoreMetrics(input: string) {
  console.log("here", input)

  // 解析逻辑
  const entries = input.match(/\d+\.\s*(.*?)(?=\s*\d+\.|$)/gs) || [];

  console.log(entries)

  for (const entry of entries) {
    const cleanedEntry = entry.replace(/^\d+\.\s*/, "").trim();

    // 用冒号切分，取得 metric 和描述部分
    const colonSplit = cleanedEntry.split("：");
    if (colonSplit.length < 2) continue;

    const metricRaw = colonSplit[0].trim(); // 去除冒号前内容（metric）
    const descriptionRaw = colonSplit.slice(1).join("：").split("，")[0].trim(); // 冒号之后第一个逗号前的描述

    if (!metricRaw || !descriptionRaw) continue;
    console.log(metricRaw)
    console.log(descriptionRaw)

    // 同步更新两个 ref
    selectedMetrics.value.push(metricRaw);
    console.log(selectedMetrics)
    metricsList.value.push({
      name: metricRaw,
      description: descriptionRaw
    });
    console.log(metricsList)
  }
}


onMounted(async () => {
  const res = await getPromptTaskById(id)
  console.log(res)
  custom_metrics.value = res.custom_metrics;
  name.value = res.name
  description.value = res.description
  selectedMetrics.value = res.metrics;
  const res1 = await getAllMetrics();
  metricsList.value = Object.entries(res1.result).map(([name, description]) => ({
    name,
    description
  }));
  console.log(selectedMetrics, metricsList)
  parseAndStoreMetrics(custom_metrics.value)
  const evaluations = res?.evaluations || [];
  historyResults.value = evaluations.map((evaluation: any) => ({
    timestamp: new Date(evaluation.created_at).getTime(), // 转换为时间戳
    scores: { ...evaluation.scores } // 创建新对象避免引用问题
  }));
  if (evaluations.length > 0) {
    evaluations.forEach((evaluation: any) => {
     historyPrompts.value.push(evaluation.prompt.trim())
    });
    console.log(historyPrompts
    )
    const lastEvaluation = evaluations[evaluations.length - 1];
    console.log(lastEvaluation)
    latestScore.value = { ...lastEvaluation.scores };
    promptText.value = lastEvaluation.prompt;
    drawHistory.value = true;
    console.log(historyResults, latestScore)

    renderBarChart();
    renderLineChart();
  }
})

async function startEvaluation() {
  try {
    isEvaluating.value = true;
    evaluationResult.value = null;

    // 清空显示内容
    displayedOriginal.value = '';
    displayedOptimized.value = '';
    displayedExplanation.value = '';

    const res = await promptOptimization(
        id,
        promptText.value,
        expectedText.value
    );
    console.log(res)

    evaluationResult.value = res;
    // 启动打字效果
    typeWriter(displayedOriginal, res.result.optimization.original_prompt);
    typeWriter(displayedOptimized, res.result.optimization.optimized_prompt);
    typeWriter(displayedExplanation, res.result.optimization.optimization_explanation);

    historyResults.value.push({
      timestamp: Date.now(),
      scores: res.result.evaluation.scores
    });

    console.log(historyResults.value)

    // 等待DOM更新完成
    await nextTick();
    await nextTick();

    // 同时渲染两个图表
    renderBarChart();
    renderLineChart();
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
  // 切换时只需要更新图表尺寸
  nextTick(() => {
    if (chartType.value === 'bar' && barChartInstance) {
      barChartInstance.resize();
    } else if (lineChartInstance) {
      lineChartInstance.resize();
    }
  });
}

// 绘制图表函数
// 修改后的renderChart函数
// 重构后的图表渲染
// 拆分渲染函数
function renderBarChart(retryCount = 0) {
  if (!barChartDom.value) {
    if (retryCount < 5) {
      setTimeout(() => renderBarChart(retryCount + 1), 100);
      return;
    }
    console.error('柱状图容器未找到');
    return;
  }

  // 清理旧实例
  let instance = echarts.getInstanceByDom(barChartDom.value);
  if (instance) instance.dispose();

  instance = echarts.init(barChartDom.value);
  instance.setOption(getBarOption());
  barChartInstance = instance;

  // 响应式处理
  const resizeHandler = () => instance.resize();
  window.addEventListener('resize', resizeHandler);

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    instance?.dispose();
  });
}

function renderLineChart(retryCount = 0) {
  if (!lineChartDom.value) {
    if (retryCount < 5) {
      setTimeout(() => renderLineChart(retryCount + 1), 100);
      return;
    }
    console.error('折线图容器未找到');
    return;
  }

  // 清理旧实例
  let instance = echarts.getInstanceByDom(lineChartDom.value);
  if (instance) instance.dispose();

  instance = echarts.init(lineChartDom.value);
  instance.setOption(getLineOption());
  lineChartInstance = instance;

  // 响应式处理
  const resizeHandler = () => instance.resize();
  window.addEventListener('resize', resizeHandler);

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    instance?.dispose();
  });
}

// 柱状图配置
function getBarOption() {
  let metrics: string[] = [];
  let scores: number[] = [];

  if (!drawHistory.value) {
    metrics = Object.keys(evaluationResult.value.result.evaluation.scores);
    scores = metrics.map(metric => evaluationResult.value.result.evaluation.scores[metric]);
  } else {
    const rawLatestScore = JSON.parse(JSON.stringify(latestScore.value));
    metrics = Object.keys(rawLatestScore);
    scores = metrics.map(metric => rawLatestScore[metric]);
    drawHistory.value = false;
  }
  console.log("here", metrics, scores)
  return {
    title: {
      text: '', // 图表标题
      left: 'center',          // 居中对齐
      top: 10,                 // 距离容器顶部的距离
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'          // 可以根据主题改颜色
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].name}<br/>得分：${(params[0].value * 100).toFixed(1)}%`
    },
    xAxis: {
      type: 'category',
      data: selectedMetrics.value,
    },
    grid: {
      top: 60,     // 给上面的 title 腾出空间（默认是 10 左右）
      bottom: 40,  // 控制下边距（你也可以调大一点）
      left: 40,
      right: 20
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
      data: scores,
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
  const metrics = Object.keys(historyResults.value[0]?.scores || {});
  const xAxisData = historyResults.value.map((_, index) => `第${index + 1}次`);
  const seriesData = metrics.map(metric => ({
    name: metric,
    type: 'line',
    showSymbol: true,
    data: historyResults.value.map(result => result.scores[metric])
  }));

  return {
    title: {
      text: '', // 图表标题
      left: 'center',          // 居中对齐
      top: 0,                 // 距离容器顶部的距离
      bottom: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'          // 可以根据主题改颜色
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return params.map(p => `${p.seriesName}<br/>${p.marker} ${(p.value * 100).toFixed(1)}%`).join('<br/>');
      }
    },
    grid: {
      top: 30,     // 给上面的 title 腾出空间（默认是 10 左右）
      bottom: 60,  // 控制下边距（你也可以调大一点）
      left: 40,
      right: 20
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { show: false }    // 不显示文字标签
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
/* 右侧优化区域样式 */
.optimize-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.prompt-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.explain-card {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
}

.card-content {
  height: calc(100% - 40px);
  overflow-y: auto;
  line-height: 1.6;
  color: #333;
}

/* 打字效果 */
.typing-effect {
  border-right: 2px solid #3498db;
  white-space: pre-wrap;
  animation: blinkCaret 0.75s step-end infinite;
}

@keyframes blinkCaret {
  from, to { border-color: transparent }
  50% { border-color: #3498db; }
}

/* 加载状态 */
.optimize-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.switch-icon {
  color: #00f5ff;
  transition: transform 0.4s ease, color 0.4s ease;
  font-size: 20px;
}

.switch-icon:hover {
  transform: rotate(180deg) scale(1.1);
  color: #00d0ff;
  text-shadow: 0 0 8px #00f5ff;
  cursor: pointer;
}

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
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 让内容靠上 */
  gap: 8px; /* 控制按钮和图表之间的间距 */
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
.chart-switch {
  display: flex;
  justify-content: center; /* 居中对齐 */
  margin-bottom: -10px; /* 和图表间距 */
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 10px; /* 图标和文字之间的间距 */
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
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
