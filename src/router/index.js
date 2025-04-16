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
    },
    {
        path: '/evaluation',
        name: 'Evaluation',
        component: () => import('@/views/evaluation/index.vue'),
        children: [
            {
                path: '',
                redirect: 'evaluation/allTasks' // 访问 /evaluation 时自动跳到 /evaluation/allTasks
            },
            {
                path: 'allTasks',
                name: 'AllTasks',
                component: () => import('@/views/evaluation/TaskList.vue')
            },
            {
                path: 'rag',
                name: 'RAG',
                component: () => import('@/views/evaluation/rag/index.vue')
            }
        ]
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router