# 第69题 手写setTimeout 模拟实现 setInterval（阿里）
```js
    function mySetInterval(fn, time = 1000) {
      let timer = null,
        isClear = false;
      function interval() {
        if (isClear) {
          isClear = false;
          clearTimeout(timer);
          return;
        }
        fn();
        timer = setTimeout(interval, time);
      }
      timer = setTimeout(interval, time);
      return () => {
        isClear = true;
      };
    }
```  
```js
    // 测试
    let a = mySettimeout(() => {
      console.log(111);
    }, 1000)
    let cancel = mySettimeout(() => {
      console.log(222)
    }, 1000)
    cancel()
```
