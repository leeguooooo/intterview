---
title: "vue cli 工程技术集合介绍"
---

# 37 vue-cli 工程技术集合介绍

### 构建的 vue-cli 工程都到了哪些技术，它们的作用分别是什么

  * `vue.js`：`vue-cli`工程的核心，主要特点是 双向数据绑定 和 组件系统。
  * `vue-router`：`vue`官方推荐使用的路由框架。
  * `vuex`：专为 `Vue.js` 应用项目开发的状态管理器，主要用于维护`vue`组件间共用的一些 变量 和 方法。
  * `axios`（ 或者 `fetch` 、`ajax` ）：用于发起 `GET` 、或 `POST` 等 `http`请求，基于 `Promise` 设计。
  * `vuex`等：一个专为`vue`设计的移动端UI组件库。
  * 创建一个`emit.js`文件，用于`vue`事件机制的管理。
  * `webpack`：模块加载和`vue-cli`工程打包器。

### vue-cli 工程常用的 npm 命令有哪些

  * 下载 `node_modules` 资源包的命令：
```javascript
    npm install
```

  * 启动 `vue-cli` 开发环境的 npm命令：
```javascript
    npm run dev
```

  * `vue-cli` 生成 生产环境部署资源 的 `npm`命令：
```javascript
    npm run build
```

  * 用于查看 `vue-cli` 生产环境部署资源文件大小的 `npm`命令：
```javascript
    npm run build --report
```

> 在浏览器上自动弹出一个 展示 `vue-cli` 工程打包后 `app.js`、`manifest.js`、`vendor.js`
> 文件里面所包含代码的页面。可以具此优化 `vue-cli` 生产环境部署的静态资源，提升 页面 的加载速度

### 请说出vue cli项目中src目录每个文件夹和文件的用法

  * `assets`文件夹是放静态资源；
  * `components`是放组件；
  * `router`是定义路由相关的配置;
  * `view`视图；
  * `app.vue`是一个应用主组件；
  * `main.js`是入口文件
