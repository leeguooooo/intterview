---
title: "实现JSONP方法"
---

# 15 实现JSONP方法

> 利用`<script>`标签不受跨域限制的特点，缺点是只能支持 `get` 请求

  * 创建`script`标签
  * 设置`script`标签的`src`属性，以问号传递参数，设置好回调函数`callback`名称
  * 插入到`html`文本中
  * 调用回调函数，`res`参数就是获取的数据
```js
    function jsonp({url,params,callback}) {
      return new Promise((resolve,reject)=>{
      let script = document.createElement('script')
    
        window[callback] = function (data) {
          resolve(data)
          document.body.removeChild(script)
        }
        var arr = []
        for(var key in params) {
          arr.push(`${key}=${params[key]}`)
        }
        script.type = 'text/javascript'
        script.src = `${url}?callback=${callback}&${arr.join('&')}`
        document.body.appendChild(script)
      })
    }
```  
```js
    // 测试用例
    jsonp({
      url: 'http://suggest.taobao.com/sug',
      callback: 'getData',
      params: {
        q: 'iphone手机',
        code: 'utf-8'
      },
    }).then(data=>{console.log(data)})
```

  * 设置 `CORS: Access-Control-Allow-Origin：*`
  * `postMessage`
