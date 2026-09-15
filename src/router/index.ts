import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/home/index.vue'), meta: { title: '首页' } },
      { path: 'demo/list', name: 'DemoList', component: () => import('@/views/demo/list.vue'), meta: { title: '示例列表' } },
      { path: 'interact', redirect: '/interact/context' },
      { path: 'interact/context', name: 'InteractContext', component: () => import('@/views/interact/context.vue'), meta: { title: '运行上下文' } },
      { path: 'interact/bus', name: 'InteractBus', component: () => import('@/views/interact/bus.vue'), meta: { title: 'bus 通信' } },
      { path: 'interact/permission', name: 'InteractPermission', component: () => import('@/views/interact/permission.vue'), meta: { title: '按钮权限' } },
      { path: 'interact/route', name: 'InteractRoute', component: () => import('@/views/interact/route.vue'), meta: { title: '内部路由' } }
    ]
  },
  // 兜底回首页
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/home/index.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'wei-admin-app'
})

export default router
