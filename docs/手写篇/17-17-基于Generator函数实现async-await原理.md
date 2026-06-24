# 17 基于Generator函数实现async/await原理

> 核心：传递给我一个`Generator`函数，把函数中的内容基于`Iterator`迭代器的特点一步步的执行
```js
    function readFile(file) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(file);
        }, 1000);
        })
    };
    
    function asyncFunc(generator) {
        const iterator = generator(); // 接下来要执行next
      // data为第一次执行之后的返回结果，用于传给第二次执行
      const next = (data) => {
            let { value, done } = iterator.next(data); // 第二次执行，并接收第一次的请求结果 data
        
        if (done) return; // 执行完毕(到第三次)直接返回
        // 第一次执行next时，yield返回的 promise实例 赋值给了 value
        value.then(data => {
          next(data); // 当第一次value 执行完毕且成功时，执行下一步(并把第一次的结果传递下一步)
        });
      }
      next();
    };
    
    asyncFunc(function* () {
        // 生成器函数：控制代码一步步执行 
      let data = yield readFile('a.js'); // 等这一步骤执行执行成功之后，再往下走，没执行完的时候，直接返回
      data = yield readFile(data + 'b.js');
      return data;
    })
```
