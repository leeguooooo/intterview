# 第145题 手写一个getType函数，获取详细的数据类型

  * **获取类型**
    * 手写一个`getType`函数，传入任意变量，可准确获取类型
    * 如`number`、`string`、`boolean`等值类型
    * 引用类型`object`、`array`、`map`、`regexp`
```js
    /**
     * 获取详细的数据类型
     * @param x x
     */
    function getType(x) {
      const originType = Object.prototype.toString.call(x) // '[object String]'
      const spaceIndex = originType.indexOf(' ')
      const type = originType.slice(spaceIndex + 1, -1) // 'String' -1不要右边的]
      return type.toLowerCase() // 'string'
    }
```  
```js
    // 功能测试
    console.info( getType(null) ) // null
    console.info( getType(undefined) ) // undefined
    console.info( getType(100) ) // number
    console.info( getType('abc') ) // string
    console.info( getType(true) ) // boolean
    console.info( getType(Symbol()) ) // symbol
    console.info( getType({}) ) // object
    console.info( getType([]) ) // array
    console.info( getType(() => {}) ) // function
    console.info( getType(new Date()) ) // date
    console.info( getType(new RegExp('')) ) // regexp
    console.info( getType(new Map()) ) // map
    console.info( getType(new Set()) ) // set
    console.info( getType(new WeakMap()) ) // weakmap
    console.info( getType(new WeakSet()) ) // weakset
    console.info( getType(new Error()) ) // error
    console.info( getType(new Promise(() => {})) ) // promise
```
