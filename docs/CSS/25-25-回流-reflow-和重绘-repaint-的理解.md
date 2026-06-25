# 25 回流（reflow）和重绘（repaint）的理解

![回流与重绘:改几何(位置/尺寸)触发回流并必然重绘,改颜色等非几何只重绘;结合事件循环批量更新可避免频繁回流](/images/diagrams/reflow-repaint-eventloop.webp)

### 分析

在`HTML`中，每个元素都可以理解成一个盒子，在浏览器解析过程中，会涉及到回流与重绘：

  * **回流** ：布局引擎会根据各种样式计算每个盒子在页面上的大小与位置
  * **重绘** ：当计算好盒模型的位置、大小及其他属性后，浏览器根据每个盒子特性进行绘制

具体的浏览器解析渲染机制如下所示：

![](/images/s_poetries_work_uploads_2022_09_b3fc0062bac6f0ff.webp)

  * 解析HTML，生成`DOM`树，解析`CSS`，生成`CSSOM`树
  * 将`DOM`树和`CSSOM`树结合，生成渲染树(`Render Tree`)
  * `Layout`(回流):根据生成的渲染树，进行回流(`Layout`)，得到节点的几何信息（位置，大小）
  * `Painting`(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素
  * `Display`:将像素发送给`GPU`，展示在页面上

>   * 在页面初始渲染阶段，回流不可避免的触发，可以理解成页面一开始是空白的元素，后面添加了新的元素使页面布局发生改变
>   * 当我们对 `DOM` 的修改引发了
> `DOM`几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性，然后再将计算的结果绘制出来
>   * 当我们对 `DOM`的修改导致了样式的变化（`color`或`background-
> color`），却并未影响其几何属性时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式，这里就仅仅触发了重绘
>

### 如何触发

要想减少回流和重绘的次数，首先要了解回流和重绘是如何触发的

**回流触发时机**

> 回流这一阶段主要是计算节点的位置和几何信息，那么**当页面布局和几何信息发生变化的时候，就需要回流** ，如下面情况：

  * 添加或删除可见的DOM元素
  * 元素的位置发生变化
  * 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
  * 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
  * 页面一开始渲染的时候（这避免不了）
  * 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）
  * 还有一些容易被忽略的操作：获取一些特定属性的值。浏览器为了获取这些值，需要进行回流操作 
    * `offsetTop`
    * `offsetLeft`
    * `offsetWidth`
    * `offsetHeight`
    * `scrollTop`
    * `scrollLeft`
    * `scrollWidth`
    * `scrollHeight`
    * `clientTop`
    * `clientLeft`
    * `clientWidth`
    * `clientHeight`
    * 这些属性有一个共性，就是需要通过即时计算得到。因此浏览器为了获取这些值，也会进行回流
  * 除此还包括`getComputedStyle`方法，原理是一样的

> **回流过程**
> ：由于DOM的结构发生了改变，所以需要从生成DOM这一步开始，重新经过`样式计算`、`生成布局树`、`建立图层树`、再到`生成绘制列表`以及之后的显示器显示这整一个渲染过程走一遍，开销是非常大的

**重绘触发时机**

>
> 通过构造渲染树和重排（回流）阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(元素在视口内的位置和尺寸大小)，接下来就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘

触发回流一定会触发重绘

  * 当 **`DOM` 的修改导致了样式的变化**，并且没有影响几何属性的时候，会导致`重绘`(`repaint`)。
  * 重绘过程：由于没有导致 `DOM` 几何属性的变化，因此元素的位置信息不需要更新，所以当发生重绘的时候，会跳过`生存布局树`和`建立图层树`的阶段，直接到`生成绘制列表`，然后继续进行分块、生成位图等后面一系列操作。

**浏览器优化机制**

  * 由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列
  * 当你获取布局信息的操作的时候，会强制队列刷新，包括前面讲到的`offsetTop`等方法都会返回最新的数据
  * 因此浏览器不得不清空队列，触发回流重绘来返回正确的值

### 如何避免

  1. 避免频繁使用 `style`，而是采用修改`class`的方式。
  2. 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上。
  3. 批量操作 `DOM`，比如读取某元素 `offsetWidth` 属性存到一个临时变量，再去使用，而不是频繁使用这个计算属性；又比如利用 `document.createDocumentFragment()` 来添加要被添加的节点，处理完之后再插入到实际 DOM 中
  4. 也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的DOM操作不会引发回流和重绘
  5. 对于 `resize`、`scroll` 等进行防抖/节流处理。
  6. 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
  7. 利用 CSS3 的`transform`、`opacity`、`filter`这些属性可以实现合成的效果，也就是`CPU`加速。

**以下举例分析**

例如，多次修改一个把元素布局的时候，我们很可能会如下操作
```js
    const el = document.getElementById('el')
    for(let i=0;i<10;i++) {
        el.style.top  = el.offsetTop  + 10 + "px";
        el.style.left = el.offsetLeft + 10 + "px";
    }
```

每次循环都需要获取多次`offset`属性，比较糟糕，可以使用变量的形式缓存起来，待计算完毕再提交给浏览器发出重计算请求
```js
    // 缓存offsetLeft与offsetTop的值
    const el = document.getElementById('el')
    let offLeft = el.offsetLeft, offTop = el.offsetTop
    
    // 在JS层面进行计算
    for(let i=0;i<10;i++) {
      offLeft += 10
      offTop  += 10
    }
    
    // 一次性将计算结果应用到DOM上
    el.style.left = offLeft + "px"
    el.style.top = offTop  + "px"
```

我们还可避免改变样式，使用类名去合并样式
```js
    const container = document.getElementById('container')
    container.style.width = '100px'
    container.style.height = '200px'
    container.style.border = '10px solid red'
    container.style.color = 'red'
```

使用类名去合并样式
```html
    <style>
      .basic_style {
        width: 100px;
        height: 200px;
        border: 10px solid red;
        color: red;
      }
    </style>
    <script>
      const container = document.getElementById('container')
      container.classList.add('basic_style')
    </script>
```

  * 前者每次单独操作，都去触发一次渲染树更改（新浏览器不会），
  * 都去触发一次渲染树更改，从而导致相应的回流与重绘过程
  * 合并之后，等于我们将所有的更改一次性发出
  * 我们还可以通过通过设置元素属性`display: none`，将其从页面上去掉，然后再进行后续操作，这些后续操作也不会触发回流与重绘，这个过程称为**离线操作**
```js
    const container = document.getElementById('container')
    container.style.width = '100px'
    container.style.height = '200px'
    container.style.border = '10px solid red'
    container.style.color = 'red'
```

离线操作后
```js
    let container = document.getElementById('container')
    container.style.display = 'none'
    container.style.width = '100px'
    container.style.height = '200px'
    container.style.border = '10px solid red'
    container.style.color = 'red'
    ...（省略了许多类似的后续操作）
    container.style.display = 'block'
```
