---
title: "Vue为什么没有类似于React中shouldComponentUpdate的生命周期"
---

# 44 Vue为什么没有类似于React中shouldComponentUpdate的生命周期

  * 考点: `Vue`的变化侦测原理
  * 前置知识: 依赖收集、虚拟`DOM`、响应式系统

> 根本原因是`Vue`与`React`的变化侦测方式有所不同

  * 当React知道发生变化后，会使用`Virtual Dom Diff`进行差异检测，但是很多组件实际上是肯定不会发生变化的，这个时候需要 `shouldComponentUpdate` 进行手动操作来减少`diff`，从而提高程序整体的性能
  * `Vue`在一开始就知道那个组件发生了变化，不需要手动控制`diff`，而组件内部采用的`diff`方式实际上是可以引入类似于`shouldComponentUpdate`相关生命周期的，但是通常合理大小的组件不会有过量的diff，手动优化的价值有限，因此目前`Vue`并没有考虑引入`shouldComponentUpdate`这种手动优化的生命周期
