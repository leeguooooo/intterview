# 第111题 nodejs如何开启多进程，进程如何通讯

**进程process和线程thread的区别**

  * 进程，`OS`进行资源分配和调度的最小单位，有独立的内存空间
  * 线程，`OS`进程运算调度的最小单位，共享进程内存空间
  * JS是单线程的，但可以开启多进程执行，如`WebWorker`

![](/images/s_poetries_work_uploads_2023_01_030cb840c0edabe7.webp)

**为何需要多进程**

  * 多核CPU，更适合处理多进程
  * 内存较大，多个进程才能更好利用（单进程有内存上限）
  * 总之，压榨机器资源，更快、更节省

**如何开启多进程**

  * 开启子进程 `child_process.fork`和`cluster.fork`
    * `child_process.fork`用于单个计算量较大的计算
    * `cluster`用于开启多个进程，多个服务
  * 使用`send`和`on`传递消息

**使用child_process.fork方式**
```js
    const http = require('http')
    const fork = require('child_process').fork
    
    const server = http.createServer((req, res) => {
      if (req.url === '/get-sum') {
        console.info('主进程 id', process.pid)
    
        // 开启子进程 计算结果返回
        const computeProcess = fork('./compute.js')
        computeProcess.send('开始计算') // 发送消息给子进程开始计算，在子进程中接收消息调用计算逻辑，计算完成后发送消息给主进程
    
        computeProcess.on('message', data => {
          console.info('主进程接收到的信息：', data)
          res.end('sum is ' + data)
        })
    
        computeProcess.on('close', () => {
          console.info('子进程因报错而退出')
          computeProcess.kill() // 关闭子进程
          res.end('error')
        })
      }
    })
    server.listen(3000, () => {
      console.info('localhost: 3000')
    })
```  
```js
    // compute.js
    
    /**
     * @description 子进程，计算
     */
    
    function getSum() {
      let sum = 0
      for (let i = 0; i < 10000; i++) {
        sum += i
      }
      return sum
    }
    
    process.on('message', data => {
      console.log('子进程 id', process.pid)
      console.log('子进程接收到的信息: ', data)
    
      const sum = getSum()
    
      // 发送消息给主进程
      process.send(sum)
    })
```

**使用cluster方式**
```js
    const http = require('http')
    const cpuCoreLength = require('os').cpus().length
    const cluster = require('cluster')
    
    // 主进程
    if (cluster.isMaster) {
        for (let i = 0; i < cpuCoreLength; i++) {
          cluster.fork() // 根据核数 开启子进程
        }
    
        cluster.on('exit', worker => {
          console.log('子进程退出')
          cluster.fork() // 进程守护
        })
    } else {
      // 多个子进程会共享一个 TCP 连接，提供一份网络服务
      const server = http.createServer((req, res) => {
        res.writeHead(200)
        res.end('done')
      })
      server.listen(3000)
    }
    
    
    // 工作中 使用PM2开启进程守护更方便
```
