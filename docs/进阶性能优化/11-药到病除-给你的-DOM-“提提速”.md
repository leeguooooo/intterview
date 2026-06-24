# 药到病除：给你的 DOM “提提速”

知道了 DOM 慢的原因，我们就可以对症下药了。

**1\. 减少 DOM 操作：少交“过路费”、避免过度渲染**

我们来看这样一个🌰，HTML 内容如下：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>DOM操作测试</title>
    </head>
    <body>
      <div id="container"></div>
    </body>
    </html>
```

> 此时我有一个假需求——我想往 `container` 元素里写 `10000` 句一样的话。如果我这么做：
```js
    for(var count=0;count<10000;count++){ 
      document.getElementById('container').innerHTML+='<span>我是一个小测试</span>'
    } 
```

这段代码有两个明显的可优化点。

> 第一点，**过路费交太多了** 。我们每一次循环都调用 DOM 接口重新获取了一次 container 元素，相当于每次循环都交了一次过路费。前后交了
> 10000 次过路费，但其中 9999 次过路费都可以用**缓存变量** 的方式节省下来：
```js
    // 只获取一次container
    let container = document.getElementById('container')
    for(let count=0;count<10000;count++){ 
      container.innerHTML += '<span>我是一个小测试</span>'
    } 
```

> 第二点，**不必要的 DOM 更改太多了** 。我们的 10000 次循环里，修改了 10000 次 DOM 树。我们前面说过，对 DOM
> 的修改会引发渲染树的改变、进而去走一个（可能的）回流或重绘的过程，而这个过程的开销是很“贵”的。这么贵的操作，我们竟然重复执行了 N
> 多次！其实我们可以通过**就事论事** 的方式节省下来不必要的渲染：
```js
    let container = document.getElementById('container')
    let content = ''
    for(let count=0;count<10000;count++){ 
      // 先对内容进行操作
      content += '<span>我是一个小测试</span>'
    } 
    // 内容处理好了,最后再触发DOM的更改
    container.innerHTML = content
```

所谓“就事论事”，就像大家所看到的：JS 层面的事情，JS 自己去处理，处理好了，再来找 DOM 打报告。

事实上，考虑JS 的运行速度，比 DOM 快得多这个特性。我们减少 DOM 操作的核心思路，就是**让 JS 去给 DOM 分压** 。

这个思路，在 [DOM Fragment (opens new window)](https://developer.mozilla.org/zh-
CN/docs/Web/API/DocumentFragment) 中体现得淋漓尽致。

> `DocumentFragment` 接口表示一个没有父级文件的最小文档对象。它被当做一个轻量版的 `Document`
> 使用，用于存储已排好版的或尚未打理好格式的XML片段。因为 `DocumentFragment` 不是真实 DOM 树的一部分，它的变化不会引起 DOM
> 树的重新渲染的操作（`reflow`），且不会导致性能等问题。

  * 在我们上面的例子里，字符串变量 `content` 就扮演着一个 `DOM Fragment` 的角色。其实无论字符串变量也好，`DOM Fragment` 也罢，它们本质上都作为脱离了真实 DOM 树的**容器** 出现，用于缓存批量化的 DOM 操作。
  * 前面我们直接用 `innerHTML` 去拼接目标内容，这样做固然有用，但却不够优雅。相比之下，`DOM Fragment` 可以帮助我们用更加结构化的方式去达成同样的目的，从而在维持性能的同时，保住我们代码的可拓展和可维护性。我们现在用 `DOM Fragment` 来改写上面的例子：
```js
    let container = document.getElementById('container')
    // 创建一个DOM Fragment对象作为容器
    let content = document.createDocumentFragment()
    for(let count=0;count<10000;count++){
      // span此时可以通过DOM API去创建
      let oSpan = document.createElement("span")
      oSpan.innerHTML = '我是一个小测试'
      // 像操作真实DOM一样操作DOM Fragment对象
      content.appendChild(oSpan)
    }
    // 内容处理好了,最后再触发真实DOM的更改
    container.appendChild(content)
```

  * 我们运行这段代码，可以得到与前面两种写法相同的运行结果。
  * 可以看出，DOM Fragment 对象允许我们像操作真实 DOM 一样去调用各种各样的 DOM API，我们的代码质量因此得到了保证。并且它的身份也非常纯粹：当我们试图将其 append 进真实 DOM 时，它会在乖乖交出自身缓存的所有后代节点后**全身而退** ，完美地完成一个容器的使命，而不会出现在真实的 DOM 结构中。这种结构化、干净利落的特性，使得 DOM Fragment 作为经典的性能优化手段大受欢迎，这一点在 jQuery、Vue 等优秀前端框架的源码中均有体现。
  * 相比 DOM 命题的博大精深，一个简单的循环 Demo 显然不能说明所有问题。不过不用着急，在本节，我只希望大家能牢记原理与宏观思路。“药到病除”到这里才刚刚开了个头，下个小节，我们将深挖事件循环机制，从而深入 JS 层面的生产实践。
