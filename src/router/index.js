import { createRouter, createWebHistory } from 'vue-router'
import user from '@/views/user.vue'
import home from '@/views/home.vue'
const routes = [
    {
        path: '/',
        component: user
    },
    {
        path: '/home',
        component: home
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router