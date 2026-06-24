# 第31题 实现一个padStart()或padEnd()的polyfill

`String.prototype.padStart` 和
`String.prototype.padEnd`是`ES8`中新增的方法，允许将空字符串或其他字符串添加到原始字符串的开头或结尾。我们先看下使用语法：
```javascript
    String.padStart(targetLength,[padString])
```

用法：
```javascript
    'x'.padStart(4, 'ab') // 'abax'
    'x'.padEnd(5, 'ab') // 'xabab'
    
    // 1. 若是输入的目标长度小于字符串原本的长度则返回字符串本身
    'xxx'.padStart(2, 's') // 'xxx'
    
    // 2. 第二个参数的默认值为 " "，长度是为1的
    // 3. 而此参数可能是个不确定长度的字符串，若是要填充的内容达到了目标长度，则将不要的部分截取
    'xxx'.padStart(5, 'sss') // ssxxx
    
    // 4. 可用来处理日期、金额格式化问题
    '12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
    '09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

polyfill实现：
```javascript
    String.prototype.myPadStart = function (targetLen, padString = " ") {
      if (!targetLen) {
        throw new Error('请输入需要填充到的长度');
      }
      let originStr = String(this); // 获取到调用的字符串, 因为this原本是String{}，所以需要用String转为字符串
      let originLen = originStr.length; // 调用的字符串原本的长度
      if (originLen >= targetLen) return originStr; // 若是 原本 > 目标 则返回原本字符串
      let diffNum = targetLen - originLen; // 10 - 6 // 差值
      for (let i = 0; i < diffNum; i++) { // 要添加几个成员
        for (let j = 0; j < padString.length; j++) { // 输入的padString的长度可能不为1
          if (originStr.length === targetLen) break; // 判断每一次添加之后是否到了目标长度
          originStr = `${padString[j]}${originStr}`;
        }
        if (originStr.length === targetLen) break;
      }
      return originStr;
    }
    console.log('xxx'.myPadStart(16))
    console.log('xxx'.padStart(16))
```

还是比较简单的，而`padEnd`的实现和它一样，只需要把第二层`for`循环里的`${padString[j]}${orignStr}`换下位置就可以了。
