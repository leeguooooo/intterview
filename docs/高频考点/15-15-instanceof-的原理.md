---
title: "instanceof 的原理"
---

# 15 instanceof 的原理

> 涉及面试题：`instanceof` 的原理是什么？

`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`

**实现一下 instanceof**

  * 首先获取类型的原型
  * 然后获得对象的原型
  * 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`
```js
    function myInstanceof(left, right) {
      // 由于instance要检测的是某对象，需要有一个前置判断条件
      //基本数据类型直接返回false
      if(typeof left !== 'object' || left === null) return false;
    
      let prototype = right.prototype
      left = left.__proto__
      while (true) {
        if (left === null || left === undefined)
          return false
        if (prototype === left)
          return true
        left = left.__proto__
      }
    }
    
    console.log('test', myInstanceof(null, Array)) // false
    console.log('test', myInstanceof([], Array)) // true
    console.log('test', myInstanceof('', Array)) // false
    console.log('test', myInstanceof({}, Object)) // true
```
