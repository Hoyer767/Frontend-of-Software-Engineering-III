export interface Task {
    id: string | number
    name: string
    description: string
    type: 'Rag' | 'Prompt'
    status: 'processing' | 'completed' | 'failed'
}