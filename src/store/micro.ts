import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMicroProps, getBus, isInWujie } from '@/micro/wujie'
import { BUS_EVENTS } from '@/micro/bus'

/**
 * 子应用上下文 store：承载主应用注入的 token/用户/按钮权限/平台。
 * wujie 模式从 props 初始化并订阅 bus 平台切换；独立模式从 localStorage 读取。
 */
export const useMicroStore = defineStore('micro', () => {
  const token = ref('')
  const userId = ref<number | undefined>()
  const username = ref('')
  const buttons = ref<string[]>([])
  const currentPlatform = ref('')
  const standalone = ref(false)

  /** 初始化：从 wujie props 或 localStorage 读取，并订阅 bus 平台切换 */
  function init() {
    const props = getMicroProps()
    token.value = props.token || ''
    userId.value = props.userInfo.userId
    username.value = props.userInfo.username || ''
    buttons.value = props.buttons || []
    currentPlatform.value = props.currentPlatform || ''
    standalone.value = !isInWujie()

    if (!standalone.value) {
      getBus().$on(BUS_EVENTS.PLATFORM_CHANGE, (platform: string) => {
        currentPlatform.value = platform
      })
    }
  }

  /** 按钮权限判断（routeName 列表，与主应用 buttons 对齐） */
  function hasButton(code: string): boolean {
    return buttons.value.includes(code)
  }

  return { token, userId, username, buttons, currentPlatform, standalone, init, hasButton }
})
