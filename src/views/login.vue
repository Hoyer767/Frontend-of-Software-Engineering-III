<script setup lang="ts">
import  { ref,reactive} from 'vue'
import { User, Lock, View, Hide} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {userLogin} from "@/api/user";
import router from "../router/index";
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名必须包含最少3个字符', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码必须包含最少6个字符', trigger: 'change' }
  ]
})


function handleSubmit () {
  userLogin(form.username, form.password).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "登录成功",
        type: 'success',
        center: true,
      });
      sessionStorage.setItem("username", res.data.result.username)
      router.push({path: "/home"});
    }else {
      ElMessage({
        message: "用户名或密码错误",
        type: 'error',
        center: true,
      });
    }
  }).catch(err => {
    ElMessage({
      message: "登录请求失败，请稍后重试",
      type: 'error',
      center: true,
    });
  })
}


</script>

<template>
  <div class="login-container">
    <el-card class="login-wrapper">
      <!-- Logo -->
      <div class="logo">
        <img  style="width: 35%;height: 35%" src="../assets/logo.svg" alt="AI-BOT"/>
      </div>

      <!-- Title -->
      <h1 class="title">欢迎来到
        <span
            style="font-size:xx-large;
              background: linear-gradient(to right, rgba(255, 167, 223, 1), rgba(62, 201, 255, 1));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-family:'Vladimir Script',serif ">AI-BOT~~
        </span>
      </h1>

      <!-- Form -->
      <el-form
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent
      >
        <!-- Email Field -->
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


        <!-- Login Button -->
        <el-button
            type="primary"

            round
            size="large"
            class="submit-btn"
            @click="handleSubmit"
        >
          <span >登录</span>
        </el-button>

        <!-- Sign Up Link -->
        <div class="msg">
          还没有账户?
          <a href="/register">立即注册</a>
        </div>
      </el-form>
    </el-card>
  </div>
</template>


<style scoped>
.login-container {
  height: 100%;
  background-image: linear-gradient(to right, rgba(255, 167, 223, 0.62), rgba(62, 201, 255, 0.55));
}
.login-wrapper {
  background-color: #fff;
  width: 450px;
  height: 700px;
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