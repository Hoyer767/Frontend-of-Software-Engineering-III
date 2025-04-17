import { defineStore } from 'pinia'
import type { Task } from '@/types/task'
import { getUserRagTasks } from '@/api/rag'
import { getUserPromptTasks } from '@/api/prompt'

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [] as Task[], // 使用泛型确保类型安全
        loading: false
    }),
    actions: {
        async fetchTasks() {
            this.loading = true
            try {
                // 并行请求（更高效）
                const [ragRes, promptRes] = await Promise.all([
                    getUserRagTasks(),
                    getUserPromptTasks()
                ])

                this.tasks = [
                    ...ragRes.result.map(task => ({
                        ...task,
                        type: 'Rag',
                        status: 'completed'
                    })),
                    ...promptRes.result.map(task => ({
                        ...task,
                        type: 'Prompt',
                        status: 'completed'
                    }))
                ]
            } catch (error) {
                console.error('加载任务失败:', error)
            } finally {
                this.loading = false
            }
        },
        addTask(task: Task) {
            this.tasks.unshift(task)
        }
    },
    getters: {
        getTasks: state => state.tasks,
        processingTasks: (state) => state.tasks.filter(task => task.status === 'Processing'),
        completedTasks: (state) => state.tasks.filter(t => t.status === 'completed'),
        failedTasks: (state) => state.tasks.filter(t => t.status === 'failed'),
        RagTasks: (state) => state.tasks.filter(task => task.type === 'Rag'),
        PromptTasks: (state) => state.tasks.filter(task => task.type === 'Prompt'),
    }
})