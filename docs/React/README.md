
# React

## 简版速记

> 面试前 5 分钟扫一遍的高频要点，详细展开见对应小节。

- **不可变性**：state/props 视为只读，更新要生成新引用（展开运算符 / `Immer`）。配合浅比较（`PureComponent`、`React.memo`、`useMemo`）减少重渲染。
- **JSX 本质**：`<div/>` 编译为 `React.createElement(type, props, ...children)`，返回 vnode。React 17+ 支持新 JSX transform，可不显式 `import React`。
- **合成事件**：React 自有事件系统。React 16 委托到 `document`，**React 17 起委托到根容器（root container）**，便于多版本共存。事件对象是合成对象（SyntheticEvent）。
- **setState**：在 React 合成事件/生命周期中异步合并（batch）；**React 18 起默认全场景自动批处理**（含 `setTimeout`、Promise、原生事件）。需要连续读取最新值时用函数式更新 `setX(prev => ...)`。
- **Diff**：同层比较 + `key` 标识 + 组件类型决定复用。`key` 不要用 index（列表增删/排序会错位）。
- **生命周期（class）**：挂载 `constructor → render → componentDidMount`；更新 `render → componentDidUpdate`；卸载 `componentWillUnmount`。`will*` 系列已废弃，改用 `getDerivedStateFromProps` / `getSnapshotBeforeUpdate`。
- **受控 vs 非受控**：受控由 state 驱动（`value + onChange`）；非受控用 `ref` 读 DOM（如文件上传）。
- **Hooks 规则**：只在函数组件顶层调用，不能放进条件/循环/嵌套函数（依赖固定调用顺序）。`useEffect` 依赖数组要诚实声明，返回值用于清理。
- **复用手段**：自定义 Hook（首选）> Render Props > HOC。
- **性能优化**：`React.memo` + `useMemo` / `useCallback`，列表稳定 `key`，路由/大组件 `React.lazy + Suspense` 懒加载。
- **React 18**：`createRoot` 取代 `ReactDOM.render`，自动批处理，并发特性 `startTransition` / `useTransition` / `useDeferredValue`，新增 `useId` / `useSyncExternalStore` / `useInsertionEffect`。
- **`$$typeof`**：React Element 上的 Symbol 标记，防止 JSON 注入伪造元素的 XSS。


## 目录

- [0 如何理解React State不可变性的原则](./01-0-如何理解React-State不可变性的原则.html)
- [1 JSX本质](./02-1-JSX本质.html)
- [2 React合成事件机制](./03-2-React合成事件机制.html)
- [3 setState和batchUpdate机制](./04-3-setState和batchUpdate机制.html)
- [4 组件渲染和更新过程](./05-4-组件渲染和更新过程.html)
- [5 Diff算法相关](./06-5-Diff算法相关.html)
- [6 受控组件与非受控组件](./07-6-受控组件与非受控组件.html)
- [7 组件生命周期](./08-7-组件生命周期.html)
- [8 Portal传送门](./09-8-Portal传送门.html)
- [9 Context](./10-9-Context.html)
- [10 异步组件](./11-10-异步组件.html)
- [11 性能优化](./12-11-性能优化.html)
- [12 高阶组件和Render Props](./13-12-高阶组件和Render-Props.html)
- [13 React Hooks相关](./14-13-React-Hooks相关.html)
- [14 Redux相关](./15-14-Redux相关.html)
- [15 React中Ref几种创建方式](./16-15-React中Ref几种创建方式.html)
- [16 为什么 React 元素有一个 $$typeof 属性](./17-16-为什么-React-元素有一个-$$typeof-属性.html)
- [17 React 如何区分 Class组件 和 Function组件](./18-17-React-如何区分-Class组件-和-Function组件.html)
- [18 react组件的划分业务组件技术组件](./19-18-react组件的划分业务组件技术组件.html)
- [19 React如何进行组件/逻辑复用?](./20-19-React如何进行组件-逻辑复用.html)
- [20 说说你用react有什么坑点](./21-20-说说你用react有什么坑点.html)
- [21 react和vue的区别](./22-21-react和vue的区别.html)
- [22 对React实现原理的理解](./23-22-对React实现原理的理解.html)
- [23 React18新增了哪些特性](./24-23-React18新增了哪些特性.html)
