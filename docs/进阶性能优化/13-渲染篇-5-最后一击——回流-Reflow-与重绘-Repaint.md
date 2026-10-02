---
title: "渲染篇 最后一击——回流 Reflow 与重绘 Repaint"
---

# 回流（Reflow）与重绘（Repaint）

## 核心要点

- **回流**（也叫重排）：DOM 改动让元素的尺寸或位置变了，浏览器得重新算一遍布局，受牵连的父节点、兄弟节点、子节点都要跟着重算，算完再画。
- **重绘**：改动只影响外观（颜色、背景、`visibility` 等），几何信息不变，浏览器跳过布局，直接重新绘制。
- 两者的关系：**回流之后必然重绘，重绘不一定伴随回流**。回流做的事更多，代价更高，但两者都要花性能，能少则少。
- 触发回流的操作按代价大致分三类：改几何属性（最贵）、增删移动节点（中等）、读取需要即时计算的布局属性（最隐蔽）。
- 浏览器会把样式改动攒成一个队列，等到下一帧渲染时一次性处理，所以连续写四个样式通常只看到一次 Layout、一次 Paint。
- 但只要在中途读取 `offsetTop`、`clientWidth`、`getComputedStyle()` 这类值，浏览器就得把队列立刻清空、当场布局，批处理被打断。这叫**强制同步布局**，在循环里反复出现就是**布局抖动**。
- 常用的规避办法：把布局读数缓存在变量里、读写分离；用 class 一次性切换多条样式；把要大量修改的 DOM 先「离线」再放回；动画优先用 `transform` / `opacity`。
- 浏览器自带批处理并不意味着可以不管：自己写的读操作随时会打断它，老旧或低端环境的表现也不可控，养成好的写法才稳。

## 先把两个概念分清

浏览器把 DOM 和 CSS 变成屏幕上的像素，要经过样式计算、布局、绘制、合成几个阶段。改动一个样式之后，浏览器要从哪一步开始重跑，取决于这个样式影响到了什么：

![不同属性改动对应的渲染阶段：几何属性触发布局和绘制，外观属性只触发绘制，transform/opacity 只走合成](/images/rewrite/perf-reflow-repaint/pipeline-cost.webp)

| | 回流（Reflow / 重排） | 重绘（Repaint） |
| --- | --- | --- |
| 触发条件 | 元素的几何信息变了：宽高、内外边距、位置、显示与否 | 只有外观变了，几何信息不变 |
| 典型属性 | `width`、`height`、`padding`、`margin`、`border`、`top`、`left`、`display`、`font-size` | `color`、`background-color`、`visibility`、`outline`、`box-shadow` |
| 浏览器要做的事 | 重新计算布局（波及相关节点）→ 重新绘制 | 直接重新绘制该元素 |
| 代价 | 高 | 相对低 |

为什么「回流必然导致重绘，反过来不成立」？因为布局变了，像素一定要重新画；但像素重新画，不代表布局需要重新算。

这里有一个容易混的点：`visibility: hidden` 只是让元素看不见，元素仍然占着原来的位置，所以只引起重绘；`display: none` 则把元素从布局里拿掉，周围的元素会补位，会引起回流。

## 哪些操作会引起回流

重绘的触发条件比较好认：凡是改了样式、又没有动到几何信息的，都属于重绘。真正需要留心的是回流。想减少回流，最根本的办法是从源头上少做会引起回流的操作。按代价从高到低，可以分成三类。

### 1. 改几何属性：最贵

一个元素的尺寸或位置变了，影响不会只停在它自己身上。父元素可能被撑高，后面的兄弟可能被挤下去，子元素的百分比宽度要重算……一处改动可能连锁地带动一大片节点重新布局。

会影响几何信息的属性很多，典型的像 `height`、`width`、`margin`、`padding`、`border`、`left`、`top`、`font-size`。没必要把完整列表背下来：写样式时改一下属性，看页面上有没有别的东西跟着挪位、跟着变大变小，就能判断它会不会影响布局。多动手试几次，自然会有直觉。实在拿不准，可以打开 Chrome DevTools 的 Performance 面板录一段，看有没有出现 Layout 事件。

### 2. 改 DOM 结构：中等

插入、删除、移动节点都会改变布局树。浏览器布局的大致顺序是从上到下、从左到右，类似对树做一次前序遍历。正常文档流里，一个元素的变化一般不会回头影响排在它前面、已经算好的元素，主要波及的是它后面的内容。所以在列表末尾追加节点，通常比在开头插入受影响的范围小。

### 3. 读取需要即时计算的属性：最容易忽略

很多人以为只有「写」才会引起回流，其实「读」也会。下面这些属性的值都依赖最新的布局结果：

| 分组 | 属性 |
| --- | --- |
| offset 系列 | `offsetWidth`、`offsetHeight`、`offsetTop`、`offsetLeft` |
| scroll 系列 | `scrollWidth`、`scrollHeight`、`scrollTop`、`scrollLeft` |
| client 系列 | `clientWidth`、`clientHeight`、`clientTop`、`clientLeft` |
| 方法 | `getComputedStyle()`（老 IE 里对应 `currentStyle`） |

浏览器为了返回此刻准确的数值，必须先把还没处理的样式改动算掉，必要时当场做一次布局。同样会带来这个问题的还有 `getBoundingClientRect()`、`innerText`、`scrollIntoView()`、`focus()`、`window.innerWidth` / `innerHeight` 等。

> 说得更准确一点：读这些属性本身并不一定引起回流。只有在读之前已经有尚未处理、而且会影响布局的改动时，浏览器才不得不提前布局。如果布局本来就是最新的，读取几乎不花什么成本。这一点正是下面「读写分离」能奏效的原因。

## 浏览器的渲染队列：改四次，只算一次

先看一个问题。下面给一个弹窗面板连续写四个样式：

```js
const panel = document.querySelector('.settings-panel')
panel.style.width = '320px'
panel.style.height = '480px'
panel.style.border = '2px solid #3eaf7c'
panel.style.color = '#2c3e50'
```

浏览器会回流、重绘多少次？

按前面的分类，很容易得出「`width`、`height`、`border` 各一次回流，`color` 一次重绘」。但在 Chrome 的 Performance 面板里录一下，主线程上只会看到**一次 Layout 和一次 Paint**：

![四次样式写入在脚本执行期间只被标记，到下一帧统一完成一次样式计算、一次布局和一次绘制](/images/rewrite/perf-reflow-repaint/batched-frame.webp)

原因是浏览器并不会每写一次样式就立刻重新布局。它把这些改动先记下来，把相关节点标记为「需要重新计算」，放进一个待处理的队列（常被称为 flush 队列或渲染队列）。等到下一帧真正要出画面、队列里积累的改动足够多，或者遇到不得不马上给出结果的时刻，再一次性处理。脚本里改了四次，最后只结算一次。

问题出在「不得不马上给出结果」这种情况上。前面第 3 类里那些需要即时计算的属性，一旦在队列里还有改动时被读取，浏览器为了给出准确值，就只能提前清空队列、立刻布局。这就是**强制同步布局**（Forced Synchronous Layout）。如果在循环里写一次、读一次、再写一次，每一轮都会强制布局一次，这种情况叫**布局抖动**（Layout Thrashing）：

![先写后读的循环每一轮都会触发一次强制布局，而先读、在 JS 中计算、最后一次性写入只在帧末布局一次](/images/rewrite/perf-reflow-repaint/forced-layout.webp)

在 Performance 面板里，强制同步布局的 Layout 事件会带一个红色角标，并提示「Forced reflow is a likely performance bottleneck」，点进去能看到是哪一行 JS 触发的。

## 怎么减少回流和重绘

有些操作绕不开，那就想办法让它们发生的次数少一点、范围小一点。

### 1. 把布局读数存进变量，读和写分开

场景：让一个提示气泡沿对角线移动 8 步，每步向右 12px、向下 6px。直觉的写法是每一步都读当前位置、再写新位置：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>气泡移动：反例</title>
  <style>
    .bubble {
      position: absolute;
      width: 140px;
      padding: 8px 12px;
      border-radius: 6px;
      background: #2c3e50;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="bubble" id="bubble">新消息</div>
  <script>
    const bubble = document.getElementById('bubble')
    for (let step = 0; step < 8; step++) {
      // 每一轮先读再写，下一轮读的时候上一轮的写还没结算
      bubble.style.left = bubble.offsetLeft + 12 + 'px'
      bubble.style.top = bubble.offsetTop + 6 + 'px'
    }
  </script>
</body>
</html>
```

这段代码每一轮都要读布局属性，而上一次写入还没结算，于是每一次读都是一次强制布局。改法是只读一次，把计算放在 JS 变量里完成，最后一次性写回 DOM：

```js
const bubble = document.getElementById('bubble')

// 只读一次布局信息
let nextX = bubble.offsetLeft
let nextY = bubble.offsetTop

// 纯 JS 计算，不碰 DOM
for (let step = 0; step < 8; step++) {
  nextX += 12
  nextY += 6
}

// 统一写回，交给浏览器在下一帧一起处理
bubble.style.left = nextX + 'px'
bubble.style.top = nextY + 'px'
```

用 node 写一个极简模拟就能看出差距：写样式只把节点标为「脏」，读布局属性时如果节点是脏的，就计一次强制布局。

```js
function createFakeNode() {
  let dirty = false
  const stats = { forcedLayouts: 0 }
  const box = { x: 0, y: 0 }
  const style = new Proxy({}, {
    set(target, key, value) {
      target[key] = value
      dirty = true            // 只记账，不计算
      return true
    }
  })
  function flush() {
    if (!dirty) return
    box.x = parseFloat(style.left) || 0
    box.y = parseFloat(style.top) || 0
    dirty = false
  }
  return {
    style,
    get offsetLeft() { if (dirty) stats.forcedLayouts++; flush(); return box.x },
    get offsetTop()  { if (dirty) stats.forcedLayouts++; flush(); return box.y },
    stats,
  }
}

// 反例：循环里先读后写
const bubbleA = createFakeNode()
for (let step = 0; step < 8; step++) {
  bubbleA.style.left = bubbleA.offsetLeft + 12 + 'px'
  bubbleA.style.top  = bubbleA.offsetTop  + 6  + 'px'
}

// 正例：只读一次，变量里算完，最后写一次
const bubbleB = createFakeNode()
let nextX = bubbleB.offsetLeft
let nextY = bubbleB.offsetTop
for (let step = 0; step < 8; step++) {
  nextX += 12
  nextY += 6
}
bubbleB.style.left = nextX + 'px'
bubbleB.style.top  = nextY + 'px'

const thrashCount = bubbleA.stats.forcedLayouts
console.log('反例 强制布局次数:', thrashCount)
console.log('正例 强制布局次数:', bubbleB.stats.forcedLayouts, '最终位置:', nextX, nextY)
// 反例 强制布局次数: 15
// 正例 强制布局次数: 0 最终位置: 96 48
```

反例里除了第一次读取，每次读都撞上了还没结算的写入，8 轮共 16 次读取，有 15 次是强制布局；正例一次都没有，最终位置完全相同。

当多个组件分散在各处、各自都要「读一下再写一下」时，可以把读和写分别排进队列，在同一帧里先统一读、再统一写（[fastdom](https://github.com/wilsonpage/fastdom) 这类库就是这么做的）。下面是一个能在 node 里跑的最小版本：

```js
// node 里没有 requestAnimationFrame，用 setTimeout 模拟一帧
const raf = globalThis.requestAnimationFrame || (cb => setTimeout(cb, 16))

const reads = []
const writes = []
let scheduled = false

function flushFrame() {
  // 先执行所有读，再执行所有写，读写不会交错
  reads.splice(0).forEach(job => job())
  writes.splice(0).forEach(job => job())
  scheduled = false
}

function schedule() {
  if (!scheduled) {
    scheduled = true
    raf(flushFrame)
  }
}

const measure = job => { reads.push(job); schedule() }
const mutate  = job => { writes.push(job); schedule() }

const log = []
for (const name of ['header', 'sidebar', 'footer']) {
  measure(() => log.push(`读 ${name}`))
  mutate(() => log.push(`写 ${name}`))
}
setTimeout(() => console.log(log.join(' → ')), 50)
// 读 header → 读 sidebar → 读 footer → 写 header → 写 sidebar → 写 footer
```

三个组件的调用顺序是读写交替，实际执行变成了先读完再写完，中间不会出现强制布局。

### 2. 不要一条一条改样式，用 class 一次切换

场景：消息提示条从隐藏状态变成展示状态，需要改尺寸、边框、字体颜色。逐条写 `style`：

```js
const toast = document.getElementById('toast')
toast.style.width = '280px'
toast.style.padding = '12px 16px'
toast.style.borderLeft = '4px solid #3eaf7c'
toast.style.color = '#1f6f4a'
```

把这组样式收进一个 class，JS 里只切换类名：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>提示条：用 class 合并样式</title>
  <style>
    .toast--shown {
      width: 280px;
      padding: 12px 16px;
      border-left: 4px solid #3eaf7c;
      color: #1f6f4a;
    }
  </style>
</head>
<body>
  <div id="toast">保存成功</div>
  <script>
    document.getElementById('toast').classList.add('toast--shown')
  </script>
</body>
</html>
```

逐条修改时，每一条都会单独更新一次样式，在没有批处理的环境里就意味着每条都可能引起一次回流和重绘；换成 class 之后，所有改动随一次类名变化一起提交。额外的好处是样式回到了 CSS 里，结构和表现分开，更好维护。

如果样式值是运行时算出来的、没法提前写进 class，可以用 `el.style.cssText += '; width: 280px; padding: 12px 16px'` 一次写入多条。

### 3. 把 DOM 先「离线」，改完再放回去

前面说的回流和重绘，前提都是元素正显示在页面上。如果先给元素设上 `display: none`，它就不参与布局了，之后对它做多少修改都不会引起回流和重绘。等全部改完再显示出来，这种做法叫 DOM 离线化。

比如要对一个排行榜面板做一长串调整：

```js
const board = document.getElementById('leaderboard')
board.style.width = '360px'
board.style.padding = '16px'
board.style.borderTop = '3px solid #3eaf7c'
board.style.fontSize = '15px'
// ……后面还有几十处类似的修改
```

离线化之后：

```js
const board = document.getElementById('leaderboard')
board.style.display = 'none'      // 拿下来：触发一次回流

board.style.width = '360px'
board.style.padding = '16px'
board.style.borderTop = '3px solid #3eaf7c'
board.style.fontSize = '15px'
// ……后面还有几十处类似的修改，都不会引起回流和重绘

board.style.display = 'block'     // 放回去：再触发一次回流
```

隐藏和显示本身各会引起一次回流，这是不是得不偿失？要看改动量。只改两三处的时候，离线化确实没什么优势；改动一多，元素离线期间的每一步都很便宜，付出的这两次回流就很划算了。

还有两种离线的做法，在批量插入节点时更常用：

```js
// 做法一：在 DocumentFragment 里组装好，一次性插入
const list = document.getElementById('rank-list')
const fragment = document.createDocumentFragment()
for (const player of players) {
  const li = document.createElement('li')
  li.textContent = `${player.name}　${player.score} 分`
  fragment.appendChild(li)
}
list.appendChild(fragment)   // 只在这里动一次真实 DOM

// 做法二：克隆一份离线副本，改完整体替换
const draft = list.cloneNode(true)
draft.querySelectorAll('li').forEach(li => li.classList.add('rank-item'))
list.replaceWith(draft)
```

另外要注意：离线期间不要去读这个元素的布局属性，`display: none` 的元素读出来的 `offsetWidth` 等都是 0。

### 4. 其他值得知道的做法

- **动画用 `transform` 和 `opacity`**：位移用 `transform: translate()` 代替改 `top` / `left`，渐隐用 `opacity`。元素在独立的合成图层上时，这两个属性只需要合成，不回流也不重绘。可以提前用 `will-change: transform` 提示浏览器，但不要滥用，每个图层都占内存。
- **让动画元素脱离文档流**：需要频繁变化尺寸的元素设成 `position: absolute` 或 `fixed`，它的变化就不会挤动周围的布局，回流的范围小得多。
- **用 `contain` 圈定影响范围**：`contain: layout` 或 `contain: content` 告诉浏览器这个元素内部的变化不会影响外部，布局可以只在局部重算。长列表里离屏的部分还可以用 `content-visibility: auto` 直接跳过渲染。
- **避免 table 布局**：表格里一个单元格的变化可能导致整张表重新计算宽度。
- **用 `requestAnimationFrame` 安排写操作**：把视觉相关的改动放进 rAF 回调，和浏览器的帧节奏对齐，不会在一帧里重复布局。

## 浏览器已经会批处理，为什么还要自己操心

既然浏览器会把改动攒起来统一处理，开发者为什么还要在意这些细节？有两个原因。

第一，批处理很脆弱。只要自己的代码在中间读了一次布局属性，攒起来的队列就得当场清空。很多强制同步布局藏在不起眼的地方，比如一个工具函数里顺手调了 `getBoundingClientRect()`，或者第三方组件在循环里读 `offsetHeight`。浏览器的优化管不到这些情况，只有自己避开。

第二，不能假设每个用户的环境都一样。上面的性能图来自 Chrome，现代主流浏览器都有类似的批处理机制，但早年的浏览器（比如老版本 IE）在这方面就差得多，低端设备上同样的布局开销也会被放大好几倍。用户用什么设备、什么浏览器，我们控制不了。如果全靠浏览器兜底，同一个页面在不同环境下的流畅度可能差别很大。从写法上避免多余的回流和重绘，才是不依赖环境的做法。

## 面试速答模板

> 回流是 DOM 改动影响了元素的几何信息，比如宽高、位置、显示隐藏、增删节点，浏览器要重新计算布局，而且会波及相关的父子和兄弟节点，算完还要重绘；重绘是只改了颜色、背景、`visibility` 这类外观，跳过布局直接重画。所以回流一定引起重绘，重绘不一定引起回流，回流代价更大。除了改几何属性和改 DOM 结构，读取 `offsetTop`、`scrollTop`、`clientWidth`、`getComputedStyle()`、`getBoundingClientRect()` 这类需要即时计算的值也会触发回流。浏览器平时会把样式改动放进队列，到下一帧统一做一次布局和绘制，但读这些属性会让它提前清空队列、强制同步布局，在循环里读写交替就会造成布局抖动。优化手段有：缓存布局读数、读写分离（可以借助 `requestAnimationFrame` 或 fastdom）；用 class 或 `cssText` 一次性改多条样式；用 `display: none`、DocumentFragment 或 `cloneNode` 让 DOM 离线后批量修改；动画用 `transform` 和 `opacity`，频繁变化的元素脱离文档流，必要时用 `contain` 限定影响范围。
