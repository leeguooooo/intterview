原文链接: [https://interview.poetries.top/fe-base-docs/http-protocol/base/06-HTTP%E6%8A%A5%E6%96%87%E6%98%AF%E4%BB%80%E4%B9%88%E6%A0%B7%E5%AD%90%E7%9A%84.html](https://interview.poetries.top/fe-base-docs/http-protocol/base/06-HTTP%E6%8A%A5%E6%96%87%E6%98%AF%E4%BB%80%E4%B9%88%E6%A0%B7%E5%AD%90%E7%9A%84.html)

## 报文结构

  * 你也许对 TCP/UDP 的报文格式有所了解，拿 TCP 报文来举例，它在实际要传输的数据之前附加了一个 20 字节的头部数据，存储 TCP 协议必须的额外信息，例如发送方的端口号、接收方的端口号、包序号、标志位等等
  * 有了这个附加的 TCP 头，数据包才能够正确传输，到了目的地后把头部去掉，就可以拿到真正的数据。

![](/images/s_poetries_work_gitee_2019_12_5.png)

> HTTP 协议也是与 TCP/UDP 类似，同样也需要在实际传输的数据前附加一些头数据，不过与 TCP/UDP
> 不同的是，它是一个“纯文本”的协议，所以头数据都是 ASCII 码的文本，可以很容易地用肉眼阅读，不用借助程序解析也能够看懂

**HTTP 协议的请求报文和响应报文的结构基本相同，由三大部分组成**

  * 起始行（start line）：描述请求或响应的基本信息；
  * 头部字段集合（header）：使用 `key-value` 形式更详细地说明报文；
  * 消息正文（entity）：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据

这其中前两部分起始行和头部字段经常又合称为“请求头”或“响应头”，消息正文又称为“实体”，但与“header”对应，很多时候就直接称为“body”。

HTTP 协议规定报文必须有 header，但可以没有 body，而且在 header
之后必须要有一个“空行”，也就是“CRLF”，十六进制的“0D0A”。

所以，一个完整的 HTTP 报文就像是下图的这个样子，注意在 header 和 body 之间有一个“空行”

![](/images/s_poetries_work_gitee_2019_12_6.png)

说到这里，我不由得想起了一部老动画片《大头儿子和小头爸爸》，你看，HTTP 的报文结构像不像里面的“大头儿子”？

报文里的 header 就是“大头儿子”的“大头”，空行就是他的“脖子”，而后面的 body 部分就是他的身体了。

看一下我们之前用 Wireshark 抓的包吧。

![](/images/s_poetries_work_gitee_2019_12_7.png)

在这个浏览器发出的请求报文里，第一行“GET / HTTP/1.1”就是请求行，而后面的“Host”“Connection”等等都属于
header，报文的最后是一个空白行结束，没有 body。

在很多时候，特别是浏览器发送 GET 请求的时候都是这样，HTTP 报文经常是只有 header 而没
body，相当于只发了一个超级“大头”过来，你可以想象的出来：每时每刻网络上都会有数不清的“大头儿子”在跑来跑去。

不过这个“大头”也不能太大，虽然 HTTP 协议对 header 的大小没有做限制，但各个 Web
服务器都不允许过大的请求头，因为头部太大可能会占用大量的服务器资源，影响运行效率。

## 请求行

了解了 HTTP 报文的基本结构后，我们来看看请求报文里的起始行也就是请求行（request line），它简要地描述了客户端想要如何操作服务器端的资源。

**请求行由三部分构成**

  * 请求方法：是一个动词，如 `GET/POST`，表示对资源的操作；
  * 请求目标：通常是一个 `URI`，标记了请求方法要操作的资源；
  * 版本号：表示报文使用的 `HTTP` 协议版本

> 这三个部分通常使用空格（space）来分隔，最后要用 CRLF 换行表示结束。

![](/images/s_poetries_work_gitee_2019_12_8.png)

## 状态行

比起请求行来说，状态行要简单一些，同样也是由三部分构成：

  * 版本号：表示报文使用的 HTTP 协议版本；
  * 状态码：一个三位数，用代码的形式表示处理的结果，比如 200 是成功，500 是服务器错误；
  * 原因：作为数字状态码补充，是更详细的解释文字，帮助人理解原因

![](/images/s_poetries_work_gitee_2019_12_9.png)

## 头部字段

请求行或状态行再加上头部字段集合就构成了 HTTP 报文里完整的请求头或响应头，我画了两个示意图，你可以看一下。

![](/images/s_poetries_work_gitee_2019_12_10.png)
![](/images/s_poetries_work_gitee_2019_12_11.png)

请求头和响应头的结构是基本一样的，唯一的区别是起始行，所以我把请求头和响应头里的字段放在一起介绍。

头部字段是 key-value 的形式，key 和 value 之间用“:”分隔，最后用 CRLF 换行表示字段结束。比如在“Host:
127.0.0.1”这一行里 key 就是“Host”，value 就是“127.0.0.1”。

HTTP 头字段非常灵活，不仅可以使用标准里的 Host、Connection 等已有头，也可以任意添加自定义头，这就给 HTTP
协议带来了无限的扩展可能。

**不过使用头字段需要注意下面几点：**

  * 字段名不区分大小写，例如“Host”也可以写成“host”，但首字母大写的可读性更好；
  * 字段名里不允许出现空格，可以使用连字符“-”，但不能使用下划线“_”。例如，“testname”是合法的字段名，而“test name”“test_name”是不正确的字段名；
  * 字段名后面必须紧接着“:”，不能有空格，而“:”后的字段值前可以有多个空格；
  * 字段的顺序是没有意义的，可以任意排列不影响语义；
  * 字段原则上不能重复，除非这个字段本身的语义允许，例如 `Set-Cookie`

## 总结

  * `HTTP` 报文结构就像是“大头儿子”，由“起始行 + 头部 + 空行 + 实体”组成，简单地说就是“`header+body`”；
  * `HTTP` 报文可以没有 `body`，但必须要有 `header`，而且 `header` 后也必须要有空行，形象地说就是“大头”必须要带着“脖子”；
  * 请求头由“请求行 + 头部字段”构成，响应头由“状态行 + 头部字段”构成；
  * 请求行有三部分：请求方法，请求目标和版本号；
  * 状态行也有三部分：版本号，状态码和原因字符串；
  * 头部字段是 `key-value` 的形式，用“`:`”分隔，不区分大小写，顺序任意，除了规定的标准头，也可以任意添加自定义字段，实现功能扩展；
  * `HTTP/1.1` 里唯一要求必须提供的头字段是 `Host`，它必须出现在请求头里，标记虚拟主机名

![](/images/s_poetries_work_gitee_2019_12_95.png)

阅读全文

