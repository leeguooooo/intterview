---
title: "React setState 到底是同步的 还是异步的"
---

## 核心要点

| 在哪里调用 setState | React ≤ 17（以及 React 18 里仍用 `ReactDOM.render` 的老入口） | 背后的原因 |
|---|---|---|
| React 合成事件，比如 `onClick`、`onChange` | 看起来**异步**：调用完读 `this.state` 还是旧值，多次调用合并成一次渲染 | 事件派发前 React 已经把批处理开关 `isBatchingUpdates` 打开 |
| 生命周期，比如 `componentDidMount`、`componentDidUpdate` | 看起来**异步**，同样会合并 | 挂载、更新流程本身就跑在一个批处理里 |
| `setTimeout`、`setInterval`、`Promise.then` 的回调 | 看起来**同步**：调用一次渲染一次，下一行就能读到新值 | 回调运行时，当初那次批处理早已结束，开关已经关上 |
| 用 `addEventListener` 绑定的原生 DOM 事件 | 看起来**同步** | 事件根本没经过 React 的派发逻辑，没人替它开批处理 |

几个要记牢的结论：

- **setState 本身没有「异步」的实现**，它没有用 `setTimeout` 或微任务把自己往后推。所谓异步，是 React 把这次更新**先放进队列、等这一批代码跑完再统一处理**，即「批量更新」。
- 是否进队列，由一个全局开关决定（React 15 里叫 `isBatchingUpdates`）。开关打开，组件进 `dirtyComponents` 排队；开关关着，立刻走完整的更新流程。
- 开关由**事务（Transaction）**打开和关闭：`perform` 前把开关置为 `true`，回调跑完后在 `close` 阶段先刷新队列，再把开关复位为 `false`。
- `setTimeout` 并没有改变 setState，它只是让 setState 在批处理结束之后才执行，**躲开了 React 的批处理管控**。一句话：被 React 管着的 setState 一定是批量的。
- 对象写法的多次 setState 会被浅合并，同一个字段只有最后一次生效。想基于上一次的结果继续算，要用函数写法：`this.setState(prev => ({ likes: prev.likes + 1 }))`。
- React 18 用 `createRoot` 挂载后有了**自动批处理**，`setTimeout`、Promise、原生事件里的更新也会合并，不再有「同步」表现；真要立刻提交，用 `flushSync`。

## 先做一道题：三个按钮各输出什么

下面这个点赞面板有三个按钮，分别在三种写法下调用 setState：

```jsx
import React from "react";

export default class LikeBoard extends React.Component {
  state = { likes: 0 };

  // 合成事件里调一次
  likeOnce = () => {
    console.log("[likeOnce] 调用前 likes =", this.state.likes);
    this.setState({ likes: this.state.likes + 1 });
    console.log("[likeOnce] 调用后 likes =", this.state.likes);
  };

  // 合成事件里连调三次
  likeThrice = () => {
    console.log("[likeThrice] 调用前 likes =", this.state.likes);
    this.setState({ likes: this.state.likes + 1 });
    this.setState({ likes: this.state.likes + 1 });
    this.setState({ likes: this.state.likes + 1 });
    console.log("[likeThrice] 调用后 likes =", this.state.likes);
  };

  // 放进定时器里再调
  unlikeLater = () => {
    setTimeout(() => {
      console.log("[unlikeLater] 调用前 likes =", this.state.likes);
      this.setState({ likes: this.state.likes - 1 });
      console.log("[unlikeLater] 调用后 likes =", this.state.likes);
    }, 0);
  };

  render() {
    return (
      <div>
        <p>当前点赞数：{this.state.likes}</p>
        <button onClick={this.likeOnce}>点赞 +1</button>
        <button onClick={this.likeThrice}>连赞三次</button>
        <button onClick={this.unlikeLater}>稍后取消一个赞</button>
      </div>
    );
  }
}
```

入口文件用 React 17 的方式挂载，外面包一层 `StrictMode`（它只会让 `render` 等函数在开发环境多跑一次，不影响事件处理函数里的打印）：

```jsx
import React from "react";
import ReactDOM from "react-dom";
import LikeBoard from "./LikeBoard";

ReactDOM.render(
  <React.StrictMode>
    <LikeBoard />
  </React.StrictMode>,
  document.querySelector("#app")
);
```

页面上是一个计数和三个按钮：

![LikeBoard 组件渲染出的点赞数和三个按钮](/images/rewrite/react-setstate-sync/buttons.webp)

从左往右各点一次，控制台会打印什么？先自己推一遍，再对照实际结果。下面是在 React 17.0.2 下跑出来的输出：

![依次点击三个按钮后的控制台输出：前两个按钮调用后读到旧值，第三个按钮调用后立即变化](/images/rewrite/react-setstate-sync/console-all.webp)

逐个看：

1. **likeOnce**：调用前后都是 0。这符合大多数人对「setState 是异步的」的印象，调用完 state 并没有马上变，过一会儿界面才变成 1。
2. **likeThrice**：调用前是 1，三次 `+1` 之后读到的还是 1，而且界面最后只变成 2，不是 4。调三次和调一次效果一样。
3. **unlikeLater**：调用前是 2，调用后立刻变成 1。到了定时器里，setState 居然**同步生效**了。

第一个结果能用「异步」解释，第二个就开始让人困惑：那个「过一会儿」到底是什么时候，三次调用又为什么只算一次？第三个则直接推翻了「setState 是异步的」这个说法。要解释这三种现象，得看 setState 调用之后 React 内部到底做了什么。

## 为什么要「攒一攒」：批量更新

### 每次都立刻更新会怎样

从类组件生命周期的角度，一次 setState 触发的更新要依次经过 `shouldComponentUpdate`、`componentWillUpdate`、`render`、`componentDidUpdate`，其中 `render` 之后还要做 diff 并改写真实 DOM，这是整个流程里最贵的部分。

如果每调用一次 setState 就完整走一遍这条链路，一个事件处理函数里调三次就要渲染三次，写个循环调一百次就要渲染一百次，页面很快会卡住：

![上：一次完整的类组件更新流程；中：每次 setState 都走一遍，三次调用三次 render；下：先入队、合并后只走一次](/images/rewrite/react-setstate-sync/naive-vs-batched.webp)

把图中间那种「逐次更新」写成伪代码，大概是这样：

```text
setState({ likes: likes + 1 })  →  sCU → cWU → render → cDU   // 第 1 轮
setState({ likes: likes + 1 })  →  sCU → cWU → render → cDU   // 第 2 轮
setState({ likes: likes + 1 })  →  sCU → cWU → render → cDU   // 第 3 轮
```

**避免这种重复渲染，正是 setState 表现为异步的根本动机。**

### React 的做法：先入队，再合并，最后只更新一次

React 的思路和 Vue 的 `nextTick`、浏览器事件循环里的任务队列很像：setState 来了先不处理，**把要改的内容放进队列攒着**；等当前这段同步代码执行完，再把攒下的状态一次性合并，**用最终结果只走一遍更新流程**。这就是「批量更新」（batched updates）：

```text
setState({ likes: likes + 1 })  →  入队：[+1]
setState({ likes: likes + 1 })  →  入队：[+1, +1]
setState({ likes: likes + 1 })  →  入队：[+1, +1, +1]
                                        │
                     同步代码结束，合并队列
                                        ▼
                     得到 { likes: 1 }，走一次 sCU → cWU → render → cDU
```

这里有两个细节：

- **只要同步代码还没跑完，入队就不会停。** 队列什么时候被处理，取决于 React 何时结束这一批，而不是某个固定的时间间隔。
- **合并不是累加。** 三次调用里的 `this.state.likes` 读到的都是同一个旧值 0，所以三个更新对象全是 `{ likes: 1 }`。合并时用的是类似 `Object.assign` 的浅合并，同名字段后面的覆盖前面的，结果当然是 1。这就是 likeThrice 只加了 1 的原因。

把次数放大到 100 次也一样，只是队列变长，不会多渲染：

```jsx
likeMany = () => {
  console.log("[likeMany] 循环前 likes =", this.state.likes);
  for (let n = 0; n < 100; n++) {
    this.setState({ likes: this.state.likes + 1 });
  }
  console.log("[likeMany] 循环后 likes =", this.state.likes);
};
```

![循环调用 100 次 setState 后，读到的 likes 仍是 0，界面最终只显示 1](/images/rewrite/react-setstate-sync/console-loop.webp)

如果确实想每次都在上一次的基础上加，就改用函数写法。函数会在合并阶段按顺序执行，每次拿到的 `prev` 都是前面更新累积后的结果：

```jsx
likeManyFn = () => {
  for (let n = 0; n < 100; n++) {
    this.setState(prev => ({ likes: prev.likes + 1 }));
  }
  // 这里读 this.state.likes 依然是旧值，但这一批结束后会一次性 +100
};
```

在 React 17 下实测，同一批里对象写法连调 100 次只加 1，函数写法连调 100 次加 100，而且两者都只触发一次渲染。

## setTimeout 做了什么

### 去掉定时器，同步就消失了

回到 unlikeLater。它和前两个按钮唯一的区别是 setState 外面多了一层 `setTimeout`。把这层去掉试试：

```jsx
unlikeLater = () => {
  // 不再包 setTimeout
  console.log("[unlikeLater] 调用前 likes =", this.state.likes);
  this.setState({ likes: this.state.likes - 1 });
  console.log("[unlikeLater] 调用后 likes =", this.state.likes);
};
```

点击后，调用后读到的值和调用前一样，跟 likeOnce 的表现完全相同：

![去掉 setTimeout 后，setState 调用前后读到的 likes 都是 0](/images/rewrite/react-setstate-sync/console-no-timer.webp)

于是问题变成：**为什么套一层 setTimeout，setState 就从「延后生效」变成了「立刻生效」？**

先给结论，后面再用源码验证：**setTimeout 没有给 setState 加任何能力，它只是让 setState 在 React 的批处理结束之后才执行，从而绕开了批处理。只要处在 React 的批处理管控之内，setState 就一定是批量、延后生效的。**

### 用 React 15 的源码来看

下面的源码分析以 React 15 为准。React 16 之后引入了 Fiber，内部实现换了一套，但就 setState 的批处理而言，React 15 的结构最直白，变量名和行为也最容易对上号；Fiber 下对应的实现放在后面的「React 16/17 里换成了什么」一节补充。

先看 setState 调用之后的主干流程：

![setState 主流程：setState → enqueueSetState → enqueueUpdate，再根据 isBatchingUpdates 决定排队还是立即更新](/images/rewrite/react-setstate-sync/setstate-flow.webp)

**第一步：`setState` 只做分发。** 它把参数交给组件实例上的 `updater`，有回调就另外登记：

```js
// React 15：ReactComponent.js（精简）
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

**第二步：`enqueueSetState` 把新状态放进组件自己的待处理队列。** 以对象参数为例，它做的事可以概括成两件：

- 根据组件实例找到内部实例，把 `partialState` 推进它的 `_pendingStateQueue` 数组；
- 调用 `enqueueUpdate`，把「这个组件需要更新」这件事交给下一步处理。

```js
// ReactUpdateQueue.js（精简，中文注释是补充说明）
enqueueSetState(publicInstance, partialState) {
  const inst = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 每个组件实例都有一个待合并的 state 数组，没有就先建一个
  const pending = inst._pendingStateQueue || (inst._pendingStateQueue = []);
  pending.push(partialState);
  enqueueUpdate(inst);
}
```

**第三步：`enqueueUpdate` 决定是现在更新还是排队。** 这是整件事的分水岭：

```js
// ReactUpdates.js（精简）
function enqueueUpdate(component) {
  ensureInjected();
  // 当前不在批处理中：自己发起一次批处理，组件会被立刻更新
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 当前已在批处理中：登记到 dirtyComponents，等这一批结束
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

这段代码引出了 `batchingStrategy` 这个对象。它的 `isBatchingUpdates` 决定组件是排队还是马上更新，它的 `batchedUpdates` 方法则负责真正启动一批更新。可以推断，React 正是靠它来管理批量更新的。

### batchingStrategy：一把全局锁

React 15 默认注入的批处理策略是 `ReactDefaultBatchingStrategy`，核心代码不长：

```js
// ReactDefaultBatchingStrategy.js（精简）
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,   // 全局唯一的「正在批处理」标记，初始为 false

  batchedUpdates: function (callback, a, b, c, d, e) {
    var wasBatching = ReactDefaultBatchingStrategy.isBatchingUpdates;
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;   // 上锁

    if (wasBatching) {
      // 外层已经在批处理里了，直接执行，不再嵌套开事务
      return callback(a, b, c, d, e);
    }
    // 最外层：放进事务里执行，事务结束时负责刷新队列、解锁
    return transaction.perform(callback, null, a, b, c, d, e);
  },
};
```

把它理解成一个「锁管理器」最直观：

- `isBatchingUpdates` 就是那把锁，初始是 `false`，表示当前没有在批处理。
- 每次 React 通过 `batchedUpdates` 发起一批更新时，先把锁置为 `true`，意思是「现在正在批量处理」。
- 锁住期间，所有需要更新的组件只能进 `dirtyComponents` 排队，等这一批统一处理，不能插队单独更新。

这种「先上锁、集中排队、统一处理」的设计，让 React 在面对大量状态变化时依然能有序地分批完成更新。

`batchedUpdates` 里还有一行值得注意：`transaction.perform(...)`。锁是什么时候打开的、队列是什么时候被处理的，都藏在这个「事务」里。

## React 15 的事务（Transaction）机制

### 事务是什么

`Transaction` 是 React 15 源码里使用非常广泛的一个类。调试 React 15 项目时，如果调用栈里出现了 `perform`、`initialize`、`close`、`closeAll`、`notifyAll` 这类方法名，基本可以确定当前正处在某个事务中。

源码里对它的定位是：创建一个能把任意方法包起来的「黑盒」。需要在目标函数运行前后执行的固定逻辑都可以挂上去，而且**即使目标函数抛了异常，这些收尾逻辑也照样会执行**。使用时只需在创建事务时提供这些前后逻辑。

源码注释里有一张 ASCII 图，意思可以概括成下面这样：

```text
                   wrapper A          wrapper B
                  ┌──────────┐      ┌──────────┐
perform(fn) ───▶  │initialize│ ───▶ │initialize│ ───▶ fn() ───▶ │close│ A ───▶ │close│ B ───▶ 结束
                  └──────────┘      └──────────┘
                  （fn 抛错时，所有 close 依然会被调用，保证收尾逻辑一定执行）
```

说白了，事务就是一层「壳」：

- 一组 `initialize` + `close` 方法叫做一个 **wrapper**，一个事务可以挂多个 wrapper；
- 目标函数不能直接调用，要通过事务暴露的 `perform` 执行；
- `perform` 先依次调用所有 wrapper 的 `initialize`，然后执行目标函数，最后依次调用所有 wrapper 的 `close`。

### 批处理事务的两个 wrapper

`ReactDefaultBatchingStrategy` 里用的就是这样一个事务，它挂了两个 wrapper：

```js
// ReactDefaultBatchingStrategy.js（精简）
var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates), // 处理积攒的更新
};
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;    // 解锁
  },
};
var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

两个 `initialize` 都是空函数，真正干活的是 `close`。把它们代入事务的执行顺序，就得到一次批处理的完整过程：

![批处理事务：initialize 为空，callback 中 setState 只入队；close 阶段先 flushBatchedUpdates 遍历 dirtyComponents 走完生命周期，再把 isBatchingUpdates 置回 false](/images/rewrite/react-setstate-sync/batch-transaction.webp)

1. `batchedUpdates` 把锁置为 `true`，然后 `perform` 执行 callback（事件处理函数、首次挂载逻辑等），期间的 setState 全部只是入队。
2. callback 执行完，`FLUSH_BATCHED_UPDATES` 的 close 调用 `flushBatchedUpdates`：遍历 `dirtyComponents`，对每个组件调用 `updateComponent`，合并 `_pendingStateQueue`，再依次走 `componentWillReceiveProps`（仅在 props 可能变化时）→ `shouldComponentUpdate` → `componentWillUpdate` → `render` → `componentDidUpdate`，完成更新。
3. `RESET_BATCHED_UPDATES` 的 close 把 `isBatchingUpdates` 置回 `false`，锁打开。

> 注意执行顺序：`close` 按 `TRANSACTION_WRAPPERS` 数组的顺序调用，所以是**先刷新队列，再解锁**。刷新期间锁仍然是 `true`，这时在 `componentDidUpdate` 等生命周期里再调 setState，组件会再次进入 `dirtyComponents`，由 `flushBatchedUpdates` 的循环继续处理，而不是立刻嵌套更新一次。

### 用 70 行左右的代码复刻这套机制

为了确认上面的理解没错，可以把「锁 + 队列 + 事务」抽出来，用纯 JS 写一个能直接跑的极简版本（命名是自己起的，结构对应 React 15）：

```js
// mini-batching.js —— node mini-batching.js 可直接运行
class Transaction {
  constructor(wrappers) { this.wrappers = wrappers; }
  perform(fn, ...args) {
    this.wrappers.forEach(w => w.initialize());
    try {
      return fn(...args);
    } finally {
      this.wrappers.forEach(w => w.close()); // 即使 fn 抛错，close 也会执行
    }
  }
}

const pendingComponents = [];               // 对应 dirtyComponents
const batching = {
  locked: false,                            // 对应 isBatchingUpdates
  run(fn, ...args) {
    const wasLocked = batching.locked;
    batching.locked = true;
    if (wasLocked) return fn(...args);      // 已在批处理中，直接执行
    return batchTx.perform(fn, ...args);    // 否则开一个事务
  },
};

function flushPending() {
  while (pendingComponents.length) {
    const comp = pendingComponents.shift();
    comp.applyPending();
  }
}
const batchTx = new Transaction([
  { initialize() {}, close: flushPending },                        // 先刷新队列
  { initialize() {}, close() { batching.locked = false; } },       // 再解锁
]);

function scheduleUpdate(comp) {
  if (!batching.locked) return batching.run(scheduleUpdate, comp); // 没锁：自己开批次，立即刷新
  if (!pendingComponents.includes(comp)) pendingComponents.push(comp);
}

class MiniComponent {
  constructor(state) { this.state = state; this.queue = []; this.renders = 0; }
  setState(partial) { this.queue.push(partial); scheduleUpdate(this); }
  applyPending() {
    let next = { ...this.state };
    for (const p of this.queue) Object.assign(next, typeof p === 'function' ? p(next) : p);
    this.queue = [];
    this.state = next;
    this.renders++;
  }
}

const cart = new MiniComponent({ items: 0 });
// 模拟「合成事件」：框架先上锁再调用处理函数
const dispatchClick = handler => batching.run(handler);

dispatchClick(() => {
  cart.setState({ items: cart.state.items + 1 });
  cart.setState({ items: cart.state.items + 1 });
  console.log('事件处理中: items =', cart.state.items);
});
console.log('事件结束后: items =', cart.state.items, 'renders =', cart.renders);

dispatchClick(() => {
  setTimeout(() => {
    cart.setState({ items: cart.state.items + 10 });
    console.log('setTimeout 中: items =', cart.state.items, 'renders =', cart.renders);
  });
});
```

运行输出：

```text
事件处理中: items = 0
事件结束后: items = 1 renders = 1
setTimeout 中: items = 11 renders = 2
```

和 React 的表现完全一致：事件里两次 `+1` 被合并成一次渲染、只加了 1；定时器里的 setState 调用完立刻就是新值。

## 同步现象的真正原因

### 谁替我们上了锁

到这里还差最后一块拼图：事件处理函数和生命周期执行时，锁为什么已经是 `true`？答案是 React 在这些地方**主动调用了 `batchedUpdates`**。在 React 15 源码里搜 `batchedUpdates`，和更新流程相关的调用点主要有两处。

**一处在首次挂载。** `ReactMount` 渲染根组件时，把整个挂载过程放进了 `batchedUpdates`：

```js
// ReactMount.js（精简）
_renderNewRootComponent(nextElement, container, shouldReuseMarkup, context) {
  const componentInstance = instantiateReactComponent(nextElement);
  // 首次渲染同样包在批处理里执行
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance, container, shouldReuseMarkup, context
  );
  // ...
}
```

挂载过程中会按顺序调用各组件的生命周期，开发者完全可能在 `componentWillMount`、`componentDidMount` 里调用 setState。开启批处理后，这些更新都会先进 `dirtyComponents`，等挂载完成后统一处理，保证首屏渲染期间的 setState 都能生效且不会引起重复渲染。

**另一处在事件派发。** React 的事件系统在调用你写的处理函数之前，同样先开好批处理：

```js
// ReactEventListener.js（精简）
dispatchEvent(topLevelType, nativeEvent) {
  // ...
  try {
    // 在批处理中执行事件处理逻辑，处理函数里的 setState 都会被攒起来
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}
```

所以真相是：**合成事件和生命周期开始执行之前，React 已经悄悄把 `isBatchingUpdates` 置成了 `true`**；函数执行完毕，事务的 close 再把它改回 `false`。在这期间调用的 setState 自然不会立即生效。

### 把锁画进代码里

以 likeOnce 为例，加上 React 替我们做的事，等价于：

```jsx
likeOnce = () => {
  // React 派发事件前：上锁
  isBatchingUpdates = true;

  console.log("[likeOnce] 调用前 likes =", this.state.likes);
  this.setState({ likes: this.state.likes + 1 }); // 锁着 → 只入队
  console.log("[likeOnce] 调用后 likes =", this.state.likes);

  // 处理函数返回后：刷新队列，解锁
  isBatchingUpdates = false;
};
```

在锁的约束下，这里的 setState 只能延后生效。再看 unlikeLater：

```jsx
unlikeLater = () => {
  isBatchingUpdates = true; // React 上锁

  setTimeout(() => {
    // 等这里执行时，下面那行早已跑完
    console.log("[unlikeLater] 调用前 likes =", this.state.likes);
    this.setState({ likes: this.state.likes - 1 }); // 锁已打开 → 立即更新
    console.log("[unlikeLater] 调用后 likes =", this.state.likes);
  }, 0);

  isBatchingUpdates = false; // React 解锁
};
```

锁的开关发生在同步代码里，而 `setTimeout` 的回调要等到之后的某个宏任务才执行。那时整个事件派发早已结束，`isBatchingUpdates` 已经是 `false`，于是 `enqueueUpdate` 走进「没上锁」的分支，自己发起一次批处理并马上刷新，调用返回时 state 已经更新完：

![时间线：点击「稍后取消一个赞」后锁为 true，unlikeLater 的同步部分只注册了定时器，事件结束时 flush 并解锁；setTimeout 回调在下一个宏任务执行，此时锁为 false，setState 立即更新](/images/rewrite/react-setstate-sync/lock-timeline.webp)

所以说 setState 并没有「同步」这个特性，它只是在某些场景下**逃出了 React 的批处理管控**。同理，`Promise.then`、`async/await` 之后的代码、`addEventListener` 绑定的原生事件回调，执行时都不在 React 开启的批处理里，表现也都是「同步」的。

在 React 17.0.2 下实测（jsdom 环境）还能看到两点：

- `componentDidMount` 里调用 setState 后立即读 `this.state`，仍是旧值，说明生命周期确实在批处理中。
- 在 `setTimeout` 回调里连续调用两次 setState，会触发**两次**渲染，每次调用后都能读到新值，没有任何合并。

## React 16/17 里换成了什么

Fiber 架构下 `Transaction` 类被拿掉了，但「锁」本身是分两步演变的：React 16.0 到 16.8 的 `ReactFiberScheduler` 里仍然有模块级的 `isBatchingUpdates` 变量（外加一个 `isUnbatchingUpdates`），`batchedUpdates` 用 try/finally 把它置为 `true` 再复位，`requestWork` 里检查它来决定是排队还是立刻同步执行；从 16.9 起工作循环重写为 `ReactFiberWorkLoop`，这个布尔变量才被位掩码 `executionContext` 取代，React 17 用的就是这一套。下表右列以 16.9+ / 17 为准：

| React 15 | React 16.9+ / 17（legacy 模式） |
|---|---|
| `isBatchingUpdates` 锁 | `executionContext` 上的 `BatchedContext` / `EventContext` 等标志位 |
| 事务 close 时 `flushBatchedUpdates` | 批处理结束、`executionContext` 回到 `NoContext` 时执行 `flushSyncCallbackQueue` |
| 不在批处理中则立即更新 | `scheduleUpdateOnFiber` 发现当前是 `NoContext`，就立刻同步刷新 |

所以 React 16、17 里的现象和 React 15 完全一样：合成事件和生命周期中批量更新，`setTimeout`、Promise、原生事件中同步更新。这也适用于函数组件：React 17 里在定时器中连续调用两次 `setCount` 会渲染两次（只是函数组件里的 `count` 变量本身来自闭包，无论如何都读不到新值）。

如果在 React 17 里想让定时器、Promise 中的多次更新也合并，可以手动包一层：

```jsx
import { unstable_batchedUpdates } from "react-dom";

fetchLikes().then(total => {
  unstable_batchedUpdates(() => {
    this.setState({ likes: total });
    this.setState({ loading: false }); // 两次更新合并为一次渲染
  });
});
```

## React 18：自动批处理

React 18 使用 `createRoot` 挂载后，引入了**自动批处理（Automatic Batching）**：不管更新来自合成事件、`setTimeout`、Promise 还是原生事件，同一个任务里的多次更新都会合并，统一在稍后处理。上文那种「定时器里同步生效」的现象不复存在。

需要立刻把某次更新提交到 DOM 时（比如更新后马上要测量元素尺寸），用 `flushSync`：

```jsx
import { flushSync } from "react-dom";

setTimeout(() => {
  flushSync(() => {
    this.setState({ likes: this.state.likes + 5 });
  });
  // 走到这里时，DOM 和 this.state 都已经是新值
}, 0);
```

在 React 18.3.1 下实测：

- `createRoot` 下，`setTimeout` 里连续调两次 setState，调用后读到的仍是旧值，此刻渲染次数为 0；稍后只渲染 1 次。
- 包上 `flushSync` 后，调用返回时 state 已经更新，渲染了 1 次。
- 同一份代码改用 `ReactDOM.render` 挂载（React 18 中已废弃，但仍可用），行为和 React 17 完全一样：定时器里每次 setState 都立即渲染。

因此，本文讲的「有时异步、有时同步」，适用于 React 17 及以下，以及 React 18 中仍使用 `ReactDOM.render` 的老代码。用 `createRoot` 的 React 18+ 项目里，setState 默认一律批量处理。

## 面试速答模板

> setState 不能简单说是同步还是异步，它没有用任何异步 API，表现取决于调用时是否处在 React 的批处理中。React 内部有一个全局标记（React 15 里叫 `isBatchingUpdates`），setState 调用后会经过 `enqueueSetState` 把新状态放进组件的待处理队列，再由 `enqueueUpdate` 检查这个标记：如果正在批处理，就把组件放进 `dirtyComponents` 排队；如果不在，就立刻发起一次更新。React 在派发合成事件、执行挂载和生命周期之前，会通过 `batchedUpdates` 以事务的形式把标记置为 `true`，事务的 close 阶段先 `flushBatchedUpdates` 统一合并、渲染，再把标记复位。所以合成事件和生命周期里的 setState 会被合并，调用后读不到新值，看起来是异步的；而 `setTimeout`、Promise 回调和原生事件执行时这次批处理早就结束了，setState 会立刻触发更新，看起来是同步的。这样设计是为了避免多次 setState 造成多次重复渲染。对象写法的多次调用会浅合并，同名字段只保留最后一次，需要依赖上一次结果时用函数写法。React 16 前期在 Fiber 里仍沿用 `isBatchingUpdates`（但不再有事务），16.9+/17 改用 `executionContext`，行为不变；React 18 用 `createRoot` 后有了自动批处理，所有场景都会合并，需要立即生效时用 `flushSync`。
