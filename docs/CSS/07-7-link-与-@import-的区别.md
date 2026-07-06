---
title: "link 与 @import 的区别"
---

# 7 link 与 @import 的区别

  * `link`功能较多，可以定义 `RSS`，定义 `Rel` 等作用，而`@import`只能用于加载 `css`
  * 当解析到`link`时，页面会同步加载所引的 `css`，而`@import`所引用的 `css` 会等到页面加载完才被加载
  * `@import`需要 `IE5` 以上才能使用
  * `link`可以使用 `js` 动态引入，`@import`不行

> 补充(现代做法)：现代工程里 CSS 大多由 Vite/webpack 等打包器处理，`@import` 在构建期就被内联合并，运行时的串行阻塞问题已不存在；但在"运行时直接写在 `.css` 里的 `@import`"仍要避免。原生层面还可用 `<link rel="preload" as="style">` 预加载关键样式，以及用 CSS `@layer` 管理层叠优先级，替代靠书写顺序与 `!important` 硬压。
