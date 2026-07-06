---
title: "webpack性能优化 产出代码 线上运行 · 每日一题"
---

# 第179题 webpack性能优化-产出代码（线上运行）

**前言**

  * 体积更小
  * 合理分包，不重复加载
  * 速度更快、内存使用更少

**产出代码优化**

  * 小图片`base64`编码，减少`http`请求  
```js
        // 图片 - 考虑 base64 编码的情况
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 小于 5kb 的图片用 base64 格式产出
                        // 否则，依然延用 file-loader 的形式，产出 url 格式
                        limit: 5 * 1024,
    
                        // 打包到 img 目录下
                        outputPath: '/img1/',
    
                        // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
                        // publicPath: 'http://cdn.abc.com'
                    }
                }
            },
        ]
    }
```

  * `bundle`加`contenthash`，有利于浏览器缓存
  * 懒加载`import()`语法，减少首屏加载时间
  * 提取公共代码（第三方代码`Vue`、`React`、`loadash`等）没有必要多次打包，可以提取到`vendor`中
  * `IgnorePlugin`忽略不需要的包（如`moment`多语言），减少打包的代码
  * 使用`CDN`加速，减少资源加载时间  
```js
        output: {
      filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
      path: path.join(__dirname, '..', 'dist'),
      // 修改所有静态文件 url 的前缀（如 cdn 域名）
      // 这样index.html中引入的js、css、图片等资源都会加上这个前缀
      publicPath: 'http://cdn.abc.com'  
    },
```

  * `webpack`使用`production`模式，`mode: 'production'`
    * 自动压缩代码
    * 启动`Tree Shaking`
      * `ES6`模块化，`import`和`export`，`webpack`会自动识别，才会生效
      * `Commonjs`模块化，`require`和`module.exports`，`webpack`无法识别，不会生效
      * **ES6模块和Commonjs模块区别**
        * `ES6`模块是静态引入，编译时引入
        * `Commonjs`是动态引入，执行时引入
        * 只有`ES6 Module`才能静态分析，实现`Tree Shaking` ![](/images/s_poetries_work_uploads_2023_02_8c992a059adfd272.webp)
  * `Scope Hoisting`：是`webpack3`引入的一个新特性，它会分析出模块之间的依赖关系，尽可能地把打散的模块合并到一个函数中去，减少代码间的引用，从而减少代码体积 
    * 减少代码体积
    * 创建函数作用域更少
    * 代码可读性更好 ![](/images/s_poetries_work_uploads_2023_02_4312a5cf7761b232.webp)
