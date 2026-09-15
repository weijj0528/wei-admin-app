<template>
  <div class="interact-bus">
    <el-card header="bus 双向通信（主应用全局监听 subapp-event）">
      <el-space wrap>
        <el-button type="primary" @click="sendHello">发纯消息（主应用 ElMessage 提示）</el-button>
        <el-button type="success" @click="requestNavigate">请求主应用跳转「示例列表」菜单</el-button>
      </el-space>
      <p class="tip">
        纯消息 payload：<code>{ from: 'wei-admin-app', text: '...' }</code><br />
        跳转 payload：<code>{ type: 'navigate', path: '/platform/DEMO/demo/list' }</code>，主应用收到后 router.push
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useMicroStore } from '@/store/micro'
import { getBus } from '@/micro/wujie'
import { BUS_EVENTS } from '@/micro/bus'

const micro = useMicroStore()

/** 纯消息：主应用仅弹提示 */
function sendHello() {
  getBus().$emit(BUS_EVENTS.SUBAPP_EVENT, {
    from: 'wei-admin-app',
    text: `你好主应用，我是 ${micro.username || '子应用'}（平台 ${micro.currentPlatform || '-'}）`
  })
  ElMessage.success('已向主应用发送 subapp-event')
}

/** 导航消息：主应用识别 type=navigate 后切换到对应菜单路由 */
function requestNavigate() {
  getBus().$emit(BUS_EVENTS.SUBAPP_EVENT, { type: 'navigate', path: '/platform/DEMO/demo/list' })
  ElMessage.success('已请求主应用跳转到「示例列表」菜单')
}
</script>

<style scoped>
.interact-bus {
  width: 100%;
}
.tip {
  margin-top: 12px;
  color: #999;
  font-size: 13px;
  line-height: 1.8;
}
</style>
