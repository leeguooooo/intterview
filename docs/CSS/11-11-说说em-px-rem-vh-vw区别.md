---
title: "说说em px rem vh vw区别"
---

# 11 说说em/px/rem/vh/vw区别

传统的项目开发中，我们只会用到`px`、`%`、`em`这几个单位，它可以适用于大部分的项目开发，且拥有比较良好的兼容性

从CSS3开始，浏览器对计量单位的支持又提升到了另外一个境界，新增了`rem`、`vh`、`vw`、`vm`等一些新的计量单位

利用这些新的单位开发出比较良好的响应式页面，适应多种不同分辨率的终端，包括移动设备等

在`css`单位中，可以分为长度单位、绝对单位，如下表所指示

CSS单位 |   
---|---  
相对长度单位 | em、ex、ch、rem、vw、vh、vmin、vmax、%  
绝对长度单位 | cm、mm、in、px、pt、pc  
  
这里我们主要讲述`px`、`em`、`rem`、`vh`、`vw`

**px**

`px`，表示像素，所谓像素就是呈现在我们显示器上的一个个小点，每个像素点都是大小等同的，所以像素为计量单位被分在了绝对长度单位中

有些人会把`px`认为是相对长度，原因在于在移动端中存在设备像素比，`px`实际显示的大小是不确定的

这里之所以认为`px`为绝对单位，在于`px`的大小和元素的其他属性无关

**em**

em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸（`1em = 16px`）

为了简化 `font-size` 的换算，我们需要在`css`中的 `body` 选择器中声明`font-size`= `62.5%`，这就使 em 值变为
`16px*62.5% = 10px`

这样 `12px = 1.2em`, `10px = 1em`, 也就是说只需要将你的原来的`px` 数值除以 10，然后换上 `em`作为单位就行了

特点：

  * `em` 的值并不是固定的
  * `em` 会继承父级元素的字体大小
  * `em` 是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸
  * 任意浏览器的默认字体高都是 `16px`

举个例子
```html
    <div class="big">
        我是14px=1.4rem<div class="small">我是12px=1.2rem</div>
    </div>
```

样式为
```css
    <style>
        html {font-size: 10px;  } /*  公式16px*62.5%=10px  */  
        .big{font-size: 1.4rem}
        .small{font-size: 1.2rem}
    </style>
```

这时候`.big`元素的`font-size`为14px，而`.small`元素的`font-size`为12px

**rem(常用)**

  * 根据屏幕的分辨率动态设置`html`的文字大小，达到等比缩放的功能
  * 保证`html`最终算出来的字体大小，不能小于`12px`
  * 在不同的移动端显示不同的元素比例效果
  * 如果`html`的`font-size:20px`的时候，那么此时的`1rem = 20px`
  * 把设计图的宽度分成多少分之一，根据实际情况
  * `rem`做盒子的宽度，`viewport`缩放

`head`加入常见的`meta`属性
```html
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <!--这个是关键-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0，minimum-scale=1.0">
```

把这段代码加入`head`中的`script`预先加载
```js
    // rem适配用这段代码动态计算html的font-size大小
    (function(win) {
        var docEl = win.document.documentElement;
        var timer = '';
    
        function changeRem() {
            var width = docEl.getBoundingClientRect().width;
            if (width > 750) { // 750是设计稿大小
                width = 750;
            }
            var fontS = width / 10; // 把设备宽度十等分 1rem<=75px
            docEl.style.fontSize = fontS + "px";
        }
        win.addEventListener("resize", function() {
            clearTimeout(timer);
            timer = setTimeout(changeRem, 30);
        }, false);
        win.addEventListener("pageshow", function(e) {
            if (e.persisted) { //清除缓存
                clearTimeout(timer);
                timer = setTimeout(changeRem, 30);
            }
        }, false);
        changeRem();
    })(window)
```

  * 或者使用淘宝提供的库 <https://github.com/amfe/lib-flexible>[ (opens new window)](https://github.com/amfe/lib-flexible)

> 补充(现代做法)：`lib-flexible` + 手写 JS 动态改根字号的方案已基本被淘汰。现代项目直接用构建期插件 `postcss-px-to-viewport`(把设计稿 px 自动转 `vw`)，无需 JS、无重排开销；或用 `clamp(min, 理想vw, max)` 做流式排版。`lib-flexible` 仓库本身也已归档，不再推荐新项目使用。

**vh、vw**

`vw` ，就是根据窗口的宽度，分成`100`等份，`100vw`就表示满宽，`50vw`就表示一半宽。（`vw`
始终是针对窗口的宽），同理，`vh`则为窗口的高度

这里的窗口分成几种情况：

  * 在桌面端，指的是浏览器的可视区域
  * 移动端指的就是布局视口

像`vw`、`vh`，比较容易混淆的一个单位是`%`，不过百分比宽泛的讲是相对于父元素：

  * 对于普通定位元素就是我们理解的父元素
  * 对于`position: absolute;`的元素是相对于已定位的父元素
  * 对于`position: fixed;`的元素是相对于 `ViewPort`（可视窗口）

**总结**

  * **px** ：绝对单位，页面按精确像素展示
  * **%** ：相对于父元素的宽度比例
  * **em** ：相对单位，基准点为父节点字体的大小，如果自身定义了`font-size`按自身来计算（浏览器默认字体是`16px`），整个页面内`1em`不是一个固定的值
  * **rem** ：相对单位，可理解为`root em`, 相对根节点`html`的字体大小来计算
  * **vh、vw** ：主要用于页面视口大小布局，在页面布局上更加方便简单 
    * `vw`：屏幕宽度的`1%`
    * `vh`：屏幕高度的`1%`
    * `vmin`：取`vw`和`vh`中较小的那个（如：`10vh=100px 10vw=200px` 则`vmin=10vh=100px`）
    * `vmax`：取`vw`和`vh`中较大的那个（如：`10vh=100px 10vw=200px` 则`vmax=10vw=200px`）

> 补充(现代做法)：移动端用 `100vh` 会被浏览器地址栏的伸缩高度坑到(实际可视区被工具栏遮挡)。现代视口单位 `dvh`(dynamic，随工具栏变化)、`svh`(small，最小可视区)、`lvh`(large，最大可视区) 已被主流浏览器支持，全屏布局优先用 `100dvh`。另外字号排版可用 `clamp(1rem, 2.5vw, 1.5rem)` 实现"有上下限的流式缩放"。
