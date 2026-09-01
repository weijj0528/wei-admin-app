<template>
  <div class="interact">
    <el-card header="与主应用交互演示（wujie props / bus / 权限）">
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

    <el-card header="bus 双向通信（主应用全局监听 subapp-event）" style="margin-top: 16px">
      <el-space wrap>
        <el-button type="primary" @click="sendHello">发纯消息（主应用 ElMessage 提示）</el-button>
        <el-button type="success" @click="requestNavigate">请求主应用跳转「示例列表」菜单</el-button>
      </el-space>
      <p class="tip">
        纯消息 payload：<code>{ from: 'wei-admin-app', text: '...' }</code><br />
        跳转 payload：<code>{ type: 'navigate', path: '/platform/DEMO/demo/list' }</code>，主应用收到后 router.push
      </p>
    </el-card>

    <el-card header="按钮权限（v-permission，权限标识来自主应用下发的 buttons）" style="margin-top: 16px">
      <el-space wrap>
        <el-button v-permission="'demo:add'" type="primary" plain>demo:add（有权限，可见）</el-button>
        <el-button v-permission="'demo:not-exists'" type="danger" plain>demo:not-exists（无权限，已被移除）</el-button>
      </el-space>
    </el-card>

    <el-card header="子应用内部路由（wujie :sync 同步主应用 URL 子路径）" style="margin-top: 16px">
      <el-space wrap>
        <el-button @click="router.push('/demo/list')">跳到子应用「示例列表」页</el-button>
        <el-button @click="router.push('/home')">回到子应用「首页」</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useMicroStore } from '@/store/micro'
import { getBus } from '@/micro/wujie'
import { BUS_EVENTS } from '@/micro/bus'

const micro = useMicroStore()
const router = useRouter()

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
.interact {
  max-width: 860px;
}
.tip {
  margin-top: 12px;
  color: #999;
  font-size: 13px;
  line-height: 1.8;
}
</style>
