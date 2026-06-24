# 第26题 实现 arr[-1] = arr[arr.length - 1]
```js
    function createArr (...elements) {
      let handler = {
        get (target, key, receiver) { // 第三个参数传不传都可以
          let index = Number(key)
          if (index < 0) {
            index = String(target.length + index)
          }
          return Reflect.get(target, index, receiver)
        }
      }
      let target = []
      target.push(...elements)
      return new Proxy(target, handler)
    }
    var arr1 = createArr(1, 2, 3)
    console.log(arr1[-1]) // 3
    console.log(arr1[-2]) // 2
```
