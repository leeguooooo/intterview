# 17 React 如何区分 Class组件 和 Function组件

一般的方式是借助 `typeof` 和 `Function.prototype.toString` 来判断当前是不是 `class`，如下：
```js
    function isClass(func) {
      return typeof func === 'function'
        && /^class\s/.test(Function.prototype.toString.call(func));
    }
```

但是这个方式有它的局限性，因为如果用了 `babel` 等转换工具，将 `class` 写法全部转为 `function` 写法，上面的判断就会失效。

> `React` 区分 `Class`组件 和 `Function`组件的方式很巧妙，由于所有的类组件都要继承
> `React.Component`，所以只要判断原型链上是否有 `React.Component` 就可以了：
```js
    AComponent.prototype instanceof React.Component
```
