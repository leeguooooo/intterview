# 第112题 请描述js-bridge的实现原理

**什么是JS Bridge**

  * `JS`无法直接调用`native API`
  * 需要通过一些特定的格式来调用
  * 这些格式就统称`js-bridge`，例如微信`JSSKD`

![](/images/s_poetries_work_uploads_2023_01_0e45cf3988121684.png)
![](/images/s_poetries_work_uploads_2023_01_e68963dec49dbe97.png)

**JS Bridge的常见实现方式**

  * 注册全局`API`
  * `URL Scheme`（推荐）
```html
    <!-- <iframe id="iframe1"></iframe> -->
    
    <script>
      // const version = window.getVersion() // 异步
    
      // const iframe1 = document.getElementById('iframe1')
      // iframe1.onload = () => {
      //     const content = iframe1.contentWindow.document.body.innerHTML
      //     console.info('content', content)
      // }
      // iframe1.src = 'my-app-name://api/getVersion' // app识别协议my-app-name://，在app内处理返回给webview，而不是直接发送网络请求
      // URL scheme
    
      // 使用iframe 封装 JS-bridge
      const sdk = {
        invoke(url, data = {}, onSuccess, onError) {
          const iframe = document.createElement('iframe')
          iframe.style.visibility = 'hidden' // 隐藏iframe
          document.body.appendChild(iframe)
          iframe.onload = () => {
            const content = iframe1.contentWindow.document.body.innerHTML
            onSuccess(JSON.parse(content))
            iframe.remove()
          }
          iframe.onerror = () => {
            onError()
            iframe.remove()
          }
          iframe.src = `my-app-name://${url}?data=${JSON.stringify(data)}`
        },
        fn1(data, onSuccess, onError) {
          this.invoke('api/fn1', data, onSuccess, onError)
        },
        fn2(data, onSuccess, onError) {
          this.invoke('api/fn2', data, onSuccess, onError)
        },
        fn3(data, onSuccess, onError) {
          this.invoke('api/fn3', data, onSuccess, onError)
        },
      }
    </script>
```
