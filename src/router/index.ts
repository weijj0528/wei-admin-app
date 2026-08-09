import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/home/index.vue'), meta: { title: '首页' } },
      { path: 'demo/list', name: 'DemoList', component: () => import('@/views/demo/list.vue'), meta: { title: '示例列表' } }
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
  document.title = (to.meta.title as string) || 'wei-app-template'
})

export default router
