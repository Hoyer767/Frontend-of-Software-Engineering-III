import axios from 'axios'
import {USER_MODULE} from "@/api/_prifix.js";



export const userLogin = async ()=>
{
    return axios.post(`${USER_MODULE}/login`)
        .then(res=>{
            console.log(res)
            return res;
        })
}
