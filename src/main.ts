import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { useMicroStore } from '@/store/micro'
import { vPermission } from '@/utils/permission'
import './style.css'

let app: VueApp | null = null

function createAndMount() {
  app = createApp(App)

  // 注册 Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus, { locale: zhCn })
  app.directive('permission', vPermission)

  // 初始化子应用上下文：wujie 模式读 props，独立模式读 localStorage
  useMicroStore().init()

  app.mount('#app')
}

if ((window as any).__POWERED_BY_WUJIE__) {
  // wujie 子应用：导出生命周期，由主应用驱动挂载/卸载
  ;(window as any).__WUJIE_MOUNT = () => {
    createAndMount()
  }
  ;(window as any).__WUJIE_UNMOUNT = () => {
    if (app) {
      app.unmount()
      app = null
    }
  }
} else {
  // 独立运行
  createAndMount()
}
