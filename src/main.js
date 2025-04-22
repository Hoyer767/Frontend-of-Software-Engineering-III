import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from "@/router/index.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as IconPark from '@icon-park/vue-next';
import { createPinia } from 'pinia'


// 设置全局axios默认值
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true;

const app = createApp(App)

app.use(router)
    .use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

for (const [key, component] of Object.entries(IconPark)) {
    app.component(key, component);
}

app.use(createPinia())

app.mount('#app')
