原文链接: [https://interview.poetries.top/fe-base-docs/http-protocol/base/08-URI.html](https://interview.poetries.top/fe-base-docs/http-protocol/base/08-URI.html)

![](/images/s_poetries_work_gitee_2019_12_13.png)

  * `URI` 是用来唯一标记服务器上资源的一个字符串，通常也称为 URL；
  * `URI` 通常由 `scheme`、`host:port`、`path` 和 `query` 四个部分组成，有的可以省略；
  * `scheme` 叫“方案名”或者“协议名”，表示资源应该使用哪种协议来访问；
  * “`host:port`”表示资源所在的主机名和端口号；
  * `path` 标记资源所在的位置；
  * `query` 表示对资源附加的额外要求；
  * 在 `URI` 里对“`@&/`”等特殊字符和汉字必须要做编码，否则服务器收到 `HTTP`报文后会无法正确处理

![](/images/s_poetries_work_gitee_2019_12_97.png)

阅读全文

