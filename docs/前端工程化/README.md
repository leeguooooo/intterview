---
title: "前端工程化面试题精选"
description: "前端工程化面试题:Webpack/Vite 原理、构建优化、Babel、Tree Shaking、模块化、CI/CD 与包管理。"
---

# 前端工程化

## 简版速记

> 面试前最后 5 分钟扫一遍，核心结论先记住，细节再翻正文。

- **Loader vs Plugin**：Loader 是「文件转换器」，把非 JS 模块（css/图片/ts）转成 webpack 能识别的内容，按数组**从右到左、从下到上**链式执行；Plugin 监听 webpack 生命周期的**事件钩子**（基于 Tapable 观察者模式），可介入打包全流程做更广的事。一句话：Loader 管「翻译」，Plugin 管「扩展」。
- **构建三阶段**：①初始化（合并参数 → 创建 `Compiler`）②构建（从 entry 出发，调 Loader 转译 → acorn 生成 AST → 递归找依赖）③生成（`seal` 封装 Chunk → `emitAssets` 写盘）。`Compiler` 全局唯一，`Compilation` 每次编译都新建。
- **module / chunk / bundle**：module = 每个源文件；chunk = 多个 module 的合并单元（entry / `import()` / splitChunks 产生）；bundle = 最终输出文件。
- **文件指纹 hash**：`hash` 全项目级（任一文件改全变）；`chunkhash` 入口级；`contenthash` 单文件内容级——**抽离 CSS 用 contenthash**，缓存命中率最高。
- **构建提速**：`babel-loader` 加 `cacheDirectory` + `exclude node_modules`、`IgnorePlugin`（不引入）、`noParse`（引入不解析）、多进程（HappyPack / ParallelUglify）、`DllPlugin`（框架预编译，仅开发环境）、HMR 热更新。
- **产物优化**：小图 base64、`contenthash` 利于缓存、`import()` 懒加载、`splitChunks` 抽公共/第三方代码、CDN、`mode: 'production'`（自动压缩 + Tree Shaking + Scope Hoisting）。
- **Tree Shaking** 依赖 **ES6 Module 静态结构**（编译时即可分析），CommonJS 动态 require 无法摇树；副作用代码摇不掉，用 `package.json` 的 `sideEffects` 标注。
- **Babel** 三步：parse（babylon → AST）→ transform（plugin 遍历改 AST）→ generate（生成 ES5）。`preset` 是 plugin 集合；`@babel/polyfill` 污染全局已废弃，改用 `core-js` + `regenerator-runtime`；做第三方库用 `@babel/plugin-transform-runtime` 避免全局污染。
- **为何 Proxy 不能 polyfill**：Class 可用 function 模拟、Promise 可用 callback 模拟，但 Proxy 的拦截能力 `Object.defineProperty` 无法等价实现。
- **Vite 为什么快**：开发态基于浏览器原生 ES Module，按需编译、免打包冷启动；生产态用 Rollup 打包。


## 目录

- [1 webpack的基本配置](./01-1-webpack的基本配置.html)
- [2 webpack高级配置](./02-2-webpack高级配置.html)
- [3 webpack性能优化-构建速度](./03-3-webpack性能优化-构建速度.html)
- [4 webpack性能优化-产出代码（线上运行）](./04-4-webpack性能优化-产出代码-线上运行.html)
- [5 webpack原理简述](./05-5-webpack原理简述.html)
- [6 webpack热更新原理](./06-6-webpack热更新原理.html)
- [7 webpack Loader](./07-7-webpack-Loader.html)
- [8 webpack Plugin](./08-8-webpack-Plugin.html)
- [9 webpack编译优化](./09-9-webpack编译优化.html)
- [10 webpack import()原理](./10-10-webpack-import-原理.html)
- [11 webpack有哪几种文件指纹？](./11-11-webpack有哪几种文件指纹.html)
- [12 webpack中如何处理图片的？](./12-12-webpack中如何处理图片的.html)
- [13 webpack常用插件总结](./13-13-webpack常用插件总结.html)
- [14 抽象语法树AST](./14-14-抽象语法树AST.html)
- [15 Babel环境搭建和基本配置](./15-15-Babel环境搭建和基本配置.html)
- [16 使用babel-loader会有哪些问题？可以怎样优化？](./16-16-使用babel-loader会有哪些问题-可以怎样优化.html)
- [17 Babel 原理](./17-17-Babel-原理.html)
- [18 Babel是如何编译Class的？](./18-18-Babel是如何编译Class的.html)
- [19 Babel Polyfill是什么](./19-19-Babel-Polyfill是什么.html)
- [20 Babel Runtime](./20-20-Babel-Runtime.html)
- [21 Tree Shaking原理是什么](./21-21-Tree-Shaking原理是什么.html)
- [22 Vite了解吗](./22-22-Vite了解吗.html)
- [23 面试真题](./23-23-面试真题.html)
