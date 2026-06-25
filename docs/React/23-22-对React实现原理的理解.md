# 22 对React实现原理的理解

### 前言介绍

  * `react` 和 `vue` 都是基于 `vdom` 的前端框架，之所以用 `vdom` 是因为可以精准的对比关心的属性，而且还可以跨平台渲染
  * 但是开发不会直接写 `vdom`，而是通过 `jsx` 这种接近 `html` 语法的 `DSL`，编译产生 `render function`，执行后产生 `vdom`
  * `vdom` 的渲染就是根据不同的类型来用不同的 `dom api` 来操作 `dom`
  * 渲染组件的时候，如果是函数组件，就执行它拿到 `vdom`。`class` 组件就创建实例然后调用 `render` 方法拿到 `vdom`。`vue` 的那种 `option` 对象的话，就调用 `render` 方法拿到 `vdom`
  * 组件本质上就是对一段 `vdom` 产生逻辑的封装，`函数`、`class`、`option` 对象甚至其他形式都可以
  * `react` 和 `vue` 最大的区别在状态管理方式上，`vue` 是通过响应式，`react` 是通过 `setState` 的 `api`。我觉得这个是最大的区别，因为它导致了后面 `react` 架构的变更
  * `react` 的 `setState` 的方式，导致它并不知道哪些组件变了，需要渲染整个 `vdom` 才行。但是这样计算量又会比较大，会阻塞渲染，导致动画卡顿。所以 `react` 后来改造成了 `fiber` 架构，目标是可打断的计算
  * 为了这个目标，不能变对比变更新 `dom` 了，所以把渲染分为了 `render` 和 `commit` 两个阶段，`render` 阶段通过 `schedule` 调度来进行 `reconcile`，也就是找到变化的部分，创建 `dom`，打上增删改的 `tag`，等全部计算完之后，`commit` 阶段一次性更新到 `dom`
  * 打断之后要找到父节点、兄弟节点，所以 `vdom` 也被改造成了 `fiber` 的数据结构，有了 `parent`、`sibling` 的信息
  * 所以 `fiber` 既指这种链表的数据结构，又指这个 `render`、`commit` 的流程
  * `reconcile` 阶段每次处理一个 `fiber` 节点，处理前会判断下 `shouldYield`，如果有更高优先级的任务，那就先执行别的
  * `commit` 阶段不用再次遍历 `fiber` 树，为了优化，`react` 把有 `effectTag` 的 `fiber` 都放到了 `effectList` 队列中，遍历更新即可
  * 在`dom`操作前，会异步调用 `useEffect` 的回调函数，异步是因为不能阻塞渲染
  * 在 `dom` 操作之后，会同步调用 `useLayoutEffect` 的回调函数，并且更新 `ref`
  * 所以，`commit` 阶段又分成了 `before mutation`、`mutation`、`layout` 这三个小阶段，就对应上面说的那三部分

> 理解了 `vdom`、`jsx`、`组件本质`、`fiber`、`render(reconcile + schedule)` \+
> `commit(before mutation、mutation、layout)`的渲染流程，就算是对 `react` 原理有一个比较深的理解

下面展开分析

### vdom

为什么 `react` 和 `vue` 都要基于 `vdom` 呢？直接操作真实 `dom` 不行么？

考虑下这样的场景：

  * 渲染就是用 `dom api` 对真实 `dom` 做增删改，如果已经渲染了一个 `dom`，后来要更新，那就要遍历它所有的属性，重新设置，比如 `id`、`clasName`、`onclick` 等。
  * 而 `dom` 的属性是很多的：

![](/images/s_poetries_work_uploads_2022_08_b14c40db3beb9881.webp)

  * 有很多属性根本用不到，但在更新时却要跟着重新设置一遍。
  * 能不能只对比我们关心的属性呢？
  * 把这些单独摘出来用 `JS` 对象表示不就行了？
  * 这就是为什么要有 `vdom`，是它的第一个好处。
  * 而且有了 `vdom` 之后，就没有和 `dom` 强绑定了，可以渲染到别的平台，比如 `native`、`canvas` 等等。
  * 这是 `vdom` 的第二个好处。
  * 我们知道了 `vdom` 就是用 `JS` 对象表示最终渲染的 `dom` 的，比如：
```js
    {
      type: 'div',
      props: {
        id: 'aaa',
        className: ['bbb', 'ccc'],
        onClick: function() {}
      },
      children: []
    }
```

然后用渲染器把它渲染出来，但是要让开发去写这样的 `vdom` 么？那肯定不行，这样太麻烦了，大家熟悉的是 `html` 那种方式，所以我们要引入编译的手段

### dsl 的编译

  * `dsl` 是 `domain specific language`，领域特定语言的意思，`html`、`css` 都是 `web` 领域的 `dsl`
  * 直接写 `vdom` 太麻烦了，所以前端框架都会设计一套 `dsl`，然后编译成 `render function`，执行后产生 `vdom`。
  * `vue` 和 `react` 都是这样

![](/images/s_poetries_work_uploads_2022_08_3d654d2b28b78f94.webp)

> 这套 dsl 怎么设计呢？前端领域大家熟悉的描述 `dom` 的方式是 `html`，最好的方式自然是也设计成那样。所以 `vue` 的
> `template`，`react` 的 `jsx` 就都是这么设计的。`vue` 的 `template compiler` 是自己实现的，而
> `react` 的 `jsx` 的编译器是 `babel` 实现的，是两个团队合作的结果。

编译成 `render function` 后再执行就是我们需要的 `vdom`。接下来渲染器把它渲染出来就行了。那渲染器怎么渲染 `vdom` 的呢？

### 渲染 vdom

渲染 `vdom` 也就是通过 `dom api` 增删改 `dom`。比如一个 `div`，那就要 `document.createElement`
创建元素，然后 `setAttribute` 设置属性，`addEventListener` 设置事件监听器。如果是文本，那就要
`document.createTextNode` 来创建。所以说根据 `vdom` 类型的不同，写个 `if
else`，分别做不同的处理就行了。没错，不管 `vue` 还是 `react`，渲染器里这段 `if else` 是少不了的：
```js
    switch (vdom.tag) {
      case HostComponent:
        // 创建或更新 dom
      case HostText:
        // 创建或更新 dom
      case FunctionComponent: 
        // 创建或更新 dom
      case ClassComponent: 
        // 创建或更新 dom
    }
```

> `react` 里是通过 `tag` 来区分 `vdom` 类型的，比如 `HostComponent` 就是元素，`HostText`
> 就是文本，`FunctionComponent`、`ClassComponent`
> 就分别是函数组件和类组件。那么问题来了，组件怎么渲染呢？这就涉及到组件的原理了：

### 组件

> 我们的目标是通过 `vdom` 描述界面，在 `react` 里会使用 `jsx`。这样的 `jsx` 有的时候是基于 `state`
> 来动态生成的。如何把 `state` 和 `jsx` 关联起来呢？封装成 `function`、`class` 或者
> `option`对象的形式。然后在渲染的时候执行它们拿到 `vdom`就行了。

这就是组件的实现原理：
```js
    switch (vdom.tag) {
      case FunctionComponent: 
           const childVdom = vdom.type(props);
           
           render(childVdom);
           //...
      case ClassComponent: 
         const instance = new vdom.type(props);
         const childVdom = instance.render();
         
         render(childVdom);
         //...
    } 
```

如果是函数组件，那就传入 `props` 执行它，拿到 `vdom` 之后再递归渲染。如果是 `class` 组件，那就创建它的实例对象，调用
`render` 方法拿到 `vdom`，然后递归渲染。所以，大家猜到 `vue` 的 `option` 对象的组件描述方式怎么渲染了么？
```js
    {
        data: {},
        props: {}
        render(h) {
            return h('div', {}, '');
        }
    }
```

没错，就是执行下 `render` 方法就行：
```js
    const childVdom = option.render();
    
    render(childVdom);
```

大家可能平时会写单文件组件 `sfc`的形式，那个会有专门的编译器，把 `template` 编译成 `render function`，然后挂到
`option 对象的`render` 方法上

![](/images/s_poetries_work_uploads_2022_08_b5a9bf470a936def.webp)

所以组件本质上只是对产生 `vdom` 的逻辑的封装，函数的形式、`option` 对象的形式、`class` 的形式都可以。就像 `vue3`
也有了函数组件一样，组件的形式并不重要。基于 `vdom` 的前端框架渲染流程都差不多，vue 和 react
很多方面是一样的。但是管理状态的方式不一样，`vue` 有响应式，而 `react` 则是 `setState` 的 `api` 的方式。真说起来，vue
和 react 最大的区别就是状态管理方式的区别，因为这个区别导致了后面架构演变方向的不同。

### 状态管理

> `react` 是通过 `setState` 的 `api` 触发状态更新的，更新以后就重新渲染整个 `vdom`。而 `vue`
> 是通过对状态做代理，`get` 的时候收集以来，然后修改状态的时候就可以触发对应组件的 `render` 了。

有的同学可能会问，为什么 `react` 不直接渲染对应组件呢？

想象一下这个场景：

父组件把它的 `setState`
函数传递给子组件，子组件调用了它。这时候更新是子组件触发的，但是要渲染的就只有那个组件么？明显不是，还有它的父组件。同理，某个组件更新实际上可能触发任意位置的其他组件更新的。所以必须重新渲染整个
`vdom` 才行。

那 `vue`
为啥可以做到精准的更新变化的组件呢？因为响应式的代理呀，不管是子组件、父组件、还是其他位置的组件，只要用到了对应的状态，那就会被作为依赖收集起来，状态变化的时候就可以触发它们的
`render`，不管是组件是在哪里的。这就是为什么 `react` 需要重新渲染整个 `vdom`，而 `vue`
不用。这个问题也导致了后来两者架构上逐渐有了差异。

### react 架构的演变

  * `react15` 的时候，和 `vue` 的渲染流程还是很像的，都是递归渲染 `vdom`，增删改 `dom` 就行。但是因为状态管理方式的差异逐渐导致了架构的差异。
  * `react` 的 `setState` 会渲染整个 `vdom`，而一个应用的所有 `vdom` 可能是很庞大的，计算量就可能很大。浏览器里 `js` 计算时间太长是会阻塞渲染的，会占用每一帧的动画、重绘重排的时间，这样动画就会卡顿。作为一个有追求的前端框架，动画卡顿肯定是不行的。但是因为 `setState` 的方式只能渲染整个 `vdom`，所以计算量大是不可避免的。那能不能把计算量拆分一下，每一帧计算一部分，不要阻塞动画的渲染呢？顺着这个思路，`react` 就改造为了 `fiber` 架构。

### fiber 架构

优化的目标是打断计算，分多次进行，但现在递归的渲染是不能打断的，有两个方面的原因导致的：

  * 渲染的时候直接就操作了 dom 了，这时候打断了，那已经更新到 dom 的那部分怎么办？
  * 现在是直接渲染的 vdom，而 vdom 里只有 children 的信息，如果打断了，怎么找到它的父节点呢？

**第一个问题的解决还是容易想到的：**

  * 渲染的时候不要直接更新到 `dom` 了，只找到变化的部分，打个增删改的标记，创建好 `dom`，等全部计算完了一次性更新到 `dom` 就好了。
  * 所以 `react` 把渲染流程分为了两部分： `render` 和 `commit`。
  * `render` 阶段会找到 `vdom` 中变化的部分，创建 `dom`，打上增删改的标记，这个叫做 `reconcile`，调和。
  * `reconcile` 是可以打断的，由 `schedule` 调度。
  * 之后全部计算完了，就一次性更新到 `dom`，叫做 `commit`。
  * 这样，`react` 就把之前的和 `vue` 很像的递归渲染，改造成了 `render（reconcile + schdule） + commit` 两个阶段的渲染。
  * 从此以后，`react` 和 `vue` 架构上的差异才大了起来。

**第二个问题，如何打断以后还能找到父节点、其他兄弟节点呢？**

现有的 `vdom` 是不行的，需要再记录下 `parent`、`silbing` 的信息。所以 `react` 创造了 `fiber` 的数据结构。

![](/images/s_poetries_work_uploads_2022_08_61ab11477198a2fe.webp)

  * 除了 `children` 信息外，额外多了 `sibling`、`return`，分别记录着兄弟节点、父节点的信息。
  * 这个数据结构也叫做 `fiber`。（`fiber` 既是一种数据结构，也代表 `render + commit` 的渲染流程） `react` 会先把 `vdom` 转换成 `fiber`，再去进行 `reconcile`，这样就是可打断的了。
  * 为什么这样就可以打断了呢？因为现在不再是递归，而是循环了：
```js
    function workLoop() {
      while (wip) {
        performUnitOfWork();
      }
    
      if (!wip && wipRoot) {
        commitRoot();
      }
    }
```

  * `react` 里有一个 workLoop 循环，每次循环做一个 `fiber` 的 `reconcile`，当前处理的 `fiber` 会放在 `workInProgress` 这个全局变量上。
  * 当循环完了，也就是 `wip` 为空了，那就执行 `commit` 阶段，把 `reconcile` 的结果更新到 `dom`。
  * 每个 `fiber` 的 `reconcile` 是根据类型来做的不同处理。当处理完了当前 `fiber` 节点，就把 `wip` 指向 `sibling`、`return` 来切到下个 `fiber` 节点。：
```js
    function performUnitOfWork() {
      const { tag } = wip;
    
      switch (tag) {
        case HostComponent:
          updateHostComponent(wip);
          break;
    
        case FunctionComponent:
          updateFunctionComponent(wip);
          break;
    
        case ClassComponent:
          updateClassComponent(wip);
          break;
        case Fragment:
          updateFragmentComponent(wip);
          break;
        case HostText:
          updateHostTextComponent(wip);
          break;
        default:
          break;
      }
    
      if (wip.child) {
        wip = wip.child;
        return;
      }
    
      let next = wip;
    
      while (next) {
        if (next.sibling) {
          wip = next.sibling;
          return;
        }
        next = next.return;
      }
    
      wip = null;
    }
```

> 函数组件和 `class` 组件的 `reconcile`和之前讲的一样，就是调用 `render` 拿到 `vdom`，然后继续处理渲染出的
> `vdom`：
```js
    function updateClassComponent(wip) {
      const { type, props } = wip;
      const instance = new type(props);
      const children = instance.render();
    
      reconcileChildren(wip, children);
    }
    
    function updateFunctionComponent(wip) {
      renderWithHooks(wip);
    
      const { type, props } = wip;
    
      const children = type(props);
      reconcileChildren(wip, children);
    }
```

  * 循环执行 `reconcile`，那每次处理之前判断一下是不是有更高优先级的任务，就能实现打断了。
  * 所以我们在每次处理 `fiber` 节点的 `reconcile` 之前，都先调用下 `shouldYield` 方法：
```js
    function workLoop() {
      while (wip && shouldYield()) {
        performUnitOfWork();
      }
    
      if (!wip && wipRoot) {
        commitRoot();
      }
    }
```

  * `shouldYiled` 方法就是判断待处理的任务队列有没有优先级更高的任务，有的话就先处理那边的 `fiber`，这边的先暂停一下。
  * 这就是 `fiber` 架构的 `reconcile` 可以打断的原理。通过 `fiber` 的数据结构，加上循环处理前每次判断下是否打断来实现的。
  * 聊完了 `render` 阶段（`reconcile + schedule`），接下来就进入 `commit` 阶段了。
  * 前面说过，为了变为可打断的，`reconcile` 阶段并不会真正操作 `dom`，只会创建 `dom` 然后打个 `effectTag` 的增删改标记。
  * `commit` 阶段就根据标记来更新 `dom` 就可以了。
  * 但是 `commit` 阶段要再遍历一次 `fiber` 来查找有 `effectTag` 的节点，更新 `dom`么？
  * 这样当然没问题，但没必要。完全可以在 reconcile 的时候把有 effectTag 的节点收集到一个队列里，然后 commit 阶段直接遍历这个队列就行了。
  * 这个队列叫做 `effectList`。
  * `react` 会在 `commit` 阶段遍历 `effectList`，根据 `effectTag` 来增删改 `dom`。
  * `dom` 创建前后就是 `useEffect`、`useLayoutEffect` 还有一些函数组件的生命周期函数执行的时候。
  * `useEffect` 被设计成了在 `dom` 操作前异步调用，`useLayoutEffect` 是在 `dom` 操作后同步调用。
  * 为什么这样呢？
  * 因为都要操作 `dom` 了，这时候如果来了个 `effect` 同步执行，计算量很大，那不是把 fiber 架构带来的优势有毁了么？
  * 所以 `effect` 是异步的，不会阻塞渲染。
  * 而 `useLayoutEffect`，顾名思义是想在这个阶段拿到一些布局信息的，dom 操作完以后就可以了，而且都渲染完了，自然也就可以同步调用了。
  * 实际上 `react` 把 `commit` 阶段也分成了 `3` 个小阶段。
  * `before mutation`、`mutation`、`layout`。
  * `mutation` 就是遍历 `effectList` 来更新 `dom` 的。
  * 它的之前就是 `before mutation`，会异步调度 `useEffect` 的回调函数。
  * 它之后就是 `layout` 阶段了，因为这个阶段已经可以拿到布局信息了，会同步调用 `useLayoutEffect` 的回调函数。而且这个阶段可以拿到新的 `dom` 节点，还会更新下 `ref`。
  * 至此，我们对 `react` 的新架构，`render`、`commit` 两大阶段都干了什么就理清了。
