# 14 computed和watch相关

### computed和watch区别

  1. 当页面中有某些数据依赖其他数据进行变动的时候，可以使用计算属性`computed`

> `Computed`本质是一个具备缓存的`watcher`，依赖的属性发生变化就会更新视图。
> 适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理

![](/images/s_poetries_work_gitee_2020_01_25.png)
```jsx
    <template>{{fullName}}</template>
    export default {
        data(){
            return {
                firstName: 'zhang',
                lastName: 'san',
            }
        },
        computed:{
            fullName: function(){
                return this.firstName + ' ' + this.lastName
            }
        }
    }
```

  2. `watch`用于观察和监听页面上的vue实例，如果要在数据变化的同时进行异步操作或者是比较大的开销，那么`watch`为最佳选择

>
> `Watch`没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。当我们需要深度监听对象中的属性时，可以打开`deep：true`选项，这样便会对对象中的每一项进行监听。这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用`unWatch`手动注销

![](/images/s_poetries_work_gitee_2020_01_26.png)
```js
    <template>{{fullName}}</template>
    export default {
        data(){
            return {
                firstName: 'zhang',
                lastName: 'san',
                fullName: 'zhang san'
            }
        },
        watch:{
            firstName(val) {
                this.fullName = val + ' ' + this.lastName
            },
            lastName(val) {
                this.fullName = this.firstName + ' ' + val
            }
        }
    }
```

**computed:**

  * `computed`是计算属性,也就是计算值,它更多用于计算值的场景
  * `computed`具有缓存性,`computed`的值在`getter`执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取`computed`的值时才会重新调用对应的`getter`来计算
  * `computed`适用于计算比较消耗性能的计算场景

**watch:**

  * 更多的是「观察」的作用,类似于某些数据的监听回调,用于观察`props` `$emit`或者本组件的值,当数据变化时来执行回调进行后续操作
  * 无缓存性，页面重新渲染时值不变化也会执行

**小结:**

  * `computed`和`watch`都是基于`watcher`来实现的
  * `computed`属性是具备缓存的，依赖的值不发生变化，对其取值时计算属性方法不会重新执行
  * `watch`是监控值的变化，当值发生变化时调用其对应的回调函数
  * 当我们要进行数值计算,而且依赖于其他数据，那么把这个数据设计为`computed`
  * 如果你需要在某个数据变化时做一些事情，使用`watch`来观察这个数据变化

回答范例

**思路分析**

  * 先看`computed`, `watch`两者定义，列举使用上的差异
  * 列举使用场景上的差异，如何选择
  * 使用细节、注意事项
  * `vue3`变化

`computed`特点：具有响应式的返回值
```js
    const count = ref(1)
    const plusOne = computed(() => count.value + 1)
```

`watch`特点：侦测变化，执行回调
```js
    const state = reactive({ count: 0 })
    watch(
      () => state.count,
      (count, prevCount) => {
        /* ... */
      }
    )
```

**回答范例**

  1. 计算属性可以从组件数据派生出新数据，最常见的使用方式是设置一个函数，返回计算之后的结果，`computed`和`methods`的差异是它具备缓存性，如果依赖项不变时不会重新计算。侦听器可以侦测某个响应式数据的变化并执行副作用，常见用法是传递一个函数，执行副作用，watch没有返回值，但可以执行异步操作等复杂逻辑
  2. 计算属性常用场景是简化行内模板中的复杂表达式，模板中出现太多逻辑会是模板变得臃肿不易维护。侦听器常用场景是状态变化之后做一些额外的DOM操作或者异步操作。选择采用何用方案时首先看是否需要派生出新值，基本能用计算属性实现的方式首选计算属性.
  3. 使用过程中有一些细节，比如计算属性也是可以传递对象，成为既可读又可写的计算属性。`watch`可以传递对象，设置`deep`、`immediate`等选项
  4. `vue3`中`watch`选项发生了一些变化，例如不再能侦测一个点操作符之外的字符串形式的表达式； `reactivity API`中新出现了`watch`、`watchEffect`可以完全替代目前的`watch`选项，且功能更加强大

基本使用
```js
    // src/core/observer:45;
    
    // 渲染watcher  /  computed watcher  /  watch
    const vm = new Vue({
        el: '#app',
        data: {
            firstname:'张',
            lastname:'三'
        },
        computed:{ // watcher  =>   firstname lastname
            // computed 只有取值时才执行
    
            // Object.defineProperty .get
            fullName(){ // firstName lastName 会收集fullName计算属性
                return this.firstname + this.lastname
            }
        },
        watch:{
            firstname(newVal,oldVal){
                console.log(newVal)
            }
        }
    });
    
    setTimeout(() => {
        debugger;
        vm.firstname = '赵'
    }, 1000);
```

相关源码
```js
    // 初始化state
    function initState (vm: Component) {
      vm._watchers = []
      const opts = vm.$options
      if (opts.props) initProps(vm, opts.props)
      if (opts.methods) initMethods(vm, opts.methods)
      if (opts.data) {
        initData(vm)
      } else {
        observe(vm._data = {}, true /* asRootData */)
      }
    
      // 初始化计算属性
      if (opts.computed) initComputed(vm, opts.computed) 
    
      // 初始化watch
      if (opts.watch && opts.watch !== nativeWatch) { 
        initWatch(vm, opts.watch)
      }
    }
    
    // 计算属性取值函数
    function createComputedGetter (key) {
      return function computedGetter () {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
          if (watcher.dirty) { // 如果值依赖的值发生变化，就会进行重新求值
            watcher.evaluate(); // this.firstname lastname
          }
          if (Dep.target) { // 让计算属性所依赖的属性 收集渲染watcher
            watcher.depend()
          }
          return watcher.value
        }
      }
    }
    
    // watch的实现
    Vue.prototype.$watch = function (
        expOrFn: string | Function,
        cb: any,
        options?: Object
      ): Function {
        const vm: Component = this
        debugger;
        if (isPlainObject(cb)) {
          return createWatcher(vm, expOrFn, cb, options)
        }
        options = options || {}
        options.user = true
        const watcher = new Watcher(vm, expOrFn, cb, options) // 创建watcher，数据更新调用cb
        if (options.immediate) {
          try {
            cb.call(vm, watcher.value)
          } catch (error) {
            handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
          }
        }
        return function unwatchFn () {
          watcher.teardown()
        }
    }
```

![](/images/s_poetries_work_uploads_2022_08_a263c317b0cb2793.png)

### vue3中 watch、watchEffect区别

  * `watch`是惰性执行，也就是只有监听的值发生变化的时候才会执行，但是`watchEffect`不同，每次代码加载`watchEffect`都会执行（忽略`watch`第三个参数的配置，如果修改配置项也可以实现立即执行）
  * `watch`需要传递监听的对象，`watchEffect`不需要
  * `watch`只能监听响应式数据：`ref`定义的属性和`reactive`定义的对象，如果直接监听`reactive`定义对象中的属性是不允许的（会报警告），除非使用函数转换一下。其实就是官网上说的监听一个`getter`
  * `watchEffect`如果监听`reactive`定义的对象是不起作用的，只能监听对象中的属性

看一下`watchEffect`的代码
```html
    <template>
    <div>
      请输入firstName：
      <input type="text" v-model="firstName">
    </div>
    <div>
      请输入lastName：
      <input type="text" v-model="lastName">
    </div>
    <div>
      请输入obj.text：
      <input type="text" v-model="obj.text">
    </div>
     <div>
     【obj.text】 {{obj.text}}
     </div>
    </template>
    
    <script>
    import {ref, reactive, watch, watchEffect} from 'vue'
    export default {
      name: "HelloWorld",
      props: {
        msg: String,
      },
      setup(props,content){
        let firstName = ref('')
        let lastName = ref('')
        let obj= reactive({
          text:'hello'
        })
        watchEffect(()=>{
          console.log('触发了watchEffect');
          console.log(`组合后的名称为：${firstName.value} ${lastName.value}`)
        })
        return{
          obj,
          firstName,
          lastName
        }
      }
    };
    </script>
```

![](/images/s_poetries_work_uploads_2022_08_99d5a09b368aeaa7.png)
![](/images/s_poetries_work_uploads_2022_08_c098258e10bbeccf.png)

改造一下代码
```js
    watchEffect(()=>{
      console.log('触发了watchEffect');
      // 这里我们不使用firstName.value/lastName.value ，相当于是监控整个ref,对应第四点上面的结论
      console.log(`组合后的名称为：${firstName} ${lastName}`)
    })
```

![](/images/s_poetries_work_uploads_2022_08_41a0ee2dc000ecc3.png)
```js
    watchEffect(()=>{
      console.log('触发了watchEffect');
      console.log(obj);
    })
```

![](/images/s_poetries_work_uploads_2022_08_0277951e96a40117.png)

稍微改造一下
```js
    let obj = reactive({
      text:'hello'
    })
    watchEffect(()=>{
      console.log('触发了watchEffect');
      console.log(obj.text);
    })
```

![](/images/s_poetries_work_uploads_2022_08_f959357382b9935a.png)

**再看一下watch的代码，验证一下**
```js
    let obj= reactive({
      text:'hello'
    })
    // watch是惰性执行， 默认初始化之后不会执行，只有值有变化才会触发，可通过配置参数实现默认执行
    watch(obj, (newValue, oldValue) => {
      // 回调函数
      console.log('触发监控更新了new',  newValue);
      console.log('触发监控更新了old',  oldValue);
    },{
      // 配置immediate参数，立即执行，以及深层次监听
      immediate: true,
      deep: true
    })
```

![](/images/s_poetries_work_uploads_2022_08_c5ec33f5f3b8b6a1.png)

  * 监控整个`reactive`对象，从上面的图可以看到 `deep` 实际默认是开启的，就算我们设置为`false`也还是无效。而且旧值获取不到。
  * 要获取旧值则需要监控对象的属性，也就是监听一个`getter`，看下图

![](/images/s_poetries_work_uploads_2022_08_f3bbb272dee1d73c.png)
![](/images/s_poetries_work_uploads_2022_08_6a6bba3d39dbdc6f.png)

**总结**

  * 如果定义了`reactive`的数据，想去使用`watch`监听数据改变，则无法正确获取旧值，并且`deep`属性配置无效，自动强制开启了深层次监听。
  * 如果使用 `ref` 初始化一个对象或者数组类型的数据，会被自动转成`reactive`的实现方式，生成`proxy`代理对象。也会变得无法正确取旧值。
  * 用任何方式生成的数据，如果接收的变量是一个`proxy`代理对象，就都会导致`watch`这个对象时,`watch`回调里无法正确获取旧值。
  * 所以当大家使用`watch`监听对象时，如果在不需要使用旧值的情况，可以正常监听对象没关系；但是如果当监听改变函数里面需要用到旧值时，只能监听 对象.xxx`属性 的方式才行

watch和watchEffect异同总结

**体验**

`watchEffect`立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数
```js
    const count = ref(0)
    ​
    watchEffect(() => console.log(count.value))
    // -> logs 0
    ​
    count.value++
    // -> logs 1
```

`watch`侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数
```js
    const state = reactive({ count: 0 })
    watch(
      () => state.count,
      (count, prevCount) => {
        /* ... */
      }
    )
```

**回答范例**

  1. `watchEffect`立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。`watch`侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数
  2. `watchEffect(effect)`是一种特殊`watch`，传入的函数既是依赖收集的数据源，也是回调函数。如果我们不关心响应式数据变化前后的值，只是想拿这些数据做些事情，那么`watchEffect`就是我们需要的。`watch`更底层，可以接收多种数据源，包括用于依赖收集的`getter`函数，因此它完全可以实现`watchEffect`的功能，同时由于可以指定`getter`函数，依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时我们会使用`watch`
  3. `watchEffect`在使用时，传入的函数会立刻执行一次。`watch`默认情况下并不会执行回调函数，除非我们手动设置`immediate`选项
  4. 从实现上来说，`watchEffect(fn)`相当于`watch(fn,fn,{immediate:true})`

`watchEffect`定义如下
```js
    export function watchEffect(
      effect: WatchEffect,
      options?: WatchOptionsBase
    ): WatchStopHandle {
      return doWatch(effect, null, options)
    }
```

`watch`定义如下
```js
    export function watch<T = any, Immediate extends Readonly<boolean> = false>(
      source: T | WatchSource<T>,
      cb: any,
      options?: WatchOptions<Immediate>
    ): WatchStopHandle {
      return doWatch(source as any, cb, options)
    }
```

很明显`watchEffect`就是一种特殊的`watch`实现。

### Watch中的deep:true是如何实现的

> 当用户指定了 `watch` 中的deep属性为 `true` 时，如果当前监控的值是数组类型。会对对象中的每一项进行求值，此时会将当前
> `watcher`存入到对应属性的依赖中，这样数组中对象发生变化时也会通知数据更新

**源码相关**
```js
    get () { 
        pushTarget(this) // 先将当前依赖放到 Dep.target上 
        let value 
        const vm = this.vm 
        try { 
            value = this.getter.call(vm, vm) 
        } catch (e) { 
            if (this.user) { 
                handleError(e, vm, `getter for watcher "${this.expression}"`) 
            } else { 
                throw e 
            } 
        } finally { 
            if (this.deep) { // 如果需要深度监控 
            traverse(value) // 会对对象中的每一项取值,取值时会执行对应的get方法 
        }
        popTarget() 
    }
```

### Vue computed 实现

  * 建立与其他属性（如：`data`、 `Store`）的联系；
  * 属性改变后，通知计算属性重新计算

> 实现时，主要如下

  * 初始化 `data`， 使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`。
  * 初始化 `computed`, 遍历 `computed` 里的每个属性，每个 `computed` 属性都是一个 `watch` 实例。每个属性提供的函数作为属性的 `getter`，使用 `Object.defineProperty` 转化。
  * `Object.defineProperty getter` 依赖收集。用于依赖发生变化时，触发属性重新计算。
  * 若出现当前 `computed` 计算属性嵌套其他 `computed` 计算属性时，先进行其他的依赖收集

### watch 原理

`watch` 本质上是为每个监听属性 `setter` 创建了一个 `watcher`，当被监听的属性更新时，调用传入的回调函数。常见的配置选项有
`deep` 和 `immediate`，对应原理如下

  * `deep`：深度监听对象，为对象的每一个属性创建一个 `watcher`，从而确保对象的每一个属性更新时都会触发传入的回调函数。主要原因在于对象属于引用类型，单个属性的更新并不会触发对象 `setter`，因此引入 `deep` 能够很好地解决监听对象的问题。同时也会引入判断机制，确保在多个属性更新时回调函数仅触发一次，避免性能浪费。
  * `immediate`：在初始化时直接调用回调函数，可以通过在 `created` 阶段手动调用回调函数实现相同的效果
