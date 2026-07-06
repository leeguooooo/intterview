---
title: "高频考点"
---

# 高频考点

# 高频考点

## 简版速记

> 面试前 5 分钟快速过一遍的核心结论，详细推导见后文各章节。

- **类型判断**：`typeof` 只能区分原始类型（`null` 例外，返回 `'object'`）与函数；引用类型用 `instanceof`（看原型链）或 `Object.prototype.toString.call(x)`（最稳，返回 `[object Type]`）。
- **`==` vs `===`**：`==` 会做隐式类型转换（按规则把两边转成可比较类型），`===` 不转、类型不同直接 `false`。除判断 `null`/`undefined` 外一律用 `===`。
- **闭包**：函数捕获并保留其词法作用域中的变量；经典坑是 `for` 循环里 `var` + `setTimeout`，用 `let` 或 IIFE 解决。
- **深浅拷贝**：浅拷贝（`Object.assign`、`{...obj}`）只复制第一层；深拷贝可用 `JSON.parse(JSON.stringify())`（丢函数/`undefined`/`symbol`、不支持循环引用），完整方案用 `structuredClone()` 或递归。
- **原型链**：对象 `__proto__` → 构造函数 `prototype` → … → `Object.prototype` → `null`，查找属性沿链向上。
- **`var`/`let`/`const`**：`var` 有变量提升、挂 `window`、函数作用域；`let`/`const` 块级作用域、有暂时性死区；`const` 声明后不可重新赋值（但对象内部可变）。
- **Event Loop**：同步任务 → 清空微任务队列（`Promise.then`、`queueMicrotask`、`MutationObserver`）→ 取一个宏任务（`setTimeout`、I/O、`setInterval`）→ 再清微任务，循环往复。
- **手写**：`call`/`apply`/`bind`（改 `this` + 传参）、`new`（建对象、连原型、执行构造、返回对象）、`instanceof`（顺原型链找 `prototype`）、`Promise`（三状态 + 回调队列）。
- **`0.1 + 0.2 !== 0.3`**：IEEE 754 双精度浮点精度问题，比较用 `Math.abs(a-b) < Number.EPSILON`。
- **事件机制**：捕获 → 目标 → 冒泡三阶段；`addEventListener` 第三参 `true` 为捕获；事件委托靠冒泡 + `event.target` 提升性能。
- **跨域**：同源策略限制；解决方案 CORS（主流）、JSONP（仅 GET）、代理、`postMessage`、`document.domain`（已废弃）。
- **存储**：`cookie`（约 4KB、随请求携带）、`localStorage`/`sessionStorage`（约 5MB、不参与请求）、IndexedDB（大容量、异步）。
- **浏览器缓存**：强缓存（`Cache-Control` 优先于 `Expires`）→ 协商缓存（`ETag`/`If-None-Match` 优先于 `Last-Modified`/`If-Modified-Since`，命中返回 304）。
- **渲染原理**：解析 HTML→DOM、CSS→CSSOM → 合成 Render Tree → Layout（重排）→ Paint（重绘）→ Composite；减少重排重绘是性能关键。
- **安全**：XSS（转义输出 + CSP + HttpOnly Cookie）、CSRF（SameSite Cookie + Token 校验）。
- **网络**：TCP 三次握手、四次挥手、可靠有序；UDP 无连接、快但不可靠。HTTP/2 多路复用 + 二进制分帧 + 头压缩（HPACK）+ 服务端推送；HTTP/3 基于 QUIC（UDP）解决 TCP 队头阻塞。
- **框架**：Vue 响应式（`Object.defineProperty` / Vue3 `Proxy`）、虚拟 DOM + diff；React 单向数据流、Fiber、Hooks 闭包陷阱、`key` 的作用。


## 目录

- [1 typeof类型判断](./01-1-typeof类型判断.html)
- [2 类型转换](./02-2-类型转换.html)
- [3 This](./03-3-This.html)
- [4 == 和 === 有什么区别](./04-4-==-和-===-有什么区别.html)
- [5 闭包](./05-5-闭包.html)
- [6 深浅拷贝](./06-6-深浅拷贝.html)
- [7 原型](./07-7-原型.html)
- [8 var、let 及 const 区别](./08-8-var-let-及-const-区别.html)
- [9 原型继承和 Class 继承](./09-9-原型继承和-Class-继承.html)
- [10 模块化](./10-10-模块化.html)
- [11 实现一个简洁版的promise](./11-11-实现一个简洁版的promise.html)
- [12 Event Loop](./12-12-Event-Loop.html)
- [13 手写 call、apply 及 bind 函数](./13-13-手写-call-apply-及-bind-函数.html)
- [14 new](./14-14-new.html)
- [15 instanceof 的原理](./15-15-instanceof-的原理.html)
- [16 为什么 0.1 + 0.2 != 0.3](./16-16-为什么-0-1-+-0-2-=-0-3.html)
- [17 事件机制](./17-17-事件机制.html)
- [18 跨域](./18-18-跨域.html)
- [19 存储](./19-19-存储.html)
- [20 浏览器缓存机制](./20-20-浏览器缓存机制.html)
- [21 浏览器渲染原理](./21-21-浏览器渲染原理.html)
- [22 安全防范](./22-22-安全防范.html)
- [23 从 V8 中看 JS 性能优化](./23-23-从-V8-中看-JS-性能优化.html)
- [24 性能优化](./24-24-性能优化.html)
- [25 Webpack 性能优化](./25-25-Webpack-性能优化.html)
- [26 实现小型打包工具](./26-26-实现小型打包工具.html)
- [27 MVVM/虚拟DOM/前端路由](./27-27-MVVM-虚拟DOM-前端路由.html)
- [28 Vue常考知识点](./28-28-Vue常考知识点.html)
- [29 React常考知识点](./29-29-React常考知识点.html)
- [30 监控](./30-30-监控.html)
- [31 TCP/UDP](./31-31-TCP-UDP.html)
- [32 HTTP/TLS](./32-32-HTTP-TLS.html)
- [33 HTTP2.0](./33-33-HTTP2-0.html)
- [34 设计模式](./34-34-设计模式.html)
- [35 常见数据结构](./35-35-常见数据结构.html)
- [36 常考算法题解析](./36-36-常考算法题解析.html)
- [37 css常考面试题解析](./37-37-css常考面试题解析.html)
