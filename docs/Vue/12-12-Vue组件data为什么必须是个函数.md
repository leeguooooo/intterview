# 12 Vue组件data为什么必须是个函数？

  * **根实例对象`data`可以是对象也可以是函数**（根实例是单例），不会产生数据污染情况
  * **组件实例对象`data`必须为函数** `.vue`文件在使用的时候实际上会转换成一个`class`，一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。如果`data`是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件在不同的实例之间`data`不冲突，`data`必须是一个函数，

**简版理解**
```js
    // 1.组件的渲染流程 调用Vue.component -> Vue.extend -> 子类 -> new 子类
    // Vue.extend 根据用户定义产生一个新的类
    function Vue() {}
    function Sub() { // 会将data存起来
        this.data = this.constructor.options.data();
    }
    Vue.extend = function(options) {
        Sub.options = options; // 静态属性
        return Sub;
    }
    let Child = Vue.extend({
        data:()=>( { name: 'test' })
    });
    
    // 两个组件就是两个实例, 希望数据互不感染
    let child1 = new Child();
    let child2 = new Child();
    
    console.log(child1.data.name);
    child1.data.name = 'poetry';
    console.log(child2.data.name);
    
    // 根不需要 任何的合并操作   根才有vm属性 所以他可以是函数和对象  但是组件mixin他们都没有vm 所以我就可以判断 当前data是不是个函数
```

**相关源码**
```js
    // 源码位置 src/core/global-api/extend.js
    export function initExtend (Vue: GlobalAPI) {
      Vue.extend = function (extendOptions: Object): Function {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
          return cachedCtors[SuperId]
        }
    
        const name = extendOptions.name || Super.options.name
        if (process.env.NODE_ENV !== 'production' && name) {
          validateComponentName(name)
        }
    
        const Sub = function VueComponent (options) {
          this._init(options)
        }
        // 子类继承大Vue父类的原型
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(
          Super.options,
          extendOptions
        )
        Sub['super'] = Super
    
        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
          initProps(Sub)
        }
        if (Sub.options.computed) {
          initComputed(Sub)
        }
    
        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend
        Sub.mixin = Super.mixin
        Sub.use = Super.use
    
        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
          Sub[type] = Super[type]
        })
        // enable recursive self-lookup
        if (name) { 
          Sub.options.components[name] = Sub // 记录自己 在组件中递归自己  -> jsx
        }
    
        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)
    
        // cache constructor
        cachedCtors[SuperId] = Sub
        return Sub
      }
    }
```
