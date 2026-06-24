# 第170题 Promise异步总结

**知识点总结**

  * **三种状态**
    * `pending`、`fulfilled`(通过`resolve`触发)、`rejected`(通过`reject`触发)
    * `pending => fulfilled`或者`pending => rejected`
    * 状态变化不可逆
  * **状态的表现和变化**
    * `pending`状态，不会触发`then`和`catch`
    * `fulfilled`状态会触发后续的`then`回调
    * `rejected`状态会触发后续的`catch`回调
  * **then和catch对状态的影响（重要）**
    * `then`正常返回`fulfilled`，里面有报错返回`rejected`
```js
        const p1 = Promise.resolve().then(()=>{
      return 100
    })
    console.log('p1', p1) // fulfilled会触发后续then回调
    p1.then(()=>{
      console.log(123)
    }) // 打印123
    
    const p2 = Promise.resolve().then(()=>{
      throw new Error('then error')
    })
    // p2是rejected会触发后续catch回调
    p2.then(()=>{
      console.log(456)
    }).catch(err=>{
      console.log(789)
    })
    // 打印789
```

    * `catch`正常返回`fulfilled`，里面有报错返回`rejected`
```js
        const p1 = Promise.reject('my error').catch(()=>{
      console.log('catch error')
    })
    p1.then(()=>{
      console.log(1)
    })
    // console.log(p1) p1返回fulfilled 触发then回调
    const p2 = Promise.reject('my error').catch(()=>{
      throw new Error('catch error')
    })
    // console.log(p2) p2返回rejected 触发catch回调
    p2.then(()=>{
      console.log(2)
    }).catch(()=>{
      console.log(3)
    })
```

**promise then和catch的链接**
```js
    // 第一题
    Promise.resolve()
    .then(()=>console.log(1))// 状态返回fulfilled
    .catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的then会执行
    .then(()=>console.log(3)) // 1,3
    // 整个执行完没有报错，状态返回fulfilled
    
    // 第二题
    Promise.resolve()
    .then(()=>{ // then中有报错 状态返回rejected,后面的catch会执行
      console.log(1)
      throw new Error('error')
    })
    .catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的then会执行
    .then(()=>console.log(3)) // 1,2,3
    // 整个执行完没有报错，状态返回fulfilled
    
    // 第三题
    Promise.resolve()
    .then(()=>{//then中有报错 状态返回rejected，后面的catch会执行
      console.log(1)
      throw new Error('error')
    })
    .catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的catch不会执行
    .catch(()=>console.log(3)) // 1，2
    // 整个执行完没有报错，状态返回fulfilled
```
