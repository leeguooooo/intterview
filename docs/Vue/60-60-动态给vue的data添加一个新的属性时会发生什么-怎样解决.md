# 60 动态给vue的data添加一个新的属性时会发生什么？怎样解决？

Vue 不允许在已经创建的实例上动态添加新的响应式属性

若想实现数据与视图同步更新，可采取下面三种解决方案：

  * `Vue.set()`
  * `Object.assign()`
  * `$forcecUpdated()`

### Vue.set()
```js
    Vue.set( target, propertyName/index, value )
```

参数

  * `{Object | Array} target`
  * `{string | number} propertyName/index`
  * `{any} value`

返回值：设置的值

通过`Vue.set`向响应式对象中添加一个`property`，并确保这个新 `property`同样是响应式的，且触发视图更新

关于`Vue.set`源码（省略了很多与本节不相关的代码）

源码位置：`src\core\observer\index.js`
```js
    function set (target: Array<any> | Object, key: any, val: any): any {
      ...
      defineReactive(ob.value, key, val)
      ob.dep.notify()
      return val
    }
```

这里无非再次调用`defineReactive`方法，实现新增属性的响应式

关于`defineReactive`方法，内部还是通过`Object.defineProperty`实现属性拦截

大致代码如下：
```js
    function defineReactive(obj, key, val) {
        Object.defineProperty(obj, key, {
            get() {
                console.log(`get ${key}:${val}`);
                return val
            },
            set(newVal) {
                if (newVal !== val) {
                    console.log(`set ${key}:${newVal}`);
                    val = newVal
                }
            }
        })
    }
```

### Object.assign()

直接使用`Object.assign()`添加到对象的新属性不会触发更新

应创建一个新的对象，合并原对象和混入对象的属性
```js
    this.someObject = Object.assign({},this.someObject,{newProperty1:1,newProperty2:2 ...})
```

### $forceUpdate

如果你发现你自己需要在 `Vue`中做一次强制更新，99.9% 的情况，是你在某个地方做错了事

`$forceUpdate`迫使`Vue` 实例重新渲染

PS：仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

### 小结

  * 如果为对象添加少量的新属性，可以直接采用`Vue.set()`
  * 如果需要为新对象添加大量的新属性，则通过`Object.assign()`创建新对象
  * 如果你实在不知道怎么操作时，可采取`$forceUpdate()`进行强制刷新 (不建议)

PS：`vue3`是用过`proxy`实现数据响应式的，直接动态添加新属性仍可以实现数据响应式
