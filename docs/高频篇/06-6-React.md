# 6 React

### JSX本质

  * `React.createElement` 即`h`函数，返回`vnode`
  * 第一个参数，可能是组件，也可能是`html tag`
  * 组件名，首字母必须是大写（`React`规定）
```js
    // React.createElement写法
    React.createElement('tag', null, [child1,child2])
    React.createElement('tag', props, child1,child2,child3)
    React.createElement(Comp, props, child1,child2,'文本节点')
```  
```jsx
    // jsx基本用法
    <div className="container">
      <p>tet</p>
      <img src={imgSrc} />
    </div>
    
    // 编译后 https://babeljs.io/repl
    React.createElement(
      "div",
      {
        className: "container"
      },
      React.createElement("p", null, "tet"),
      React.createElement("img", {
        src: imgSrc
      })
    );
```  
```jsx
    // jsx style
    const styleData = {fontSize:'20px',color:'#f00'}
    const styleElem = <p style={styleData}>设置style</p>
    
    // 编译后
    const styleData = {
      fontSize: "20px",
      color: "#f00"
    };
    const styleElem = React.createElement(
      "p",
      {
        style: styleData
      },
      "\u8BBE\u7F6Estyle"
    );
```  
```jsx
    // jsx加载组件
    const app = <div>
        <Input submitTitle={onSubmitTitle} />
        <List list={list} />
    </div>
    
    // 编译后
    const app = React.createElement(
      "div",
      null,
      React.createElement(Input, {
        submitTitle: onSubmitTitle
      }),
      React.createElement(List, {
        list: list
      })
    );
```  
```jsx
    // jsx事件
    const eventList = <p onClick={this.clickHandler}>text</p>
    
    // 编译后
    const eventList = React.createElement(
      "p",
      {
        onClick: (void 0).clickHandler
      },
      "text"
    );
```  
```js
    // jsx列表
    const listElem = <ul>
    {
      this.state.list.map((item,index)=>{
        return <li key={index}>index:{index},title:{item.title}</li>
      })
     }
    </ul>
    
    // 编译后
    
    const listElem = React.createElement(
      "ul",
      null,
      (void 0).state.list.map((item, index) => {
        return React.createElement(
          "li",
          {
            key: index
          },
          "index:",
          index,
          ",title:",
          item.title
        );
      })
    );
```

### React合成事件机制

  * `React16`事件绑定到`document`上
  * `React17`事件绑定到`root`组件上，有利于多个`react`版本共存，例如微前端
  * `event`不是原生的，是`SyntheticEvent`合成事件对象
  * 和`Vue`不同，和`DOM`事件也不同

![](/images/s_poetries_work_uploads_2023_02_2ed64c281a747078.webp)

**合成事件图示**

![](/images/s_poetries_work_uploads_2023_02_bd7cd8acbb3cfd85.webp)

**为何需要合成事件**

  * 更好的兼容性和跨平台，如`react native`
  * 挂载到`document`或`root`上，减少内存消耗，避免频繁解绑
  * 方便事件的统一管理（如事务机制）
```js
    // 获取 event
    clickHandler3 = (event) => {
        event.preventDefault() // 阻止默认行为
        event.stopPropagation() // 阻止冒泡
        console.log('target', event.target) // 指向当前元素，即当前元素触发
        console.log('current target', event.currentTarget) // 指向当前元素，假象！！！
    
        // 注意，event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent 组合事件
        console.log('event', event) // 不是原生的 Event ，原生的 MouseEvent
        console.log('event.__proto__.constructor', event.__proto__.constructor)
    
        // 原生 event 如下。其 __proto__.constructor 是 MouseEvent
        console.log('nativeEvent', event.nativeEvent)
        console.log('nativeEvent target', event.nativeEvent.target)  // 指向当前元素，即当前元素触发
        console.log('nativeEvent current target', event.nativeEvent.currentTarget) // 指向 document ！！！
    
        // 1. event 是 SyntheticEvent ，模拟出来 DOM 事件所有能力
        // 2. event.nativeEvent 是原生事件对象
        // 3. 所有的事件，都被挂载到 document 上
        // 4. 和 DOM 事件不一样，和 Vue 事件也不一样
    }
```

### setState和batchUpdate机制

  * `setState`在react事件、生命周期中是异步的（在`react`上下文中是异步）；在`setTimeout`、自定义`DOM`事件中是同步的
  * 有时合并（对象形式`setState({})` => 通过`Object.assign`形式合并对象），有时不合并（函数形式`setState((prevState,nextState)=>{})`）

**核心要点**

1.`setState`主流程

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

  2. `batchUpdate`机制

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

  3. `transaction`事务机制

![](/images/s_poetries_work_uploads_2023_02_4b2c232c6b39d3ac.webp)
![](/images/s_poetries_work_uploads_2023_02_5a0b0ab821739984.webp)
![](/images/s_poetries_work_uploads_2023_02_ad98ab68ffa45716.webp)
```js
    // setState现象演示
    
    import React from 'react'
    
    // 函数组件（后面会讲），默认没有 state
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

> 补充(现代做法)：上面「`setTimeout`/原生事件中 `setState` 同步、不批处理」的结论只适用于 React 17 及更早版本。**React 18 引入了自动批处理(Automatic Batching)**：无论 `setState` 写在事件回调、`setTimeout`、`Promise.then` 还是原生 DOM 事件里，只要使用 `createRoot` 挂载，多次更新都会被合并成一次重渲染。因此在 React 18 下，上面那道经典题的 `setTimeout` 分支会变成批处理，输出由 `0,0,2,3` 变为 `0,0,1,1`。如确需在某处立即同步刷新（极少用），可用 `flushSync(() => setState(...))` 退出批处理。另外函数组件用 `useState`，更新函数式写法 `setCount(c => c + 1)` 才能拿到累积后的最新值。

### 根据jsx写出vnode和render函数
```html
    <!-- jsx -->
    <div className="container">
      <p onClick={onClick} data-name="p1">
        hello <b>{name}</b>
      </p>
      <img src={imgSrc} />
      <MyComponent title={title}></MyComponent>
    </div>
```

**注意**

  * 注意`JSX`中的常量和变量
  * 注意`JSX`中的`HTML tag`和自定义组件
```js
    const vnode = {
      tag: 'div',
      props: {
        className: 'container'
      },
      children: [
        // <p>
        {
          tag: 'p',
          props: {
            dataset: {
              name: 'p1'
            },
            on: {
              click: onClick // 变量
            }
          },
          children: [
            'hello',
            {
              tag: 'b',
              props: {},
              children: [name] // name变量
            }
          ]
        },
        // <img />
        {
          tag: 'img',
          props: {
            src: imgSrc // 变量
          },
          children: [/**无子节点**/]
        },
        // <MyComponent>
        {
          tag: MyComponent, // 变量
          props: {
            title: title, // 变量
          },
          children: [/**无子节点**/]
        }
      ]
    }
```  
```js
    // render函数
    function render() {
      // h(tag, props, children)
      return h('div', {
        props: {
          className: 'container'
        }
      }, [
    
        // p
        h('p', {
          dataset: {
            name: 'p1'
          },
          on: {
            click: onClick
          }
        }, [
          'hello',
          h('b', {}, [name])
        ])
    
        // img
        h('img', {
          props: {
            src: imgSrc
          }
        }, [/**无子节点**/])
    
        // MyComponent
        h(MyComponent, {
          title: title
        }, [/**无子节点**/])
      ]
      )
    }
```

**在react中jsx编译后**
```js
    // 使用https://babeljs.io/repl编译后效果
    
    React.createElement(
      "div",
      {
        className: "container"
      },
      React.createElement(
        "p",
        {
          onClick: onClick,
          "data-name": "p1"
        },
        "hello ",
        React.createElement("b", null, name)
      ),
      React.createElement("img", {
        src: imgSrc
      }),
      React.createElement(MyComponent, {
        title: title
      })
    );
```

### 虚拟DOM（vdom）真的很快吗

  * `virutal DOM`，虚拟`DOM`
  * 用JS对象模拟`DOM`节点数据
  * `vdom`并不快，`JS`直接操作`DOM`才是最快的 
    * 以`vue`为例，`data`变化 => `vnode diff` => 更新`DOM` 肯定是比不过直接操作`DOM`节点快的
  * 但是"数据驱动视图"要有合适的技术方案，不能全部`DOM`重建
  * `dom`就是目前最合适的技术方案（并不是因为它快，而是合适）
  * 在大型系统中，全部更新`DOM`的成本太高，使用`vdom`把更新范围减少到最小

> 并不是所有的框架都在用`vdom`，`svelte`就不用`vdom`

![](/images/s_poetries_work_uploads_2023_01_6632a7a051a60c4c.webp)

### react组件渲染过程

  * `JSX`如何渲染为页面
  * `setState`之后如何更新页面
  * 面试考察全流程

**1.组件渲染过程**

  * 分析 
    * `props`、`state` 变化
    * `render()`生成`vnode`
    * `patch(elem, vnode)` 渲染到页面上（`react`并一定用`patch`）
  * 渲染过程 
    * `setState(newState)` => `newState`存入`pending`队列，判断是否处于`batchUpdate`状态，保存组件于`dirtyComponents`中（可能有子组件） ![](/images/s_poetries_work_uploads_2023_02_1ede1982d9eb5a45.webp)
    * 遍历所有的`dirtyComponents`调用`updateComponent`生成`newVnode`
    * `patch(vnode,newVnode)`

**2.组件更新过程**

  * `patch`更新被分为两个阶段 
    * **reconciliation阶段** ：执行`diff`算法，纯`JS`计算
    * **commit阶段** ：将`diff`结果渲染到`DOM`中
  * 如果不拆分，可能有性能问题 
    * `JS`是单线程的，且和`DOM`渲染共用一个线程
    * 当组件足够复杂，组件更新时计算和渲染都压力大
    * 同时再有`DOM`操作需求（动画、鼠标拖拽等）将卡顿
  * **解决方案Fiber**
    * `reconciliation`阶段拆分为多个子任务
    * `DOM`需要渲染时更新，空闲时恢复在执行计算
    * 通过`window.requestIdleCallback`来判断浏览器是否空闲

### React setState经典面试题
```js
    // setState笔试题考察 下面这道题输出什么
    class Example extends React.Component {
      constructor() {
      super()
      this.state = {
        val: 0
      }
    }
    componentDidMount() {
      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val)
      // 第 1 次 log
      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val)
      // 第 2 次 log
      setTimeout(() => {
        this.setState({ val: this.state.val + 1 }) 
        console.log(this.state.val)
        // 第 3 次 log
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val)
        // 第 4 次 log
        }, 0)
      }
      render() {
        return null
      }
    }
```  
```js
    // 答案
    0
    0
    2
    3
```

  * **关于setState的两个考点**
    * 同步或异步
    * `state`合并或不合并 
      * `setState`传入函数不会合并覆盖
      * `setState`传入对象会合并覆盖`Object.assigin({})`
  * 分析 
    * **默认情况**
      * `state`默认异步更新
      * `state`默认合并后更新（后面的覆盖前面的，多次重复执行不会累加）
    * `setState`在合成事件和生命周期钩子中，是异步更新的
    * **react同步更新，不在react上下文中触发**
      * 在`原生事件`、`setTimeout`、`setInterval`、`promise.then`、`Ajax`回调中，`setState`是同步的，可以马上获取更新后的值 
        * 原生事件如`document.getElementById('test').addEventListener('click',()=>{this.setState({count:this.state.count + 1}})`
      * 原因: 原生事件是浏览器本身的实现，与事务流无关，自然是同步；而`setTimeout`是放置于定时器线程中延后执行，此时事务流已结束，因此也是同步
    * **注意：在react18中不一样**
      * 上述场景，在`react18`中可以异步更新（`Auto Batch`）
      * 需将`ReactDOM.render`替换为`ReactDOM.createRoot`

> 如需要实时获取结果，在回调函数中获取 `setState({count:this.state.count +
> 1},()=>console.log(this.state.count)})`
```js
    // setState原理模拟
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
    }
    handleClick();
    console.log(state); // 1
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
        setState({ age: state.age + 1 }, towPriority);
        console.log(state.age); // 1
        setState({ age: state.age + 1 }, towPriority);
        console.log(state.age); // 1
      });
    }
```  
```js
    // 拓展：setState传入函数不会合并
    class Example extends React.Component {
      constructor() {
      super()
      this.state = {
        val: 0
      }
    }
    componentDidMount() {
      this.setState((prevState,props)=>{
        return {val: prevState.val + 1}
      })
      console.log(this.state.val) // 0
      // 第 1 次 log
      this.setState((prevState,props)=>{ // 传入函数，不会合并覆盖前面的
        return {val: prevState.val + 1}
      })
      console.log(this.state.val) // 0
      // 第 2 次 log
      setTimeout(() => {
        // setTimeout中setState同步执行
        // 到这里this.state.val结果等于2了
        this.setState({ val: this.state.val + 1 }) 
        console.log(this.state.val) // 3
        // 第 3 次 log
        this.setState({ val: this.state.val + 1 })
        console.log(this.state.val) // 4
        // 第 4 次 log
        }, 0)
      }
      render() {
        return null
      }
    }
    // 答案：0 0 3 4 
```  
```js
    // react hooks中打印
    
    function useStateDemo() {
      const [value, setValue] = useState(100)
    
      function clickHandler() {
        // 1.传入常量，state会合并
        setValue(value + 1)
        setValue(value + 1)
        console.log(1, value) // 100
        // 2.传入函数，state不会合并
        setValue(value=>value + 1)
        setValue(value=>value + 1)
        console.log(2, value) // 100
    
        // 3.setTimeout中，React18也开始合并state（之前版本会同步更新、不合并）
        setTimeout(()=>{
          setValue(value + 1)
          setValue(value + 1)
          console.log(3, value) // 100
          setValue(value + 1)
        })
    
        // 4.同理 setTimeout中，传入函数不合并
        setTimeout(()=>{
          setValue(value => value + 1)
          setValue(value => value + 1)
          console.log(4, value) // 100
        })
      }
      return (
        <button onClick={clickHandler}>点击 {value}</button>
      )
    }
```

**连环问：setState是宏任务还是微任务**

  * **setState本质是同步的**
    * `setState`是同步的，不过让`react`做成异步更新的样子而已 
      * 如果`setState`是微任务，就不应该在`promise.then`微任务之前打印出来（`promise then`微任务先注册）
    * 因为要考虑性能，多次`state`修改，只进行一次`DOM`渲染
    * 日常所说的“异步”是不严谨的，但沟通成本低
  * **总结**
    * `setState`是同步执行，`state`都是同步更新（只是我们日常把`setState`当异步来处理）
    * 在微任务`promise.then`之前，`state`已经计算完了
    * 同步，不是微任务或宏任务
```js
    import React from 'react'
    
    class Example extends React.Component {
      constructor() {
        super()
        this.state = {
          val: 0
        }
      }
    
      clickHandler = () => {
        // react事件中 setState异步执行
        console.log('--- start ---')
    
        Promise.resolve().then(() => console.log('promise then') /* callback */)
    
        // “异步”
        this.setState(
          { val: this.state.val + 1 },
          () => { console.log('state callback...', this.state) } // callback
        )
    
        console.log('--- end ---')
    
        // 结果: 
        // start 
        // end
        // state callback {val:1} 
        // promise then 
    
        // 疑问？
        // promise then微任务先注册的，按理应该先打印promise then再到state callback
        // 因为：setState本质是同步的，不过让react做成异步更新的样子而已
        // 因为要考虑性能，多次state修改，只进行一次DOM渲染
      }
    
      componentDidMount() {
        setTimeout(() => {
          // setTimeout中setState是同步更新
          console.log('--- start ---')
    
          Promise.resolve().then(() => console.log('promise then'))
    
          this.setState(
            { val: this.state.val + 1 }
          )
          console.log('state...', this.state)
      
          console.log('--- end ---')
        })
    
        // 结果: 
        // start 
        // state {val:1} 
        // end
        // promise then 
      }
    
      render() {
        return <p id="p1" onClick={this.clickHandler}>
          setState demo: {this.state.val}
        </p>
      }
    }
```

### React useEffect闭包陷阱问题

> 问：按钮点击三次后，定时器输出什么？
```js
    function useEffectDemo() {
      const [value,setValue] = useState(0)
    
      useEffect(()=>{
        setInterval(()=>{
          console.log(value)
        },1000)
      }, [])
    
      const clickHandler = () => {
        setValue(value + 1)
      }
    
      return (
        <div>
          value: {value} <button onClick={clickHandler}>点击</button>
        </div>
      )
    }
```

> 答案一直是`0`
> `useEffect`闭包陷阱问题，`useEffect`依赖是空的，只会执行一次。`setInterval`中的`value`就只会获取它之前的变量。而`react`有个特点，每次`value`变化都会重新执行`useEffectDemo`这个函数。点击了三次函数会执行三次，三次过程中每个函数中`value`都不一样，`setInterval`获取的永远是第一个函数里面的`0`
```js
    // 追问：怎么才能打印出3？
    
    function useEffectDemo() {
      const [value,setValue] = useState(0)
    
      useEffect(()=>{
        const timer = setInterval(()=>{
          console.log(value) // 3
        },1000)
        return ()=>{
          clearInterval(timer) // value变化会导致useEffectDemo函数多次执行，多次执行需要清除上一次的定时器，否则多次注册定时器
        }
      }, [value]) // 这里增加依赖项，每次依赖变化都会重新执行
    
      const clickHandler = () => {
        setValue(value + 1)
      }
    
      return (
        <div>
          value: {value} <button onClick={clickHandler}>点击</button>
        </div>
      )
    }
```

### Vue React diff 算法有什么区别

**diff 算法**

  * `Vue React diff` 不是对比文字，而是 `vdom` 树，即 `tree diff`
  * 传统的 `tree diff` 算法复杂度是 `O(n^3)` ，算法不可用。

![](/images/s_poetries_work_uploads_2023_02_98d2444a4b7995d9.webp)

**优化**

> `Vue React` 都是用于网页开发，基于 `DOM` 结构，对 `diff` 算法都进行了优化（或者简化）

  * 只在同一层级比较，不跨层级（`DOM` 结构的变化，很少有跨层级移动）
  * `tag` 不同则直接删掉重建，不去对比内部细节（`DOM` 结构变化，很少有只改外层，不改内层）
  * 同一个节点下的子节点，通过 `key` 区分

> 最终把时间复杂度降低到 `O(n)` ，生产环境下可用。这一点 `Vue React` 都是相同的。

![](/images/s_poetries_work_uploads_2023_02_49204f33f8e7a350.webp)

**React diff 特点 - 仅向右移动**

> 比较子节点时，仅向右移动，不向左移动。

![](/images/s_poetries_work_uploads_2023_02_7e0177856595febb.webp)

**Vue2 diff 特点 - 双端比较**

![](/images/s_poetries_work_uploads_2023_02_dc386faff0955e94.webp)

定义四个指针，分别比较

  * `oldStartNode` 和 `newStartNode` 头头
  * `oldStartNode` 和 `newEndNode` 头尾
  * `oldEndNode` 和 `newStartNode` 尾头
  * `oldEndNode` 和 `newEndNode` 尾尾

> 然后指针继续向中间移动，直到指针汇合

**Vue3 diff 特点 - 最长递增子序列**

> 例如数组 `[3，5，7，1，2，8]` 的最长递增子序列就是 `[3，5，7，8 ]` 。这是一个专门的算法。

![](/images/s_poetries_work_uploads_2023_02_05879e82f60fa7af.webp)

**算法步骤**

  * 通过“前-前”比较找到开始的不变节点 `[A, B]`
  * 通过“后-后”比较找到末尾的不变节点 `[G]`
  * 剩余的有变化的节点 `[F, C, D, E, H]`
    * 通过 `newIndexToOldIndexMap` 拿到 `oldChildren` 中对应的 `index` `[5, 2, 3, 4, -1]` （`-1` 表示之前没有，要新增）
    * 计算**最长递增子序列** 得到 `[2, 3, 4]` ，对应的就是 `[C, D, E]` ，即这些节点可以不变
    * 剩余的节点，根据 `index` 进行新增、删除

> 该方法旨在尽量减少 `DOM` 的移动，`达到最少的DOM操作`。

**总结**

  * `React diff` 特点 - 仅向右移动
  * `Vue2 diff` 特点 - `updateChildren`双端比较
  * `Vue3 diff` 特点 - `updateChildren`增加了最长递增子序列，更快 
    * `Vue3`增加了`patchFlag`、静态提升、函数缓存等

**连环问：diff 算法中 key 为何如此重要**

无论在 `Vue` 还是 React 中，`key` 的作用都非常大。以 `React` 为例，是否使用 `key` 对内部 `DOM` 变化影响非常大。

![](/images/s_poetries_work_uploads_2023_02_a68a7962c0801e70.webp)
```html
    <ul>
      <li v-for="(index, num) in nums" :key="index">
        {{num}}
      </li>
    </ul>
```  
```jsx
    const todoItems = todos.map((todo) =>
      <li key={todo.id}>
        {todo.text}
      </li>
    )
```

### 如何统一监听React组件报错

  * **ErrorBoundary组件**
    * 在`react16`版本之后，增加了`ErrorBoundary`组件
    * 监听所有`下级组件`报错，可降级展示`UI`
    * 只监听组件渲染时报错，不监听`DOM`事件错误、异步错误 
      * `ErrorBoundary`没有办法监听到点击按钮时候的在`click`的时候报错
      * 只能监听组件从一开始渲染到渲染成功这段时间报错，渲染成功后在怎么操作产生的错误就不管了
      * 可用`try catch`或者`window.onerror`（二选一）
    * 只在`production`环境生效(需要打包之后查看效果)，`dev`会直接抛出错误
  * **总结**
    * `ErrorBoundary`监听组件渲染报错
    * 事件报错使用`try catch`或`window.onerror`
    * 异步报错使用`window.onerror`
```js
    // ErrorBoundary.js
    
    import React from 'react'
    
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          error: null // 存储当前的报错信息
        }
      }
      static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        console.info('getDerivedStateFromError...', error)
        return { error } // return的信息会等于this.state的信息
      }
      componentDidCatch(error, errorInfo) {
        // 统计上报错误信息
        console.info('componentDidCatch...', error, errorInfo)
      }
      render() {
        if (this.state.error) {
          // 提示错误
          return <h1>报错了</h1>
        }
    
        // 没有错误，就渲染子组件
        return this.props.children
      }
    }
```  
```js
    // index.js 中使用
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';
    import ErrorBoundary from './ErrorBoundary'
    
    ReactDOM.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
      document.getElementById('root')
    );
```

### 在实际工作中，你对React做过哪些优化

  * **修改CSS模拟v-show**  
```js
        // 原始写法
    {!flag && <MyComonent style={{display:'none'}} />}
    {flag && <MyComonent />}
    
    // 模拟v-show
    {<MyComonent style={{display:flag ? 'block' : 'none'}} />}
```

  * **循环使用key**
    * `key`不要用`index`
  * **使用Flagment或 <></>空标签包裹减少多个层级组件的嵌套**
  * **jsx中不要定义函数** ：`JSX`会被频繁执行的  
```js
        // bad 
    // react中的jsx被频繁执行（state更改）应该避免函数被多次新建
    <button onClick={()=>{}}>点击</button>
    // goods
    function useButton() {
      const handleClick = ()=>{}
      return <button onClick={handleClick}>点击</button>
    }
```

  * **使用shouldComponentUpdate**
    * 判断组件是否需要更新
    * 或者使用`React.PureComponent`比较`props`第一层属性
    * 函数组件使用`React.memo(comp, fn)`包裹 `function fn(prevProps,nextProps) {// 自己实现对比，像shouldComponentUpdate}`
  * **Hooks缓存数据和函数**
    * `useCallback`: 缓存回调函数，避免传入的回调每次都是新的函数实例而导致依赖组件重新渲染，具有性能优化的效果
    * `useMemo`: 用于缓存传入的 `props`，避免依赖的组件每次都重新渲染
  * **使用异步组件**  
```js
        import React,{lazy,Suspense} from 'react'
    const OtherComp = lazy(/**webpackChunkName:'OtherComp'**/ ()=>import('./otherComp'))
    
    function MyComp(){
      return (
        <Suspense fallback={<div>loading...</div>}>
          <OtherComp />
        </Suspense>
      )
    }
```

  * **路由懒加载**  
```js
        import React,{lazy,Suspense} from 'react'
    import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
    
    const Home = lazy(/**webpackChunkName:'h=Home'**/()=>import('./Home'))
    const List = lazy(/**webpackChunkName:'List'**/()=>import('./List'))
    
    const App = ()=>(
      <Router>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/list' component={List} />
          </Switch>
        </Suspense>
      </Router>
    )
```

  * **使用SSR** ：`Next.js`

**连环问：你在使用React时遇到过哪些坑**

  * **自定义组件的名称首字母要大写**
```js
        // 原生html组件
    <input />
    
    // 自定义组件
    <Input />
```

  * **JS关键字的冲突**
```js
        // for改成htmlFor，class改成className
    <label htmlFor="input-name" className="label">
      用户名 <input id="username" />
    </label>
```

  * **JSX数据类型**
```js
        // correct
    <Demo flag={true} />
    // error
    <Demo flag="true" />
```

  * **setState不会马上获取最新的结果**

    * 如需要实时获取结果，在回调函数中获取 `setState({count:this.state.count + 1},()=>console.log(this.state.count)})`
    * `setState`在合成事件和生命周期钩子中，是异步更新的
    * 在**原生事件** 和`setTimeout`中，`setState`是同步的，可以马上获取更新后的值；
    * 原因: 原生事件是浏览器本身的实现，与事务流无关，自然是同步；而`setTimeout`是放置于定时器线程中延后执行，此时事务流已结束，因此也是同步；
```js
        // setState原理模拟
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
    }
    handleClick();
    console.log(state); // 1
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
      this.setState({ val: this.state.val + 1 }) // 添加到queue队列中，等待处理
      console.log(this.state.val)
      // 第 1 次 log
      this.setState({ val: this.state.val + 1 }) // 添加到queue队列中，等待处理
      console.log(this.state.val)
      // 第 2 次 log
      setTimeout(() => {
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

### React真题

**1\. 函数组件和class组件区别**

  * 纯函数，输入`props`，输出`JSX`
  * 没有实例、没有生命周期、没有`state`
  * 不能拓展其他方法

**2\. 什么是受控组件**

  * 表单的值，受到`state`控制
  * 需要自行监听`onChange`，更新`state`
  * 对比非受控组件

**3\. 何时使用异步组件**

  * 加载大组件
  * 路由懒加载

**4\. 多个组件有公共逻辑如何抽离**

  * `HOC`高阶组件
  * `Render Props`
  * `React Hooks`

**5\. react router如何配置懒加载**

![](/images/s_poetries_work_uploads_2023_02_bd495d045b61d7bc.webp)

### React和Vue的区别（常考）

**共同**

  * 都支持组件化
  * 都是数据驱动视图
  * 都用`vdom`操作`DOM`

**区别**

  * `React`使用`JSX`拥抱`JS`，`Vue`使用模板拥抱`HTML`
  * `React`函数式编程，`Vue`是声明式编程
  * `React`更多的是自力更生，`Vue`把你想要的都给你

**当比较React和Vue时，以下是一些详细的区别：**

  1. 构建方式：

  * React：React是一个用于构建用户界面的JavaScript库。它使用JSX语法，将组件的结构和逻辑放在一起，通过组件的嵌套和组合来构建应用程序。
  * Vue：Vue是一个渐进式框架，可以用于构建整个应用程序或仅用于特定页面的一部分。它使用模板语法，将HTML模板和JavaScript代码分离，通过指令和组件来构建应用程序。

  2. 学习曲线：

  * React：React相对来说更加灵活和底层，需要对JavaScript和JSX有一定的了解。它提供了更多的自由度和灵活性，但也需要更多的学习和理解。
  * Vue：Vue则更加简单和易于上手，它使用了模板语法和一些特定的概念，使得学习和使用起来更加直观。Vue的文档和教程也非常友好和详细。

  3. 数据绑定：

  * React：React使用单向数据流，通过props将数据从父组件传递到子组件。如果需要在子组件中修改数据，需要通过回调函数来实现。
  * Vue：Vue支持双向数据绑定，可以通过v-model指令实现数据的双向绑定。这使得在Vue中处理表单和用户输入更加方便。

  4. 组件化开发：

  * React：React的组件化开发非常灵活，组件可以通过props接收数据，通过state管理内部状态。React还提供了生命周期方法，可以在组件的不同阶段执行特定的操作。
  * Vue：Vue的组件化开发也非常强大，组件可以通过props接收数据，通过data属性管理内部状态。Vue还提供了生命周期钩子函数，可以在组件的不同阶段执行特定的操作。

  5. 生态系统：

  * React：React拥有庞大的生态系统，有许多第三方库和工具可供选择。React还有一个强大的社区支持，提供了大量的教程、文档和示例代码。
  * Vue：Vue的生态系统也很活跃，虽然相对React来说规模较小，但也有许多第三方库和工具可供选择。Vue的文档和教程也非常友好和详细。

  6. 性能：

  * React：React通过虚拟DOM（Virtual DOM）和高效的diff算法来提高性能。它只更新需要更新的部分，减少了对实际DOM的操作次数。
  * Vue：Vue也使用虚拟DOM来提高性能，但它采用了更细粒度的观察机制，可以精确追踪数据的变化，从而减少不必要的更新操作。
