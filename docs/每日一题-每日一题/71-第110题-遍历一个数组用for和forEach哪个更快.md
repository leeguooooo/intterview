# 第110题 遍历一个数组用for和forEach哪个更快

  * `for`更快
  * `forEach`每次都要创建一个函数来调用，而`for`不会创建函数
  * 函数需要额外的作用域会有额外的开销
  * 越“低级”的代码，性能往往越好
```js
    const arr = []
    for (let i = 0; i < 100 * 10000; i++) {
      arr.push(i)
    }
    const length = arr.length
    
    console.time('for')
    let n1 = 0
    for (let i = 0; i < length; i++) {
      n1++
    }
    console.timeEnd('for') // 3.7ms
    
    console.time('forEach')
    let n2 = 0
    arr.forEach(() => n2++)
    console.timeEnd('forEach') // 15.1ms
```
