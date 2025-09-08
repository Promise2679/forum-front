// 全局存储

import { defineStore } from 'pinia'
import { ref } from 'vue'

const userStore = defineStore('user', () => {
  const userName = ref('')
  const isAdmin = ref(false)
  const isLogin = ref(false)
  const token = ref('')

  const clearUserInfo = () => {
    userName.value = ''
    token.value = ''
    isAdmin.value = false
    isLogin.value = false

    localStorage.removeItem('username')
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
  }
  const registUserInfo = (id, type, jwt) => {
    userName.value = id
    token.value = jwt
    isAdmin.value = type === 2
    isLogin.value = true
    localStorage.setItem('username', userName.value)
    localStorage.setItem('admin', isAdmin.value)
    localStorage.setItem('token', token.value)
  }
  const initialize = () => {
    userName.value = Number(localStorage.getItem('username'))
    token.value = localStorage.getItem('token')
    isAdmin.value = localStorage.getItem('admin')
    isLogin.value = token.value.length > 0
  }

  return { userName, isLogin, isAdmin, token, clearUserInfo, registUserInfo, initialize }
})

export default userStore
