<script setup>
import userStore from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/requests/requests'
import debounce from '@/utils/debounce'

const store = userStore()
const router = useRouter()
const name = ref("")
const password = ref("")

// 登录
const login = debounce(() => {
    const data = {
        "username": name.value,
        "password": password.value,
    }

    axios.post("/api/user/login", data).then(res => {
        if (res.data.code === 200) {
            store.registUserInfo(res.data.data.user_id, res.data.data.user_type, res.data.data.token)
            ElMessage({ message: "登录成功", type: "success", duration: 1500 })
            router.push({ name: 'home' })
        } else {
            ElMessage({ message: `登录失败：${res.data.msg}`, type: "error", duration: 1500 })
            setTimeout(() => {
                name.value = ""
                password.value = ""
            }, 1500)
        }
    }).catch(err => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}, 150)

const toReg = debounce(() => router.push({ name: 'reg' }), 150)
</script>

<template>
<div class="login">
    <div class="title">
        <h1>论坛</h1>
    </div>
    <div class="input">
        <el-input v-model="name" prefix-icon="User" placeholder="请输入用户名"></el-input>
    </div>
    <div class="input">
        <el-input v-model="password" prefix-icon="Lock" placeholder="请输入密码" auto-complete="new-password"
            show-password></el-input>
    </div>
    <div class="input">
        <el-button @click="login" style="width: 500px;" type="primary"
            :disabled="name.length === 0 || password.length === 0">登录</el-button>
    </div>
    <div class="input">
        <el-button @click="toReg" style="width: 500px;" type="info">没有账号？前往注册</el-button>
    </div>
</div>
</template>

<style scoped>
.login {
    background-image: url('/public/bg.png');
    height: 100%;
    width: 100%;
    background-size: cover;
    position: absolute;
}

.title {
    text-align: center;
    color: azure;
    margin-top: 200px;
}

.input {
    margin: 20px auto;
    width: 500px;
}
</style>
