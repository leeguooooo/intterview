---
title: "手写篇"
---

# 手写篇

## 简版速记

> 面试前 5 分钟扫一遍，每条都是「一句话能说清的考点」。

- **防抖 debounce**：连续触发只认最后一次。`clearTimeout` + `setTimeout`，回调用 `func.apply(this, args)` 保留 this 和参数。场景：搜索联想、表单校验、按钮防重复提交。
- **节流 throttle**：固定间隔执行一次。时间戳版「首次立即执行、末次丢失」；定时器版「首次延迟、末次补一次」。场景：scroll、resize、拖拽。
- **instanceof**：沿 `__proto__` 链找 `构造函数.prototype`，找到返回 `true`，到 `null` 返回 `false`。
- **new**：① 建空对象并把 `__proto__` 指向构造函数 `prototype` ② 以该对象为 this 执行构造函数 ③ 构造函数返回对象则用它，否则用新对象。
- **call/apply/bind**：核心都是把函数挂到目标对象上调用以改变 this。`call` 传参列表、`apply` 传数组、`bind` 返回新函数(需兼容 new 调用时 this 指向实例)。
- **深拷贝**：递归 + `WeakMap` 解决循环引用；要处理 Date、RegExp、Symbol、函数等特殊类型。结构化数据可直接用 `structuredClone`（见下文补充）。
- **Promise**：三状态 `pending/fulfilled/rejected`，状态不可逆；`then` 要支持链式、异步回调（用微任务/`queueMicrotask`）和返回值穿透；重点是 `resolvePromise` 处理 thenable。
- **手写 Ajax**：`new XMLHttpRequest()` → `open` → `onreadystatechange`(readyState===4 且 status 2xx) → `send`。现代等价物是 `fetch`（见下文补充）。
- **JSONP**：靠 `<script src>` 不受同源限制，仅支持 GET；需约定全局 callback 名。CORS 才是通用跨域方案。
- **发布订阅 vs 观察者**：发布订阅有中间「事件中心」解耦发布者与订阅者；观察者是被观察者直接持有观察者列表并通知。
- **async/await**：本质是 Generator + 自动执行器（把 `yield` 出的 Promise resolve 后再 `.next()`）。
- **LRU**：用 `Map` 的插入有序性，`get`/`set` 命中后先 delete 再 set 移到尾部，超容删 `keys().next().value`（最老）。
- **柯里化**：参数够了就执行，不够就返回继续收参的函数（`fn.length` 判断）。
- **手写继承**：寄生组合式继承（`Object.create(父.prototype)` 修复原型链 + 修 `constructor`）是 ES5 最优解；ES6 直接 `extends`。

# 面试高频手写题

**建议优先掌握：**

  * `instanceof` \- 考察对原型链的理解
  * `new` \- 对创建对象实例过程的理解
  * `call/apply/bind` \- 对`this`指向的理解
  * 手写`promise` \- 对异步的理解
  * 手写原生`ajax` \- 对`ajax`原理和`http`请求方式的理解，重点是`get`和`post`请求的实现


## 目录

- [1 实现防抖函数（debounce）](./01-1-实现防抖函数-debounce.html)
- [2 实现节流函数（throttle）](./02-2-实现节流函数-throttle.html)
- [3 实现instanceOf](./03-3-实现instanceOf.html)
- [4 实现new的过程](./04-4-实现new的过程.html)
- [5 实现call方法](./05-5-实现call方法.html)
- [6 实现apply方法](./06-6-实现apply方法.html)
- [7 实现bind方法](./07-7-实现bind方法.html)
- [8 实现深拷贝](./08-8-实现深拷贝.html)
- [9 实现类的继承](./09-9-实现类的继承.html)
- [10 实现Promise相关方法](./10-10-实现Promise相关方法.html)
- [11 实现发布订阅模式](./11-11-实现发布订阅模式.html)
- [12 实现观察者模式](./12-12-实现观察者模式.html)
- [13 实现单例模式](./13-13-实现单例模式.html)
- [14 实现Ajax](./14-14-实现Ajax.html)
- [15 实现JSONP方法](./15-15-实现JSONP方法.html)
- [16 实现async/await](./16-16-实现async-await.html)
- [17 基于Generator函数实现async/await原理](./17-17-基于Generator函数实现async-await原理.html)
- [18 实现ES6的const](./18-18-实现ES6的const.html)
- [19 实现一个迭代器生成函数](./19-19-实现一个迭代器生成函数.html)
- [20 实现ES6的extends](./20-20-实现ES6的extends.html)
- [21 实现Object.create](./21-21-实现Object-create.html)
- [22 实现Object.freeze](./22-22-实现Object-freeze.html)
- [23 实现Object.is](./23-23-实现Object-is.html)
- [24 实现一个compose函数](./24-24-实现一个compose函数.html)
- [25 setTimeout与setInterval实现](./25-25-setTimeout与setInterval实现.html)
- [26 实现Node的require方法](./26-26-实现Node的require方法.html)
- [27 实现LRU淘汰算法](./27-27-实现LRU淘汰算法.html)
- [28 框架相关](./28-28-框架相关.html)
- [29 数组相关](./29-29-数组相关.html)
- [30 正则相关](./30-30-正则相关.html)
- [31 函数柯里化相关](./31-31-函数柯里化相关.html)
- [32 字符串相关](./32-32-字符串相关.html)
- [33 实现工具函数](./33-33-实现工具函数.html)
- [34 手写常见排序](./34-34-手写常见排序.html)
- [35 算法数据结构](./35-35-算法数据结构.html)
- [36 综合](./36-36-综合.html)
