
## 一、什么是 vdom

  * 用 `JS` 模拟 `DOM` 结构
  * `DOM` 变化的对比，放在 `JS` 层来做
  * 提高重绘性能

## 二、设计一个需求场景

![img](/images/s_poetries_work_gitee_2019_10_587.webp)

**用jQuery实现**

![img](/images/s_poetries_work_gitee_2019_10_588.webp)
![img](/images/s_poetries_work_gitee_2019_10_589.webp)
![img](/images/s_poetries_work_gitee_2019_10_590.webp)

**遇到的问题**

  * DOM 操作是“昂贵”的，js 运行效率高
  * 尽量减少 DOM 操作，而不是“推倒重来”
  * 项目越复杂，影响就越严重
  * vdom 即可解决这个问题

![img](/images/s_poetries_work_gitee_2019_10_591.webp)

## 三、vdom 的如何应用，核心 API 是什么

**什么是 vdom**

![img](/images/s_poetries_work_gitee_2019_10_592.webp)

**介绍 snabbdom**

![img](/images/s_poetries_work_gitee_2019_10_593.webp)
![img](/images/s_poetries_work_gitee_2019_10_594.webp)

**介绍 snabbdom - h 函数**

![img](/images/s_poetries_work_gitee_2019_10_595.webp)

**介绍 snabbdom - patch 函数**

![img](/images/s_poetries_work_gitee_2019_10_596.webp)

**重做jQuery的demo**

  * 使用 `data`生成 `vnode`
  * 第一次渲染，将 `vnode` 渲染到 `#container`中
  * 并将 `vnode` 缓存下来
  * 修改 `data` 之后，用新 `data` 生成 `newVnode`
  * 将 `vnode` 和 `newVnode` 对比

![img](/images/s_poetries_work_gitee_2019_10_597.webp)

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

![img](/images/s_poetries_work_gitee_2019_10_598.webp)

**patch(container, vnode)**

![img](/images/s_poetries_work_gitee_2019_10_599.webp)
![img](/images/s_poetries_work_gitee_2019_10_600.webp)

**演示过程**

![img](/images/s_poetries_work_gitee_2019_10_601.webp)
![img](/images/s_poetries_work_gitee_2019_10_602.webp)
![img](/images/s_poetries_work_gitee_2019_10_603.webp)
![img](/images/s_poetries_work_gitee_2019_10_604.webp)

### 4.2 diff 实现过程

  * `patch(container, vnode)` 和 `patch(vnode, newVnode)`
  * `createElment`
  * `updateChildren`

阅读全文

