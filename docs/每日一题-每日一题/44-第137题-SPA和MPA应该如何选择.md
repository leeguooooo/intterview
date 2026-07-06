---
title: "SPA和MPA应该如何选择"
---

# 第137题 SPA和MPA应该如何选择

  * `SPA（Single Page Application）` 单页面应用
  * `MPA（Multi Page Application）` 多页面应用
  * 默认情况下`Vue`、`React`都是`SPA`
  * `SPA`特点 
    * 一个`HTML`页面通过前端路由来切换不同的前端功能
    * 以为操作为主，非展示为主
    * 适合一个综合`web`应用
    * **SPA场景**
      * 大型后台管理系统
      * 比较复杂的`WebApp`如外卖`H5`
  * `MPA`特点 
    * 功能较少，一个页面展示的完
    * 以为展示为主，操作比较少
    * 适合一个孤立的页面
    * **MPA场景**
      * 分享页，如腾讯文档分享出去
      * 新闻详情页，如新闻`App`的详情页
      * 这类不合适用`SPA`做，生成的`JS`包大，加载慢
```js
    // spa单页应用配置
    
    module.exports = { 
      entry: path.join(srcPath, 'index'), // 单入口
      plugins: [
        new HtmlWebpackPlugin({
            template: path.join(tplPath, 'index.html'), // 单个页面
            filename: 'index.html'
        })
      ]
    }
```  
```js
    // mpa多页应用配置
    
    module.exports = {
      mode: 'production',
      // 多入口
      entry: {
        home: './src/home/index.js',
        product: './src/product/index.js',
        about: './src/about/index.js'
      },
      output: {
        filename: 'js/[name].[contentHash].js', // name 即 entry 的 key
        path: path.resolve(__dirname, './dist')
      },
      plugins: [
        // 三个页面
        new HtmlWebpackPlugin({
          title: '首页',
          template: './template/index.html',
          filename: 'home.html',
          chunks: ['home']
        }),
        new HtmlWebpackPlugin({
          title: '产品',
          template: './template/product.html',
          filename: 'product.html',
          chunks: ['product']
        }),
        new HtmlWebpackPlugin({
          title: '关于',
          template: './template/about.html',
          filename: 'about.html',
          chunks: ['about']
        })
      ]
    }
```
