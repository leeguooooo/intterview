---
title: "position fixed什么时候会失效"
---

# 24 position: fixed什么时候会失效？

我们知道，设置了`position: fixed`固定定位属性的元素会脱离文档流，达到“超然脱俗”的境界。

> 也就是说此时给这种元素设置`top, left, right, bottom`等属性是根据**浏览器窗口** 定位的，与其上级元素的位置无关。

但是有一种情况例外：

  * 若是设置了`position: fixed`属性的元素，它的祖先元素设置了`transform`属性则会导致固定定位属性失效。
  * 只要你的`transform`设置的不是`none`，都会影响到`position: fixed`，因为此时就会相对于祖先元素指定坐标，而不是浏览器窗口。

注意，这个特性表现，目前只在Chrome浏览器/FireFox浏览器下有。IE浏览器，包括IE11, `fixed`还是`fixed`的表现。
