# 16 实现async/await

**分析**
```js
    // generator生成器  生成迭代器iterator
    
    // 默认这样写的类数组是不能被迭代的，缺少迭代方法
    let likeArray = {'0': 1, '1': 2, '2': 3, '3': 4, length: 4}
    
    // // 使用迭代器使得可以展开数组
    // // Symbol有很多元编程方法，可以改js本身功能
    // likeArray[Symbol.iterator] = function () {
    //   // 迭代器是一个对象 对象中有next方法 每次调用next 都需要返回一个对象 {value,done}
    //   let index = 0
    //   return {
    //     next: ()=>{
    //       // 会自动调用这个方法
    //       console.log('index',index)
    //       return {
    //         // this 指向likeArray
    //         value: this[index],
    //         done: index++ === this.length
    //       }
    //     }
    //   }
    // }
    // let arr = [...likeArray]
    
    // console.log('arr', arr)
    
    // 使用生成器返回迭代器
    // likeArray[Symbol.iterator] = function *() {
    //   let index = 0
    //   while (index != this.length) {
    //     yield this[index++]
    //   }
    // }
    // let arr = [...likeArray]
    
    // console.log('arr', arr)
    
    
    // 生成器 碰到yield就会暂停
    // function *read(params) {
    //   yield 1;
    //   yield 2;
    // }
    // 生成器返回的是迭代器
    // let it = read()
    // console.log(it.next())
    // console.log(it.next())
    // console.log(it.next())
    
    // 通过generator来优化promise（promise的缺点是不停的链式调用）
    const fs = require('fs')
    const path = require('path')
    // const co = require('co') // 帮我们执行generator
    
    const promisify = fn=>{
      return (...args)=>{
        return new Promise((resolve,reject)=>{
          fn(...args, (err,data)=>{
            if(err) {
              reject(err)
            } 
            resolve(data)
          })
        })
      }
    }
    
    // promise化
    let asyncReadFile = promisify(fs.readFile)
    
    function * read() {
      let content1 = yield asyncReadFile(path.join(__dirname,'./data/name.txt'),'utf8')
      let content2 = yield asyncReadFile(path.join(__dirname,'./data/' + content1),'utf8')
      return content2
    }
    
    // 这样写太繁琐 需要借助co来实现
    // let re = read()
    // let {value,done} = re.next()
    // value.then(data=>{
    //   // 除了第一次传参没有意义外 剩下的传参都赋予了上一次的返回值 
    //   let {value,done} = re.next(data) 
    //   value.then(d=>{
    //     let {value,done} = re.next(d)
    //     console.log(value,done)
    //   })
    // }).catch(err=>{
    //   re.throw(err) // 手动抛出错误 可以被try catch捕获
    // })
    
    
    
    // 实现co原理
    function co(it) {// it 迭代器
      return new Promise((resolve,reject)=>{
        // 异步迭代 需要根据函数来实现
        function next(data) {
          // 递归得有中止条件
          let {value,done} = it.next(data)
          if(done) {
            resolve(value) // 直接让promise变成成功 用当前返回的结果
          } else {
            // Promise.resolve(value).then(data=>{
            //   next(data)
            // }).catch(err=>{
            //   reject(err)
            // })
            // 简写
            Promise.resolve(value).then(next,reject)
          }
        }
        // 首次调用
        next()
      })
    }
    
    co(read()).then(d=>{
      console.log(d)
    }).catch(err=>{
      console.log(err,'--')
    })
```

**整体看一下结构**
```js
    function asyncToGenerator(generatorFunc) {
        return function() {
          const gen = generatorFunc.apply(this, arguments)
          return new Promise((resolve, reject) => {
            function step(key, arg) {
              let generatorResult
              try {
                generatorResult = gen[key](arg)
              } catch (error) {
                return reject(error)
              }
              const { value, done } = generatorResult
              if (done) {
                return resolve(value)
              } else {
                return Promise.resolve(value).then(val => step('next', val), err => step('throw', err))
              }
            }
            step("next")
          })
        }
    }
```

**分析**
```js
    function asyncToGenerator(generatorFunc) {
      // 返回的是一个新的函数
      return function() {
      
        // 先调用generator函数 生成迭代器
        // 对应 var gen = testG()
        const gen = generatorFunc.apply(this, arguments)
    
        // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
        // var test = asyncToGenerator(testG)
        // test().then(res => console.log(res))
        return new Promise((resolve, reject) => {
        
          // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
          // key有next和throw两种取值，分别对应了gen的next和throw方法
          // arg参数则是用来把promise resolve出来的值交给下一个yield
          function step(key, arg) {
            let generatorResult
            
            // 这个方法需要包裹在try catch中
            // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
            try {
              generatorResult = gen[key](arg)
            } catch (error) {
              return reject(error)
            }
    
            // gen.next() 得到的结果是一个 { value, done } 的结构
            const { value, done } = generatorResult
    
            if (done) {
              // 如果已经完成了 就直接resolve这个promise
              // 这个done是在最后一次调用next后才会为true
              // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
              // 这个value也就是generator函数最后的返回值
              return resolve(value)
            } else {
              // 除了最后结束的时候外，每次调用gen.next()
              // 其实是返回 { value: Promise, done: false } 的结构，
              // 这里要注意的是Promise.resolve可以接受一个promise为参数
              // 并且这个promise参数被resolve的时候，这个then才会被调用
              return Promise.resolve(
                // 这个value对应的是yield后面的promise
                value
              ).then(
                // value这个promise被resove的时候，就会执行next
                // 并且只要done不是true的时候 就会递归的往下解开promise
                // 对应gen.next().value.then(value => {
                //    gen.next(value).value.then(value2 => {
                //       gen.next() 
                //
                //      // 此时done为true了 整个promise被resolve了 
                //      // 最外部的test().then(res => console.log(res))的then就开始执行了
                //    })
                // })
                function onResolve(val) {
                  step("next", val)
                },
                // 如果promise被reject了 就再次进入step函数
                // 不同的是，这次的try catch中调用的是gen.throw(err)
                // 那么自然就被catch到 然后把promise给reject掉啦
                function onReject(err) {
                  step("throw", err)
                },
              )
            }
          }
          step("next")
        })
      }
    }
```
