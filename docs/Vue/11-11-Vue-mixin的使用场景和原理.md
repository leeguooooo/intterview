# 11 Vue.mixin的使用场景和原理

  * 在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 `Vue` 的 `mixin` 功能抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用 `mergeOptions` 方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”；如果混入的数据和本身组件的数据冲突，会以组件的数据为准
  * `mixin`有很多缺陷如：命名冲突、依赖问题、数据来源问题

基本使用
```html
    <script>
        // Vue.options
        Vue.mixin({ // 如果他是对象 每个组件都用mixin里的对象进行合并
            data(){
                return {a: 1,b: 2}
            }
        });
        // Vue.extend
        Vue.component('my',{ // 组件必须是函数 Vue.extend  => render(xxx)
            data(){
                return {x:1}
            }
        }) 
        // 没有 new 没有实例  _init()
        // const vm = this
        new Vue({
            el:'#app',
            data(){ // 根可以不是函数 
                return {c:3}
            }
        })
    </script>
```

相关源码
```js
    export default function initMixin(Vue){
      Vue.mixin = function (mixin) {
        //   合并对象
          this.options=mergeOptions(this.options,mixin)
      };
    }
    };
    
    // src/util/index.js
    // 定义生命周期
    export const LIFECYCLE_HOOKS = [
      "beforeCreate",
      "created",
      "beforeMount",
      "mounted",
      "beforeUpdate",
      "updated",
      "beforeDestroy",
      "destroyed",
    ];
    
    // 合并策略
    const strats = {};
    // mixin核心方法
    export function mergeOptions(parent, child) {
      const options = {};
      // 遍历父亲
      for (let k in parent) {
        mergeFiled(k);
      }
      // 父亲没有 儿子有
      for (let k in child) {
        if (!parent.hasOwnProperty(k)) {
          mergeFiled(k);
        }
      }
    
      //真正合并字段方法
      function mergeFiled(k) {
        // strats合并策略
        if (strats[k]) {
          options[k] = strats[k](parent[k], child[k]);
        } else {
          // 默认策略
          options[k] = child[k] ? child[k] : parent[k];
        }
      }
      return options;
    }
```
