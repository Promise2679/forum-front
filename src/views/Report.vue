<script setup>
import { useRouter } from 'vue-router'
import userStore from '@/stores/userStore'
import { ElMessage, ElNotification } from 'element-plus'
import { onMounted, reactive } from 'vue'
import axios from '@/requests/requests'
import debounce from '@/utils/debounce'

const router = useRouter()
const store = userStore()
const reportList = reactive({ data: [] })

const toHome = debounce(() => router.push({ name: 'home' }), 150)
const logout = debounce(() => {
    ElMessage({ message: "注销成功", type: "success", duration: 1500 })
    store.clearUserInfo()
    router.push({ name: 'login' })
}, 150)

// 获取举报列表
const getReports = () => {
    const url = store.isAdmin ? "/api/admin/report" : "/api/student/report-post"
    const data = {
        params: {
            user_id: store.userName,
        }
    }

    axios.get(url, data).then(res => {
        console.log(res)
        if (res.data.code === 200) {
            reportList.data = res.data.data.report_list
        } else {
            ElMessage({ message: `无法获取举报内容`, type: "error", duration: 1500 })
        }
    }).catch(() => reportList.data = [])
}

// 审批举报内容
const processReport = debounce((id, value) => {
    const data = {
        user_id: store.userName,
        report_id: id,
        approval: value
    }

    axios.post("/api/admin/report", data).then(res => {
        if (res.data.code === 200) {
            ElNotification({ message: "提交成功！", type: "success" })
            setTimeout(() => getReports(), 1000)
        } else {
            ElNotification({ message: `审批失败：${res.data.msg}`, type: "error" })
        }
    }).catch(err => ElMessage({ message: `Error: ${err}`, type: "error", duration: 1500 }))
}, 150)

// 标签样式
const toType = value => {
    if (value === 0) {
        return "warning"
    } else if (value === 1) {
        return "success"
    } else {
        return "danger"
    }
}

// 标签文本
const toText = value => {
    if (value === 0) {
        return "待审核"
    } else if (value === 1) {
        return "已通过"
    } else {
        return "未通过"
    }
}

onMounted(() => {
    getReports()
})
</script>

<template>
<div class="container">
    <div class="top">
        <h2>举报中心</h2>
        <div>
            <el-button @click.once="toHome">返回主页</el-button>
            <el-button @click.once="logout" type="danger">注销</el-button>
        </div>
    </div>
    <div class="reports">
        <el-table :data="reportList.data">
            <el-table-column prop="post_id" label="帖子编号" />
            <el-table-column v-if="store.isAdmin" prop="username" label="举报人" />
            <el-table-column prop="content" label="帖子内容" />
            <el-table-column prop="reason" label="举报原因" />
            <el-table-column v-if="store.isAdmin" label="操作">
                <template class="buttons" #default="scope">
                    <div><el-button @click.once="processReport(scope.row.report_id, 1)" type="success">同意</el-button>
                    </div>
                    <div><el-button @click.once="processReport(scope.row.report_id, 2)" type="danger">拒绝</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-else label="审核状态">
                <template #default="scope">
                    <el-tag :type="toType(scope.row.status)">{{ toText(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<style scoped>
.reports {
    display: flex;
    margin: 30px auto;
    width: 80%;
}
</style>
