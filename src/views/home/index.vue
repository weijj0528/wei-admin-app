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

    <el-card header="bus 通信示例" style="margin-top: 16px">
      <p class="tip">主应用需对 <code>subapp-event</code> 事件 <code>$on</code> 监听才能收到。</p>
      <el-button type="primary" @click="emitToHost">向主应用发送 subapp-event</el-button>
      <el-button @click="subscribeHost">订阅主应用 subapp-event</el-button>
      <p v-if="lastReceived" class="received">收到：{{ lastReceived }}</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useMicroStore } from '@/store/micro'
import { getBus } from '@/micro/wujie'
import { BUS_EVENTS } from '@/micro/bus'

const micro = useMicroStore()

const maskedToken = computed(() => {
  const t = micro.token
  if (!t) return '-'
  return t.length > 8 ? `${t.slice(0, 4)}****${t.slice(-4)}` : '****'
})

const lastReceived = ref('')

function emitToHost() {
  getBus().$emit(BUS_EVENTS.SUBAPP_EVENT, { from: 'wei-app-template', time: Date.now() })
  ElMessage.success('已向主应用发送 subapp-event')
}

function subscribeHost() {
  getBus().$on(BUS_EVENTS.SUBAPP_EVENT, (payload: any) => {
    lastReceived.value = JSON.stringify(payload)
  })
  ElMessage.success('已订阅 subapp-event，等待主应用发送')
}
</script>

<style scoped>
.home {
  max-width: 720px;
}
.tip {
  color: #999;
  font-size: 13px;
}
.received {
  margin-top: 12px;
  color: var(--el-color-success);
}
</style>
