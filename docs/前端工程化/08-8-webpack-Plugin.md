---
title: "webpack Plugin"
---

# 8 webpack Plugin

> 插件系统是 Webpack 成功的一个关键性因素。在编译的整个生命周期中，Webpack 会触发许多事件钩子，Plugin
> 可以监听这些事件，根据需求在相应的时间点对打包内容进行定向的修改。

**一个最简单的 plugin 是这样的:**
```js
    class Plugin{
      	// 注册插件时，会调用 apply 方法
      	// apply 方法接收 compiler 对象
      	// 通过 compiler 上提供的 Api，可以对事件进行监听，执行相应的操作
      	apply(compiler){
      		// compilation 是监听每次编译循环
      		// 每次文件变化，都会生成新的 compilation 对象并触发该事件
        	compiler.plugin('compilation',function(compilation) {})
      	}
    }
```

**注册插件:**
```js
    // webpack.config.js
    module.export = {
    	plugins:[
    		new Plugin(options),
    	]
    }
```

**事件流机制:**

> Webpack 就像工厂中的一条产品流水线。原材料经过 Loader 与 Plugin 的一道道处理，最后输出结果。

  * 通过链式调用，按顺序串起一个个 Loader；
  * 通过事件流机制，让 Plugin 可以插入到整个生产过程中的每个步骤中；

> Webpack 事件流编程范式的核心是基础类 Tapable，是一种 观察者模式 的实现事件的订阅与广播：
```js
    const { SyncHook } = require("tapable")
    
    const hook = new SyncHook(['arg'])
    
    // 订阅
    hook.tap('event', (arg) => {
    	// 'event-hook'
    	console.log(arg)
    })
    
    // 广播
    hook.call('event-hook')
```

> `Webpack` 中两个最重要的类 `Compiler` 与 `Compilation` 便是继承于 `Tapable`，也拥有这样的事件流机制。

  * **Compiler** : 可以简单的理解为 Webpack 实例，它包含了当前 Webpack 中的所有配置信息，如 options， loaders, plugins 等信息，全局唯一，只在启动时完成初始化创建，随着生命周期逐一传递；

  * `Compilation`: 可以称为 编译实例。当监听到文件发生改变时，Webpack 会创建一个新的 Compilation 对象，开始一次新的编译。它包含了当前的输入资源，输出资源，变化的文件等，同时通过它提供的 api，可以监听每次编译过程中触发的事件钩子；

  * **区别:**

    * `Compiler` 全局唯一，且从启动生存到结束；
    * `Compilation`对应每次编译，每轮编译循环均会重新创建；
  * **常用 Plugin:**

    * UglifyJsPlugin: 压缩、混淆代码；
    * CommonsChunkPlugin: 代码分割；
    * ProvidePlugin: 自动加载模块；
    * html-webpack-plugin: 加载 html 文件，并引入 css / js 文件；
    * extract-text-webpack-plugin / mini-css-extract-plugin: 抽离样式，生成 css 文件； DefinePlugin: 定义全局变量；
    * optimize-css-assets-webpack-plugin: CSS 代码去重；
    * webpack-bundle-analyzer: 代码分析；
    * compression-webpack-plugin: 使用 gzip 压缩 js 和 css；
    * happypack: 使用多进程，加速代码构建；
    * EnvironmentPlugin: 定义环境变量；
  * 调用插件 `apply` 函数传入 `compiler` 对象

  * 通过 `compiler` 对象监听事件

**loader和plugin有什么区别？**

>
> webpack默认只能打包JS和JSON模块，要打包其它模块，需要借助loader，loader就可以让模块中的内容转化成webpack或其它loader可以识别的内容。

  * `loader`就是模块转换化，或叫加载器。不同的文件，需要不同的`loader`来处理。
  * `plugin`是插件，可以参与到整个webpack打包的流程中，不同的插件，在合适的时机，可以做不同的事件。

**webpack中都有哪些插件，这些插件有什么作用？**

  * `html-webpack-plugin` 自动创建一个HTML文件，并把打包好的JS插入到HTML文件中
  * `clean-webpack-plugin` 在每一次打包之前，删除整个输出文件夹下所有的内容
  * `mini-css-extrcat-plugin` 抽离CSS代码，放到一个单独的文件中
  * `optimize-css-assets-plugin` 压缩css

### 实现一个编译结束退出命令的插件
```js
    apply (compiler) {
      const afterEmit = (compilation, cb) => {
        cb()
        setTimeout(function () {
          process.exit(0)
        }, 1000)
      }
    
      compiler.plugin('after-emit', afterEmit)
    }
    }
    
    module.exports = BuildEndPlugin
```  
```html
    <script>
    export default {
      mounted () {
        var isGithub = location.href.indexOf('FE-Interview-Questions')!==-1
        var sId = isGithub ? '59154049' : '66575297'
        var script = document.createElement("script");
        script.type = "text/javascript"
        script.charset="UTF-8"
        script.src = `http://tajs.qq.com/stats?sId=${sId}`
        document.body.appendChild(script);
      }
    }
    </script>
```
