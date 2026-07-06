---
title: "Babel Runtime"
---

# 20 Babel Runtime

> `Babel
> Runtime`是一个工具库，它包含了`Babel`编译过程中会用到的一些辅助函数，比如`_extends`、`_classCallCheck`等，这些函数在编译过程中会被插入到每个文件的头部，如果每个文件都插入一遍，会导致代码冗余，所以`Babel
> Runtime`就是用来解决这个问题的
```js
    // .babelrc 配置runtime之后
    
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
    }
```

重新打包后，没有污染`window`

![](/images/s_poetries_work_uploads_2023_02_e784fca92b368db7.webp)
