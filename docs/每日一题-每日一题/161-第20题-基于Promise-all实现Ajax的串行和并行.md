---
title: "基于Promise all实现Ajax的串行和并行"
---

# 第20题 基于Promise.all实现Ajax的串行和并行

> 基于Promise.all实现Ajax的串行和并行

  * 串行：请求是异步的，需要等待上一个请求成功，才能执行下一个请求
  * 并行：同时发送多个请求「`HTTP`请求可以同时进行，但是JS的操作都是一步步的来的，因为JS是单线程」,等待所有请求都成功，我们再去做什么事情?
```js
    Promise.all([
        axios.get('/user/list'),
        axios.get('/user/list'),
        axios.get('/user/list')
    ]).then(results => {
        console.log(results);
    }).catch(reason => {
    
    });
```

**Promise.all并发限制及async-pool的应用**

> 并发限制指的是，每个时刻并发执行的promise数量是固定的，最终的执行结果还是保持与原来的
```js
    const delay = function delay(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // if (interval === 1003) reject('xxx');
                resolve(interval);
            }, interval);
        });
    };
    let tasks = [() => {
        return delay(1000);
    }, () => {
        return delay(1003);
    }, () => {
        return delay(1005);
    }, () => {
        return delay(1002);
    }, () => {
        return delay(1004);
    }, () => {
        return delay(1006);
    }];
    
    /* Promise.all(tasks.map(task => task())).then(results => {
        console.log(results);
    }); */
    
    let results = [];
    asyncPool(2, tasks, (task, next) => {
        task().then(result => {
            results.push(result);
            next();
        });
    }, () => {
        console.log(results);
    });
```  
```js
    const delay = function delay(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(interval);
            }, interval);
        });
    };
    let tasks = [() => {
        return delay(1000);
    }, () => {
        return delay(1003);
    }, () => {
        return delay(1005);
    }, () => {
        return delay(1002);
    }, () => {
        return delay(1004);
    }, () => {
        return delay(1006);
    }];
```

**JS实现Ajax并发请求控制的两大解决方案**

> `tasks`：数组，数组包含很多方法，每一个方法执行就是发送一个请求「基于`Promise`管理」
```js
    function createRequest(tasks, pool) {
        pool = pool || 5;
        let results = [],
            together = new Array(pool).fill(null),
            index = 0;
        together = together.map(() => {
            return new Promise((resolve, reject) => {
                const run = function run() {
                    if (index >= tasks.length) {
                        resolve();
                        return;
                    };
                    let old_index = index,
                        task = tasks[index++];
                    task().then(result => {
                        results[old_index] = result;
                        run();
                    }).catch(reason => {
                        reject(reason);
                    });
                };
                run();
            });
        });
        return Promise.all(together).then(() => results);
    } 
    
    /* createRequest(tasks, 2).then(results => {
        // 都成功，整体才是成功，按顺序存储结果
        console.log('成功-->', results);
    }).catch(reason => {
        // 只要有也给失败，整体就是失败
        console.log('失败-->', reason);
    }); */
```  
```js
    function createRequest(tasks, pool, callback) {
        if (typeof pool === "function") {
            callback = pool;
            pool = 5;
        }
        if (typeof pool !== "number") pool = 5;
        if (typeof callback !== "function") callback = function () {};
        //------
        class TaskQueue {
            running = 0;
            queue = [];
            results = [];
            pushTask(task) {
                let self = this;
                self.queue.push(task);
                self.next();
            }
            next() {
                let self = this;
                while (self.running < pool && self.queue.length) {
                    self.running++;
                    let task = self.queue.shift();
                    task().then(result => {
                        self.results.push(result);
                    }).finally(() => {
                        self.running--;
                        self.next();
                    });
                }
                if (self.running === 0) callback(self.results);
            }
        }
        let TQ = new TaskQueue;
        tasks.forEach(task => TQ.pushTask(task));
    }
    createRequest(tasks, 2, results => {
        console.log(results);
    });
```
