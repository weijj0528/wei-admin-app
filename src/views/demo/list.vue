<template>
  <div class="demo-list">
    <el-card header="字典项列表（示例：调后端 /admin/dict/item/list）">
      <template #extra>
        <el-button v-permission="'demo:add'" type="primary" size="small">新增（需 demo:add 权限）</el-button>
      </template>
      <el-table v-loading="loading" :data="list" border size="small" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="sort" label="排序" width="80" />
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无数据或 token 无效" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDictItems, type DictItem } from '@/api/demo'

const list = ref<DictItem[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    list.value = await getDictItems('OBJECT')
  } catch {
    // 拦截器已提示，这里静默
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.demo-list {
  max-width: 960px;
}
</style>
