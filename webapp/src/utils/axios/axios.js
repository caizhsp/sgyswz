// 引入axios
import axios from "axios"

// 创建实例
const http = axios.create({
    baseURL: "/api"
})

// 导出实例
export default http