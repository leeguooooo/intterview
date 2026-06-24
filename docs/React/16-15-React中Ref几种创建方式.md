# 15 React中Ref几种创建方式

`React` 提供了 `Refs`，帮助我们访问 `DOM` 节点或在 `render` 方法中创建的 `React` 元素

### 三种使用 Ref 的方式

**String Refs**
```js
    class App extends React.Component {
        constructor(props) {
            super(props)
        }
        componentDidMount() {
            setTimeout(() => {
                 // 2. 通过 this.refs.xxx 获取 DOM 节点
                 this.refs.textInput.value = 'new value'
            }, 2000)
        }
        render() {
            // 1. ref 直接传入一个字符串
            return (
                <div>
                  <input ref="textInput" value='value' />
                </div>
            )
        }
    }
```

**回调 Refs**
```js
    class App extends React.Component {
        constructor(props) {
            super(props)
        }
        componentDidMount() {
            setTimeout(() => {
                  // 2. 通过实例属性获取 DOM 节点
                  this.textInput.value = 'new value'
            }, 2000)
        }
        render() {
            // 1. ref 传入一个回调函数
            // 该函数中接受 React 组件实例或 DOM 元素作为参数
            // 我们通常会将其存储到具体的实例属性（this.textInput）
            return (
                <div>
                  <input ref={(element) => {
                    this.textInput = element;
                  }} value='value' />
                </div>
            )
        }
    }
```

**createRef**

这是最被推荐使用的方式
```js
    class App extends React.Component {
        constructor(props) {
            super(props)
            // 1. 使用 createRef 创建 Refs
            // 并将 Refs 分配给实例属性 textInputRef，以便在整个组件中引用
            this.textInputRef = React.createRef();
        }
        componentDidMount() {
            setTimeout(() => {
                // 3. 通过 Refs 的 current 属性进行引用
                this.textInputRef.current.value = 'new value'
            }, 2000)
        }
        render() {
            // 2. 通过 ref 属性附加到 React 元素
            return (
                <div>
                  <input ref={this.textInputRef} value='value' />
                </div>
            )
        }
    }
```

### 使用Ref获取组件实例

> `Refs` 除了用于获取具体的 `DOM` 节点外，也可以获取 `Class`
> 组件的实例，当获取到实例后，可以调用其中的方法，从而强制执行，比如动画之类的效果
```js
    class TextInput extends React.Component{
      constructor(props){
        super(props);
        this.inputRef = React.createRef();
      }
      getTextInputFocus = ()=>{
        this.inputRef.current.focus();
      }
      render(){
        return <input ref={this.inputRef}/>
      }
    }
    class Form extends React.Component{
      constructor(props){
        super(props);
        this.textInputRef = React.createRef();
      }
      getFormFocus = ()=>{
        //this.textInputRef.current就会指向TextInput类组件的实例
        this.textInputRef.current.getTextInputFocus();
      }
      render(){
        return (
          <>
            <TextInput ref={this.textInputRef}/>
            <button onClick={this.getFormFocus}>获得焦点</button>
          </>
        )
      }
    }
```

### 函数组件传递forwardRef

  * 我们不能在函数组件上使用 `ref` 属性，因为函数组件没有实例
  * 使用`forwardRef`（`forward`在这里是「传递」的意思）后，就能跨组件传递`ref`。
  * 在例子中，我们将`inputRef`从`Form`跨组件传递到`MyInput`中，并与`input`产生关联
```js
    //  3. 子组件通过 forwardRef 获取 ref，并通过 ref 属性绑定 React 元素
    const MyInput = forwardRef((props, ref) => {
      return <input {...props} ref={ref} />;
    });
    
    function Form() {
      // // 1. 创建 refs
      const inputRef = useRef(null);
    
      function handleClick() {
        // // 4. 使用 this.inputRef.current 获取子组件中渲染的 DOM 节点
        inputRef.current.focus();
      }
    
      return (
        <>
         {/* 2. 传给子组件的 ref 属性 */}
          <MyInput ref={inputRef} />
          <button onClick={handleClick}>
            Focus the input
          </button>
        </>
      );
    }
```

### useImperativeHandle

>
> 除了「限制跨组件传递`ref`」外，还有一种「防止`ref`失控的措施」，那就是`useImperativeHandle`，他的逻辑是这样的：既然`「ref失控」`是由于「使用了不该被使用的`DOM`方法」（比如`appendChild`），那我可以限制「`ref`中只存在可以被使用的方法」。用`useImperativeHandle`修改我们的`MyInput`组件：
```js
    const MyInput = forwardRef((props, ref) => {
      const realInputRef = useRef(null);
      // 函数组件自定义暴露给父组件ref对象，这样更安全避免外部修改删除dom
      useImperativeHandle(ref, () => ({
        focus() {
          realInputRef.current.focus();
        },
      }));
      return <input {...props} ref={realInputRef} />;
    });
```

现在，`Form`组件中通过`inputRef.current`只能取到如下数据结构：
```js
    {
      focus() {
        realInputRef.current.focus();
      },
    }
```

> 就杜绝了`「开发者通过ref取到DOM后，执行不该被使用的API，出现ref失控」`的情况

  * 为了防止错用/滥用导致`ref`失控，React限制`「默认情况下，不能跨组件传递ref」`
  * 为了破除这种限制，可以使用`forwardRef`。
  * 为了减少`ref`对`DOM`的滥用，可以使用`useImperativeHandle`限制`ref`传递的数据结构。
