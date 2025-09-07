// 路由配置

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Report from '@/views/Report.vue'
import userStore from '@/stores/userStore'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/reg',
      name: 'reg',
      component: Register,
    },
    {
      path: '/report',
      name: 'report',
      component: Report,
    },
  ],
})

// 导航守卫
router.beforeEach(to => {
  const store = userStore()
  if (store.isLogin && (to.name == 'login' || to.name == 'reg')) {
    return { name: 'home' }
  }
  if (store.isLogin || to.name == 'login'|| to.name == 'reg') {
    return true
  }
  return { name: 'login' }
})

export default router
