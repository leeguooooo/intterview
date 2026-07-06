---
title: "Tree Shaking原理是什么"
---

# 21 Tree Shaking原理是什么

### 对tree-shaking的了解

**作用：**

它表示在打包的时候会去除一些无用的代码

**原理** ：

  * `ES6`的模块引入是静态分析的，所以在编译时能正确判断到底加载了哪些模块
  * 分析程序流，判断哪些变量未被使用、引用，进而删除此代码

**特点：**

  * 在生产模式下它是默认开启的，但是由于经过`babel`编译全部模块被封装成`IIFE`，它存在副作用无法被`tree-shaking`掉
  * 可以在`package.json`中配置`sideEffects`来指定哪些文件是有副作用的。它有两种值，一个是布尔类型，如果是`false`则表示所有文件都没有副作用；如果是一个数组的话，数组里的文件路径表示改文件有副作用
  * `rollup`和`webpack`中对`tree-shaking`的层度不同，例如对`babel`转译后的`class`，如果`babel`的转译是宽松模式下的话(也就是`loose`为`true`)，`webpack`依旧会认为它有副作用不会`tree-shaking`掉，而`rollup`会。这是因为`rollup`有程序流分析的功能，可以更好的判断代码是否真正会产生副作用。

### 原理

  * `ES6 Module` 引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
  * 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

> 依赖于`import/export`

通过导入所有的包后再进行条件获取。如下：
```js
    import foo from "foo";
    import bar from "bar";
    
    if(condition) {
        // foo.xxxx
    } else {
        // bar.xxx
    }
```

> ES6的import语法完美可以使用tree shaking，因为可以在代码不运行的情况下就能分析出不需要的代码

**CommonJS的动态特性模块意味着tree shaking不适用**
。因为它是不可能确定哪些模块实际运行之前是需要的或者是不需要的。在ES6中，进入了完全静态的导入语法：import。这也意味着下面的导入是不可行的：
```js
    // 不可行，ES6 的import是完全静态的
    if(condition) {
        myDynamicModule = require("foo");
    } else {
        myDynamicModule = require("bar");
    }
```

> 补充（现代做法）：webpack5 的 Tree Shaking 增强了对「嵌套 / 内部导出」和 CommonJS 的部分摇树支持，并能识别 `package.json` 的 `sideEffects: false` 跨模块删除未用代码。实践要点：①库作者务必标注 `sideEffects`；②避免在入口处写有副作用的顶层语句；③`import` 具名导入而非整包默认导入。基于 Rollup 的工具链（Vite 生产构建）摇树更彻底。
