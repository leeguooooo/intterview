# 第106题 HTTP跨域请求时为什么要发送options请求

**跨域请求**

  * 浏览器同源策略
  * 同源策略一般限制`Ajax`网络请求，不能跨域请求`server`
  * 不会限制`<link>` `<img>` `<script>` `<iframe>` 加载第三方资源

**JSONP实现跨域**
```html
    <!-- aa.com网页 -->
    <script>
      window.onSuccess = function(data) {
        console.log(data)
      }
    </script>
    <script src="https://bb.com/api/getData"></script>
```  
```js
    // server端https://bb.com/api/getData
    onSuccess({ "name":"test", "age":12, "city":"shenzhen" });
```

**cors**
```js
    response.setHeader('Access-Control-Allow-Origin', 'https://aa.com') // 或者*
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // 允许的请求方法
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With') // 允许的请求头
    response.setHeader（'Access-Control-Allow-Credentials', 'true'）// 允许跨域携带cookie
```

**多余的options请求**

![](/images/s_poetries_work_uploads_2023_01_8137dab52f536f6d.webp)

  * `options`是跨域请求之前的预检查
  * 浏览器自行发起的，无需我们干预
  * 不会影响实际的功能
