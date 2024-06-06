原文链接: [https://interview.poetries.top/principle-docs/comprehensive/07-%E8%99%9A%E6%8B%9FDOM%EF%BC%88%E4%B8%80%EF%BC%89.html](https://interview.poetries.top/principle-docs/comprehensive/07-%E8%99%9A%E6%8B%9FDOM%EF%BC%88%E4%B8%80%EF%BC%89.html)

## 一、什么是 vdom

  * 用 `JS` 模拟 `DOM` 结构
  * `DOM` 变化的对比，放在 `JS` 层来做
  * 提高重绘性能

## 二、设计一个需求场景

![img](/images/s_poetries_work_gitee_2019_10_587.png)

**用jQuery实现**

![img](/images/s_poetries_work_gitee_2019_10_588.png)
![img](/images/s_poetries_work_gitee_2019_10_589.png)
![img](/images/s_poetries_work_gitee_2019_10_590.png)

**遇到的问题**

  * DOM 操作是“昂贵”的，js 运行效率高
  * 尽量减少 DOM 操作，而不是“推倒重来”
  * 项目越复杂，影响就越严重
  * vdom 即可解决这个问题

![img](/images/s_poetries_work_gitee_2019_10_591.png)

## 三、vdom 的如何应用，核心 API 是什么

**什么是 vdom**

![img](/images/s_poetries_work_gitee_2019_10_592.png)

**介绍 snabbdom**

![img](/images/s_poetries_work_gitee_2019_10_593.png)
![img](/images/s_poetries_work_gitee_2019_10_594.png)

**介绍 snabbdom - h 函数**

![img](/images/s_poetries_work_gitee_2019_10_595.png)

**介绍 snabbdom - patch 函数**

![img](/images/s_poetries_work_gitee_2019_10_596.png)

**重做jQuery的demo**

  * 使用 `data`生成 `vnode`
  * 第一次渲染，将 `vnode` 渲染到 `#container`中
  * 并将 `vnode` 缓存下来
  * 修改 `data` 之后，用新 `data` 生成 `newVnode`
  * 将 `vnode` 和 `newVnode` 对比

![img](/images/s_poetries_work_gitee_2019_10_597.png)

**核心 API**

  * `h(‘<标签名>’, {…属性…}, […子元素…])`
  * `h(‘<标签名>’, {…属性…}, ‘….’)`
  * `patch(container, vnode)`
  * `patch(vnode, newVnode)`

## 四、介绍一下 diff 算法

### 4.1 vdom 为何使用 diff 算法

  * DOM 操作是“昂贵”的，因此尽量减少 DOM 操作
  * 找出本次 DOM 必须更新的节点来更新，其他的不更新
  * 这个“找出”的过程，就需要 diff 算法

![img](/images/s_poetries_work_gitee_2019_10_598.png)

**patch(container, vnode)**

![img](/images/s_poetries_work_gitee_2019_10_599.png)
![img](/images/s_poetries_work_gitee_2019_10_600.png)

**演示过程**

![img](/images/s_poetries_work_gitee_2019_10_601.png)
![img](/images/s_poetries_work_gitee_2019_10_602.png)
![img](/images/s_poetries_work_gitee_2019_10_603.png)
![img](/images/s_poetries_work_gitee_2019_10_604.png)

### 4.2 diff 实现过程

  * `patch(container, vnode)` 和 `patch(vnode, newVnode)`
  * `createElment`
  * `updateChildren`

阅读全文

