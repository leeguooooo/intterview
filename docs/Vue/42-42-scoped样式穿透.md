---
title: "scoped样式穿透"
---

# 42 scoped样式穿透

> `scoped`虽然避免了组件间样式污染，但是很多时候我们需要修改组件中的某个样式，但是又不想去除`scoped`属性

  1. 使用`/deep/`
```html
    <!-- Parent -->
    <template>
    <div class="wrap">
        <Child />
    </div>
    </template>
    
    <style lang="scss" scoped>
    .wrap /deep/ .box{
        background: red;
    }
    </style>
    
    <!-- Child -->
    <template>
        <div class="box"></div>
    </template>
```

  2. 使用两个`style`标签
```html
    <!-- Parent -->
    <template>
    <div class="wrap">
        <Child />
    </div>
    </template>
    
    <style lang="scss" scoped>
    /* 其他样式 */
    </style>
    <style lang="scss">
    .wrap .box{
      background: red;
    }
    </style>
    
    <!-- Child -->
    <template>
      <div class="box"></div>
    </template>
```
