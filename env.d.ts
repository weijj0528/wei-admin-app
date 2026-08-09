/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 独立调试用 token，从主应用登录后复制；wujie 模式下不生效 */
  readonly VITE_DEV_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** wujie 事件总线（主应用自动注入，子应用经 window.$wujie.bus 访问） */
interface WujieBus {
  $on: (event: string, callback: (...args: any[]) => void) => void
  $off: (event: string, callback?: (...args: any[]) => void) => void
  $emit: (event: string, ...args: any[]) => void
}

/** 主应用 -> 子应用 的 props 契约（与主应用 buildMicroProps 对齐） */
interface WujieProps {
  token: string
  userInfo: { userId?: number; username?: string }
  buttons: string[]
  currentPlatform: string
}

interface Window {
  $wujie?: {
    props: WujieProps
    bus: WujieBus
  }
}
