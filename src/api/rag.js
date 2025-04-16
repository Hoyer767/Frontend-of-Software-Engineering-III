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
