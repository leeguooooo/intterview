原文链接: [https://interview.poetries.top/docs/excellent-docs/2-CSS%E6%A8%A1%E5%9D%97.html](https://interview.poetries.top/docs/excellent-docs/2-CSS%E6%A8%A1%E5%9D%97.html)

# CSS

## 简版速记

> 高频考点速查，面试前 5 分钟扫一遍。

- **盒模型**：标准 `content-box`(width 不含 padding/border) vs 怪异 `border-box`(width 含 padding/border)；`box-sizing` 切换。
- **BFC**：独立渲染区域。触发：`overflow!=visible`、`float`、`position:absolute/fixed`、`display:inline-block/flex/grid`、根元素。用途：清浮动、防 margin 重叠、两栏自适应。
- **层叠上下文**：触发于 `position+z-index`、`opacity<1`、`transform`、`filter`、`flex 子项+z-index` 等；同一上下文内 `z-index` 才可比。
- **居中**：不定宽高首选 `flex`(`justify-content+align-items:center`)、`grid(place-items:center)`、`绝对定位+transform:translate(-50%,-50%)`。
- **选择器权重**：`!important` > 内联(1000) > id(100) > class/属性/伪类(10) > 标签/伪元素(1) > 通配符(0)；同级后写覆盖先写。解析方向从右向左。
- **清浮动**：父级 `overflow:hidden` 触发 BFC，或 `.clearfix::after{content:'';display:block;clear:both}`(推荐)。
- **link vs @import**：link 并行加载、可 JS 动态插入、功能多；@import 串行、阻塞、需 IE5+。
- **单位**：`px`绝对；`em`相对父字号；`rem`相对根字号；`vw/vh`视口 1%；`vmin/vmax`取较小/较大。
- **flex:1** = `flex-grow:1 flex-shrink:1 flex-basis:0%`；`flex:auto`=`1 1 auto`；`flex:none`=`0 0 auto`。
- **回流 vs 重绘**：回流(改几何:位置/尺寸/增删节点/读 offset 等)必触发重绘；重绘(改颜色等非几何)不一定回流。优化：批量改 class、`transform/opacity` 走合成层、读写分离、`documentFragment`。
- **隐藏元素**：`display:none`(脱流不交互)、`visibility:hidden`(占位不交互)、`opacity:0`(占位可交互)。
- **GPU 加速**：`transform`、`opacity`、`filter`、`will-change`；注意层爆炸。
- **省略号**：单行 `overflow:hidden;white-space:nowrap;text-overflow:ellipsis`；多行 `-webkit-line-clamp + display:-webkit-box + -webkit-box-orient:vertical`。
- **预处理器**：Sass/Less/Stylus —— 变量(`$`/`@`/`=`)、嵌套、mixin、作用域、模块化。
- **三栏自适应**：float+margin、float+calc、圣杯、双飞翼、flex、grid。
- **fixed 失效**：祖先元素设了 `transform/filter/perspective`(非 none) 时，fixed 相对该祖先而非视口。

![CSS CHEAT
SHEET](/images/s_poetries_work_uploads_2022_07_47b89e6c7852b4c4.png)


## 目录

- [1 盒模型](./01-1-盒模型.html)
- [2 BFC](./02-2-BFC.html)
- [3 层叠上下文](./03-3-层叠上下文.html)
- [4 居中布局](./04-4-居中布局.html)
- [5 选择器权重计算方式](./05-5-选择器权重计算方式.html)
- [6 清除浮动](./06-6-清除浮动.html)
- [7 link 与 @import 的区别](./07-7-link-与-@import-的区别.html)
- [8 CSS3的新特性](./08-8-CSS3的新特性.html)
- [9 CSS动画和过渡](./09-9-CSS动画和过渡.html)
- [10 有哪些方式（CSS）可以隐藏页面元素](./10-10-有哪些方式-CSS-可以隐藏页面元素.html)
- [11 说说em/px/rem/vh/vw区别](./11-11-说说em-px-rem-vh-vw区别.html)
- [12 flex布局](./12-12-flex布局.html)
- [13 关于伪类 LVHA 的解释](./13-13-关于伪类-LVHA-的解释.html)
- [14 calc函数](./14-14-calc函数.html)
- [15 伪类和伪元素](./15-15-伪类和伪元素.html)
- [16 浏览器是怎样解析 CSS 选择器的](./16-16-浏览器是怎样解析-CSS-选择器的.html)
- [17 浏览器如何判断是否支持 webp 格式图片](./17-17-浏览器如何判断是否支持-webp-格式图片.html)
- [18 CSS加载问题](./18-18-CSS加载问题.html)
- [19 文字单超出显示省略号](./19-19-文字单超出显示省略号.html)
- [20 页面变灰](./20-20-页面变灰.html)
- [21 CSS中可继承的属性](./21-21-CSS中可继承的属性.html)
- [22 常规流(文档流)是个怎样的排列关系](./22-22-常规流-文档流-是个怎样的排列关系.html)
- [23 inline-block的使用场景](./23-23-inline-block的使用场景.html)
- [24 position: fixed什么时候会失效？](./24-24-position-fixed什么时候会失效.html)
- [25 回流（reflow）和重绘（repaint）的理解](./25-25-回流-reflow-和重绘-repaint-的理解.html)
- [26 GPU加速的原因](./26-26-GPU加速的原因.html)
- [27 说说will-change](./27-27-说说will-change.html)
- [28 z-index和background的覆盖关系](./28-28-z-index和background的覆盖关系.html)
- [29 移动端中css你是使用什么单位](./29-29-移动端中css你是使用什么单位.html)
- [30 说说设备像素、css像素、设备独立像素、dpr、ppi 之间的区别](./30-30-说说设备像素-css像素-设备独立像素-dpr-ppi-之间的区别.html)
- [31 在移动端中怎样初始化根元素的字体大小](./31-31-在移动端中怎样初始化根元素的字体大小.html)
- [32 移动端中不同手机html默认的字体大小都是一样的吗](./32-32-移动端中不同手机html默认的字体大小都是一样的吗.html)
- [33 line-height 如何继承](./33-33-line-height-如何继承.html)
- [34 css 怎么开启硬件加速(GPU 加速)](./34-34-css-怎么开启硬件加速-GPU-加速.html)
- [35 flex:1 是哪些属性组成的](./35-35-flex-1-是哪些属性组成的.html)
- [36 css选择器有哪些？优先级？哪些属性可以继承？](./36-36-css选择器有哪些-优先级-哪些属性可以继承.html)
- [37 flex弹性盒布局模型及适用场景？](./37-37-flex弹性盒布局模型及适用场景.html)
- [38 介绍一下grid网格布局](./38-38-介绍一下grid网格布局.html)
- [39 什么是响应式设计？响应式设计的基本原理是什么](./39-39-什么是响应式设计-响应式设计的基本原理是什么.html)
- [40 如果要做优化，CSS提高性能的方法有哪些？](./40-40-如果要做优化-CSS提高性能的方法有哪些.html)
- [41 如何实现单行／多行文本溢出的省略样式？](./41-41-如何实现单行／多行文本溢出的省略样式.html)
- [42 让Chrome支持小于12px 的文字方式有哪些](./42-42-让Chrome支持小于12px-的文字方式有哪些.html)
- [43 说说对CSS预编语言的理解？有哪些区别?](./43-43-说说对CSS预编语言的理解-有哪些区别.html)
- [44 编程题](./44-44-编程题.html)
