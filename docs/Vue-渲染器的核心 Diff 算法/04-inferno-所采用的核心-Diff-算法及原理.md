---
title: "inferno 所采用的核心 Diff 算法及原理"
---

# inferno 所采用的核心 Diff 算法及原理

在 `Vue3` 中将采用另外一种核心 `Diff` 算法，它借鉴于 [ivi (opens new
window)](https://github.com/localvoid/ivi) 和 [inferno (opens new
window)](https://github.com/infernojs/inferno)，看下图：

![](/images/s_poetries_work_uploads_2024_02_43852502ee805c67.webp)

这张图来自 [js-framework-benchmark (opens new
window)](https://krausest.github.io/js-framework-
benchmark/current.html)，从上图中可以看到，在 DOM 操作的各个方面，`ivi` 和 `inferno` 都要稍优于 `vue2`
的双端比较。但总体上的性能表现并不是单纯的由核心 `Diff` 算法来决定的，我们在前面章节的讲解中已经了解到的了一些优化手段，例如**在创建`VNode`
时就确定其类型，以及在 `mount/patch` 的过程中采用位运算来判断一个 `VNode` 的类型**，在这个基础之上再配合核心的 `Diff`
算法，才使得性能上产生一定的优势，这也是 `Vue3` 接纳这种算法的原因之一，本节我们就着重讨论该核心 `Diff` 算法的实现原理。

### 相同的前置和后置元素

实际上本节介绍的 `Diff` 算法最早应用于两个不同文本之间的差异比较，在文本 `Diff` 中，真正进行核心的 `Diff`
算法之前，会有一个预处理的过程，例如可以先对两个文本进行“相等”比较：
```js
    if (text1 === text2) return
```

如果两个文本相等，则无需进行真正的 `Diff`，预处理的好处之一就是**在某些情况下能够避免`Diff`
算法的执行**，还有比这更加高效的方式吗？当然，这是一个简单的情形，除此之外，在文本的 `Diff`
中还有其他的预处理过程，其中就包含：去除**相同的前缀和后缀** 。什么意思呢？假设我们有如下两个文本：
```javascript
    TEXT1: I use vue for app development
    text2: I use react for app development
```

我们通过肉眼可以很容易的发现，这两段文本头部和尾部分别有一段相同的文本：

![](/images/s_poetries_work_uploads_2024_02_98ff5648c1f88aa0.webp)

所以真正需要进行 `Diff` 的部分就变成了：
```javascript
    text1: vue
    text2: react
```

这么做的好处是：在某些情况下，我们能够轻松的判断出单独的文本插入和删除，例如下面的例子：
```javascript
    text1: I like you
    text2: I like you too
```

这两个文本在经过去除相同的前缀和后缀之后将变成：
```javascript
    text1:
    text2: too
```

所以当预处理结束之后，如果 `text1` 为空且 `text2`
不为空，则可以认为这是一个文本插入，相反的，如果将这两个文本互换位置就是一个文本删除的案例：
```javascript
    text1: I like you too
    text2: I like you
```

则经过预处理之后将变成：
```javascript
    text1: too
    text2:
```

这代表文本被删除。

很显然，该预处理过程在上例的情况下能够避免 `Diff` 算法的执行，从而提高 `Diff` 效率。当然，换一个角度来看的话，这本身也是 `Diff`
策略的一部分，不过这显然要更高效。所以我们能否将此预处理步骤应用到 `VNode` 的 `Diff` 中呢？当然可以，来看下面的例子：

![](/images/s_poetries_work_uploads_2024_02_c305b75701e656bd.webp)

如上图所示，新旧 `children` 拥有相同的前缀节点和后缀节点，对于前缀节点，我们可以建立一个索引，指向新旧 `children`
中的第一个节点，并逐步向后遍历，直到遇到两个拥有不同 `key` 值的节点为止，如下代码所示：
```js
    // 更新相同的前缀节点
    // j 为指向新旧 children 中第一个节点的索引
    let j = 0
    let prevVNode = prevChildren[j]
    let nextVNode = nextChildren[j]
    // while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
    while (prevVNode.key === nextVNode.key) {
      // 调用 patch 函数更新
      patch(prevVNode, nextVNode, container)
      j++
      prevVNode = prevChildren[j]
      nextVNode = nextChildren[j]
    }
```

可以用下图描述这一步操作完成之后的状态：

![](/images/s_poetries_work_uploads_2024_02_34db6465517e137d.webp)

这里大家需要注意的是，当 `while` 循环终止时，索引 `j` 的值为 `1`。接着，我们需要处理的是相同的后缀节点，由于新旧 `children`
中节点的数量可能不同，所以我们需要两个索引分别指向新旧 `children` 的最后一个节点，并逐步向前遍历，直到遇到两个拥有不同 `key`
值的节点为止，如下代码所示：
```js
    // 更新相同的后缀节点
    
    // 指向旧 children 最后一个节点的索引
    let prevEnd = prevChildren.length - 1
    // 指向新 children 最后一个节点的索引
    let nextEnd = nextChildren.length - 1
    
    prevVNode = prevChildren[prevEnd]
    nextVNode = nextChildren[nextEnd]
    
    // while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
    while (prevVNode.key === nextVNode.key) {
      // 调用 patch 函数更新
      patch(prevVNode, nextVNode, container)
      prevEnd--
      nextEnd--
      prevVNode = prevChildren[prevEnd]
      nextVNode = nextChildren[nextEnd]
    }
```

可以用下图来表示这一步更新完成之后的状态：

![](/images/s_poetries_work_uploads_2024_02_551f06d3ef7d406c.webp)

同样需要注意的是，在这一步更新完成之后 `prevEnd` 的值为 `0`，`nextEnd` 的值为 `1`。实际上三个索引 `j`、`prevEnd`
和 `nextEnd` 的值至关重要，它们之间的大小关系反映了新旧 `children` 的节点状况。前面我们在讲解文本 `Diff`
的时候曾说过，当“去掉”相同的前缀和后缀之后，如果旧文本为空，且新文本不为空，则说明有新的文本内容被添加，反之则说明有旧的文本被移除。现在三个索引的值如下：
```javascript
    j: 1
    prevEnd: 0
    nextEnd: 1
```

我们发现 `j > prevEnd` 并且 `j <= nextEnd`，这说明当新旧 `children` 中相同的前缀和后缀被更新之后，旧
`children` 中的节点已经被更新完毕了，而新 `children` 中仍然有剩余节点，通过上图可以发现，新 `children` 中的 `li-d`
节点，就是这个剩余的节点。实际上新 `children` 中位于 `j` 到 `nextEnd` 之间的所有节点都应该是新插入的节点：

![](/images/s_poetries_work_uploads_2024_02_259e38c163a108f3.webp)

那么应该将这些新的节点插入到什么位置呢？观察上图，从新 `children` 中的节点顺序可以发现，新的节点都出现在 `li-b`
节点的前面，所以我们可以使用一个循环遍历索引 `j -> nextEnd` 之间的节点，并逐个将其插入到 `li-b`
节点之前，这样当循环结束之后，新的节点就被插入到了正确的位置。我们还能发现 `li-b` 节点的位置可以用 `nextEnd + 1`
表示，最终我们可以使用如下代码来实现节点的插入：
```js
    // 满足条件，则说明从 j -> nextEnd 之间的节点应作为新节点插入
    if (j > prevEnd && j <= nextEnd) {
      // 所有新节点应该插入到位于 nextPos 位置的节点的前面
      const nextPos = nextEnd + 1
      const refNode =
        nextPos < nextChildren.length ? nextChildren[nextPos].el : null
      // 采用 while 循环，调用 mount 函数挂载节点
      while (j <= nextEnd) {
        mount(nextChildren[j++], container, false, refNode)
      }
    }
```

再来看如下案例：

![](/images/s_poetries_work_uploads_2024_02_bf0d01d8591785d5.webp)

在这个案例中，当“去掉”相同的前缀和后缀之后，三个索引的值为：
```javascript
    j: 1
    prevEnd: 1
    nextEnd: 0
```

这时条件 `j > nextEnd` 并且 `j <= prevEnd` 成立，通过上图可以很容的发现，旧 `children` 中的 `li-b`
节点应该被移除，实际上更加通用的规则应该是：在旧 `children` 中有位于索引 `j` 到 `prevEnd` 之间的节点，都应该被移除。如下图所示：

![](/images/s_poetries_work_uploads_2024_02_72ad5e212e91dd09.webp)

代码实现起来也很简单，如下高亮代码所示：

  
  
  
  
  
  
  
  

  
  

    
    
    if (j > prevEnd && j <= nextEnd) {
      // j -> nextEnd 之间的节点应该被添加
      const nextPos = nextEnd + 1
      const refNode =
        nextPos < nextChildren.length ? nextChildren[nextPos].el : null
      while (j <= nextEnd) {
        mount(nextChildren[j++], container, false, refNode)
      }
    } else if (j > nextEnd) {
      // j -> prevEnd 之间的节点应该被移除
      while (j <= prevEnd) {
        container.removeChild(prevChildren[j++].el)
      }
    }
    

现在我们来观察一下总体的代码结构：

  
  
  
  

  
  
  
  
  
  
  

  
  
  
  

  
  

  
  
  
  

    
    
    // while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
    while (prevVNode.key === nextVNode.key) {
      // 调用 patch 函数更新
      // 省略...
      j++
      // 省略...
    }
    
    // while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
    while (prevVNode.key === nextVNode.key) {
      // 调用 patch 函数更新
      // 省略...
      prevEnd--
      nextEnd--
      // 省略...
    }
    
    // 满足条件，则说明从 j -> nextEnd 之间的节点应作为新节点插入
    if (j > prevEnd && j <= nextEnd) {
      // j -> nextEnd 之间的节点应该被添加
      // 省略...
    } else if (j > nextEnd) {
      // j -> prevEnd 之间的节点应该被移除
      // 省略...
    }
    

观察如上高亮的代码，我们发现，在两个 `while` 循环中，索引 `j` 和 索引 `prevEnd`、`nextEnd`
是以“从两端向中间靠拢”的趋势在变化的，而在两个 `while`
循环结束之后，我们会根据这三个索引的大小关系来决定应该做什么样的操作。现在我们思考一个问题，假设在第一个 `while` 循环结束之后，索引 `j`
的值已经大于 `prevEnd` 或 `nextEnd`，那么还有必须执行第二个 `while` 循环吗？答案是没有必要，这是因为一旦索引 `j` 大于
`prevEnd` 则说明旧 `children` 中的所有节点都已经参与了 `patch`，类似的，如果索引 `j` 大于 `nextEnd` 则说明新
`children` 中的所有节点都已经参与了
`patch`，这时当然没有必要再执行后续的操作了。所以出于性能的考虑，我们应该避免没有必要的代码执行，为了达到目的，可以使用 `javascript`
中的 `label` 语句，如下高亮代码所示：

  
  
  

  
  
  
  
  
  
  
  
  
  

  
  
  
  
  

    
    
    outer: {
      while (prevVNode.key === nextVNode.key) {
        patch(prevVNode, nextVNode, container)
        j++
        if (j > prevEnd || j > nextEnd) {
          break outer
        }
        prevVNode = prevChildren[j]
        nextVNode = nextChildren[j]
      }
      // 更新相同的后缀节点
      prevVNode = prevChildren[prevEnd]
      nextVNode = nextChildren[nextEnd]
      while (prevVNode.key === nextVNode.key) {
        patch(prevVNode, nextVNode, container)
        prevEnd--
        nextEnd--
        if (j > prevEnd || j > nextEnd) {
          break outer
        }
        prevVNode = prevChildren[prevEnd]
        nextVNode = nextChildren[nextEnd]
      }
    }
    

我们定义了 `label` 名字为 `outer` 的 `label` 语句块，并分别在两个 `while`
循环中添加了判断语句，无论在哪个循环中，只要索引 `j` 的值大于了 `prevEnd` 或 `nextEnd` 二者之一，我们就 `break`
该语句块，从而避免了无用的代码执行。

TIP

完整代码&在线体验地址：<https://codesandbox.io/s/5yo3z824vp>[ (opens new
window)](https://codesandbox.io/s/5yo3z824vp)

### 判断是否需要进行 DOM 移动

刚刚我们讲解了一个很重要的预处理思路：“去掉”相同的前置/后置节点。并且我们分析了在一些情况下这种预处理操作能够避免真正 `Diff`
算法的执行：通过判断索引的大小关系，能够提前知道哪些元素被添加，哪些元素被移除。但这毕竟属于一种特殊情况，大部分情况下可能未必如此理想，来看如下案例：

![](/images/s_poetries_work_uploads_2024_02_e84d15488ca03103.webp)

观察上图中新旧 `children` 中节点的顺序，我们发现，这个案例在应用预处理步骤之后，只有 `li-a` 节点和 `li-e` 节点能够被提前
`patch`。换句话说在这种情况下没有办法简单的通过预处理就能够结束 `Diff` 逻辑。这时我们就需要进行下一步操作，实际上无论是 `React` 的
`Diff` 算法，还是 `Vue2(snabbdom)` 的 `Diff` 算法，其重点无非就是：**判断是否有节点需要移动，以及应该如何移动**
和**寻找出那些需要被添加或移除** 的节点，而本节我们所讲解的算法也不例外，所以接下来的任务就是：判断那些节点需要移动，以及如何移动。

为了让事情更直观我们把该案例在应用预处理之后的状态用下图描述出来：

![](/images/s_poetries_work_uploads_2024_02_bd15caf79547be3b.webp)

观察上图可以发现，此时索引 `j` 既不大于 `prevEnd` 也不大于 `nextEnd`，所以如下代码将得不到执行：
```js
    // 满足条件，则说明从 j -> nextEnd 之间的节点应作为新节点插入
    if (j > prevEnd && j <= nextEnd) {
      // j -> nextEnd 之间的节点应该被添加
      // 省略...
    } else if (j > nextEnd) {
      // j -> prevEnd 之间的节点应该被移除
      // 省略...
    }
```

我们需要为这段代码添加 `else` 语句块，用来处理该案例的情况，如下高亮代码所示：

  
  
  
  
  
  
  

  

    
    
    // 满足条件，则说明从 j -> nextEnd 之间的节点应作为新节点插入
    if (j > prevEnd && j <= nextEnd) {
      // j -> nextEnd 之间的节点应该被添加
      // 省略...
    } else if (j > nextEnd) {
      // j -> prevEnd 之间的节点应该被移除
      // 省略...
    } else {
      // 在这里编写处理逻辑
    }
    

知道了应该在哪里编写处理逻辑，那么接下来我们就讲解一下该算法的思路。首先，我们需要构造一个数组 `source`，该数组的长度等于新 `children`
在经过预处理之后剩余未处理节点的数量，并且该数组中每个元素的初始值为 `-1`，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_1769ec0ba9b839e8.webp)

我们可以通过如下代码完成 `source` 数组的构造：

  
  
  
  
  
  

  
  

    
    
    if (j > prevEnd && j <= nextEnd) {
      // 省略...
    } else if (j > nextEnd) {
      // 省略...
    } else {
      // 构造 source 数组
      const nextLeft = nextEnd - j + 1  // 新 children 中剩余未处理节点的数量
      const source = []
      for (let i = 0; i < nextLeft; i++) {
        source.push(-1)
      }
    }
    

那么这个数组的作用是什么呢？通过上图可以发现，该数组中的每一个元素分别与新 `children` 中剩余未处理的节点对应，实际上 `source`
数组将用来存储**新`children` 中的节点在旧 `children` 中的位置，后面将会使用它计算出一个最长递增子序列，并用于 DOM
移动**。如下图所示：

![](/images/s_poetries_work_uploads_2024_02_cca8bd2f87113572.webp)

我们可以通过两层 `for` 循环来完成这个工作，外层循环用于遍历旧 `children`，内层循环用于遍历新 `children`：
```js
    const prevStart = j
    const nextStart = j
    // 遍历旧 children
    for (let i = prevStart; i <= prevEnd; i++) {
      const prevVNode = prevChildren[i]
      // 遍历新 children
      for (let k = nextStart; k <= nextEnd; k++) {
        const nextVNode = nextChildren[k]
        // 找到拥有相同 key 值的可复用节点
        if (prevVNode.key === nextVNode.key) {
          // patch 更新
          patch(prevVNode, nextVNode, container)
          // 更新 source 数组
          source[k - nextStart] = i
        }
      }
    }
```

如上代码所示，外层循环逐个从旧 `children` 中取出未处理的节点，并尝试在新 `children` 中寻找拥有相同 `key`
值的可复用节点，一旦找到了可复用节点，则调用 `patch` 函数更新之。接着更新 `source` 数组中对应位置的值，这里需要注意的是，由于 `k -
nextStart` 的值才是正确的位置索引，而非 `k` 本身，并且外层循环中变量 `i` 的值就代表了该节点在旧 `children`
中的位置，所以直接将 `i` 赋值给 `source[k - nextStart]` 即可达到目的，最终的效果就如上图中所展示的那样。可以看到
`source` 数组的第四个元素值仍然为初始值 `-1`，这是因为**新`children` 中的 `li-g` 节点不存在于旧 `children`
中**。除此之外，还有一件很重要的事儿需要做，即判断是否需要移动节点，判断的方式类似于 `React` 所采用的方式，如下高亮代码所示：

  
  

  
  
  
  
  
  
  
  
  
  

  
  
  
  

    
    
    const prevStart = j
    const nextStart = j
    let moved = false
    let pos = 0
    for (let i = prevStart; i <= prevEnd; i++) {
      const prevVNode = prevChildren[i]
      for (let k = nextStart; k <= nextEnd; k++) {
        const nextVNode = nextChildren[k]
        if (prevVNode.key === nextVNode.key) {
          // patch 更新
          patch(prevVNode, nextVNode, container)
          // 更新 source 数组
          source[k - nextStart] = i
          // 判断是否需要移动
          if (k < pos) {
            moved = true
          } else {
            pos = k
          }
        }
      }
    }
    

变量 `k` 代表我们在遍历新 `children` 中遇到的节点的位置索引，变量 `pos`
用来存储遇到的位置索引的最大值，一旦发现后来遇到索引比之前遇到的索引要小，即 `k < pos`，则说明需要移动操作，这时我们更新变量 `moved`
的值为 `true`，`moved` 变量将会在后面使用。

不过在进一步讲解之前，我们需要回头思考一下上面的代码存在怎样的问题？上面的代码中我们采用两层嵌套的循环，其时间复杂度为 `O(n1 * n2)`，其中
`n1` 和 `n2` 为新旧 `children` 中节点的数量，我们也可以使用 `O(n^2)` 来表示，当新旧 `children`
中节点的数量较多时，则两层嵌套的循环会带来性能的问题，出于优化的目的，我们可以为新的 `children` 中的节点构建一个 `key` 到 `位置索引`
的**索引表** ，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_8357c1d08b890091.webp)

`Index Map` 中的键是节点的 `key`，值是节点在新 `children` 中的位置索引，由于数据结构带来的优势，使得我们能够非常快速的定位旧
`children` 中的节点在新 `children` 中的位置，落实的代码如下：
```js
    const prevStart = j
    const nextStart = j
    let moved = false
    let pos = 0
    // 构建索引表
    const keyIndex = {}
    for(let i = nextStart; i <= nextEnd; i++) {
      keyIndex[nextChildren[i].key] = i
    }
    // 遍历旧 children 的剩余未处理节点
    for(let i = prevStart; i <= prevEnd; i++) {
      prevVNode = prevChildren[i]
      // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
      const k = keyIndex[prevVNode.key]
    
      if (typeof k !== 'undefined') {
        nextVNode = nextChildren[k]
        // patch 更新
        patch(prevVNode, nextVNode, container)
        // 更新 source 数组
        source[k - nextStart] = i
        // 判断是否需要移动
        if (k < pos) {
          moved = true
        } else {
          pos = k
        }
      } else {
        // 没找到
      }
    }
```

这是典型的**用空间换时间** 的方式，复杂度能够降低到 `O(n)`。但无论采用哪一种方式，最终我们的目的是**对新旧`children` 中具有相同
`key` 值的节点进行更新，同时检测是否需要移动操作**。在如上代码执行完毕之后，如果发现变量 `moved` 的值为 `true`，则说明需要移动操作。

另外在上面的代码中，我们试图拿旧 `children` 中的节点尝试去新 `children` 中寻找具有相同 `key`
值的节点，但并非总是能够找得到，当 `typeof k === 'undefined'` 时，说明该节点在新 `children`
中已经不存在了，这时我们应该将其移除，如下高亮代码所示：

  
  
  
  
  
  
  
  
  
  

  
  
  

    
    
    // 遍历旧 children 的剩余未处理节点
    for(let i = prevStart; i <= prevEnd; i++) {
      prevVNode = prevChildren[i]
      // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
      const k = keyIndex[prevVNode.key]
    
      if (typeof k !== 'undefined') {
        // 省略...
      } else {
        // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
        container.removeChild(prevVNode.el)
      }
    }
    

除此之外，我们还需要一个数量标识，用来代表**已经更新过的节点的数量** 。我们知道，**已经更新过的节点数量** 应该小于新 `children`
中需要更新的节点数量，一旦更新过的节点数量超过了新 `children`
中需要更新的节点数量，则说明该节点是多余的节点，我们也应该将其移除，如下高亮代码所示：

  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  

    
    
    let patched = 0
    // 遍历旧 children 的剩余未处理节点
    for (let i = prevStart; i <= prevEnd; i++) {
      prevVNode = prevChildren[i]
    
      if (patched < nextLeft) {
        // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
        const k = keyIndex[prevVNode.key]
        if (typeof k !== 'undefined') {
          nextVNode = nextChildren[k]
          // patch 更新
          patch(prevVNode, nextVNode, container)
          patched++
          // 更新 source 数组
          source[k - nextStart] = i
          // 判断是否需要移动
          if (k < pos) {
            moved = true
          } else {
            pos = k
          }
        } else {
          // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
          container.removeChild(prevVNode.el)
        }
      } else {
        // 多余的节点，应该移除
        container.removeChild(prevVNode.el)
      }
    }
    

变量 `patched` 将作为数量标识，它的初始值为 `0`，只有当条件 `patched < nextLeft` 不成立时，说明该节点已经不存在与新
`children` 中了，是一个多余的节点，于是我们将其移除。

TIP

完整代码&在线体验地址：<https://codesandbox.io/s/03o5plkv40>[ (opens new
window)](https://codesandbox.io/s/03o5plkv40)

### DOM 移动的方式

在上一小节，我们的主要目的有两个：1、判断出是否需要进行 DOM 移动操作，所以我们建立了 `moved` 变量作为标识，当它的值为 `true`
时则说明需要进行 DOM 移动；2、构建 `source` 数组，它的长度与“去掉”相同的前置/后置节点后新 `children`
中剩余未处理节点的数量相等，并存储着新 `children` 中的节点在旧 `children` 中位置，后面我们会根据 `source`
数组计算出一个最长递增子序列，并用于 DOM 移动操作。如下图所示：

![](/images/s_poetries_work_uploads_2024_02_8357c1d08b890091.webp)

现在我们已经可以通过判断变量 `moved` 的值来确定是否需要进行 DOM 移动操作：
```js
    if (moved) {
      // 如果 moved 为真，则需要进行 DOM 移动操作
    }
```

一旦需要进行 DOM 节点的移动，我们首先要做的就是根据 `source` 数组计算一个最长递增子序列：

  
  

  
  

    
    
    if (moved) {
      // 计算最长递增子序列
      const seq = lis(source) // [ 0, 1 ]
    }
    

TIP

什么是最长递增子序列：给定一个数值序列，找到它的一个子序列，并且子序列中的值是递增的，子序列中的元素在原序列中不一定连续。

例如给定数值序列为：[ 0, 8, 4, 12 ]

那么它的最长递增子序列就是：[0, 8, 12]

当然答案可能有多种情况，例如：[0, 4, 12] 也是可以的

TIP

我们会在下一小节讲解 `lis` 函数的实现。

上面的代码中，我们调用 `lis` 函数求出数组 `source` 的最长递增子序列为 `[ 0, 1 ]`。我们知道 `source` 数组的值为
`[2, 3, 1, -1]`，很显然最长递增子序列应该是 `[ 2, 3 ]`，但为什么计算出的结果是 `[ 0, 1 ]` 呢？其实 `[ 0, 1
]` 代表的是最长递增子序列中的各个元素在 `source` 数组中的位置索引，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_0247ef85f7193595.webp)

我们对新 `children` 中的剩余未处理节点进行了重新编号，`li-c` 节点的位置是 `0`，以此类推。而最长递增子序列是 `[ 0, 1 ]`
这告诉我们：**新`children` 的剩余未处理节点中，位于位置 `0` 和位置 `1` 的节点的先后关系与他们在旧 `children`
中的先后关系相同**。或者我们可以理解为**位于位置`0` 和位置 `1` 的节点是不需要被移动的节点**，即上图中 `li-c` 节点和 `li-d`
节点将在接下来的操作中不会被移动。换句话说只有 `li-b` 节点和 `li-g` 节点是可能被移动的节点，但是我们发现与 `li-g` 节点位置对应的
`source` 数组元素的值为 `-1`，这说明 `li-g` 节点应该作为全新的节点被挂载，所以只有 `li-b` 节点需要被移动。我们来看下图：

![](/images/s_poetries_work_uploads_2024_02_ad107acffec84302.webp)

使用两个索引 `i` 和 `j` 分别指向新 `children`
中剩余未处理节点的最后一个节点和最长递增子序列数组中的最后一个位置，并从后向前遍历，如下代码所示：
```js
    if (moved) {
      const seq = lis(source)
      // j 指向最长递增子序列的最后一个值
      let j = seq.length - 1
      // 从后向前遍历新 children 中的剩余未处理节点
      for (let i = nextLeft - 1; i >= 0; i--) {
        if (i !== seq[j]) {
          // 说明该节点需要移动
        } else {
          // 当 i === seq[j] 时，说明该位置的节点不需要移动
          // 并让 j 指向下一个位置
          j--
        }
      }
    }
```

变量 `j` 指向最长递增子序列的最后一个位置，使用 `for` 循环从后向前遍历新 `children` 中剩余未处理的子节点，这里的技巧在于 `i`
的值的范围是 `0` 到 `nextLeft - 1`，这实际上就等价于我们对剩余节点进行了重新编号。接着判断当前节点的位置索引值 `i`
是否与子序列中位于 `j` 位置的值相等，如果不相等，则说明该节点需要被移动；如果相等则说明该节点不需要被移动，并且会让 `j`
指向下一个位置。但是我们观察上图可以发现 `li-g` 节点的位置索引是 `3`，它不等于 `1`(`seq[j]`)，难道说明 `li-g`
节点需要被移动吗？其实不是，我们还可以发现与 `li-g` 节点位置对应的 `source` 数组中的元素值为 `-1`，这说明 `li-g`
节点应该作为全新的节点挂载，所以我们还需增加一个判断，优先检查一个节点是否是全新的节点：

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  

    
    
    if (moved) {
      const seq = lis(source)
      // j 指向最长递增子序列的最后一个值
      let j = seq.length - 1
      // 从后向前遍历新 children 中的剩余未处理节点
      for (let i = nextLeft - 1; i >= 0; i--) {
        if (source[i] === -1) {
          // 作为全新的节点挂载
    
          // 该节点在新 children 中的真实位置索引
          const pos = i + nextStart
          const nextVNode = nextChildren[pos]
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1
          // 挂载
          mount(
            nextVNode,
            container,
            false,
            nextPos < nextChildren.length
              ? nextChildren[nextPos].el
              : null
          )
        } else if (i !== seq[j]) {
          // 说明该节点需要移动
        } else {
          // 当 i === seq[j] 时，说明该位置的节点不需要移动
          // 并让 j 指向下一个位置
          j--
        }
      }
    }
    

如上代码的关键在于，为了将节点挂载到正确的位置，我们需要找到当前节点的真实位置索引(`i +
nextStart`)，以及当前节点的后一个节点，并挂载该节点的前面即可。这样我们就完成了 `li-g` 节点的挂载。接着循环会继续执行，索引 `i`
将指向下一个位置，即指向 `li-b` 节点，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_c76f51298d38eddc.webp)

`li-b` 节点的位置索引 `i` 的值为 `2`，由于 `source[2]` 的值为 `1`，不等于 `-1`，说明 `li-b`
节点不是全新的节点。接着会判断 `i !== seq[j]`，很显然 `2 !== 1`，这说明 `li-b`
节点是需要被移动的节点，那么应该如何移动呢？很简单，找到 `li-b` 节点的后一个节点(`li-g`)，将其插入到 `li-g` 节点的前面即可，由于
`li-g` 节点已经被挂载，所以我们能够拿到它对应的真实 DOM，如下高亮代码所示：

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  

    
    
    if (moved) {
      const seq = lis(source)
      // j 指向最长递增子序列的最后一个值
      let j = seq.length - 1
      // 从后向前遍历新 children 中的剩余未处理节点
      for (let i = nextLeft - 1; i >= 0; i--) {
        if (source[i] === -1) {
          // 作为全新的节点挂载
    
          // 该节点在新 children 中的真实位置索引
          const pos = i + nextStart
          const nextVNode = nextChildren[pos]
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1
          // 挂载
          mount(
            nextVNode,
            container,
            false,
            nextPos < nextChildren.length
              ? nextChildren[nextPos].el
              : null
          )
        } else if (i !== seq[j]) {
          // 说明该节点需要移动
    
          // 该节点在新 children 中的真实位置索引
          const pos = i + nextStart
          const nextVNode = nextChildren[pos]
          // 该节点下一个节点的位置索引
          const nextPos = pos + 1
          // 移动
          container.insertBefore(
            nextVNode.el,
            nextPos < nextChildren.length
              ? nextChildren[nextPos].el
              : null
          )
        } else {
          // 当 i === seq[j] 时，说明该位置的节点不需要移动
          // 并让 j 指向下一个位置
          j--
        }
      }
    }
    

到了这里 `li-b` 节点已经被我们移动到了正确的位置，接着会进行下一次循环，如下图所示：

![](/images/s_poetries_work_uploads_2024_02_4c6368adfcffef30.webp)

此时索引 `j` 依然指向子序列的最后一个位置，索引 `i` 的值为 `1`，它指向 `li-d` 节点。同样的，由于 `source[1]` 的值为
`3` 不等于 `-1`，说明 `li-d` 节点也不是全新的节点。接着判断 `li-d` 节点的位置索引 `i` 的值与子序列 `seq[j]`
的值相等，都为 `1`，这说明 `li-d` 节点不需要被移动，此时会把索引 `j`
指向下一个位置，结束本次循环并开启下一次循环，下一次循环时的状态如下图所示：

![](/images/s_poetries_work_uploads_2024_02_c85dd5b64334f95a.webp)

`li-c` 节点既不是新节点，也不需要被移动，至此循环结束，更新完成。

TIP

完整代码&在线体验地址：<https://codesandbox.io/s/4lrqpv0jm9>[ (opens new
window)](https://codesandbox.io/s/4lrqpv0jm9)

### 求解最长递增子序列

上一小节我们已经介绍了什么是最长递增子序列，同时我们使用 `lis`
函数求解一个给定序列的最长递增子序列，本节我们就来探索一下如何求出给定序列的最长递增子序列。

设给定的序列如下：
```javascript
    [ 0, 8, 4, 12, 2, 10 ]
```

实际上，这是一个可以利用动态规划思想求解的问题。动态规划的思想是将一个大的问题分解成多个小的子问题，并尝试得到这些子问题的最优解，子问题的最优解有可能会在更大的问题中被利用，这样通过小问题的最优解最终求得大问题的最优解。那么对于一个序列而言，它的子问题是什么呢？很简单，序列是有长度的，所以我们可以通过序列的长度来划分子问题，如上序列所示，它有
`6` 个元素，即该序列的长度为
`6`，所以我们可不可以将这个序列拆解为长度更短的序列呢？并优先求解这些长度更短的序列的最长递增子序列，进而求得原序列的最长递增子序列？答案是肯定的，假设我们取出原序列的最后一个数字单独作为一个序列，那么该序列就只有一个元素：`[
10 ]`，很显然这个只有一个元素的序列的长度为 `1`，已经不能更短了。那么序列 `[ 10 ]`
的最长递增子序列是什么呢？因为只有一个元素，所以毫无递增可言，但我们需要一个约定：**当一个序列只有一个元素时，我们认为其递增子序列就是其本身**
，所以序列 `[ 10 ]` 的最长递增子序列也是 `[ 10 ]`，其长度也是 `1`。

接着我们将子问题进行扩大，现在我们取出原序列中的最后两个数字作为一个序列，即 `[ 2, 10 ]`。对于这个序列而言，我们可以把它看作是**由序列`[ 2
]` 和序列 `[ 10 ]` 这两个序列所组成的**。并且我们观察这两个序列中的数字，发现满足条件 `2 <
10`，这满足了递增的要求，所以我们是否可以认为**序列`[ 2, 10 ]` 的最长递增子序列等于序列 `[ 2 ]` 和序列 `[ 10 ]`
这两个序列的递增子序列“之和”**？答案是肯定的，而且庆幸的是，我们在上一步中已经求得了序列 `[ 10 ]` 的最长递增子序列的长度是 `1`，同时序列
`[ 2 ]` 也是一个只有一个元素的序列，所以它的最长递增子序列也是它本身，长度也是 `1`，最后我们将两者做和，可知序列 `[ 2, 10 ]`
的最长递增子序列的长度应该是 `1 + 1 = 2`。实际上我们一眼就能够看得出来序列 `[ 2, 10 ]` 的最长递增子序列也是 `[ 2, 10
]`，其长度当然为 `2` 啦。

为了不过于抽象，我们可以画出如下图所示的格子：

![](/images/s_poetries_work_uploads_2024_02_1671dc4db3f0b758.webp)

我们为原序列中的每个数字分配一个格子，并且这些格子填充 `1` 作为初始值：

![](/images/s_poetries_work_uploads_2024_02_b15c88e922459f70.webp)

根据前面的分析，我们分别求得子问题的序列 `[ 10 ]` 和 `[ 2, 10 ]` 的最长递增子序列的长度分别为 `1` 和
`2`，所以我们修改对应的格子中的值，如下：

![](/images/s_poetries_work_uploads_2024_02_b51e0457a2138c06.webp)

如上图所示，原序列中数字 `10` 对应的格子的值依然是 `1`，因为序列 `[ 10 ]` 的最长递增子序列的长度是 `1`。而原序列中数字 `2`
对应的格子的值为 `2`，这是因为序列 `[ 2, 10 ]` 的最长递增子序列的长度是
`2`。所以你应该发现了格子中的值所代表的是**以该格子所对应的数字为开头的递增子序列的最大长度** 。

接下来我们继续扩大子问题，我们取出原序列中的最后三个数字作为子问题的序列：`[ 12, 2, 10 ]`。同样的，对于这个序列而言，我们可以把它看作是由序列
`[ 12 ]` 和序列 `[ 2, 10 ]` 这两个序列所组成的。但是我们发现条件 `12 < 2`
并不成立，这说明什么呢？实际上这说明：**以数字`12` 开头的递增子序列的最大长度就 等于 以数字 `2`
开头的递增子序列的最大长度**。这时我们不需要修改原序列中数字 `12` 所对应的格子的值，如下图所示该格子的值仍然是 `1`：

![](/images/s_poetries_work_uploads_2024_02_ab459ef95b43afe5.webp)

但是这就结束了吗？还不行，大家思考一下，刚刚我们的判断条件是 `12 < 2`，这当然是不成立的，但大家不要忘了，序列 `[ 12, 2, 10 ]`
中数字 `2` 的后面还有一个数字 `10`，我们是否要继续判断条件 `12 < 10` 是否成立呢？当然有必要，道理很简单，假设我们的序列是 `[ 12,
2, 15 ]` 的话，你会发现，如果仅仅判断条件 `12 < 2` 是不够的，虽然数字 `12` 不能和数字 `2` 构成递增的关系，但是数字 `12`
却可以和数字 `15` 构成递增的关系，因此我们得出**当填充一个格子的值时，我们应该拿当前格子对应的数字逐个与其后面的所有格子对应的数字进行比较**
，而不能仅仅与紧随其后的数字作比较。按照这个思路，我们继续判断条件 `12 < 10` 是否成立，很显然是不成立的，所以原序列中数字 `12`
对应的格子的值仍然不需要改动，依然是 `1`。

接着我们进一步扩大子问题，现在我们抽取原序列中最后的四个数字作为子问题的序列：`[ 4, 12, 2, 10
]`。还是同样的思路，我们可以把这个序列看作是由序列 `[ 4 ]` 和序列 `[ 12, 2, 10 ]` 所组成的，又因为条件 `4 < 12`
成立，因此我们可以认为子问题序列的最长递增子序列的长度等于**序列`[ 4 ]` 的最长递增子序列的长度与以数字 `12`
开头的递增子序列的最大长度之和**，序列 `[ 4 ]` 的最长递增子序列的长度很显然是 `1`，而以数字 `12`
开头的递增子序列的最大长度实际上就是数字 `12` 对应的格子中的数值，我们在上一步已经求得这个值是 `1`，因此我们修改数字 `4` 对应的格子的值为
`1 + 1 = 2`：

![](/images/s_poetries_work_uploads_2024_02_31c22d597b0f4086.webp)

当然了，着同样还没有结束，我们还要判断条件 `4 < 2` 和 `4 < 10` 是否成立，原因我们在前面已经分析过了。条件 `4 < 2`
不成立，所以什么都不做，但条件 `4 < 10` 成立，我们找到数字 `10` 对应的格子中的值：`1`，将这个值加 `1` 之后的值为
`2`，这与现在数字 `4` 对应的格子中的值相等，所以也不需要改动。

到现在为止，不知道大家发现什么规律没有？如何计算一个格子中的值呢？实际很简单，规则是：

  * 1、拿该格子对应的数字 `a` 与其后面的所有格子对应的数字 `b` 进行比较，如果条件 `a < b` 成立，则用数字 `b` 对应格子中的值加 `1`，并将结果填充到数字 `a` 对应的格子中。
  * 2、只有当计算出来的值大于数字 `a` 所对应的格子中的值时，才需要更新格子中的数值。

有了这两条规则，我们就很容易填充剩余格子的值了，接下来我们来填充原序列中数字 `8` 所对应的格子的值。按照上面的分析，我们需要判断四个条件：

  * `8 < 4`
  * `8 < 12`
  * `8 < 2`
  * `8 < 10`

很显然条件 `8 < 4` 不成立，什么都不做；条件 `8 < 12` 成立，拿出数字 `12` 对应格子中的值：`1`，为这个值再加 `1` 得出的值为
`2`，大于数字 `8` 对应格子的当前值，所以更新该格子的值为 `2`；条件 `8 < 2` 也不成立，什么都不做；条件 `8 < 10` 成立，拿出数字
`10` 对应格子中的值 `1`，为这个值再加 `1` 得出的值为 `2`，不大于数字 `8` 所对应格子中的值，所以什么都不需要做，最终我们为数字 `8`
所对应的格子填充的值是 `2`：

![](/images/s_poetries_work_uploads_2024_02_fdf441cff77e4b4e.webp)

现在，就剩下原序列中数字 `0` 对应的格子的值还没有被更新了，按照之前的思路，我们需要判断的条件如下：

  * `0 < 8`
  * `0 < 4`
  * `0 < 12`
  * `0 < 2`
  * `0 < 10`

条件 `0 < 8` 成立，拿出数字 `8` 对应格子中的值 `2`，为这个值再加 `1` 得出的值为 `3`，大于数字 `0`
对应格子的当前值，所以更新该格子的值为 `3`。重复执行上面介绍的步骤，最终原序列中数字 `0` 对应格子的值就是 `3`：

![](/images/s_poetries_work_uploads_2024_02_26b78b7de0b4667b.webp)

如上图所示，现在所有格子的值都已经更新完毕，接下来我们要做的就是根据这些值，找到整个序列的最长递增子序列。那么应该如何寻找呢？很简单，实际上这些格子中的最大值就代表了整个序列的递增子序列的最大长度，上图中数字
`0` 对应格子的值为 `3`，是最大值，因此原序列的最长递增子序列一定是以数字 `0` 开头的：

![](/images/s_poetries_work_uploads_2024_02_a59d5b0f5089a1f8.webp)

接着你需要在该值为 `3` 的格子后面的所有格子中寻找数值等于 `2` 的格子，你发现，有三个格子满足条件，分别是原序列中数字 `8`、`4`、`2`
所对应的格子。假设你选取的是数字 `4`：

![](/images/s_poetries_work_uploads_2024_02_79ed601ba3ddbc27.webp)

同样的，你需要继续在数字 `4` 对应的格子后面的所有格子中寻找到数值为 `1` 的格子，你发现有两个格子是满足条件的，分别是原序列中数字 `12` 和数字
`10` 所对应的格子，我们再次随机选取一个值，假设我们选择的是数字 `10`：

![](/images/s_poetries_work_uploads_2024_02_5c1b30cad22a4350.webp)

由于格子中的最小值就是数字 `1`，因此我们不需要继续寻找了。观察上图可以发现，我们选取出来的三个数字其实就是原序列的最长递增子序列：`[ 0, 4, 10
]`。当然，你可能已经发现了，答案并非只有一个，例如：

![](/images/s_poetries_work_uploads_2024_02_a63d7f35a6dab937.webp)

关键在于，有三个格子的数值是 `2`，因此你可以有三种选择：

  * `[ 0, 8 ]`
  * `[ 0, 4 ]`
  * `[ 0, 2 ]`

当你选择的是 `[ 0, 8 ]` 时，又因为数字 `8` 对应的格子后面的格子中，有两个数值为 `1` 的格子可供选择，所以你还有两种选择：

  * `[ 0, 8, 12 ]`
  * `[ 0, 8, 10 ]`

同样的，如果你选择的是 `[ 0, 4 ]`，也有两个选择：

  * `[ 0, 4, 12 ]`
  * `[ 0, 4, 10 ]`

但当你选择 `[ 0, 2 ]` 时，你就只有一个选择：

  * `[ 0, 2, 10 ]`

这是因为数字 `2` 所对应的格子后面，只有一个格子的数值是 `1`，即数字 `10` 所对应的那个格子，因此你只有一种选择。换句话说当你选择 `[ 0,
2 ]` 时，即使数字 `12` 对应的格子的值也是 `1`，你也不能选择它，因为数字 `12` 对应的格子在数字 `2` 对应的格子之前。

以上，就是我们求得给定序列的**所有** 最长递增子序列的算法。

TIP

上面的讲解中我们优先选择数值为 `3` 的格子，实际上我们也可以从小往大的选择，即先选择数值为 `1` 的格子，道理是一样。

TIP

完整代码&在线体验地址：<https://codesandbox.io/s/32wjmo7omq>[ (opens new
window)](https://codesandbox.io/s/32wjmo7omq)
