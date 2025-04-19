<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  eva: {type: Array, required: true} // 必须传入评估数据
});

const chartContainer = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;
  chartInstance = echarts.init(chartContainer.value);
  updateChart();
  window.addEventListener('resize', handleResize);
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance || !props.eva?.length) return;

  const dimensions = ['answer_relevancy', 'context_precision', 'context_recall', 'faithfulness'];
  const seriesData = dimensions.map(dim => ({
    name: formatLabel(dim),
    type: 'line',
    data: props.eva.map(item => item.scores?.[dim] ?? 0), // 处理可能的undefined
    smooth: false,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: {width: 3}
  }));

  const option = {
    title: {text: '评估维度趋势分析'},
    tooltip: {trigger: 'axis'},
    legend: {
      data: dimensions.map(formatLabel),
      bottom: 0
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.eva.map((_, i) => `评估${i + 1}`),
      axisLabel: {
        interval: 0,
        color: '#333', // X轴文字颜色改为深灰色
        fontSize: 12,
        fontWeight: 'bold'
      },
      axisLine: {
        lineStyle: {
          color: '#666' // X轴线颜色
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: {
        formatter: (value) => value,
        color: '#333', // Y轴刻度文字颜色
        fontSize: 12,
        fontWeight: 'bold'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#666' // Y轴线颜色
        }
      },
    },
    series: seriesData,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] // 自定义颜色
  };

  chartInstance.setOption(option, {notMerge: true});
};

// 格式化维度标签
const formatLabel = (dim) => {
  const map = {
    answer_relevancy: '答案相关性',
    context_precision: '上下文精确度',
    context_recall: '上下文召回率',
    faithfulness: '忠实度'
  };
  return map[dim] || dim;
};

// 窗口缩放时重绘图表
const handleResize = () => {
  chartInstance?.resize();
};

// 生命周期
onMounted(initChart);
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

// 监听eva数据变化
watch(() => props.eva, (newVal) => {
  if (newVal?.length) {
    if (!chartInstance) {
      initChart();
    } else {
      updateChart();
    }
  }
}, {deep: true});
</script>