import axios from 'axios'
import {RAG_MODULE} from "@/api/_prifix.js";

export const getUserRagTasks = async () => {
    try {
        const res = await axios.get(`${RAG_MODULE}/tasks`);
        return res.data;
    } catch (err) {
        console.error('获取任务失败', err);
        throw err;
    }
};

export const createRagTasks = async (name, des) => {
    try {
        const res = await axios.post(`${RAG_MODULE}/tasks/create`, {
            name,
            description: des,
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
        return res.data
    } catch (err) {
        console.error('获取任务失败', err)
        throw err
    }
}

export const deleteRagTaskById = async (id) => {
    try {
        const response = await axios.delete(`${RAG_MODULE}/tasks/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data
    } catch (error) {
        console.error('删除任务失败', error)
        throw error
    }
}