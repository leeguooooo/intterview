---
title: "for in和for of有什么区别"
---

# 第104题 for in和for of有什么区别

**适用不同的数据类型**

  * 遍历对象：`for in`可以，`for of`不可以
  * 遍历`Map Set`：`for of`可以，`for in`不可以
  * 遍历`generator`：`for of`可以，`for in`不可以

**可枚举 vs 可迭代**

  * `for in` 用于可枚举的数据，如对象、数组、字符串，得到`key`
  * `for of` 用于可迭代的数据，如数组、字符串、`Map`、`Set`、`generator`，得到`value`
```js
    const arr = [10, 20, 30]
    for (let val of arr) { // 数组使用for of
      console.log(val)
    }
    
    const str = 'abc'
    for (let c of str) { // 字符串使用for of
      console.log(c)
    }
    
    function fn() {
      for (let arg of arguments) { // arguments使用for of
        console.log(arg)
      }
    }
    fn(100, 200, 'aaa')
    
    const pList = document.querySelectorAll('p')
    for (let p of pList) { // NodeList使用for of
      console.log(p)
    }
    
    const obj = {
      name: 'poetry',
    }
    for (let val of obj) {
      console.log(val) // 错误的，对象不可用for of
    }
    
    const set = new Set([10, 20, 30])
    for (let n of set) { // set使用for of
      console.log(n)
    }
    
    const map = new Map([
      ['x', 100],
      ['y', 200],
      ['z', 300]
    ])
    for (let n of map) {// map使用for of
      console.log(n)
    }
    
    function* foo() {
      yield 10
      yield 20
      yield 30
    }
    for (let n of foo()) { // 迭代器使用for of
      console.log(n)
    }
```

**for-await-of有什么作用**

  * `for await of`用于遍历多个`promise`
```js
    function createPromise(val) {
      return new Promise((resolve) => {
        setTimeout(() => {
            resolve(val)
        }, 1000)
      })
    }
    
    const p1 = createPromise(100)
    const p2 = createPromise(200)
    const p3 = createPromise(300)
    
    const res1 = await p1
    console.log(res1)
    const res2 = await p2
    console.log(res2)
    const res3 = await p3
    console.log(res3)
    
    const list = [p1, p2, p3]
    // Promise.all(list).then(res => console.log(res))
    // 和promise.all一个作用
    for await (let res of list) { // for await of 遍历多个promise
      console.log(res) // 同时出来，一次性调用 100 200 300
    }
    
    // ---------------------- 分割线 ----------------------
    
    const res1 = await createPromise(100)
    console.log(res1)
    const res2 = await createPromise(200)
    console.log(res2)
    const res3 = await createPromise(300)
    console.log(res3)
    
    const arr = [10, 20, 30]
    for (let num of arr) {
      const res = await createPromise(num) // 一个个出来，promise依次调用 for await of 遍历多个promise
      console.log(res)
    }
```
