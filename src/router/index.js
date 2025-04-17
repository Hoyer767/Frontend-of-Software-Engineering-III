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
                redirect: 'evaluation/TaskList'
            },
            {
                path: 'TaskList',
                name: 'TaskList',
                component: () => import('@/views/evaluation/TaskList.vue'),
                children: [
                    {
                        path: '',
                        redirect: 'evaluation/TaskList/All'
                    },
                    {
                        path: 'All',
                        name: 'All',
                        component: () => import('@/views/evaluation/AllTasks.vue')
                    },
                    {
                        path: 'Filter/:level', // 添加动态参数 :level
                        name: 'Filter',
                        props: true,
                        component: () => import('@/views/evaluation/filter.vue')
                    }
                ]
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