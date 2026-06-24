# 第144题 手写一个JS函数，实现数组扁平化Array Flatten

  * 写一个JS函数，实现数组扁平化，只减少一次嵌套
  * 如输入`[1,[2,[3]],4]` 输出`[1,2,[3],4]`

**思路**

  * 定义空数组`arr=[]` 遍历当前数组
  * 如果`item`非数组，则累加到`arr`
  * 如果`item`是数组，则遍历之后累加到`arr`
```js
    /**
     * 数组扁平化，使用 push
     * @param arr arr
     */
    function flatten1(arr) {
      const res = []
    
      arr.forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(n => res.push(n))
        } else {
          res.push(item)
        }
      })
    
      return res
    }
```  
```js
    /**
     * 数组扁平化，使用 concat
     * @param arr arr
     */
    function flatten2(arr) {
      let res = []
    
      arr.forEach(item => {
        res = res.concat(item)
      })
    
      return res
    }
```  
```js
    // 功能测试
    const arr = [1, [2, [3], 4], 5]
    console.info(flatten2(arr))
```

**连环问：手写一个JS函数，实现数组深度扁平化**

  * 如输入`[1, [2, [3]], 4]` 输出`[1,2,3,4]`

**思路**

  * 先实现一级扁平化，然后递归调用，直到全部扁平化
```js
    /**
     * 数组深度扁平化，使用 push
     * @param arr arr
     */
    function flattenDeep1(arr) {
      const res = []
    
      arr.forEach(item => {
        if (Array.isArray(item)) {
          const flatItem = flattenDeep1(item) // 递归
          flatItem.forEach(n => res.push(n))
        } else {
          res.push(item)
        }
      })
    
      return res
    }
```  
```js
    /**
     * 数组深度扁平化，使用 concat
     * @param arr arr
     */
    function flattenDeep2(arr) {
      let res = []
    
      arr.forEach(item => {
        if (Array.isArray(item)) {
          const flatItem = flattenDeep2(item) // 递归
          res = res.concat(flatItem)
        } else {
          res = res.concat(item)
        }
      })
    
      return res
    }
```  
```js
    // 功能测试
    const arr = [1, [2, [3, ['a', [true], 'b'], 4], 5], 6]
    console.info( flattenDeep2(arr) )
```
