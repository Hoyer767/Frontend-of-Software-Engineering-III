import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import home from '@/views/home.vue'
import register from '@/views/register.vue'
const routes = [
    {
        path: '/',
        redirect: "/Login"
    },
    {
        path: '/Login',
        component: Login,
    },
    {
        path: '/home',
        component: home
    },
    {
        path: '/register',
        component: register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router