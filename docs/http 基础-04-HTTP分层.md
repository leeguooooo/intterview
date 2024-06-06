原文链接: [https://interview.poetries.top/fe-base-docs/http-protocol/base/04-HTTP%E5%88%86%E5%B1%82.html](https://interview.poetries.top/fe-base-docs/http-protocol/base/04-HTTP%E5%88%86%E5%B1%82.html)

![](/images/s_poetries_work_gitee_2019_12_4.png)

  * 第一层：物理层，`TCP/IP` 里无对应；
  * 第二层：数据链路层，对应 `TCP/IP` 的链接层；
  * 第三层：网络层，对应 `TCP/IP` 的网际层；
  * 第四层：传输层，对应 `TCP/IP` 的传输层；
  * 第五、六、七层：统一对应到 `TCP/IP` 的应用层

**总结**

  * `TCP/IP` 分为四层，核心是二层的 `IP` 和三层的 `TCP`，`HTTP` 在第四层；
  * `OSI` 分为七层，基本对应 `TCP/IP`，`TCP` 在第四层，`HTTP` 在第七层；
  * `OSI` 可以映射到 `TCP/IP`，但这期间一、五、六层消失了；
  * 日常交流的时候我们通常使用 `OSI` 模型，用四层、七层等术语；
  * `HTTP` 利用 `TCP/IP`协议栈逐层打包再拆包，实现了数据传输，但下面的细节并不可见

>
> 有一个辨别四层和七层比较好的（但不是绝对的）小窍门，“两个凡是”：凡是由操作系统负责处理的就是四层或四层以下，否则，凡是需要由应用程序（也就是你自己写代码）负责处理的就是七层

![](/images/s_poetries_work_gitee_2019_12_93.png)

阅读全文

