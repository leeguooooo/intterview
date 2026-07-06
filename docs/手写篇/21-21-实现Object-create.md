---
title: "实现Object create"
---

# 21 实现Object.create

> `Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`
```js
    // 模拟 Object.create
    
    function create(proto) {
      function F() {}
      F.prototype = proto;
    
      return new F();
    }
```
