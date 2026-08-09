import { request } from '@/utils/request'

export interface DictItem {
  id: number
  name: string
  code?: string
  typeCode?: string
  status?: number
  sort?: number
}

/** 字典项列表（后端已有接口，示例用）：GET /admin/dict/item/list?typeCode=xxx */
export function getDictItems(typeCode: string) {
  return request<DictItem[]>({
    url: '/admin/dict/item/list',
    method: 'get',
    params: { typeCode }
  })
}
