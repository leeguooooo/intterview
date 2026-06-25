# 13 nextTick在哪里使用？原理是？

  * `nextTick` 中的回调是在下次 `DOM` 更新循环结束之后执行延迟回调，用于获得更新后的 `DOM`
  * 在修改数据之后立即使用这个方法，获取更新后的 `DOM`
  * 主要思路就是采用`微任务优先`的方式调用异步方法去执行 `nextTick` 包装的方法

> `nextTick` 方法主要是使用了宏任务和微任务,定义了一个异步方法.多次调用 `nextTick`
> 会将方法存入队列中，通过这个异步方法清空当前队列。所以这个 `nextTick` 方法就是异步方法

**根据执行环境分别尝试采用**

  * 先采用`Promise`
  * `Promise`不支持，再采用`MutationObserver`
  * `MutationObserver`不支持，再采用`setImmediate`
  * 如果以上都不行则采用`setTimeout`
  * 最后执行`flushCallbacks`，把`callbacks`里面的数据依次执行

![](/images/s_poetries_work_uploads_2022_08_dbe8ffb2bbf12d38.webp)

回答范例

  1. `nextTick` 中的回调是在下次 `DOM` 更新循环结束之后执行延迟回调，用于获得更新后的 `DOM`
  2. `Vue`有个异步更新策略，意思是如果数据变化，`Vue`不会立刻更新DOM，而是开启一个队列，把组件更新函数保存在队列中，在同一事件循环中发生的所有数据变更会异步的批量更新。这一策略导致我们对数据的修改不会立刻体现在DOM上，此时如果想要获取更新后的DOM状态，就需要使用`nextTick`
  3. 开发时，有两个场景我们会用到`nextTick`

  * `created`中想要获取`DOM`时
  * 响应式数据变化后获取`DOM`更新后的状态，比如希望获取列表更新后的高度

  4. `nextTick`签名如下：`function nextTick(callback?: () => void): Promise<void>`

所以我们只需要在传入的回调函数中访问最新DOM状态即可，或者我们可以`await nextTick()`方法返回的`Promise`之后做这件事

  5. 在`Vue`内部，`nextTick`之所以能够让我们看到DOM更新后的结果，是因为我们传入的`callback`会被添加到队列刷新函数(`flushSchedulerQueue`)的后面，这样等队列内部的更新函数都执行完毕，所有DOM操作也就结束了，`callback`自然能够获取到最新的DOM值

基本使用
```js
    const vm = new Vue({
        el: '#app',
        data() {
            return { a: 1 }
        }
    }); 
    
    // vm.$nextTick(() => {// [nextTick回调函数fn,内部更新flushSchedulerQueue]
    //     console.log(vm.$el.innerHTML)
    // })
    
    // 是将内容维护到一个数组里，最终按照顺序顺序。 第一次会开启一个异步任务
    
    vm.a = 'test'; // 修改了数据后并不会马上更新视图
    vm.$nextTick(() => {// [nextTick回调函数fn,内部更新flushSchedulerQueue]
        console.log(vm.$el.innerHTML)
    })
    
    // nextTick中的方法会被放到 更新页面watcher的后面去
```

相关代码如下

![](/images/s_poetries_work_uploads_2022_08_336264b6b10bd324.webp)
```js
    // src/core/utils/nextTick
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

数据更新的时候内部会调用`nextTick`
```js
    // src/core/observer/scheduler.js
    
    export function queueWatcher (watcher: Watcher) {
      const id = watcher.id
      if (has[id] == null) {
        has[id] = true
        if (!flushing) {
          queue.push(watcher)
        } else {
          // if already flushing, splice the watcher based on its id
          // if already past its id, it will be run next immediately.
          let i = queue.length - 1
          while (i > index && queue[i].id > watcher.id) {
            i--
          }
          queue.splice(i + 1, 0, watcher)
        }
        // queue the flush
        if (!waiting) {
          waiting = true
    
          if (process.env.NODE_ENV !== 'production' && !config.async) {
            flushSchedulerQueue()
            return
          }
          // 把更新方法放到数组中维护[nextTick回调函数,更新函数flushSchedulerQueue]
          /**
           * vm.a = 'test'; // 修改了数据后并不会马上更新视图
            vm.$nextTick(() => {// [fn,更新]
                console.log(vm.$el.innerHTML)
            })
           */
          nextTick(flushSchedulerQueue)
        }
      }
    }
```
