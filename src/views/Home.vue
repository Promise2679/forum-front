<script setup>
import { onMounted, ref } from 'vue'
import userStore from '@/stores/userStore'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import axios from '@/requests/requests'
import debounce from '@/utils/debounce'

const store = userStore()
const router = useRouter()
const inputContent = ref('')
const isSend = ref(false)
const postList = ref([])

// 获取帖子内容
const getComments = () => {
    axios.get("/api/student/post").then((res) => {
        if (res.data.code === 200) {
            postList.value = res.data.data.post_list.reverse()
        } else {
            ElMessage({ message: `无法获取帖子内容:${res.data.msg}`, type: "error", duration: 1500 })
        }
    }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}

// 发送帖子
const sendComment = () => {
    isSend.value = true
    const data = {
        content: inputContent.value,
        user_id: store.userName,
    }

    axios.post("/api/student/post", data).then((res) => {
        isSend.value = false
        inputContent.value = ''
        if (res.data.code === 200) {
            ElNotification({ message: '发布成功！', type: 'success' })
            getComments()
        } else {
            ElNotification({ message: `发布失败：${res.data.msg}`, type: 'error' })
        }
    }).catch((err) => {
        isSend.value = false
        ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 })
    })
}

// 获取点赞数
const getLike = (id) => {
    const data = {
        params: {
            post_id: id,
            user_id: store.userName,
        }
    }

    axios.get("/api/student/likes", data).then((res) => {
        if (res.data.code === 200) {
            const index = postList.value.findIndex(item => item.id === id)
            postList.value[index].likes = res.data.data.likes
        } else {
            ElMessage({ message: `无法获取点赞数:${res.data.msg}`, type: "error", duration: 1500 })
        }
    }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}

// 点赞 / 取消点赞
const toggleLike = debounce((index) => {
    const data = {
        post_id: index,
        user_id: store.userName,
    }

    axios.post("/api/student/likes", data).then((res) => {
        if (res.data.code === 200) {
            getLike(index)
        } else {
            ElMessage({ message: `${res.data.msg}`, type: "error", duration: 1500 })
        }
    }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}, 150)

// 举报帖子
const sendReport = (index) => {
    ElMessageBox.prompt('请输入举报原因：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: '内容不能为空！',
    }).then(({ value }) => {
        const data = {
            user_id: store.userName,
            post_id: index,
            reason: value,
        }
        axios.post("/api/student/report-post", data).then((res) => {
            if (res.data.code === 200) {
                ElNotification({ message: '举报成功！', type: 'success' })
            } else {
                ElNotification({ message: `举报失败：${res.data.msg}`, type: 'error' })
            }
        }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
    })
}

// 删除帖子
const deletePost = (index) => {
    ElMessageBox.confirm('确定要删除吗？该内容将不会再恢复！', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const data = {
            params: {
                user_id: store.userName,
                post_id: index,
            }
        }

        axios.delete("/api/student/post", data).then((res) => {
            if (res.data.code === 200) {
                ElNotification({ message: '删除成功！', type: 'success' })
                getComments()
            } else {
                ElNotification({ message: `删除失败：${res.data.msg}`, type: 'error' })
            }
        }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
    })
}

// 修改帖子
const editPost = (id) => {
    const index = postList.value.findIndex(item => item.id === id)
    ElMessageBox.prompt('请编辑要修改的部分：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: postList.value[index].content,
        inputType: 'textarea',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: '内容不能为空！',
    }).then(({ value }) => {
        if (postList.value[index].content === value) {
            return
        }
        const data = {
            user_id: store.userName,
            post_id: id,
            content: value,
        }

        axios.put("/api/student/post", data).then((res) => {
            if (res.data.code === 200) {
                ElNotification({ message: '修改成功！', type: 'success' })
                getComments()
            } else {
                ElNotification({ message: `修改失败：${res.data.msg}`, type: 'error' })
            }
        }).catch((err) => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
    })
}

const toReportCenter = debounce(() => router.push({ name: 'report' }), 150)
const logout = debounce(() => {
    store.clearUserInfo()
    ElMessage({ message: '注销成功', type: 'success', duration: 1500 })
    router.push({ name: 'login' })
}, 150)

onMounted(() => {
    getComments()
    // setInterval(() => postList.value.forEach(item => getLike(item.id)), 1000)
})
</script>

<template>
<div class="container">
    <div class="top">
        <h2>论坛</h2>
        <div>
            <el-button @click="toReportCenter">举报中心</el-button>
            <el-button @click="logout" type="danger">注销</el-button>
        </div>
    </div>

    <div class="comments">
        <div v-for="item in postList" :key="item.id" class="comment">
            <div class="user">
                <el-avatar :icon="UserFilled" />
                <span style="word-break: break-all">{{ item.user_id }}</span>
            </div>
            <span style="word-break: break-all">{{ item.content }}</span>
            <div class="subcontent">
                <span class="time">{{ new Date(item.time).toLocaleString() }}</span>
                <div class="method" v-if="store.userName == item.user_id" @click="deletePost(item.id)">
                    <font-awesome-icon icon="fa-solid fa-xmark" />删除
                </div>
                <div class="method" v-if="store.userName == item.user_id" @click="editPost(item.id)">
                    <font-awesome-icon icon="fa-solid fa-pen" />修改
                </div>
                <div class="method" @click="toggleLike(item.id)">
                    <font-awesome-icon icon="fa-solid fa-thumbs-up" />{{ item.likes }}
                </div>
                <div class="method" @click="sendReport(item.id)">
                    <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />举报
                </div>
            </div>
        </div>
    </div>

    <div class="input" v-loading="isSend">
        <el-input v-model="inputContent" style="width: 100%" rows="5" type="textarea"
            placeholder="发布你的帖子..."></el-input>
        <el-button @click="sendComment" style="width: 100%" type="primary"
            :disabled="inputContent.length === 0">发布</el-button>
    </div>
</div>
</template>

<style scoped>
.input {
    display: flex;
    width: 60%;
    flex-direction: column;
    margin: 30px auto;
}

.comments {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 60%;
    margin: 30px auto;
}

.comment {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 20px 20px 45px;
}

.user {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    word-break: break-all;
    margin-right: 15px;
    width: 10%;
}

.subcontent {
    position: absolute;
    display: flex;
    right: 20px;
    bottom: 10px;
}

.time {
    position: absolute;
    right: 270px;
    white-space: nowrap;
}

.method {
    margin-right: 12px;
}

.method:hover {
    cursor: pointer;
}

@media (max-width: 768px) {

    .comments,
    .input {
        width: 90%;
    }
}
</style>
