---
title: "减小DOM操作的性能开销"
---

# 减小DOM操作的性能开销

上一章我们讨论了渲染器是如何更新各种类型的 `VNode` 的，实际上，上一章所讲解的内容归属于完整的 `Diff` 算法之内，但并不包含核心的
`Diff` 算法。那什么才是核心的 `Diff` 算法呢？看下图：

![](/images/s_poetries_work_uploads_2024_02_7cb972d068b2d405.webp)

我们曾在上一章中讲解子节点更新的时候见到过这张图，当时我们提到**只有当新旧子节点的类型都是多个子节点时，核心`Diff`
算法才派得上用场**，并且当时我们采用了一种仅能实现目标但并不完美的算法：**遍历旧的子节点，将其全部移除；再遍历新的子节点，将其全部添加**
，如下高亮代码所示：

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

    
    
    function patchChildren(
      prevChildFlags,
      nextChildFlags,
      prevChildren,
      nextChildren,
      container
    ) {
      switch (prevChildFlags) {
        // 省略...
    
        // 旧的 children 中有多个子节点
        default:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
              // 省略...
            case ChildrenFlags.NO_CHILDREN:
              // 省略...
            default:
              // 新的 children 中有多个子节点
              // 遍历旧的子节点，将其全部移除
              for (let i = 0; i < prevChildren.length; i++) {
                container.removeChild(prevChildren[i].el)
              }
              // 遍历新的子节点，将其全部添加
              for (let i = 0; i < nextChildren.length; i++) {
                mount(nextChildren[i], container)
              }
              break
          }
          break
      }
    }
    

为了便于表述，我们把这个算法称为：**简单 Diff 算法** 。**简单 Diff 算法**
虽然能够达到目的，但并非最佳处理方式。我们经常会遇到可排序的列表，假设我们有一个由 `li` 标签组成的列表：
```html
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
```

列表中的 `li` 标签是 `ul` 标签的子节点，我们可以使用下面的数组来表示 `ul` 标签的 `children`：
```js
    [
      h('li', null, 1),
      h('li', null, 2),
      h('li', null, 3)
    ]
```

接着由于数据变化导致了列表的顺序发生了变化，新的列表顺序如下：
```js
    [
      h('li', null, 3),
      h('li', null, 1),
      h('li', null, 2)
    ]
```

新的列表和旧的列表构成了新旧 `children`，当我们使用**简单 Diff 算法** 更新这两个列表时，其操作行为可以用下图表示：

![](/images/s_poetries_work_uploads_2024_02_ac9f3b53fa31e426.webp)

在这张图中我们使用圆形表示真实 DOM 元素，用菱形表示 `VNode`，旧的 `VNode` 保存着对真实 DOM 的引用(即 `vnode.el`
属性)，新的 `VNode` 是不存在对真实 DOM 的引用的。上图描述了**简单 Diff 算法** 的操作行为，首先遍历旧的 `VNode`，通过旧
`VNode` 对真实 DOM 的引用取得真实 DOM，即可将已渲染的 DOM 移除。接着遍历新的 `VNode` 并将其全部添加到页面中。

在这个过程中我们能够注意到：更新前后的真实 DOM 元素都是 `li` 标签。那么可不可以复用 `li` 标签呢？这样就能减少“移除”和“新建” DOM
元素带来的性能开销，实际上是可以的，我们在讲解 `pathcElement` 函数时了解到，当新旧 `VNode` 所描述的是相同标签时，那么这两个
`VNode` 之间的差异就仅存在于 `VNodeData` 和 `children` 上，所以我们完全可以通过遍历新旧
`VNode`，并一一比对它们，这样对于任何一个 DOM 元素来说，由于它们都是相同的标签，所以更新的过程是不会“移除”和“新建”任何 DOM
元素的，而是复用已有 DOM 元素，需要更新的只有 `VNodeData` 和 `children`。优化后的更新操作可以用下图表示：

![](/images/s_poetries_work_uploads_2024_02_f29c1e3d3ec2e9cd.webp)

用代码实现起来也非常简单，如下高亮代码所示：

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

    
    
    function patchChildren(
      prevChildFlags,
      nextChildFlags,
      prevChildren,
      nextChildren,
      container
    ) {
      switch (prevChildFlags) {
        // 省略...
    
        // 旧的 children 中有多个子节点
        default:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
              // 省略...
            case ChildrenFlags.NO_CHILDREN:
              // 省略...
            default:
              for (let i = 0; i < prevChildren.length; i++) {
                patch(prevChildren[i], nextChildren[i], container)
              }
              break
          }
          break
      }
    }
    

通过遍历旧的 `children`，将新旧 `children` 中相同位置的节点拿出来作为一对“新旧 `VNode`”，并调用 `patch`
函数更新之。由于新旧列表的标签相同，所以这种更新方案较之前相比，省去了“移除”和“新建” DOM
元素的性能开销。而且从实现上看，代码也较之前少了一些，真可谓一举两得。但不要高兴的太早，细心的同学可能已经发现问题所在了，如上代码中我们遍历的是旧的
`children`，如果新旧 `children` 的长度相同的话，则这段代码可以正常工作，但是一旦新旧 `children`
的长度不同，这段代码就不能正常工作了，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_c51050b67f2e6cce.webp)

当新的 `children` 比旧的 `children` 的长度要长时，多出来的子节点是没办法应用 `patch`
函数的，此时我们应该把多出来的子节点作为新的节点添加上去。类似的，如果新的 `children` 比旧的 `children` 的长度要短时，我们应该把旧的
`children` 中多出来的子节点移除，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_40dce2fec8ddba9a.webp)

通过分析我们得出一个规律，我们不应该总是遍历旧的 `children`，而是应该遍历新旧 `children`
中长度较短的那一个，这样我们能够做到尽可能多的应用 `patch` 函数进行更新，然后再对比新旧 `children` 的长度，如果新的
`children` 更长，则说明有新的节点需要添加，否则说明有旧的节点需要移除。最终我们得到如下实现：

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  

    
    
    function patchChildren(
      prevChildFlags,
      nextChildFlags,
      prevChildren,
      nextChildren,
      container
    ) {
      switch (prevChildFlags) {
        // 省略...
    
        // 旧的 children 中有多个子节点
        default:
          switch (nextChildFlags) {
            case ChildrenFlags.SINGLE_VNODE:
              // 省略...
            case ChildrenFlags.NO_CHILDREN:
              // 省略...
            default:
              // 新的 children 中有多个子节点
              // 获取公共长度，取新旧 children 长度较小的那一个
              const prevLen = prevChildren.length
              const nextLen = nextChildren.length
              const commonLength = prevLen > nextLen ? nextLen : prevLen
              for (let i = 0; i < commonLength; i++) {
                patch(prevChildren[i], nextChildren[i], container)
              }
              // 如果 nextLen > prevLen，将多出来的元素添加
              if (nextLen > prevLen) {
                for (let i = commonLength; i < nextLen; i++) {
                  mount(nextChildren[i], container)
                }
              } else if (prevLen > nextLen) {
                // 如果 prevLen > nextLen，将多出来的元素移除
                for (let i = commonLength; i < prevLen; i++) {
                  container.removeChild(prevChildren[i].el)
                }
              }
              break
          }
          break
      }
    }
    

TIP

完整代码&在线体验地址：<https://codesandbox.io/s/qqxxlxzwm6>[ (opens new
window)](https://codesandbox.io/s/qqxxlxzwm6)

实际上，这个算法就是在没有 `key` 时所采用的算法，该算法是存在优化空间的，下面我们将分析如何进一步优化。
