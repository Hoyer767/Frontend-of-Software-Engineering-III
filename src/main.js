import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from "@/router/index.js";
import ElementPlus from 'element-plus'

// 设置全局axios默认值
axios.defaults.baseURL = 'http://127.0.0.1:8080'

const app = createApp(App)

app.config.globalProperties.$axios = axios

app.use(router)
    .use(ElementPlus)
    .mount('#app')