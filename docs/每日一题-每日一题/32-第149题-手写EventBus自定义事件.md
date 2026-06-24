# 第149题 手写EventBus自定义事件

**分析**

  * `on`和`once`注册函数，存储起来
  * `emit`时找到对应的函数，执行
  * `off`找到对应函数，从存储中删除

**注意**

  * `on`绑定的事件可以连续执行，除非`off`
  * `once`绑定的函数`emit`一次即删除，也可以未执行而被`off`

**实现方式1**
```js
    class EventBus {
        /**
         * {
         *    'key1': [
         *        { fn: fn1, isOnce: false },
         *        { fn: fn2, isOnce: false },
         *        { fn: fn3, isOnce: true },
         *    ]
         *    'key2': [] // 有序
         *    'key3': []
         * }
         */
        constructor() {
            this.events = {}
        }
    
        on(type, fn, isOnce = false) {
            const events = this.events
            if (events[type] == null) {
                events[type] = [] // 初始化 key 的 fn 数组
            }
            events[type].push({ fn, isOnce })
        }
    
        once(type, fn) {
            this.on(type, fn, true)
        }
    
        off(type, fn) {
            if (!fn) {
                // 解绑所有 type 的函数
                this.events[type] = []
            } else {
                // 解绑单个 fn
                const fnList = this.events[type]
                if (fnList) {
                    this.events[type] = fnList.filter(item => item.fn !== fn)
                }
            }
        }
    
        emit(type, ...args) {
            const fnList = this.events[type]
            if (fnList == null) return
    
            // 注意过滤后重新赋值
            this.events[type] = fnList.filter(item => {
                const { fn, isOnce } = item
                fn(...args)
    
                // once 执行一次就要被过滤掉
                if (!isOnce) return true
                return false
            })
        }
    }
```

**实现方式2：拆分保存 on 和 once 事件**
```js
    // 拆分保存 on 和 once 事件
    
    class EventBus {
        constructor() {
            this.events = {} // { key1: [fn1, fn2], key2: [fn1, fn2] }
            this.onceEvents = {}
        }
    
        on(type, fn) {
            const events = this.events
            if (events[type] == null) events[type] = []
            events[type].push(fn)
        }
    
        once(type, fn) {
            const onceEvents = this.onceEvents
            if (onceEvents[type] == null) onceEvents[type] = []
            onceEvents[type].push(fn)
        }
    
        off(type, fn) {
            if (!fn) {
                // 解绑所有事件
                this.events[type] = []
                this.onceEvents[type] = []
            } else {
                // 解绑单个事件
                const fnList = this.events[type]
                const onceFnList = this.onceEvents[type]
                if (fnList) {
                    this.events[type] = fnList.filter(curFn => curFn !== fn)
                }
                if (onceFnList) {
                    this.onceEvents[type] = onceFnList.filter(curFn => curFn !== fn)
                }
            }
        }
    
        emit(type, ...args) {
            const fnList = this.events[type]
            const onceFnList = this.onceEvents[type]
    
            if (fnList) {
                fnList.forEach(f => f(...args))
            }
            if (onceFnList) {
                onceFnList.forEach(f => f(...args))
    
                // once 执行一次就删除
                this.onceEvents[type] = []
            }
        }
    }
```  
```js
    // 测试
    const e = new EventBus()
    
    function fn1(a, b) { console.log('fn1', a, b) }
    function fn2(a, b) { console.log('fn2', a, b) }
    function fn3(a, b) { console.log('fn3', a, b) }
    
    e.on('key1', fn1)
    e.on('key1', fn2)
    e.once('key1', fn3)
    e.on('xxxxxx', fn3)
    
    e.emit('key1', 10, 20) // 触发 fn1 fn2 fn3
    
    e.off('key1', fn1)
    
    e.emit('key1', 100, 200) // 触发 fn2
```
