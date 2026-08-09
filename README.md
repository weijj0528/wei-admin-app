# wei-admin-app

wei-saas 前端**子应用模板**。基于 wujie-vue3 微前端，被主应用 `wei-admin-web` 加载；也可脱离主应用独立运行调试。复制本工程即可快速创建业务子应用。

## 技术栈

Vue 3 + Vite + Element Plus + Pinia + TypeScript + axios（与主应用 `wei-admin-web` 对齐）

## wujie 集成契约

主应用通过 `buildMicroProps()` 注入，子应用经 `window.$wujie` 读取：

| 来源 | 字段 | 说明 |
|------|------|------|
| `window.$wujie.props.token` | token | 登录 token，请求自动注入双头 |
| `window.$wujie.props.userInfo` | userId / username | 当前用户 |
| `window.$wujie.props.buttons` | buttons | 按钮权限 routeName 列表 |
| `window.$wujie.props.currentPlatform` | currentPlatform | 当前平台 code |
| `window.$wujie.bus` | bus | 事件总线（`$on` / `$off` / `$emit`） |

bus 事件契约（见 `src/micro/bus.ts`）：

- `platform-change`：主应用平台切换 -> 子应用同步 `currentPlatform`（已自动订阅）
- `subapp-unauthorized`：子应用 401 -> 主应用处理登录态
- `subapp-event`：示例通用事件

请求契约（后端 `WeiTokenFilter` + Controller `@RequestHeader`）：拦截器自动带 `Authorization: Bearer <token>` 与 `token: <token>` 双头；后端返回 `Result<T>`，成功码 `"20000"`，响应拦截器自动拆包取 `data`。

## 安装与独立调试

```bash
npm install
npm run dev      # http://localhost:8100
```

独立模式（脱离 wujie）下，token 从 `localStorage['wei_admin_token']` 或 `.env.development` 的 `VITE_DEV_TOKEN` 读取。从主应用登录后复制 token 填入即可调试需鉴权接口。

## 被主应用加载（核心联调）

前置：主应用 `wei-admin-web`（端口 8000）与后端（端口 8080）已启动，本子应用 `npm run dev` 起在 8100。两种加载方式任选其一：

### 方式 A：平台维度（PlatformContainer）

主应用「平台管理」编辑某平台，`entryUrl` 填 `http://localhost:8100/`，保存后切换到该平台，主应用即通过 wujie 加载本子应用（路由 `/platform/{code}/*`）。

### 方式 B：首页维度（HomeContainer）

主应用「菜单管理」给首页 MODULE 下某 PAGE 的 `component` 填 `http://localhost:8100/`，刷新后首页 tab 即加载本子应用。

加载成功后，子应用首页会展示主应用注入的 token / 用户 / 平台 / 按钮权限，验证契约生效；「示例列表」页可验证调后端接口（token 双头 + Result 拆包）。

## 生产部署

```bash
npm run build    # 产物在 dist/
```

将 `dist/` 部署到 CDN/Nginx，把部署 URL（如 `https://apps.example.com/wei-admin-app/`）填入平台 `entryUrl` 或菜单 `component`。若部署在子路径，需同步调整 `vite.config.ts` 的 `base` 与路由 `createWebHistory(base)`。

## 改造为业务子应用

1. 复制本目录并重命名（如 `wei-app-mall`）
2. 改 `package.json` 的 `name`、`index.html` 的 title
3. `vite.config.ts` 改 `server.port` 避免冲突（如 8101）
4. 增删 `src/router/index.ts` 路由与 `src/views` 页面
5. 业务接口放 `src/api/`，复用 `utils/request.ts`；按钮权限用 `v-permission`

## 目录结构

```
src/
├── micro/         wujie 适配（bus 事件 + props 读取 + 独立模式降级）
├── store/         Pinia 上下文 store（token / 用户 / 按钮 / 平台）
├── utils/         request（axios 封装） + permission（v-permission 指令）
├── router/        路由
├── layout/        顶栏布局（展示平台 / 用户 / 运行模式）
├── api/           示例接口
├── views/         首页（上下文展示 + bus 示例） + 示例列表（调接口 + 按钮权限）
├── main.ts        入口（检测 wujie 环境，初始化上下文）
└── App.vue
```

## 备注

- 子应用不做 token refresh，401 经 bus 通知主应用统一处理
- wujie 加载 vite dev 子应用依赖 `server.cors: true`（已配置）；若 HMR 异常可降级为生产构建后加载
- 本工程为独立 git 仓库，主仓以 submodule 引入；远程仓库地址在主仓 `.gitmodules`，创建远程后用 `git remote set-url origin <url>` 替换本地占位
