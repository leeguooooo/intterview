# 虾皮（toC group）二面

### 有哪个组件最让你印象深刻

### 这个组件的原理介绍一下

### 这个组件有做兼容性处理吗

### 说出以下代码的输出
```html
    <body>
      <div id="box">
        <a href="javascript:console.log(1)" id="anchor">Click</a>
      </div>
    </body>
    <script>
    	var box = document.getElementById('box')
      var anchor = document.getElementById('anchor')
      
      anchor.addEventListener('click', function() {
        console.log(2)
      })
      
      box.addEventListener('click', function() {
        console.log(3)
      }, true)
      
    	box.addEventListener('click', function() {
        console.log(4)
      })
    </script>
```

### `let a = "abc"`，解释器在解释在这句话的过程中，内存发生的变化，比如内存放在哪里，申请了多大的内存

### 介绍一下 esm 和 cjs 的差异

### 介绍一下前端安全问题

### 假设有一个页面需要实现下拉无限滚动加载，如何实现和优化

### 笔试题
```js
    // 实现如下这样的函数`f()`，要求调用深度不限。(考察点：对 JS 对象化的理解)
    
    // f(1).val === 1
    // f(1)(2).val === 3
    // f(1)(2)(3).val === 6
    // f(10)(100)(1000)(10000).val === 11110
    // f(a0)(a1)(a2)...(an).val === a0 + a1 + a2 +...+ an
```
