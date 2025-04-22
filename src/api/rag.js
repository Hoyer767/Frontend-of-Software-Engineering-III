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

export const getRagTaskById = async (id) => {
    try {
        const response = await axios.get(`${RAG_MODULE}/tasks/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data.result
    } catch (error) {
        console.error('获取任务详情失败', error)
        throw error
    }
}

export const getRagTaskDetailsById = async (id) => {
    try {
        const response = await axios.get(`${RAG_MODULE}/tasks/${id}/evaluations`, {
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data.result
    } catch (error) {
        console.error('获取任务评估详情失败', error)
        throw error
    }
}

export const uploadEvaluation = async (name, file, id) => {
    try {
        const formData = new FormData();
        // 确保 data.file 是有效的 File 对象
        formData.append('file', file);  // 字段名必须和后端一致（这里是 'file'）
        formData.append('name', name);
        // console.log(data.file, formData.file);
        // ✅ 不要手动设置 Content-Type！
        const response = await axios.post(
            `${RAG_MODULE}/tasks/${id}/evaluate`,
            formData  // 直接传递 FormData 对象
        );
        return response.data;
    } catch (error) {
        console.error('上传失败', error);
        throw error;
    }
};

