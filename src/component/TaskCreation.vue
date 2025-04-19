<script setup lang="ts">
import { reactive, ref } from 'vue'
import {createRagTasks} from "@/api/rag";


// 表单数据
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
      const res = await createRagTasks(info.name, info.description)
      console.log('创建成功：', res)
    } catch (error) {
      console.error('创建 Rag 任务失败:', error)
    }
  }
}
const handleReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
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

    <!-- Prompt Evaluation Form (shown when 'Prompt' is selected) -->
    <template v-else>
      <div class="form-row" style="margin-bottom: 20px;">
        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 500;">Prompt内容</label>
        <el-input
            v-model="info.prompt"
            type="textarea"
            :rows="4"
            placeholder="请输入 Prompt 内容"
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
</template>

<style scoped>
.form-container {
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
}

.form-label {
  color: black;
}
</style>
