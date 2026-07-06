---
title: "虚拟DOM vdom 真的很快吗"
---

# 第109题 虚拟DOM（vdom）真的很快吗

  * `virutal DOM`，虚拟`DOM`
  * 用JS对象模拟`DOM`节点数据
  * `vdom`并不快，`JS`直接操作`DOM`才是最快的 
    * 以`vue`为例，`data`变化 => `vnode diff` => 更新`DOM` 肯定是比不过直接操作`DOM`节点快的
  * 但是"数据驱动视图"要有合适的技术方案，不能全部`DOM`重建
  * `dom`就是目前最合适的技术方案（并不是因为它快，而是合适）
  * 在大型系统中，全部更新`DOM`的成本太高，使用`vdom`把更新范围减少到最小

> 并不是所有的框架都在用`vdom`，`svelte`就不用`vdom`

![](/images/s_poetries_work_uploads_2023_01_6632a7a051a60c4c.webp)
