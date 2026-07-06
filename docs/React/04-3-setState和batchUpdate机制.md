---
title: "setState和batchUpdate机制"
---

# 3 setState和batchUpdate机制

  * `setState`在`react`事件、生命周期中是异步的（在`react`上下文中是异步）；在`setTimeout`、自定义`DOM`事件中是同步的
  * 有时合并（对象形式`setState({})` => 通过`Object.assign`形式合并对象），有时不合并（函数形式`setState((prevState,nextState)=>{})`）

### setState主流程

  * `setState`是否是异步还是同步，看是否能命中`batchUpdate`机制，判断`isBatchingUpdates`
  * 哪些能命中`batchUpdate`机制 
    * 生命周期
    * `react`中注册的事件和它调用的函数
    * 总之在`react`的上下文中
  * 哪些不能命中`batchUpdate`机制 
    * `setTimeout`、`setInterval`等
    * 自定义`DOM`事件
    * 总之不在`react`的上下文中，`react`管不到的

![](/images/s_poetries_work_uploads_2023_02_1ede1982d9eb5a45.webp)

### batchUpdate机制

![setState 批处理：合成事件/生命周期中多次 setState 入队合并，命中 batchUpdate 后一次性更新](/images/diagrams/react-setstate-batch.webp)

![](/images/s_poetries_work_uploads_2023_02_7bb96642c305b9d6.webp)
![](/images/s_poetries_work_uploads_2023_02_e0e5828f54c4d6a1.webp)
```js
    // setState batchUpdate原理模拟
    let isBatchingUpdate = true;
    
    let queue = [];
    let state = {number:0};
    function setState(newSate){
      //state={...state,...newSate}
      // setState异步更新
      if(isBatchingUpdate){
        queue.push(newSate);
      }else{
        // setState同步更新
        state={...state,...newSate}
      }   
    }
    
    // react事件是合成事件，在合成事件中isBatchingUpdate需要设置为true
    // 模拟react中事件点击
    function handleClick(){
      isBatchingUpdate=true; // 批量更新标志
    
      /**我们自己逻辑开始 */
      setState({number:state.number+1});
      setState({number:state.number+1});
      console.log(state); // 0
      setState({number:state.number+1});
      console.log(state); // 0
      /**我们自己逻辑结束 */
    
      state= queue.reduce((newState,action)=>{
        return {...newState,...action}
      },state); 
    
      isBatchingUpdate=false; // 执行结束设置false
    }
    handleClick();
    console.log(state); // 1
```

### transaction事务机制

![](/images/s_poetries_work_uploads_2023_02_4b2c232c6b39d3ac.webp)
![](/images/s_poetries_work_uploads_2023_02_5a0b0ab821739984.webp)
![](/images/s_poetries_work_uploads_2023_02_ad98ab68ffa45716.webp)
```js
    // setState现象演示
    
    import React from 'react'
    
    // 默认没有 state
    class StateDemo extends React.Component {
        constructor(props) {
            super(props)
    
            // 第一，state 要在构造函数中定义
            this.state = {
                count: 0
            }
        }
        render() {
            return <div>
                <p>{this.state.count}</p>
                <button onClick={this.increase}>累加</button>
            </div>
        }
        increase = () => {
            // // 第二，不要直接修改 state ，使用不可变值 ----------------------------
            // // this.state.count++ // 错误
            // this.setState({
            //     count: this.state.count + 1 // SCU
            // })
            // 操作数组、对象的的常用形式
    
            // 第三，setState 可能是异步更新（有可能是同步更新） ----------------------------
            
            // this.setState({
            //     count: this.state.count + 1
            // }, () => {
            //     // 联想 Vue $nextTick - DOM
            //     console.log('count by callback', this.state.count) // 回调函数中可以拿到最新的 state
            // })
            // console.log('count', this.state.count) // 异步的，拿不到最新值
    
            // // setTimeout 中 setState 是同步的
            // setTimeout(() => {
            //     this.setState({
            //         count: this.state.count + 1
            //     })
            //     console.log('count in setTimeout', this.state.count)
            // }, 0)
    
            // 自己定义的 DOM 事件，setState 是同步的。再 componentDidMount 中
    
            // 第四，state 异步更新的话，更新前会被合并 ----------------------------
            
            // 传入对象，会被合并（类似 Object.assign ）。执行结果只一次 +1
            // this.setState({
            //     count: this.state.count + 1
            // })
            // this.setState({
            //     count: this.state.count + 1
            // })
            // this.setState({
            //     count: this.state.count + 1
            // })
            
            // 传入函数，不会被合并。执行结果是 +3
            this.setState((prevState, props) => {
                return {
                    count: prevState.count + 1
                }
            })
            this.setState((prevState, props) => {
                return {
                    count: prevState.count + 1
                }
            })
            this.setState((prevState, props) => {
                return {
                    count: prevState.count + 1
                }
            })
        }
        // bodyClickHandler = () => {
        //     this.setState({
        //         count: this.state.count + 1
        //     })
        //     console.log('count in body event', this.state.count)
        // }
        // componentDidMount() {
        //     // 自己定义的 DOM 事件，setState 是同步的
        //     document.body.addEventListener('click', this.bodyClickHandler)
        // }
        // componentWillUnmount() {
        //     // 及时销毁自定义 DOM 事件
        //     document.body.removeEventListener('click', this.bodyClickHandler)
        //     // clearTimeout
        // }
    }
    
    export default StateDemo
    
    // -------------------------- 我是分割线 -----------------------------
    
    // 不可变值（函数式编程，纯函数） - 数组
    // const list5Copy = this.state.list5.slice()
    // list5Copy.splice(2, 0, 'a') // 中间插入/删除
    // this.setState({
    //     list1: this.state.list1.concat(100), // 追加
    //     list2: [...this.state.list2, 100], // 追加
    //     list3: this.state.list3.slice(0, 3), // 截取
    //     list4: this.state.list4.filter(item => item > 100), // 筛选
    //     list5: list5Copy // 其他操作
    // })
    // // 注意，不能直接对 this.state.list 进行 push pop splice 等，这样违反不可变值
    
    // 不可变值 - 对象
    // this.setState({
    //     obj1: Object.assign({}, this.state.obj1, {a: 100}),
    //     obj2: {...this.state.obj2, a: 100}
    // })
    // // 注意，不能直接对 this.state.obj 进行属性设置，这样违反不可变值
```  
```js
    // setState笔试题考察 下面这道题输出什么
    class Example extends React.Component {
      constructor() {
      super()
      this.state = {
        val: 0
      }
    }
    // componentDidMount中isBatchingUpdate=true setState批量更新
    componentDidMount() {
      // setState传入对象会合并，后面覆盖前面的Object.assign({})
      this.setState({ val: this.state.val + 1 }) // 添加到queue队列中，等待处理 
      console.log(this.state.val)
      // 第 1 次 log
      this.setState({ val: this.state.val + 1 }) // 添加到queue队列中，等待处理
      console.log(this.state.val)
      // 第 2 次 log
      setTimeout(() => {
        // 到这里this.state.val结果等于1了
        // 在原生事件和setTimeout中（isBatchingUpdate=false），setState同步更新，可以马上获取更新后的值
        this.setState({ val: this.state.val + 1 }) // 同步更新
        console.log(this.state.val)
        // 第 3 次 log
        this.setState({ val: this.state.val + 1 }) // 同步更新
        console.log(this.state.val)
        // 第 4 次 log
        }, 0)
      }
      render() {
        return null
      }
    }
    
    // 答案：0, 0, 2, 3
```

**注意**

> 在`React 18`之前，`setState`在`React`的合成事件中是合并更新的，在`setTimeout`的原生事件中是同步按序更新的。例如
```js
    handleClick = () => {
      this.setState({ age: this.state.age + 1 });
      console.log(this.state.age); // 0
      this.setState({ age: this.state.age + 1 });
      console.log(this.state.age); // 0
      this.setState({ age: this.state.age + 1 });
      console.log(this.state.age); // 0
      setTimeout(() => {
        this.setState({ age: this.state.age + 1 });
        console.log(this.state.age); // 2
        this.setState({ age: this.state.age + 1 });
        console.log(this.state.age); // 3
      });
    };
```

> 而在`React 18`中，不论是在合成事件中，还是在宏任务中，都是会合并更新
```js
    function handleClick() {
      setState({ age: state.age + 1 }, onePriority);
      console.log(state.age);// 0
      setState({ age: state.age + 1 }, onePriority);
      console.log(state.age); // 0
      setTimeout(() => {
        setState({ age: state.age + 1 }, twoPriority);
        console.log(state.age); // 1
        setState({ age: state.age + 1 }, twoPriority);
        console.log(state.age); // 1
      });
    }
```

### 传入 setState 函数的第二个参数的作用是什么

> 该函数会在 `setState` 函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成：
```js
    this.setState(
      { username: 'test' },
      () => console.log('setState has finished and the component has re-rendered.')
    )
```  
```js
    this.setState((prevState, props) => {
      return {
        streak: prevState.streak + props.count
      }
    })
```

### 调用 setState 之后发生了什么

> 在代码中调用 `setState` 函数之后，`React`
> 会将传入的参数与之前的状态进行合并，然后触发所谓的调和过程（`Reconciliation`）。经过调和过程，`React`
> 会以相对高效的方式根据新的状态构建 `React` 元素树并且着手重新渲染整个 `UI` 界面。在 `React` 得到元素树之后，`React`
> 会计算出新的树和老的树之间的差异，然后根据差异对界面进行最小化重新渲染。通过 `diff` 算法，`React`
> 能够精确制导哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

  * 在 `setState` 的时候，`React` 会为当前节点创建一个 `updateQueue` 的更新列队。
  * 然后会触发 `reconciliation` 过程，在这个过程中，会使用名为 `Fiber` 的调度算法，开始生成新的 `Fiber` 树， `Fiber` 算法的最大特点是可以做到异步可中断的执行。
  * 然后 `React Scheduler` 会根据优先级高低，先执行优先级高的节点，具体是执行 `doWork` 方法。
  * 在 `doWork` 方法中，`React` 会执行一遍 `updateQueue` 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换 等 `Tag`。
  * 当前节点 `doWork` 完成后，会执行 `performUnitOfWork` 方法获得新节点，然后再重复上面的过程。
  * 当所有节点都 `doWork` 完成后，会触发 `commitRoot` 方法，`React` 进入 `commit` 阶段。
  * 在 `commit` 阶段中，`React` 会根据前面为各个节点打的 `Tag`，一次性更新整个 `dom` 元素

### setState总结

**setState到底是异步还是同步** 有时表现出异步,有时表现出同步

  * `setState`只在合成事件和钩子函数中是“异步”的，在原生事件和`setTimeout` 中都是同步的
  * `setState` 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数`setState(partialState, callback)`中的`callback`拿到更新后的结果
  * `setState` 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和`setTimeout` 中不会批量更新，在“异步”中如果对同一个值进行多次`setState`，`setState`的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时`setState`多个不同的值，在更新时会对其进行合并批量更新

> **事务 (Transaction)** 是 `React` 中的一个调用结构，用于包装一个方法，结构为: `initialize -
> perform(method) - close`。通过事务，可以统一管理一个方法的开始与结束；处于事务流中，表示进程正在执行一些操作

`setState`: `React` 中用于修改状态，更新视图。它具有以下特点:

  * **异步与同步:** `setState`并不是单纯的异步或同步，这其实与调用时的环境相关:
  * 在**合成事件** 和 **生命周期钩子**(除 `componentDidUpdate)` 中，`setState`是"异步"的； 
    * 原因: 因为在`setState`的实现中，有一个判断: 当更新策略正在事务流的执行中时，该组件更新会被推入`dirtyComponents`队列中等待执行；否则，开始执行`batchedUpdates`队列更新； 
      * 在生命周期钩子调用中，更新策略都处于更新之前，组件仍处于事务流中，而`componentDidUpdate`是在更新之后，此时组件已经不在事务流中了，因此则会同步执行；
      * 在合成事件中，`React` 是基于 事务流完成的事件委托机制 实现，也是处于事务流中；
    * 问题: 无法在`setState`后马上从`this.state`上获取更新后的值。
    * 解决: 如果需要马上同步去获取新值，`setState`其实是可以传入第二个参数的。`setState(updater, callback)`，在回调中即可获取最新值；
  * 在 **原生事件** 和 `setTimeout` 中，`setState`是同步的，可以马上获取更新后的值； 
    * 原因: 原生事件是浏览器本身的实现，与事务流无关，自然是同步；而setTimeout是放置于定时器线程中延后执行，此时事务流已结束，因此也是同步；
  * **批量更新** : 在 合成事件 和 生命周期钩子 中，`setState`更新队列时，存储的是 合并状态(`Object.assign`)。因此前面设置的 `key` 值会被后面所覆盖，最终只会执行一次更新；
  * **函数式** : 由于 `Fiber` 及 合并 的问题，官方推荐可以传入 函数 的形式。`setState(fn)`，在`fn`中返回新的`state`对象即可，例如`this.setState((state, props) => newState)`； 
    * 使用函数式，可以用于避免`setState`的批量更新的逻辑，传入的函数将会被 顺序调用；

**注意事项:**

  * `setState` 合并，在 合成事件 和 生命周期钩子 中多次连续调用会被优化为一次；
  * 当组件已被销毁，如果再次调用`setState`，`React` 会报错警告，通常有两种解决办法 
    * 将数据挂载到外部，通过 `props` 传入，如放到 `Redux` 或 父级中；
    * 在组件内部维护一个状态量 (`isUnmounted`)，`componentWillUnmount`中标记为 `true`，在`setState`前进行判断；
