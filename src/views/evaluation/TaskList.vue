<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus as PlusIcon } from '@icon-park/vue-next'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/store/taskStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFilterActive = computed(() => route.name === 'Filter')
const store = useTaskStore()
const { fetchTasks } = store
const { getTasks } = storeToRefs(store)
const tasks = ref([])
const showFilterMenu = ref(false)
let closeTimer = null

const cancelClose = () => {
  clearTimeout(closeTimer)
}

const closeWithDelay = () => {
  closeTimer = setTimeout(() => {
    showFilterMenu.value = false
  }, 300) // 300ms 延迟
}

onMounted(async () => {
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
      <button class="add-button">
        <PlusIcon theme="filled" size="20" fill="#333" />
      </button>
    </div>

    <main class="content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
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
</style>