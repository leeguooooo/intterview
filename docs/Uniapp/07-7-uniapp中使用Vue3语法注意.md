---
title: "uniapp中使用Vue3语法注意"
---

# 7 uniapp中使用Vue3语法注意

### 基础

`uni-app` 项目对 vue 3.0 的支持版本情况如下

  * Web平台：支持。
  * 小程序平台：`HBuilderX 3.3.3+` 编译器改为 `vite`，之前版本的编译器为`webpack`。
  * App 平台：`uni-app 3.2.5+`支持。`HBuilderX 3.3.13` 起 `nvue`编译器升级为`vite`

**注意事项**

  * vue3 响应式基于 `Proxy` 实现，不支持`iOS9`和`ie11`。
  * 暂不支持新增的 `Teleport`,`Suspense` 组件。
  * 目前 `HBuilderX 3.2` 起已预置，之前的版本只能使用`cli`方式

### 组件

#### 定义自定义事件

可以通过 `emits` 选项在组件上定义已发出的事件。
```js
    	// 在组件内
    	export default {
    		emits: ['in-focus', 'submit']
    	}
```

当在 `emits` 选项中定义了原生事件 (如 `click`) 时，将使用组件中的事件替代原生事件侦听器。

> 建议定义所有发出的事件，以便更好地记录组件应该如何工作。

示例
```html
    	<template>
    		<view>
    			<!-- 我是counter组件 -->
    			<view>counter的值是：{{count}}</view>
    			<button type="default" @click="add">+1</button>
    		</view>
    	</template>
    	<script>
    		export default {
    			//1.声明自定义事件：组件的自定义事件，必须事先声明在emits节点中
    			emits:['count-change'],
    			data() {
    				return {
    					count:0
    				};
    			},
    			methods:{
    				add(){
    					this.count++
    					//2.触发自定义事件：当点击+1按钮时，调用this.$emit()方法，触发自定义count-change事件
    					this.$emit('count-change')
    				}
    			}
    		}
    	</script>
```  
```html
    	<template>
    		<view>
    			<!-- 我是父组件 -->
    			<!-- 3、监听自定义事件：通过v-on的形式监听自定义事件 -->
    			<counter @count-change="getCount"></counter>
    		</view>
    	</template>
    	<script>
    		export default {
    			methods: {
    				getCount(){
    					console.log("触发了count-change自定义事件")
    				}
    			}
    		}
    	</script>
```

**验证抛出的事件**

与 `prop` 类型验证类似，如果使用对象语法而不是数组语法定义发出的事件，则可以验证它。

要添加验证，将为事件分配一个函数，该函数接收传递给 `$emit` 调用的参数，并返回一个布尔值以指示事件是否有效。
```js
    	export default {
    		emits: {
    			// 没有验证
    			click: null,
    
    			// 验证submit 事件
    			submit: ({ email, password }) => {
    				if (email && password) {
    					return true
    				} else {
    					console.warn('Invalid submit event payload!')
    					return false
    				}
    			}
    		},
    		methods: {
    			submitForm() {
    				this.$emit('submit', { email, password })
    			}
    		}
    	}
```

#### v-model 参数

默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 `prop` 和 `update:modelValue`
作为事件。我们可以通过向 `v-model` 传递参数来修改这些名称：
```html
    	<my-component v-model:foo="bar"></my-component>
```

在本例中，子组件将需要一个 foo prop 并发出 `update:foo` 要同步的事件：
```html
    	<template>
    		<view>
    			<input type="text" :value="foo" @input="$emit('update:foo', $event.target.value)" >
    		</view>
    	</template>
    	<script>
    		export default {
    			props: {
    			  foo: String
    			}
    		}
    	</script>
```  
```html
    	<my-component v-model:foo="bar"></my-component>
```

**示例**
```html
    	<template>
    		<view>
    			<view>父组件-count的值是：{{count}}</view>
    			<button type="default" @click="count +=1">+1</button>
    			<counter v-model:number="count"></counter>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					count:0
    				}
    			}
    		}
    	</script>
```  
```html
    	<!-- 我是counter组件 -->
    	<template>
    		<view>
    			  <view>子组件-count的值是：{{number}}</view>
    			  <button type="default" @click="add">+1</button>
    		</view>
    	</template>
    	<script>
    		export default {
    			props:['number'],
    			emits:['update:number'],
    			methods:{
    				add(){
    					this.$emit('update:number',this.number +1)//子组件通过this.$emit()方法修改number值
    				}
    			}
    		}
    	</script>
```

#### 多个 v-model 绑定

通过利用以特定 `prop` 和事件为目标的能力，正如我们之前在 `v-model` 参数中所学的那样，我们现在可以在单个组件实例上创建多个
`v-model` 绑定。

每个 `v-model` 将同步到不同的 `prop`，而不需要在组件中添加额外的选项：
```html
    <template>
    		<view>
    			<!-- 父组件 -->
    			<user-name
    			  v-model:first-name="firstName"
    			  v-model:last-name="lastName"
    			></user-name>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					firstName:"",
    					lastName:""
    				}
    			}
    		}
    	</script>
```  
```html
    	<!-- 我是user-name子组件 -->
    	<template>
    		<view>
    			<input type="text" :value="firstName" @input="$emit('update:firstName', $event.target.value)">
    			<input type="text" :value="lastName" @input="$emit('update:lastName', $event.target.value)">
    		</view>
    	</template>
    	<script>
    		export default {
    			props: {
    				firstName: String,
    				lastName: String
    			}
    		}
    	</script>
```

#### 处理 v-model 修饰符

让我们创建一个示例自定义修饰符 `capitalize`，它将 `v-model` 绑定提供的字符串的第一个字母大写。

添加到组件 `v-model` 的修饰符将通过 `modelModifiers` prop
提供给组件。在下面的示例中，我们创建了一个组件，其中包含默认为空对象的 `modelModifiers` prop。

请注意，当组件的 created 生命周期钩子触发时，`modelModifiers` prop 包含 `capitalize`，其值为
`true`——因为它被设置在 `v-model` 绑定 `v-model.capitalize="bar"`。
```html
    	<!-- 我是父组件 -->
    	<template>
    		<view>
    			<my-component v-model.capitalize="myText"></my-component>
    		</view>
    	</template>
    	<script>
    		export default {
    			data() {
    				return {
    					myText:""
    				}
    			}
    		}
    	</script>
```  
```html
    	<!-- 我是 my-component子组件-->
    	<template>
    		<view>
    			<input type="text" :value="modelValue" @input="emitValue" style="border: red solid 1px;">
    		</view>
    	</template>
    	<script>
    		export default {
    			props: {
    				modelValue: String,
    				modelModifiers: {
    					default: () => ({})
    				}
    			},
    			created() {
    				console.log(this.modelModifiers) // { capitalize: true }
    			},
    			methods: {
    				emitValue(e) {
    					let value = e.target.value
    					if (this.modelModifiers.capitalize) {
    						value = value.charAt(0).toUpperCase() + value.slice(1)
    					}
    					//charAt() 方法可返回指定位置的字符
    					//toUpperCase() 方法用于把字符串转换为大写
    					//slice() 方法可从已有的数组中返回选定的元素
    					console.log("value: ",value);
    					this.$emit('update:modelValue', value)
    				}
    			}
    		}
    	</script>
```

对于带参数的 `v-model` 绑定，生成的 `prop` 名称将为 `arg + "Modifiers"`：
```html
    	<my-component v-model:foo.capitalize="bar"></my-component>
```  
```html
    	<!-- 我是 my-component子组件-->
    	<template>
    		<view>
    			<input type="text"
    			  :value="foo"
    			  @input="$emit('update:foo', $event.target.value)">
    		</view>
    	</template>
    	<script>
    		export default {
    			props: ['foo', 'fooModifiers'],
    			created() {
    			  console.log(this.fooModifiers) // { capitalize: true }
    			}
    		}
    	</script>
```

#### 插槽

##### 具名插槽

有时我们需要多个插槽。例如对于一个带有如下模板的 `base-layout` 组件：
```html
    	<!-- base-layout组件 -->
    	<view class="container">
    		<header>
    		<!-- 我们希望把页头放这里 -->
    		</header>
    		<main>
    		<!-- 我们希望把主要内容放这里 -->
    		</main>
    		<footer>
    		<!-- 我们希望把页脚放这里 -->
    		</footer>
    	</view>
```

对于这样的情况，`slot` 元素有一个特殊的 `attribute：name`。这个 `attribute` 可以用来定义额外的插槽：
```html
    	<view class="container">
    		<header>
    			<slot name="header"></slot>
    		</header>
    		<main>
    			<slot></slot>
    		</main>
    		<footer>
    			<slot name="footer"></slot>
    		</footer>
    	</view>
```

**一个不带`name` 的 `slot` 出口会带有隐含的名字`“default”`。**

在向具名插槽提供内容的时候，我们可以在一个 `template` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：
```html
    	<template>
    		<view>
    		<!-- 父组件使用子组件`<base-layout>`，节点上使用v-slot特性： -->
    			<base-layout>
    				<template v-slot:header>
    					<view>Here might be a page title</view>
    				</template>
    				<template v-slot:default>
    					<view>A paragraph for the main content.</view>
    					<view>And another one.</view>
    				</template>
    				<template v-slot:footer>
    					<view>Here's some contact info</view>
    				</template>
    			</base-layout>
    		</view>
    	</template>
```

现在 `template` 元素中的所有内容都将会被传入相应的插槽。

渲染的 `HTML` 将会是：
```html
    	<div class="container">
    		<header>
    			<div>Here might be a page title</div>
    		</header>
    		<main>
    			<div>A paragraph for the main content.</div>
    			<div>And another one.</div>
    		</main>
    		<footer>
    			<div>Here's some contact info</div>
    		</footer>
    	</div>
```

注意，`v-slot` 只能添加在 `template` 上 (只有一种例外情况)

**具名插槽的缩写**

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 **#** 。例如
`v-slot:header` 可以被重写为 `#header`：
```html
    	<base-layout>
    		<template #header>
    			<view>Here might be a page title</view>
    		</template>
    
    		<template #default>
    			<view>A paragraph for the main content.</view>
    			<view>And another one.</view>
    		</template>
    
    		<template #footer>
    			<view>Here's some contact info</view>
    		</template>
    	</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：
```html
    	<!-- This will trigger a warning -->
    	<todo-list #="{ item }">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ item }}</view>
    	</todo-list>
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：
```html
    	<todo-list #default="{ item }">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ item }}</view>
    	</todo-list>
```

##### 作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。当一个组件被用来渲染一个项目数组时，这是一个常见的情况，我们希望能够自定义每个项目的渲染方式。

例如，我们有一个组件，包含 `todo-items` 的列表。
```html
    <template>
    	<view>
    		<view v-for="(item, index) in items">
            {{ item }}
          </view>
    	</view>
    </template>
    <script>
    	export default {
    		data() {
    			return {
    				items: ['Feed a cat', 'Buy milk']
    			};
    		}
    	}
    </script>
```

我们可能需要替换插槽以在父组件上自定义它：
```html
    	<todo-list>
    		<i class="fas fa-check">before--</i>
    		<view class="green">{{ item }}</view>
    	</todo-list>
```

但是，这是行不通的，因为只有 `todo-list` 组件可以访问 `item`，我们将从其父组件提供槽内容。

要使 `item` 可用于父级提供的 `slot` 内容，我们可以添加一个 `slot` 元素并将其绑定为属性：
```html
    <template>
    	<view>
    		<view v-for="(item, index) in items">
    		   <slot :item="item"></slot>
    		</view>
    	</view>
    </template>
    <script>
    	export default {
    		data() {
    			return {
    				items: ['Feed a cat', 'Buy milk']
    			}
    		}
    	}
    </script>
```

绑定在 `slot` 元素上的 `attribute` 被称为**插槽 prop** 。现在在父级作用域中，我们可以使用带值的 `v-slot`
来定义我们提供的插槽 `prop` 的名字：
```html
    <template>
    	<view>
    		<todo-list>
    			<template v-slot:default="slotProps">
    				<i class="fas fa-check"></i>
    				<view class="green">{{ slotProps.item }}</view>
    			</template>
    		</todo-list>
    	</view>
    </template>
```

![](/images/s_poetries_work_uploads_2023_06_3f31c0ea3122de49.webp)

在这个例子中，我们选择将包含所有插槽 `prop` 的对象命名为 `slotProps`，但你也可以使用任意你喜欢的名字。

**独占默认插槽的缩写语法**

在上述情况下，当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：
```html
    	<todo-list v-slot:default="slotProps">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ slotProps.item }}</view>
    	</todo-list>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：
```html
    	<todo-list v-slot="slotProps">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ slotProps.item }}</view>
    	</todo-list>
```

注意**默认插槽的缩写语法不能和具名插槽混用** ，因为它会导致作用域不明确：
```html
    <!-- 无效，会导致警告 -->
    	<todo-list v-slot="slotProps">
    		<todo-list v-slot:default="slotProps">
    			<i class="fas fa-check"></i>
    			<view class="green">{{ slotProps.item }}</view>
    		</todo-list>
    		<template v-slot:other="otherSlotProps">
    			slotProps is NOT available here
    		</template>
    	</todo-list>
```

只要出现多个插槽，请始终为所有的插槽使用完整的基于 `template` 的语法：
```html
    	<todo-list>
    		<template v-slot:default="slotProps">
    			<i class="fas fa-check"></i>
    			<view class="green">{{ slotProps.item }}</view>
    		</template>
    
    		<template v-slot:other="otherSlotProps">
    			...
    		</template>
    	</todo-list>
```

**解构插槽 Prop**

作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：
```js
    function (slotProps) {
      // ... 插槽内容 ...
    }
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 `JavaScript` 表达式。你也可以使用 [ES2015 (opens
new window)](https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring)
解构来传入具体的插槽 `prop`，如下：
```html
    	<todo-list v-slot="{ item }">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ item }}</view>
    	</todo-list>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 `prop` 的时候。它同样开启了 `prop` 重命名等其它可能，例如将 `item` 重命名为
`todo`：
```html
    	<todo-list v-slot="{ item: todo }">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ todo }}</view>
    	</todo-list>
```

你甚至可以定义后备内容，用于插槽 `prop` 是 `undefined` 的情形：
```html
    	<todo-list v-slot="{ item = 'Placeholder' }">
    		<i class="fas fa-check"></i>
    		<view class="green">{{ item }}</view>
    	</todo-list>
```

### API

#### 应用配置

`config` 是一个包含了 `Vue` 应用全局配置的对象。你可以在应用挂载前修改其以下 `property`：
```js
    const app = Vue.createApp({})
    
    app.config = {...}
```应用配置 | 描述 | H5 | App端 | 微信小程序 | 说明  
---|---|---|---|---|---  
errorHandler | 指定一个处理函数，来处理组件渲染方法执行期间以及侦听器抛出的未捕获错误。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#errorhandler) | √ | √ | √ |   
warnHandler | 为 `Vue` 的运行时警告指定一个自定义处理函数。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#warnhandler) | √ | √ | √ |   
globalProperties | 添加可以在应用程序内的任何组件实例中访问的全局 `property`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#globalproperties) | √ | √ | √ |   
isCustomElement | 指定一个方法，用来识别在 `Vue` 之外定义的自定义元素。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#iscustomelement) | √ | √ | √ |   
optionMergeStrategies | 为自定义选项定义合并策略。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#optionmergestrategies) | √ | √ | √ |   
performance | 设置为 `true` 以在浏览器开发工具的 `performance/timeline` 面板中启用对组件初始化、编译、渲染和更新的性能追踪。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-config.html#performance) | √ | x | x | 只在Web环境下支持  
  
#### 应用 API

在 Vue 3 中，改变全局 `Vue` 行为的 `API` 现在被移动到了由新的 `createApp`
方法所创建的应用实例上。此外，现在它们的影响仅限于该特定应用实例：
```js
    import { createApp } from 'vue'
    
    const app = createApp({})
```

调用 `createApp` 返回一个应用实例。该实例提供了一个应用上下文。应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在 `Vue
2.x` 中“全局”的配置。

另外，由于 `createApp` 方法返回应用实例本身，因此可以在其后链式调用其它方法，这些方法可以在以下部分中找到。

应用 API | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
component | 注册或检索全局组件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#component) | √ | √ | √  
config | 包含应用配置的对象。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#config) | √ | √ | √  
directive | 注册或检索全局指令。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#directive) | √ | √ | x  
mixin | 在整个应用范围内应用混入。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#mixin) | √ | √ | √  
provide | 设置一个可以被注入到应用范围内所有组件中的值。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#provide) | √ | √ | √  
use | 安装 `Vue.js` 插件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/application-api.html#use) | √ | √ | √  
  
#### 全局 API

全局 API | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
createApp | 返回一个提供应用上下文的应用实例。应用实例挂载的整个组件树共享同一个上下文。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#createapp) | √ | √ | √  
h | 返回一个”虚拟节点“，通常缩写为 `VNode`：一个普通对象，其中包含向 `Vue` 描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#h) | √ | x | x  
defineComponent | 从实现上看，`defineComponent` 只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、`TSX` 和 `IDE` 工具支持。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#definecomponent) | √ | x | x  
defineAsyncComponent | 创建一个只有在需要时才会加载的异步组件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent) | √ | x | x  
resolveComponent | 如果在当前应用实例中可用，则允许按名称解析 `component`。返回一个 `Component`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#resolvecomponent) | √ | x | x  
resolveDynamicComponent | 允许使用与 `component :is=""` 相同的机制来解析一个 `component`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#resolvedynamiccomponent) | √ | x | x  
resolveDirective | 如果在当前应用实例中可用，则允许通过其名称解析一个 `directive`。返回一个 `Directive`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#resolvedirective) | √ | x | x  
withDirectives | 允许将指令应用于 `VNode`。返回一个包含应用指令的 `VNode`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#withdirectives) | √ | x | x  
createRenderer | createRenderer 函数接受两个泛型参数： `HostNode` 和 `HostElement`，对应于宿主环境中的 `Node` 和 `Element` 类型。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#createrenderer) | √ | x | x  
nextTick | 将回调推迟到下一个 `DOM` 更新周期之后执行。在更改了一些数据以等待 `DOM` 更新后立即使用它。[详情 (opens new window)](https://v3.cn.vuejs.org/api/global-api.html#nexttick) | √ | x | x  
  
#### 选项/Data

Data | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
data | 返回组件实例的 `data` 对象的函数。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html) | √ | √ | √  
props | `props` 可以是数组或对象，用于接收来自父组件的数据。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html#props) | √ | √ | √  
computed | 计算属性将被混入到组件实例中。所有 `getter` 和 `setter` 的 `this` 上下文自动地绑定为组件实例。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html#computed) | √ | √ | √  
methods | methods 将被混入到组件实例中。可以直接通过 `VM` 实例访问这些方法，或者在指令表达式中使用。方法中的 `this` 自动绑定为组件实例。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html#methods) | √ | √ | √  
watch | 一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html#watch) | √ | √ | √  
emits | emits 可以是数组或对象，从组件触发自定义事件，`emits` 可以是简单的数组，或者对象作为替代，允许配置和事件验证。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-data.html#emits) | √ | √ | √  
  
#### 选项/DOM

DOM | 描述 | H5 | App端 | 微信小程序 | 说明  
---|---|---|---|---|---  
template | 一个字符串模板作为 `component` 实例的标识使用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-dom.html#template) | √ | x | x | uni-app使用的vue是只包含运行时的版本  
render | 字符串模板的另一种选择，允许你充分利用 `JavaScript` 的编程功能。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-dom.html#render) | √ | x | x | -  
  
#### 选项/生命周期钩子

生命周期钩子 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
beforeCreate | 在实例初始化之后，数据观测`(data observer)`和 `event/watcher` 事件配置之前被调用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforecreate) | √ | √ | √  
created | 在实例创建完成后被立即调用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#created) | √ | √ | √  
beforeMount | 在挂载开始之前被调用：相关的 `render` 函数首次被调用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforemount) | √ | √ | √  
mounted | 实例被挂载后调用，这时 `Vue.createApp({}).mount()` 被新创建的 `vm.$el` 替换了。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#mounted) | √ | √ | √  
beforeUpdate | 数据更新时调用，发生在虚拟 `DOM` 打补丁之前。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeupdate) | √ | √ | √  
updated | 由于数据更改导致的虚拟 `DOM` 重新渲染和打补丁，在这之后会调用该钩子。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#updated) | √ | √ | √  
activated | 被 `keep-alive` 缓存的组件激活时调用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#activated) | √ | √ | x  
deactivated | 被 `keep-alive` 缓存的组件停用时调用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#deactivated) | √ | √ | x  
beforeUnmount | 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforeunmount) | √ | √ | √  
unmounted | 卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#unmounted) | √ | √ | √  
errorCaptured | 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#errorcaptured) | √ | √ | √  
renderTracked | 跟踪虚拟 `DOM` 重新渲染时调用。钩子接收 `debugger event` 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertracked) | √ | √ | √  
renderTriggered | 当虚拟 `DOM` 重新渲染为 `triggered.Similarly` 为`renderTracked`，接收 `debugger event` 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertriggered) | √ | √ | √  
  
#### 选项/资源

资源 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
directives | 包含组件实例可用指令的哈希表。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-assets.html#directives) | √ | √ | x  
components | 包含组件实例可用组件的哈希表。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-assets.html#components) | √ | √ | √  
  
#### 选项/组合

组合 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
mixins | 接收一个混入对象的数组。这些混入对象可以像正常的实例对象一样包含实例选项，这些选项将会被合并到最终的选项中，使用特定的选项合并逻辑。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-composition.html#mixins) | √ | √ | √  
extends | 允许声明扩展另一个组件 (可以是一个简单的选项对象或构造函数)。这主要是为了便于扩展单文件组件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-composition.html#extends) | √ | √ | √  
provide / inject | 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-composition.html#provide-inject) | √ | √ | √  
setup | `setup` 函数是一个新的组件选项。它作为在组件内部使用组合式 `API` 的入口点。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-composition.html#setup) | √ | √ | √  
  
#### 选项/杂项

杂项 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
name | 允许组件模板递归地调用自身。注意，组件在全局用 `Vue.createApp({}).component({})` 注册时，全局 `ID` 自动作为组件的 `name`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-misc.html#name) | √ | √ | √  
delimiters | 设置用于模板内文本插入的分隔符。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-misc.html#delimiters) | √ | x | x  
inheritAttrs | 默认情况下父作用域的不被认作 `props` 的 `attribute` 绑定 (`attribute bindings`) 将会“回退”且作为普通的 `HTML attribute` 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，通过设置 `inheritAttrs` 到 `false`，这些默认行为将会被去掉。[详情 (opens new window)](https://v3.cn.vuejs.org/api/options-misc.html#inheritattrs) | √ | √ | x  
  
#### 实例 property

实例 property | 描述 | H5 | App端 | 微信小程序 | 说明  
---|---|---|---|---|---  
$data | 组件实例观察的数据对象。组件实例代理了对其 `data` 对象 `property` 的访问。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#data) | √ | √ | √ |   
$props | 当前组件接收到的 `props` 对象。组件实例代理了对其 `props` 对象 `property` 的访问。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#props) | √ | √ | √ |   
$el | 组件实例使用的根 `DOM` 元素。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#el) | √ | x | x |   
$options | 用于当前组件实例的初始化选项。需要在选项中包含自定义 `property` 时会有用处。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#options) | √ | √ | √ |   
$parent | 父实例，如果当前实例有的话。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#parent) | √ | √ | √ | H5端 `view`、`text` 等内置标签是以 `Vue` 组件方式实现，`$parent` 会获取这些到内置组件，导致的问题是 `this.$parent` 与其他平台不一致，解决方式是使用 `this.$parent.$parent` 获取或自定义组件根节点由 `view` 改为 `div`  
$root | 当前组件树的根组件实例。如果当前实例没有父实例，此实例将会是其自己。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#root) | √ | √ | √ |   
$slots | 用来访问被插槽分发的内容。每个具名插槽有其相应的 `property` (例如：`v-slot:foo` 中的内容将会在 `this.$slots.foo` 中被找到)。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#slots) | √ | x | √ |   
$refs | 一个对象，持有注册过 `ref attribute` 的所有 `DOM` 元素和组件实例。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#refs) | √ | √ | √ | 非H5端只能用于获取自定义组件，不能用于获取内置组件实例（如：`view`、`text`）  
$attrs | 包含了父作用域中不作为组件 `props` 或自定义事件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-properties.html#attrs) | √ | √ | x | -  
  
#### 实例方法

实例方法 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
$watch | 侦听组件实例上的响应式 `property` 或函数计算结果的变化。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-methods.html#watch) | √ | √ | √  
$emit | 触发当前实例上的事件。附加参数都会传给监听器回调。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-methods.html#emit) | √ | √ | √  
$forceUpdate | 迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-methods.html#forceupdate) | √ | √ | √  
$nextTick | 将回调延迟到下次 `DOM` 更新循环之后执行。在修改数据之后立即使用它，然后等待 `DOM` 更新。[详情 (opens new window)](https://v3.cn.vuejs.org/api/instance-methods.html#nexttick) | √ | √ | √  
  
#### 指令

Vue 指令 | 描述 | H5 | App端 | 微信小程序 | 说明  
---|---|---|---|---|---  
v-text | 更新元素的 `textContent`。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-text) | √ | √ | x |   
v-html | 更新元素的 `innerHTML`。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-html) | √ | √ | √ | 微信小程序会被转成 `rich-text`  
v-show | 根据表达式的真假值，切换元素的 `display CSS property`。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-show) | √ | √ | √ |   
v-if | 根据表达式的真假值来有条件地渲染元素。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-if) | √ | √ | √ |   
v-else | 为 `v-if` 或者 `v-else-if` 添加`“else 块”`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-else) | √ | √ | √ |   
v-else-if | 表示 `v-if` 的`“else if 块”`。可以链式调用。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-else-if) | √ | √ | √ |   
v-for | 基于源数据多次渲染元素或模板块。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-for) | √ | √ | √ |   
v-on | 绑定事件监听器。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-on) | √ | √ | √ |   
v-bind | 动态地绑定一个或多个 `attribute`，或一个组件 `prop` 到表达式。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-bind) | √ | √ | √ |   
v-model | 在表单控件或者组件上创建双向绑定。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-model) | √ | √ | √ |   
v-slot | 提供具名插槽或需要接收 `prop` 的插槽。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-slot) | √ | √ | √ |   
v-pre | 跳过这个元素和它的子元素的编译过程。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-pre) | √ | √ | x |   
v-cloak | 这个指令保持在元素上直到关联组件实例结束编译。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-cloak) | √ | x | x |   
v-once | 只渲染元素和组件一次。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-once) | √ | √ | x |   
v-is | 在 `DOM` 内模板使用时，模板受原生 `HTML` 解析规则的约束。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/directives.html#v-is) | √ | x | x | -  
  
#### 特殊属性

特殊属性 | 描述 | H5 | App端 | 微信小程序 | 说明  
---|---|---|---|---|---  
key | `key` 的特殊 `attribute` 主要用在 `Vue` 的虚拟 `DOM` 算法，在新旧 `nodes` 对比时辨识 `VNodes`。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/special-attributes.html#key) | √ | √ | √ |   
ref | ref 被用来给元素或子组件注册引用信息。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/special-attributes.html#ref) | √ | √ | √ | 非 H5 平台只能获取 `vue` 组件实例不能获取到内置组件实例  
is | 使用[动态组件 (opens new window)](https://v3.cn.vuejs.org/guide/component-dynamic-async.html)。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/special-attributes.html#is) | √ | √ | x | -  
  
#### 内置组件

内置组件 | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
component | 渲染一个“元组件”为动态组件。依 `is` 的值，来决定哪个组件被渲染。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#component) | √ | √ | x  
transition | 作为单个元素/组件的过渡效果。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#transition) | √ | x | x  
transition-group | 作为多个元素/组件的过渡效果。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#transition-group) | √ | x | x  
keep-alive | 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们，主要用于保留组件状态或避免重新渲染。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive) | √ | x | x  
slot | 作为组件模板之中的内容分发插槽。`slot` 元素自身将被替换。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#slot) | √ | √ | √  
teleport | 将模板的一部分移动到 `DOM` 中 `Vue app` 之外的其他位置。 [详情 (opens new window)](https://v3.cn.vuejs.org/api/built-in-components.html#teleport) | √ | x | x  
  
#### 响应性 API

##### 响应性基础 API

响应性基础 API | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
reactive | 返回对象的响应式副本。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) | √ | √ | √  
readonly | 获取一个对象 (响应式或纯对象) 或 `ref` 并返回原始代理的只读代理。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly) | √ | √ | √  
isProxy | 检查对象是 `reactive` 还是 `readonly`创建的代理。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#isproxy) | √ | √ | √  
isReactive | 检查对象是否是 `reactive`创建的响应式 `proxy`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#isreactive) | √ | √ | √  
isReadonly | 检查对象是否是由`readonly`创建的只读代理。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#isreadonly) | √ | √ | √  
toRaw | 返回 `reactive` 或 `readonly` 代理的原始对象。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#toraw) | √ | √ | √  
markRaw | 标记一个对象，使其永远不会转换为代理。返回对象本身。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#markraw) | √ | √ | √  
shallowReactive | 创建一个响应式代理，该代理跟踪其自身 `property` 的响应性，但不执行嵌套对象的深度响应式转换 (暴露原始值)。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#shallowreactive) | √ | √ | √  
shallowReadonly | 创建一个代理，使其自身的 `property` 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。[详情 (opens new window)](https://v3.cn.vuejs.org/api/basic-reactivity.html#shallowreadonly) | √ | √ | √  
  
##### Refs

Refs | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
ref | 接受一个内部值并返回一个响应式且可变的 `ref` 对象。`ref` 对象具有指向内部值的单个 property `.value`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#ref) | √ | √ | √  
unref | 如果参数为 `ref`，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#unref) | √ | √ | √  
toRef | 可以用来为源响应式对象上的 `property` 性创建一个 `ref`。然后可以将 `ref` 传递出去，从而保持对其源 `property` 的响应式连接。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#toref) | √ | √ | √  
toRefs | 将响应式对象转换为普通对象，其中结果对象的每个 `property` 都是指向原始对象相应 `property` 的`ref`。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#torefs) | √ | √ | √  
isRef | 检查值是否为`ref`对象[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#isref) | √ | √ | √  
customRef | 创建一个自定义的 `ref`，并对其依赖项跟踪和更新触发进行显式控制。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#customref) | √ | √ | √  
shallowRef | 创建一个 `ref`，它跟踪自己的 `.value` 更改，但不会使其值成为响应式的。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#shallowref) | √ | √ | √  
triggerRef | 手动执行与 `shallowRef` 关联的任何效果。[详情 (opens new window)](https://v3.cn.vuejs.org/api/refs-api.html#triggerref) | √ | √ | √  
  
#### Computed 与 watch

Computed 与 watch | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
computed | 使用 `getter` 函数，并为从 `getter` 返回的值返回一个不变的响应式 `ref` 对象。[详情 (opens new window)](https://v3.cn.vuejs.org/api/computed-watch-api.html#computed) | √ | √ | √  
watchEffect | 在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。[详情 (opens new window)](https://v3.cn.vuejs.org/api/computed-watch-api.html#watcheffect) | √ | √ | √  
watch | `watch` API 与选项式 API `this.$watch` (以及相应的 `watch` 选项) 完全等效。`watch` 需要侦听特定的 `data` 源，并在单独的回调函数中副作用。[详情 (opens new window)](https://v3.cn.vuejs.org/api/computed-watch-api.html#watch) | √ | √ | √  
  
#### 组合式 API

组合式 API | 描述 | H5 | App端 | 微信小程序  
---|---|---|---|---  
setup | 一个组件选项，在创建组件之前执行，一旦 `props` 被解析，并作为组合式 `API` 的入口点。[详情 (opens new window)](https://v3.cn.vuejs.org/api/composition-api.html#setup) | √ | √ | √  
生命周期钩子 | 可以使用直接导入的 `onX` 函数注册生命周期钩子。[详情 (opens new window)](https://v3.cn.vuejs.org/api/composition-api.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90) | √ | √ | √  
Provide / Inject | provide 和 inject 启用依赖注入。只有在使用当前活动实例的 `setup()` 期间才能调用这两者。[详情 (opens new window)](https://v3.cn.vuejs.org/api/composition-api.html#provide-inject) | √ | √ | √  
getCurrentInstance | 允许访问对高级使用或库创建者有用的内部组件实例。[详情 (opens new window)](https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance) | √ | √ | √
