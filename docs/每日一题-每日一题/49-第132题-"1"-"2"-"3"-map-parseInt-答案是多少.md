---
title: "\"1\" \"2\" \"3\" map parseInt 答案是多少"
---

# 第132题 ["1", "2", "3"].map(parseInt) 答案是多少

**parseInt(str, radix)**

  * 解析一个字符串，并返回`10`进制整数
  * 第一个参数`str`，即要解析的字符串
  * 第二个参数`radix`，基数（进制），范围`2-36` ，以`radix`进制的规则去解析`str`字符串。不合法导致解析失败
  * 如果没有传`radix`
    * 当`str`以`0x`（或`0X`）开头，则按照`16`进制处理
    * 当`str`以`0`开头，则按照`8`进制处理（但是`ES5`取消了，可能还有一些老的浏览器使用）会按照`10`进制处理
    * 其他情况按照`10`进制处理
  * `eslint`会建议`parseInt`写第二个参数（是因为`0`开始的那个`8`进制写法不确定（如`078`），会按照`10`进制处理）

**答案**  
```js
    // 拆解
    const arr = ["1", "2", "3"]
    const res = arr.map((item,index,array)=>{
      // item: '1', index: 0
      // item: '2', index: 1
      // item: '3', index: 2
      return parseInt(item, index)
      // parseInt('1', 0) // 0相当没有传，按照10进制处理返回1 等价于parseInt('1')
      // parseInt('2', 1) // NaN 1不符合radix 2-36 的一个范围
      // parseInt('3', 2) // 2进制没有3 返回NaN
    })
    
    // 答案 [1, NaN, NaN] 
```
