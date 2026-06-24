# 第120题 WebSocket和HTTP协议有什么区别

  * 支持端对端通信
  * 可由`client`发起，也可由`sever`发起
  * 用于消息通知、直播间讨论区、聊天室、协同编辑

**WebSocket连接过程**

  * 先发起一个`HTTP`请求
  * 成功之后在升级到`WebSocket`协议，再通讯

![](/images/s_poetries_work_uploads_2023_01_6772692df973c752.png)

**WebSocket和HTTP区别**

  * `WebSocket`协议名是`ws://`，可双端发起请求（双端都可以`send`、`onmessage`）
  * `WebSocket`没有跨域限制
  * 通过`send`和`onmessage`通讯（`HTTP`通过`req`、`res`）

**WebSocket和HTTP长轮询的区别**

> 长轮询：一般是由客户端向服务端发出一个设置较长网络超时时间的 `HTTP`
> 请求，并在`Http`连接超时前，不主动断开连接；待客户端超时或有数据返回后，再次建立一个同样的`HTTP`请求，重复以上过程

  * `HTTP`长轮询：客户端发起请求，服务端阻塞，不会立即返回 
    * `HTTP`长轮询需要处理`timeout`，即`timeout`之后重新发起请求
  * `WebSocket`：客户端可发起请求，服务端也可发起请求

**ws可升级为wss（像https）**
```js
    import {createServer} from 'https'
    import {readFileSync} from 'fs'
    import {WebSocketServer} from 'ws'
    
    const server = createServer({
      cert: readFileSync('/path/to/cert.pem'),
      key: readFileSync('/path/to/key.pem'),
    })
    const wss = new WebSocketServer({ server })
```

**实际项目中推荐使用socket.io API更简洁**
```js
    io.on('connection',sockert=>{
      // 发送信息
      socket.emit('request', /**/)
      // 广播事件到客户端
      io.emit('broadcast', /**/)
      // 监听事件
      socket.on('reply', ()=>{/**/})
    })
```

**WebSocket基本使用例子**
```js
    // server.js
    const { WebSocketServer } = require('ws') // npm i ws 
    const wsServer = new WebSocketServer({ port: 3000 })
    
    wsServer.on('connection', ws => {
      console.info('connected')
    
      ws.on('message', msg => {
        console.info('收到了信息', msg.toString())
    
        // 服务端向客户端发送信息
        setTimeout(() => {
          ws.send('服务端已经收到了信息: ' + msg.toString())
        }, 2000)
      })
    })
```  
```html
    <!-- websocket main page -->
    <button id="btn-send">发送消息</button>
    
    <script>
        const ws = new WebSocket('ws://127.0.0.1:3000')
        ws.onopen = () => {
          console.info('opened')
          ws.send('client opened')
        }
        ws.onmessage = event => {
          console.info('收到了信息', event.data)
        }
    
        document.getElementById('btn-send').addEventListener('click', () => {
          console.info('clicked')
          ws.send('当前时间' + Date.now())
        })
    </script>
```

**创建简易聊天室**
```js
    // server.js
    
    const { WebSocketServer } = require('ws') // npm i ws 
    const wsServer = new WebSocketServer({ port: 3000 })
    
    const list = new Set()
    
    wsServer.on('connection', curWs => {
      console.info('connected')
    
      // 这里，不能一直被 add 。实际使用中，这里应该有一些清理缓存的机制，长期用不到的 ws 要被 delete
      list.add(curWs)
    
      curWs.on('message', msg => {
        console.info('received message', msg.toString())
    
        // 传递给其他客户端
        list.forEach(ws => {
          if (ws === curWs) return
          ws.send(msg.toString())
        })
      })
    })
```

client1
```html
    <!-- client 1-->
    
    <p>websocket page 1</p>
    <button id="btn-send">发送消息</button>
    
    <script>
      const ws = new WebSocket('ws://127.0.0.1:3000')
      ws.onopen = () => {
        console.info('opened')
        ws.send('client1 opened')
      }
      ws.onmessage = event => {
        console.info('client1 received', event.data)
      }
    
      document.getElementById('btn-send').addEventListener('click', () => {
        console.info('clicked')
        ws.send('client1 time is ' + Date.now())
      })
    </script>
```

client2
```html
    <!-- client 2-->
    
    <p>websocket page 2</p>
    <button id="btn-send">发送消息</button>
    
    <script>
      const ws = new WebSocket('ws://127.0.0.1:3000')
      ws.onopen = () => {
        console.info('opened')
        ws.send('client2 opened')
      }
      ws.onmessage = event => {
        console.info('client2 received', event.data)
      }
    
      document.getElementById('btn-send').addEventListener('click', () => {
        console.info('clicked')
        ws.send('client2 time is ' + Date.now())
      })
    </script>
```
