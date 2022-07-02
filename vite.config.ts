// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite'
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import styleImport, { VantResolve } from 'vite-plugin-style-import'
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import path from 'path'
// https://vitejs.dev/config/
//vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      // polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      // modernPolyfills: ['es.promise.finally'],
      targets:['chrome 52'],  // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills:['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    }),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name:string) => {
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ],
      resolves: [VantResolve()],
    }),
    viteMockServe({
      mockPath: "./src/mock",
      supportTs: false
    }),
  ],
  resolve:{
    extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.node', '.scss'],
    alias:{
      '@': path.join(__dirname, './src'),
      '@components': path.join(__dirname, './src/components'),
      '@utils': path.join(__dirname, './src/utils'),
      '@router': path.join(__dirname, './src/router'),
      '@api': path.join(__dirname, './src/api'),
      '@store': path.join(__dirname, './src/store'),
      '@views': path.join(__dirname, './src/views'),
      '@assets': path.join(__dirname, './src/assets'),
    }
  },
  base: './', // 设置打包路径
  build: {
    outDir: "dist/dist"
  },
  server: {
    port: 4001, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    host: '0.0.0.0',

    // 设置代理，根据我们项目实际情况配置
    proxy: {
      // '/api': {
      //   target: 'http://xxx.xxx.xxx.xxx:8000',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace('/api/', '/')
      // },
      '^/tklife/test': {
        target: 'http://tklifetest.mobile.taikang.com/',   //代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '^/mobile': {
        target: 'https://medicaluat.mobile.taikang.com/mobilenet/analysis-report/',   //代理接口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mobile/, '')
      },
      '^/img': {
        target: 'https://medicaluat.mobile.taikang.com/tlifeimg/baseStationWeb/',   //代理图片路径
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 更改主题在这里
          'primary-color': '#52c41a',
          'link-color': '#1DA57A',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    },
  },
  // transpileDependencies: ['webpack-dev-server/client'],
  // chainWebpack: config => {
  // config.entry.app = ['babel-polyfill', './src/main.js'];
  // },
})

// chainWebpack: config => {
//   config.entry.app = ['babel-polyfill', './src/main.js'];
// }


