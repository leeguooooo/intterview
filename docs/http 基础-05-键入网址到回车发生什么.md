原文链接: [https://interview.poetries.top/fe-base-docs/http-protocol/base/05-%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E5%88%B0%E5%9B%9E%E8%BD%A6%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88.html](https://interview.poetries.top/fe-base-docs/http-protocol/base/05-%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E5%88%B0%E5%9B%9E%E8%BD%A6%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88.html)

  * `HTTP` 协议基于底层的 `TCP/IP` 协议，所以必须要用 `IP` 地址建立连接
  * 如果不知道 `IP` 地址，就要用 `DNS`协议去解析得到 `IP` 地址，否则就会连接失败
  * 建立 `TCP` 连接后会顺序收发数据，请求方和应答方都必须依据 `HTTP` 规范构建和解析报文
  * 为了减少响应时间，整个过程中的每一个环节都会有缓存，能够实现“短路”操作
  * 虽然现实中的 `HTTP` 传输过程非常复杂，但理论上仍然可以简化成实验里的“两点”模型

![](/images/s_poetries_work_gitee_2019_12_94.png)

阅读全文

