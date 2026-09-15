<template>
  <div class="interact-route">
    <el-card header="子应用内部路由（wujie :sync 同步主应用 URL 子路径）">
      <el-space wrap>
        <el-button @click="router.push('/demo/list')">跳到子应用「示例列表」页</el-button>
        <el-button @click="router.push('/home')">回到子应用「首页」</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.interact-route {
  width: 100%;
}
</style>
