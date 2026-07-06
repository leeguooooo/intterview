---
title: "v if和v for哪个优先级更高"
---

# 20 v-if和v-for哪个优先级更高

  * 实践中不应该把`v-for`和`v-if`放一起
  * 在`vue2`中，`v-for`的优先级是高于`v-if`，把它们放在一起，输出的渲染函数中可以看出会先执行循环再判断条件，哪怕我们只渲染列表中一小部分元素，也得在每次重渲染的时候遍历整个列表，这会比较浪费；另外需要注意的是在`vue3`中则完全相反，`v-if`的优先级高于`v-for`，所以`v-if`执行时，它调用的变量还不存在，就会导致异常
  * 通常有两种情况下导致我们这样做： 
    * 为了过滤列表中的项目 (比如 `v-for="user in users" v-if="user.isActive"`)。此时定义一个计算属性 (比如 `activeUsers`)，让其返回过滤后的列表即可（比如`users.filter(u=>u.isActive)`）
    * 为了避免渲染本应该被隐藏的列表 (比如 `v-for="user in users" v-if="shouldShowUsers"`)。此时把 `v-if` 移动至容器元素上 (比如 `ul`、`ol`)或者外面包一层`template`即可
  * 文档中明确指出永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上，显然这是一个重要的注意事项
  * 源码里面关于代码生成的部分，能够清晰的看到是先处理`v-if`还是`v-for`，顺序上`vue2`和`vue3`正好相反，因此产生了一些症状的不同，但是不管怎样都是不能把它们写在一起的

**vue2.x源码分析**

> 在vue模板编译的时候，会将指令系统转化成可执行的`render`函数

编写一个`p`标签，同时使用`v-if`与 `v-for`
```html
    <div id="app">
      <p v-if="isShow" v-for="item in items">
        {{ item.title }}
      </p>
    </div>
```

创建`vue`实例，存放`isShow`与`items`数据
```js
    const app = new Vue({
      el: "#app",
      data() {
        return {
          items: [
            { title: "foo" },
            { title: "baz" }]
        }
      },
      computed: {
        isShow() {
          return this.items && this.items.length > 0
        }
      }
    })
```

模板指令的代码都会生成在`render`函数中，通过`app.$options.render`就能得到渲染函数
```js
    ƒ anonymous() {
      with (this) { return 
        _c('div', { attrs: { "id": "app" } }, 
        _l((items), function (item) 
        { return (isShow) ? _c('p', [_v("\n" + _s(item.title) + "\n")]) : _e() }), 0) }
    }
```

  * `_l`是`vue`的列表渲染函数，函数内部都会进行一次`if`判断
  * 初步得到结论：`v-for`优先级是比`v-i`f高
  * 再将`v-for`与`v-if`置于不同标签
```html
    <div id="app">
      <template v-if="isShow">
        <p v-for="item in items">{{item.title}}</p>
      </template>
    </div>
```

再输出下`render`函数
```js
    ƒ anonymous() {
      with(this){return 
        _c('div',{attrs:{"id":"app"}},
        [(isShow)?[_v("\n"),
        _l((items),function(item){return _c('p',[_v(_s(item.title))])})]:_e()],2)}
    }
```

这时候我们可以看到，`v-for`与`v-if`作用在不同标签时候，是先进行判断，再进行列表的渲染

我们再在查看下vue源码

源码位置：`\vue-dev\src\compiler\codegen\index.js`
```js
    export function genElement (el: ASTElement, state: CodegenState): string {
      if (el.parent) {
        el.pre = el.pre || el.parent.pre
      }
      if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state)
      } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state)
      } else if (el.for && !el.forProcessed) {
        return genFor(el, state)
      } else if (el.if && !el.ifProcessed) {
        return genIf(el, state)
      } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
        return genChildren(el, state) || 'void 0'
      } else if (el.tag === 'slot') {
        return genSlot(el, state)
      } else {
        // component or element
        ...
    }
```

在进行`if`判断的时候，`v-for`是比`v-if`先进行判断

最终结论：`v-for`优先级比`v-if`高
