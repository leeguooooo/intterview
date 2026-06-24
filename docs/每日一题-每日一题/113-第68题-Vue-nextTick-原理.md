# 第68题 Vue nextTick 原理

> `nextTick` 中的回调是在下次 `DOM` 更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的
> `DOM`。主要思路就是采用微任务优先的方式调用异步方法去执行 `nextTick` 包装的方法
```js
    let callbacks = [];
    let pending = false;
    function flushCallbacks() {
      pending = false; //把标志还原为false
      // 依次执行回调
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
    }
    let timerFunc; //定义异步方法  采用优雅降级
    if (typeof Promise !== "undefined") {
      // 如果支持promise
      const p = Promise.resolve();
      timerFunc = () => {
        p.then(flushCallbacks);
      };
    } else if (typeof MutationObserver !== "undefined") {
      // MutationObserver 主要是监听dom变化 也是一个异步方法
      let counter = 1;
      const observer = new MutationObserver(flushCallbacks);
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true,
      });
      timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else if (typeof setImmediate !== "undefined") {
      // 如果前面都不支持 判断setImmediate
      timerFunc = () => {
        setImmediate(flushCallbacks);
      };
    } else {
      // 最后降级采用setTimeout
      timerFunc = () => {
        setTimeout(flushCallbacks, 0);
      };
    }
    
    export function nextTick(cb) {
      // 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
      callbacks.push(cb);
      if (!pending) {
        // 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
        pending = true;
        timerFunc();
      }
    }
```
