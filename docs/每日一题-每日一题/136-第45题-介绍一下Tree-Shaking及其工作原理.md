# 第45题 介绍一下Tree Shaking及其工作原理

> `Tree shaking` 是一种通过清除多余代码方式来优化项目打包体积的技术

**tree shaking的原理是什么**

  * `ES6 Module` 引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
  * 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

**common.js 和 es6 中模块引入的区别**

> CommonJS 是一种模块规范，最初被应用于 Nodejs，成为 Nodejs 的模块规范。运行在浏览器端的 JavaScript
> 由于也缺少类似的规范，在 ES6 出来之前，前端也实现了一套相同的模块规范 (例如: `AMD`)，用来对前端模块进行管理。自 ES6
> 起，引入了一套新的 `ES6 Module`
> 规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案。但目前浏览器对 `ES6 Module`
> 兼容还不太好，我们平时在 `Webpack` 中使用的 `export` 和 `import`，会经过 `Babel` 转换为 CommonJS
> 规范。在使用上的差别主要有

  * `CommonJS` 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
  * `CommonJS` 模块是运行时加载，ES6 模块是编译时输出接口。
  * `CommonJs` 是单个值导出，`ES6 Module`可以导出多个
  * `CommonJs` 是动态语法可以写在判断里，`ES6 Module` 静态语法只能写在顶层
  * `CommonJs` 的 `this` 是当前模块，`ES6 Module`的 `this` 是 `undefined`

> 补充（现代做法）：实际项目里 Tree Shaking 想真正生效，光靠「用 ES Module」还不够，要注意三点：① `package.json` 里声明 `"sideEffects": false`（或把有副作用的文件列成数组，如 `["*.css"]`），告诉打包器哪些模块删了也安全；② 生产模式（`mode:'production'`）下 webpack 才会配合压缩器（Terser）做 DCE 真正删除死代码，开发模式只标记不删；③ 避免被 Babel/TS 提前转成 CommonJS——`@babel/preset-env` 要设 `modules:false`、`tsconfig` 用 `"module":"esnext"`，否则静态结构被破坏，摇树失效。现代构建工具如 Vite/Rollup/esbuild 默认就基于 ESM 做摇树，配置成本更低。
