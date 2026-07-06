---
title: "webpack热更新原理"
---

# 6 webpack热更新原理

![HMR 热更新：文件改动 → webpack 重新编译模块 → HMR Server 经 WebSocket 通知运行时 → 浏览器局部替换模块，页面不刷新、状态不丢失](/images/diagrams/webpack-hmr.webp)

![](/images/s_poetries_work_images_20210319101659.webp)

  * 当修改了一个或多个文件；
  * 文件系统接收更改并通知 `webpack`；
  * `webpack` 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
  * `HMR Server` 使用 `webSocket` 通知 `HMR runtime` 需要更新，`HMR` 运行时通过 `HTTP` 请求更新 `jsonp`
  * `HMR` 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新
