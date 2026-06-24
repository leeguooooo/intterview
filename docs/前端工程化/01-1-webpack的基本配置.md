# 1 webpack的基本配置

基于`webpack4`
```js
    // webpack.common.js
    const path = require('path')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    const { srcPath, distPath } = require('./paths')
    
    module.exports = {
        entry: path.join(srcPath, 'index'),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: ['babel-loader'],
                    include: srcPath,
                    exclude: /node_modules/
                },
                // {
                //     test: /\.vue$/,
                //     loader: ['vue-loader'],
                //     include: srcPath
                // },
                // {
                //     test: /\.css$/,
                //     // loader 的执行顺序是：从后往前（知识点）
                //     loader: ['style-loader', 'css-loader']
                // },
                {
                    test: /\.css$/,
                    // loader 的执行顺序是：从后往前
                    loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
                },
                {
                    test: /\.less$/,
                    // 增加 'less-loader' ，注意顺序
                    loader: ['style-loader', 'css-loader', 'less-loader']
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(srcPath, 'index.html'),
                filename: 'index.html'
            })
        ]
    }
```  
```js
    // paths.js
    /**
     * @description 常用文件夹路径
     */
    
    const path = require('path')
    
    const srcPath = path.join(__dirname, '..', 'src')
    const distPath = path.join(__dirname, '..', 'dist')
    
    module.exports = {
        srcPath,
        distPath
    }
```  
```js
    // webpack.dev.js
    
    const path = require('path')
    const webpack = require('webpack')
    const webpackCommonConf = require('./webpack.common.js')
    const { smart } = require('webpack-merge')
    const { srcPath, distPath } = require('./paths')
    
    module.exports = smart(webpackCommonConf, {
        mode: 'development',
        module: {
            rules: [
                // 直接引入图片 url
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: 'file-loader'
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                // window.ENV = 'development'
                ENV: JSON.stringify('development')
            })
        ],
        devServer: {
            port: 8080,
            progress: true,  // 显示打包的进度条
            contentBase: distPath,  // 根目录
            open: true,  // 自动打开浏览器
            compress: true,  // 启动 gzip 压缩
    
            // 设置代理
            proxy: {
                // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
                '/api': 'http://localhost:3000',
    
                // 将本地 /api2/xxx 代理到 localhost:3000/xxx
                '/api2': {
                    target: 'http://localhost:3000',
                    pathRewrite: {
                        '/api2': ''
                    }
                }
            }
        }
    })
```  
```js
    // webpack.prod.js
    
    const path = require('path')
    const webpack = require('webpack')
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    const webpackCommonConf = require('./webpack.common.js')
    const { smart } = require('webpack-merge')
    const { srcPath, distPath } = require('./paths')
    
    module.exports = smart(webpackCommonConf, {
        mode: 'production',
        output: {
            filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
            path: distPath,
            // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
        },
        module: {
            rules: [
                // 图片 - 考虑 base64 编码的情况
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
        },
        plugins: [
            new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
            new webpack.DefinePlugin({
                // window.ENV = 'production'
                ENV: JSON.stringify('production')
            })
        ]
    })
```

> 补充（现代做法）：上文基于 `webpack4`，部分写法在 webpack5 已变。webpack5 中 `webpack-merge` 直接 `const { merge } = require('webpack-merge')`（旧版的 `smart` 已移除）；`file-loader` / `url-loader` 被内置的 **Asset Modules**（`type: 'asset' / 'asset/resource' / 'asset/inline'`）取代，无需再装 loader；`devServer` 的 `contentBase` 改为 `static`、`progress` 移到 CLI。面试可补一句「新项目用 webpack5 的 Asset Modules + 持久化缓存 `cache: { type: 'filesystem' }`，或直接用 Vite / Rspack」。
