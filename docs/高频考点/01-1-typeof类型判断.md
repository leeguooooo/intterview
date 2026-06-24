# 1 typeof类型判断

> `typeof` 是否能正确判断类型？`instanceof` 能正确判断对象的原理是什么

  * `typeof` 对于原始类型来说，除了 `null` 都可以显示正确的类型
```js
    typeof 1 // 'number'
    typeof '1' // 'string'
    typeof undefined // 'undefined'
    typeof true // 'boolean'
    typeof Symbol() // 'symbol'
```

> `typeof` 对于对象来说，除了函数都会显示 `object`，所以说 `typeof` 并不能准确判断变量到底是什么类型
```js
    typeof [] // 'object'
    typeof {} // 'object'
    typeof console.log // 'function'
```

> 如果我们想判断一个对象的正确类型，这时候可以考虑使用 `instanceof`，因为内部机制是通过原型链来判断的
```js
    const Person = function() {}
    const p1 = new Person()
    p1 instanceof Person // true
    
    var str = 'hello world'
    str instanceof String // false
    
    var str1 = new String('hello world')
    str1 instanceof String // true
```

> 对于原始类型来说，你想直接通过 `instanceof`来判断类型是不行的
