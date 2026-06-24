# 7 实现bind方法

> `bind` 的实现对比其他两个函数略微地复杂了一点，涉及到参数合并(类似函数柯里化)，因为 `bind`
> 需要返回一个函数，需要判断一些边界问题，以下是 `bind` 的实现

  * `bind` 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
  * 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来
  * 最后来说通过 `new` 的方式，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`
  * 箭头函数的底层是`bind`，无法改变`this`，只能改变参数

**简洁版本**

  * 对于普通函数，绑定`this`指向
  * 对于构造函数，要保证原函数的原型对象上的属性不能丢失
```js
    Function.prototype.myBind = function(context = window, ...args) {
      // context 是 bind 传入的 this
      // args 是 bind 传入的各个参数
      // this表示调用bind的函数
      let self = this; // fn.bind(obj) self就是fn
    
      //返回了一个函数，...innerArgs为实际调用时传入的参数
      let fBound = function(...innerArgs) { 
          //this instanceof fBound为true表示构造函数的情况。如new func.bind(obj)
          // 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true，可以让实例获得来自绑定函数的值
          // 当作为普通函数时，this 默认指向 window，此时结果为 false，将绑定函数的 this 指向 context
          return self.apply( // 函数执行
            this instanceof fBound ? this : context, 
            args.concat(innerArgs) // 拼接参数
          );
      }
    
      // 如果绑定的是构造函数，那么需要继承构造函数原型属性和方法：保证原函数的原型对象上的属性不丢失
      // 实现继承的方式: 使用Object.create
      fBound.prototype = Object.create(this.prototype);
      return fBound;
    }
```  
```js
    // 测试用例
    
    function Person(name, age) {
      console.log('Person name：', name);
      console.log('Person age：', age);
      console.log('Person this：', this); // 构造函数this指向实例对象
    }
    
    // 构造函数原型的方法
    Person.prototype.say = function() {
      console.log('person say');
    }
    
    // 普通函数
    function normalFun(name, age) {
      console.log('普通函数 name：', name); 
      console.log('普通函数 age：', age); 
      console.log('普通函数 this：', this);  // 普通函数this指向绑定bind的第一个参数 也就是例子中的obj
    }
    
    
    var obj = {
      name: 'poetries',
      age: 18
    }
    
    // 先测试作为构造函数调用
    var bindFun = Person.myBind(obj, 'poetry1') // undefined
    var a = new bindFun(10) // Person name: poetry1、Person age: 10、Person this: fBound {}
    a.say() // person say
    
    // 再测试作为普通函数调用
    var bindNormalFun = normalFun.myBind(obj, 'poetry2') // undefined
    bindNormalFun(12) 
    // 普通函数name: poetry2 
    // 普通函数 age: 12 
    // 普通函数 this: {name: 'poetries', age: 18}
```

> **注意** ：
> `bind`之后不能再次修改`this`的指向（箭头函数的底层实现原理依赖`bind`绑定this后不能再次修改`this`的特性），`bind`多次后执行，函数`this`还是指向第一次`bind`的对象
