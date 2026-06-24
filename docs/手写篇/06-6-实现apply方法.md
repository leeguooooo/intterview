# 6 实现apply方法

> 思路: 利用`this`的上下文特性。`apply`其实就是改一下参数的问题
```js
    Function.prototype.myApply = function(context = window, args) {  // 这里传参和call传参不一样
      if (typeof context !== 'object') context = new Object(context) // 值类型，变为对象
    
      // args 传递过来的参数
      // this 表示调用call的函数
      // context 是apply传入的this
    
      // 在context上加一个唯一值，不会出现属性名称的覆盖
      let fnKey = Symbol()
      context[fnKey] = this; // this 就是当前的函数
      
      // 绑定了this
      let result = context[fnKey](...args); 
    
      // 清理掉 fn ，防止污染
      delete context[fnKey]; 
    
      // 返回结果
      return result;
    }
```  
```js
    // 使用
    function f(a,b){
     console.log(a,b)
     console.log(this.name)
    }
    let obj={
     name:'张三'
    }
    f.myApply(obj,[1,2])
```
