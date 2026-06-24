# 第32题 关于async/await代码执行顺序
```javascript
    function wait (delay) {
      return new Promise(r => {
        setTimeout(() => {
          r('execute', console.log('execute'))
        }, delay)
      })
    }
    // async function series () { // 1
    //   await wait(500);
    //   await wait(500);
    //   console.log('done')
    // }
    async function series () { // 2
      const wait1 = wait(500)
      const wait2 = wait(500)
      await wait1;
      await wait2;
      console.log('done')
    }
    series()
```

  * 第一个`series()`:
```javascript
    // 1. 500ms后
    'execute'
    // 2. 500ms后
    'execute' 和 'done' 一起打印
```

  * 第二个`series`:
```javascript
    // 500ms后同时打印出
    'execute'
    'execute'
    'done'
```
