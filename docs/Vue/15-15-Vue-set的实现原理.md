---
title: "Vue set的实现原理"
---

# 15 Vue.set的实现原理

  * 给对象和数组本身都增加了`dep`属性
  * 当给对象新增不存在的属性则触发对象依赖的`watcher`去更新
  * 当修改数组索引时，我们调用数组本身的`splice`去更新数组（数组的响应式原理就是重新了`splice`等方法，调用`splice`就会触发视图更新）

**基本使用**

> 以下方法调用会改变原始数组：`push()`, `pop()`, `shift()`, `unshift()`, `splice()`,
> `sort()`, `reverse()`,`Vue.set( target, key, value )`

  * 调用方法：`Vue.set(target, key, value )`
    * `target`：要更改的数据源(可以是对象或者数组)
    * `key`：要更改的具体数据
    * `value` ：重新赋的值
```html
    <div id="app">{{user.name}} {{user.age}}</div>
    <div id="app"></div>
    <script>
        // 1. 依赖收集的特点：给每个属性都增加一个dep属性，dep属性会进行收集，收集的是watcher
        // 2. vue会给每个对象也增加一个dep属性
        const vm = new Vue({
            el: '#app',
            data: { // vm._data  
                user: {name:'poetry'}
            }
        });
        // 对象的话：调用defineReactive在user对象上定义一个age属性，增加到响应式数据中，触发对象本身的watcher，ob.dep.notify()更新 
        // 如果是数组 通过调用 splice方法，触发视图更新
        vm.$set(vm.user, 'age', 20); // 不能给根属性添加，因为给根添加属性 性能消耗太大，需要做很多处理
    
        // 修改肯定是同步的 -> 更新都是一步的  queuewatcher
    </script>
```

**相关源码**
```js
    // src/core/observer/index.js 44
    export class Observer { // new Observer(value)
      value: any;
      dep: Dep;
      vmCount: number; // number of vms that have this object as root $data
    
      constructor (value: any) {
        this.value = value
        this.dep = new Dep() // 给所有对象类型增加dep属性
      }
    }
```  
```js
    // src/core/observer/index.js 201
    export function set (target: Array<any> | Object, key: any, val: any): any {
      // 1.是开发环境 target 没定义或者是基础类型则报错
      if (process.env.NODE_ENV !== 'production' &&
        (isUndef(target) || isPrimitive(target))
      ) {
        warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
      }
      // 2.如果是数组 Vue.set(array,1,100); 调用我们重写的splice方法 (这样可以更新视图)
      if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        // 利用数组的splice变异方法触发响应式  
        target.splice(key, 1, val)
        return val
      }
      // 3.如果是对象本身的属性，则直接添加即可
      if (key in target && !(key in Object.prototype)) {
        target[key] = val // 直接修改属性值  
        return val
      }
      // 4.如果是Vue实例 或 根数据data时 报错,（更新_data 无意义）
      const ob = (target: any).__ob__
      if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn(
          'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
        )
        return val
      }
      // 5.如果不是响应式的也不需要将其定义成响应式属性
      if (!ob) {
        target[key] = val
        return val
      }
      // 6.将属性定义成响应式的
      defineReactive(ob.value, key, val)
      // 通知视图更新
      ob.dep.notify()
      return val
    }
```

**我们阅读以上源码可知，vm.$set 的实现原理是：**

  * **如果目标是数组** ，直接使用数组的 `splice` 方法触发响应式；
  * **如果目标是对象** ，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 `defineReactive` 方法进行响应式处理（ `defineReactive` 方法就是 `Vue` 在初始化对象时，给对象属性采用 `Object.defineProperty` 动态添加 `getter` 和 `setter` 的功能所调用的方法）
