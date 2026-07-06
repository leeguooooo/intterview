---
title: "webpack import 原理"
---

# 10 webpack import()原理

### 动态导入原理

> 用于动态加载的`import()`方法

  * 这个功能可以实现按需加载我们的代码，并且使用了`promise`式的回调，获取加载的包
  * 在代码中所有被`import()`的模块，都将打成一个单独的包，放在`chunk`存储的目录下。在浏览器运行到这一行代码时，就会自动请求这个资源，实现异步加载
```js
    // 这里是一个简单的demo。
    // 可以看到，import()的语法十分简单。该函数只接受一个参数，就是引用包的地址
    import('lodash').then(_ => {
      // Do something with lodash (a.k.a '_')...
     })
```

### webpack中如何实现动态导入？

  1. 使用`import(/** webpackChunkName: "lodash" **/ 'lodash').then(_ => {})`，同时可以在`webpack.config.js`中配置一下`output的chunkFilename`为`[name].bunld.js`将要导入的模块单独抽离到一个`bundle`中（注意 `chunkFilename` 应为 `[name].bundle.js`），以此实现代码分离。
  2. 使用`async`，由于`import()`返回的是一个`promise`, 因此我们可以使用`async`函数来简化它，不过需要`babel`这样的预处理器及处理转换`async`的插件。`const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');`
