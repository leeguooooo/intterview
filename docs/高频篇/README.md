> 一天快速复习完高频面试题

# 高频篇

## 简版速记

> 面试前最后一眼能扫完的高频要点。详细展开见下方对应小节。

**CSS**

- 盒模型：标准 `content-box`（`width` 只含内容）vs 怪异 `border-box`（`width` 含 `padding+border`），用 `box-sizing` 切换。
- BFC：独立渲染区域，触发条件 `overflow:hidden/auto`、`float`、`position:absolute/fixed`、`display:flex/grid/inline-block`；用途：清浮动、防 margin 重叠、自适应两栏。
- 选择器权重：`!important` > 行内(1000) > id(100) > class/属性/伪类(10) > 元素/伪元素(1)。
- 居中：`flex`（`justify-content/align-items: center`）或 `position + transform: translate(-50%,-50%)` 或 `grid` + `place-items:center`。
- 单位：`px` 绝对、`em` 相对父字号、`rem` 相对根字号、`vw/vh` 相对视口。
- 隐藏元素：`display:none`（不占位、不可交互）、`visibility:hidden`（占位、不可交互）、`opacity:0`（占位、可交互）。

**JavaScript**

- `typeof`：除 `null`（返回 `'object'`，历史 bug）外能区分基本类型；引用类型一律 `'object'`，函数返回 `'function'`。判类型用 `Object.prototype.toString.call()`。
- 闭包：函数 + 其词法作用域，常见于柯里化、防抖节流、模块私有变量；注意循环中用 `let` 或 IIFE 避免引用同一变量。
- 原型链：实例 `__proto__` → 构造函数 `prototype` → `Object.prototype` → `null`。
- 事件循环：同步栈清空 → 微任务（`Promise.then`/`queueMicrotask`/`MutationObserver`）全清 → 一个宏任务（`setTimeout`/`setInterval`/事件）→ 再清微任务，循环往复。
- `this`：普通函数看调用者，箭头函数继承定义时外层 `this`（无自己的 `this/arguments`）。

**浏览器 / 网络**

- 存储：`cookie`(4KB,随请求带)、`localStorage`(5M,持久)、`sessionStorage`(5M,关页清)、`IndexedDB`(大)；`cookie` 安全位 `HttpOnly/Secure/SameSite`。
- 缓存：强缓存 `Cache-Control`(优先) / `Expires` 不发请求；协商缓存 `ETag/If-None-Match`、`Last-Modified/If-Modified-Since` 命中返回 304。
- 跨域：CORS（主流）、`Nginx` 反代、同源 `postMessage`；JSONP 已基本淘汰。
- XSS 用 `CSP`+转义+`HttpOnly` 防；CSRF 用 `SameSite`+Token 防。
- 渲染流程：DNS → TCP → 请求 → 解析 HTML 建 DOM、CSS 建 CSSOM → Render Tree → Layout → Paint → Composite。

**Vue**

- Vue2 响应式：`Object.defineProperty` 劫持 getter/setter，数组靠重写七个方法，新增属性需 `Vue.set`。
- Vue3 响应式：`Proxy` 代理整个对象，天然支持新增/删除属性和数组下标。
- diff：同层比较 + key 复用；`v-for` 必须加稳定 `key`，别用 index。
- Vue3 比 Vue2 快：编译期 `PatchFlag` 标记动态节点、`hoistStatic` 静态提升、`cacheHandler` 缓存事件、Tree-shaking。

**React**

- JSX 编译为 `React.createElement`（React 17+ 走 `jsx` runtime）生成 vdom。
- `setState`：合成事件/生命周期中异步批处理；React 18 起 `automatic batching` 覆盖 `setTimeout`/原生事件/Promise。
- Hooks 规则：只在顶层调用、只在 React 函数中调用；`useEffect` 注意依赖数组与闭包陷阱、清理函数。
- 性能：`React.memo`、`useMemo`/`useCallback`、列表稳定 `key`、`useTransition`/`Suspense`。

**工程化 / HTTP**

- Webpack：`loader` 转换文件、`plugin` 扩展构建生命周期；优化用 `splitChunks`、Tree-shaking、按需加载。
- Vite 启动快：开发期基于浏览器原生 ESM 免打包、`esbuild` 预构建依赖；生产用 Rollup 打包。
- HTTP：1.0 短连接 → 1.1 长连接+管线 → 2.0 多路复用+头压缩+服务端推送 → 3.0 基于 QUIC(UDP) 解决队头阻塞。
- 状态码：301 永久/302 临时重定向、304 未修改、401 未授权/403 禁止、404 未找到、500 服务器错、502 网关坏/504 网关超时。

**手写高频**

- 防抖（最后一次触发后 N 毫秒执行）、节流（N 毫秒内只执行一次）、深拷贝（处理循环引用+各类型）、`new`/`call`/`apply`/`bind`、柯里化、Promise、发布订阅、LRU、数组扁平化。


## 目录

- [1 CSS](./01-1-CSS.html)
- [2 JavaScript](./02-2-JavaScript.html)
- [3 浏览器](./03-3-浏览器.html)
- [4 Vue2](./04-4-Vue2.html)
- [5 Vue3](./05-5-Vue3.html)
- [6 React](./06-6-React.html)
- [7 React Hooks](./07-7-React-Hooks.html)
- [8 Webpack](./08-8-Webpack.html)
- [9 HTTP](./09-9-HTTP.html)
- [10 Node](./10-10-Node.html)
- [11 综合题目](./11-11-综合题目.html)
- [12 手写题](./12-12-手写题.html)
- [13 算法题](./13-13-算法题.html)
- [14 开放问题](./14-14-开放问题.html)
