---
title: "uniapp中使用Vue2语法注意"
---

# 6 uniapp中使用Vue2语法注意

### 基础

#### 在 uni-app 中使用vue的差异

`uni-app` 在发布到H5时支持所有vue的语法；发布到App和小程序时，由于平台限制，无法实现全部vue语法，但 `uni-app`
仍是对vue语法支持度最高的跨端框架。

相比Web平台， Vue.js 在 `uni-app` 中使用差异主要集中在两个方面：

  * 新增：`uni-app` 除了支持Vue实例的生命周期，还支持[应用生命周期 (opens new window)](https://uniapp.dcloud.io/collocation/App#%E5%BA%94%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)以及[页面生命周期 (opens new window)](https://uniapp.dcloud.io/tutorial/page#lifecycle)。
  * 受限：相比web平台，在小程序和App端部分功能受限，[具体见 (opens new window)](https://uniapp.dcloud.net.cn/vue3-api)。

`uni-app` 项目对 vue 3.0 的支持版本情况如下：

  * Web平台：支持。
  * 小程序平台：`HBuilderX 3.3.3+` 编译器改为 `vite`，之前版本的编译器为`webpack`。
  * App 平台：`uni-app 3.2.5+`支持。`HBuilderX 3.3.13` 起 `nvue`编译器升级为`vite`。

**注意事项**

  * vue3 响应式基于 `Proxy` 实现，不支持`iOS9`和`ie11`。
  * 暂不支持新增的 `Teleport`,`Suspense` 组件。
  * 目前 `HBuilderX 3.2` 起已预置，之前的版本只能使用cli方式

#### v-show

`v-show` 是一个根据条件展示元素选项的指令 。用法大致和 `v-if` 一样：
```html
    	<view v-show="ok">Hello!</view>
```

不同的是带有 v-show 的元素始终会被渲染并保留在 DOM 中。v-show 只是简单地切换元素的 `CSS` 属性的 `display` 。

> 注意，v-show 不支持 template 元素，也不支持 v-else。nvue 页面不支持 v-show

#### v-for

  * 在H5平台 使用 v-for 循环整数时和其他平台存在差异，如 `v-for="(item, index) in 10"` 中，在H5平台 item 从 1 开始，其他平台 item 从 0 开始，可使用第二个参数 index 来保持一致。
  * 在非H5平台 循环对象时不支持第三个参数，如 `v-for="(value, name, index) in object"` 中，index 参数是不支持的

#### v-html

更新元素的 `innerHTML` 。

  * 注意：**内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译。**
  * 如果试图使用 v-html 组合模板，可以重新考虑是否通过使用组件来替代。
  * App端和H5端支持 `v-html` ，微信小程序会被转为 `rich-text`，其他端不支持 `v-html` 。

跨端的富文本处理方案详见：https://ask.dcloud.net.cn/article/35772
```html
    	<template>
    		<view>
    			<view v-html="rawHtml"></view>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					rawHtml: '<div style="text-align:center;background-color: #007AFF;"><div >我是内容</div><img src="https://web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png"/></div>'
    				}
    			}
    		}
    	</script>
```

#### Class 与 Style 绑定

> 小程序端不支持 `classObject` 和 `styleObject` 语法。
```html
    	<template>
    		<view>
    			<view :class="activeClass">hello uni-app</view>
    			<view :style="styleObject">hello uni-app</view>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					activeClass: {
    						'active': true,
    						'text-danger': false
    					},
    					styleObject: {
    						color: 'red',
    						fontSize: '20px'
    					}
    				}
    			}
    		}
    	</script>
    	<style>
    		.active {
    			background-color: #007AFF;
    		}
    		.text-danger {
    			font-size: 60rpx;
    			color: #DD524D;
    		}
    	</style>
```

#### 事件修饰符

修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，`.prevent` 修饰符告诉
@事件对于触发的事件调用 `event.preventDefault()`：

@事件（v-on）提供了事件修饰符:

  * `.stop`: 各平台均支持， 使用时会阻止事件冒泡，在非 H5 端同时也会阻止事件的默认行为
  * `.native`: 监听原生事件，各平台均支持
  * `.prevent`: 仅在 H5 平台支持
  * `.capture`: 仅在 H5 平台支持
  * `.self`: 仅在 H5 平台支持
  * `.once`: 仅在 H5 平台支持
  * `.passive`: 仅在 H5 平台支持
```html
    	<!-- 阻止单击事件继续传播 -->
    	<view @click.stop="doThis"></view>
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `@click.prevent.self` 会阻止所有的点击，而
> `@click.self.prevent` 只会阻止对元素自身的点击。

**注意**

  * 为兼容各端，事件需使用 **@** 的方式绑定，请勿使用小程序端的 `bind` 和 `catch` 进行事件绑定；也不能在 JS 中使用`event.preventDefault()`和`event.stopPropagation()`方法；
  * 若需要禁止蒙版下的页面滚动，可使用 `@touchmove.stop.prevent="moveHandle"`，`moveHandle` 可以用来处理 `touchmove` 的事件，也可以是一个空函数。
```html
    <view class="mask" @touchmove.stop.prevent="moveHandle"></view>
```

  * 按键修饰符：`uni-app` 运行在手机端，没有键盘事件，所以不支持按键修饰符

#### 表单控件绑定

你可以用 v-model 指令在表单 `input`、`textarea` 及 `select`
元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。尽管有些神奇，但 `v-model`
本质上不过是语法糖。它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。

> v-model 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue
> 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 data 选项中声明初始值。

建议开发过程中直接使用 `uni-app`：[表单组件 (opens new
window)](https://uniapp.dcloud.io/component/button)

**用法示例：**

  * H5 的 `select` 标签用 `picker` 组件进行代替
```html
    <template>
    		<view>
    			<picker @change="bindPickerChange" :value="index" :range="array">
    				<view class="picker">
    					当前选择：{{array[index]}}
    				</view>
    			</picker>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					index: 0,
    					array: ['A', 'B', 'C']
    				}
    			},
    			methods: {
    				bindPickerChange(e) {
    					console.log(e)
    				}
    			}
    		}
    	</script>
```

  * 表单元素 `radio` 用 `radio-group` 组件进行代替
```html
    	<template>
    		<view>
    			<radio-group class="radio-group" @change="radioChange">
    				<label class="radio" v-for="(item, index) in items" :key="item.name">
    					<radio :value="item.name" :checked="item.checked" /> {{item.value}}
    				</label>
    			</radio-group>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					items: [{
    							name: 'USA',
    							value: '美国'
    						},
    						{
    							name: 'CHN',
    							value: '中国',
    							checked: 'true'
    						},
    						{
    							name: 'BRA',
    							value: '巴西'
    						},
    						{
    							name: 'JPN',
    							value: '日本'
    						},
    						{
    							name: 'ENG',
    							value: '英国'
    						},
    						{
    							name: 'TUR',
    							value: '法国'
    						}
    					]
    				}
    			},
    			methods: {
    				radioChange(e) {
    					console.log('radio发生change事件，携带value值为：', e.target.value)
    				}
    			}
    		}
    	</script>
```

#### 计算属性 vs 侦听属性

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：**侦听属性** 。当你有一些数据需要随着其它数据变动而变动时，你很容易滥用
`watch` 。然而，通常更好的做法是使用计算属性而不是命令式的 `watch` 回调。
```js
    	export default {
    		data() {
    			return {
    				firstName: 'Foo',
    				lastName: 'Bar',
    				fullName: 'Foo Bar'
    			}
    		},
    		watch: {
    			firstName: function(val) {
    				this.fullName = val + ' ' + this.lastName
    			},
    			lastName: function(val) {
    				this.fullName = this.firstName + ' ' + val
    			}
    		}
    	}
```

上面代码是命令式且重复的。将它与计算属性的版本进行比较：
```js
    	export default {
    		data() {
    			return {
    				firstName: 'Foo',
    				lastName: 'Bar'
    			}
    		},
    		computed: {
    		    fullName(){
    				return this.firstName + ' ' + this.lastName
    		    }
    		}
    	}
```

#### 侦听器watch侦听器watch

  * 类型：{ [key: string]: string | Function | Object | Array }
  * 一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 `$watch()` ，遍历 `watch` 对象的每一个 `property` 。
  * 示例：
```html
    <template>
    	<view>
    		<input type="text" v-model="word">
    	</view>
    </template>
    <script>
    	export default {
    		data() {
    			return {
    				word: 'word'
    			}
    		},
    		watch: {
    			// 使用watch来响应数据的变化
    			word(newVal, oldVal) {
    				console.log('最新值是：'+newVal,"原来的值是："+ oldVal);
    			}
    		},
    	}
    </script>
```

示例：
```html
    <script>
    	export default {
    		data() {
    			return {
    				a: 1,
    				b: 2,
    				c: 3,
    				d: 4,
    				e: {
    					f: {
    						g: 5
    					}
    				}
    			}
    		},
    		watch: {
    			a: function(val, oldVal) {
    				console.log('new: %s, old: %s', val, oldVal)
    			},
    			// 方法名
    			b: 'someMethod',
    			// 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    			c: {
    				handler: function(val, oldVal) { /* ... */ },
    				deep: true
    			},
    			// 该回调将会在侦听开始之后被立即调用
    			d: {
    				handler: 'someMethod',
    				immediate: true
    			},
    			// 你可以传入回调数组，它们会被逐一调用
    			e: [
    				'handle1',
    				function handle2(val, oldVal) { /* ... */ },
    				{
    					handler: function handle3(val, oldVal) { /* ... */ },
    					/* ... */
    				}
    			],
    			// watch vm.e.f's value: {g: 5}
    			'e.f': function(val, oldVal) { /* ... */ }
    		}
    	}
    </script>
```

### 组件

基础组件是内置在uni-app框架中的，包括view、text、input、button、video等几十个基础组件，列表详见：[uni-app基础组件
(opens new
window)](https://uniapp.dcloud.net.cn/component/README?id=%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6)

但仅有基础组件是不够用的，实际开发中会有很多封装的组件。

比如我们需要一个五角星点击评分的组件，在DCloud的插件市场里可以获取到：https://ext.dcloud.net.cn/plugin?id=33

把这个uni-rate组件导入到你的uni-app项目下，在需要的vue页面里引用它，就可以在指定的地方显示出这个五角星组件。
```html
    	<!-- 在index.vue页面引用 uni-rate 组件-->
    	<template>
    		<view>
    			<uni-rate></uni-rate><!-- 这里会显示一个五角星，并且点击后会自动亮星 -->
    		</view>
    	</template>
```

#### 注册

在注册一个组件的时候，我们始终需要给它一个名字。 定义组件名的方式有两种：

  * 使用 kebab-case

当使用 kebab-case (短横线分隔命名) 定义一个组件时，你也必须在引用这个自定义元素时使用 kebab-case，例如 `<my-
component-name>`。

  * 使用 PascalCase

当使用 PascalCase (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。 也就是说 `<my-component-
name>` 和 `<MyComponentName>` 都是可接受的。

在uni-app工程根目录下的 `components` 目录，创建并存放自定义组件：
```html
    │─components            	符合vue组件规范的uni-app组件目录
    │  └─componentA         	符合‘components/组件名称/组件名称.vue’目录结构，easycom方式可直接使用组件
    │  		└─componentA.vue    可复用的componentA组件
    │  └─component-a.vue      可复用的component-a组件
```

#### 全局注册

`uni-app` 支持配置全局组件，需在 `main.js` 里进行全局注册，注册后就可在所有页面里使用该组件。

**注意**

  * Vue.component 的第一个参数必须是静态的字符串。
  * nvue 页面暂不支持全局组件。

`main.js` 里进行全局导入和注册
```js
    	import Vue from 'vue'
    	import pageHead from './components/page-head.vue'
    	Vue.component('page-head',pageHead)
```

`index.vue` 里可直接使用组件
```html
    	<template>
    		<view>
    			<page-head></page-head>
    		</view>
    	</template>
```

#### 局部注册

局部注册之前，在需要引用该组件的页面，导入你想使用的组件。

**页面引入组件方式**

如下通过两种方式导入一个角标的组件库，[详见 (opens new
window)](https://ext.dcloud.net.cn/plugin?id=21)，推荐使用 `easycom` 方式引入。

  1. **传统vue规范：** 在 index.vue 页面中，通过 `import` 方式引入组件 ，在 `components` 选项中定义你想要使用的组件。
```html
    	<!-- 在index.vue引入 uni-badge 组件-->
    	<template>
    		<view>
    			<uni-badge text="1"></uni-badge><!-- 3.使用组件 -->
    		</view>
    	</template>
    	<script>
    		import uniBadge from '@/components/uni-badge/uni-badge.vue';//1.导入组件（这步属于传统vue规范，但在uni-app的easycom下可以省略这步）
    		export default {
    			components:{uniBadge }//2.注册组件（这步属于传统vue规范，但在uni-app的easycom下可以省略这步） 
    		}
    	</script>
```

对于 `components` 对象中的每个 property 来说，其 property 名就是自定义元素的名字，其 property
值就是这个组件的选项对象。

在对象中放一个类似 uniBadge 的变量名其实是 uniBadge : uniBadge 的缩写，即这个变量名同时是：

  * 用在模板中的自定义元素的名称
  * 包含了这个组件选项的变量名(仅支持驼峰法命名)

  1. **通过uni-app的[easycom (opens new window)](https://uniapp.dcloud.io/collocation/pages?id=easycom)：** 将组件引入精简为一步。只要组件安装在项目的 `components` 目录下，并符合 `components/组件名称/组件名称.vue` 目录结构。就可以不用引用、注册，直接在页面中使用。
```html
    	<!-- 在index.vue引入 uni-badge 组件-->
    	<template>
    		<view>
    			<uni-badge text="1"></uni-badge><!-- 3.使用组件 -->
    		</view>
    	</template>
    	<script>
    		// 这里不用import引入，也不需要在components内注册uni-badge组件。template里就可以直接用
    		export default {
    			data() {
    				return {
    				}
    			}
    		}
    	</script>
```

  * **easycom是自动开启的** ，不需要手动开启，有需求时可以在 `pages.json` 的 `easycom` 节点进行个性化设置，[详见 (opens new window)](https://uniapp.dcloud.io/collocation/pages?id=easycom)。
  * 不管components目录下安装了多少组件，easycom打包后会自动剔除没有使用的组件，对组件库的使用尤为友好。

组件是 `vue` 技术中非常重要的部分，组件使得与ui相关的轮子可以方便的制造和共享，进而使得 `vue` 使用者的开发效率大幅提升。

`uni-app`
搭建了组件的插件市场，有很多现成的组件，若下载符合components/组件名称/组件名称.vue目录结构的组件，均可直接使用。[uni-app插件市场
(opens new window)](https://ext.dcloud.net.cn/)

> `uni-app`只支持 vue单文件组件（.vue 组件）。其他的诸如：动态组件，自定义 `render` ，和 `<script
> type="text/x-template">` 字符串模版等，在非H5端不支持

#### ref

被用来给元素或子组件注册引用信息，引用信息将会注册在父组件的 `$refs` 对象上。

如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：
```html
    <!-- 非H5端不支持通过this.$refs.content来获取view实例 -->
    <view ref="content">hello</view>
    
    <!-- 支持通过this.$refs.child来获取child-component实例 -->
    <child-component ref="child"></child-component>
```

当 `ref` 和 `v-for` 一起用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组

#### 小程序不支持列表

  * 作用域插槽（HBuilderX 3.1.19 以下仅支持解构插槽且不可使用作用域外数据以及使用复杂的表达式）
  * 动态组件
  * 异步组件
  * `inline-template`
  * `X-Templates`
  * `keep-alive`（App端也未支持）
  * `transition` （可使用 `animation` 或 CSS 动画替代）

#### 命名限制

在 uni-app 中以下这些作为保留关键字，不可作为组件名。

  * `a`
  * `canvas`
  * `cell`
  * `content`
  * `countdown`
  * `datepicker`
  * `div`
  * `element`
  * `embed`
  * `header`
  * `image`
  * `img`
  * `indicator`
  * `input`
  * `link`
  * `list`
  * `loading-indicator`
  * `loading`
  * `marquee`
  * `meta`
  * `refresh`
  * `richtext`
  * `script`
  * `scrollable`
  * `scroller`
  * `select`
  * `slider-neighbor`
  * `slider`
  * `slot`
  * `span`
  * `spinner`
  * `style`
  * `svg`
  * `switch`
  * `tabbar`
  * `tabheader`
  * `template`
  * `text`
  * `textarea`
  * `timepicker`
  * `transition-group`
  * `transition`
  * `video`
  * `view`
  * `web`

Tips

  * 除以上列表中的名称外，标准的 HTML 及 SVG 标签名也不能作为组件名。
  * 在百度小程序中使用时，不要在 data 内使用 hidden ，可能会导致渲染错误。
  * methods中不可使用与生命周期同名的方法名

### API

#### 全局配置

Vue 全局配置 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
Vue.config.silent | 取消 Vue 所有的日志与警告 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#silent) | √ | √ | √ |   
Vue.config.optionMergeStrategies | 自定义合并策略的选项 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#optionMergeStrategies) | √ | √ | √ |   
Vue.config.devtools | 配置是否允许 vue-devtools 检查代码 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#devtools) | √ | x | x | 只在Web环境下支持  
Vue.config.errorHandler | 指定组件的渲染和观察期间未捕获错误的处理函数 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#errorHandler) | √ | √ | √ |   
Vue.config.warnHandler | 为 Vue 的运行时警告赋予一个自定义处理函数 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#warnHandler) | √ | √ | √ |   
Vue.config.ignoredElements | 须使 Vue 忽略在 Vue 之外的自定义元素 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#ignoredElements) | √ | √ | √ | 强烈不推荐，会覆盖uni-app框架配置的内置组件  
Vue.config.keyCodes | 给 v-on 自定义键位别名 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#keyCodes) | √ | x | x |   
Vue.config.performance | 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#performance) | √ | x | x | 只在Web环境下支持  
Vue.config.productionTip | 设置为 false 以阻止 vue 在启动时生成生产提示 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#productionTip) | √ | √ | √ | -  
  
#### 全局 API

Vue 全局 API | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
Vue.extend | 使用基础 Vue 构造器，创建一个“子类” [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-extend) | √ | √ | x | 不可作为组件使用  
Vue.nextTick | 在下次 DOM 更新循环结束之后执行延迟回调 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-nextTick) | √ | x | x |   
Vue.set | 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-set) | √ | √ | √ |   
Vue.delete | 删除对象的 property。如果对象是响应式的，确保删除能触发更新视图 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-delete) | √ | √ | √ |   
Vue.directive | 注册或获取全局指令 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-directive) | √ | √ | x |   
Vue.filter | 注册或获取全局过滤器 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-filter) | √ | √ | x |   
Vue.component | 注册或获取全局组件。注册还会自动使用给定的 id 设置组件的名称 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-component) | √ | √ | √ |   
Vue.use | 安装 Vue.js 插件 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-use) | √ | √ | √ |   
Vue.mixin | 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-mixin) | √ | √ | √ |   
Vue.version | 提供字符串形式的 Vue 安装版本号 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-version) | √ | √ | √ |   
Vue.compile | 将一个模板字符串编译成 render 函数。只在完整版时可用。[详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-compile) | √ | x | x | uni-app使用的vue是只包含运行时的版本  
  
#### 选项

Vue 选项 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
data | Vue 实例的数据对象 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#data) | √ | √ | √ |   
props | props 可以是数组或对象，用于接收来自父组件的数据 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#props) | √ | √ | √ |   
propsData | 创建实例时传递 props。主要作用是方便测试 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#propsData) | √ | √ | √ |   
computed | 计算属性将被混入到 Vue 实例中 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#computed) | √ | √ | √ |   
methods | methods 将被混入到 Vue 实例中 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#methods) | √ | √ | √ |   
watch | 一个对象，键是需要观察的表达式，值是对应回调函数 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#watch) | √ | √ | √ |   
el | 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#el) | √ | x | x |   
template | 一个字符串模板作为 Vue 实例的标识使用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#template) | √ | x | x | uni-app使用的vue是只包含运行时的版本  
render | 字符串模板的代替方案，该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode。[详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#render) | √ | x | x |   
renderError | 当 render 函数遭遇错误时，提供另外一种渲染输出，只在开发者环境下工作 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#renderError) | √ | x | x |   
directives | 包含 Vue 实例可用指令的哈希表 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#directives) | √ | √ | x |   
filters | 包含 Vue 实例可用过滤器的哈希表 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#filters) | √ | √ | √ |   
components | 包含 Vue 实例可用组件的哈希表 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#components) | √ | √ | √ |   
parent | 指定已创建的实例之父实例，在两者之间建立父子关系 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#parent) | √ | √ | √ | 不推荐  
mixins | 选项接收一个混入对象的数组 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#mixins) | √ | √ | √ |   
extends | 允许声明扩展另一个组件 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#extends) | √ | √ | √ |   
provide/inject | 允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#provide-inject) | √ | √ | √ |   
name | 允许组件模板递归地调用自身 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#name) | √ | √ | √ |   
delimiters | 改变纯文本插入分隔符 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#delimiters) | √ | x | x |   
functional | 使组件无状态 (没有 data) 和无实例 (没有 this 上下文) [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#functional) | √ | x | x |   
model | 允许一个自定义组件在使用 v-model 时定制 prop 和 event [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#model) | √ | √ | x |   
inheritAttrs | inheritAttrs属性默认值为true，表示允许组件的根节点继承$attrs包含的属性 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#inheritAttrs) | √ | √ | x |   
comments | 当设为 true 时，将会保留且渲染模板中的 HTML 注释 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#comments) | √ | x | x | -  
  
#### 生命周期

生命周期钩子 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
beforeCreate | 在实例初始化之后被调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeCreate) | √ | √ | √ |   
created | 在实例创建完成后被立即调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#created) | √ | √ | √ |   
beforeMount | 在挂载开始之前被调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeMount) | √ | √ | √ |   
mounted | 挂载到实例上去之后调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#mounted) 注意：此处并不能确定子组件被全部挂载，如果需要子组件完全挂载之后在执行操作可以使用$nextTick [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#Vue-nextTick) | √ | √ | √ |   
beforeUpdate | 数据更新时调用，发生在虚拟 DOM 打补丁之前 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeUpdate) | √ | √ | √ |   
updated | 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#updated) | √ | √ | √ |   
activated | 被 keep-alive 缓存的组件激活时调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#activated) | √ | √ | x |   
deactivated | 被 keep-alive 缓存的组件停用时调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#deactivated) | √ | √ | x |   
beforeDestroy | 实例销毁之前调用。在这一步，实例仍然完全可用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeDestroy) | √ | √ | √ |   
destroyed | Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#destroyed) | √ | √ | √ |   
errorCaptured | 当捕获一个来自子孙组件的错误时被调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#errorCaptured) | √ | √ | √ | -  
  
#### 实例属性

Vue 实例属性 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
vm.$data | Vue 实例观察的数据对象 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-data) | √ | √ | √ |   
vm.$props | 当前组件接收到的 props 对象 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-props) | √ | √ | √ |   
vm.$el | Vue 实例使用的根 DOM 元素 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-el) | √ | x | x |   
vm.$options | 用于当前 Vue 实例的初始化选项 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-options) | √ | √ | √ |   
vm.$parent | 父实例，如果当前实例有的话 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-parent) | √ | √ | √ | H5端 `view`、`text` 等内置标签是以 Vue 组件方式实现，`$parent` 会获取这些到内置组件，导致的问题是 `this.$parent` 与其他平台不一致，解决方式是使用 `this.$parent.$parent` 获取或自定义组件根节点由 `view` 改为 `div`  
vm.$root | 当前组件树的根 Vue 实例 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-root) | √ | √ | √ |   
vm.$children | 当前实例的直接子组件 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-children) | √ | √ | √ | H5端 `view`、`text` 等内置标签是以 Vue 组件方式实现，`$children` 会获取到这些内置组件，导致的问题是 `this.$children` 与其他平台不一致，解决方式是使用 `this.$children.$children` 获取或自定义组件根节点由 `view` 改为 `div`  
vm.$slots | 用来访问被插槽分发的内容 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-slots) | √ | x | √ |   
vm.$scopedSlots | 用来访问作用域插槽 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-scopedSlots) | √ | √ | √ |   
vm.$refs | 一个对象，持有注册过 ref attribute 的所有 DOM 元素和组件实例[详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-refs) | √ | √ | √ | 非H5端只能用于获取自定义组件，不能用于获取内置组件实例（如：view、text）  
vm.$isServer | 当前 Vue 实例是否运行于服务器 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-isServer) | √ | √ | x | App端总是返回false  
vm.$attrs | 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-attrs) | √ | √ | x |   
vm.$listeners | 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-listeners) | √ | √ | x |   
  
#### 实例方法

实例方法 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
vm.$watch() | 观察 Vue 实例上的一个表达式或者一个函数计算结果的变化 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-watch) | √ | √ | √ |   
vm.$set() | 这是全局 Vue.set 的别名 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-set) | √ | √ | √ |   
vm.$delete() | 这是全局 Vue.delete 的别名 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-delete) | √ | √ | √ |   
vm.$on() | 监听当前实例上的自定义事件 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-on) | √ | √ | √ |   
vm.$once() | 监听一个自定义事件，但是只触发一次 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-once) | √ | √ | √ |   
vm.$off() | 移除自定义事件监听器 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-off) | √ | √ | √ |   
vm.$emit() | 触发当前实例上的事件 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-emit) | √ | √ | √ |   
vm.$mount() | 手动地挂载一个未挂载的实例 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-mount) | √ | x | x |   
vm.$forceUpdate() | 迫使 Vue 实例重新渲染 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-forceUpdate) | √ | √ | √ |   
vm.$nextTick() | 将回调延迟到下次 DOM 更新循环之后执行 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-nextTick) | √ | √ | √ |   
vm.$destroy() | 完全销毁一个实例 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-destroy) | √ | √ | √ | -  
  
#### 模板指令

Vue 指令 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
v-text | 更新元素的 textContent [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-text) | √ | √ | √ |   
v-html | 更新元素的 innerHTML [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-html) | √ | √ | x | 微信小程序会被转成 `rich-text`  
v-show | 根据表达式之真假值，切换元素的 display CSS属性 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-show) | √ | √ | √ |   
v-if | 根据表达式的值的 truthiness 来有条件地渲染元素 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-if) | √ | √ | √ |   
v-else | 为 v-if 或者 v-else-if 添加“else 块” [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-else) | √ | √ | √ |   
v-else-if | 表示 v-if 的“else if 块”。可以链式调用 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-else-if) | √ | √ | √ |   
v-for | 基于源数据多次渲染元素或模板块 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-for) | √ | √ | √ |   
v-on | 绑定事件监听器 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-on) | √ | √ | √ |   
v-bind | 动态地绑定一个或多个 attribute，或一个组件 prop 到表达式 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-bind) | √ | √ | √ |   
v-model | 在表单控件或者组件上创建双向绑定 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-model) | √ | √ | √ |   
v-pre | 跳过这个元素和它的子元素的编译过程 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-pre) | √ | √ | x |   
v-cloak | 这个指令保持在元素上直到关联实例结束编译 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-cloak) | √ | x | x |   
v-once | 只渲染元素和组件一次 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#v-once) | √ | √ | x | -  
  
#### 特殊属性

特殊属性 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
key | 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#key) | √ | √ | √ |   
ref | ref 被用来给元素或子组件注册引用信息 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#ref) | √ | √ | √ | 非 H5 平台只能获取 vue 组件实例不能获取到内置组件实例  
is | 用于动态组件且基于 DOM 内模板的限制来工作 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#is) | √ | √ (需传入 String 类型) | x | -  
  
#### 内置组件

内置组件 | 描述 | H5 | App端 | 小程序 | 说明  
---|---|---|---|---|---  
component | 渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#component) | √ | √ | x |   
transition | 作为单个元素/组件的过渡效果 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#transition) | √ | x | x |   
transition-group | 作为多个元素/组件的过渡效果 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#transition-group) | √ | x | x |   
keep-alive | 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#keep-alive) | √ | x | x |   
slot | 作为组件模板之中的内容分发插槽 [详情 (opens new window)](https://v2.cn.vuejs.org/v2/api/#slot) | √ | √ | √ | -  
template | 并不是一个组件，它仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性 [详情 (opens new window)](https://uniapp.dcloud.io/component/vue-component?id=template) | √ | √ | √ | -  
  
#### uni-app 全局变量的几种实现方式

**挂载 Vue.prototype**

将一些使用频率较高的常量或者方法，直接扩展到 Vue.prototype 上，每个 Vue 对象都会“继承”下来。

**注意这种方式只支持vue页面**

示例如下： 在 main.js 中挂载属性/方法
```javascript
    Vue.prototype.websiteUrl = 'http://uniapp.dcloud.io';  
    Vue.prototype.now = Date.now || function () {  
        return new Date().getTime();  
    };  
    Vue.prototype.isArray = Array.isArray || function (obj) {  
        return obj instanceof Array;  
    };
```

然后在 pages/index/index.vue 中调用
```javascript
    <script>  
        export default {  
            data() {  
                return {};  
            },  
            onLoad(){  
                console.log('now:' + this.now());  
            },  
            methods: {  
            }  
        }  
    </script>
```

这种方式，只需要在 main.js 中定义好即可在每个页面中直接调用。

**globalData**

小程序中有个globalData概念，可以在 App 上声明全局变量。 Vue 之前是没有这类概念的，但 uni-app
引入了globalData概念，并且在包括H5、App等平台都实现了。 在 App.vue 可以定义 globalData ，也可以使用 API
读写这个值。

globalData支持vue和nvue共享数据。

globalData是一种比较简单的全局变量使用方式。

定义：App.vue
```html
    <script>  
        export default {  
            globalData: {  
                text: 'text'  
            },  
            onLaunch: function() {  
                console.log('App Launch')  
            },  
            onShow: function() {  
                console.log('App Show')  
            },  
            onHide: function() {  
                console.log('App Hide')  
            }  
        }  
    </script>  
    
    <style>  
        /*每个页面公共css */  
    </style>  
```

js中操作globalData的方式如下：

赋值：`getApp().globalData.text = 'test'`

取值：`console.log(getApp().globalData.text) // 'test'`

如果需要把globalData的数据绑定到页面上，可在页面的onshow声明周期里进行变量重赋值。HBuilderX 2.0.3起，nvue页面在`uni-
app`编译模式下，也支持onshow。

**Vuex**

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

**HBuilderX 2.2.5+起，支持vue和nvue之间共享。[参考 (opens new
window)](https://uniapp.dcloud.io/use-
weex?id=vue-%E5%92%8C-nvue-%E5%85%B1%E4%BA%AB%E7%9A%84%E5%8F%98%E9%87%8F%E5%92%8C%E6%95%B0%E6%8D%AE)**

这里以登录后同步更新用户信息为例，简单说明下 Vuex 的用法，更多更详细的 Vuex 的内容，建议前往其官网 [Vuex (opens new
window)](https://vuex.vuejs.org/zh/) 学习下。

举例说明：

在 uni-app 项目根目录下新建 store 目录，在 store 目录下创建 index.js 定义状态值
```javascript
    const store = new Vuex.Store({  
        state: {  
            login: false,  
            token: '',  
            avatarUrl: '',  
            userName: ''  
        },  
        mutations: {  
            login(state, provider) {  
                console.log(state)  
                console.log(provider)  
                state.login = true;  
                state.token = provider.token;  
                state.userName = provider.userName;  
                state.avatarUrl = provider.avatarUrl;  
            },  
            logout(state) {  
                state.login = false;  
                state.token = '';  
                state.userName = '';  
                state.avatarUrl = '';  
            }  
        }  
    })
```

然后，需要在 main.js 挂载 Vuex
```javascript
    import store from './store'  
    Vue.prototype.$store = store
```

最后，在 pages/index/index.vue 使用
```javascript
    <script>  
        import {  
            mapState,  
            mapMutations  
        } from 'vuex';  
    
        export default {  
            computed: {  
                ...mapState(['avatarUrl', 'login', 'userName'])  
            },  
            methods: {  
                ...mapMutations(['logout'])  
            }  
        }  
    </script>
```

> .vue 和 .nvue 并不是一个规范，因此一些在 .vue 中适用的方案并不适用于 .nvue。 Vue 上挂载属性，不能在 .nvue 中使用

#### 其他配置

Vue 组件编译到小程序平台的时候会编译为对应平台的组件，部分小程序平台支持 options
选项（具体选项参考对应小程序平台文档的自定义组件部分），一般情况默认即可，如有特殊需求可在 Vue 组件中增加 options 属性。
```js
    export default {
      props: ['data'],
      data(){ return { } },
      options: {
        // 微信小程序中 options 选项
        multipleSlots: true, //  在组件定义时的选项中启动多slot支持，默认启用
        styleIsolation: "isolated",  //  启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
        addGlobalClass: true, //  表示页面样式将影响到自定义组件，但自定义组件中指定的样式不会影响页面。这个选项等价于设置 styleIsolation: apply-shared
        virtualHost: true,  //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
      }
    }
```

#### 常见问题

##### 如何获取上个页面传递的数据

在 onLoad 里得到，onLoad 的参数是其他页面打开当前页面所传递的数据

##### 如何设置全局的数据和全局的方法

uni-app 内置了 [Vuex (opens new window)](https://uniapp.dcloud.io/vue-vuex)
，在app里的使用，可参考 `hello-uniapp` `store/index.js`。
```js
    	//store.js
    	import Vue from 'vue'
    	import Vuex from 'vuex'
    	Vue.use(Vuex)
    	const store = new Vuex.Store({
    		state: {...},
    		mutations: {...},
    		actions: {...}
    	})
    
    	export default store
    
    	//main.js
    	...
    	import store from './store'
    	Vue.prototype.$store = store
    	const app = new Vue({
    		store,...
    	})
    	...
    
    	//test.vue 使用时：
    	import {mapState,mapMutations} from 'vuex'
```

##### 如何捕获 app 的 onError

由于 onError 并不是完整意义的生命周期，所以只提供一个捕获错误的方法，在 app 的根组件上添加名为 onError 的回调函数即可。如下
```javascript
    export default {
    	   // 只有 app 才会有 onLaunch 的生命周期
    		onLaunch () {
    		   // ...
    		},
    
    		// 捕获 app error
    		onError (err) {
    		   console.log(err)
    		}
    	}
```

#### 组件属性设置不生效解决办法

当重复设置某些属性为相同的值时，不会同步到view层。 例如：每次将scroll-view组件的scroll-
top属性值设置为0，只有第一次能顺利返回顶部。 这和props的单向数据流特性有关，组件内部scroll-
top的实际值改动后，其绑定的属性并不会一同变化。

解决办法有两种（以scroll-view组件为例）：

  1. 监听scroll事件，记录组件内部变化的值，在设置新值之前先设置为记录的当前值
```html
    <scroll-view scroll-y="true" :scroll-top="scrollTop" @scroll="scroll"></scroll-view>
```  
```javascript
    export default {
        data() {
            return {
                scrollTop: 0,
                old: {
                    scrollTop: 0
                }
            }
        },
        methods: {
            scroll: function(e) {
                this.old.scrollTop = e.detail.scrollTop
            },
            goTop: function(e) {
                this.scrollTop = this.old.scrollTop
                this.$nextTick(function() {
                    this.scrollTop = 0
                });
            }
        }
    }
```

  2. 监听`scroll`事件，获取组件内部变化的值，实时更新其绑定值
```html
    	<scroll-view scroll-y="true" :scroll-top="scrollTop" @scroll="scroll"></scroll-view>
```  
```js
    	export default {
    		data() {
    			return {
    				scrollTop: 0,
    			}
    		},
    		methods: {
    			scroll: function(e) {
    				// 如果使用此方法，请自行增加防抖处理
    				this.scrollTop = e.detail.scrollTop
    			},
    			goTop: function(e) {
    				this.scrollTop = 0
    			}
    		}
    	}
```

第二种解决方式在某些组件可能造成抖动，**推荐第一种解决方式**

#### 组合式 API

目前 uni-app（Vue2） 基于 Vue 2.6，组合式 API 由 [@vue/composition-api (opens new
window)](https://github.com/vuejs/composition-api) 支持，script setup 由
[unplugin-vue2-script-setup (opens new
window)](https://github.com/antfu/unplugin-vue2-script-setup) 支持

升级 uni-app 编译器到 3.6.8+

  * HBuilderX 创建的项目直接升级 HBuilderX 到最新版即可
  * CLI 创建的项目参考 https://uniapp.dcloud.net.cn/quickstart-cli.html#cliversion 升级依赖到最新版

  1. 在 main.js/ts 文件内增加安装 @vue/composition-api 插件。如果使用 nvue 页面，也需要在每个 nvue 页面安装，且每个 nvue 页面之间插件状态默认不会共享。
```js
    import Vue from 'vue'
    import App from './App.vue'
    
    Vue.config.productionTip = false
    
    import VueCompositionAPI from '@vue/composition-api'
    
    Vue.use(VueCompositionAPI)
    
    const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
    app.$mount()
```  
```js
    // pages/index.vue
    import { defineComponent } from '@vue/composition-api'
    import { onReady } from '@dcloudio/uni-app'
    export default defineComponent({
      setup() {
        onReady(() => {
          console.log('onReady')
        })
      }
    }
```

  2. 从 @vue/composition-api 包内导入并使用基础的组合式API，具体的兼容性仍需参考：[@vue/composition-api (opens new window)](https://github.com/vuejs/composition-api#browser-compatibility)。从 @dcloudio/uni-app 包内导入 uni-app 其他生命周期API。
```js
    import { defineComponent, ref } from '@vue/composition-api'
    import { onReady } from '@dcloudio/uni-app'
    export default defineComponent({
      setup() {
        const title = ref('Hello')
        onReady(() => {
          console.log('onReady')
        })
        return {
          title
        }
      }
    })
```

##### 使用 Script Setup

  1. 使用 npm/yarn 安装 unplugin-vue2-script-setup 插件，此插件暂不支持 nvue 页面。
```shell
    npm install unplugin-vue2-script-setup -D
    # or
    yarn add unplugin-vue2-script-setup -D
```

  1. 在 vue.config.js 配置 ScriptSetup 插件，以下为基础配置，其他具体配置请参考 [unplugin-vue2-script-setup (opens new window)](https://github.com/antfu/unplugin-vue2-script-setup)
```js
    const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default
    module.exports = {
      parallel: false,
      configureWebpack: {
        plugins: [
          ScriptSetup({ /* options */ }),
        ],
      },
      chainWebpack (config) {
        // disable type check and let `vue-tsc` handles it
        config.plugins.delete('fork-ts-checker')
      },
    }
```

  1. 改用 Script Setup 写法导入 API
```vue
    <script setup lang="ts">
    import { ref } from '@vue/composition-api'
    import { onReady } from '@dcloudio/uni-app'
    const title = ref('Hello')
    onReady(() => {
      console.log('onReady')
    })
    </script>
```
