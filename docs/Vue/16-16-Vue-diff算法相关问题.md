# 16 Vue diff算法相关问题

### Vue为什么需要虚拟DOM？优缺点有哪些

> 由于在浏览器中操作 `DOM` 是很昂贵的。频繁的操作 `DOM`，会产生一定的性能问题。这就是虚拟 `Dom` 的产生原因。`Vue2` 的
> `Virtual DOM` 借鉴了开源库 `snabbdom` 的实现。`Virtual DOM` 本质就是用一个原生的 `JS` 对象去描述一个
> `DOM` 节点，是对真实 `DOM` 的一层抽象

**优点：**

  * **保证性能下限** ： 框架的虚拟 `DOM` 需要适配任何上层 `API` 可能产生的操作，它的一些 `DOM` 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 `DOM` 操作性能要好很多，因此框架的虚拟 `DOM` 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
  * **无需手动操作 DOM** ： 我们不再需要手动去操作 `DOM`，只需要写好 `View-Model` 的代码逻辑，框架会根据虚拟 `DOM` 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
  * **跨平台** ： 虚拟 `DOM` 本质上是 `JavaScript` 对象,而 `DOM` 与平台强相关，相比之下虚拟 `DOM` 可以进行更方便地跨平台操作，例如服务器渲染、`weex` 开发等等。

**缺点:**

  * 无法进行极致优化：虽然虚拟 `DOM` \+ 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 `DOM` 无法进行针对性的极致优化。
  * 首次渲染大量`DOM`时，由于多了一层虚拟 `DOM` 的计算，会比 `innerHTML` 插入慢。

**虚拟 DOM 实现原理？**

虚拟 `DOM` 的实现原理主要包括以下 `3` 部分：

  * 用 `JavaScript` 对象模拟真实 `DOM` 树，对真实 `DOM` 进行抽象；
  * `diff` 算法 — 比较两棵虚拟 `DOM` 树的差异；
  * `pach` 算法 — 将两个虚拟 `DOM` 对象的差异应用到真正的 `DOM` 树。

说说你对虚拟 DOM 的理解？回答范例

**思路**

  * `vdom`是什么
  * 引入`vdom`的好处
  * `vdom`如何生成，又如何成为`dom`
  * 在后续的`diff`中的作用

**回答范例**

  1. 虚拟`dom`顾名思义就是虚拟的`dom`对象，它本身就是一个 `JavaScript` 对象，只不过它是通过不同的属性去描述一个视图结构
  2. 通过引入`vdom`我们可以获得如下好处：

  * **将真实元素节点抽象成`VNode`，有效减少直接操作 `dom` 次数，从而提高程序性能**
    * 直接操作 `dom` 是有限制的，比如：`diff`、`clone` 等操作，一个真实元素上有许多的内容，如果直接对其进行 `diff` 操作，会去额外 `diff` 一些没有必要的内容；同样的，如果需要进行 `clone` 那么需要将其全部内容进行复制，这也是没必要的。但是，如果将这些操作转移到 `JavaScript` 对象上，那么就会变得简单了
    * 操作 `dom` 是比较昂贵的操作，频繁的`dom`操作容易引起页面的重绘和回流，但是通过抽象 `VNode` 进行中间处理，可以有效减少直接操作`dom`的次数，从而减少页面重绘和回流
  * **方便实现跨平台**
    * 同一 `VNode` 节点可以渲染成不同平台上的对应的内容，比如：渲染在浏览器是 `dom` 元素节点，渲染在 `Native( iOS、Android)`变为对应的控件、可以实现 `SSR` 、渲染到 `WebGL` 中等等
    * `Vue3` 中允许开发者基于 `VNode` 实现自定义渲染器（`renderer`），以便于针对不同平台进行渲染

  3. `vdom`如何生成？在vue中我们常常会为组件编写模板 - `template`， 这个模板会被编译器 - `compiler`编译为渲染函数，在接下来的挂载（`mount`）过程中会调用`render`函数，返回的对象就是虚拟`dom`。但它们还不是真正的`dom`，所以会在后续的`patch`过程中进一步转化为`dom`。

![](/images/s_poetries_work_uploads_2022_08_8154cc1efc0aea96.webp)

  4. 挂载过程结束后，`vue`程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新`render`，此时就会生成新的`vdom`，和上一次的渲染结果`diff`就能得到变化的地方，从而转换为最小量的`dom`操作，高效更新视图

**为什么要用vdom？案例解析**

现在有一个场景，实现以下需求:
```js
    [    
      { name: "张三", age: "20", address: "北京"},    
      { name: "李四", age: "21", address: "武汉"},    
      { name: "王五", age: "22", address: "杭州"},
    ]
```

将该数据展示成一个表格，并且随便修改一个信息，表格也跟着修改。 用jQuery实现如下:
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    
    <body>
      <div id="container"></div>
      <button id="btn-change">改变</button>
    
      <script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.js"></script>
      <script>
        const data = [{
            name: "张三",
            age: "20",
            address: "北京"
          },
          {
            name: "李四",
            age: "21",
            address: "武汉"
          },
          {
            name: "王五",
            age: "22",
            address: "杭州"
          },
        ];
        //渲染函数
        function render(data) {
          const $container = $('#container');
          $container.html('');
          const $table = $('<table>');
          // 重绘一次
          $table.append($('<tr><td>name</td><td>age</td><td>address</td></tr>'));
          data.forEach(item => {
            //每次进入都重绘
            $table.append($(`<tr><td>${item.name}</td><td>${item.age}</td><td>${item.address}</td></tr>`))
          })
          $container.append($table);
        }
        
        $('#btn-change').click(function () {
          data[1].age = 30;
          data[2].address = '深圳';
          render(data);
        });
      </script>
    </body>
    </html>
```

  * 这样点击按钮，会有相应的视图变化，但是你审查以下元素，每次改动之后，`table`标签都得重新创建，也就是说`table`下面的每一个栏目，不管是数据是否和原来一样，都得重新渲染，这并不是理想中的情况，当其中的一栏数据和原来一样，我们希望这一栏不要重新渲染，因为`DOM`重绘相当消耗浏览器性能。
  * 因此我们采用JS对象模拟的方法，将`DOM`的比对操作放在`JS`层，减少浏览器不必要的重绘，提高效率。
  * 当然有人说虚拟DOM并不比真实的`DOM`快，其实也是有道理的。当上述`table`中的每一条数据都改变时，显然真实的`DOM`操作更快，因为虚拟`DOM`还存在`js`中`diff`算法的比对过程。所以，上述性能优势仅仅适用于大量数据的渲染并且改变的数据只是一小部分的情况。

如下`DOM`结构:
```html
    <ul id="list">
        <li class="item">Item1</li>
        <li class="item">Item2</li>
    </ul>
```

映射成虚拟`DOM`就是这样:
```js
    {
      tag: "ul",
      attrs: {
        id:&emsp;"list"
      },
      children: [
        {
          tag: "li",
          attrs: { className: "item" },
          children: ["Item1"]
        }, {
          tag: "li",
          attrs: { className: "item" },
          children: ["Item2"]
        }
      ]
    } 
```

**使用snabbdom实现vdom**

>
> 这是一个简易的实现`vdom`功能的库，相比`vue`、`react`，对于`vdom`这块更加简易，适合我们学习`vdom`。`vdom`里面有两个核心的`api`，一个是`h`函数，一个是`patch`函数，前者用来生成`vdom`对象，后者的功能在于做虚拟`dom`的比对和将`vdom`挂载到真实`DOM`上

简单介绍一下这两个函数的用法:
```js
    h('标签名', {属性}, [子元素])
    h('标签名', {属性}, [文本])
    patch(container, vnode) // container为容器DOM元素
    patch(vnode, newVnode)
```

现在我们就来用`snabbdom`重写一下刚才的例子:
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      <div id="container"></div>
      <button id="btn-change">改变</button>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom.js"></script>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-class.js"></script>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-props.js"></script>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-style.js"></script>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/snabbdom-eventlisteners.min.js"></script>
      <script src="https://cdn.bootcss.com/snabbdom/0.7.3/h.js"></script>
      <script>
        let snabbdom = window.snabbdom;
    
        // 定义patch
        let patch = snabbdom.init([
          snabbdom_class,
          snabbdom_props,
          snabbdom_style,
          snabbdom_eventlisteners
        ]);
    
        //定义h
        let h = snabbdom.h;
    
        const data = [{
            name: "张三",
            age: "20",
            address: "北京"
          },
          {
            name: "李四",
            age: "21",
            address: "武汉"
          },
          {
            name: "王五",
            age: "22",
            address: "杭州"
          },
        ];
        data.unshift({name: "姓名", age: "年龄", address: "地址"});
    
        let container = document.getElementById('container');
        let vnode;
        const render = (data) => {
          let newVnode = h('table', {}, data.map(item => { 
            let tds = [];
            for(let i in item) {
              if(item.hasOwnProperty(i)) {
                tds.push(h('td', {}, item[i] + ''));
              }
            }
            return h('tr', {}, tds);
          }));
    
          if(vnode) {
              patch(vnode, newVnode);
          } else {
              patch(container, newVnode);
          }
          vnode = newVnode;
        }
    
        render(data);
    
        let btnChnage = document.getElementById('btn-change');
        btnChnage.addEventListener('click', function() {
          data[1].age = 30;
          data[2].address = "深圳";
          //re-render
          render(data);
        })
      </script>
    </body>
    </html>
```

![](/images/s_poetries_work_uploads_2022_08_8599e34fabc9a45f.gif)

你会发现，**只有改变的栏目才闪烁，也就是进行重绘** ，数据没有改变的栏目还是保持原样，这样就大大节省了浏览器重新渲染的开销

> vue中使用`h函数`生成虚拟`DOM`返回
```js
    const vm = new Vue({
      el: '#app',
      data: {
        user: {name:'poetry'}
      },
      render(h){
        // h()
        // h(App)
        // h('div',[])
        let vnode = h('div',{},'hello world');
        return vnode
      }
    });
```**相关源码**  
```js
    // src/core/vdom/create-element.js 
    
    export function createElement ( // 创建元素
      context: Component,
      tag: any,
      data: any,
      children: any,
      normalizationType: any,
      alwaysNormalize: boolean
    ): VNode | Array<VNode> {
      if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
      }
      if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
      }
      // 创建元素
      return _createElement(context, tag, data, children, normalizationType)
    }
    
    export function _createElement (
      context: Component,
      tag?: string | Class<Component> | Function | Object,
      data?: VNodeData,
      children?: any,
      normalizationType?: number
    ): VNode | Array<VNode> {
      if (isDef(data) && isDef((data: any).__ob__)) {
        process.env.NODE_ENV !== 'production' && warn(
          `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
          'Always create fresh vnode data objects in each render!',
          context
        )
        return createEmptyVNode()
      }
      // object syntax in v-bind
      if (isDef(data) && isDef(data.is)) {
        tag = data.is
      }
      if (!tag) { // 如果 h() 返回空节点
        // in case of component :is set to falsy value
        return createEmptyVNode()
      }
      // warn against non-primitive key
      if (process.env.NODE_ENV !== 'production' &&
        isDef(data) && isDef(data.key) && !isPrimitive(data.key)
      ) {
        if (!__WEEX__ || !('@binding' in data.key)) {
          warn(
            'Avoid using non-primitive value as key, ' +
            'use string/number value instead.',
            context
          )
        }
      }
      // support single function children as default scoped slot
      if (Array.isArray(children) &&
        typeof children[0] === 'function'
      ) {
        data = data || {}
        data.scopedSlots = { default: children[0] }
        children.length = 0
      }
      if (normalizationType === ALWAYS_NORMALIZE) { //  处理儿子节点个数
        children = normalizeChildren(children)
      } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children)
      } 
      let vnode, ns
      if (typeof tag === 'string') { // 标签是字符串
        let Ctor
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
        if (config.isReservedTag(tag)) {
          // platform built-in elements
          if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
            warn(
              `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
              context
            )
          }
          vnode = new VNode(
            config.parsePlatformTagName(tag), data, children,
            undefined, undefined, context
          )
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
          // component  组件的虚拟节点
          vnode = createComponent(Ctor, data, context, children, tag)
        } else {
          // unknown or unlisted namespaced elements
          // check at runtime because it may get assigned a namespace when its
          // parent normalizes children
          vnode = new VNode(
            tag, data, children,
            undefined, undefined, context
          )
        }
      } else {
        // direct component options / constructor  组件的虚拟节点
        vnode = createComponent(tag, data, context, children)
      }
      if (Array.isArray(vnode)) {
        return vnode
      } else if (isDef(vnode)) {
        if (isDef(ns)) applyNS(vnode, ns)
        if (isDef(data)) registerDeepBindings(data)
        return vnode
      } else {
        return createEmptyVNode()
      }
    }
    
    function applyNS (vnode, ns, force) {
      vnode.ns = ns
      if (vnode.tag === 'foreignObject') {
        // use default namespace inside foreignObject
        ns = undefined
        force = true
      }
      if (isDef(vnode.children)) {
        for (let i = 0, l = vnode.children.length; i < l; i++) {
          const child = vnode.children[i]
          if (isDef(child.tag) && (
            isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
            applyNS(child, ns, force)
          }
        }
      }
    }
    
    // ref #5318
    // necessary to ensure parent re-render when deep bindings like :style and
    // :class are used on slot nodes
    function registerDeepBindings (data) {
      if (isObject(data.style)) {
        traverse(data.style)
      }
      if (isObject(data.class)) {
        traverse(data.class)
      }
    }
```  
```js
    // 虚拟节点的实现 src/core/vdom/vnode.js
    
    export default class VNode {
      tag: string | void;
      data: VNodeData | void;
      children: ?Array<VNode>;
      text: string | void;
      elm: Node | void;
      ns: string | void;
      context: Component | void; // rendered in this component's scope
      key: string | number | void;
      componentOptions: VNodeComponentOptions | void;
      componentInstance: Component | void; // component instance
      parent: VNode | void; // component placeholder node
    
      // strictly internal
      raw: boolean; // contains raw HTML? (server only)
      isStatic: boolean; // hoisted static node
      isRootInsert: boolean; // necessary for enter transition check
      isComment: boolean; // empty comment placeholder?
      isCloned: boolean; // is a cloned node?
      isOnce: boolean; // is a v-once node?
      asyncFactory: Function | void; // async component factory function
      asyncMeta: Object | void;
      isAsyncPlaceholder: boolean;
      ssrContext: Object | void;
      fnContext: Component | void; // real context vm for functional nodes
      fnOptions: ?ComponentOptions; // for SSR caching
      devtoolsMeta: ?Object; // used to store functional render context for devtools
      fnScopeId: ?string; // functional scope id support
    
      constructor (
        tag?: string,
        data?: VNodeData,
        children?: ?Array<VNode>,
        text?: string,
        elm?: Node,
        context?: Component,
        componentOptions?: VNodeComponentOptions,
        asyncFactory?: Function
      ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.ns = undefined
        this.context = context
        this.fnContext = undefined
        this.fnOptions = undefined
        this.fnScopeId = undefined
        this.key = data && data.key
        this.componentOptions = componentOptions
        this.componentInstance = undefined
        this.parent = undefined
        this.raw = false
        this.isStatic = false
        this.isRootInsert = true
        this.isComment = false
        this.isCloned = false
        this.isOnce = false
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
      }
    
      // DEPRECATED: alias for componentInstance for backwards compat.
      /* istanbul ignore next */
      get child (): Component | void {
        return this.componentInstance
      }
    }
    
    export const createEmptyVNode = (text: string = '') => {
      const node = new VNode()
      node.text = text
      node.isComment = true
      return node
    }
    
    export function createTextVNode (val: string | number) {
      return new VNode(undefined, undefined, undefined, String(val))
    }
    
    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    export function cloneVNode (vnode: VNode): VNode {
      const cloned = new VNode(
        vnode.tag,
        vnode.data,
        // #7975
        // clone children array to avoid mutating original in case of cloning
        // a child.
        vnode.children && vnode.children.slice(),
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
        vnode.asyncFactory
      )
      cloned.ns = vnode.ns
      cloned.isStatic = vnode.isStatic
      cloned.key = vnode.key
      cloned.isComment = vnode.isComment
      cloned.fnContext = vnode.fnContext
      cloned.fnOptions = vnode.fnOptions
      cloned.fnScopeId = vnode.fnScopeId
      cloned.asyncMeta = vnode.asyncMeta
      cloned.isCloned = true
      return cloned
    }
```

### Vue中diff算法原理

![虚拟 DOM diff 双端比较：同层比较，新旧 children 头尾双指针四种命中（头头、尾尾、头尾、尾头），借助 key 复用并移动节点](/images/diagrams/vue-diff.webp)

`DOM`操作是非常昂贵的，因此我们需要尽量地减少`DOM`操作。这就需要找出本次`DOM`必须更新的节点来更新，其他的不更新，这个找出的过程，就需要应用diff算法

> `vue`的`diff`算法是平级比较，不考虑跨级比较的情况。内部采用`深度递归的方式+双指针(头尾都加指针)`的方式进行比较。

简单来说，Diff算法有以下过程

  * 同级比较，再比较子节点（根据`key`和`tag`标签名判断）
  * 先判断一方有子节点和一方没有子节点的情况(如果新的`children`没有子节点，将旧的子节点移除)
  * 比较都有子节点的情况(核心`diff`)
  * 递归比较子节点

  * 正常`Diff`两个树的时间复杂度是`O(n^3)`，但实际情况下我们很少会进行跨层级的移动`DOM`，所以`Vue`将`Diff`进行了优化，从`O(n^3) -> O(n)`，只有当新旧`children`都为多个子节点时才需要用核心的`Diff`算法进行同层级比较。
  * `Vue2`的核心`Diff`算法采用了`双端比较`的算法，同时从新旧`children`的两端开始进行比较，借助`key`值找到可复用的节点，再进行相关操作。相比`React`的`Diff`算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅
  * 在创建`VNode`时就确定其类型，以及在`mount/patch`的过程中采用位运算来判断一个`VNode`的类型，在这个基础之上再配合核心的`Diff`算法，使得性能上较`Vue2.x`有了提升

![](/images/s_poetries_work_uploads_2022_08_15b3a98fc9f361d8.webp)

> vue3中采用最长递增子序列来实现`diff`优化

回答范例

**思路**

  * `diff`算法是干什么的
  * 它的必要性
  * 它何时执行
  * 具体执行方式
  * 拔高：说一下`vue3`中的优化

**回答范例**

  1. `Vue`中的`diff`算法称为`patching`算法，它由`Snabbdom`修改而来，虚拟`DOM`要想转化为真实`DOM`就需要通过`patch`方法转换
  2. 最初`Vue1.x`视图中每个依赖均有更新函数对应，可以做到精准更新，因此并不需要虚拟`DOM`和`patching`算法支持，但是这样粒度过细导致`Vue1.x`无法承载较大应用；`Vue 2.x`中为了降低`Watcher`粒度，每个组件只有一个`Watcher`与之对应，此时就需要引入`patching`算法才能精确找到发生变化的地方并高效更新
  3. `vue`中`diff`执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行`render`函数获得最新的虚拟`DOM`，然后执行`patch`函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的`DOM`操作
  4. `patch`过程是一个递归过程，遵循深度优先、同层比较的策略；

**以`vue3`的`patch`为例**

  * 首先判断两个节点是否为相同同类节点，不同则删除重新创建
  * 如果双方都是文本则更新文本内容
  * 如果双方都是元素节点则递归更新子元素，同时更新元素属性
  * 更新子节点时又分了几种情况 
    * 新的子节点是文本，老的子节点是数组则清空，并设置文本；
    * 新的子节点是文本，老的子节点是文本则直接更新文本；
    * 新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；
    * 新的子节点是数组，老的子节点也是数组，那么比较两组子节点，更新细节blabla
  * `vue3`中引入的更新策略：静态节点标记等

**vdom中diff算法的简易实现**

以下代码只是帮助大家理解`diff`算法的原理和流程

  1. 将`vdom`转化为真实`dom`：
```js
    const createElement = (vnode) => {
      let tag = vnode.tag;
      let attrs = vnode.attrs || {};
      let children = vnode.children || [];
      if(!tag) {
        return null;
      }
      //创建元素
      let elem = document.createElement(tag);
      //属性
      let attrName;
      for (attrName in attrs) {
        if(attrs.hasOwnProperty(attrName)) {
          elem.setAttribute(attrName, attrs[attrName]);
        }
      }
      //子元素
      children.forEach(childVnode => {
        //给elem添加子元素
        elem.appendChild(createElement(childVnode));
      })
    
      //返回真实的dom元素
      return elem;
    }
```

  2. 用简易`diff`算法做更新操作
```js
    function updateChildren(vnode, newVnode) {
      let children = vnode.children || [];
      let newChildren = newVnode.children || [];
    
      children.forEach((childVnode, index) => {
        let newChildVNode = newChildren[index];
        if(childVnode.tag === newChildVNode.tag) {
          //深层次对比, 递归过程
          updateChildren(childVnode, newChildVNode);
        } else {
          //替换
          replaceNode(childVnode, newChildVNode);
        }
      })
    }
```**Vue diff相关源码**  
```js
    // src/core/vdom/patch.js 700
    
    function assertNodeMatch (node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
          return vnode.tag.indexOf('vue-component') === 0 || (
            !isUnknownElement(vnode, inVPre) &&
            vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
          )
        } else {
          return node.nodeType === (vnode.isComment ? 8 : 3)
        }
      }
    
      return function patch (oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) { // 此为组件卸载逻辑
          if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
          return
        }
    
        let isInitialPatch = false
        const insertedVnodeQueue = []
    
        if (isUndef(oldVnode)) { // 此为组件挂载
          // empty mount (likely as component), create new root element
          isInitialPatch = true
          createElm(vnode, insertedVnodeQueue)
        } else {
          const isRealElement = isDef(oldVnode.nodeType)
          if (!isRealElement && sameVnode(oldVnode, vnode)) {
            // patch existing root node  patchVnode
            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
          } else {
            if (isRealElement) { // 真实元素挂载
              // mounting to a real element
              // check if this is server-rendered content and if we can perform
              // a successful hydration.
              if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                oldVnode.removeAttribute(SSR_ATTR)
                hydrating = true
              }
              if (isTrue(hydrating)) {
                if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                  invokeInsertHook(vnode, insertedVnodeQueue, true)
                  return oldVnode
                } else if (process.env.NODE_ENV !== 'production') {
                  warn(
                    'The client-side rendered virtual DOM tree is not matching ' +
                    'server-rendered content. This is likely caused by incorrect ' +
                    'HTML markup, for example nesting block-level elements inside ' +
                    '<p>, or missing <tbody>. Bailing hydration and performing ' +
                    'full client-side render.'
                  )
                }
              }
              // either not server-rendered, or hydration failed.
              // create an empty node and replace it
              oldVnode = emptyNodeAt(oldVnode) // 根据真实元素 产生虚拟节点
            }
    
            // replacing existing element
            const oldElm = oldVnode.elm
            const parentElm = nodeOps.parentNode(oldElm) // 找到父亲
    
            // create new node  创建新节点
            createElm(
              vnode,
              insertedVnodeQueue,
              // extremely rare edge case: do not insert if old element is in a
              // leaving transition. Only happens when combining transition +
              // keep-alive + HOCs. (#4590)
              oldElm._leaveCb ? null : parentElm,
              nodeOps.nextSibling(oldElm)
            )
    
            // update parent placeholder node element, recursively
            if (isDef(vnode.parent)) { // 依次更新父占位符
              let ancestor = vnode.parent
              const patchable = isPatchable(vnode)
              while (ancestor) {
                for (let i = 0; i < cbs.destroy.length; ++i) {
                  cbs.destroy[i](ancestor)
                }
                ancestor.elm = vnode.elm
                if (patchable) {
                  for (let i = 0; i < cbs.create.length; ++i) {
                    cbs.create[i](emptyNode, ancestor)
                  }
                  // #6513
                  // invoke insert hooks that may have been merged by create hooks.
                  // e.g. for directives that uses the "inserted" hook.
                  const insert = ancestor.data.hook.insert
                  if (insert.merged) {
                    // start at index 1 to avoid re-invoking component mounted hook
                    for (let i = 1; i < insert.fns.length; i++) {
                      insert.fns[i]()
                    }
                  }
                } else {
                  registerRef(ancestor)
                }
                ancestor = ancestor.parent
              }
            }
    
            // destroy old node
            if (isDef(parentElm)) { // 销毁老节点
              removeVnodes([oldVnode], 0, 0)
            } else if (isDef(oldVnode.tag)) {
              invokeDestroyHook(oldVnode)
            }
          }
        }
        // 调用插入的钩子 -》 callInsert
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
        return vnode.elm
      }
```  
```js
    // 比较两个虚拟节点
    function patchVnode (
        oldVnode,
        vnode,
        insertedVnodeQueue,
        ownerArray,
        index,
        removeOnly
      ) {
        if (oldVnode === vnode) {
          return
        }
    
        if (isDef(vnode.elm) && isDef(ownerArray)) {
          // clone reused vnode
          vnode = ownerArray[index] = cloneVNode(vnode)
        }
    
        const elm = vnode.elm = oldVnode.elm // 复用老节点
    
        if (isTrue(oldVnode.isAsyncPlaceholder)) { // 如果是异步占位符跳过
          if (isDef(vnode.asyncFactory.resolved)) {
            hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
          } else {
            vnode.isAsyncPlaceholder = true
          }
          return
        }
    
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (isTrue(vnode.isStatic) &&
          isTrue(oldVnode.isStatic) &&
          vnode.key === oldVnode.key && // 都是静态节点，key相同
          (isTrue(vnode.isCloned) || isTrue(vnode.isOnce)) // 是克隆节点 或者 带有once，直接复用
        ) {
          vnode.componentInstance = oldVnode.componentInstance
          return
        } 
    
        let i // 组件更新逻辑
        const data = vnode.data
        if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode)
        }
    
        const oldCh = oldVnode.children
        const ch = vnode.children
        if (isDef(data) && isPatchable(vnode)) { // 调用更新方法
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
          if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
        }
        if (isUndef(vnode.text)) { // 如果不是文本节点
          if (isDef(oldCh) && isDef(ch)) { // 两方都有儿子, 而且不是同一个儿子
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
          } else if (isDef(ch)) { // 如果只有新的有儿子
            if (process.env.NODE_ENV !== 'production') {
              checkDuplicateKeys(ch)
            }
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '') // 删除添加新节点
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
          } else if (isDef(oldCh)) { // 如果老得有儿子
            removeVnodes(oldCh, 0, oldCh.length - 1) // 删除节点
          } else if (isDef(oldVnode.text)) { // 如果老的是文本
            nodeOps.setTextContent(elm, '') // 清空文本中内容
          }
        } else if (oldVnode.text !== vnode.text) {
          nodeOps.setTextContent(elm, vnode.text) // 文本不相同直接设置新值
        }
        if (isDef(data)) { // 调用postpatch钩子
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
        }
      }
    
      function invokeInsertHook (vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
          vnode.parent.data.pendingInsert = queue
        } else {
          for (let i = 0; i < queue.length; ++i) {
            queue[i].data.hook.insert(queue[i])
          }
        }
      }
    
      let hydrationBailed = false
      // list of modules that can skip create hook during hydration because they
      // are already rendered on the client or has no need for initialization
      // Note: style is excluded because it relies on initial clone for future
      // deep updates (#7063).
      const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key')
    
      // Note: this is a browser-only function so we can assume elms are DOM nodes.
      function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
        let i
        const { tag, data, children } = vnode
        inVPre = inVPre || (data && data.pre)
        vnode.elm = elm
    
        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
          vnode.isAsyncPlaceholder = true
          return true
        }
        // assert node match
        if (process.env.NODE_ENV !== 'production') {
          if (!assertNodeMatch(elm, vnode, inVPre)) {
            return false
          }
        }
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode, true /* hydrating */)
          if (isDef(i = vnode.componentInstance)) {
            // child component. it should have hydrated its own tree.
            initComponent(vnode, insertedVnodeQueue)
            return true
          }
        }
        if (isDef(tag)) {
          if (isDef(children)) {
            // empty element, allow client to pick up and populate children
            if (!elm.hasChildNodes()) {
              createChildren(vnode, children, insertedVnodeQueue)
            } else {
              // v-html and domProps: innerHTML
              if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
                if (i !== elm.innerHTML) {
                  /* istanbul ignore if */
                  if (process.env.NODE_ENV !== 'production' &&
                    typeof console !== 'undefined' &&
                    !hydrationBailed
                  ) {
                    hydrationBailed = true
                    console.warn('Parent: ', elm)
                    console.warn('server innerHTML: ', i)
                    console.warn('client innerHTML: ', elm.innerHTML)
                  }
                  return false
                }
              } else {
                // iterate and compare children lists
                let childrenMatch = true
                let childNode = elm.firstChild
                for (let i = 0; i < children.length; i++) {
                  if (!childNode || !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
                    childrenMatch = false
                    break
                  }
                  childNode = childNode.nextSibling
                }
                // if childNode is not null, it means the actual childNodes list is
                // longer than the virtual children list.
                if (!childrenMatch || childNode) {
                  /* istanbul ignore if */
                  if (process.env.NODE_ENV !== 'production' &&
                    typeof console !== 'undefined' &&
                    !hydrationBailed
                  ) {
                    hydrationBailed = true
                    console.warn('Parent: ', elm)
                    console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children)
                  }
                  return false
                }
              }
            }
          }
          if (isDef(data)) {
            let fullInvoke = false
            for (const key in data) {
              if (!isRenderedModule(key)) {
                fullInvoke = true
                invokeCreateHooks(vnode, insertedVnodeQueue)
                break
              }
            }
            if (!fullInvoke && data['class']) {
              // ensure collecting deps for deep class bindings for future updates
              traverse(data['class'])
            }
          }
        } else if (elm.data !== vnode.text) {
          elm.data = vnode.text
        }
        return true
      }
```  
```js
    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        let oldStartIdx = 0
        let newStartIdx = 0
        let oldEndIdx = oldCh.length - 1
        let oldStartVnode = oldCh[0]
        let oldEndVnode = oldCh[oldEndIdx]
        let newEndIdx = newCh.length - 1
        let newStartVnode = newCh[0]
        let newEndVnode = newCh[newEndIdx]
        let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    
        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        const canMove = !removeOnly
    
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(newCh)
        }
        // 新老节点有一方循环完毕则patch 完毕
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
          if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
          } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx]
          } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
          } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
          } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
          } else {
            // 乱序比对
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            idxInOld = isDef(newStartVnode.key)
              ? oldKeyToIdx[newStartVnode.key]
              : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) { // New element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
              vnodeToMove = oldCh[idxInOld]
              if (sameVnode(vnodeToMove, newStartVnode)) {
                patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                oldCh[idxInOld] = undefined
                canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
              } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
              }
            }
            newStartVnode = newCh[++newStartIdx]
          }
        }
        if (oldStartIdx > oldEndIdx) {
          refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
          addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
        } else if (newStartIdx > newEndIdx) {
          removeVnodes(oldCh, oldStartIdx, oldEndIdx)
        }
      }
```

### Vue的diff算法详细分析

**1\. 是什么**

`diff` 算法是一种通过同层的树节点进行比较的高效算法

其有两个特点：

  * 比较只会在同层级进行, 不会跨层级比较
  * 在diff比较的过程中，循环从两边向中间比较

`diff` 算法在很多场景下都有应用，在 `vue` 中，作用于虚拟 `dom` 渲染成真实 `dom` 的新旧 `VNode` 节点比较

**2\. 比较方式**

`diff`整体策略为：深度优先，同层比较

  1. 比较只会在同层级进行, 不会跨层级比较

![](/images/s_poetries_work_uploads_2022_09_f29c33c806ecffb5.webp)

  2. 比较的过程中，循环从两边向中间收拢

![](/images/s_poetries_work_uploads_2022_09_8121a9b6102e5377.webp)

下面举个`vue`通过`diff`算法更新的例子：

新旧`VNode`节点如下图所示：

![](/images/s_poetries_work_uploads_2022_09_78fa0e7847772ef5.webp)

第一次循环后，发现旧节点D与新节点D相同，直接复用旧节点D作为`diff`后的第一个真实节点，同时旧节点`endIndex`移动到C，新节点的
`startIndex` 移动到了 C

![](/images/s_poetries_work_uploads_2022_09_4ddfc7e80cffdb80.webp)

第二次循环后，同样是旧节点的末尾和新节点的开头(都是 C)相同，同理，`diff` 后创建了 C 的真实节点插入到第一次创建的 D 节点后面。同时旧节点的
`endIndex` 移动到了 B，新节点的 `startIndex` 移动到了 E

![](/images/s_poetries_work_uploads_2022_09_7fff25b5fa48acf4.webp)

第三次循环中，发现E没有找到，这时候只能直接创建新的真实节点 E，插入到第二次创建的 C 节点之后。同时新节点的 `startIndex` 移动到了
A。旧节点的 `startIndex` 和 `endIndex` 都保持不动

![](/images/s_poetries_work_uploads_2022_09_4a6aa4297e796b54.webp)

第四次循环中，发现了新旧节点的开头(都是 A)相同，于是 `diff` 后创建了 A 的真实节点，插入到前一次创建的 E 节点后面。同时旧节点的
`startIndex` 移动到了 B，新节点的`startIndex` 移动到了 B

![](/images/s_poetries_work_uploads_2022_09_121fc9375e2537f6.webp)

第五次循环中，情形同第四次循环一样，因此 `diff` 后创建了 B 真实节点 插入到前一次创建的 A 节点后面。同时旧节点的
`startIndex`移动到了 C，新节点的 startIndex 移动到了 F

![](/images/s_poetries_work_uploads_2022_09_1c0782546f0e6e97.webp)

新节点的 `startIndex` 已经大于 `endIndex` 了，需要创建 `newStartIdx` 和 `newEndIdx`
之间的所有节点，也就是节点F，直接创建 F 节点对应的真实节点放到 B 节点后面

![](/images/s_poetries_work_uploads_2022_09_94437bcc7fdc74ba.webp)

**3\. 原理分析**

当数据发生改变时，`set`方法会调用`Dep.notify`通知所有订阅者`Watcher`，订阅者就会调用`patch`给真实的`DOM`打补丁，更新相应的视图

源码位置：`src/core/vdom/patch.js`
```js
    function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) { // 没有新节点，直接执行destory钩子函数
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
            return
        }
    
        let isInitialPatch = false
        const insertedVnodeQueue = []
    
        if (isUndef(oldVnode)) {
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue) // 没有旧节点，直接用新节点生成dom元素
        } else {
            const isRealElement = isDef(oldVnode.nodeType)
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // 判断旧节点和新节点自身一样，一致执行patchVnode
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
            } else {
                // 否则直接销毁及旧节点，根据新节点生成dom元素
                if (isRealElement) {
    
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR)
                        hydrating = true
                    }
                    if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                            invokeInsertHook(vnode, insertedVnodeQueue, true)
                            return oldVnode
                        }
                    }
                    oldVnode = emptyNodeAt(oldVnode)
                }
                return vnode.elm
            }
        }
    }
```

`patch`函数前两个参数位为`oldVnode` 和 `Vnode` ，分别代表新的节点和之前的旧节点，主要做了四个判断：

  * 没有新节点，直接触发旧节点的`destory`钩子
  * 没有旧节点，说明是页面刚开始初始化的时候，此时，根本不需要比较了，直接全是新建，所以只调用 `createElm`
  * 旧节点和新节点自身一样，通过 `sameVnode` 判断节点是否一样，一样时，直接调用 `patchVnode`去处理这两个节点
  * 旧节点和新节点自身不一样，当两个节点不一样的时候，直接创建新节点，删除旧节点

下面主要讲的是`patchVnode`部分
```js
    function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
        // 如果新旧节点一致，什么都不做
        if (oldVnode === vnode) {
          return
        }
    
        // 让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化
        const elm = vnode.elm = oldVnode.elm
    
        // 异步占位符
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
          if (isDef(vnode.asyncFactory.resolved)) {
            hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
          } else {
            vnode.isAsyncPlaceholder = true
          }
          return
        }
        // 如果新旧都是静态节点，并且具有相同的key
        // 当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上
        // 也不用再有其他操作
        if (isTrue(vnode.isStatic) &&
          isTrue(oldVnode.isStatic) &&
          vnode.key === oldVnode.key &&
          (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
        ) {
          vnode.componentInstance = oldVnode.componentInstance
          return
        }
    
        let i
        const data = vnode.data
        if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
          i(oldVnode, vnode)
        }
    
        const oldCh = oldVnode.children
        const ch = vnode.children
        if (isDef(data) && isPatchable(vnode)) {
          for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
          if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
        }
        // 如果vnode不是文本节点或者注释节点
        if (isUndef(vnode.text)) {
          // 并且都有子节点
          if (isDef(oldCh) && isDef(ch)) {
            // 并且子节点不完全一致，则调用updateChildren
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    
            // 如果只有新的vnode有子节点
          } else if (isDef(ch)) {
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            // elm已经引用了老的dom节点，在老的dom节点上添加子节点
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    
            // 如果新vnode没有子节点，而vnode有子节点，直接删除老的oldCh
          } else if (isDef(oldCh)) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    
            // 如果老节点是文本节点
          } else if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '')
          }
    
          // 如果新vnode和老vnode是文本节点或注释节点
          // 但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以
        } else if (oldVnode.text !== vnode.text) {
          nodeOps.setTextContent(elm, vnode.text)
        }
        if (isDef(data)) {
          if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
        }
      }
```

**`patchVnode`主要做了几个判断：**

  * 新节点是否是文本节点，如果是，则直接更新`dom`的文本内容为新节点的文本内容
  * 新节点和旧节点如果都有子节点，则处理比较更新子节点
  * 只有新节点有子节点，旧节点没有，那么不用比较了，所有节点都是全新的，所以直接全部新建就好了，新建是指创建出所有新`DOM`，并且添加进父节点
  * 只有旧节点有子节点而新节点没有，说明更新后的页面，旧节点全部都不见了，那么要做的，就是把所有的旧节点删除，也就是直接把`DOM` 删除

子节点不完全一致，则调用`updateChildren`
```js
    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        let oldStartIdx = 0 // 旧头索引
        let newStartIdx = 0 // 新头索引
        let oldEndIdx = oldCh.length - 1 // 旧尾索引
        let newEndIdx = newCh.length - 1 // 新尾索引
        let oldStartVnode = oldCh[0] // oldVnode的第一个child
        let oldEndVnode = oldCh[oldEndIdx] // oldVnode的最后一个child
        let newStartVnode = newCh[0] // newVnode的第一个child
        let newEndVnode = newCh[newEndIdx] // newVnode的最后一个child
        let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    
        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        const canMove = !removeOnly
    
        // 如果oldStartVnode和oldEndVnode重合，并且新的也都重合了，证明diff完了，循环结束
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
          // 如果oldVnode的第一个child不存在
          if (isUndef(oldStartVnode)) {
            // oldStart索引右移
            oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    
          // 如果oldVnode的最后一个child不存在
          } else if (isUndef(oldEndVnode)) {
            // oldEnd索引左移
            oldEndVnode = oldCh[--oldEndIdx]
    
          // oldStartVnode和newStartVnode是同一个节点
          } else if (sameVnode(oldStartVnode, newStartVnode)) {
            // patch oldStartVnode和newStartVnode， 索引左移，继续循环
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
    
          // oldEndVnode和newEndVnode是同一个节点
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // patch oldEndVnode和newEndVnode，索引右移，继续循环
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
    
          // oldStartVnode和newEndVnode是同一个节点
          } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            // patch oldStartVnode和newEndVnode
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
            // 如果removeOnly是false，则将oldStartVnode.eml移动到oldEndVnode.elm之后
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
            // oldStart索引右移，newEnd索引左移
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
    
          // 如果oldEndVnode和newStartVnode是同一个节点
          } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            // patch oldEndVnode和newStartVnode
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
            // 如果removeOnly是false，则将oldEndVnode.elm移动到oldStartVnode.elm之前
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            // oldEnd索引左移，newStart索引右移
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
    
          // 如果都不匹配
          } else {
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
    
            // 尝试在oldChildren中寻找和newStartVnode的具有相同的key的Vnode
            idxInOld = isDef(newStartVnode.key)
              ? oldKeyToIdx[newStartVnode.key]
              : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
    
            // 如果未找到，说明newStartVnode是一个新的节点
            if (isUndef(idxInOld)) { // New element
              // 创建一个新Vnode
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
    
            // 如果找到了和newStartVnodej具有相同的key的Vnode，叫vnodeToMove
            } else {
              vnodeToMove = oldCh[idxInOld]
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' && !vnodeToMove) {
                warn(
                  'It seems there are duplicate keys that is causing an update error. ' +
                  'Make sure each v-for item has a unique key.'
                )
              }
    
              // 比较两个具有相同的key的新节点是否是同一个节点
              //不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。
              if (sameVnode(vnodeToMove, newStartVnode)) {
                // patch vnodeToMove和newStartVnode
                patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
                // 清除
                oldCh[idxInOld] = undefined
                // 如果removeOnly是false，则将找到的和newStartVnodej具有相同的key的Vnode，叫vnodeToMove.elm
                // 移动到oldStartVnode.elm之前
                canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
    
              // 如果key相同，但是节点不相同，则创建一个新的节点
              } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
              }
            }
    
            // 右移
            newStartVnode = newCh[++newStartIdx]
          }
        }
```

**`while`循环主要处理了以下五种情景：**

  * 当新老 `VNode` 节点的 `start` 相同时，直接 `patchVnode` ，同时新老 `VNode` 节点的开始索引都加 1
  * 当新老 `VNode` 节点的 `end`相同时，同样直接 `patchVnode` ，同时新老 `VNode` 节点的结束索引都减 1
  * 当老 `VNode` 节点的 `start` 和新 `VNode` 节点的 `end` 相同时，这时候在 `patchVnode` 后，还需要将当前真实 `dom` 节点移动到 `oldEndVnode` 的后面，同时老 `VNode` 节点开始索引加 1，新 `VNode` 节点的结束索引减 1
  * 当老 `VNode` 节点的 `end` 和新 `VNode` 节点的 `start` 相同时，这时候在 `patchVnode` 后，还需要将当前真实 `dom` 节点移动到 `oldStartVnode` 的前面，同时老 `VNode` 节点结束索引减 1，新 `VNode` 节点的开始索引加 1
  * 如果都不满足以上四种情形，那说明没有相同的节点可以复用，则会分为以下两种情况： 
    * 从旧的 `VNode` 为 `key` 值，对应 `index` 序列为 `value` 值的哈希表中找到与 `newStartVnode` 一致 `key` 的旧的 `VNode` 节点，再进行`patchVnode`，同时将这个真实 `dom`移动到 `oldStartVnode` 对应的真实 `dom` 的前面
    * 调用 `createElm` 创建一个新的 `dom` 节点放到当前 `newStartIdx` 的位置

**小结**

  * 当数据发生改变时，订阅者`watcher`就会调用`patch`给真实的`DOM`打补丁
  * 通过`isSameVnode`进行判断，相同则调用`patchVnode`方法
  * `patchVnode`做了以下操作： 
    * 找到对应的真实`dom`，称为`el`
    * 如果都有都有文本节点且不相等，将`el`文本节点设置为`Vnode`的文本节点
    * 如果`oldVnode`有子节点而`VNode`没有，则删除`el`子节点
    * 如果`oldVnode`没有子节点而`VNode`有，则将`VNode`的子节点真实化后添加到`el`
    * 如果两者都有子节点，则执行`updateChildren`函数比较子节点
  * `updateChildren`主要做了以下操作： 
    * 设置新旧`VNode`的头尾指针
    * 新旧头尾指针进行比较，循环向中间靠拢，根据情况调用`patchVnode`进行`patch`重复流程、调用`createElem`创建一个新节点，从哈希表寻找 `key`一致的`VNode` 节点再分情况操作

### Vue2和Vue3和React三者的diff算法有什么区别

如果要严格`diff`两颗树，时间复杂度`O(n^3)`不可用，`react`把复杂度优化到了`O(n)`

**Tree diff的优化**

  * 只比较同一层级，不跨级比较
  * `tag`不同则删掉重建（不在去比较内部细节）
  * 子节点通过`key`区分

![](/images/s_poetries_work_uploads_2023_01_4c213c57e4a91c38.webp)

**React diff仅右移动**

![](/images/s_poetries_work_uploads_2023_01_8c436b7f707c2e0d.webp)

**Vue2 深度递归的方式 + 双指针的方式**

> `Vue2`的`diff`算法是平级比较，不考虑跨级比较的情况。内部采用`深度递归的方式 + 双指针的方式`进行比较

  * 比较过程: 
    * 先比较是否是相同节点
    * 相同节点比较属性,并复用老节点
    * 比较儿子节点，考虑老节点和新节点儿子的情况
    * 优化比较：`头头`、`尾尾`、`头尾`、`尾头`
    * 比对查找进行复用

![](/images/s_poetries_work_uploads_2023_01_b200d667af842b4d.webp)

**Vue3中采用最长递增子序列实现diff算法**

**Vue React为何循环时必须使用key**

  * `vdom diff` 算法会根据`key`判断元素是否要删除
  * 如果匹配了`key`，则只移动元素-性能较好
  * 未匹配`key`，则删除重建，性能较差

### 既然Vue通过数据劫持可以精准探测数据变化，为什么还需要虚拟DOM进行diff检测差异

  * 响应式数据变化，`Vue`确实可以在数据变化时，响应式系统可以立刻得知。但是如果给每个属性都添加`watcher`用于更新的话，会产生大量的`watcher`从而降低性能
  * 而且粒度过细也得导致更新不准确的问题，所以`vue`采用了组件级的`watcher`配合`diff`来检测差异

### 请说明Vue中key的作用和原理，谈谈你对它的理解

![](/images/s_poetries_work_gitee_2020_07_67.webp)

  * `key`是为`Vue`中的`VNode`标记的唯一`id`，在`patch`过程中通过`key`可以判断两个虚拟节点是否是相同节点，通过这个`key`，我们的`diff`操作可以更准确、更快速
  * `diff`算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的`key`与旧节点进行比对,然后检出差异
  * 尽量不要采用索引作为`key`
  * 如果不加`key`,那么`vue`会选择复用节点(Vue的就地更新策略),导致之前节点的状态被保留下来,会产生一系列的`bug`
  * **更准确** ：因为带 `key` 就不是就地复用了，在 `sameNode` 函数 `a.key === b.key` 对比中可以避免就地复用的情况。所以会更加准确。
  * **更快速** ：`key`的唯一性可以被`Map`数据结构充分利用，相比于遍历查找的时间复杂度`O(n)`，`Map`的时间复杂度仅仅为`O(1)`，比遍历方式更快。

源码如下：
```js
    function createKeyToOldIdx (children, beginIdx, endIdx) {
      let i, key
      const map = {}
      for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
      }
      return map
    }
```

回答范例

**分析**

这是一道特别常见的问题，主要考查大家对虚拟`DOM`和`patch`细节的掌握程度，能够反映面试者理解层次

**思路分析：**

  * 给出结论，`key`的作用是用于优化`patch`性能
  * `key`的必要性
  * 实际使用方式
  * 总结：可从源码层面描述一下`vue`如何判断两个节点是否相同

**回答范例：**

  1. `key`的作用主要是为了更高效的更新虚拟`DOM`
  2. `vue`在`patch`过程中**判断两个节点是否是相同节点是`key`是一个必要条件**，渲染一组列表时，`key`往往是唯一标识，所以如果不定义`key`的话，`vue`只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个`patch`过程比较低效，影响性能
  3. 实际使用中在渲染一组列表时`key`必须设置，而且必须是唯一标识，应该避免使用数组索引作为`key`，这可能导致一些隐蔽的`bug`；`vue`中在使用相同标签元素过渡切换时，也会使用`key`属性，其目的也是为了让`vue`可以区分它们，否则`vue`只会替换其内部属性而不会触发过渡效果
  4. 从源码中可以知道，`vue`判断两个节点是否相同时主要判断两者的`key`和`标签类型(如div)`等，因此如果不设置`key`，它的值就是`undefined`，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的`dom`更新操作，明显是不可取的

> 如果不使用 `key`，`Vue` 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。`key` 是为 `Vue` 中
> `vnode` 的唯一标记，通过这个 `key`，我们的 `diff` 操作可以更准确、更快速

![](/images/s_poetries_work_uploads_2022_08_8c7511b8697e15ea.webp)

>
> diff程可以概括为：`oldCh`和`newCh`各有两个头尾的变量S`tartIdx`和`EndIdx`，它们的`2`个变量相互比较，一共有`4`种比较方式。如果`4`种比较都没匹配，如果设置了`key`，就会用`key`进行比较，在比较的过程中，变量会往中间靠，一旦`StartIdx>EndIdx`表明`oldCh`和`newCh`至少有一个已经遍历完了，就会结束比较,这四种比较方式就是`首`、`尾`、`旧尾新头`、`旧头新尾`

**相关代码如下**
```js
    // 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
    function isSameVnode(oldVnode, newVnode) {
      return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
    }
    
    // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
    function makeIndexByKey(children) {
      let map = {};
      children.forEach((item, index) => {
        map[item.key] = index;
      });
      return map;
    }
    // 生成的映射表
    let map = makeIndexByKey(oldCh);
```
