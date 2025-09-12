<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/requests/requests'
import debounce from '@/utils/debounce'

const router = useRouter()
const username = ref("")
const name = ref("")
const password = ref("")
const userType = ref(null)

const reg = debounce(() => {
    const data = {
        "username": username.value,
        "name": name.value,
        "password": password.value,
        "user_type": Number(userType.value),
    }
    axios.post("/api/user/reg", data).then(res => {
        if (res.data.code === 200) {
            ElMessage({ message: "注册成功", type: "success", duration: 1500 })
            router.push({ name: 'login' })
        } else {
            ElMessage({ message: `注册失败：${res.data.msg}`, type: "error", duration: 1500 })
        }
    }).catch(err => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}, 150)
</script>

<template>
<div class="reg">
    <div class="title">
        <h1>论坛</h1>
    </div>
    <div class="input">
        <el-input v-model="username" prefix-icon="User" placeholder="请输入用户名"></el-input>
    </div>
    <div class="input">
        <el-input v-model="name" prefix-icon="User" placeholder="请输入姓名"></el-input>
    </div>
    <div class="input">
        <el-input v-model="password" prefix-icon="Lock" placeholder="请输入密码" auto-complete="new-password"
            show-password></el-input>
    </div>
    <div class="input">
        <el-radio-group v-model="userType">
            <el-radio value="1">学生</el-radio>
            <el-radio value="2">管理员</el-radio>
        </el-radio-group>
    </div>
    <div class="input">
        <el-button @click="reg" style="width: 500px;" type="primary"
            :disabled="username.length === 0 || name.length === 0 || password.length === 0 || userType.value">注册</el-button>
    </div>
</div>
</template>

<style scoped>
.reg {
    background-image: url('/bg.png');
    height: 100%;
    width: 100%;
    background-size: contain;
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
