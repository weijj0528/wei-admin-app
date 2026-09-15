<template>
  <div class="home">
    <el-card header="子应用上下文（来自主应用 wujie props）">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="运行模式">
          <el-tag v-if="micro.standalone" type="warning">独立模式</el-tag>
          <el-tag v-else type="success">wujie 子应用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="token（脱敏）">{{ maskedToken }}</el-descriptions-item>
        <el-descriptions-item label="userId">{{ micro.userId ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="username">{{ micro.username || '-' }}</el-descriptions-item>
        <el-descriptions-item label="currentPlatform">{{ micro.currentPlatform || '-' }}</el-descriptions-item>
        <el-descriptions-item label="buttons">{{ micro.buttons.length ? micro.buttons.join(', ') : '（空）' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMicroStore } from '@/store/micro'

const micro = useMicroStore()

const maskedToken = computed(() => {
  const t = micro.token
  if (!t) return '-'
  return t.length > 8 ? `${t.slice(0, 4)}****${t.slice(-4)}` : '****'
})
</script>

<style scoped>
.home {
  width: 100%;
}
</style>

