<!--<script setup>-->
<!--import {reactive, ref} from 'vue'-->
<!--import {userLogin} from '@/api'-->
<!--import {useRouter} from "vue-router";-->
<!--import {ElMessage} from "element-plus";-->
<!--import { User, Lock, View, Hide} from '@element-plus/icons-vue'-->

<!--const router = useRouter()-->
<!--const showPassword = ref(false)-->

<!--const form = reactive({-->
<!--  username: '',-->
<!--  password: ''-->
<!--})-->

<!--const rules = reactive({-->
<!--  username: [-->
<!--    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },-->
<!--    { validator: (rule, value, callback) => {-->
<!--          // If the input doesn't include '@', it's considered a username-->
<!--          if (value.length < 3) {-->
<!--            callback(new Error('用户名必须包含最少3个字符'));-->
<!--          } else {-->
<!--            callback();-->
<!--          }-->
<!--      }, trigger: 'blur' }-->
<!--  ],-->
<!--  password: [-->
<!--    { required: true, message: '请输入密码', trigger: 'blur' },-->
<!--    { min: 6, message: '密码必须包含最少6个字符', trigger: 'blur' }-->
<!--  ]-->
<!--})-->


<!--function handleLogin() {-->
<!--  userLogin({-->
<!--    username: form.username,-->
<!--    password: form.password-->
<!--  }).then(res => {-->
<!--    ElMessage({-->
<!--      message: "登录成功",-->
<!--      type: 'success',-->
<!--      center: true,-->
<!--    });-->
<!--    router.push({path: "/home"});-->

<!--  }).catch(err => {-->
<!--    ElMessage({-->
<!--      message: "用户名或密码错误",-->
<!--      type: 'error',-->
<!--      center: true,-->
<!--    });-->
<!--  })-->


<!--}-->

<!--</script>-->
<!--<template>-->
<!--  <div class="login-container">-->
<!--    <el-card class="login-wrapper">-->
<!--      &lt;!&ndash; Logo &ndash;&gt;-->
<!--      <div class="logo">-->
<!--        <img  style="width: 35%;height: 35%" src="../assets/logo.svg" alt="RAG"/>-->
<!--      </div>-->

<!--      &lt;!&ndash; Title &ndash;&gt;-->
<!--      <h1 class="title">欢迎来到-->
<!--        <span-->
<!--            style="font-size:xxx-large;-->
<!--              background: linear-gradient(to right, rgba(255, 167, 223, 1), rgba(62, 201, 255, 1));-->
<!--              -webkit-background-clip: text;-->
<!--              -webkit-text-fill-color: transparent;-->
<!--              font-family:'Vladimir Script',serif ">RAG~~-->
<!--        </span>-->
<!--      </h1>-->

<!--      &lt;!&ndash; Form &ndash;&gt;-->
<!--      <el-form-->
<!--          :model="form"-->
<!--          :rules="rules"-->
<!--          label-position="top"-->
<!--          @submit.prevent-->
<!--      >-->
<!--        &lt;!&ndash; Email Field &ndash;&gt;-->
<!--        <el-form-item prop="email" label="用户名/邮箱">-->
<!--          <el-input-->
<!--              v-model="form.username"-->
<!--              :prefix-icon="User"-->
<!--              placeholder="请输入用户名/邮箱"-->
<!--              size="large"-->
<!--          />-->
<!--        </el-form-item>-->

<!--        &lt;!&ndash; Password Field &ndash;&gt;-->
<!--        <el-form-item prop="password" label="密码">-->
<!--          <el-input-->
<!--              v-model="form.password"-->
<!--              :prefix-icon="Lock"-->
<!--              :type="showPassword ? 'text' : 'password'"-->
<!--              placeholder="请输入密码"-->
<!--              size="large"-->
<!--          >-->
<!--            <template #suffix>-->
<!--              <el-icon class="cursor-pointer" @click="showPassword = !showPassword">-->
<!--                <View v-if="showPassword" />-->
<!--                <Hide v-else />-->
<!--              </el-icon>-->
<!--            </template>-->
<!--          </el-input>-->
<!--        </el-form-item>-->


<!--        &lt;!&ndash; Login Button &ndash;&gt;-->
<!--        <el-button-->
<!--            type="primary"-->

<!--            round-->
<!--            size="large"-->
<!--            class="submit-btn"-->
<!--            @click="handleLogin"-->
<!--        >-->
<!--          <span >登录</span>-->
<!--        </el-button>-->

<!--        &lt;!&ndash; Sign Up Link &ndash;&gt;-->
<!--        <div class="msg">-->
<!--          还没有账户?-->
<!--          <a href="/home">立即注册</a>-->
<!--        </div>-->
<!--      </el-form>-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->


<!--<style scoped>-->
<!--.login-container {-->
<!--  height: 100%;-->
<!--  background-image: linear-gradient(to right, rgba(255, 167, 223, 0.62), rgba(62, 201, 255, 0.55));-->
<!--}-->
<!--.login-wrapper {-->
<!--  background-color: #fff;-->
<!--  width: 450px;-->
<!--  height: 700px;-->
<!--  border-radius: 15px;-->
<!--  padding: 50px;-->
<!--  position: relative;-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--}-->

<!--.logo {-->
<!--  text-align: center;-->
<!--  margin-bottom: 1rem;-->
<!--}-->


<!--.title {-->
<!--  font-size: 1.875rem;-->
<!--  font-weight: 600;-->
<!--  text-align: center;-->
<!--  color: rgba(0, 183, 255, 0.44);-->
<!--  margin-bottom: 2rem;-->
<!--}-->
<!--.submit-btn {-->
<!--  width: 100%;-->
<!--  margin-top: 1rem;-->
<!--}-->
<!--.msg {-->
<!--  text-align: center;-->
<!--  line-height: 88px;-->
<!--}-->
<!--a {-->
<!--  text-decoration-line: none;-->
<!--  color: #409eff;-->
<!--}-->

<!--.cursor-pointer {-->
<!--  cursor: pointer;-->
<!--}-->
<!--</style>-->
<script setup>

</script>

<template>
  <div>
    <h1>USER</h1>
    <router-link to="/home">
      <el-button>主页</el-button>
    </router-link>
  </div>
</template>

<style scoped>
</style>