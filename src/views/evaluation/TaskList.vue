<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {getUserRagTasks} from "@/api/rag.js";
import TaskItem from "@/component/TaskItem.vue";

const tasks = ref([])

onMounted(async () => {
  try {
    const res = await getUserRagTasks();
    // 给每个任务添加 type 字段
    tasks.value = res.result.map((item: any) => ({
      ...item,
      type: 'Rag',
    }));
    console.log(tasks.value);
  } catch (err) {
    console.error('获取任务失败:', err);
  }
});

</script>

<template>
  <div class="task-container">
    <TaskItem
        v-for="item in tasks"
        :name="item.name"
        :type="item.type"
    />
  </div>
</template>


<style scoped>
.task-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 一行 4 个 */
  gap: 8px;
  justify-items: center;
}
</style>
