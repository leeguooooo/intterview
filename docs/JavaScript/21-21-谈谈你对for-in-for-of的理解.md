# 21 谈谈你对for in/for of的理解

> `for in`性能很差，迭代当前对象中可枚举的属性，并且一直查找到原型上去。

  * 问题1：遍历顺序数字优先
  * 问题2：无法遍历`symbol`属性
  * 问题3：可以遍历到原型属性中可枚举的
```js
    let obj = {
      name: 'poetry',
      age: 22,
      [Symbol('aa')]: 100,
      0: 200,
      1: 300
    }
```

![](/images/s_poetries_work_images_20210320102041.png)
![](/images/s_poetries_work_images_20210320103701.png)
```js
    for(let key in obj) {
      // 不遍历原型上的属性
      if(!obj.hasOwnProperty(key)) {
        break;
      }
    }
```

**遍历obj的私有属性拼接**
```js
    let keys = Object.keys(obj)
    keys = keys.concat(Object.getOwnPropertySymbols(obj1))
    keys.forEach(v=>{
      console.log(v)
    })
```

**for of**

  * 部分数据结构实现了迭代器规范 
    * `Symbol.itertor`
    * `数组/set/map`
    * 对象没有实现，`for of`不能遍历对象
```js
    // 数组具备迭代器规范，模拟实现
    var arr = [1,2,3,4,5]
    
    arr[Symbol.iterator] = function() {
      let self = this, index = 0;
    
      return {
        next() {
          if(index > self.length - 1) {
            return {
              done: true,
              value: undefined
            }
          }
          return {
            done: false,
            value: self[index++]
          }
        }
      }
    }
```  
```js
    // 使对象具备可迭代特性
    let obj = {
      0: 100,
      1: 200,
      length: 2
    }
    
    obj[Symbol.iterator] = Array.prototype[Symbol.iterator]
    
    for(var val of obj) {
      console.log(val)
    }
```
