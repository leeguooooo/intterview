---
title: "React setState经典面试题"
---

# 第135题 React setState经典面试题
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
```**答案**  
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

> 补充（现代做法）：本题结论「合成事件/生命周期里批量异步合并、`setTimeout`/原生事件里同步立即更新」是 **React 17 及以前** 的行为。从 **React 18** 开始启用 **自动批处理（automatic batching）**：只要用 `createRoot` 挂载，无论在 `setTimeout`、Promise、原生事件还是任何回调里，多次 `setState` 都会被合并成一次重渲染，所以上面 `setTimeout` 中「同步打印出新值」的现象不再成立。如确实需要立即同步刷新，用 `flushSync(() => setState(...))` 显式退出批处理。函数组件里的 `useState` 同理。
