# 27 说说will-change

> `will-
> change`是`CSS3`新增的标准属性，它的作用很单纯，就是`"增强页面渲染性能"`，当我们在通过某些行为触发页面进行大面积绘制的时候，浏览器往往是没有准备，只能被动的使用CUP去计算和重绘，由于事先没有准备，对于一些复杂的渲染可能会出现掉帧、卡顿等情况。而`will-
> change`则是在真正的行为触发之前告诉浏览器可能要进行重绘了，相当于浏览器把CUP拉上了，能从容的面对接下来的变形。

**常用的语法主要有：**

  * `will-change: scroll-position;` 即将开始滚动
  * `will-change: contents;` 内容要动画或者变化了
  * `will-change: transform;` transform相关的属性要变化了(常用)

**注意：**

  * `will-change`虽然可以开启加速，但是一定要适度使用
  * 开启加速的代价为手机的耗电量会增加
  * 使用时遵循最小化影响原则，可以对伪元素开启加速，独立渲染
  * 可以写在伪类中，例如`hover`中，这样移出元素的时候就会自动`remove`掉`will-change`了
  * 如果使用`JS`添加了`will-change`，注意要及时`remove`掉，方式就是`style.willChange = 'auto'`
