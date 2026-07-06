---
title: "Uniapp"
---

# Uniapp

## 简版速记

> 面试前 3 分钟扫一遍，下面是 uni-app 最高频的考点。

- **一句话定义**：基于 Vue 语法 + 小程序 API 的跨端框架，一套代码编译到 iOS / Android / Web(H5) / 各家小程序 / 快应用。组件靠近小程序规范，JS API 用 `uni.` 前缀（替代 `wx.` / `my.`）。
- **跨端原理**：分「编译器 + 运行时(runtime)」。编译器（Vue2 基于 webpack、Vue3 基于 Vite）把代码编译成各端特有产物；每个端有自己的 runtime 负责解析。这是「为什么一套代码能多端跑」的标准答案。
- **逻辑层 / 渲染层分离**：小程序和 App 把逻辑层（JS 引擎）和渲染层（webview / 原生）分开，核心目的是性能（避免 JS 运算和渲染抢资源）。代价：逻辑层拿不到 `window` / `document`，两层通信有损耗 → `onPageScroll`、`setData` 类高频操作要节流。
- **条件编译**：`// #ifdef H5 ... // #endif`（注释式），平台标识有 `APP-PLUS / H5 / MP-WEIXIN / MP-ALIPAY` 等，`#ifndef` 取反。是处理多端差异的核心手段。
- **生命周期三层**：应用级（`onLaunch/onShow/onHide`，只能写在 `App.vue`）→ 页面级（`onLoad/onShow/onReady/onHide/onUnload` + `onReachBottom/onPullDownRefresh/onPageScroll`）→ 组件级（同 Vue：`created/mounted/...`，无 `onLoad`）。注意：页面参数在 `onLoad(options)` 拿，不在 `created`。
- **尺寸单位 `rpx`**：响应式单位，规定屏幕宽 = 750rpx，自动按屏宽换算，做适配首选。
- **页面通讯**：`uni.$emit / uni.$on / uni.$off`（全局事件总线）、URL 传参 + `onLoad`、`getCurrentPages()` 取上个页面实例、`eventChannel`、Vuex / Pinia。
- **nvue vs vue 页面**：`.nvue` 走原生渲染（类 RN，性能好但 CSS 受限、只支持 flex）；`.vue` 走 webview。按需选渲染引擎。
- **easycom**：组件放在 `components/组件名/组件名.vue` 或 `uni_modules` 下即可免 import / 免注册直接用，打包自动剔除未用组件。
- **Vue2→Vue3 要点**：`createApp` 入口、Vite 构建、需建 `index.html`、只支持 ES Module、Vuex 改用 `createStore`、不再支持过滤器(filter)、组合式 API 生命周期（`onLoad` 等需从 `@dcloudio/uni-app` import）。
- **存储**：`uni.setStorage(Sync)` / `getStorage(Sync)`，单 key 上限 1MB、单端总上限 10MB（小程序端）。
- **平台判断**：运行期用 `uni.getSystemInfoSync().platform` 或 `process.env.UNI_PLATFORM`；编译期用条件编译。

> 入门uniapp


## 目录

- [1 基础部分总结](./01-1-基础部分总结.html)
- [2 Uniapp页面组成](./02-2-Uniapp页面组成.html)
- [3 资源互相引用](./03-3-资源互相引用.html)
- [4 JS语法](./04-4-JS语法.html)
- [5 CSS语法](./05-5-CSS语法.html)
- [6 uniapp中使用Vue2语法注意](./06-6-uniapp中使用Vue2语法注意.html)
- [7 uniapp中使用Vue3语法注意](./07-7-uniapp中使用Vue3语法注意.html)
- [8 Vue2升级Vue3](./08-8-Vue2升级Vue3.html)
- [9 跨平台兼容](./09-9-跨平台兼容.html)
- [10 uni-app存储](./10-10-uni-app存储.html)
- [11 判断平台](./11-11-判断平台.html)
- [12 条件编译](./12-12-条件编译.html)
- [13 web专题](./13-13-web专题.html)
- [14 App相关](./14-14-App相关.html)
- [15 小程序相关](./15-15-小程序相关.html)
- [16 项目结构](./16-16-项目结构.html)
- [17 运行](./17-17-运行.html)
- [18 发布](./18-18-发布.html)
- [19 uni-app组成和跨端原理](./19-19-uni-app组成和跨端原理.html)
- [20 需要注意](./20-20-需要注意.html)
