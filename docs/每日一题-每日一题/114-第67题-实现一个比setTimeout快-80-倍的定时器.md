---
title: "实现一个比setTimeout快 80 倍的定时器"
---

# 第67题 实现一个比setTimeout快 80 倍的定时器

> 在浏览器中，`setTimeout()/setInterval()` 的每调用一次定时器的最小间隔是
> `4ms`，这通常是由于函数嵌套导致（嵌套层级达到一定深度）

简单来说，`5` 层以上的定时器嵌套会导致至少 `4ms` 的延迟。

用如下代码做个测试：
```js
    let a = performance.now();
    setTimeout(() => {
      let b = performance.now();
      console.log(b - a);
      setTimeout(() => {
        let c = performance.now();
        console.log(c - b);
        setTimeout(() => {
          let d = performance.now();
          console.log(d - c);
          setTimeout(() => {
            let e = performance.now();
            console.log(e - d);
            setTimeout(() => {
              let f = performance.now();
              console.log(f - e);
              setTimeout(() => {
                let g = performance.now();
                console.log(g - f);
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
```

> 在浏览器中的打印结果大概是这样的，和规范一致，第五次执行的时候延迟来到了 `4ms` 以上
```js
    // 结果是
    1.2999999970197678
    1.5
    1.2999999970197678
    1.9000000059604645
    4.5
    4.5999999940395355
```

> 如果想在浏览器中实现 `0ms` 延时的定时器，可以用 `window.postMessage` 来实现真正 `0` 延迟的定时器
```js
    (function () {
      var timeouts = [];
      var messageName = 'zero-timeout-message';
    
      // 保持 setTimeout 的形态，只接受单个函数的参数，延迟始终为 0。
      function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, '*');
      }
    
      function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
          event.stopPropagation();
          if (timeouts.length > 0) {
            var fn = timeouts.shift();
            fn();
          }
        }
      }
    
      window.addEventListener('message', handleMessage, true);
    
      // 把 API 添加到 window 对象上
      window.setZeroTimeout = setZeroTimeout;
    })();
```

由于 `postMessage` 的回调函数的执行时机和 `setTimeout` 类似，都属于宏任务，所以可以简单利用 `postMessage` 和
`addEventListener('message')` 的消息通知组合，来实现模拟定时器的功能。

这样，执行时机类似，但是延迟更小的定时器就完成了。

再利用下面的嵌套定时器的例子来跑一下测试：
```js
    var a = performance.now();
    setZeroTimeout(() => {
      let b = performance.now();
      console.log(b - a);
      setZeroTimeout(() => {
        let c = performance.now();
        console.log(c - b);
        setZeroTimeout(() => {
          let d = performance.now();
          console.log(d - c);
          setZeroTimeout(() => {
            let e = performance.now();
            console.log(e - d);
            setZeroTimeout(() => {
              let f = performance.now();
              console.log(f - e);
              setZeroTimeout(() => {
                let g = performance.now();
                console.log(g - f);
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
```  
```js
    // 结果
    0.30000000447034836
    0.19999999552965164
    0.10000000149011612
    0.10000000149011612
    0.10000000149011612
    0.10000000149011612
```

全部在 `0.1 ~ 0.3` 毫秒级别，而且不会随着嵌套层数的增多而增加延迟

**有什么场景需要无延迟的定时器？其实在 React 的源码中，做时间切片的部分就用到了**
```js
    // 伪代码
    
    const channel = new MessageChannel();
    const port = channel.port2;
    
    // 每次 port.postMessage() 调用就会添加一个宏任务
    // 该宏任务为调用 scheduler.scheduleTask 方法
    channel.port1.onmessage = scheduler.scheduleTask;
    
    const scheduler = {
      scheduleTask() {
        // 挑选一个任务并执行
        const task = pickTask();
        const continuousTask = task();
    
        // 如果当前任务未完成，则在下个宏任务继续执行
        if (continuousTask) {
          port.postMessage(null);
        }
      },
    };
```

> React 把任务切分成很多片段，这样就可以通过把任务交给 `postMessage`
> 的回调函数，来让浏览器主线程拿回控制权，进行一些更优先的渲染任务（比如用户输入）

为什么不用执行时机更靠前的微任务呢？关键的原因在于微任务会在渲染之前执行，这样就算浏览器有紧急的渲染任务，也得等微任务执行完才能渲染
