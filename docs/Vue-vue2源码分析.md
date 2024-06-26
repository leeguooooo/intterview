原文链接: [https://interview.poetries.top/principle-docs/vue/19-vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html](https://interview.poetries.top/principle-docs/vue/19-vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html)

## 文件结构

![](/images/s_poetries_work_images_20210313165151.png)

**源码目录**

![](/images/s_poetries_work_images_20210313165238.png)

## 调试环境搭建

  * 安装依赖: npm i
  * 安装rollup: npm i -g rollup
  * 修改dev脚本，添加sourcemap，package.json
```javascript
     "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web- full-dev",
```

  * 运行开发命令: `npm run dev`
  * 引入前面创建的vue.js，`samples/commits/index.html`
```javascript
    <script src="../../dist/vue.js"></script>
```

**术语解释:**

  * `runtime`:仅包含运行时，不包含编译器
  * `common`:cjs规范，用于webpack1
  * `esm`:ES模块，用于webpack2+
  * `umd: universal module definition`，兼容cjs和amd，用于浏览器

## 入口

> dev脚本中 `-c scripts/config.js` 指明配置文件所在

参数 `TARGET:web-full-dev` 指明输出文件配置项
```js
    // Runtime+compiler development build (Browser)
    {
      'web-full-dev': {
        entry: resolve('web/entry-runtime-with-compiler.js'),
        // 入口 dest: resolve('dist/vue.js'),// 目标文件
        format: 'umd',
        // 输出规范
        env: 'development',
        alias: {
          he: './entity-decoder'
        },
        banner,
      },
    }
```

## 初始化流程

  1. 入口 **platforms/web/entry-runtime-with-compiler.js**

扩展默认$mount方法:处理template或el选项

  2. **platforms/web/runtime/index.js**

  * 安装web平台特有指令和组件
  * 定义__patch__:补丁函数，执行patching算法进行更新
  * 定义$mount:挂载vue实例到指定宿主元素(获得dom并替换宿主元素)

  4. **core/index.js**

初始化全局api 具体如下:
```js
    Vue.set = set
    Vue.delete = del
    Vue.nextTick = nextTick
    
    initUse(Vue) // 实现Vue.use函数
    initMixin(Vue) // 实现Vue.mixin函数
    initExtend(Vue) // 实现Vue.extend函数
    initAssetRegisters(Vue) // 注册实现Vue.component/directive/filter
```

  5. **core/instance/index.js**

Vue构造函数定义

定义Vue实例API
```js
    function Vue (options) { // 构造函数仅执行了_init this._init(options)
    }
    initMixin(Vue) // 实现init函数
    stateMixin(Vue) // 状态相关api $data,$props,$set,$delete,$watch 
    eventsMixin(Vue)// 事件相关api $on,$once,$off,$emit 
    lifecycleMixin(Vue) // 生命周期api _update,$forceUpdate,$destroy 
    renderMixin(Vue)// 渲染api _render,$nextTick
```

  6. **core/instance/init.js**

创建组件实例，初始化其数据、属性、事件等
```js
    initLifecycle(vm) // $parent,$root,$children,$refs 
    initEvents(vm) // 处理父组件传递的事件和回调
    initRender(vm) // $slots,$scopedSlots,_c,$createElement 
    callHook(vm, 'beforeCreate') initInjections(vm) // 获取注入数据
    initState(vm) // 初始化props，methods，data，computed，watch 
    initProvide(vm) // 提供数据注入
    callHook(vm, 'created')
```

  7. **$mount**

**mountComponent**

> 执行挂载，获取vdom并转换为dom

**new Watcher()**

创建组件渲染watcher

**updateComponent()**

执行初始化或更新

**update()**

初始化或更新，将传入vdom转换为dom，初始化时执行的是dom创建操作

**render() src\core\instance\render.js**

渲染组件，获取vdom

**整体流程**

`new Vue()` => `_init()` => `$mount()` => `mountComponent()` =>
`updateComponent()/new Watcher()` => `render()` => `_update()`

## 数据响应式

> Vue一大特点是数据响应式，数据的变化会作用于UI而不用进行DOM操作。原理上来讲，是利用了JS语
> 言特性`Object.defineProperty()`，通过定义对象属性setter方法拦截对象属性变更，从而将数值的变化 转换为UI的变化

具体实现是在Vue初始化时，会调用initState，它会初始化data，props等，这里着重关注data初始 化，

**整体流程**

  1. **initState (vm: Component) src\core\instance\state.js**

> 初始化数据，包括`props`、`methods`、`data`、`computed`和`watch`

  2. **initData** 核心代码是将**data** 数据响应化
```js
    function initData (vm: Component) {
      // 执行数据响应化
      observe(data, true /* asRootData */)
    }
```

  3. **core/observer/index.js**

> observe方法返回一个Observer实例

  4. **core/observer/index.js**

  * Observer对象根据数据类型执行对应的响应化操作
  * defineReactive定义对象属性的getter/setter，getter负责添加依赖，setter负责通知更新

  5. **core/observer/dep.js**

Dep负责管理一组Watcher，包括watcher实例的增删及通知更新

  6. **Watcher**

  * Watcher解析一个表达式并收集依赖，当数值变化时触发回调函数，常用于$watch API和指令中。
  * 每个组件也会有对应的Watcher，数值变化会触发其update函数导致重新渲染
```js
    export default class Watcher {
      constructor () {}
        get () {}
        addDep (dep: Dep) {}
        update () {}
    }
```

> 相关API: $watcher

> 测试代码examples\test\02-1-reactive.html

## 数组响应化

> 数组数据变化的侦测跟对象不同，我们操作数组通常使用push、pop、splice等方法，此时没有办法得
> 知数据变化。所以vue中采取的策略是拦截这些方法并通知dep。

**1\. src\core\observer\array.js**

为数组原型中的7个可以改变内容的方法定义拦截器

**2\. Observer** 中覆盖数组原型
```js
    if (Array.isArray(value)) {
      // 替换数组原型
      protoAugment(value, arrayMethods) // value.__proto__ = arrayMethods 
      this.observeArray(value)
    }
```

> 测试代码examples\test\02-2-reactive-arr.html
>
> 相关API: `Vue.set()/delete()`
```js
    data: {
      arr: []
    }
```  
```js
    arr.length = 0 
    arr[index] = xxx
    
    Vue.set() 
    Vue.del()
```

## 异步更新队列

Vue高效的秘诀是一套批量、异步的更新策略

### 概念解释

![](/images/s_poetries_work_images_20210313171859.png)

  * 事件循环Event Loop:浏览器为了协调事件处理、脚本执行、网络请求和渲染等任务而制定的工 作机制。
  * 宏任务Task:代表一个个离散的、独立的工作单元。浏览器完成一个宏任务，在下一个宏任务执行 开始前，会对⻚面进行重新渲染。主要包括创建文档对象、解析HTML、执行主线JS代码以及各种 事件如⻚面加载、输入、网络事件和定时器等。
  * 微任务:微任务是更小的任务，是在当前宏任务执行结束后立即执行的任务。如果存在微任务，浏 览器会清空微任务之后再重新渲染。微任务的例子有 Promise 回调函数、DOM变化等。

### **vue** 中的具体实现

![](/images/s_poetries_work_images_20210313171946.png)

  * 异步:只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变 更。

  * 批量:如果同一个 watcher 被多次触发，只会被推入到队列中一次。去重对于避免不必要的计算 和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列执行实际工作

  * 异步策略:Vue 在内部对异步队列尝试使用原生的 Promise.then 、 MutationObserver

或 setImmediate ，如果执行环境都不支持，则会采用 setTimeout 代替。

**1\. update() core\observer\watcher.js**

> dep.notify()之后watcher执行更新，执行入队操作

**2\. queueWatcher(watcher) core\observer\scheduler.js**

> 执行watcher入队操作

**3\. nextTick(flushSchedulerQueue) core\util\next-tick.js**

> nextTick按照特定异步策略执行队列操作

watcher中update执行三次，但run仅执行一次，且数值变化对dom的影响也不是立竿⻅影的。

请大家研究一下相关API: `vm.$nextTick(cb)`

## 虚拟DOM

### 概念

> 虚拟DOM(Virtual DOM)是对DOM的JS抽象表示，它们是**JS** 对象，能够描述DOM结构和关系。应用
> 的各种状态变化会作用于虚拟DOM，最终映射到DOM上。

![](/images/s_poetries_work_images_20210313172248.png)

### 体验虚拟**DOM**

> vue中虚拟dom基于snabbdom实现，安装snabbdom并体验
```js
    < !DOCTYPE html > <html lang = "en" > <head > </head>
    <body>
    <div id="app"></div > <!--安装并引入snabbdom--><script src = "../../node_modules/snabbdom/dist/snabbdom.js" > </script>
    <script>
          / / 之前编写的响应式函数
          function defineReactive(obj, key, val) {
            Object.defineProperty(obj, key, {
              get() {
                return val
              },
              set(newVal) {
                val = newVal // 通知更新 update()
              }
            })
          }
          // 导入patch的工厂init，h是产生vnode的工厂 const { init, h } = snabbdom
          // 获取patch函数
          const patch = init([])
          // 上次vnode，由patch()返回 let vnode;
          // 更新函数，将数据操作转换为dom操作，返回新vnode function update() {
          if (!vnode) {
            // 初始化，没有上次vnode，传入宿主元素和vnode vnode = patch(app, render())
          } else {
            // 更新，传入新旧vnode对比并做更新 vnode = patch(vnode, render())
          }
          }
          // 渲染函数，返回vnode描述dom结构 function render() {
          return h('div', obj.foo)
          }
          // 赋一个日期作为初始值
          obj.foo = new Date().toLocaleTimeString()
          // 定时改变数据，更新函数会重新执行 setInterval(() => {
          obj.foo = new Date().toLocaleTimeString()
          },
          1000); 
    < /script>
    </body > 
    </html>
```

### 优点

  * 虚拟DOM轻量、快速:当它们发生变化时通过新旧虚拟DOM比对可以得到最小DOM操作量，配 合异步更新策略减少刷新频率，从而提升性能
```javascript
    patch(vnode, h('div', obj.foo))
```

  * 跨平台:将虚拟dom更新转换为不同运行时特殊操作实现跨平台
```js
    <script src="../../node_modules/snabbdom/dist/snabbdom-style.js"></script> <script>
    // 增加style模块
    const patch = init([snabbdom_style.default])
    function render() {
    // 添加节点样式描述
    return h('div', { style: { color: 'red' } }, obj.foo)
    }
    </script>
```

  * 兼容性:还可以加入兼容性代码增强操作的兼容性

### 必要性

> vue 1.0中有细粒度的数据变化侦测，它是不需要虚拟DOM的，但是细粒度造成了大量开销，这对于大 型项目来说是不可接受的。因此，vue
> 2.0选择了中等粒度的解决方案，每一个组件一个watcher实例， 这样状态变化时只能通知到组件，再通过引入虚拟DOM去进行比对和渲染。

### 整体流程

**1\. mountComponent() core/instance/lifecycle.js**

渲染、更新组件
```js
    // 定义更新函数
    const updateComponent = () => {
    // 实际调用是在lifeCycleMixin中定义的_update和renderMixin中定义的_render
    vm._update(vm._render(), hydrating) }
```

**2\. _render core/instance/render.js**

生成虚拟dom

**3\. _update core\instance\lifecycle.js**

update负责更新dom，转换vnode为dom

**4.**patch**() platforms/web/runtime/index.js**

__patch__是在平台特有代码中指定的
```javascript
    Vue.prototype.__patch__ = inBrowser ? patch : noop
```

> 测试代码，examples\test\04-vdom.html

## patch获取

> patch是createPatchFunction的返回值，传递nodeOps和modules是web平台特别实现
```javascript
    export const patch: Function = createPatchFunction({ nodeOps, modules })
```

**1\. platforms\web\runtime\node-ops.js**

定义各种原生dom基础操作方法

**2\. platforms\web\runtime\modules\index.js**

modules 定义了属性更新实现
```javascript
    watcher.run() => componentUpdate() => render() => update() => patch()
```

### **patch** 实现

**1\. patch core\vdom\patch.js**

> 首先进行树级别比较，可能有三种情况:增删改

  * `new VNode`不存在就删;
  * `old VNode` 不存在就增;
  * 都存在就执行`diff`执行更新

![](/images/s_poetries_work_images_20210313173014.png)

  2. **patchVnode**

> 比较两个VNode，包括三种类型操作:属性更新、文本更新、子节点更新

具体规则如下:

  * 新老节点均有**children** 子节点，则对子节点进行diff操作，调用**updateChildren**
  * 如果新节点有子节点而老节点没有子节点，先清空老节点的文本内容，然后为其新增子节点。
  * 当新节点没有子节点而老节点有子节点的时候，则移除该节点的所有子节点。
  * 当新老节点都无子节点的时候，只是文本的替换。

测试，04-vdom.html

![](/images/s_poetries_work_images_20210313173135.png)
```javascript
    // patchVnode过程分解
    // 1.div#demo // 2.h1
    // 3.text
    // 4.p
    // 5.text
    updateChildren updateChildren 文本相同跳过 updateChildren setTextContent
```

**3\. updateChildren**

> updateChildren主要作用是用一种较高效的方式比对新旧两个VNode的children得出最小操作补丁。执
> 行一个双循环是传统方式，vue中针对web场景特点做了特别的算法优化，我们看图说话:

![](/images/s_poetries_work_images_20210313174344.png)

> 在新老两组VNode节点的左右头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。 当**oldStartIdx >
> oldEndIdx**或者**newStartIdx > newEndIdx**时结束循环

下面是遍历规则:

  * 首先，oldStartVnode、oldEndVnode与newStartVnode、newEndVnode两两交叉比较，共有4种比较 方法。
  * 当 oldStartVnode和newStartVnode 或者 oldEndVnode和newEndVnode 满足sameVnode，直接将该 VNode节点进行patchVnode即可，不需再遍历就完成了一次循环。如下图

![](/images/s_poetries_work_images_20210313174422.png)

> 如果oldStartVnode与newEndVnode满足sameVnode。说明oldStartVnode已经跑到了oldEndVnode
> 后面去了，进行patchVnode的同时还需要将真实DOM节点移动到oldEndVnode的后面。

![](/images/s_poetries_work_images_20210313174533.png)

> 如果oldEndVnode与newStartVnode满足sameVnode，说明oldEndVnode跑到了oldStartVnode的前
> 面，进行patchVnode的同时要将oldEndVnode对应DOM移动到oldStartVnode对应DOM的前面

![](/images/s_poetries_work_images_20210313174552.png)

> 如果以上情况均不符合，则在old VNode中找与newStartVnode相同的节点，若存在执行
> patchVnode，同时将elmToMove移动到oldStartIdx对应的DOM的前面。

![](/images/s_poetries_work_images_20210313174643.png)

> 当然也有可能newStartVnode在old VNode节点中找不到一致的sameVnode，这个时候会调用
> createElm创建一个新的DOM节点。

![](/images/s_poetries_work_images_20210313174659.png)

至此循环结束，但是我们还需要处理剩下的节点。

> 当结束时oldStartIdx > oldEndIdx，这个时候旧的VNode节点已经遍历完了，但是新的节点还没有。说
> 明了新的VNode节点实际上比老的VNode节点多，需要将剩下的VNode对应的DOM插入到真实DOM
> 中，此时调用addVnodes(批量调用createElm接口)

![](/images/s_poetries_work_images_20210313174730.png)

> 但是，当结束时`newStartIdx > newEndIdx`时，说明新的VNode节点已经遍历完了，但是老的节点还有 剩余，需要从文档中删
> 的节点删除。

![](/images/s_poetries_work_images_20210313174753.png)

## 模板编译

模板编译的主要目标是将模板**(template)**转换为渲染函数**(render)**

![](/images/s_poetries_work_images_20210313174858.png)
```javascript
    template => render()
```

### 模板编译必要性

> Vue 2.0需要用到VNode描述视图以及各种交互，手写显然不切实际，因此用户只需编写类似HTML代码
> 的Vue模板，通过编译器将模板转换为可返回VNode的render函数。

### 体验模板编译

> 带编译器的版本中，可以使用template或el的方式声明模板，06-1-compiler.html
```js
    (function anonymous(
    ){
    with(this){return _c('div',{attrs:{"id":"demo"}},[_c('h1',[_v("Vue模板编 译")]),_v(" "),_c('p',[_v(_s(foo))]),_v(" "),_c('comp')],1)}
    })
```

输出结果大致如下:
```js
    (function anonymous() {
    with(this){return _c('div',{attrs:{"id":"demo"}},[
    _c('h1',[_v("Vue模板编译")]), _v(" "),_c('p',[_v(_s(foo))]), _v(" "),_c('comp')],1)}
    })
```

  * 元素节点使用createElement创建，别名_c _
  * _本文节点使用createTextVNode创建，别名_v
  * 表达式先使用toString格式化，别名_s
  * 其他渲染helpers:src\core\instance\render-helpers\index.js

### 整体流程

**1\. compileToFunctions**

> 若指定template或el选项，则会执行编译，**platforms\web\entry-runtime-with-compiler.js**

**2\. 编译过程**

> 编译分为三步:解析、优化和生成，**src\compiler\index.js**

测试代码06-1-compiler.html

### 模板编译过程

实现模板编译共有三个阶段:解析、优化和生成

  1. 解析 **\- parse**

解析器将模板解析为抽象语法树，基于AST可以做优化或者代码生成工作。
调试查看得到的AST，`**/src/compiler/parser/index.js**`，结构如下:

![](/images/s_poetries_work_images_20210313175206.png)

​

> 解析器内部分了**HTML** 解析器、文本解析器和过滤器解析器，最主要是HTML解析器

  2. 优化 **\- optimize**

> 优化器的作用是在AST中找出静态子树并打上标记。静态子树是在AST中永远不变的节点，如纯文本节 点。

**标记静态子树的好处:**

  * 每次重新渲染，不需要为静态子树创建新节点
  * 虚拟DOM中patch时，可以跳过静态子树

> 测试代码，06-2-compiler-optimize.html 代码实现，**src/compiler/optimizer.js -
> optimize**

![](/images/s_poetries_work_images_20210313175323.png)

  3. 代码生成 **\- generate**

  * 将AST转换成渲染函数中的内容，即代码字符串
  * generate方法生成渲染函数代码，**src/compiler/codegen/index.js**

生成的code⻓这样
```javascript
    `_c('div',{attrs:{"id":"demo"}},[ _c('h1',[_v("Vue.js测试")]), _c('p',[_v(_s(foo))])
    ])`
```

## 典型指令的实现:v-if、v-for

  1. 解析v-if:**parser/index.js**

> processIf用于处理v-if解析

![](/images/s_poetries_work_images_20210313175652.png)

  2. 代码生成，**codegen/index.js**

> genIfConditions等用于生成条件语句相关代码

生成结果:
```javascript
    "with(this){return _c('div',{attrs:{"id":"demo"}},[
    (foo) ? _c('h1',[_v(_s(foo))]) : _c('h1',[_v("no title")]),
    _v(" "),_c('abc')],1)}"
```

  3. 解析v-for:**parser/index.js**

> processFor用于处理v-for指令

> 解析结果:`v-for="item in items" for:'items' alias:'item'`

![](/images/s_poetries_work_images_20210313175757.png)

  4. 代码生成，**src\compiler\codegen\index.js**

genFor用于生成相应代码

生成结果
```javascript
    "with(this){return _c('div',{attrs:{"id":"demo"}},[_m(0),_v(" "),(foo)?_c('p', [_v(_s(foo))]):_e(),_v(" "),
    _l((arr),function(s){return _c('b',{key:s},[_v(_s(s))])})
    ,_v(" "),_c('comp')],2)}"
```

> v-if，v-for这些指令只能在编译器阶段处理，如果我们要在render函数处理条件或循环只能使用if 和for
```js
    Vue.component('comp', {
    props: ['foo'],
    render(h) { // 渲染内容跟foo的值挂钩，只能用if语句
    if (this.foo=='foo') { return h('div', 'foo')
    }
    return h('div', 'bar') }
    })
```  
```js
    (function anonymous(
    ){
    with(this){return _c('div',{attrs:{"id":"demo"}},[_m(0),_v(" "),(foo)?_c('p', [_v(_s(foo))]):_e(),_v(" "),_c('comp')],1)}
    })
```

## 组件化机制

### 组件声明:**Vue.component()**

> `initAssetRegisters(Vue) src/core/global-api/assets.js`

> 组件注册使用extend方法将配置转换为构造函数并添加到`components`选项

### 组件实例创建及挂载

观察生成的渲染函数
```javascript
    "with(this){return _c('div',{attrs:{"id":"demo"}},[ _c('h1',[_v("虚拟DOM")]),_v(" "), _c('p',[_v(_s(foo))]),_v(" "),
    _c('comp') // 对于组件的处理并无特殊之处
    ],1)}"
```

### 整体流程

> 首先创建的是根实例，首次_render()时，会得到整棵树的VNode结构，其中自定义组件相关的主要有: **createComponent() -
> src/core/vdom/create-component.js**

**1\. 组件vnode创建**

**createComponent() - src/core/vdom/patch.js**

> 创建组件实例并挂载，vnode转换为dom

**2\. 整体流程:**

> `new Vue() => $mount() => vm._render() => createElement() =>
> createComponent() => vm._update() => patch() => createElm =>
> createComponent()`

### 创建组件**VNode**

**1\. _createElement - src\core\vdom\create-element.js**

> `_createElement`实际执行VNode创建的函数，由于传入tag是非保留标签，因此判定为自定义组件通过
> `createComponent`去创建

**2\. createComponent - src/core/vdom/create-component.js**

> 创建组件VNode，保存了上一步处理得到的组件构造函数，props，事件等

### 创建组件实例

> 根组件执行更新函数时，会递归创建子元素和子组件，入口`createElm`

**1\. createEle() core/vdom/patch.js line751**

> 首次执行`_update()`时，`patch()`会通过createEle()创建根元素，子元素创建研究从这里开始

**2\. createComponent core/vdom/patch.js line144**

自定义组件创建
```js
    // 组件实例创建、挂载
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false
      /* hydrating */
      )
    }
    if (isDef(vnode.componentInstance)) {
      // 元素引用指定vnode.elm，元素属性创建等 initComponent(vnode, insertedVnodeQueue) // 插入到父元素
      insert(parentElm, vnode.elm, refElm) if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
```

## 总结

> Vue源码学习使我们能够深入理解原理，解答很多开发中的疑惑，规避很多潜在的错误，写出更好的代
> 码。学习大神的代码，能够学习编程思想，设计模式，训练基本功，提升内力。

阅读全文

