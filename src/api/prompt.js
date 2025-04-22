import axios from 'axios'
import {PROMPT_MODULE, RAG_MODULE} from "@/api/_prifix.js";

export const getUserPromptTasks = async () => {
    try {
        const res = await axios.get(`${PROMPT_MODULE}/tasks`);
        return res.data;
    } catch (err) {
        console.error('获取任务失败', err);
        throw err;
    }
};

export const getAllMetrics = async () => {
    try {
        const res = await axios.get(`${PROMPT_MODULE}/metrics`);
        return res.data;
    } catch (err) {
        console.error('获取任务失败', err);
        throw err;
    }
};

export const createPromptTasks = async (name, des, metrics) => {
    try {
        console.log(name,des, metrics);
        const res = await axios.post(`${PROMPT_MODULE}/tasks/create`, {
            name,
            description: des,
            metrics,
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(res)
        return res.data
    } catch (err) {
        console.error('获取任务失败', err)
        throw err
    }
}

export const deletePromptTaskById = async (id) => {
    try {
        const response = await axios.delete(`${PROMPT_MODULE}/tasks/${id}/delete`, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(response)
        return response.data
    } catch (error) {
        console.error('删除任务失败', error)
        throw error
    }
}

export const getPromptTaskById = async (id) => {
    try {
        const response = await axios.get(`${PROMPT_MODULE}/tasks/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(response)
        return response.data.result
    } catch (error) {
        console.error('获取任务详情失败', error)
        throw error
    }
}

export const evaluatePromptTask = async (id, prompt, expected) => {
    try {
        const res = await axios.post(`${PROMPT_MODULE}/tasks/${id}/evaluation`, {
            prompt,
            expected,
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log('评估结果：', res)
        return res.data
    } catch (err) {
        console.error('评估任务失败', err)
        throw err
    }
}


