# 第44题 执行new Vue干了什么

  * 当我们写下这段简单`new Vue()`代码，`vue`框架做了什么呢?
```js
    var vm = new Vue({
       el:"#app",
         data:{
            msg:'this is msg'
         }
       }
    )
```

  * 调用`src/core/instance/index.js`的`Vue`构造方法
```js
    function Vue (options) {
      if (process.env.NODE_ENV !== 'production' &&
        !(this instanceof Vue)
      ) {
        warn('Vue is a constructor and should be called with the `new` keyword')
      }
      //执行初始化方法，initMixin的时候，在vue原型上挂载了 _init方法
      this._init(options)
    }
    
    // 执行初始化的工作
    initMixin(Vue)
    stateMixin(Vue)
    eventsMixin(Vue)
    lifecycleMixin(Vue)
    renderMixin(Vue)
    
    export default Vue
```

  * 接下来调用原型上面`_init`方法，是我们要重点分析的，其入参`options`就是我们定义的对象时传入的参数对象
  * 执行内部初始化方法，首先是`options`的合并，之后是一堆init方法
  * 对`options`进行合并，vue会将相关的属性和方法都统一放到`vm.$options`中，为后续的调用做准备工作。`vm.$option`的属性来自两个方面，一个是`Vue`的构造函数(`vm.constructor`)预先定义的，一个是`new Vue`时传入的入参对象。合并完成后的`options`属性包括：

![](/images/s_poetries_work_images_20210403162230.webp)

  * 初始化各类属性和事件

![](/images/s_poetries_work_images_20210403162331.webp)

  * 挂载。如果说前面几部分都是准备阶段，那么这部分是整个`new Vue`的核心部分，将`template`编译成`render`表达式，然后转化为大名鼎鼎的`Vnode`，最终渲染为真实的`dom`节点

![](/images/s_poetries_work_images_20210403162420.webp)
```js
    // _init()的实现在src/core/instance/init.js中
    Vue.prototype._init = function (options) {
      // 第一部分 初始化属性
        var vm = this;
        // a uid
        vm._uid = uid$3++;
    
        var startTag, endTag;
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
          startTag = "vue-perf-start:" + (vm._uid);
          endTag = "vue-perf-end:" + (vm._uid);
          mark(startTag);
        }
    
        // a flag to avoid this being observed
        vm._isVue = true;
        // 第二部分 合并相关option merge options
        if (options && options._isComponent) {
          // optimize internal component instantiation
          // since dynamic options merging is pretty slow, and none of the
          // internal component options needs special treatment.
          initInternalComponent(vm, options);
        } else {
          vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
          );
        }
        // 第三部分，初始化各类属性和事件
        /* istanbul ignore else */
        if (process.env.NODE_ENV !== 'production') {
          initProxy(vm);
        } else {
          vm._renderProxy = vm;
        }
        // expose real self
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook(vm, 'beforeCreate');
        initInjections(vm); // resolve injections before data/props
        initState(vm);
        initProvide(vm); // resolve provide after data/props
        callHook(vm, 'created');
    
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
          vm._name = formatComponentName(vm, false);
          mark(endTag);
          measure(("vue " + (vm._name) + " init"), startTag, endTag);
        }
    
        if (vm.$options.el) {
          // 第四部分 挂载节点
          vm.$mount(vm.$options.el);
        }
      };
```

> 我们在内部能执行`this.msg`的原因是`vm._data`代理返回
```js
    function initData (vm: Component) {
      let data = vm.$options.data
      data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {}
      if (!isPlainObject(data)) {
        data = {}
        process.env.NODE_ENV !== 'production' && warn(
          'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
          vm
        )
      }
      // proxy data on instance
      const keys = Object.keys(data)
      const props = vm.$options.props
      const methods = vm.$options.methods
      let i = keys.length
      while (i--) {
        const key = keys[i]
        if (process.env.NODE_ENV !== 'production') {
          if (methods && hasOwn(methods, key)) {
            warn(
              `Method "${key}" has already been defined as a data property.`,
              vm
            )
          }
        }
        if (props && hasOwn(props, key)) {
          process.env.NODE_ENV !== 'production' && warn(
            `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
            vm
          )
        } else if (!isReserved(key)) {
          // 使我们能执行this.msg 
          proxy(vm, `_data`, key)
        }
      }
      // observe data
      observe(data, true /* asRootData */)
    }
    
    function proxy (target: Object, sourceKey: string, key: string) {
      sharedPropertyDefinition.get = function proxyGetter () {
        // 执行this.msg 被代理到this._data上面
        return this[sourceKey][key]
      }
      sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
      }
      Object.defineProperty(target, key, sharedPropertyDefinition)
    }
```

> `Vue` 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化
> `data`、`props`、`computed`、`watcher` 等

![](/images/s_poetries_work_images_20210403192632.webp)

![](/images/s_poetries_work_images_20210504210642.webp)
