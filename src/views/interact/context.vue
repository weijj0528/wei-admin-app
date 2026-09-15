<template>
  <div class="interact-context">
    <el-card header="运行上下文（wujie props / 权限）">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="运行模式">
          <el-tag v-if="micro.standalone" type="warning">独立模式</el-tag>
          <el-tag v-else type="success">wujie 子应用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前用户">{{ micro.username || '-' }}（userId: {{ micro.userId ?? '-' }}）</el-descriptions-item>
        <el-descriptions-item label="当前平台">{{ micro.currentPlatform || '-' }}</el-descriptions-item>
        <el-descriptions-item label="按钮权限">{{ micro.buttons.length ? micro.buttons.join(', ') : '（空）' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useMicroStore } from '@/store/micro'

const micro = useMicroStore()
</script>

<style scoped>
.interact-context {
  width: 100%;
}
</style>
