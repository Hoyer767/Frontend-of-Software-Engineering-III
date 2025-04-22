<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {Delete} from "@icon-park/vue-next";
import {ElMessage} from "element-plus";
import {useTaskStore} from "@/store/TaskStore";
import {deleteRagTaskById} from "@/api/rag"
import {deletePromptTaskById} from "@/api/prompt"
import router from "@/router/index.js";


const store = useTaskStore()
const { fetchTasks } = store

const props = defineProps<{
  name: string;
  type: string;
  id: string
}>();

const url = computed(() => {
  const randomNum = Math.floor(Math.random() * 7) + 1;
  return `/images/pic${randomNum}.jpg`;
});

const rotation = ref(0);

const del = async () => {
  if (props.type === 'Rag') {
    try {
      await deleteRagTaskById(props.id)
      ElMessage.success("删除 Rag 任务成功！")
      await fetchTasks()
    } catch (error) {
      ElMessage.error('删除 Rag 任务失败')
    }
  }else{
    try {
      await deletePromptTaskById(props.id)
      ElMessage.success("删除 Prompt 任务成功！")
      await fetchTasks()
    } catch (error) {
      ElMessage.error('删除 Prompt 任务失败')
    }
  }
}

function showDetails() {
  if (props.type === 'Rag') {
    router.push({name:'Rag', params: { id: props.id }})
  }
  if (props.type === 'Prompt') {
    router.push({name:'Prompt', params: { id: props.id }})
  }
}

onMounted(() => {
  rotation.value = Math.floor(Math.random() * 11) - 5;
});
</script>

<template>
  <div class="task-item">
    <el-card
        style="width: 300px; position: relative"
        shadow="hover"
        class="card"
        :style="{ transform: `rotate(${rotation}deg)` }"
        @click="showDetails"
    >
      <div class="status-tag" :class="`status-completed`">
        completed
      </div>
      <el-text class="title"> {{ props.name }} </el-text>
      <el-image
          :src="url"
          style="width: 100%"
          class="pic"
      />
      <el-text class="classification"> {{ props.type }}评估 </el-text>
      <delete theme="outline" size="20" class="delete" fill="#333" style="position: absolute; right: 20px; bottom: 20px;" @click.stop="del"/>
    </el-card>
  </div>
</template>

<style scoped>
.status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-processing { background: #2196F3; }
.status-completed { background: #4CAF50; }
.status-failed { background: #F44336; }

.card {
  border-radius: 10px;
  transition: transform 0.3s ease;
  transform-origin: center center;
}

.title {
  font-weight: bold;
  font-size: 25px;
}

.pic {
  border-radius: 10px;
}

.classification {
  font-size: 14px;
}

.delete {

}

</style>

