<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {getRagTaskById, getRagTaskDetailsById, uploadEvaluation} from '@/api/rag.js'
import {ElMessage} from "element-plus";
import Line_chart from "@/component/Line_chart.vue";

const route = useRoute()

const name = ref('')
const description = ref('')
const eva = ref([])
const showDialog = ref(false);
const form = ref({
  evalName: '',
  jsonFile: null
})
const haveData = ref(false);

function evaluation() {
  showDialog.value = true
}

onMounted(async () => {
  const id = route.params.id
  const res = await getRagTaskById(id)
  name.value = res.task.name
  description.value = res.task.description
  eva.value = await getRagTaskDetailsById(id)
  if(eva.value.length > 0) {
    haveData.value = true
  }
})

function handleFileChange(uploadFile) {
  form.value.jsonFile = uploadFile.raw
}

async function submitEvaluation() {
  if (!form.value.evalName || !form.value.jsonFile) {
    ElMessage.error('请填写评估名称并上传JSON文件')
    return
  }

  try {
    // 创建FormData对象用于文件上传
    console.log(form.value.evalName, form.value.jsonFile)
    // 这里调用你的API上传数据
    ElMessage.success('评估提交成功')
    showDialog.value = false
    const response = await uploadEvaluation(form.value.evalName, form.value.jsonFile, route.params.id)
    eva.value = await getRagTaskDetailsById(route.params.id)
    form.value = { evalName: '', jsonFile: null }
  } catch (error) {
    ElMessage.error('评估提交失败: ' + error.message)
  }
}

watch(eva, (newVal)=>{
  console.log(newVal)
}, {immediate: true})
</script>


<template>
  <div class="task-detail">
    <img src="/images/work.jpg" class="task-image" />
    <div class="task-info">
      <div class="text-content">
        <h2 class="task-name">{{ name }}</h2>
        <p class="task-desc">{{ description }}</p>
      </div>
      <el-button class="button" type="primary" @click="evaluation" >进行评估</el-button>
    </div>
    <el-dialog
        v-model="showDialog"
        title="进行评估"
        width="35%"
    >
      <el-form :model="form" label-width="100px">
        <!-- 评估名称项 - 使用label属性 -->
        <el-form-item label="JSON文件" required>
          <el-input v-model="form.evalName" placeholder="请输入评估名称" />
        </el-form-item>

        <!-- JSON文件项 - 保持原有结构 -->
        <el-form-item label="JSON文件" required>
          <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileChange"
              accept=".json"
          >
            <el-button type="primary">点击上传</el-button>
            <div class="el-upload__tip">请上传JSON格式文件</div>
            <div v-if="form.jsonFile" class="file-name">
              已选择文件: {{ form.jsonFile.name }}
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitEvaluation">提交评估</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <line_chart :eva="eva"/>
</template>


<style scoped>
.task-detail {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
}

.task-image {
  width: 300px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 让文字在上，按钮在下 */
}

.text-content {
  .task-name {
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .task-desc {
    font-size: 30px;
    color: #666;
  }
}

.button {
  align-self: flex-start; /* 可选：按钮靠左 */
  margin-top:20px; /* 可选：按钮离内容一点距离 */
}

   /* 对话框整体样式 */
 :deep(.el-dialog) {
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 }

/* 标题样式 */
:deep(.el-dialog__title) {
  color: #333;
  font-weight: 600;
}

/* 表单标签样式 */
:deep(.el-form-item__label) {
  color: #555;
  font-weight: 500;
}

/* 上传按钮样式 */
:deep(.el-upload) {
  display: block;
}

/* 上传按钮交互效果 */
:deep(.el-button--primary) {
  transition: all 0.3s;
}
:deep(.el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 已选文件信息样式 */
.file-name {
  margin-top: 8px;
  padding: 6px 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #409eff;
  font-size: 13px;
  border-left: 3px solid #409eff;
}

/* 提示文字样式 */
.el-upload__tip {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
}

/* 底部按钮容器 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 取消按钮样式 */
:deep(.el-button:not(.el-button--primary)) {
  border-color: #dcdfe6;
}
:deep(.el-button:not(.el-button--primary):hover) {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.label-input-container {
  display: flex;
  align-items: center;
  gap: 12px; /* 调整文本和输入框之间的间距 */
}

.label-text {
  font-size: 14px;
  color: #606266;
  min-width: 80px; /* 固定标签宽度保持对齐 */
}

:deep(.el-form-item__label) {
  color: #555;
  font-weight: 500;
  text-align: right; /* 右对齐 */
  padding-right: 12px; /* 增加右边距 */
}

/* 统一输入区域宽度 */
:deep(.el-input),
:deep(.el-upload) {
  width: 100%;
}

/* 上传按钮对齐输入框 */
:deep(.el-upload .el-button) {
  width: 100%;
  text-align: left;
}

/* 文件信息对齐 */
.file-name {
  margin-top: 8px;
  text-align: left;
}
</style>
