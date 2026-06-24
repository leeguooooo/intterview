原文链接: [https://interview.poetries.top/docs/excellent-docs/%E9%9D%A2%E8%AF%95%E6%8C%87%E5%8D%97.html](https://interview.poetries.top/docs/excellent-docs/%E9%9D%A2%E8%AF%95%E6%8C%87%E5%8D%97.html)

# 面试指南

## 简版速记

> 面试前 5 分钟过一遍，把高频考点压成一句话；细节看下文对应小节。

- **简历**：针对 JD 写，PDF 格式，技能写熟练度（了解/熟悉/精通），项目突出背景—收益—优化点；简历即面试「菜单」，别给自己挖坑、别造假。
- **变量类型**：值类型存栈、引用类型存堆；`typeof` 只能区分基本类型 + function（`null`、数组、对象都返回 `object`），判断引用类型用 `instanceof`，最稳是 `Object.prototype.toString.call()`。
- **原型链**：实例 `__proto__` → 构造函数 `prototype` → 逐层向上至 `Object.prototype` → `null`；`instanceof` 沿原型链查找。
- **作用域与闭包**：JS 是词法（静态）作用域；闭包 = 函数 + 其定义时的作用域，常用于封装私有变量、做缓存；注意循环里闭包共享变量的坑（用 `let` 或 IIFE 解决）。
- **`this`**：谁调用指向谁；箭头函数无自己的 `this`，取定义时外层 `this`；`call/apply/bind` 可显式改绑。
- **异步与单线程**：JS 单线程靠事件循环（Event Loop）实现异步；记住宏任务（`setTimeout`）vs 微任务（`Promise.then`），微任务先于下一个宏任务执行。
- **Promise**：3 状态（pending/fulfilled/rejected）、2 过程（resolve/reject）、链式 `then`；进阶 `async/await`、`Promise.all/race/allSettled`。
- **跨域**：同源 = 协议 + 域名 + 端口三者全同；解决主流是 CORS（服务端设 `Access-Control-Allow-Origin`），老方案 JSONP（仅 GET）。
- **存储**：cookie 4KB、随每次 HTTP 请求发送，用于鉴权；`localStorage` 5MB 持久、`sessionStorage` 会话级，均不随请求发送。
- **CSS**：盒模型（`box-sizing: border-box` 让宽高含 padding/border）；布局优先 Flex/Grid；居中三件套（Flex `justify`+`align`、绝对定位 `transform: translate(-50%,-50%)`、`margin: auto`）。
- **算法**：先讲思路再写代码；掌握时间/空间复杂度、二分、快排、双指针、哈希；不会就说边界、退化解法、复杂度分析。
- **浏览器**：输入 URL 到渲染（DNS→TCP→请求→解析 DOM/CSSOM→渲染树→布局→绘制）；性能优化 = 减体积（压缩/合并/CDN/缓存）+ 优化渲染（懒加载、减少重排重绘）。
- **Web 安全**：XSS（转义用户输入、CSP）、CSRF（token / SameSite cookie）。
- **软技能/HR**：跳槽讲自身发展别抱怨；介绍项目铺垫亮点引导提问；谈薪先自我估值、报区间、看匹配度。

# 面试指南


## 目录

- [一、准备：简历编写和面试前准备](./01-准备-简历编写和面试前准备.html)
- [二、 一面 1：基础知识点与高频考题解析](./02-一面-1-基础知识点与高频考题解析.html)
- [三、一面 2：JS-Web-API 知识点与高频考题解析](./03-一面-2-JS-Web-API-知识点与高频考题解析.html)
- [四、一面 3：CSS-HTML 知识点与高频考题解析](./04-一面-3-CSS-HTML-知识点与高频考题解析.html)
- [五、一面 4：从容应对算法题目](./05-一面-4-从容应对算法题目.html)
- [六、一面 5：浏览器相关知识点与高频考题解析](./06-一面-5-浏览器相关知识点与高频考题解析.html)
- [七、一面 6：开发环境相关知识点与高频考题解析](./07-一面-6-开发环境相关知识点与高频考题解析.html)
- [八、二面 1：如何回答常见的软技能问题](./08-二面-1-如何回答常见的软技能问题.html)
- [九、二面 2：如何介绍项目及应对项目细节追问](./09-二面-2-如何介绍项目及应对项目细节追问.html)
- [十、HR 面：谈钱不伤感情](./10-HR-面-谈钱不伤感情.html)
- [十一、其他：面试注意事项](./11-其他-面试注意事项.html)
- [十二、总结](./12-总结.html)
