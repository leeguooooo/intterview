# 第172题 Event Loop执行机制过程

![事件循环：执行同步代码→清空所有微任务→取一个宏任务执行，如此循环往复](/images/diagrams/event-loop.webp)

![](/images/s_poetries_work_uploads_2023_02_4fdc86445fa2367b.png)
![](/images/s_poetries_work_uploads_2023_02_0c93d362749fe612.png)
![](/images/s_poetries_work_uploads_2023_02_facd54cb3df73dd0.png)

  * 同步代码一行行放到`Call Stack`执行，执行完就出栈
  * 遇到异步优先记录下，等待时机（定时、网络请求）
  * 时机到了就移动到`Call Queue`(宏任务队列) 
    * 如果遇到微任务（如`promise.then`）放到微任务队列
    * 宏任务队列和微任务队列是分开存放的 
      * 因为微任务是`ES6`语法规定的
      * 宏任务(`setTimeout`)是浏览器规定的
  * 如果`Call Stack`为空，即同步代码执行完，`Event Loop`开始工作 
    * `Call Stack`为空，尝试先`DOM`渲染，在触发下一次`Event Loop`
  * 轮询查找`Event Loop`，如有则移动到`Call Stack`
  * 然后继续重复以上过程（类似永动机）

**DOM事件和Event Loop**

> `DOM`事件会放到`Web API中`等待用户点击，放到`Call Queue`，在移动到`Call Stack`执行

![](/images/s_poetries_work_uploads_2023_02_181bf0446f68007f.png)

  * `JS`是单线程的，异步(`setTimeout`、`Ajax`)使用回调，基于`Event Loop`
  * `DOM`事件也使用回调，`DOM`事件非异步，但也是基于`Event Loop`实现

**宏任务和微任务**

  * **介绍**
    * 宏任务：`setTimeout` 、`setInterval` 、`DOM`事件、`Ajax`
    * 微任务：`Promise.then`、`async/await`
    * 微任务比宏任务执行的更早
```js
        console.log(100)
    setTimeout(() => {
      console.log(200)
    })
    Promise.resolve().then(() => {
      console.log(300)
    })
    console.log(400)
    // 100 400 300 200
```

  * **event loop 和 DOM 渲染**
    * 每次`call stack`清空（每次轮询结束），即同步代码执行完。都是`DOM`重新渲染的机会，`DOM`结构如有改变重新渲染
    * 再次触发下一次`Event Loop`
```js
        const $p1 = $('<p>一段文字</p>')
    const $p2 = $('<p>一段文字</p>')
    const $p3 = $('<p>一段文字</p>')
    $('#container')
                .append($p1)
                .append($p2)
                .append($p3)
    
    console.log('length',  $('#container').children().length )
    alert('本次 call stack 结束，DOM 结构已更新，但尚未触发渲染')
    // （alert 会阻断 js 执行，也会阻断 DOM 渲染，便于查看效果）
    // 到此，即本次 call stack 结束后（同步任务都执行完了），浏览器会自动触发渲染，不用代码干预
    
    // 另外，按照 event loop 触发 DOM 渲染时机，setTimeout 时 alert ，就能看到 DOM 渲染后的结果了
    setTimeout(function () {
      alert('setTimeout 是在下一次 Call Stack ，就能看到 DOM 渲染出来的结果了')
    })
```

  * **宏任务和微任务的区别**
    * 宏任务：`DOM` 渲染后再触发，如`setTimeout`
    * 微任务：`DOM` 渲染前会触发，如`Promise`
```js
        // 修改 DOM
    const $p1 = $('<p>一段文字</p>')
    const $p2 = $('<p>一段文字</p>')
    const $p3 = $('<p>一段文字</p>')
    $('#container')
        .append($p1)
        .append($p2)
        .append($p3)
    
    // 微任务：渲染之前执行（DOM 结构已更新，看不到元素还没渲染）
    // Promise.resolve().then(() => {
    //     const length = $('#container').children().length
    //     alert(`micro task ${length}`) // DOM渲染了？No
    // })
    
    // 宏任务：渲染之后执行（DOM 结构已更新，可以看到元素已经渲染）
    setTimeout(() => {
      const length = $('#container').children().length
      alert(`macro task ${length}`) // DOM渲染了？Yes
    })
```

> 再深入思考一下：为何两者会有以上区别，一个在渲染前，一个在渲染后？

  * **微任务** ：`ES` 语法标准之内，`JS` 引擎来统一处理。即，不用浏览器有任何干预，即可一次性处理完，更快更及时。
  * **宏任务** ：`ES` 语法没有，`JS` 引擎不处理，浏览器（或 `nodejs`）干预处理。

![](/images/s_poetries_work_uploads_2023_02_facd54cb3df73dd0.png)
