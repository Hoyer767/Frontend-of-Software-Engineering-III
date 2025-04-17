<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TaskItem from "@/component/TaskItem.vue";
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/store/taskStore'

const route = useRoute()
const store = useTaskStore()
const { processingTasks, completedTasks, failedTasks, RagTasks, PromptTasks, getTasks } = storeToRefs(store)

// 根据路由参数选择对应的任务列表
const filteredTasks = computed(() => {
  const level = route.params.level

  switch(level) {
    case '1': // Rag评估
      return RagTasks.value
    case '2': // Prompt评估
      return PromptTasks.value
    case '3': // 进行中
      return processingTasks.value
    case '4': // 已完成
      return completedTasks.value
    case '5': // 失败
      return failedTasks.value
    default:  // 默认返回全部
      return getTasks.value
  }
})
</script>

<template>
  <div class="task-container">
    <TaskItem
        v-for="item in filteredTasks"
        :key="item.id"
        :name="item.name"
        :type="item.type"
        :status="item.status"
        :id="item.id"
    />
  </div>
</template>

<style scoped>
.task-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  justify-items: center;
}
</style>