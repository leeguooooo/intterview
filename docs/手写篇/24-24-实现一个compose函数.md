---
title: "实现一个compose函数"
---

# 24 实现一个compose函数

> 组合多个函数，从右到左，比如：`compose(f, g, h)` 最终得到这个结果 `(...args) => f(g(h(...args))).`

题目描述:实现一个 `compose` 函数
```js
    // 用法如下:
    function fn1(x) {
      return x + 1;
    }
    function fn2(x) {
      return x + 2;
    }
    function fn3(x) {
      return x + 3;
    }
    function fn4(x) {
      return x + 4;
    }
    const a = compose(fn1, fn2, fn3, fn4);
    console.log(a(1)); // 1+4+3+2+1=11
```

**实现代码如下**
```js
    function compose(...funcs) {
      if (!funcs.length) return (v) => v;
    
      if (funcs.length === 1) {
        return funcs[0]
      }
    
      return funcs.reduce((a, b) => {
        return (...args) => a(b(...args)))
      }
    }
```

> `compose`创建了一个从右向左执行的数据流。如果要实现从左到右的数据流，可以直接更改`compose`的部分代码即可实现

  * 更换`Api`接口：把`reduce`改为`reduceRight`
  * 交互包裹位置：把`a(b(...args))`改为`b(a(...args))`
