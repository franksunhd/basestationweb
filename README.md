# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)


## 1. Vite项目初始化
-  npm 6.x
npm init @vitejs/app baseStationWeb --template vue

-  npm 7+（需要额外的双横线）
npm init @vitejs/app baseStationWeb -- --template vue

-  yarn
yarn create @vitejs/app baseStationWeb --template vue

## 2. 项目配置
- 2.0 创建工程:npm init @vitejs/app baseStationWeb --template vue
- 2.1 安装依赖: npm install  
- 2.2 安装ts: npm install typescript -D
  - 初始化tsc配置文件:   npx tsc --init
  - 修改js文件为ts文件，创建shim.d.ts文件
- 2.3 安装vue-router4.0: npm i vue-router@4.0
  - 创建src/router/index.ts文件，配置路由
- 2.4 安装vuex: npm install vuex@4.0   
    // 如果npm找不到换成 yarn add vuex@4.0
  - 创建src/store/index.ts，配置vuex
- 2.5 main.ts中配置router和store
- 2.6 集成Axios: npm i axios 
    - 创建 src/api/index.ts 文件
- 2.7 集成 CSS 预编译器：npm i stylus  sass  less -D
- 2.8 集成 EditorConfig 配置 添加.editorconfig文件
- 2.9 集成 Prettier 配置 npm i prettier -D
    - 配置 .prettierrc  ;格式化所有文件（. 表示所有文件）   npx prettier --write .
- 2.10 安装 ESLint npm i eslint -D
    - 执行 npx eslint --init [参阅：] (https://www.cnblogs.com/ouyangkai/p/15624278.html)
    - ESLint 配置文件 .eslintrc.js
- 2.11 解决 Prettier 和 ESLint 的冲突
  安装插件 npm i eslint-plugin-prettier eslint-config-prettier -D

## 3.项目公共设置
- 3.1 vite 中使用 postcss-pxtorem 自适应  npm install postcss-pxtorem --save-dev
  - 创建postcss.config.js文件
  <!-- - 安装 amfe-flexible npm i amfe-flexible -D
  - npm i  autoprefixer -D
  - main.ts文件中  import 'amfe-flexible/index.js' -->
  <!-- - npm i autoprefixer   编码autoRem  文件 -->
- 3.2 安装Vant 3.x 版本 npm i vant@3
  - 通过 npm 安装 npm i vite-plugin-style-import -D
  - vite.config.js 配置 VantResolve



2.3修改 vite.config.ts 文件


## 项目入口路径
- 驻点服务的测试入口链接 https://medicaluat.mobile.taikang.com/active/baseStation/index.html#/entry
- 驻点服务的生产入口链接https://medical.mobile.taikang.com/active/baseStation/index.html#/entry

## 设计
【腾讯 CoDesign】驻场就医
https://codesign.qq.com/s/dqN292gyKG0aBXe
访问密码：YWX7  


