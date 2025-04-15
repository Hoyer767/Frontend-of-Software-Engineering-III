import axios from 'axios'
import {API_MODULE} from "@/api/_prifix.js";

export const userLogin = async (username, password) => {
    return axios.post(`${API_MODULE}/login`, { username: username, password: password },)
        .then(res => {
            console.log(res);
            return res;
        });
};