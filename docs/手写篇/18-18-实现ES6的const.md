# 18 实现ES6的const

>
> 由于ES5环境没有`block`的概念，所以是无法百分百实现`const`，只能是挂载到某个对象下，要么是全局的`windo`w，要么就是自定义一个`object`来当容器
```js
    var __const = function __const (data, value) {
        window.data = value // 把要定义的data挂载到window下，并赋值value
        Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
          enumerable: false,
          configurable: false,
          get: function () {
            return value
          },
          set: function (data) {
            if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
              throw new TypeError('Assignment to constant variable.')
            } else {
              return value
            }
          }
        })
      }
      __const('a', 10)
      console.log(a)
      delete a
      console.log(a)
      for (let item in window) { // 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
        if (item === 'a') { // 因为不可枚举，所以不执行
          console.log(window[item])
        }
      }
      a = 20 // 报错
```

>
> `Vue`目前双向绑定的核心实现思路就是利用`Object.defineProperty`对`get`跟`set`进行劫持，监听用户对属性进行调用以及赋值时的具体情况，从而实现的双向绑定
