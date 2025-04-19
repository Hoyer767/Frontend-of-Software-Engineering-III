<script setup>
import TaskItem from "@/component/TaskItem.vue";
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/store/taskStore'

const store = useTaskStore()
const { getTasks } = storeToRefs(store)

</script>

<template>
  <div class="task-container">
    <TaskItem
        v-for="item in getTasks"
        :key="item.id"
        :name="item.name"
        :type="item.type"
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