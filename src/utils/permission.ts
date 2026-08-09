import type { Directive } from 'vue'
import { useMicroStore } from '@/store/micro'

/**
 * v-permission="'demo:add'" 或 v-permission="['demo:add','demo:del']"
 * 按钮权限：buttons 由主应用注入（routeName 列表），无权限则移除元素。
 * 与主应用 v-permission 语义一致。
 */
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const code = binding.value
    if (!code) return
    const micro = useMicroStore()
    const codes = Array.isArray(code) ? code : [code]
    if (!codes.some((c) => micro.hasButton(c))) {
      el.parentNode?.removeChild(el)
    }
  }
}
