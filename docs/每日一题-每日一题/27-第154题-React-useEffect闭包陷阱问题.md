---
title: "React useEffect闭包陷阱问题"
---

# 第154题 React useEffect闭包陷阱问题

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
```**答案**

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
