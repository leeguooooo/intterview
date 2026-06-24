# 65 Vue与Angular以及React的区别？

### Vue与AngularJS的区别

  * `Angular`采用`TypeScript`开发, 而`Vue`可以使用`javascript`也可以使用`TypeScript`
  * `AngularJS`依赖对数据做脏检查，所以`Watcher`越多越慢；`Vue.js`使用基于依赖追踪的观察并且使用异步队列更新，所有的数据都是独立触发的。
  * `AngularJS`社区完善, `Vue`的学习成本较小

### Vue与React的区别

**相同点：**

  1. `Virtual DOM`。其中最大的一个相似之处就是都使用了`Virtual DOM`。(当然`Vue`是在`Vue2.x`才引用的)也就是能让我们通过操作数据的方式来改变真实的`DOM`状态。因为其实`Virtual DOM`的本质就是一个`JS`对象，它保存了对真实`DOM`的所有描述，是真实`DOM`的一个映射，所以当我们在进行频繁更新元素的时候，改变这个`JS`对象的开销远比直接改变真实`DOM`要小得多。
  2. 组件化的开发思想。第二点来说就是它们都提倡这种组件化的开发思想，也就是建议将应用分拆成一个个功能明确的模块，再将这些模块整合在一起以满足我们的业务需求。
  3. `Props`。`Vue`和`React`中都有`props`的概念，允许父组件向子组件传递数据。
  4. 构建工具、Chrome插件、配套框架。还有就是它们的构建工具以及Chrome插件、配套框架都很完善。比如构建工具，`React`中可以使用`CRA`，`Vue`中可以使用对应的脚手架`vue-cli`。对于配套框架`Vue`中有`vuex、vue-router`，`React`中有`react-router、redux`。

**不同点**

  1. 模版的编写。最大的不同就是模版的编写，`Vue`鼓励你去写近似常规`HTML`的模板，`React`推荐你使用`JSX`去书写。
  2. 状态管理与对象属性。在`React`中，应用的状态是比较关键的概念，也就是`state`对象，它允许你使用`setState`去更新状态。但是在`Vue`中，`state`对象并不是必须的，数据是由`data`属性在`Vue`对象中进行管理。
  3. 虚拟`DOM`的处理方式不同。`Vue`中的虚拟`DOM`控制了颗粒度，组件层面走`watcher`通知，而组件内部走`vdom`做`diff`，这样，既不会有太多`watcher`，也不会让`vdom`的规模过大。而`React`走了类似于`CPU`调度的逻辑，把`vdom`这棵树，微观上变成了链表，然后利用浏览器的空闲时间来做`diff`
