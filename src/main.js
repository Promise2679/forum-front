import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'

import '@/assets/global.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faTriangleExclamation, faXmark, faPen } from '@fortawesome/free-solid-svg-icons'
import userStore from './stores/userStore'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

library.add(faThumbsUp, faTriangleExclamation, faXmark, faPen)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')

userStore().initialize()
