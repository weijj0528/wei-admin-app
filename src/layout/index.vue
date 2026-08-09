<template>
  <div class="micro-layout">
    <header class="micro-topbar">
      <span class="title">wei-app-template（子应用模板）</span>
      <span class="info">平台：{{ micro.currentPlatform || '-' }}</span>
      <span class="info">用户：{{ micro.username || '-' }}</span>
      <el-tag v-if="micro.standalone" type="warning" size="small">独立模式</el-tag>
      <el-tag v-else type="success" size="small">wujie 子应用</el-tag>
    </header>
    <nav class="micro-nav">
      <router-link to="/home">首页</router-link>
      <router-link to="/demo/list">示例列表</router-link>
    </nav>
    <main class="micro-main"><router-view /></main>
  </div>
</template>

<script setup lang="ts">
import { useMicroStore } from '@/store/micro'

const micro = useMicroStore()
</script>

<style scoped>
.micro-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.micro-topbar {
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.micro-topbar .title {
  font-weight: 600;
}
.micro-topbar .info {
  color: #666;
  font-size: 13px;
}
.micro-nav {
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}
.micro-nav a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
}
.micro-nav a.router-link-active {
  color: var(--el-color-primary);
  font-weight: 600;
}
.micro-main {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
</style>
