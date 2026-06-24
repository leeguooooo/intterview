# 17 Babel 原理

> `babel` 的编译过程分为三个阶段：**parsing** 、**transforming** 、**generating** ，以 ES6 编译为
> ES5 作为例子：

  1. `ES6` 代码输入；
  2. `babylon` 进行解析得到 AST；
  3. `plugin` 用 `babel-traverse` 对 `AST`树进行遍历编译，得到新的 `AST`树；
  4. 用 `babel-generator` 通过 `AST`树生成 `ES5` 代码。

[Babel原理及其使用 (opens new window)](http://interview.poetries.top/principle-
docs/webpack/05-Babel%E5%8E%9F%E7%90%86%E5%8F%8A%E5%85%B6%E4%BD%BF%E7%94%A8.html)
