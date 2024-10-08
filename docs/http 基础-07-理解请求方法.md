原文链接: [https://interview.poetries.top/fe-base-docs/http-protocol/base/07-%E7%90%86%E8%A7%A3%E8%AF%B7%E6%B1%82%E6%96%B9%E6%B3%95.html](https://interview.poetries.top/fe-base-docs/http-protocol/base/07-%E7%90%86%E8%A7%A3%E8%AF%B7%E6%B1%82%E6%96%B9%E6%B3%95.html)

## 标准请求方法

> 目前 `HTTP/1.1` 规定了八种方法，单词都必须是大写的形式

  * `GET`：获取资源，可以理解为读取或者下载数据；
  * `HEAD`：获取资源的元信息；
  * `POST`：向资源提交数据，相当于写入或上传数据；
  * `PUT`：类似 `POST`；
  * `DELETE`：删除资源；
  * `CONNECT`：建立特殊的连接隧道；
  * `OPTIONS`：列出可对资源实行的方法；
  * `TRACE`：追踪请求 - 响应的传输路径

![](/images/error.webp)<br><p>出错的图片链接: <a
href="https://s.poetries.work/gitee/2019/12/12.png"
target="_blank">https://s.poetries.work/gitee/2019/12/12.png</a></p>

## 总结

  * 请求方法是客户端发出的、要求服务器执行的、对资源的一种操作；
  * 请求方法是对服务器的“指示”，真正应如何处理由服务器来决定；
  * 最常用的请求方法是 `GET` 和 `POST`，分别是获取数据和发送数据；
  * `HEAD` 方法是轻量级的 `GET`，用来获取资源的元信息；
  * `PUT` 基本上是 `POST` 的同义词，多用于更新数据；
  * “安全”与“幂等”是描述请求方法的两个重要属性，具有理论指导意义，可以帮助我们设计系统

![](/images/s_poetries_work_gitee_2019_12_96.png)

阅读全文

