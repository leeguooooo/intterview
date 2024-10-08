原文链接: [https://interview.poetries.top/principle-docs/vue/18-Vue3%E5%88%9D%E6%8E%A2%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86..html](https://interview.poetries.top/principle-docs/vue/18-Vue3%E5%88%9D%E6%8E%A2%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86..html)

## 源码结构

![image-20210313232042704](/images/s_poetries_work_images_image_20210313232042704.png)

> 源码位置是在`packages`文件件内，实际上源码主要分为两部分，编译器和运行时环境

**1\. 编译器**

  * `compiler-core` 核心编译逻辑
  * `compiler-dom` 针对浏览器平台编译逻辑
  * `compiler-sfc` 针对单文件组件编译逻辑
  * `compiler-ssr` 针对服务端渲染编译逻辑

**2\. 运行时环境**

  * `runtime-core` 运行时核心

  * `runtime-dom` 运行时针对浏览器的逻辑

  * `runtime-test` 浏览器外完成测试环境仿真

  3. `reactivity` 响应式逻辑

  4. `template-explorer` 模板浏览器

  5. vue 代码入口，整合编译器和运行时

  6. `server-renderer`服务器端渲染

  7. `share` 公用方法

## Vue 3初探
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>hello vue3</title>
    <script src="../dist/vue.global.js"></script>
    </head>
    <body>
        <div id='app'><h1>{{message}}</h1></div>
        <script>
    Vue.createApp({
    data: { message: 'Hello Vue 3!' }
    }).mount('#app') </script>
    </body>
    </html>
```

## Composition API

> Composition API字面意思是组合API，它是为了实现**基于函数** 的**逻辑复用机制** 而产生的

### **1\. 数据响应式**
```html
    <div>count: {{ state.count }}</div>
    <script>
        const {
          createApp,
          reactive
    } = Vue;
    // 声明组件 const App = {
    // setup是一个新的组件选项，它是组件内使用Composition API的入口 // 调用时刻是初始化属性确定后，beforeCreate之前
    setup() {
    // 响应化:接收一个对象，返回一个响应式的代理对象 const state = reactive({ count: 0 })
    // 返回对象将和渲染函数上下文合并
            return { state }
          }
    }
    createApp(App).mount('#app') </script>
```

### **2\. 计算属性**
```javascript
    <div>doubleCount: {{doubleCount}}</div>
```

![](/images/s_poetries_work_images_20210314095454.png)

### **3\. 事件处理**
```javascript
    <div @click="add">count: {{ state.count }}</div>
```

![](/images/s_poetries_work_images_20210314095527.png)

### **4\. 侦听器**

![](/images/s_poetries_work_images_20210314095633.png)

### 5\. 引用对象:单个原始值响应化
```javascript
    <div>counter: {{ counter }}</div>
```

![](/images/s_poetries_work_images_20210314095720.png)

### **6\. 体验逻辑组合**
```js
    const { createApp, reactive, onMounted, onUnmounted, toRefs } = Vue
    
    // 鼠标位置侦听 
    function useMouse() {
          // 数据响应化
          const state = reactive({ x: 0, y: 0 })
    
          const update = e => {
                state.x = e.pageX
                state.y = e.pageY 
          }
          onMounted(() => { 
                  window.addEventListener('mousemove', update)
          })
    
          onUnmounted(() => {
             window.removeEventListener('mousemove', update) 
          })
    
         // 转换所有key为响应式数据
        return toRefs(state)
    }
    
    // 事件监测
    function useTime() {
        const state = reactive({ time: new Date() })
        onMounted(() => {
              setInterval(() => { state.time = new Date()
         }, 1000) })
        return toRefs(state)
    }
    
    // 逻辑组合
    const MyComp = {
          template: `
          <div>x: {{ x }} y: {{ y }}</div> <p>time: {{time}}</p>
          `, setup() {
          // 使用鼠标逻辑
          const { x, y } = useMouse() // 使用时间逻辑
          const { time } = useTime() // 返回使用
          return { x, y, time }
       } 
    }
    createApp().mount(MyComp, '#app')
```

**对比mixins，好处显而易见:**

  * `x,y,time`来源清晰
  * 不会与`data`、`props`等命名冲突

## Vue3响应式原理

### **Vue2响应式原理回顾**
```js
    // 1.对象响应化:遍历每个key，定义getter、setter
    // 2.数组响应化:覆盖数组原型方法，额外增加通知逻辑 
    const originalProto = Array.prototype
    const arrayProto = Object.create(originalProto)
    
    ;['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(method => {
        arrayProto[method] = function() {
           originalProto[method].apply(this, arguments)
          notifyUpdate()
        }
    } )
    
    function observe(obj) {
      if (typeof obj !== 'object' || obj == null) {
    return
    }
    // 增加数组类型判断，若是数组则覆盖其原型 
    if (Array.isArray(obj)) {
        Object.setPrototypeOf(obj, arrayProto) 
    } else {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          defineReactive(obj, key, obj[key])
        }
      } 
    }
    
    function defineReactive(obj, key, val) { 
       observe(val) // 解决嵌套对象问题
       Object.defineProperty(obj, key, { 
         get() {
            return val 
        },
        set(newVal) {
          if (newVal !== val) {
             observe(newVal) // 新值是对象的情况 val = newVal
             notifyUpdate()
          } 
       }
    }) 
    }
    
    function notifyUpdate() { 
        console.log('页面更新!')
    }
```

**vue2响应式弊端:**

  * 响应化过程需要递归遍历，消耗较大
  * 新加或删除属性无法监听
  * 数组响应化需要额外实现
  * `Map、Set、Class`等无法响应式
  * 修改语法有限制

### Vue3响应式原理剖析

> vue3使用ES6的Proxy特性来解决这些问题。
```js
    function reactive(obj) {
      if (typeof obj !== 'object' && obj != null) {
          return obj 
    }
    
    // Proxy相当于在对象外层加拦截
    // http://es6.ruanyifeng.com/#docs/proxy 
    const observed = new Proxy(obj, {
       get(target, key, receiver) {
       // Reflect用于执行对象默认操作，更规范、更友好
       // Proxy和Object的方法Reflect都有对应
       // http://es6.ruanyifeng.com/#docs/reflect 
        const res = Reflect.get(target, key, receiver) console.log(`获取${key}:${res}`)
          return res
        },
        set(target, key, value, receiver) {
          const res = Reflect.set(target, key, value, receiver) console.log(`设置${key}:${value}`)
          return res
        },
        deleteProperty(target, key) {
          const res = Reflect.deleteProperty(target, key) 
          console.log(`删除${key}:${res}`)
          return res
       } 
      })
      return observed
    }
```

测试代码
```js
    const state = reactive({
        foo: 'foo',
        bar: { a: 1 } 
    })
    // 1.获取
    state.foo // ok
    // 2.设置已存在属性
    state.foo = 'fooooooo' // ok // 3.设置不存在属性
    state.dong = 'dong' // ok // 4.删除属性
    delete state.dong // ok
```

**1\. 嵌套对象响应式**

> 测试:嵌套对象不能响应
```js
    // 4.设置嵌套对象属性
    react.bar.a = 10 // no ok
```

添加对象类型递归

![](/images/s_poetries_work_images_20210314101206.png)

**2\. 避免重复代理**

重复代理，比如
```js
    reactive(data) // 已代理过的纯对象 
    reactive(react) // 代理对象
```

> 解决方式:将之前代理结果缓存，get时直接使用
```js
    const toProxy = new WeakMap() // 形如obj:observed const toRaw = new WeakMap() // 形如observed:obj
    function reactive(obj) {
      //...
      // 查找缓存，避免重复代理
      if (toProxy.has(obj)) {
      return toProxy.get(obj) 
    }
    if (toRaw.has(obj)) { 
      return obj
    }
     const observed = new Proxy(...)
      // 缓存代理结果 toProxy.set(obj, observed) toRaw.set(observed, obj) return observed
     }
     // 测试效果
     console.log(reactive(data) === state) console.log(reactive(state) === state)
```

**3\. 依赖收集**

建立响应数据key和更新函数之间的对应关系。

![](/images/s_poetries_work_images_20210314101447.png)

**设计**

  * 实现三个函数: effect:将回调函数保存起来备用，立即执行一次回调函数触发它里面一些响应数据的getter
  * track:getter中调用track，把前面存储的回调函数和当前target,key之间建立映射关系
  * trigger:setter中调用trigger，把target,key对应的响应函数都执行一遍

![](/images/s_poetries_work_images_20210314101611.png)

target,key和响应函数映射关系

![](/images/s_poetries_work_images_20210314101631.png)

**实现**

设置响应函数，创建effect函数
```js
    // 保存当前活动响应函数作为getter和effect之间桥梁 
    const effectStack = []
    // effect任务:执行fn并将其入栈 
    function effect(fn) {
      const rxEffect = function() { 
        // 1.捕获可能的异常
      try {
        // 2.入栈，用于后续依赖收集 
        effectStack.push(rxEffect) 
        // 3.运行fn，触发依赖收集 
        return fn()
      } finally {
      // 4.执行结束，出栈 
        effectStack.pop()
      } 
     }
      // 默认执行一次响应函数 
      rxEffect()
      // 返回响应函数
      return rxEffect
    }
```

依赖收集和触发
```js
    function reactive(obj) {
       // ...
      const observed = new Proxy(obj, {
        get(target, key, receiver) {
            // 依赖收集
            track(target, key)
            return isObject(res) ? reactive(res) : res
        },
       set(target, key, value, receiver) {
        // 触发响应函数
        trigger(target, key)
        return res
       }
     })
    }
    
    // 映射关系表，结构大致如下:
    // {target: {key: [fn1,fn2]}}
    let targetMap = new WeakMap()
    
    function track(target, key) {
      // 从栈中取出响应函数
      const effect = effectStack[effectStack.length - 1]
      if (effect) {
         // 获取target对应依赖表
         let depsMap = targetMap.get(target)
         if (!depsMap) {
            depsMap = new Map()
            targetMap.set(target, depsMap)
         }
         // 获取key对应的响应函数集
         let deps = depsMap.get(key)
        if (!deps) {
          deps = new Set()
          depsMap.set(key, deps)
        }
        // 将响应函数加入到对应集合
        if (!deps.has(effect)) {
          deps.add(effect)
        }
      }
    }
    
    // 触发target.key对应响应函数
    function trigger(target, key) {
       // 获取依赖表
       const depsMap = targetMap.get(target)
       if (depsMap) {
          // 获取响应函数集合
         const deps = depsMap.get(key)
         if (deps) {
            // 执行所有响应函数
            deps.forEach(effect => {
               effect()
            })
         }
      }
    }
```

阅读全文

