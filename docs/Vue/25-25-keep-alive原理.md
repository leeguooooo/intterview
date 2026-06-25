# 25 keep-alive原理

### keep-alive 使用场景和原理

  * `keep-alive` 是 `Vue` 内置的一个组件，**可以实现组件缓存** ，当组件切换时不会对当前组件进行卸载。**一般结合路由和动态组件一起使用** ，用于缓存组件
  * 提供 `include` 和 `exclude` 属性，**允许组件有条件的进行缓存** 。两者都支持字符串或正则表达式，`include` 表示只有名称匹配的组件会被缓存，`exclude` 表示任何名称匹配的组件都不会被缓存 ，其中 `exclude` 的优先级比 `include` 高
  * 对应两个钩子函数 `activated` 和`deactivated` ，当组件被激活时，触发钩子函数 `activated`，当组件被移除时，触发钩子函数 `deactivated`
  * `keep-alive` 的中还运用了 `LRU`(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰

>   * `<keep-alive></keep-alive>` 包裹动态组件时，会缓存不活动的组件实例,主要用于保留组件状态或避免重新渲染
>   *
> 比如有一个列表和一个详情，那么用户就会经常执行打开详情=>返回列表=>打开详情…这样的话列表和详情都是一个频率很高的页面，那么就可以对列表组件使用`<keep-
> alive></keep-alive>`进行缓存，这样用户每次返回列表的时候，都能从缓存中快速渲染，而不是重新渲染
>

**关于keep-alive的基本用法**
```html
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
```

使用`includes`和`exclude`：
```html
    <keep-alive include="a,b">
      <component :is="view"></component>
    </keep-alive>
    
    <!-- 正则表达式 (使用 `v-bind`) -->
    <keep-alive :include="/a|b/">
      <component :is="view"></component>
    </keep-alive>
    
    <!-- 数组 (使用 `v-bind`) -->
    <keep-alive :include="['a', 'b']">
      <component :is="view"></component>
    </keep-alive>
```

匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components`
选项的键值)，匿名组件不能被匹配

设置了 `keep-alive` 缓存的组件，会多出两个生命周期钩子（`activated`与`deactivated`）：

  * 首次进入组件时：`beforeRouteEnter` > `beforeCreate` > `created`> `mounted` > `activated` > ... ... > `beforeRouteLeave` > `deactivated`
  * 再次进入组件时：`beforeRouteEnter` >`activated` > ... ... > `beforeRouteLeave` > `deactivated`

**使用场景**

使用原则：当我们在某些场景下不需要让页面重新加载时我们可以使用`keepalive`

举个栗子:

当我们从`首页`–>`列表页`–>`商详页`–>`再返回`，这时候列表页应该是需要`keep-alive`

从`首页`–>`列表页`–>`商详页`–>`返回到列表页(需要缓存)`–>`返回到首页(需要缓存)`–>`再次进入列表页(不需要缓存)`，这时候可以按需来控制页面的`keep-
alive`

在路由中设置`keepAlive`属性判断是否需要缓存
```js
    {
      path: 'list',
      name: 'itemList', // 列表页
      component (resolve) {
        require(['@/pages/item/list'], resolve)
     },
     meta: {
      keepAlive: true,
      title: '列表页'
     }
    }
```

使用`<keep-alive>`
```html
    <div id="app" class='wrapper'>
        <keep-alive>
            <!-- 需要缓存的视图组件 --> 
            <router-view v-if="$route.meta.keepAlive"></router-view>
         </keep-alive>
          <!-- 不需要缓存的视图组件 -->
         <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
```

**思考题：缓存后如何获取数据**

解决方案可以有以下两种：

  * `beforeRouteEnter`：每次组件渲染的时候，都会执行`beforeRouteEnter`
```js
    beforeRouteEnter(to, from, next){
        next(vm=>{
            console.log(vm)
            // 每次进入路由执行
            vm.getData()  // 获取数据
        })
    },
```

  * `actived`：在`keep-alive`缓存的组件被激活的时候，都会执行`actived`钩子
```js
    // 注意：服务器端渲染期间avtived不被调用
    activated(){
      this.getData() // 获取数据
    },
```

**扩展补充：LRU 算法是什么？**

![](/images/s_poetries_work_uploads_2022_08_beabc92317439472.webp)

> `LRU` 的核心思想是如果数据最近被访问过，那么将来被访问的几率也更高，所以我们将命中缓存的组件 `key` 重新插入到 `this.keys`
> 的尾部，这样一来，`this.keys` 中越往头部的数据即将来被访问几率越低，所以当缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即
> `this.keys` 中第一个缓存的组件

**相关代码**

`keep-alive`是`vue`中内置的一个组件

源码位置：`src/core/components/keep-alive.js`
```js
    export default {
      name: "keep-alive",
      abstract: true, //抽象组件
    
      props: {
        include: patternTypes, //要缓存的组件
        exclude: patternTypes, //要排除的组件
        max: [String, Number], //最大缓存数
      },
    
      created() {
        this.cache = Object.create(null); //缓存对象  {a:vNode,b:vNode}
        this.keys = []; //缓存组件的key集合 [a,b]
      },
    
      destroyed() {
        for (const key in this.cache) {
          pruneCacheEntry(this.cache, key, this.keys);
        }
      },
    
      mounted() {
        //动态监听include  exclude
        this.$watch("include", (val) => {
          pruneCache(this, (name) => matches(val, name));
        });
        this.$watch("exclude", (val) => {
          pruneCache(this, (name) => !matches(val, name));
        });
      },
    
      render() {
        const slot = this.$slots.default; //获取包裹的插槽默认值 获取默认插槽中的第一个组件节点
        const vnode: VNode = getFirstComponentChild(slot); //获取第一个子组件
        // 获取该组件节点的componentOptions
        const componentOptions: ?VNodeComponentOptions =
          vnode && vnode.componentOptions;
        if (componentOptions) {
          // 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag
          const name: ?string = getComponentName(componentOptions);
          const { include, exclude } = this;
          // 不走缓存 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode
          if (
            // not included  不包含
            (include && (!name || !matches(include, name))) ||
            // excluded  排除里面
            (exclude && name && matches(exclude, name))
          ) {
            //返回虚拟节点
            return vnode;
          }
    
          const { cache, keys } = this;
          // 获取组件的key值
          const key: ?string =
            vnode.key == null
              ? // same constructor may get registered as different local components
                // so cid alone is not enough (#3269)
                componentOptions.Ctor.cid +
                (componentOptions.tag ? `::${componentOptions.tag}` : "")
              : vnode.key;
          // 拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存
          if (cache[key]) {
            //通过key 找到缓存 获取实例
            vnode.componentInstance = cache[key].componentInstance;
            // make current key freshest
            remove(keys, key); //通过LRU算法把数组里面的key删掉
            keys.push(key); //把它放在数组末尾
          } else {
            cache[key] = vnode; //没找到就换存下来
            keys.push(key); //把它放在数组末尾
            // prune oldest entry  //如果超过最大值就把数组第0项删掉
            if (this.max && keys.length > parseInt(this.max)) {
              pruneCacheEntry(cache, keys[0], keys, this._vnode);
            }
          }
    
          vnode.data.keepAlive = true; //标记虚拟节点已经被缓存
        }
        // 返回虚拟节点
        return vnode || (slot && slot[0]);
      },
    };
```

可以看到该组件没有`template`，而是用了`render`，在组件渲染的时候会自动执行`render`函数

`this.cache`是一个对象，用来存储需要缓存的组件，它将以如下形式存储：
```js
    this.cache = {
      'key1':'组件1',
      'key2':'组件2',
      // ...
    }
```

在组件销毁的时候执行`pruneCacheEntry`函数
```js
    function pruneCacheEntry (
      cache: VNodeCache,
      key: string,
      keys: Array<string>,
      current?: VNode
    ) {
      const cached = cache[key]
      /* 判断当前没有处于被渲染状态的组件，将其销毁*/
      if (cached && (!current || cached.tag !== current.tag)) {
        cached.componentInstance.$destroy()
      }
      cache[key] = null
      remove(keys, key)
    }
```

在`mounted`钩子函数中观测 `include` 和 `exclude` 的变化，如下：
```js
    mounted () {
      this.$watch('include', val => {
          pruneCache(this, name => matches(val, name))
      })
      this.$watch('exclude', val => {
          pruneCache(this, name => !matches(val, name))
      })
    }
```

如果`include` 或`exclude`
发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行`pruneCache`函数，函数如下
```js
    function pruneCache (keepAliveInstance, filter) {
      const { cache, keys, _vnode } = keepAliveInstance
      for (const key in cache) {
        const cachedNode = cache[key]
        if (cachedNode) {
          const name = getComponentName(cachedNode.componentOptions)
          if (name && !filter(name)) {
            pruneCacheEntry(cache, key, keys, _vnode)
          }
        }
      }
    }
```

在该函数内对`this.cache`对象进行遍历，取出每一项的`name`值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用`pruneCacheEntry`函数将其从`this.cache`对象剔除即可

关于`keep-alive`的最强大缓存功能是在`render`函数中实现

首先获取组件的`key`值：
```go
    const key = vnode.key == null? 
    componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
    : vnode.key
```

拿到`key`值后去`this.cache`对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存，如下：
```go
    /* 如果命中缓存，则直接从缓存中拿 vnode 的组件实例 */
    if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        /* 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个 */
        remove(keys, key)
        keys.push(key)
    } 
```

直接从缓存中拿 `vnode` 的组件实例，此时重新调整该组件`key`的顺序，将其从原来的地方删掉并重新放在`this.keys`中最后一个

`this.cache`对象中没有该`key`值的情况，如下：
```go
    /* 如果没有命中缓存，则将其设置进缓存 */
    else {
        cache[key] = vnode
        keys.push(key)
        /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
        if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
    }
```

表明该组件还没有被缓存过，则以该组件的`key`为键，组件`vnode`为值，将其存入`this.cache`中，并且把`key`存入`this.keys`中

此时再判断`this.keys`中缓存组件的数量是否超过了设置的最大缓存数量值`this.max`，如果超过了，则把第一个缓存组件删掉

### 怎么缓存当前的组件？缓存后怎么更新

缓存组件使用`keep-alive`组件，这是一个非常常见且有用的优化手段，`vue3`中`keep-alive`有比较大的更新，能说的点比较多

**思路**

  * 缓存用`keep-alive`，它的作用与用法
  * 使用细节，例如缓存指定/排除、结合`router`和`transition`
  * 组件缓存后更新可以利用`activated`或者`beforeRouteEnter`
  * 原理阐述

**回答范例**

  1. 开发中缓存组件使用`keep-alive`组件，`keep-alive`是`vue`内置组件，`keep-alive`包裹动态组件`component`时，会缓存不活动的组件实例，而不是销毁它们，这样在组件切换过程中将状态保留在内存中，防止重复渲染`DOM`
```html
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
```

  2. 结合属性`include`和`exclude`可以明确指定缓存哪些组件或排除缓存指定组件。`vue3`中结合`vue-router`时变化较大，之前是`keep-alive`包裹`router-view`，现在需要反过来用`router-view`包裹`keep-alive`
```html
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
```

  3. 缓存后如果要获取数据，解决方案可以有以下两种

  * `beforeRouteEnter`：在有`vue-router的`项目，每次进入路由的时候，都会执行`beforeRouteEnter`
```js
    beforeRouteEnter(to, from, next){
      next(vm=>{
        console.log(vm)
        // 每次进入路由执行
        vm.getData()  // 获取数据
      })
    },
```

  * `actived`：在`keep-alive`缓存的组件被激活的时候，都会执行`actived`钩子
```js
    activated(){
    	this.getData() // 获取数据
    },
```

  4. `keep-alive`是一个通用组件，它内部定义了一个`map`，缓存创建过的组件实例，它返回的渲染函数内部会查找内嵌的`component`组件对应组件的`vnode`，如果该组件在`map`中存在就直接返回它。由于`component`的`is`属性是个响应式数据，因此只要它变化，`keep-alive`的`render`函数就会重新执行
