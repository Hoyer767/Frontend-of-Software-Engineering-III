<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { User, Lock, View, Hide} from '@element-plus/icons-vue'
import {ElMessage,FormRules} from 'element-plus'
import {userRegister} from "@/api/user";
import router from "../router/index";

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const hasMinLength = computed(() => form.password.length >= 6)
const hasUserLength = computed(() => form.username.length >= 3)
const hasConfirmPassword = computed(() => form.confirmPassword === form.password)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!hasUserLength.value) {
    callback(new Error('用户名必须包含最少3个字符'))
  } else {
    callback()
  }
}
// Custom validator for password
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!hasMinLength.value) {
    callback(new Error('密码必须包含最少6个字符'))
  } else {
    callback()
  }
}

// Custom validator for password confirmation
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!hasConfirmPassword.value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { validator:validateUsername, trigger:'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { validator: validatePassword, trigger: 'change' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'change' },
    { validator: validateConfirmPassword, trigger: 'change' }
  ]
})



function handleSubmit () {
  console.log('UserLogin')
  userRegister(form.username.value,form.password.value).then(res => {
    console.log(res)
    ElMessage({
      message: '登录成功',
      type: 'success',
      duration: 2000
    })
  }).catch(error => {
    console.log(error)
    router.push('/home')
    ElMessage({
      message: '登录失败',
      type: 'error',
      duration: 2000
    })
  })
}
</script>


<template>
  <div class="register-container">
    <el-card class="register-box">
      <!-- Logo -->
      <div class="logo">
        <img  style="width: 35%;height: 35%" src="../assets/logo.svg"  alt="AI-BOT"/>
      </div>

      <!-- Title -->
      <h1 class="title">注册账号</h1>

      <!-- Form -->
      <el-form
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent
      >

        <!-- Username Field -->
        <el-form-item prop="username" label="用户名">
          <el-input
              v-model="form.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
              size="large"
          />
        </el-form-item>

        <!-- Password Field -->
        <el-form-item prop="password" label="密码">
          <el-input
              v-model="form.password"
              :prefix-icon="Lock"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              size="large"
          >
            <template #suffix>
              <el-icon class="cursor-pointer" @click="showPassword = !showPassword">
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>

        </el-form-item>

        <!-- Confirm Password Field -->
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input
              v-model="form.confirmPassword"
              :prefix-icon="Lock"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请确认密码"
              size="large"
          >
            <template #suffix>
              <el-icon class="cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                <View v-if="showConfirmPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>



        <!-- Register Button -->
        <el-button
            type="primary"
            round
            size="large"
            class="submit-btn"
            @click="handleSubmit"
            :disabled="!(hasMinLength&&hasConfirmPassword&&hasUserLength)"
        >
          <span>注册</span>
        </el-button>

        <div class="msg">
          已有账号?
          <a href="/login">立即登录</a>
        </div>
      </el-form>
    </el-card>
  </div>
</template>


<style scoped>
.register-container {
  height: 100%;
  background-image: linear-gradient(to right, rgba(255, 167, 223, 0.62), rgba(62, 201, 255, 0.55));
}

.register-box {
  background-color: #fff;
  width: 450px;
  height:fit-content;
  border-radius: 15px;
  padding: 50px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.logo {
  text-align: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.875rem;
  font-weight: 600;
  text-align: center;
  color: rgba(0, 183, 255, 0.44);
  margin-bottom: 2rem;
}

.submit-btn {
  width: 100%;
  margin-top: 1rem;
}
.msg {
  text-align: center;
  line-height: 88px;
}
a {
  text-decoration-line: none;
  color: #409eff;
}

.cursor-pointer {
  cursor: pointer;
}

</style>