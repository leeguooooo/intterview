
# 进阶性能优化

## 简版速记

> 面试速记：以「从输入 URL 到页面呈现」为主线，把性能优化拆成网络、存储、渲染、监测四块。

**主线五阶段**：DNS 解析 → TCP 连接 → HTTP 请求 → 服务端处理并返回响应 → 浏览器解析渲染。每一阶段都对应一类优化手段。

**网络层**
- HTTP 优化两大方向：减少请求次数、减小单次请求体积。落地手段就是「压缩 + 合并」（webpack）。
- webpack 提速：`include/exclude` 缩小 loader 范围、`babel-loader` 开 `cacheDirectory`、`DllPlugin` 单独打包第三方库、HappyPack 多进程；瘦身：`webpack-bundle-analyzer` 可视化、Tree-Shaking（依赖 ES Module 静态结构）、按需加载（`require.ensure` / Code-Splitting）。
- Gzip：内核是 Deflate，重复率越高收益越大，通常省 ~70%；小文件不划算。webpack 端压缩与服务端压缩是分压关系，互不替代。
- 图片选型：JPG（有损、体积小、不支持透明，适合大图/Banner）；PNG（无损、支持透明、体积大，适合 Logo/线条/小图）；SVG（矢量、文本、不失真、可压缩）；Base64（编码非格式，省 HTTP 请求，体积膨胀 4/3，只适合极小图标）；WebP（全能但有兼容性坑，需降级方案）。
- CDN：核心是「缓存 + 回源」；静态资源走 CDN，且用独立域名避免无谓携带 Cookie。

**存储层**
- 浏览器缓存优先级：Memory Cache → Service Worker Cache → HTTP Cache → Push Cache。
- HTTP 缓存分强缓存与协商缓存：强缓存先行（`Expires` 时间戳已过时、`Cache-Control: max-age` 时间长度优先级更高，命中返回 200，不与服务端通信）；强缓存未命中走协商缓存（`Last-Modified`/`If-Modified-Since` 精度到秒有缺陷，`ETag`/`If-None-Match` 基于内容更精准、优先级更高，未变返回 304）。
- 本地存储：Cookie（≤4KB、随域名自动携带、本职是维持状态）→ Web Storage（5-10M，仅浏览器端，LocalStorage 持久 / SessionStorage 会话级）→ IndexedDB（浏览器端非关系型数据库，容量大、可存二进制）。

**渲染层**
- 渲染流程：解析 HTML 建 DOM 树 → 解析 CSS 建 CSSOM（与 DOM 并行）→ DOM + CSSOM 合成渲染树 → 布局（Layout/Reflow）→ 绘制（Paint）→ 合成图层。
- 阻塞：HTML、CSS、JS 均会阻塞渲染。CSS 阻塞渲染须尽早尽快下载；JS 会抢走渲染引擎控制权、阻塞 DOM/CSSOM，用 `async`（加载完立即执行）/ `defer`（DOMContentLoaded 前按序执行）缓解。
- DOM 慢的两个原因：JS 与渲染引擎跨界「过桥费」、修改样式引发回流/重绘。优化：缓存 DOM 引用、批量改动、用 `DocumentFragment`。
- 回流 vs 重绘：回流改几何属性（开销大），重绘只改外观；重绘不一定回流，回流一定重绘。规避：缓存敏感属性（offset/scroll/client 等会触发即时计算回流）、用 class 合并样式、`display:none` 离线化。浏览器有 flush 队列做批处理。
- 异步更新：Vue/React 把更新入队批量触发；DOM 更新包装成 micro-task 更贴近渲染时机（Vue `nextTick` 默认用 Promise 微任务）。
- SSR：服务端把组件渲成 HTML 字符串返回，主要解决 SEO 和首屏速度，但服务器资源宝贵，非首选。

**应用与监测**
- Lazy-Load：`data-src` 占位，滚动时用 `getBoundingClientRect().top` 与 `innerHeight` 比较判断是否进入视口再赋真实 `src`。
- 节流 throttle（第一个人说了算，固定间隔触发一次）与防抖 debounce（最后一个人说了算，停止后才触发）均基于闭包 + setTimeout，用于 scroll/resize/mousemove 等高频事件。
- 性能监测：Performance 面板（FPS/CPU/NET + 火焰图，重展示）、Lighthouse（出报告与评分，重分析）、W3C Performance API（`performance.timing` 可编程取各阶段耗时，便于上报）。

# 前端性能优化篇


## 目录

- [一、前言](./01-前言.html)
- [二、网络篇 1：webpack 性能调优与 Gzip 原理](./02-网络篇-1-webpack-性能调优与-Gzip-原理.html)
- [三、网络篇 2：图片优化——质量与性能的博弈](./03-网络篇-2-图片优化——质量与性能的博弈.html)
- [四、存储篇 1：浏览器缓存机制介绍与缓存策略剖析](./04-存储篇-1-浏览器缓存机制介绍与缓存策略剖析.html)
- [五、存储篇 2：本地存储——从 Cookie 到 Web Storage、IndexDB](./05-存储篇-2-本地存储——从-Cookie-到-Web-Storage-IndexDB.html)
- [六、CDN 的缓存与回源机制解析](./06-CDN-的缓存与回源机制解析.html)
- [七、渲染篇 1：服务端渲染的探索与实践](./07-渲染篇-1-服务端渲染的探索与实践.html)
- [八、渲染篇 2：知己知彼——解锁浏览器背后的运行机制](./08-渲染篇-2-知己知彼——解锁浏览器背后的运行机制.html)
- [不做无用功：基于渲染流程的 CSS 优化建议](./09-不做无用功-基于渲染流程的-CSS-优化建议.html)
- [九、渲染篇 3：对症下药——DOM 优化原理与基本实践](./10-渲染篇-3-对症下药——DOM-优化原理与基本实践.html)
- [药到病除：给你的 DOM “提提速”](./11-药到病除-给你的-DOM-“提提速”.html)
- [十、渲染篇 4：千方百计——Event Loop 与异步更新策略](./12-渲染篇-4-千方百计——Event-Loop-与异步更新策略.html)
- [十一、渲染篇 5：最后一击——回流（Reflow）与重绘（Repaint）](./13-渲染篇-5-最后一击——回流-Reflow-与重绘-Repaint.html)
- [十二、应用篇 1：优化首屏体验——Lazy-Load 初探](./14-应用篇-1-优化首屏体验——Lazy-Load-初探.html)
- [十三、应用篇 2：事件的节流（throttle）与防抖（debounce）](./15-应用篇-2-事件的节流-throttle-与防抖-debounce.html)
- [十四、性能监测篇：Performance、LightHouse 与性能 API](./16-性能监测篇-Performance-LightHouse-与性能-API.html)
