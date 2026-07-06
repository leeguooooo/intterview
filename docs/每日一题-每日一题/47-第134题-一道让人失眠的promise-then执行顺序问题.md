---
title: "一道让人失眠的promise then执行顺序问题"
---

# 第134题 一道让人失眠的promise then执行顺序问题
```js
    Promise.resolve().then(()=>{
      console.log(0)
      return Promise.resolve(4)
    }).then((res)=>{
      console.log(res)
    }).then(()=>{
      console.log(5.5)
    })
    
    Promise.resolve().then(()=>{
      console.log(1)
    }).then(()=>{
      console.log(2)
    }).then(()=>{
      console.log(3)
    }).then(()=>{
      console.log(5)
    }).then(()=>{
      console.log(6)
    })
```**答案**  
```js
    // 答案
    
    0 
    1 
    2 
    3 
    4 
    5 
    5.5
    6
```

**分析**

  * **回顾JS知识**
    * 单线程，异步
    * 事件循环`Event Loop`
    * 宏任务和微任务
  * **then交替执行**
    * 如果有多个`fulfilled`的实例，通知执行`then`链式调用
    * `then`会`交替执行`
    * 这是编译器优化，防止一个`promise`占据太久时间
```js
        // fulfilled状态
    Promise.resolve().then(() => {
      console.log(10)
    }).then(() => {
      console.log(20)
    }).then(() => {
      console.log(30)
    }).then(() => {
      console.log(40)
    }).then(() =>{
      console.log(50)
    })
    // fulfilled状态
    Promise.resolve().then(() => {
      console.log(100)
    }).then(() => {
      console.log(200)
    }).then(() => {
      console.log(300)
    }).then(() => {
      console.log(400)
    }).then(() =>{
      console.log(500)
    })
    // 交替执行结果是：10 100 20 200 30 300 40 400 50 500
```

  * **then中返回新的promise实例**
    * 相当多出一个`promise`实例
    * 也会遵循`交替执行`
    * 但和直接声明一个`promise`实例，结果有些差异
    * `then`中返回新的`promise`实例，会出现`慢两拍`的效果 
      * 第一拍：`promise`需要由`pending`变为`fulfilled`
      * 第二拍：`then`函数挂载到`微任务队列`
```js
        Promise.resolve().then(()=>{
      console.log(0)
      // 返回新的promise实例，慢两拍，所以先下面的2、3才到这里的4
      return Promise.resolve(4) // 第一拍：promise需要由pending变为fulfilled
    }).then((res)=>{ // 第二拍：把then后面的任务放到[微任务队列]
      console.log(res)
    }).then(()=>{
      console.log(5.5)
    })
    // 模拟慢两拍的情况
    /**
     * Promise.resolve().then(()=>{
        // 第一拍：改变状态
        const p = Promise.resolve(4)
        Promise.resolve().then(()=>{
          // 第二拍：把then函数挂载上
          p.then(res=>console.log(res))
        })
      })
     */
    
    Promise.resolve().then(()=>{
      console.log(1)
    }).then(()=>{
      console.log(2)
    }).then(()=>{
      console.log(3)
    }).then(()=>{
      console.log(5) // 执行5 交替执行-在返回第一个Promise.resolve()看有没有then，执行5.5 最后在交替执行下面的6
    }).then(()=>{
      console.log(6)
    })
    // 结果 0 1 2 3 4 5 5.5 6
```
