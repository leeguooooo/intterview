# 14 Redux相关

### 简述flux 思想

> `Flux` 的最大特点，就是数据的"单向流动"。

  * 用户访问 `View`
  * `View`发出用户的 `Action`
  * `Dispatcher` 收到`Action`，要求 `Store` 进行相应的更新
  * `Store` 更新后，发出一个`"change"`事件
  * `View` 收到`"change"`事件后，更新页面

### redux中间件

> 中间件提供第三方插件的模式，自定义拦截 `action` -> `reducer` 的过程。变为 `action` -> `middlewares`
> -> `reducer`。这种机制可以让我们改变数据流，实现如异步`action` ，`action` 过滤，日志输出，异常报告等功能

  * `redux-logger`：提供日志输出
  * `redux-thunk`：处理异步操作
  * `redux-promise`：处理异步操作，`actionCreator`的返回值是`promise`

### redux有什么缺点

  * 一个组件所需要的数据，必须由父组件传过来，而不能像`flux`中直接从`store`取。
  * 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新`render`，可能会有效率影响，或者需要写复杂的`shouldComponentUpdate`进行判断。

### Redux设计理念

**为什么要用redux**

>
> 在`React`中，数据在组件中是单向流动的，数据从一个方向父组件流向子组件（通过`props`）,所以，两个非父子组件之间通信就相对麻烦，`redux`的出现就是为了解决`state`里面的数据问题

**Redux设计理念**

> `Redux`是将整个应用状态存储到一个地方上称为`store`,里面保存着一个状态树`store
> tree`,组件可以派发(`dispatch`)行为(`action`)给`store`,而不是直接通知其他组件，组件内部通过订阅`store`中的状态`state`来刷新自己的视图

![](/images/s_poetries_work_gitee_2020_07_68.webp)

**Redux三大原则**

  * 唯一数据源

> 整个应用的state都被存储到一个状态树里面，并且这个状态树，只存在于唯一的store中

  * 保持只读状态

> `state`是只读的，唯一改变`state`的方法就是触发`action`，`action`是一个用于描述以发生时间的普通对象

  * 数据改变只能通过纯函数来执行

> 使用纯函数来执行修改，为了描述`action`如何改变`state`的，你需要编写`reducers`

**Redux源码**
```js
    let createStore = (reducer) => {
        let state;
        //获取状态对象
        //存放所有的监听函数
        let listeners = [];
        let getState = () => state;
        //提供一个方法供外部调用派发action
        let dispath = (action) => {
            //调用管理员reducer得到新的state
            state = reducer(state, action);
            //执行所有的监听函数
            listeners.forEach((l) => l())
        }
        //订阅状态变化事件，当状态改变发生之后执行监听函数
        let subscribe = (listener) => {
            listeners.push(listener);
        }
        dispath();
        return {
            getState,
            dispath,
            subscribe
        }
    }
    let combineReducers=(renducers)=>{
        //传入一个renducers管理组，返回的是一个renducer
        return function(state={},action={}){
            let newState={};
            for(var attr in renducers){
                newState[attr]=renducers[attr](state[attr],action)
    
            }
            return newState;
        }
    }
    export {createStore,combineReducers};
```

### Redux怎么实现dispstch一个函数

> 以`redux-thunk`中间件作为例子，下面就是`thunkMiddleware`函数的代码
```js
    // 部分转为ES5代码，运行middleware函数会返回一个新的函数，如下：
    return ({ dispatch, getState }) => {
        // next实际就是传入的dispatch
        return function (next) {
            return function (action) {
                // redux-thunk核心
                if (typeof action === 'function') { 
                    return action(dispatch, getState, extraArgument);
                }
                return next(action);
            };
        };
    }
```

> `redux-thunk`库内部源码非常的简单，允许`action`是一个函数，同时支持参数传递，否则调用方法不变

  * `redux`创建`Store`：通过`combineReducers`函数合并`reducer`函数，返回一个新的函数`combination`（这个函数负责循环遍历运行`reducer`函数，返回全部`state`）。将这个新函数作为参数传入`createStore`函数，函数内部通过dispatch，初始化运行传入的`combination`，state生成，返回store对象
  * `redux`中间件：`applyMiddleware`函数中间件的主要目的就是修改`dispatch`函数，返回经过中间件处理的新的`dispatch`函数
  * `redux`使用：实际就是再次调用循环遍历调用`reducer`函数，更新`state`

### connect高级组件原理

  * 首先`connect`之所以会成功，是因为`Provider`组件：
  * 在原应用组件上包裹一层，使原来整个应用成为`Provider`的子组件 接收`Redux`的`store`作为`props`，通过`context`对象传递给子孙组件上的`connect`

> `connect`做了些什么。它真正连接 `Redux` 和 `React`，它包在我们的容器组件的外一层，它接收上面 `Provider` 提供的
> `store` 里面的`state` 和 `dispatch`，传给一个构造函数，返回一个对象，以属性形式传给我们的容器组件
>
>   *
> `connect`是一个高阶函数，首先传入`mapStateToProps`、`mapDispatchToProps`，然后返回一个生产`Component`的函数(`wrapWithConnect`)，然后再将真正的`Component`作为参数传入`wrapWithConnect`，这样就生产出一个经过包裹的`Connect`组件，
>

**该组件具有如下特点**

  * 通过`props.store`获取祖先`Component`的`store props`包括`stateProps`、`dispatchProps`、`parentProps`,合并在一起得到`nextState`，作为`props`传给真正的`Component componentDidMount`时，添加事件`this.store.subscribe(this.handleChange)`，实现页面交互
  * `shouldComponentUpdate`时判断是否有避免进行渲染，提升页面性能，并得到`nextState` `componentWillUnmount`时移除注册的事件`this.handleChange`

> 由于`connect`的源码过长，我们只看主要逻辑
```js
    export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
      return function wrapWithConnect(WrappedComponent) {
        class Connect extends Component {
          constructor(props, context) {
            // 从祖先Component处获得store
            this.store = props.store || context.store
            this.stateProps = computeStateProps(this.store, props)
            this.dispatchProps = computeDispatchProps(this.store, props)
            this.state = { storeState: null }
            // 对stateProps、dispatchProps、parentProps进行合并
            this.updateState()
          }
          shouldComponentUpdate(nextProps, nextState) {
            // 进行判断，当数据发生改变时，Component重新渲染
            if (propsChanged || mapStateProducedChange || dispatchPropsChanged) {
              this.updateState(nextProps)
              return true
            }
            componentDidMount() {
              // 改变Component的state
              this.store.subscribe(() = {
                this.setState({
                  storeState: this.store.getState()
                })
              })
            }
            render() {
              // 生成包裹组件Connect
              return (
                <WrappedComponent {...this.nextState} />
              )
            }
          }
          Connect.contextTypes = {
            store: storeShape
          }
          return Connect;
        }
      }
```

### Dva工作原理

> 集成`redux+redux-saga`

**工作原理**

> 改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个
> `action`，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为（副作用）会先触发 `Effects` 然后流向
> `Reducers` 最终改变 `State`
