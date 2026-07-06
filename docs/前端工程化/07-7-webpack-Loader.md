---
title: "webpack Loader"
---

# 7 webpack Loader

> 由于 Webpack 是基于 Node，因此 Webpack 其实是只能识别 js 模块，比如 css / html /
> 图片等类型的文件并无法加载，因此就需要一个对 不同格式文件转换器。其实 Loader 做的事，也并不难理解: 对 Webpack
> 传入的字符串进行按需修改。例如一个最简单的 Loader:
```js
    // html-loader/index.js
    module.exports = function(htmlSource) {
    	// 返回处理后的代码字符串
    	// 删除 html 文件中的所有注释
    	return htmlSource.replace(/<!--[\w\W]*?-->/g, '')
    }
```

> 当然，实际的 Loader 不会这么简单，通常是需要将代码进行分析，构建 AST (抽象语法树)，
> 遍历进行定向的修改后，再重新生成新的代码字符串。如我们常用的 Babel-loader 会执行以下步骤:

  * `babylon` 将 `ES6/ES7` 代码解析成 `AST`
  * `babel-traverse` 对 `AST` 进行遍历转译，得到新的 AST
  * 新 `AST` 通过 `babel-generator` 转换成 `ES5`

**Loader 特性:**

  * 链式传递，按照配置时相反的顺序链式执行；
  * 基于 Node 环境，拥有 较高权限，比如文件的增删查改；
  * 可同步也可异步；

**常用 Loader:**

  * `file-loader`: 加载文件资源，如 字体 / 图片 等，具有移动/复制/命名等功能；
  * `url-loader`: 通常用于加载图片，可以将小图片直接转换为 Date Url，减少请求；
  * `babel-loader`: 加载 js / jsx 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题；
  * `ts-loader`: 加载 ts / tsx 文件，编译 TypeScript；
  * `style-loader`: 将 css 代码以`<style>`标签的形式插入到 html 中；
  * `css-loader`: 分析@import和url()，引用 css 文件与对应的资源；
  * `postcss-loader`: 用于 css 的兼容性处理，具有众多功能，例如 添加前缀，单位转换 等；
  * `less-loader / sass-loader`: css预处理器，在 css 中新增了许多语法，提高了开发效率；

**编写原则:**

  * 单一原则: 每个 Loader 只做一件事；
  * 链式调用: Webpack 会按顺序链式调用每个 Loader；
  * 统一原则: 遵循 Webpack制定的设计规则和结构，输入与输出均为字符串，各个 Loader 完全独立，即插即用；
