---
title: "实现节流函数 throttle"
---

# 2 实现节流函数（throttle）

>
> 节流函数原理:指频繁触发事件时，只会在指定的时间段内执行事件回调，即触发事件间隔大于等于指定的时间才会执行回调函数。总结起来就是：**事件，按照一段时间的间隔来进行触发**
> 。

![](/images/s_poetries_work_uploads_2022_07_0abcf5e689d2716b.webp)
![](/images/s_poetries_work_uploads_2023_01_07fded84cc81ece4.webp)

> 像dom的拖拽，如果用消抖的话，就会出现卡顿的感觉，因为只在停止的时候执行了一次，这个时候就应该用节流，在一定时间内多次执行，会流畅很多

**手写简版**

使用时间戳的节流函数会在第一次触发事件时立即执行，以后每过 `wait` 秒之后才执行一次，并且最后一次触发事件不会被执行

**时间戳方式：**
```js
    // func是用户传入需要防抖的函数
    // wait是等待时间
    const throttle = (func, wait = 50) => {
      // 上一次执行该函数的时间
      let lastTime = 0
      return function(...args) {
        // 当前时间
        let now = +new Date()
        // 将当前时间和上一次执行函数时间对比
        // 如果差值大于设置的等待时间就执行函数
        if (now - lastTime > wait) {
          lastTime = now
          func.apply(this, args)
        }
      }
    }
    
    setInterval(
      throttle(() => {
        console.log(1)
      }, 500),
      1
    )
```

**定时器方式：**

> 使用定时器的节流函数在第一次触发时不会执行，而是在 delay 秒之后才执行，当最后一次停止触发后，还会再执行一次函数
```js
    function throttle(func, delay){
      var timer = 0;
      return function(){
        var context = this;
        var args = arguments;
        if(timer) return // 当前有任务了，直接返回
        timer = setTimeout(function(){
          func.apply(context, args);
          timer = 0;
        },delay);
      }
    }
```

**适用场景：**

  * 拖拽场景：固定时间内只执行一次，防止超高频次触发位置变动。`DOM` 元素的拖拽功能实现（`mousemove`）
  * 缩放场景：监控浏览器`resize`
  * 滚动场景：监听滚动`scroll`事件判断是否到页面底部自动加载更多
  * 动画场景：避免短时间内多次触发动画引起性能问题

**总结**

  * **函数防抖** ：`限制执行次数，多次密集的触发只执行一次`
    * 将几次操作合并为一次操作进行。原理是维护一个计时器，规定在`delay`时间后触发函数，但是在`delay`时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。
  * **函数节流** ：`限制执行的频率，按照一定的时间间隔有节奏的执行`
    * 使得一定时间内只触发一次函数。原理是通过判断是否到达一定时间来触发函数。
