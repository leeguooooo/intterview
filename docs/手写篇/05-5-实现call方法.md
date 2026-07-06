---
title: "实现call方法"
---

# 5 实现call方法

**call做了什么:**

  * 将函数设为对象的属性
  * 执行和删除这个函数
  * 指定`this`到函数并传入给定参数执行函数
  * 如果不传入参数，默认指向 `window`

**分析：如何在函数执行时绑定this**

  * 如`var obj = {x:100,fn() { this.x }}`
  * 执行`obj.fn()` ,此时`fn`内部的`this`就指向了`obj`
  * 可借此来实现函数绑定`this`

> 原生`call`、`apply`传入的`this`如果是值类型，会被`new Object`（如`fn.call('abc')`）
```js
    //实现call方法
    
    // 相当于在obj上调用fn方法，this指向obj 
    // var obj = {fn: function(){console.log(this)}}
    // obj.fn() fn内部的this指向obj
    // call就是模拟了这个过程
    // context 相当于obj
    
    Function.prototype.myCall = function(context = window, ...args) {
      if (typeof context !== 'object') context = new Object(context) // 值类型，变为对象
    
      // args 传递过来的参数
      // this 表示调用call的函数fn
      // context 是call传入的this
    
      // 在context上加一个唯一值，不会出现属性名称的覆盖
      let fnKey = Symbol()
      // 相等于 obj[fnKey] = fn 
      context[fnKey] = this; // this 就是当前的函数
      
      // 绑定了this
      let result = context[fnKey](...args);// 相当于 obj.fn()执行 fn内部this指向context(obj)
    
      // 清理掉 fn ，防止污染（即清掉obj上的fnKey属性）
      delete context[fnKey];
    
      // 返回结果 
      return result;
    };
```  
```js
    //用法：f.call(this,arg1)
    
    function f(a,b){
     console.log(a+b)
     console.log(this.name)
    }
    let obj={
     name:1
    }
    f.myCall(obj,1,2) // 不传obj，this指向window
```
