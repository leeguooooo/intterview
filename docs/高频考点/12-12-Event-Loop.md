# 12 Event Loop

### 12.1 进程与线程

> 涉及面试题：进程与线程区别？`JS` 单线程带来的好处？

  * `JS` 是单线程执行的，但是你是否疑惑过什么是线程？
  * 讲到线程，那么肯定也得说一下进程。本质上来说，两个名词都是 `CPU` 工作时间片的一个描述。
  * 进程描述了 `CPU` 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间

> 把这些概念拿到浏览器中来说，当你打开一个 `Tab` 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、`JS`
> 引擎线程、`HTTP` 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁

  * 上文说到了 `JS` 引擎线程和渲染线程，大家应该都知道，在 `JS` 运行的时候可能会阻止 `UI` 渲染，这说明了两个线程是互斥的。这其中的原因是因为 JS 可以修改 `DOM`，如果在 `JS` 执行的时候 `UI` 线程还在工作，就可能导致不能安全的渲染 `UI`。这其实也是一个单线程的好处，得益于 `JS` 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处

### 12.2 执行栈

> 涉及面试题：什么是执行栈？

可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则

![](/images/s_poetries_work_gitee_2020_09_102.webp)

> 当开始执行 `JS` 代码时，首先会执行一个 `main`
> 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现，`foo` 函数后执行，当执行完毕后就从栈中弹出了

在开发中，大家也可以在报错中找到执行栈的痕迹
```js
    function foo() {
      throw new Error('error')
    }
    function bar() {
      foo()
    }
    bar()
```

![](/images/s_poetries_work_gitee_2020_07_fe_2.webp)

> 大家可以在上图清晰的看到报错在 `foo` 函数，`foo` 函数又是在 `bar` 函数中调用的

当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题
```js
    function bar() {
      bar()
    }
    bar()
```

![](/images/s_poetries_work_gitee_2020_07_fe_1.webp)

### 12.3 浏览器中的 Event Loop

![事件循环：执行同步代码 → 清空微任务队列(Promise.then/queueMicrotask) → 取一个宏任务(setTimeout/I O) → 再清微任务，如此循环往复](/images/diagrams/event-loop.webp)

> 涉及面试题：异步代码执行顺序？解释一下什么是 `Event Loop` ？

> 众所周知 `JS` 是门非阻塞单线程语言，因为在最初 `JS` 就是为了和浏览器交互而诞生的。如果 `JS` 是门多线程的语言话，我们在多个线程中处理
> `DOM` 就可能会发生问题（一个线程中新加节点，另一个线程中删除节点）

  * `JS` 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 `Task`（有多种 `task`） 队列中。一旦执行栈为空，`Event Loop` 就会从 `Task` 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 `JS` 中的异步还是同步行为 

![](/images/s_poetries_work_gitee_2020_07_fe_4.webp)
```js
    console.log('script start');
    
    setTimeout(function() {
      console.log('setTimeout');
    }, 0);
    
    console.log('script end');
```

> 不同的任务源会被分配到不同的 `Task` 队列中，任务源可以分为 微任务（`microtask`） 和 宏任务（`macrotask`）。在
> `ES6` 规范中，`microtask` 称为 `jobs`，`macrotask` 称为 `task`
```javascript
    console.log('script start');
    
    setTimeout(function() {
      console.log('setTimeout');
    }, 0);
    
    new Promise((resolve) => {
        console.log('Promise')
        resolve()
    }).then(function() {
      console.log('promise1');
    }).then(function() {
      console.log('promise2');
    });
    
    console.log('script end');
    // script start => Promise => script end => promise1 => promise2 => setTimeout
```

> 以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise` 属于微任务而 `setTimeout` 属于宏任务

**微任务**

  * `process.nextTick`
  * `promise`
  * `Object.observe`
  * `MutationObserver`

**宏任务**

  * `script`
  * `setTimeout`
  * `setInterval`
  * `setImmediate`
  * `I/O`
  * `UI rendering`

> 宏任务中包括了 `script` ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务

**所以正确的一次 Event loop 顺序是这样的**

  * 执行同步代码，这属于宏任务
  * 执行栈为空，查询是否有微任务需要执行
  * 执行所有微任务
  * 必要的话渲染 `UI`
  * 然后开始下一轮 `Event loop`，执行宏任务中的异步代码

> 通过上述的 `Event loop` 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 `DOM` 的话，为了更快的响应界面响应，我们可以把操作
> `DOM` 放入微任务中

### 12.4 Node 中的 Event loop

  * `Node` 中的 `Event loop` 和浏览器中的不相同。
  * `Node` 的 `Event loop` 分为`6`个阶段，它们会按照顺序反复运行
```javascript
    ┌───────────────────────┐
    ┌─>│        timers         │
    │  └──────────┬────────────┘
    │  ┌──────────┴────────────┐
    │  │     I/O callbacks     │
    │  └──────────┬────────────┘
    │  ┌──────────┴────────────┐
    │  │     idle, prepare     │
    │  └──────────┬────────────┘      ┌───────────────┐
    │  ┌──────────┴────────────┐      │   incoming:   │
    │  │         poll          │<──connections───     │
    │  └──────────┬────────────┘      │   data, etc.  │
    │  ┌──────────┴────────────┐      └───────────────┘
    │  │        check          │
    │  └──────────┬────────────┘
    │  ┌──────────┴────────────┐
    └──┤    close callbacks    │
       └───────────────────────┘
```

**timer**

  * `timers` 阶段会执行 `setTimeout` 和 `setInterval`
  * 一个 `timer` 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟

**I/O**

  * `I/O` 阶段会执行除了 `close` 事件，定时器和 `setImmediate` 的回调

**poll**

  * `poll` 阶段很重要，这一阶段中，系统会做两件事情

    * 执行到点的定时器
    * 执行 `poll` 队列中的事件
  * 并且当 `poll` 中没有定时器的情况下，会发现以下两件事情

    * 如果 `poll` 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制
    * 如果 `poll` 队列为空，会有两件事发生
    * 如果有 `setImmediate` 需要执行，`poll` 阶段会停止并且进入到 `check` 阶段执行 `setImmediate`
    * 如果没有 `setImmediate` 需要执行，会等待回调被加入到队列中并立即执行回调
    * 如果有别的定时器需要被执行，会回到 `timer` 阶段执行回调。

**check**

  * `check` 阶段执行 `setImmediate`

**close callbacks**

  * `close callbacks` 阶段执行 `close` 事件
  * 并且在 `Node` 中，有些情况下的定时器执行顺序是随机的
```js
    setTimeout(() => {
        console.log('setTimeout');
    }, 0);
    setImmediate(() => {
        console.log('setImmediate');
    })
    // 这里可能会输出 setTimeout，setImmediate
    // 可能也会相反的输出，这取决于性能
    // 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
    // 否则会执行 setTimeout
```

> 上面介绍的都是 `macrotask` 的执行情况，`microtask` 会在以上每个阶段完成后立即执行
```js
    setTimeout(()=>{
        console.log('timer1')
    
        Promise.resolve().then(function() {
            console.log('promise1')
        })
    }, 0)
    
    setTimeout(()=>{
        console.log('timer2')
    
        Promise.resolve().then(function() {
            console.log('promise2')
        })
    }, 0)
    
    // 以上代码在浏览器和 node 中打印情况是不同的
    // 浏览器中一定打印 timer1, promise1, timer2, promise2
    // node 中可能打印 timer1, timer2, promise1, promise2
    // 也可能打印 timer1, promise1, timer2, promise2
```

> `Node` 中的 `process.nextTick` 会先于其他 `microtask` 执行
```js
    setTimeout(() => {
     console.log("timer1");
    
     Promise.resolve().then(function() {
       console.log("promise1");
     });
    }, 0);
    
    process.nextTick(() => {
     console.log("nextTick");
    });
    // nextTick, timer1, promise1
```

> 对于 `microtask` 来说，它会在以上每个阶段完成前清空 `microtask` 队列，下图中的 `Tick` 就代表了 `microtask`

![](/images/s_poetries_work_gitee_2020_07_fe_5.webp)
