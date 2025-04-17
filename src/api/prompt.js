import axios from 'axios'
import {PROMPT_MODULE} from "@/api/_prifix.js";

export const getUserPromptTasks = async () => {
    try {
        const res = await axios.get(`${PROMPT_MODULE}/tasks`);
        return res.data;
    } catch (err) {
        console.error('获取任务失败', err);
        throw err;
    }
};
