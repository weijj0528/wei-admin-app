<template>
  <div class="interact-permission">
    <el-card header="按钮权限（v-permission，权限标识来自主应用下发的 buttons）">
      <el-space wrap>
        <el-button v-permission="'demo:add'" type="primary" plain>demo:add（有权限，可见）</el-button>
        <el-button v-permission="'demo:not-exists'" type="danger" plain>demo:not-exists（无权限，已被移除）</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped>
.interact-permission {
  width: 100%;
}
</style>
