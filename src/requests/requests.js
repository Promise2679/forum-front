import axios from "axios"
import userStore from "@/stores/userStore"

axios.interceptors.request.use(config => {
    const token = userStore().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

export default axios
