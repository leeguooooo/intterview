原文链接: [https://interview.poetries.top/docs/base.html#%E4%B8%80%E3%80%81html%E3%80%81http%E3%80%81web%E7%BB%BC%E5%90%88%E9%97%AE%E9%A2%98](https://interview.poetries.top/docs/base.html#%E4%B8%80%E3%80%81html%E3%80%81http%E3%80%81web%E7%BB%BC%E5%90%88%E9%97%AE%E9%A2%98)

# 基础篇

## 简版速记

> 临场前 5 分钟扫一遍，把高频考点压成一句话。展开细节看后文各小节。

**HTML / HTTP / Web**

- SEO 要点：语义化标签、重要内容前置、关键内容别靠 JS 输出、图片加 `alt`、少用 `iframe`、提速。
- `title` 是通用属性（悬停提示），`alt` 是 `<img>` 专有的替代文本（图裂时显示、读屏器朗读、SEO 抓取）。
- HTTP 方法：`GET` 取数据（幂等、安全、参数在 URL）；`POST` 提交（非幂等、参数在 body）；`PUT` 整体替换（幂等）；`PATCH` 局部更新；`DELETE` 删除。
- 缓存：强缓存（`Cache-Control` / `Expires`，不发请求）→ 协商缓存（`ETag` / `Last-Modified`，发请求带 304）。
- 存储三件套：`cookie`（≤4K、随同源请求自动带、可设过期）、`localStorage`（持久）、`sessionStorage`（关页即清）；后两者不自动上送服务器。
- HTTP/2：多路复用、头部压缩(HPACK)、二进制分帧、服务端推送；HTTP/3 换用 QUIC(UDP)，解决队头阻塞。

**CSS**

- 盒模型：`content-box`（默认） vs `border-box`（`width` 含 padding/border，更好算）。
- 居中：水平用 `margin:0 auto` / `text-align:center`；垂直水平首选 `flex`（`justify-content`+`align-items`）或 `display:grid; place-items:center`，兼容旧法用 `absolute + transform:translate(-50%,-50%)`。
- 清浮动：`clear:both` 伪元素法、BFC（`overflow:hidden`）；现代布局已基本不靠 `float`，用 Flex/Grid。
- `position`：`static`/`relative`/`absolute`/`fixed`/`sticky`；`display`/`float`/`position` 三者会相互影响（如绝对定位后 `display` 计算为 `block`）。

**JavaScript**

- 数据类型：原始（`string`/`number`/`boolean`/`null`/`undefined`/`symbol`/`bigint`）+ 引用（`object`）；判类型用 `typeof`、`instanceof`、`Object.prototype.toString.call()`。
- `var`/`let`/`const`：`var` 函数作用域+变量提升；`let`/`const` 块级作用域+暂时性死区；`const` 不可重新赋值。
- 闭包：函数 + 其引用的外层作用域，常用于私有变量、防抖节流、柯里化。
- 原型链：实例 `__proto__` → 构造函数 `prototype` → 逐级向上到 `Object.prototype` → `null`。
- 继承：现代用 `class ... extends ... super()`；老式有原型链/借用构造/组合/寄生组合继承。
- 异步：回调 → Promise → `async/await`；事件循环分宏任务（`setTimeout`）与微任务（`Promise.then`），微任务优先清空。
- 防抖（debounce，停止操作后再执行）vs 节流（throttle，固定间隔执行一次）。
- 请求演进：`XMLHttpRequest` → `fetch`（Promise、需手动处理错误/超时）→ `axios`（拦截器、自动 JSON、取消请求）。

**工程 / 框架**

- webpack 核心：entry / output / loader（转换文件）/ plugin（扩展能力）；优化靠分包、Tree Shaking、压缩、缓存。
- 框架对比：React（单向数据流、JSX、Hooks）、Vue（响应式、模板、双向绑定 `v-model`）。
- 性能优化抓手：减少请求（合并/雪碧图/HTTP2）、压缩与缓存、懒加载、CDN、骨架屏、关键渲染路径优化。

# 基础篇

> 前端基础题型，快速过一遍即可

![面试经验谈](/images/s_poetries_work_uploads_2022_07_ee7310c4f45b9bd6.png)


## 目录

- [一、HTML、HTTP、WEB综合问题](./01-HTML-HTTP-WEB综合问题.html)
- [二、CSS相关（1/2）](./02-CSS相关-1.html)
- [二、CSS相关（2/2）](./02-CSS相关-2.html)
- [三、JavaScript相关（1/4）](./03-JavaScript相关-1.html)
- [三、JavaScript相关（2/4）](./03-JavaScript相关-2.html)
- [三、JavaScript相关（3/4）](./03-JavaScript相关-3.html)
- [三、JavaScript相关（4/4）](./03-JavaScript相关-4.html)
- [四、jQuery相关](./04-jQuery相关.html)
- [五、Bootstrap相关](./05-Bootstrap相关.html)
- [六、微信小程序相关](./06-微信小程序相关.html)
- [七、webpack相关](./07-webpack相关.html)
- [八、框架相关](./08-框架相关.html)
- [九、编程题相关](./09-编程题相关.html)
- [十、前端综合问题](./10-前端综合问题.html)
- [十一、HR面相关](./11-HR面相关.html)
