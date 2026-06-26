
# 进阶篇

## 简版速记

> 面试前快速过一遍的核心要点，详细展开见正文各章节。

- **数据类型**：8 种——7 基本（`Undefined`/`Null`/`Boolean`/`Number`/`String`/`Symbol`/`BigInt`）+ 1 引用（`Object`）。基本类型存栈、按值拷贝；引用类型存堆、栈里存地址、按引用拷贝。
- **类型检测**：`typeof` 测基本类型（`null` 误判为 `object`、函数为 `function`）；`instanceof` 看原型链；最准的是 `Object.prototype.toString.call(x)`。
- **this 指向**：默认绑定→隐式绑定→显式绑定（`call/apply/bind`）→`new` 绑定，优先级依次升高；箭头函数没有自己的 `this`，取定义时的外层。
- **原型链**：`实例.__proto__ === 构造函数.prototype`，属性查找沿原型链向上直到 `null`。
- **闭包**：函数 + 其词法作用域，常用于数据私有化与缓存；注意循环里用 `let` 或 IIFE 避免共享变量。
- **事件循环**：同步栈清空 → 清空所有微任务（`Promise.then`/`queueMicrotask`/`MutationObserver`）→ 渲染 → 取一个宏任务（`setTimeout`/事件/IO）→ 循环。
- **作用域/提升**：`var` 函数作用域且提升为 `undefined`；`let/const` 块级作用域 + 暂时性死区。
- **CSS 布局**：优先 Flex / Grid；居中、BFC、盒模型（`box-sizing`）、层叠上下文是高频点。
- **浏览器渲染**：URL → DNS → TCP/TLS → 请求 → 解析 HTML 建 DOM、CSS 建 CSSOM → 合成渲染树 → 布局 Layout → 绘制 Paint → 合成 Composite。重排比重绘代价大。
- **缓存**：强缓存（`Cache-Control`/`Expires`，不发请求）→ 协商缓存（`ETag`/`Last-Modified`，命中返回 304）。
- **HTTP**：HTTP/1.1 队头阻塞，HTTP/2 多路复用，HTTP/3 基于 QUIC；HTTPS = HTTP + TLS。
- **跨域**：CORS（服务端响应头）、JSONP（仅 GET）、代理；同源指协议+域名+端口一致。
- **Vue**：响应式（Vue2 `Object.defineProperty` / Vue3 `Proxy`）、虚拟 DOM + diff、`computed` 缓存、`watch` 副作用、`nextTick` 异步更新队列。
- **React**：单向数据流、虚拟 DOM + Fiber 可中断渲染、Hooks（`useState`/`useEffect`/`useMemo`/`useCallback`）、`key` 优化 diff。
- **性能**：减少请求、懒加载、代码分割、压缩、CDN、防抖节流、虚拟列表、缓存复用。
- **安全**：XSS（转义/CSP）、CSRF（Token/SameSite Cookie）。
- **设计模式**：单例、工厂、观察者/发布订阅、代理、装饰器、策略——结合前端场景说出落地例子。

# 进阶篇


## 目录

- [一、JS基础（1/3）](./01-JS基础-1.html)
- [一、JS基础（2/3）](./01-JS基础-2.html)
- [一、JS基础（3/3）](./01-JS基础-3.html)
- [二、HTML](./02-HTML.html)
- [三、CSS基础](./03-CSS基础.html)
- [四、浏览器](./04-浏览器.html)
- [五、框架通识](./05-框架通识.html)
- [六、Vue](./06-Vue.html)
- [七、React（1/2）](./07-React-1.html)
- [七、React（2/2）](./07-React-2.html)
- [八、性能](./08-性能.html)
- [九、工程化](./09-工程化.html)
- [十、HTTP](./10-HTTP.html)
- [十一、9种前端常见的设计模式](./11-9种前端常见的设计模式.html)
- [十二、综合问题](./12-综合问题.html)
- [十三、人事面](./13-人事面.html)
