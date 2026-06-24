# 第57题 实现Promisify
```js
    const fs = require('fs')
    const path = require('path')
    
    // node中使用
    // const fs = require('fs').promises 12.18版
    // const promisify = require('util').promisify
    
    // 包装node api promise化 典型的高级函数
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
    
    // const read = promisify(fs.readFile)
    
    // read(path.join(__dirname, './promise.js'), 'utf8').then(d=>{
    //   console.log(d)
    // })
    
    // promise化node所有api
    const promisifyAll = target=>{
      Reflect.ownKeys(target).forEach(key=>{
        if(typeof target[key] === 'function') {
          target[key+'Async'] = promisify(target[key])
        }
      })
      return target
    }
    
    // promise化fs下的函数
    const promisifyNew = promisifyAll(fs)
    
    promisifyNew.readFileAsync(path.join(__dirname, './promise.js'), 'utf8').then(d=>{
      console.log(d)
    })
    
    module.exports = {
      promisify,
      promisifyAll
    }
```
