<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import { Plus as PlusIcon } from '@icon-park/vue-next'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/store/taskStore'
import { useRoute } from 'vue-router'
import TaskCreation from "@/component/TaskCreation.vue";
import {createRagTasks} from "@/api/rag";
import {ElMessage} from "element-plus";
import {getAllMetrics, createPromptTasks, getUserPromptTasks} from "@/api/prompt";


const info = reactive({
  type: 'Rag',
  name: '',
  description: '',
  metrics: [],
  prompt: ''
})

const formRef = ref()

const handleSubmit = async () => {
  if (info.type === 'Rag') {
    try {
      await createRagTasks(info.name, info.description)
      ElMessage.success("创建 Rag 任务成功！")
      showForm.value = false
      await fetchTasks()
      tasks.value = getTasks.value
    } catch (error) {
      ElMessage.error('创建 Rag 任务失败')
    }

  }else{
    try {
      // 调用Prompt任务创建API，这里需要根据实际API调整
      await createPromptTasks(info.name, info.description, selectedMetrics.value)
      selectedMetrics.value = [];
      ElMessage.success("创建 Prompt 任务成功！")
      showForm.value = false
      await fetchTasks()
      tasks.value = getTasks.value
    } catch (error) {
      ElMessage.error('创建 Prompt 任务失败')
    }
  }
}
const handleReset = () => {
  info.type = 'Rag'
  info.name = ''
  info.description = ''
  info.metrics = []
}

const route = useRoute()
const isFilterActive = computed(() => route.name === 'Filter')
const store = useTaskStore()
const { fetchTasks } = store
const { getTasks } = storeToRefs(store)
const tasks = ref([])
const showFilterMenu = ref(false)
let closeTimer = null
const showForm = ref(false)
const metricsList = ref<string[]>([])
const selectedMetrics = ref<number[]>([])


const toggleForm = () => {
  handleReset()
  showForm.value = !showForm.value
}

const cancelClose = () => {
  clearTimeout(closeTimer)
}

const closeWithDelay = () => {
  closeTimer = setTimeout(() => {
    showFilterMenu.value = false
  }, 300) // 300ms 延迟
}

onMounted(async () => {
  const res = await getAllMetrics();
  metricsList.value = res.result;
  await fetchTasks()
  tasks.value = getTasks.value
});
</script>

<template>
  <div class="page-container">
    <!-- 顶部菜单栏 -->
    <div class="menu-bar">
      <div class="left-menu">
        <router-link class="menu-item" :to="{ name: 'All' }" active-class="active">全部</router-link>
        <div class="filter-container" @mouseleave="closeWithDelay">
          <button
              class="menu-item"
              @mouseenter="showFilterMenu = true"
              :class="{ active: isFilterActive }"
          >
            筛选
          </button>
          <div
              v-show="showFilterMenu"
              class="filter-dropdown"
              @mouseenter="cancelClose"
              @mouseleave="closeWithDelay"
          >
            <router-link
                class="filter-menu-item"
                :to="{ name: 'Filter', params: { level: 1 } }"
                active-class="filter-menu-item-active"
            >
              Rag评估
            </router-link>
            <router-link
                class="filter-menu-item"
                :to="{ name: 'Filter', params: { level: 2 } }"
                active-class="filter-menu-item-active"
            >
              Prompt评估
            </router-link>
            <router-link
                class="filter-menu-item"
                :to="{ name: 'Filter', params: { level: 3 } }"
                active-class="filter-menu-item-active"
            >
              正在进行中
            </router-link>
            <router-link
                class="filter-menu-item"
                :to="{ name: 'Filter', params: { level: 4 } }"
                active-class="filter-menu-item-active"
            >
              已完成
            </router-link>
            <router-link
                class="filter-menu-item"
                :to="{ name: 'Filter', params: { level: 5 } }"
                active-class="filter-menu-item-active"
            >
              失败
            </router-link>
          </div>
        </div>
      </div>
      <button class="add-button" @click="toggleForm">
        <PlusIcon theme="filled" size="20" fill="#333"/>
      </button>
      <el-dialog
          v-model="showForm"
          title="任务创建"
          width="500"
      >
        <div class="form-container" style="max-width: 600px; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
          <div class="form-row" style="margin-bottom: 20px;">
            <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">评估类型</label>
            <el-radio-group v-model="info.type">
              <el-radio label="Rag" style="margin-right: 15px;">Rag评估</el-radio>
              <el-radio label="Prompt">Prompt评估</el-radio>
            </el-radio-group>
          </div>

          <template v-if="info.type === 'Rag'">
            <div class="form-row" style="margin-bottom: 20px;">
              <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">任务名称</label>
              <el-input
                  v-model="info.name"
                  placeholder="请输入任务名称"
                  style="width: 100%;"
              ></el-input>
            </div>

            <div class="form-row" style="margin-bottom: 20px;">
              <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">任务描述</label>
              <el-input
                  type="textarea"
                  v-model="info.description"
                  :rows="4"
                  placeholder="请输入任务描述"
                  style="width: 100%;"
              ></el-input>
            </div>
          </template>

          <template v-else>
            <div class="form-row" style="margin-bottom: 20px;">
              <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">任务名称</label>
              <el-input
                  v-model="info.name"
                  placeholder="请输入任务名称"
                  style="width: 100%;"
              ></el-input>
            </div>

            <div class="form-row" style="margin-bottom: 20px;">
              <label class="form-label" style="margin-bottom: 20px;">选择待评估的 Prompt 指标</label>
              <el-select v-model="selectedMetrics" multiple placeholder="请选择指标" style="width: 100%; margin-top: 10px ; margin-bottom: -5px">
                <el-option
                    v-for="(metric, index) in metricsList"
                    :key="index"
                    :label="metric"
                    :value="index"
                />
              </el-select>
            </div>

            <div class="form-row" style="margin-bottom: 20px;">
              <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">任务描述</label>
              <el-input
                  type="textarea"
                  v-model="info.description"
                  :rows="4"
                  placeholder="请输入任务描述"
                  style="width: 100%;"
              ></el-input>
            </div>
          </template>

          <!-- Action Buttons -->
          <div class="form-row" style="margin-top: 30px; display: flex; justify-content: flex-end;">
            <el-button @click="handleReset" style="margin-right: 12px;">重置</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <main class="content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr)); /* 最小列宽 */
  gap: 12px 16px;
}

.metric-item {
  margin-right: 0;
  display: flex;
  align-items: center;
  height: 32px;
}

.metric-text {
  font-family: "Microsoft YaHei", sans-serif; /* 指定中文字体 */
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.page-container {
  padding: 20px;
}

.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.left-menu {
  display: flex;
  gap: 15px;
}

.menu-item {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.filter-container {
  position: relative;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 150px;
}

.filter-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
}

.filter-option:hover {
  background-color: #f5f5f5;
}

.add-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.add-button:hover {
  background-color: #f5f5f5;
}

.active {
  background: #d0ebff;
  font-weight: bold;
}

.filter-dropdown {
  /* 确保下拉菜单有固定宽度 */
  min-width: 180px; /* 可根据需要调整 */
  padding: 8px 0; /* 上下内边距 */
}

.filter-menu-item {
  display: block; /* 使链接占据整行 */
  width: 100%; /* 与父元素同宽 */
  padding: 8px 16px; /* 内边距 */
  margin: 2px 0; /* 上下间距 */
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.filter-menu-item:hover {
  background-color: #f5f5f5;
}

.filter-menu-item-active {
  background-color: #e6f7ff; /* 激活状态浅蓝色背景 */
  color: #1890ff; /* 激活状态蓝色文字 */
  font-weight: 500;
}

/* 移除默认的 <br> 间距 */
.filter-dropdown br {
  display: none;
}

.form-container {
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
}

.form-label {
  color: black;
}
</style>

