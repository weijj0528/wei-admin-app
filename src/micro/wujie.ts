import { noopBus } from './bus'

/** 是否运行在 wujie 子应用环境（被主应用加载） */
export function isInWujie(): boolean {
  return !!window.$wujie
}

/**
 * 取主应用注入的 props；独立模式降级：
 * token 从 localStorage(wei_admin_token) 或 VITE_DEV_TOKEN 取，便于脱离主应用调试
 */
export function getMicroProps(): WujieProps {
  if (window.$wujie) {
    return window.$wujie.props
  }
  const lsToken = localStorage.getItem('wei_admin_token') || ''
  return {
    token: lsToken || import.meta.env.VITE_DEV_TOKEN || '',
    userInfo: {},
    buttons: [],
    currentPlatform: ''
  }
}

/** 取 bus；独立模式返回 no-op，调用方无需判空 */
export function getBus(): WujieBus {
  return window.$wujie?.bus ?? noopBus
}
