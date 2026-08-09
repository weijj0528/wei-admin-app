/**
 * 主应用 <-> 子应用 bus 事件契约。
 * 主应用侧需对对应事件 $on 监听；子应用经 getBus() 访问。
 */
export const BUS_EVENTS = {
  /** 主应用平台切换 -> 子应用同步 currentPlatform */
  PLATFORM_CHANGE: 'platform-change',
  /** 子应用 401 -> 通知主应用处理登录态（跳登录/刷新 token） */
  UNAUTHORIZED: 'subapp-unauthorized',
  /** 子应用通用事件（示例，业务可自定义扩展） */
  SUBAPP_EVENT: 'subapp-event'
} as const

/** 独立模式 no-op bus，保证非 wujie 环境调用不报错 */
export const noopBus: WujieBus = {
  $on: () => {},
  $off: () => {},
  $emit: () => {}
}
