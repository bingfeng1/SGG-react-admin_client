/**
 * 配置axios
 */
import axios from 'axios'
import { message } from 'antd';


// axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.response.use(response=>{
    return response;
},err=>{
    return message.error(`出现错误：${err}`)
})

export default axios


