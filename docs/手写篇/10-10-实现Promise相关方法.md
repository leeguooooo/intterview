# 10 实现Promise相关方法

### 1 实现Promise的resolve

> 实现 resolve 静态方法有三个要点:

  * 传参为一个 `Promise`, 则直接返回它。
  * 传参为一个 `thenable` 对象，返回的 `Promise` 会跟随这个对象，采用它的最终状态作为自己的状态。
  * 其他情况，直接返回以该值为成功状态的`promise`对象。
```js
    Promise.resolve = (param) => {
      if(param instanceof Promise) return param;
      return new Promise((resolve, reject) => {
        if(param && param.then && typeof param.then === 'function') {
          // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
          param.then(resolve, reject);
        }else {
          resolve(param);
        }
      })
    }
```

### 2 实现 Promise.reject

> Promise.reject 中传入的参数会作为一个 reason 原封不动地往下传, 实现如下:
```js
    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }
```

### 3 实现 Promise.prototype.finally

>
> 前面的`promise`不管成功还是失败，都会走到`finally`中，并且`finally`之后，还可以继续`then`（说明它还是一个then方法是关键），并且会将初始的`promise`值原封不动的传递给后面的`then`.

**Promise.prototype.finally最大的作用**

  * `finally`里的函数，无论如何都会执行，并会把前面的值原封不动传递给下一个`then`方法中
  * 如果`finally`函数中有`promise`等异步任务，会等它们全部执行完毕，再结合之前的成功与否状态，返回值

**Promise.prototype.finally六大情况用法**
```js
    // 情况1
    Promise.resolve(123).finally((data) => { // 这里传入的函数，无论如何都会执行
      console.log(data); // undefined
    })
    
    // 情况2 (这里，finally方法相当于做了中间处理，起一个过渡的作用)
    Promise.resolve(123).finally((data) => {
      console.log(data); // undefined
    }).then(data => {
      console.log(data); // 123
    })
    
    // 情况3 (这里只要reject，都会走到下一个then的err中)
    Promise.reject(123).finally((data) => {
      console.log(data); // undefined
    }).then(data => {
      console.log(data);
    }, err => {
      console.log(err, 'err'); // 123 err
    })
    
    // 情况4 (一开始就成功之后，会等待finally里的promise执行完毕后，再把前面的data传递到下一个then中)
    Promise.resolve(123).finally((data) => {
      console.log(data); // undefined
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('ok');
        }, 3000)
      })
    }).then(data => {
      console.log(data, 'success'); // 123 success
    }, err => {
      console.log(err, 'err');
    })
    
    // 情况5 (虽然一开始成功，但是只要finally函数中的promise失败了，就会把其失败的值传递到下一个then的err中)
    Promise.resolve(123).finally((data) => {
      console.log(data); // undefined
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('rejected');
        }, 3000)
      })
    }).then(data => {
      console.log(data, 'success');
    }, err => {
      console.log(err, 'err'); // rejected err
    })
    
    // 情况6 (虽然一开始失败，但是也要等finally中的promise执行完，才能把一开始的err传递到err的回调中)
    Promise.reject(123).finally((data) => {
      console.log(data); // undefined
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('resolve');
        }, 3000)
      })
    }).then(data => {
      console.log(data, 'success');
    }, err => {
      console.log(err, 'err'); // 123 err
    })
```

**源码实现**
```js
    Promise.prototype.finally = function (callback) {
      return this.then((data) => {
        // 让函数执行 内部会调用方法，如果方法是promise，需要等待它完成
        // 如果当前promise执行时失败了，会把err传递到，err的回调函数中
        return Promise.resolve(callback()).then(() => data); // data 上一个promise的成功态
      }, err => {
        return Promise.resolve(callback()).then(() => {
          throw err; // 把之前的失败的err，抛出去
        });
      })
    }
```

### 4 实现 Promise.all

> 对于 all 方法而言，需要完成下面的核心功能:

  * 传入参数为一个空的可迭代对象，则直接进行`resolve`。
  * 如果参数中有一个`promise`失败，那么`Promise.all`返回的`promise`对象失败。
  * 在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组
```js
    Promise.all = function(promises) {
      return new Promise((resolve, reject) => {
        let result = [];
        let index = 0;
        let len = promises.length;
        if(len === 0) {
          resolve(result);
          return;
        }
       
        for(let i = 0; i < len; i++) {
          // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
          Promise.resolve(promise[i]).then(data => {
            result[i] = data;
            index++;
            if(index === len) resolve(result);
          }).catch(err => {
            reject(err);
          })
        }
      })
    }
```

### 5 实现promise.allsettle

> MDN:
> `Promise.allSettled()`方法返回一个在所有给定的`promise`都`已经`fulfilled`或`rejected`后的`promise`，并带有一个对象数组，每个对象表示对应的`promise`结果

当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个`promise`的结果时，通常使用它。

> 【译】`Promise.allSettled` 跟 `Promise.all` 类似, 其参数接受一个`Promise`的数组,
> 返回一个新的`Promise`, 唯一的不同在于, 其不会进行短路, 也就是说当Promise全部处理完成后我们可以拿到每个`Promise`的状态,
> 而不管其是否处理成功。

**用法 | 测试用例**
```js
    let fs = require('fs').promises;
    
    let getName = fs.readFile('./name.txt', 'utf8'); // 读取文件成功
    let getAge = fs.readFile('./age.txt', 'utf8');
    
    Promise.allSettled([1, getName, getAge, 2]).then(data => {
        console.log(data);
    });
    // 输出结果
    /*
        [
        { status: 'fulfilled', value: 1 },
        { status: 'fulfilled', value: 'zf' },
        { status: 'fulfilled', value: '11' },
        { status: 'fulfilled', value: 2 }
        ]
    */
    
    let getName = fs.readFile('./name123.txt', 'utf8'); // 读取文件失败
    let getAge = fs.readFile('./age.txt', 'utf8');
    // 输出结果
    /*
        [
        { status: 'fulfilled', value: 1 },
        {
          status: 'rejected',
          value: [Error: ENOENT: no such file or directory, open './name123.txt'] {
            errno: -2,
            code: 'ENOENT',
            syscall: 'open',
            path: './name123.txt'
          }
        },
        { status: 'fulfilled', value: '11' },
        { status: 'fulfilled', value: 2 }
      ]
    */
```

**实现**
```js
    function isPromise (val) {
      return typeof val.then === 'function'; // (123).then => undefined
    }
    
    Promise.allSettled = function(promises) {
      return new Promise((resolve, reject) => {
        let arr = [];
        let times = 0;
        const setData = (index, data) => {
          arr[index] = data;
          if (++times === promises.length) {
            resolve(arr);
          }
          console.log('times', times)
        }
    
        for (let i = 0; i < promises.length; i++) {
          let current = promises[i];
          if (isPromise(current)) {
            current.then((data) => {
              setData(i, { status: 'fulfilled', value: data });
            }, err => {
              setData(i, { status: 'rejected', value: err })
            })
          } else {
            setData(i, { status: 'fulfilled', value: current })
          }
        }
      })
    }
```

### 6 实现 Promise.race

> race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行
```js
    Promise.race = function(promises) {
      return new Promise((resolve, reject) => {
        let len = promises.length;
        if(len === 0) return;
        for(let i = 0; i < len; i++) {
          Promise.resolve(promise[i]).then(data => {
            resolve(data);
            return;
          }).catch(err => {
            reject(err);
            return;
          })
        }
      })
    }
```

### 7 实现一个简版Promise
```js
    // 使用
    var promise = new Promise((resolve,reject) => {
        if (操作成功) {
            resolve(value)
        } else {
            reject(error)
        }
    })
    promise.then(function (value) {
        // success
    },function (value) {
        // failure
    })
```  
```js
    function myPromise(constructor) {
        let self = this;
        self.status = "pending"   // 定义状态改变前的初始状态
        self.value = undefined;   // 定义状态为resolved的时候的状态
        self.reason = undefined;  // 定义状态为rejected的时候的状态
        function resolve(value) {
           if(self.status === "pending") {
              self.value = value;
              self.status = "resolved";
           }
        }
        function reject(reason) {
           if(self.status === "pending") {
              self.reason = reason;
              self.status = "rejected";
           }
        }
        // 捕获构造异常
        try {
           constructor(resolve,reject);
        } catch(e) {
           reject(e);
        }
    }
```  
```js
    // 添加 then 方法
    myPromise.prototype.then = function(onFullfilled,onRejected) {
       let self = this;
       switch(self.status) {
          case "resolved":
            onFullfilled(self.value);
            break;
          case "rejected":
            onRejected(self.reason);
            break;
          default:       
       }
    }
    
    var p = new myPromise(function(resolve,reject) {
        resolve(1)
    });
    p.then(function(x) {
        console.log(x) // 1
    })
```

**使用class实现**
```js
    class MyPromise {
      constructor(fn) {
        this.resolvedCallbacks = [];
        this.rejectedCallbacks = [];
        
        this.state = 'PENDING';
        this.value = '';
        
        fn(this.resolve.bind(this), this.reject.bind(this));
        
      }
      
      resolve(value) {
        if (this.state === 'PENDING') {
          this.state = 'RESOLVED';
          this.value = value;
          
          this.resolvedCallbacks.map(cb => cb(value));   
        }
      }
      
      reject(value) {
        if (this.state === 'PENDING') {
          this.state = 'REJECTED';
          this.value = value;
          
          this.rejectedCallbacks.map(cb => cb(value));
        }
      }
      
      then(onFulfilled, onRejected) {
        if (this.state === 'PENDING') {
          this.resolvedCallbacks.push(onFulfilled);
          this.rejectedCallbacks.push(onRejected);
          
        }
        
        if (this.state === 'RESOLVED') {
          onFulfilled(this.value);
        }
        
        if (this.state === 'REJECTED') {
          onRejected(this.value);
        }
      }
    }
```

### 8 Promise 实现-详细

![Promise 状态机：pending 初始态，resolve 转 fulfilled、reject 转 rejected，状态一旦改变不可逆](/images/diagrams/promise-state-machine.webp)

  * 可以把 `Promise` 看成一个状态机。初始是 `pending` 状态，可以通过函数 `resolve`和 `reject` ，将状态转变为 `resolved`或者 `rejected` 状态，状态一旦改变就不能再次变化。
  * `then` 函数会返回一个 `Promise` 实例，并且该返回值是一个新的实例而不是之前的实例。因为 `Promise` 规范规定除了 `pending` 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 `then` 调用就失去意义了。
  * 对于 `then`来说，本质上可以把它看成是 `flatMap`
```js
    // 三种状态
    const PENDING = "pending";
    const RESOLVED = "resolved";
    const REJECTED = "rejected";
    // promise 接收一个函数参数，该函数会立即执行
    function MyPromise(fn) {
      let _this = this;
      _this.currentState = PENDING;
      _this.value = undefined;
      // 用于保存 then 中的回调，只有当 promise
      // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
      _this.resolvedCallbacks = [];
      _this.rejectedCallbacks = [];
    
      _this.resolve = function (value) {
        if (value instanceof MyPromise) {
          // 如果 value 是个 Promise，递归执行
          return value.then(_this.resolve, _this.reject)
        }
        setTimeout(() => { // 异步执行，保证执行顺序
          if (_this.currentState === PENDING) {
            _this.currentState = RESOLVED;
            _this.value = value;
            _this.resolvedCallbacks.forEach(cb => cb());
          }
        })
      };
    
      _this.reject = function (reason) {
        setTimeout(() => { // 异步执行，保证执行顺序
          if (_this.currentState === PENDING) {
            _this.currentState = REJECTED;
            _this.value = reason;
            _this.rejectedCallbacks.forEach(cb => cb());
          }
        })
      }
      // 用于解决以下问题
      // new Promise(() => throw Error('error))
      try {
        fn(_this.resolve, _this.reject);
      } catch (e) {
        _this.reject(e);
      }
    }
    
    MyPromise.prototype.then = function (onResolved, onRejected) {
      var self = this;
      // 规范 2.2.7，then 必须返回一个新的 promise
      var promise2;
      // 规范 2.2.onResolved 和 onRejected 都为可选参数
      // 如果类型不是函数需要忽略，同时也实现了透传
      // Promise.resolve(4).then().then((value) => console.log(value))
      onResolved = typeof onResolved === 'function' ? onResolved : v => v;
      onRejected = typeof onRejected === 'function' ? onRejected : r => throw r;
    
      if (self.currentState === RESOLVED) {
        return (promise2 = new MyPromise(function (resolve, reject) {
          // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
          // 所以用了 setTimeout 包裹下
          setTimeout(function () {
            try {
              var x = onResolved(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (reason) {
              reject(reason);
            }
          });
        }));
      }
    
      if (self.currentState === REJECTED) {
        return (promise2 = new MyPromise(function (resolve, reject) {
          setTimeout(function () {
            // 异步执行onRejected
            try {
              var x = onRejected(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (reason) {
              reject(reason);
            }
          });
        }));
      }
    
      if (self.currentState === PENDING) {
        return (promise2 = new MyPromise(function (resolve, reject) {
          self.resolvedCallbacks.push(function () {
            // 考虑到可能会有报错，所以使用 try/catch 包裹
            try {
              var x = onResolved(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (r) {
              reject(r);
            }
          });
    
          self.rejectedCallbacks.push(function () {
            try {
              var x = onRejected(self.value);
              resolutionProcedure(promise2, x, resolve, reject);
            } catch (r) {
              reject(r);
            }
          });
        }));
      }
    };
    // 规范 2.3
    function resolutionProcedure(promise2, x, resolve, reject) {
      // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
      if (promise2 === x) {
        return reject(new TypeError("Error"));
      }
      // 规范 2.3.2
      // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
      if (x instanceof MyPromise) {
        if (x.currentState === PENDING) {
          x.then(function (value) {
            // 再次调用该函数是为了确认 x resolve 的
            // 参数是什么类型，如果是基本类型就再次 resolve
            // 把值传给下个 then
            resolutionProcedure(promise2, value, resolve, reject);
          }, reject);
        } else {
          x.then(resolve, reject);
        }
        return;
      }
      // 规范 2.3.3.3.3
      // reject 或者 resolve 其中一个执行过得话，忽略其他的
      let called = false;
      // 规范 2.3.3，判断 x 是否为对象或者函数
      if (x !== null && (typeof x === "object" || typeof x === "function")) {
        // 规范 2.3.3.2，如果不能取出 then，就 reject
        try {
          // 规范 2.3.3.1
          let then = x.then;
          // 如果 then 是函数，调用 x.then
          if (typeof then === "function") {
            // 规范 2.3.3.3
            then.call(
              x,
              y => {
                if (called) return;
                called = true;
                // 规范 2.3.3.3.1
                resolutionProcedure(promise2, y, resolve, reject);
              },
              e => {
                if (called) return;
                called = true;
                reject(e);
              }
            );
          } else {
            // 规范 2.3.3.4
            resolve(x);
          }
        } catch (e) {
          if (called) return;
          called = true;
          reject(e);
        }
      } else {
        // 规范 2.3.4，x 为基本类型
        resolve(x);
      }
    }
```

### 9 实现Promisify
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

### 10 完整实现Promises/A+规范
```js
    /**
     * Promises/A+规范 实现一个promise
     * https://promisesaplus.com/
    */
    
    const EMUM = {
      PENDING: 'PENDING',
      FULFILLED: 'FULFILLED',
      REJECTED: 'REJECTED'
    }
    
    // x 返回值
    // promise2 then的时候new的promise
    // promise2的resolve, reject
    const resolvePromise = (x, promise2, resolve, reject)=>{
      // 解析promise的值解析promise2是成功还是失败 传递到下层then
      if(x === promise2) {
        reject(new TypeError('类型错误'))
      }
      // 这里的x如果是一个promise的话 可能是其他的promise，可能调用了成功 又调用了失败
      // 防止resolve的时候 又throw err抛出异常到reject了
      let called
      // 如果x是promise 那么就采用他的状态
      // 有then方法是promise
      if(typeof x === 'object' && typeof x!== null || typeof x === 'function') {
        // x是对象或函数
        try {
          let then = x.then // 缓存，不用多次取值
          if(typeof then === 'function') {
            // 是promise，调用then方法里面有this，需要传入this为x才能取到then方法里面的值this.value
            then.call(x, y=>{// 成功
              // y值可能也是一个promise 如resolve(new Promise()) 此时的y==new Promise()
              // 递归解析y，直到拿到普通的值resolve(x出去)
              if(called) return;
              called = true;
    
              resolvePromise(y, promise2, resolve, reject)
            },r=>{// 一旦失败直接失败
              if(called) return;
              called = true;
              reject(r)
            })
          } else {
            // 普通对象不是promise
            resolve(x)
          }
        } catch (e) {
          // 对象取值可能报错，用defineProperty定义get 抛出异常
          if(called) return;
          called = true;
          reject(e)
        }
      } else {
        // x是普通值
        resolve(x) // 直接成功
      }
      
    }
    class myPromise {
      constructor(executor) {
        this.status = EMUM.PENDING // 当前状态
        this.value = undefined // resolve接收值
        this.reason = undefined // reject失败返回值
    
        /**
         * 同一个promise可以then多次(发布订阅模式)
         * 调用then时 当前状态是等待态，需要将当前成功或失败的回调存放起来（订阅）
         * 调用resolve时 将订阅函数进行执行（发布）
        */
        // 成功队列
        this.onResolvedCallbacks = []
        // 失败队列
        this.onRejectedCallbacks = []
        const resolve = value =>{
          // 如果value是一个promise，需要递归解析
          // 如 myPromise.resolve(new myPromise()) 需要解析value
          if(value instanceof myPromise) {
            // 不停的解析 直到值不是promise
            return value.then(resolve,reject)
          }
    
          if(this.status === EMUM.PENDING) {
            this.status = EMUM.FULFILLED
            this.value = value
    
            this.onResolvedCallbacks.forEach(fn=>fn())
          }
        }
        const reject = reason =>{
          if(this.status === EMUM.PENDING) {
            this.status = EMUM.REJECTED
            this.reason = reason
    
            this.onRejectedCallbacks.forEach(fn=>fn())
          }
        }
        try {
          executor(resolve,reject)
        } catch(e) {
          reject(e)
        }
      }
      then(onFulFilled, onRejected) {
        // 透传 处理默认不传的情况
        // new Promise((resolve,reject)=>{
        //   resolve(1)
        // }).then().then().then(d=>{})
        // new Promise((resolve,reject)=>{
        //   resolve(1)
        // }).then(v=>v).then(v=>v).then(d=>{})
        // new Promise((resolve,reject)=>{
        //   reject(1)
        // }).then().then().then(null, e=>{console.log(e)})
        // new Promise((resolve,reject)=>{
        //   reject(1)
        // }).then(null,e=>{throw e}).then(null,e=>{throw e}).then(null,e=>{console.log(e)})
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    
        // 调用then 创建一个新的promise
        let promise2 = new myPromise((resolve,reject)=>{
          // 根据value判断是resolve 还是reject value也可能是promise
          if(this.status === EMUM.FULFILLED) {
            setTimeout(() => {
              try {
                // 成功回调结果
                let x = onFulFilled(this.value)
                // 解析promise
                resolvePromise(x, promise2,resolve,reject)
              } catch (error) {
                reject(error)
              }
            }, 0);
          }
          if(this.status === EMUM.REJECTED) {
            setTimeout(() => {
              try {
                let x = onRejected(this.reason)
                // 解析promise
                resolvePromise(x, promise2,resolve,reject)
              } catch (error) {
                reject(error)
              }
            }, 0);
          }
          // 用户还未调用resolve或reject方法
          if(this.status === EMUM.PENDING) {
            this.onResolvedCallbacks.push(()=>{
              try {
                let x = onFulFilled(this.value)
                // 解析promise
                resolvePromise(x, promise2,resolve,reject)
              } catch (error) {
                reject(error)
              }
            })
            this.onRejectedCallbacks.push(()=>{
              try {
                let x = onRejected(this.reason)
                // 解析promise
                resolvePromise(x, promise2,resolve,reject)
              } catch (error) {
                reject(error)
              }
            })
          }
        })
        
        return promise2
      }
      catch(errCallback) {
        // 等同于没有成功，把失败放进去而已
        return this.then(null, errCallback)
      }
      // myPromise.resolve 具备等待功能的 如果参数的promise会等待promise解析完毕在向下执行
      static resolve(val) {
        return new myPromise((resolve,reject)=>{
          resolve(val)
        })
      }
      // myPromise.reject 直接将值返回
      static reject(reason) {
        return new myPromise((resolve,reject)=>{
          reject(reason)
        })
      }
      // finally传入的函数 无论成功或失败都执行
      // Promise.reject(100).finally(()=>{console.log(1)}).then(d=>console.log('success',d)).catch(er=>console.log('faild',er))
      // Promise.reject(100).finally(()=>new Promise()).then(d=>console.log(d)).catch(er=>)
      finally(callback) {
        return this.then((val)=>{
          return myPromise.resolve(callback()).then(()=>val)
        },(err)=>{
          return myPromise.resolve(callback()).then(()=>{throw err})
        })
      }
      // Promise.all
      static all(values) {
        return new myPromise((resolve,reject)=>{
          let resultArr = []
          let orderIndex = 0
          const processResultByKey = (value,index)=>{
            resultArr[index] = value 
            // 处理完全部
            if(++orderIndex === values.length) {
              resolve(resultArr) // 处理完成的结果返回去
            }
          }
          for (let i = 0; i < values.length; i++) {
            const value = values[i];
            // 是promise
            if(value && typeof value.then === 'function') {
              value.then((val)=>{
                processResultByKey(val,i)
              },reject)
            } else {
              // 不是promise情况
              processResultByKey(value,i)
            }
          }
        })
      }
      static race(promises) {
        // 采用最新成功或失败的作为结果
        return new myPromise((resolve,reject)=>{
          for (let i = 0; i < promises.length; i++) {
            let val = promises[i]
            if(val && typeof val.then === 'function') {
              // 任何一个promise先调用resolve或reject就返回结果了 也就是返回执行最快的那个promise的结果
              val.then(resolve,reject)
            }else{
              // 普通值
              resolve(val)
            }
          }
        })
      }
    }
    
    
    /**
     * =====测试用例-====
     */
    // let promise1 = new myPromise((resolve,reject)=>{
    //   setTimeout(() => {
    //     resolve('成功')
    //   }, 900);
    // })
    
    // promise1.then(val=>{
    //   console.log('success', val)
    // },reason=>{
    //   console.log('fail', reason)
    // })
    
    /**
     * then的使用方式 普通值意味不是promise
     * 
     * 1、then中的回调有两个方法 成功或失败 他们的结果返回（普通值）会传递给外层的下一个then中
     * 2、可以在成功或失败中抛出异常，走到下一次then的失败中
     * 3、返回的是一个promsie，那么会用这个promise的状态作为结果，会用promise的结果向下传递
     * 4、错误处理，会默认先找离自己最新的错误处理，找不到就向下查找，找打了就执行
     */
    
    // read('./name.txt').then(data=>{
    //   return '123'
    // }).then(data=>{
      
    // }).then(null,err=>{
    
    // })
    // // .catch(err=>{ // catch就是没有成功的promise
    
    // // })
    
    /**
     * promise.then实现原理：通过每次返回一个新的promise来实现（promise一旦成功就不能失败，失败就不能成功）
     * 
     */
    
    // function read(data) {
    //   return new myPromise((resolve,reject)=>{
    //     setTimeout(() => {
    //       resolve(new myPromise((resolve,reject)=>resolve(data)))
    //     }, 1000);
    //   })
    // }
    
    // let promise2 = read({name: 'poetry'}).then(data=>{
    //   return data
    // }).then().then().then(data=>{
    //   console.log(data,'-data-')
    // },(err)=>{
    //   console.log(err,'-err-')
    // })
    
    // finally测试
    // myPromise
    //   .resolve(100)
    //   .finally(()=>{
    //     return new myPromise((resolve,reject)=>setTimeout(() => {
    //       resolve(100)
    //     }, 100))
    //   })
    //   .then(d=>console.log('finally success',d))
    //   .catch(er=>console.log(er, 'finally err'))
    
    
    /**
     * promise.all 测试
     * 
     * myPromise.all 解决并发问题 多个异步并发获取最终的结果
    */
    
    // myPromise.all([1,2,3,4,new myPromise((resolve,reject)=>{
    //   setTimeout(() => {
    //     resolve('ok1')
    //   }, 1000);
    // }),new myPromise((resolve,reject)=>{
    //   setTimeout(() => {
    //     resolve('ok2')
    //   }, 1000);
    // })]).then(d=>{
    //   console.log(d,'myPromise.all.resolve')
    // }).catch(err=>{
    //   console.log(err,'myPromise.all.reject')
    // })
    
    
    // 实现promise中断请求
    let promise = new Promise((resolve,reject)=>{
      setTimeout(() => {
        // 模拟接口调用 ajax调用超时
        resolve('成功') 
      }, 10000);
    })
    
    function promiseWrap(promise) {
      // 包装一个promise 可以控制原来的promise是成功 还是失败
      let abort
      let newPromsie = new myPromise((resolve,reject)=>{
        abort = reject
      })
      // 只要控制newPromsie失败，就可以控制被包装的promise走向失败
      // Promise.race 任何一个先成功或者失败 就可以获得结果
      let p = myPromise.race([promise, newPromsie])
      p.abort = abort
    
      return p
    }
    
    let newPromise = promiseWrap(promise)
    
    setTimeout(() => {
      // 超过3秒超时
      newPromise.abort('请求超时')
    }, 3000);
    
    newPromise.then(d=>{
      console.log('d',d)
    }).catch(err=>{
      console.log('err',err)
    })
    
    
    // 使用promises-aplus-tests 测试写的promise是否规范
    // 全局安装 cnpm i -g promises-aplus-tests
    // 命令行执行 promises-aplus-tests promise.js
    // 测试入口 产生延迟对象
    myPromise.defer = myPromise.deferred = function () {
      let dfd = {}
      dfd.promise = new myPromise((resolve,reject)=>{
        dfd.resolve = resolve
        dfd.reject = reject
      })
      return dfd
    }
    
    // 延迟对象用户
    // ![](https://s.poetries.work/images/20210509172817.png)
    // promise解决嵌套问题
    // function readData(url) {
    //   let dfd = myPromise.defer()
    //   fs.readFile(url, 'utf8', function (err,data) {
    //     if(err) {
    //       dfd.reject()
    //     }
    //     dfd.resolve(data)
    //   })
    //   return dfd.promise
    // }
    // readData().then(d=>{
    //   return d
    // })
    
    module.exports = myPromise
```
