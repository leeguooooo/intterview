# 3 实现instanceOf

![原型链与 instanceof：实例沿 __proto__ 链逐层向上查找，命中构造函数 prototype 返回 true，到 null 返回 false](/images/diagrams/prototype-chain.webp)

**思路：**

  * 步骤1：先取得当前类的原型，当前实例对象的原型链
  * ​步骤2：一直循环（执行原型链的查找机制） 
    * 取得当前实例对象原型链的原型链（`proto = proto.__proto__`，沿着原型链一直向上查找）
    * 如果 当前实例的原型链`__proto__`上找到了当前类的原型`prototype`，则返回 `true`
    * 如果 一直找到`Object.prototype.__proto__ == null`，`Object`的基类(`null`)上面都没找到，则返回 `false`

![](/images/s_poetries_work_uploads_2023_02_5c6bd3977e62de20.png)
```js
    // 实例.__ptoto__ === 构造函数.prototype
    function _instanceof(instance, classOrFunc) {
        // 由于instance要检测的是某对象，需要有一个前置判断条件
        //基本数据类型直接返回false
        if(typeof instance !== 'object' || instance == null) return false;
    
        let proto = Object.getPrototypeOf(instance); // 等价于 instance.__ptoto__
        while(proto) { // 当proto == null时，说明已经找到了Object的基类null 退出循环
            // 实例的原型等于当前构造函数的原型
            if(proto == classOrFunc.prototype) return true;
            // 沿着原型链__ptoto__一层一层向上查
            proto = Object.getPrototypeof(proto); // 等价于 proto.__ptoto__
        }
    
        return false
    }
    
    console.log('test', _instanceof(null, Array)) // false
    console.log('test', _instanceof([], Array)) // true
    console.log('test', _instanceof('', Array)) // false
    console.log('test', _instanceof({}, Object)) // true
```
