原文链接: [https://interview.poetries.top/docs/excellent-docs/3-JS%E6%A8%A1%E5%9D%97.html](https://interview.poetries.top/docs/excellent-docs/3-JS%E6%A8%A1%E5%9D%97.html)

# JavaScript

## 简版速记

> 面试前 5 分钟扫一遍的高频结论，细节看正文对应小节。

- **数据类型**：7 种原始类型 `undefined / null / boolean / number / string / symbol / bigint` + 引用类型 `Object`。`typeof null === 'object'` 是历史 Bug；`NaN !== NaN`。
- **类型检测**：`typeof` 判原始类型（除 null）+ 函数；`instanceof` 查原型链，判不了原始类型；最全用 `Object.prototype.toString.call(x)` 返回 `[object Xxx]`；判数组优先 `Array.isArray`。
- **0.1 + 0.2 ≠ 0.3**：IEEE 754 双精度二进制表示精度丢失；判等用 `Math.abs(a-b) < Number.EPSILON`。
- **类型转换**：`==` 会隐式转换，`===` 不会；对象转原始走 `Symbol.toPrimitive → valueOf → toString`；`[] == ![]` 为 `true`。
- **闭包**：函数 + 其引用的外部作用域；本质是「当前环境存在指向父级作用域的引用」。`for` 循环输出问题用 `let` / IIFE / `setTimeout` 第三参解决。
- **原型链**：`实例.__proto__ === 构造函数.prototype`；`构造函数.prototype.constructor === 构造函数`；沿 `__proto__` 向上直到 `null`。
- **继承**：最推荐寄生组合继承 `Child.prototype = Object.create(Parent.prototype)` + 修正 `constructor`；ES6 用 `class … extends`。
- **this**：优先级 `new` > `bind/call/apply` > `obj.foo()` > 普通调用；箭头函数无自身 this，取定义时外层第一个普通函数的 this，且不可被 bind 改变。
- **内存**：原始类型存栈，对象存堆，赋值时原始拷值、对象拷引用地址；闭包变量存在堆中。
- **Event Loop**：一个宏任务 → 清空所有微任务 →（必要时渲染）。微任务 `Promise.then / MutationObserver / queueMicrotask`，宏任务 `setTimeout / setInterval / I/O`。Node 把宏任务分 6 阶段、微任务额外有 `process.nextTick`（优先级最高，node 11 后每个宏任务后清空微任务）。
- **深浅拷贝**：浅拷贝 `Object.assign` / 展开运算符只复制一层；深拷贝可用 `structuredClone`（现代）或递归 / `JSON.parse(JSON.stringify())`（有局限）。


## 目录

- [1 数据类型基础](./01-1-数据类型基础.html)
- [2 数据类型检测](./02-2-数据类型检测.html)
- [3 数据类型转换](./03-3-数据类型转换.html)
- [4 闭包](./04-4-闭包.html)
- [5 原型和原型链链](./05-5-原型和原型链链.html)
- [6 继承](./06-6-继承.html)
- [7 this](./07-7-this.html)
- [8 内存机制](./08-8-内存机制.html)
- [9 执行上下文](./09-9-执行上下文.html)
- [10 变量提升](./10-10-变量提升.html)
- [11 模块化](./11-11-模块化.html)
- [12 异步编程](./12-12-异步编程.html)
- [13 内存泄露](./13-13-内存泄露.html)
- [14 垃圾回收机制](./14-14-垃圾回收机制.html)
- [15 深浅拷贝](./15-15-深浅拷贝.html)
- [16 对象的几种创建方式](./16-16-对象的几种创建方式.html)
- [17 数组相关](./17-17-数组相关.html)
- [18 操作DOM](./18-18-操作DOM.html)
- [19 Ajax总结](./19-19-Ajax总结.html)
- [20 定时器](./20-20-定时器.html)
- [21 谈谈你对for in/for of的理解](./21-21-谈谈你对for-in-for-of的理解.html)
- [22 JavaScript 实现对上传图片的压缩？](./22-22-JavaScript-实现对上传图片的压缩.html)
