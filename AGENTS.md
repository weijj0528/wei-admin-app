# AGENTS.md — wei-admin-app（wujie 子应用模板）

wei-saas 前端**业务子应用脚手架**。Vue 3 + Vite + Element Plus + Pinia + axios，基于 wujie-vue3 被底座 `wei-admin-web` 加载；也可脱离底座独立运行调试。复制本工程即可快速派生一个业务子应用。

> 底座约定见 `../wei-admin-web/AGENTS.md`；后端约定见主仓 `../AGENTS.md`。更完整的联调/部署说明见本目录 `README.md`。

## 技术栈与命令

- Vue 3.5（`<script setup lang="ts">`）、Vite 8、TypeScript 6、Pinia 3、vue-router、Element Plus 2.14（中文 `zh-cn`）、axios（不引 wujie-vue3，通过 `window.$wujie` 原生接入）
- 路径别名 `@` → `src`
- 命令：
  ```bash
  npm install
  npm run dev        # http://localhost:8100
  npm run build      # vue-tsc -b + vite build，产物 dist/
  npm run preview
  ```
- dev 代理 `/admin`、`/api` → `http://localhost:8080`，`stripOrigin` 移除 origin 头（与底座一致，防 CORS）
- **`server.cors: true` 必开**：wujie 通过 fetch 跨域加载子应用资源
- WSL 场景 `server.watch.usePolling`

## wujie 接入契约

主应用通过 `buildMicroProps()` 注入，子应用经 `window.$wujie` 读取：

| 来源 | 字段 | 说明 |
|------|------|------|
| `window.$wujie.props.token` | token | 登录 token，请求拦截器自动注入双头 |
| `window.$wujie.props.userInfo` | userId / username | 当前用户 |
| `window.$wujie.props.buttons` | buttons | 按钮权限标识列表（FUNC routePath，如 `user:save`） |
| `window.$wujie.props.currentPlatform` | currentPlatform | 当前平台 code |
| `window.$wujie.bus` | bus | 事件总线 `$on`/`$off`/`$emit` |

### 生命周期（main.ts）

- 检测 `window.__POWERED_BY_WUJIE__`：
  - wujie 环境：导出 `window.__WUJIE_MOUNT`（创建并挂载 app）与 `window.__WUJIE_UNMOUNT`（`app.unmount()`），由主应用驱动
  - 独立环境：直接 `createAndMount()`
- 挂载后 `useMicroStore().init()` 读取 props 并订阅 bus

### 适配层（src/micro/）

- `wujie.ts`
  - `isInWujie()`：`!!window.$wujie`
  - `getMicroProps()`：wujie 内返回 `window.$wujie.props`；独立模式降级从 `localStorage['wei_admin_token']` 或 `VITE_DEV_TOKEN` 取 token，其余为空
  - `getBus()`：返回 `window.$wujie?.bus ?? noopBus`，调用方无需判空
- `bus.ts`：事件名常量 `BUS_EVENTS`
  - `platform-change`：底座平台切换 → 子应用 `microStore` 订阅并更新 `currentPlatform`
  - `subapp-unauthorized`：子应用 401 → 通知底座处理登录态
  - `subapp-event`：示例通用事件，业务可扩展
- 独立模式 `noopBus` 的 `$on/$off/$emit` 均为空函数

## 上下文 Store（store/micro.ts）

`useMicroStore` 承载 `token/userId/username/buttons/currentPlatform/standalone`：
- `init()`：从 `getMicroProps()` 初始化；非独立模式 `$on('platform-change', ...)` 同步平台
- `hasButton(code)`：判断按钮权限（与底座 buttons 对齐）

## 后端联调约定（与底座一致）

- **请求双头**：`utils/request.ts` 拦截器从 `microStore.token` 取 token，同时带 `Authorization: Bearer <token>` 与 `token: <token>`
- **统一响应**：后端 `Result<T>` 成功码字符串 `"20000"`，拦截器自动拆包返回 `data`，业务错误 `ElMessage` 提示
- **401 处理：子应用不自行刷新 token**，通过 `getBus().$emit('subapp-unauthorized')` 通知底座统一处理登录/刷新
- 数组参数同样使用重复键序列化

## 按钮权限

- 全局指令 `v-permission="['xxx:save']"`（`utils/permission.ts`），从 `microStore.buttons` 判断，无权限移除元素
- 也可用 `microStore.hasButton(code)` 在脚本中判断

## 目录结构

```
src/
├── micro/        wujie 适配：bus.ts（事件契约 + noopBus）、wujie.ts（props/bus 读取 + 独立降级）
├── store/        micro.ts（上下文 store）
├── utils/        request.ts（axios + 双头 + 401 上报底座）、permission.ts（v-permission）
├── router/       路由
├── layout/       顶栏（展示平台/用户/运行模式）
├── api/          接口（示例 demo.ts）
├── views/        home（上下文展示 + bus 示例）、demo/list（调接口 + 按钮权限示例）
├── main.ts       wujie 生命周期判断与挂载
└── App.vue
```

## 被底座加载的两种方式

1. **平台维度**：底座「平台管理」编辑平台，`entryUrl` 填子应用地址（dev 如 `http://localhost:8100/`），切到该平台后由 `PlatformContainer` 经路由 `/platform/{code}/*` 加载
2. **首页维度**：底座「菜单管理」给首页 MODULE 下某 PAGE 的 `component` 填子应用地址，首页 tab 即加载

加载成功后首页会展示注入的 token/用户/平台/按钮，「示例列表」页可验证调后端接口（双头 + Result 拆包）与 `v-permission`。

## 改造为业务子应用

1. 复制本目录并重命名（如 `wei-app-mall`），改独立 git 远程（`git remote set-url origin <url>`）
2. 改 `package.json` 的 `name`、`index.html` 的 `<title>`
3. `vite.config.ts` 改 `server.port` 避免冲突（8101、8102…）；保持 `cors:true`
4. 增删 `src/router/index.ts` 路由与 `src/views/` 页面；业务接口放 `src/api/`，复用 `utils/request.ts`
5. 按钮权限用 `v-permission` / `microStore.hasButton`；跨应用通信用 `getBus()`
6. 需要底座下发新的上下文字段时，同步改底座 `src/micro/props.ts` 的 `buildMicroProps()` 与本应用 `WujieProps` 类型、`microStore.init()`

## 生产部署

```bash
npm run build
```

将 `dist/` 部署到 CDN/Nginx，把访问 URL 填入平台 `entryUrl` 或菜单 `component`。若部署在子路径：
- 改 `vite.config.ts` 的 `base`（如 `/wei-admin-app/`）
- 路由改用 `createWebHistory(import.meta.env.BASE_URL)`
- 确保 wujie 能跨域访问（CDN/CORS 头）

## 关键约定与陷阱

1. **不要在子应用做 token refresh**：401 一律 `bus.$emit('subapp-unauthorized')` 交底座，避免多子应用各自刷新竞争
2. **`server.cors:true` 不能关**：wujie 靠 fetch 加载子应用资源，关了会加载失败
3. **端口冲突**：底座 8000，本模板 8100，新子应用顺延；后端固定 8080
4. **独立调试 token**：从底座登录后复制 token，存入 `localStorage['wei_admin_token']`，或在 `.env.development` 配 `VITE_DEV_TOKEN`
5. **wujie 生命周期必须导出**：`__WUJIE_MOUNT` / `__WUJIE_UNMOUNT` 缺失会导致底座无法挂载/卸载，DOM 残留
6. **HMR 异常时降级**：wujie 加载 vite dev 子应用偶发 HMR 问题，可用生产构建后加载验证
7. **本仓为 submodule**：常处 detached HEAD，提交后需 `git branch -f main HEAD && git checkout main` 关联 main，再到主仓 `git add wei-admin-app` 更新指针；勿提交 node_modules/dist
8. **构建过类型检查**：`npm run build` 含 `vue-tsc -b`，提交前保证无类型错误；改动后用 Playwright 验证被底座加载与独立运行两种模式
