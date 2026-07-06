---
title: "Babel是如何编译Class的"
---

# 18 Babel是如何编译Class的？

就拿下面的类来说：
```javascript
    class Person {
      constructor ({ name }) {
        this.name = name
        this.getSex = function () {
          return 'boy'
        }
      }
      getName () {
        return this.name
      }
      static getLook () {
        return 'sunshine'
      }
    }
```

当我们在使用`babel`的这些`plugin`或者使用`preset`的时候，有一个配置属性`loose`它默认是为`false`，在这样的条件下：

`Class`编译后：

  * 总体来说`Class`会被封装成一个`IIFE`立即执行函数
  * 立即执行函数返回的是一个与类同名的构造函数
  * 实例属性和方法定义在构造函数内(如`name`和`getSex()`)
  * 类内部声明的属性方法(`getName`)和静态属性方法(`getLook`)是会被`Object.defineProperty`所处理，将其可枚举属性设置为`false`

编译后的代码：
```javascript
    "use strict";
    
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    
    var Person = /*#__PURE__*/ (function () {
      function Person(_ref) {
        var name = _ref.name;
    
        _classCallCheck(this, Person);
    
        this.name = name;
    
        this.getSex = function () {
          return "boy";
        };
      }
    
      _createClass(
        Person,
        [
          {
            key: "getName",
            value: function getName() {
              return this.name;
            },
          },
        ],
        [
          {
            key: "getLook",
            value: function getLook() {
              return "sunshine";
            },
          },
        ]
      );
    
      return Person;
    })();
```

为什么`Babel`对于类的处理会使用`Object.defineProperty`这种形式呢？它和直接使用原型链有什么不同吗？

  * 通过原型链声明的属性和方法是可枚举的，也就是可以被`for...of...`搜寻到
  * 而类内部声明的方法是不可枚举的

所以，babel为了符合ES6真正的语义，编译类时采取了`Object.defineProperty`来定义原型方法。

但是可以通过设置`babel`的`loose`模式(宽松模式)为`true`，它会不严格遵循ES6的语义，而采取更符合我们平常编写代码时的习惯去编译代码，在`.babelrc`中可以如下设置：
```javascript
    {
      "presets": [["env", { "loose": true }]]
    }
```

比如上述的`Person`类的属性方法将会编译成直接在原型链上声明方法：
```javascript
    "use strict";
    
    var Person = /*#__PURE__*/function () {
      function Person(_ref) {
        var name = _ref.name;
        this.name = name;
    
        this.getSex = function () {
          return 'boy';
        };
      }
    
      var _proto = Person.prototype;
    
      _proto.getName = function getName() {
        return this.name;
      };
    
      Person.getLook = function getLook() {
        return 'sunshine';
      };
    
      return Person;
    }();
```

**总结**

  * 当使用`Babel`编译时默认的`loose`为`false`，即非宽松模式

  * 无论哪种模式，转换后的定义在类内部的属性方法是被定义在构造函数的原型对象上的；静态属性被定义到构造函数上

  * 只不过非宽松模式时，这些属性方法会被`_createClass`函数处理，函数内通过`Object.defineProperty()`设置属性的可枚举值`enumerable`为`false`

  * 由于在`_createClass`函数内使用了`Object`，所以非宽松模式下是会产生副作用的，而宽松模式下不会。

  * `webpack`中的`UglifyJS`依旧还是会将宽松模式认为是有副作用的，而`rollup`有**程序流程分析** 的功能，可以更好的判断代码是否真正产生副作用，所以它会认为宽松模式没有副作用。

(副作用大致理解为：一个函数会、或者可能会对函数外部变量产生影响的行为。)
