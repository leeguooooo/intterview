---
title: "Vue"
---

# Vue

## 简版速记

> 面试前快速过一遍的高频考点，每条都是「问到时能立刻说出口」的精炼版。

- **MVVM**：`Model-View-ViewModel`，`ViewModel` 通过双向绑定连接数据与视图；Vue 借鉴该思想但本质是 MVVM 的「响应式 + 数据驱动视图」。
- **响应式原理（Vue2）**：`Object.defineProperty` 劫持每个属性的 `getter/setter`；getter 收集依赖（Dep 收集 Watcher），setter 派发更新（`dep.notify()`）。**缺陷**：无法监听新增/删除属性（需 `Vue.set`/`Vue.delete`）、数组索引和 `length` 改动；需递归遍历，深层对象有性能开销。
- **响应式原理（Vue3）**：`Proxy + Reflect` 惰性代理整个对象，**天然支持新增/删除属性与数组索引**，按需递归（访问时才代理嵌套对象），性能更好。
- **数组监听**：Vue2 重写了 7 个变异方法（`push/pop/shift/unshift/splice/sort/reverse`）的原型来触发更新；直接改索引/length 不生效。
- **依赖收集**：每个响应式属性持有一个 `Dep`，渲染时 `Watcher` 读取触发 getter → 把当前 Watcher 收进 Dep；数据变化时 Dep 通知所有 Watcher 更新。
- **`nextTick`**：DOM 更新是异步的，`nextTick` 把回调放进微任务队列（优先 `Promise.then`，降级 `MutationObserver`/`setImmediate`/`setTimeout`），在本轮 DOM 更新后执行。
- **`computed` vs `watch`**：`computed` 有缓存（依赖不变不重算）、用于派生值；`watch` 无缓存、用于「数据变化执行副作用」（异步/开销大的操作）。
- **diff 算法**：同层比较 + 双端比较（头头、尾尾、头尾、尾头）+ `key` 复用节点；`key` 必须唯一稳定，避免用 index 作 key。
- **生命周期**：`beforeCreate → created（可访问 data，不可访问 DOM）→ beforeMount → mounted（可访问 DOM）→ beforeUpdate → updated → beforeDestroy/beforeUnmount → destroyed/unmounted`；`keep-alive` 额外有 `activated/deactivated`。数据请求一般放 `created`（SSR 友好）或 `mounted`。
- **`v-if` vs `v-show`**：`v-if` 真正增删 DOM、有更高切换开销、惰性；`v-show` 只切 `display`、初始渲染开销大、切换频繁用它。
- **`v-if` 与 `v-for`**：Vue2 中 `v-for` 优先级更高（同元素上会先循环再判断，浪费），Vue3 中 `v-if` 优先级更高；都应避免同元素混用，改用计算属性过滤。
- **组件 `data` 为函数**：每个组件实例需独立数据副本，函数返回新对象避免实例间共享引用。
- **双向绑定 `v-model`**：语法糖 = `:value` + `@input`（Vue2）；Vue3 默认 `modelValue` + `update:modelValue`，支持多个 `v-model` 与自定义参数。
- **组件通信**：`props/$emit`、`$attrs/$listeners`（Vue3 合并到 `$attrs`）、`provide/inject`、`ref`、`EventBus`、`Vuex/Pinia`。
- **`keep-alive`**：缓存组件实例（LRU，`max`/`include`/`exclude`），命中缓存触发 `activated/deactivated` 而非重新创建。
- **状态管理**：Vue2 用 Vuex（`state/getters/mutations/actions`）；Vue3 推荐 **Pinia**（去掉 mutation、原生 TS 友好、扁平 store、支持插件）。
- **Vue3 核心升级**：`Proxy` 响应式、Composition API（`<script setup>`）、更好的 TS 支持、Tree-shaking 体积更小、Fragment/Teleport/Suspense、编译期静态提升与 patchFlag 优化。
- **异步渲染原因**：避免同一事件循环内对同一数据多次修改导致重复渲染，合并到 nextTick 批量更新提升性能。


## 目录

- [1 谈谈你对MVVM的理解](./01-1-谈谈你对MVVM的理解.html)
- [2 谈谈你对SPA单页面的理解](./02-2-谈谈你对SPA单页面的理解.html)
- [3 Vue2.x 响应式数据原理](./03-3-Vue2-x-响应式数据原理.html)
- [4 Vue3.x 响应式数据原理](./04-4-Vue3-x-响应式数据原理.html)
- [5 Vue中如何检测数组变化](./05-5-Vue中如何检测数组变化.html)
- [6 Vue中如何进行依赖收集？](./06-6-Vue中如何进行依赖收集.html)
- [7 Vue实例挂载的过程中发生了什么](./07-7-Vue实例挂载的过程中发生了什么.html)
- [8 理解Vue运行机制全局概览](./08-8-理解Vue运行机制全局概览.html)
- [9 如何理解Vue中模板编译原理](./09-9-如何理解Vue中模板编译原理.html)
- [10 Vue生命周期相关](./10-10-Vue生命周期相关.html)
- [11 Vue.mixin的使用场景和原理](./11-11-Vue-mixin的使用场景和原理.html)
- [12 Vue组件data为什么必须是个函数？](./12-12-Vue组件data为什么必须是个函数.html)
- [13 nextTick在哪里使用？原理是？](./13-13-nextTick在哪里使用-原理是.html)
- [14 computed和watch相关](./14-14-computed和watch相关.html)
- [15 Vue.set的实现原理](./15-15-Vue-set的实现原理.html)
- [16 Vue diff算法相关问题](./16-16-Vue-diff算法相关问题.html)
- [17 Vue组件相关](./17-17-Vue组件相关.html)
- [18 为什么Vue采用异步渲染](./18-18-为什么Vue采用异步渲染.html)
- [19 v-if和v-show区别](./19-19-v-if和v-show区别.html)
- [20 v-if和v-for哪个优先级更高](./20-20-v-if和v-for哪个优先级更高.html)
- [21 Vue的事件绑定原理](./21-21-Vue的事件绑定原理.html)
- [22 Vue 是如何实现数据双向绑定的](./22-22-Vue-是如何实现数据双向绑定的.html)
- [23 v-model双向绑定原理](./23-23-v-model双向绑定原理.html)
- [24 什么是作用域插槽](./24-24-什么是作用域插槽.html)
- [25 keep-alive原理](./25-25-keep-alive原理.html)
- [26 Vue路由相关](./26-26-Vue路由相关.html)
- [27 Vuex相关](./27-27-Vuex相关.html)
- [28 对Vue SSR的理解](./28-28-对Vue-SSR的理解.html)
- [29 Vue 修饰符有哪些](./29-29-Vue-修饰符有哪些.html)
- [30 说说 vue 内置指令](./30-30-说说-vue-内置指令.html)
- [31 怎样理解 Vue 的单向数据流](./31-31-怎样理解-Vue-的单向数据流.html)
- [32 写过自定义指令吗？原理是什么](./32-32-写过自定义指令吗-原理是什么.html)
- [33 Vue3相关（1/2）](./33-33-Vue3相关-1.html)
- [33 Vue3相关（2/2）](./33-33-Vue3相关-2.html)
- [34 Vue中v-html会导致哪些问题](./34-34-Vue中v-html会导致哪些问题.html)
- [35 说下$attrs和$listeners的使用场景](./35-35-说下$attrs和$listeners的使用场景.html)
- [36 在Vue中使用插件的步骤](./36-36-在Vue中使用插件的步骤.html)
- [37 vue-cli 工程技术集合介绍](./37-37-vue-cli-工程技术集合介绍.html)
- [38 delete和Vue.delete删除数组的区别？](./38-38-delete和Vue-delete删除数组的区别.html)
- [39 v-on可以监听多个方法吗？](./39-39-v-on可以监听多个方法吗.html)
- [40 v-once的使用场景有哪些](./40-40-v-once的使用场景有哪些.html)
- [41 Vue Ref的作用](./41-41-Vue-Ref的作用.html)
- [42 scoped样式穿透](./42-42-scoped样式穿透.html)
- [43 Class 与 Style 如何动态绑定](./43-43-Class-与-Style-如何动态绑定.html)
- [44 Vue为什么没有类似于React中shouldComponentUpdate的生命周期](./44-44-Vue为什么没有类似于React中shouldComponentUpdate的生命周期.html)
- [45 SPA、SSR的区别是什么](./45-45-SPA-SSR的区别是什么.html)
- [46 vue-loader是什么？它有什么作用？](./46-46-vue-loader是什么-它有什么作用.html)
- [47 说说你对slot的理解？slot使用场景有哪些](./47-47-说说你对slot的理解-slot使用场景有哪些.html)
- [48 Vue.observable你有了解过吗？说说看](./48-48-Vue-observable你有了解过吗-说说看.html)
- [49 Vue中的过滤器了解吗？过滤器的应用场景有哪些？](./49-49-Vue中的过滤器了解吗-过滤器的应用场景有哪些.html)
- [50 Vue项目中有封装过axios吗？主要是封装哪方面的？](./50-50-Vue项目中有封装过axios吗-主要是封装哪方面的.html)
- [51 说下你的vue项目的目录结构，如果是大型项目你该怎么划分结构和划分组件呢](./51-51-说下你的vue项目的目录结构-如果是大型项目你该怎么划分结构和划分组件呢.html)
- [52 从0到1自己构架一个vue项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织](./52-52-从0到1自己构架一个vue项目-说说有哪些步骤-哪些重要插件-目录结构你会怎么组织.html)
- [53 vue要做权限管理该怎么做？如果控制到按钮级别的权限怎么做](./53-53-vue要做权限管理该怎么做-如果控制到按钮级别的权限怎么做.html)
- [54 Vue项目中你是如何解决跨域的呢](./54-54-Vue项目中你是如何解决跨域的呢.html)
- [55 Vue项目本地开发完成后部署到服务器后报404是什么原因呢](./55-55-Vue项目本地开发完成后部署到服务器后报404是什么原因呢.html)
- [56 实际工作中，你总结的vue最佳实践有哪些](./56-56-实际工作中-你总结的vue最佳实践有哪些.html)
- [57 vue 中使用了哪些设计模式](./57-57-vue-中使用了哪些设计模式.html)
- [58 如果让你从零开始写一个vuex，说说你的思路](./58-58-如果让你从零开始写一个vuex-说说你的思路.html)
- [59 使用vue渲染大量数据时应该怎么优化？说下你的思路！](./59-59-使用vue渲染大量数据时应该怎么优化-说下你的思路.html)
- [60 动态给vue的data添加一个新的属性时会发生什么？怎样解决？](./60-60-动态给vue的data添加一个新的属性时会发生什么-怎样解决.html)
- [61 你是怎么处理vue项目中的错误的？](./61-61-你是怎么处理vue项目中的错误的.html)
- [62 SPA首屏加载速度慢的怎么解决](./62-62-SPA首屏加载速度慢的怎么解决.html)
- [63 Vue中常见性能优化](./63-63-Vue中常见性能优化.html)
- [64 Vue项目性能优化-详细](./64-64-Vue项目性能优化-详细.html)
- [65 Vue与Angular以及React的区别？](./65-65-Vue与Angular以及React的区别.html)
- [66 Vue2高级用法](./66-66-Vue2高级用法.html)
- [67 Vue面试考察的高频原理](./67-67-Vue面试考察的高频原理.html)
- [68 Vue面试考点答题分析](./68-68-Vue面试考点答题分析.html)
