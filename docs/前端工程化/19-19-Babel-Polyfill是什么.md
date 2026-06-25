# 19 Babel Polyfill是什么

  * 什么是`Polyfill`? `Polyfill`是一种`JavaScript`的`API`的`Polyfill`，用来模拟实现一些`JavaScript`的新特性，使得这些新特性能够在旧的浏览器中运行
  * `core-js`是一个标准库，提供了一些常用的API的`Polyfill`，比如`Promise`、`Set`、`Map`等
  * `core-js`不支持`generator`，所以需要`regenerator-runtime`来`Polyfill`，`regenerator-runtime`是一个`generator`的`Polyfill`
  * `@babel/polyfill`是`core-js`和`regenerator-runtime`的集合，能满足`ES6`、`ES7`等新语法的`Polyfill`需求
  * `@babel/polyfill`会污染全局变量，所以不推荐使用。在`Babel 7.4`之后，`@babel/polyfill`被废弃了，推荐使用`core-js`和`regenerator-runtime`来`Polyfill`

![](/images/s_poetries_work_images_20210409165913.webp)
```js
    // 代码中使用babel/polyfill
    // 配置按需引入babel-polyfill 这里不用手动导入
    import "@babel/polyfill"
```

**@babel/polyfill按需引入**

  * 一次引入文件较大
  * 只有一部分功能，无需全部引入
  * 配置按需引入
```js
    // .babelrc
    
    {
        "presets": [
            [
                "@babel/preset-env", // 一堆plugins的集合，包含常用的plugins
                {
                    "useBuiltIns": "usage", // 按需引入babel-polyfill
                    "corejs": 3 // corejs版本3
                } 
            ]
        ],
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                    "absoluteRuntime": false,
                    "corejs": 3,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": false
                }
            ]
        ]
```

![](/images/s_poetries_work_uploads_2023_02_d0145df746d805a0.webp)

**@babel/polyfill的问题**

  * 会污染全局环境，挂载到`window`上, 会影响其他库 `window.Promise = function(){}` 使用方使用会覆盖冲突 `window.Promise = '123'`
  * 如果做一个独立的系统则无碍，但是如果是做一个第三方库，就会有问题

**小结**

`babel-polyfill`现在已经被弃用

  * `babel 7.4`之后弃用`babel-polyfill`
  * 直接推荐使用`core-js`和`regenerator`
