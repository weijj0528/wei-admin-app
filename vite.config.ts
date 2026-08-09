import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 剥离 Origin 头，避免后端 CORS 过滤器拒绝（"Invalid CORS request"），与主应用一致
const stripOrigin = {
  configure: (proxy: any) => {
    proxy.on('proxyReq', (proxyReq: any) => {
      proxyReq.removeHeader('origin')
    })
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 避开主应用 8000
    port: 8100,
    // wujie 跨域 fetch 子应用资源，必须开 CORS
    cors: true,
    // WSL 访问 /mnt/d (Windows drvfs) 无 inotify，需轮询才能触发热更
    watch: { usePolling: true, interval: 1000 },
    proxy: {
      '/admin': { target: 'http://localhost:8080', changeOrigin: true, ...stripOrigin },
      '/api': { target: 'http://localhost:8080', changeOrigin: true, ...stripOrigin }
    }
  }
})
