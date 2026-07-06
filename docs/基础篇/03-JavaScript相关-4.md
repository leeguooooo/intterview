---
title: "JavaScript相关 4"
---

# 三、JavaScript相关（4/4）

### 105 区分什么是“客户区坐标”、“页面坐标”、“屏幕坐标”

  * 客户区坐标：鼠标指针在可视区中的水平坐标(`clientX`)和垂直坐标(`clientY`)
  * 页面坐标：鼠标指针在页面布局中的水平坐标(`pageX`)和垂直坐标(`pageY`)
  * 屏幕坐标：设备物理屏幕的水平坐标(`screenX`)和垂直坐标(`screenY`)
```html
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          height: 2000px;
        }
        #box {
          width: 200px;
          height: 200px;
          background-color: red;
          position: absolute;
          left: 100px;
          top: 100px;
        }
      </style>
    </head>
    <body>
      <div id="box"></div>
    
      <script>
        document.addEventListener('mousemove', function(event) {
          console.log('客户区坐标：', event.clientX, event.clientY);
          console.log('页面坐标：', event.pageX, event.pageY);
          console.log('屏幕坐标：', event.screenX, event.screenY);
        });
      </script>
    </body>
    </html>
```

**如何获得一个DOM元素的绝对位置？**

  * `elem.offsetLeft`：返回元素相对于其定位父级左侧的距离
  * `elem.offsetTop`：返回元素相对于其定位父级顶部的距离
  * `elem.getBoundingClientRect()`：返回一个`DOMRect`对象，包含一组描述边框的只读属性，单位像素
```html
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        #container {
          width: 500px;
          height: 500px;
          position: relative;
          border: 1px solid black;
        }
        #box {
          width: 100px;
          height: 100px;
          background-color: red;
          position: absolute;
          left: 200px;
          top: 200px;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <div id="box"></div>
      </div>
    
      <script>
        var box = document.getElementById('box');
        
        var offsetLeft = box.offsetLeft;
        var offsetTop = box.offsetTop;
        console.log('offsetLeft:', offsetLeft);
        console.log('offsetTop:', offsetTop);
        
        var rect = box.getBoundingClientRect();
        console.log('rect:', rect);
        console.log('left:', rect.left);
        console.log('top:', rect.top);
      </script>
    </body>
    </html>
```

### 106 Javascript垃圾回收方法

正常情况下，现代的 JavaScript 引擎会使用标记清除（mark and sweep）算法作为主要的垃圾回收方法。引用计数（reference
counting）在某些老旧的 JavaScript 引擎中可能会被使用。

**标记清除（mark and sweep）是 JavaScript 中最常见的垃圾回收算法，其工作原理如下：**

  1. 垃圾回收器会在运行时给存储在内存中的所有变量加上标记。
  2. 垃圾回收器会从根对象开始，递归遍历所有的引用，标记它们为“进入环境”。
  3. 在遍历完成后，垃圾回收器会对未被标记的变量进行清除，即将其回收内存空间。
  4. 被清除的内存空间将被重新分配给后续的变量使用。
```javascript
    function foo() {
      var x = { name: 'poetry' };
      var y = { name: 'Jane' };
      
      // 循环引用，x 引用了 y，y 引用了 x
      x.ref = y;
      y.ref = x;
      
      // x 和 y 不再被使用，将被标记为垃圾
      x = null;
      y = null;
      
      // 垃圾回收器在适当的时机会清理循环引用的对象
    }
    
    // 调用函数触发垃圾回收
    foo();
```

**引用计数（reference counting）是一种简单的垃圾回收算法，其工作原理如下：**

  1. 对于每个对象，引擎会维护一个引用计数器，用于记录当前有多少个引用指向该对象。
  2. 当一个引用指向对象时，引用计数器加一；当一个引用不再指向对象时，引用计数器减一。
  3. 当引用计数器为零时，说明该对象没有被引用，可以将其回收内存空间。
  4. 引用计数算法容易出现循环引用的问题，即两个或多个对象互相引用，但没有被其他对象引用，导致引用计数器无法归零，造成内存泄漏。

值得注意的是，现代的 JavaScript
引擎往往会采用更高级的垃圾回收算法，如基于分代的垃圾回收和增量标记等，以提高垃圾回收的效率和性能。以上所述的标记清除和引用计数仅是简单的介绍，实际的垃圾回收算法比较复杂，并涉及到更多的优化和细节。
```javascript
    // 引用计数无法处理循环引用问题，这里只作演示
    function foo() {
      var x = { name: 'poetry' };
      var y = { name: 'Jane' };
      
      // x 和 y 引用计数均为 1
      var refCountX = 1;
      var refCountY = 1;
      
      // 循环引用，x 引用了 y，y 引用了 x
      x.ref = y;
      y.ref = x;
      
      // x 和 y 不再被使用，引用计数减一
      refCountX--;
      refCountY--;
      
      // 当引用计数为零时，垃圾回收器可以清理对象
      if (refCountX === 0) {
        // 清理 x 对象的内存
        x = null;
      }
      
      if (refCountY === 0) {
        // 清理 y 对象的内存
        y = null;
      }
    }
    
    // 调用函数触发垃圾回收
    foo();
```

请注意，上述示例中的引用计数示例仅为演示目的，并未解决循环引用导致的内存泄漏问题。在实际开发中，为了避免内存泄漏，需要使用更高级的垃圾回收算法和技术，或者手动解除循环引用。

### 107 请解释一下 JavaScript 的同源策略

> 同源策略（Same-Origin
> Policy）是浏览器中一种重要的安全机制，用于限制来自不同源（`协议、域名、端口`）的脚本对当前文档的访问权限。同源策略的作用是保护用户的信息安全，防止恶意网站获取敏感数据或进行跨站攻击。

**同源策略限制了以下行为：**

  1. 脚本访问跨源文档的 DOM：通过脚本在页面中嵌入的 iframe 元素加载的跨源文档无法通过脚本访问其 DOM，除非目标文档明确允许。
  2. 脚本读取跨源文档的内容：通过脚本在页面中嵌入的 iframe 元素加载的跨源文档无法通过脚本读取其内容，包括读取属性、执行方法等。
  3. 脚本发送跨源 AJAX 请求：脚本无法直接发送跨源的 AJAX 请求，只能向同源的服务器发送请求。
  4. `Cookie`、`LocalStorage` 和 `IndexDB` 的限制：跨源的脚本无法访问其他源的 `Cookie`、`LocalStorage` 或 `IndexDB` 数据。

同源策略的存在使得浏览器可以更好地保护用户的隐私和安全。然而，也有一些场景需要进行跨域访问，例如使用
`JSONP`、`CORS`、代理服务器等方式来实现跨域请求。

需要注意的是，同源策略仅在浏览器中执行，不会限制服务器之间的通信，服务器可以自由地进行跨域访问。

### 108 如何删除一个cookie

删除一个 `Cookie` 可以通过以下几种方式实现：

**1\. 将 Cookie 的过期时间设置为过去的时间：**
```javascript
    var date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = "cookieName=; expires=" + date.toUTCString();
```

将 `cookieName` 替换为要删除的 `Cookie` 的名称。

**2\. 使用`expires` 参数设置过期时间：**
```javascript
    document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
```

同样，将 `cookieName` 替换为要删除的 `Cookie` 的名称。

**3\. 使用`max-age` 参数设置过期时间：**
```javascript
    document.cookie = "cookieName=; max-age=0";
```

同样，将 `cookieName` 替换为要删除的 `Cookie` 的名称。

请注意，删除 `Cookie` 时需要确保 `path` 和 `domain` 参数与要删除的 `Cookie` 的设置一致，以确保正确删除指定的
`Cookie`

### 109 页面编码和被请求的资源编码如果不一致如何处理

如果页面编码和被请求的资源编码不一致，可以采取以下处理方式：

  1. 后端响应头设置 `charset`：在服务器端返回资源（例如 HTML 页面、CSS 文件、JavaScript 文件）时，在响应头中设置正确的字符编码，确保与页面编码一致。例如，在 HTTP 头部中添加以下内容：
```javascript
    Content-Type: text/html; charset=utf-8
```

这样可以告诉浏览器使用 `UTF-8` 编码解析返回的资源。

  2. 前端页面 `<meta>` 设置 `charset`：在 HTML 页面的 `<head>` 部分添加 `<meta>` 标签，并设置正确的字符编码，确保与被请求的资源编码一致。例如：
```html
    <meta charset="utf-8">
```

这样可以告诉浏览器使用 `UTF-8` 编码解析当前页面。

通过上述方式设置正确的字符编码，可以确保页面和被请求的资源在解析和显示时使用一致的编码，避免乱码等问题。需要注意的是，确保页面和资源的编码设置一致，并且字符编码在各个环节中正确传递和解析。

### 110 把`<script>`放在`</body>`之前和之后有什么区别？浏览器会如何解析它们？

将`<script>`放在`</body>`之前和之后的区别主要是在符合HTML标准的语法规则和浏览器的容错机制上，具体如下：

  1. **符合HTML标** ：按照HTML标准规定，`<script>`标签应该放在`<body>`标签内，通常是放在`</body>`之前。将`<script>`放在`</body>`之后是不符合HTML标准的，属于语法错误。但是，现代浏览器通常会自动容错并解析这样的语法，不会出现明显的错误。
  2. **浏览器解析** ：浏览器会解析并执行`<script>`标签中的JavaScript代码。无论`<script>`放在`</body>`之前还是之后，浏览器都会执行其中的代码。浏览器的容错机制会忽略`<script>`之前的`</body>`，视作`<script>`仍然在`<body>`内部。因此，从功能和效果上来说，两者没有区别。
  3. **服务器输出优化** ：在一些情况下，省略`</body>`和`</html>`闭合标签可以减少服务器输出的内容，因为浏览器会自动补全这些标签。对于大型网站或需要优化响应速度的场景，这种优化可以略微减少传输的字节数。

需要注意的是，虽然现代浏览器对放置`<script>`标签的位置比较宽容，但为了遵循HTML标准和保持代码的可读性和可维护性，推荐将`<script>`标签放在`</body>`之前，符合语义和结构的要求。

### 111 JavaScript 中，调用函数有哪几种方式

在JavaScript中，调用函数有以下几种方式：

  1. 方法调用模式：将函数作为对象的方法调用，使用点运算符来调用函数。
```javascript
    obj.method(arg1, arg2);
```

  2. 函数调用模式：直接调用函数，没有明确的接收者对象。
```javascript
    func(arg1, arg2);
```

  3. 构造器调用模式：使用`new`关键字调用函数作为构造器来创建对象实例。
```javascript
    new Func(arg1, arg2);
```

  4. `call`/`apply`调用模式：使用`call`或`apply`方法来调用函数，并指定函数内部的`this`值，以及参数列表。
```javascript
    func.call(obj, arg1, arg2);
    func.apply(obj, [arg1, arg2]);
```

  5. `bind`调用模式：使用`bind`方法创建一个新函数，并指定新函数的`this`值，然后调用新函数。
```javascript
    var newFunc = func.bind(obj);
    newFunc(arg1, arg2);
```

这些不同的调用方式提供了灵活性和适用性，可以根据不同的场景选择合适的方式来调用函数。

### 112 列举一下JavaScript数组和对象有哪些原生方法？

**数组方法：**

  * `arr.concat(arr1, arr2, arrn)`：连接多个数组并返回新数组。
  * `arr.copyWithin(target, start, end)`：将数组的一部分复制到同一数组中的另一个位置。
  * `arr.entries()`：返回一个包含数组键值对的迭代器对象。
  * `arr.every(callbackFn, thisArg)`：测试数组中的所有元素是否都通过了指定函数的测试。
  * `arr.fill(value, start, end)`：用静态值填充数组的一部分。
  * `arr.filter(callbackFn, thisArg)`：创建一个新数组，其中包含通过指定函数筛选的所有元素。
  * `arr.find(callbackFn, thisArg)`：返回数组中第一个满足测试函数的元素的值。
  * `arr.findIndex(callbackFn, thisArg)`：返回数组中第一个满足测试函数的元素的索引。
  * `arr.flat(depth)`：将多维数组展平为一维数组。
  * `arr.flatMap(callbackFn, thisArg)`：首先使用映射函数映射每个元素，然后将结果展平为一维数组。
  * `arr.forEach(callbackFn, thisArg)`：对数组中的每个元素执行指定函数。
  * `arr.includes(searchElement, fromIndex)`：判断数组中是否包含指定元素。
  * `arr.indexOf(searchElement, fromIndex)`：返回指定元素在数组中首次出现的索引。
  * `arr.join(separator)`：将数组元素连接为一个字符串，并使用指定的分隔符。
  * `arr.keys()`：返回一个包含数组键的迭代器对象。
  * `arr.lastIndexOf(searchElement, fromIndex)`：返回指定元素在数组中最后一次出现的索引。
  * `arr.map(callbackFn, thisArg)`：创建一个新数组，其中包含通过指定函数对每个元素进行处理后的结果。
  * `arr.pop()`：移除并返回数组的最后一个元素。
  * `arr.push(element1, element2, ..., elementN)`：向数组末尾添加一个或多个元素，并返回新的长度。
  * `arr.reduce(callbackFn, initialValue)`：对数组中的所有元素执行指定的累积函数，返回累积结果。
  * `arr.reduceRight(callbackFn, initialValue)`：对数组中的所有元素执行指定的累积函数（从右到左），返回累积结果。
  * `arr.reverse()`：反转数组中元素的顺序。
  * `arr.shift()`：移除并返回数组的第一个元素。
  * `arr.slice(start, end)`：从数组中提取指定范围的元素，并返回一个新数组。
  * `arr.some(callbackFn, thisArg)`：测试数组中的至少一个元素是否通过了指定函数的测试。
  * `arr.sort(compareFunction)`：对数组元素进行排序，可以传入自定义的比较函数。
  * `arr.splice(start, deleteCount, item1, item2, ...)`：从数组中添加/删除元素，并返回被删除的元素。
  * `arr.toLocaleString()`：将数组中的元素转换为字符串，并返回该字符串。
  * `arr.toString()`：将数组中的元素转换为字符串，并返回该字符串。
  * `arr.unshift(element1, element2, ..., elementN)`：向数组开头添加一个或多个元素，并返回新的长度。
  * `arr.values()`：返回一个包含数组值的迭代器对象。

**对象方法：**

  * `Object.assign(target, ...sources)`：将一个或多个源对象的属性复制到目标对象，并返回目标对象。
  * `Object.create(proto, [propertiesObject])`：使用指定的原型对象和属性创建一个新对象。
  * `Object.defineProperties(obj, props)`：定义一个或多个对象的新属性或修改现有属性的配置。
  * `Object.defineProperty(obj, prop, descriptor)`：定义一个新属性或修改现有属性的配置。
  * `Object.entries(obj)`：返回一个包含对象自身可枚举属性的键值对数组。
  * `Object.freeze(obj)`：冻结对象，使其属性不可修改。
  * `Object.fromEntries(entries)`：将键值对列表转换为对象。
  * `Object.getOwnPropertyDescriptor(obj, prop)`：返回对象属性的描述符。
  * `Object.getOwnPropertyDescriptors(obj)`：返回对象所有属性的描述符。
  * `Object.getOwnPropertyNames(obj)`：返回一个数组，包含对象自身的所有属性名称。
  * `Object.getOwnPropertySymbols(obj)`：返回一个数组，包含对象自身的所有Symbol属性。
  * `Object.getPrototypeOf(obj)`：返回指定对象的原型。
  * `Object.is(value1, value2)`：判断两个值是否相同。
  * `Object.isExtensible(obj)`：判断对象是否可扩展。
  * `Object.isFrozen(obj)`：判断对象是否已被冻结。
  * `Object.isSealed(obj)`：判断对象是否已被密封。
  * `Object.keys(obj)`：返回一个数组，包含对象自身的所有可枚举属性名称。
  * `Object.preventExtensions(obj)`：阻止对象扩展，使其不可添加新属性。
  * `Object.seal(obj)`：将对象密封，使其属性不可添加、删除或配置。
  * `Object.setPrototypeOf(obj, prototype)`：设置对象的原型。
  * `Object.values(obj)`：返回一个包含对象自身可枚举属性的值的数组。

这些方法可以帮助我们在JavaScript中更方便地操作和处理数组和对象的数据。

### 113 Array.slice() 与 Array.splice() 的区别？

  * `slice()` 方法返回一个新数组，包含从原数组中指定的开始位置到结束位置（不包括结束位置）的元素，不会修改原数组。
  * `splice()` 方法通过删除或替换现有元素或者添加新元素来修改原数组。它会返回被删除的元素组成的数组。
```js
    const fruits = ['apple', 'banana', 'orange', 'mango', 'kiwi'];
    
    // 从索引 1 开始删除 2 个元素，并插入 'grape' 和 'pear'
    const deletedFruits = fruits.splice(1, 2, 'grape', 'pear');
    
    console.log(deletedFruits); // 输出: ['banana', 'orange']
    console.log(fruits); // 输出: ['apple', 'grape', 'pear', 'mango', 'kiwi']
```  
```js
    const fruits = ['apple', 'banana', 'orange'];
    
    // 在索引 1 的位置插入 'grape' 和 'kiwi'
    fruits.splice(1, 0, 'grape', 'kiwi');
    
    console.log(fruits); // 输出: ['apple', 'grape', 'kiwi', 'banana', 'orange']
```

**主要区别如下：**

  * `slice()` 是纯粹的读取操作，不会对原数组进行修改，而 `splice()` 是对数组进行操作，会修改原数组。
  * `slice()` 的参数是起始位置和结束位置，返回选定的元素组成的新数组。`splice()` 的参数是起始位置、删除的元素个数以及可选的插入元素，返回被删除的元素组成的新数组。
  * `slice()` 的结束位置是不包括在选取范围内的，而 `splice()` 中的删除元素个数是包括在操作范围内的。
  * `slice()` 不会改变原数组的长度，而 `splice()` 可以改变原数组的长度。

总的来说，`slice()` 是用来提取数组中的一部分元素，不改变原数组，而 `splice()` 是用来操作数组，可以删除、替换或插入元素，会改变原数组。
```js
    const fruits = ['apple', 'banana', 'orange', 'mango', 'kiwi'];
    
    // 从索引 1 开始（包括索引 1），到索引 3 结束（不包括索引 3）
    const slicedFruits = fruits.slice(1, 3);
    
    console.log(slicedFruits); // 输出: ['banana', 'orange']
    console.log(fruits); // 输出: ['apple', 'banana', 'orange', 'mango', 'kiwi']
```

### 114 MVVM

MVVM（Model-View-
ViewModel）是一种软件架构模式，用于实现用户界面（UI）和业务逻辑的分离。它的设计目标是将界面的开发与后端的业务逻辑分离，使代码更易于理解、维护和测试。

在MVVM中，各个组成部分的职责如下：

  * **Model（模型）** ：表示应用程序的数据和业务逻辑。它负责数据的存储、检索和更新，并封装了与数据相关的操作和规则。
  * **View（视图）** ：展示用户界面，通常是由UI元素组成的。它是用户与应用程序进行交互的界面，负责将数据呈现给用户，并接收用户的输入。
  * **ViewModel（视图模型）** ：连接View和Model，负责处理业务逻辑和数据的交互。它从Model中获取数据，并将数据转换为View可以理解和展示的格式。ViewModel还负责监听View的变化，并根据用户的输入更新Model中的数据。

MVVM的核心思想是数据绑定，通过双向绑定机制将View和ViewModel中的数据保持同步。当ViewModel中的数据发生变化时，View会自动更新，反之亦然。这种数据驱动的方式使得开发者可以专注于业务逻辑的实现，而无需手动操作DOM元素来更新界面。

MVVM的优势包括：

  * **可维护性** ：将界面逻辑与业务逻辑分离，使代码更易于理解和维护。
  * **可测试性** ：由于视图逻辑与业务逻辑解耦，可以更容易地编写单元测试来验证ViewModel的行为。
  * **可复用性** ：ViewModel可以独立于具体的View，可以复用在不同的界面上，提高代码的重用性。
  * **团队协作** ：MVVM模式将界面开发与后端逻辑分离，使得前端和后端开发人员可以并行工作，提高团队的协作效率。

总而言之，MVVM是一种能够将界面逻辑与业务逻辑分离的软件架构模式，通过数据绑定实现了View和ViewModel的自动同步，提高了代码的可维护性、可测试性和可复用性。

  * 在Vue中，ViewModel由Vue实例扮演。Vue通过数据绑定机制建立了View和ViewModel之间的连接，当ViewModel中的数据发生变化时，View会自动更新，反之亦然。这种双向数据绑定使得开发者能够以一种声明式的方式编写代码，而不需要手动操作DOM来更新界面。
  * 总结来说，MVVM是一种将数据驱动视图的设计模式，通过ViewModel作为中间层来实现数据和视图之间的解耦。Vue作为一种流行的MVVM框架，提供了强大的数据绑定和响应式系统，使开发者能够更轻松地构建交互性强的Web应用程序。

**数据劫持** `Vue` 内部使用了 `Obeject.defineProperty()` 来实现双向绑定，通过这个函数可以监听到 `set` 和
`get`的事件
```javascript
    var data = { name: 'poetry' }
    observe(data)
    let name = data.name // -> get value
    data.name = 'yyy' // -> change value
    
    function observe(obj) {
      // 判断类型
      if (!obj || typeof obj !== 'object') {
        return
      }
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key])
      })
    }
    
    function defineReactive(obj, key, val) {
      // 递归子属性
      observe(val)
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
          console.log('get value')
          return val
        },
        set: function reactiveSetter(newVal) {
          console.log('change value')
          val = newVal
        }
      })
    }
```

> 以上代码简单的实现了如何监听数据的 set 和 get 的事件，但是仅仅如此是不够的，还需要在适当的时候给属性添加发布订阅
```html
    <div>
        {{name}}
    </div>
```

> 在解析如上模板代码时，遇到 `{name}` 就会给属性 `name` 添加发布订阅
```javascript
    // 通过 Dep 解耦
    class Dep {
      constructor() {
        this.subs = []
      }
      addSub(sub) {
        // sub 是 Watcher 实例
        this.subs.push(sub)
      }
      notify() {
        this.subs.forEach(sub => {
          sub.update()
        })
      }
    }
    // 全局属性，通过该属性配置 Watcher
    Dep.target = null
    
    function update(value) {
      document.querySelector('div').innerText = value
    }
    
    class Watcher {
      constructor(obj, key, cb) {
        // 将 Dep.target 指向自己
        // 然后触发属性的 getter 添加监听
        // 最后将 Dep.target 置空
        Dep.target = this
        this.cb = cb
        this.obj = obj
        this.key = key
        this.value = obj[key]
        Dep.target = null
      }
      update() {
        // 获得新值
        this.value = this.obj[this.key]
        // 调用 update 方法更新 Dom
        this.cb(this.value)
      }
    }
    var data = { name: 'poetry' }
    observe(data)
    // 模拟解析到 `{{name}}` 触发的操作
    new Watcher(data, 'name', update)
    // update Dom innerText
    data.name = 'yyy' 
```

> 接下来,对 defineReactive 函数进行改造
```javascript
    function defineReactive(obj, key, val) {
      // 递归子属性
      observe(val)
      let dp = new Dep()
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
          console.log('get value')
          // 将 Watcher 添加到订阅
          if (Dep.target) {
            dp.addSub(Dep.target)
          }
          return val
        },
        set: function reactiveSetter(newVal) {
          console.log('change value')
          val = newVal
          // 执行 watcher 的 update 方法
          dp.notify()
        }
      })
    }
```

> 以上实现了一个简易的双向绑定，核心思路就是手动触发一次属性的 getter 来实现发布订阅的添加

**Proxy 与 Obeject.defineProperty 对比**

`Object.defineProperty`在实现双向绑定时存在一些局限性，特别是在处理数组时的表现。为了解决这些问题，JavaScript引入了`Proxy`对象，它提供了更强大的拦截和自定义行为能力，进一步改善了双向绑定的实现。

与`Object.defineProperty`相比，`Proxy`具有以下优势：

  * **支持监听数组变化** ：使用`Proxy`可以监听到数组的变化，包括对数组的`push`、`pop`、`splice`等操作。这使得在实现数组的双向绑定时更加方便和高效。
  * **支持监听动态新增属性** ：`Proxy`可以监听对象属性的动态新增，而`Object.defineProperty`只能监听已经存在的属性。这意味着可以在运行时动态地给对象添加新属性，并对其进行拦截和处理。
  * **更灵活的拦截和自定义行为** ：`Proxy`提供了多种拦截器（handler），可以针对不同的操作进行自定义处理。通过拦截器，可以实现属性的读取、设置、删除等操作的拦截，以及对函数的调用进行拦截。这种灵活性使得在实现双向绑定时更加便捷和可控。

然而，需要注意的是，`Proxy`是ES6引入的新特性，对于一些较旧的浏览器可能不完全支持。在选择使用`Proxy`还是`Object.defineProperty`时，需要根据目标平台和需求进行权衡和选择。

总结来说，`Proxy`相比`Object.defineProperty`提供了更强大和灵活的拦截和自定义行为能力，特别是在处理数组和动态新增属性时表现更好。它是实现双向绑定的一种更先进的方法，为开发者提供了更好的开发体验和效率。

以下是一个简单的示例代码，演示了如何使用`Proxy`实现简单的双向绑定功能。
```javascript
    // 定义一个响应式对象
    const reactiveObj = {
      name: 'poetry',
      age: 30
    };
    
    // 创建一个代理对象
    const reactiveProxy = new Proxy(reactiveObj, {
      get(target, key) {
        console.log(`读取属性 ${key}`);
        return target[key];
      },
      set(target, key, value) {
        console.log(`设置属性 ${key} 值为 ${value}`);
        target[key] = value;
        // 触发更新操作，这里简化为输出当前对象
        console.log(reactiveObj);
        return true;
      }
    });
    
    // 使用代理对象进行属性的读取和设置
    console.log(reactiveProxy.name); // 读取属性 name
    reactiveProxy.age = 40; // 设置属性 age 值为 40
```

在上述示例中，我们使用`Proxy`创建了一个代理对象`reactiveProxy`，并定义了`get`和`set`拦截器。在`get`拦截器中，我们输出了属性的读取操作，而在`set`拦截器中，我们输出了属性的设置操作，并手动触发了更新操作。通过代理对象`reactiveProxy`，我们可以像访问普通对象一样读取和设置属性值，同时还可以进行自定义的操作。

在Vue.js中，实际的双向绑定实现比上述示例要复杂得多，涉及到依赖追踪、响应式系统、模板编译等方面的内容。Vue.js使用了`Proxy`对象和其他技术来实现双向绑定功能。如果你有兴趣深入了解Vue.js的源码实现，可以查看Vue.js的官方仓库，其中包含了完整的源码实现。

### 115 WEB应用从服务器主动推送Data到客户端有那些方式

  1. **WebSocket** ：WebSocket是一种双向通信协议，通过建立持久连接，服务器可以主动向客户端推送数据，而不需要客户端发送请求。WebSocket提供了实时性更好的数据推送能力，适用于需要实时更新数据的场景。
  2. **Server-Sent Events（SSE）** ：SSE是HTML5中定义的一种服务器推送技术，通过建立一个持久的HTTP连接，服务器可以向客户端推送数据，客户端通过监听事件来接收推送的数据。SSE适用于需要实现单向实时数据推送的场景，例如实时新闻、实时股票行情等。
  3. **Long Polling** ：长轮询是一种通过客户端不断发送请求，服务器在有数据更新时立即响应的方式。客户端发送一个请求到服务器，服务器一直保持连接打开，直到有新的数据可用或超时，然后将响应返回给客户端，客户端再立即发送下一个请求。长轮询可以模拟实时的数据推送，但相比WebSocket和SSE，它的实现相对复杂，并且对服务器资源的消耗较大。

以上这些方式都可以实现服务器主动推送数据到客户端，选择哪种方式取决于具体的需求和技术栈的选择。WebSocket和SSE是现代Web应用中较为常用的服务器推送技术，它们提供了更好的实时性和效率。

示例代码如下：

**WebSocket 示例：**

客户端代码：
```javascript
    const socket = new WebSocket('ws://your-server-url');
    
    socket.addEventListener('open', () => {
      console.log('WebSocket连接已建立');
    });
    
    socket.addEventListener('message', (event) => {
      const data = event.data;
      console.log('收到服务器推送的数据:', data);
    });
    
    socket.addEventListener('close', () => {
      console.log('WebSocket连接已关闭');
    });
```

服务器端代码（使用Node.js和WebSocket库ws）：
```javascript
    const WebSocket = require('ws');
    
    const wss = new WebSocket.Server({ port: 8080 });
    
    wss.on('connection', (ws) => {
      console.log('新的WebSocket连接已建立');
    
      // 模拟推送数据给客户端
      setInterval(() => {
        ws.send('服务器主动推送的数据');
      }, 5000);
    
      ws.on('close', () => {
        console.log('WebSocket连接已关闭');
      });
    });
```

**Server-Sent Events 示例：**

客户端代码：
```javascript
    const eventSource = new EventSource('your-server-url');
    
    eventSource.addEventListener('message', (event) => {
      const data = event.data;
      console.log('收到服务器推送的数据:', data);
    });
    
    eventSource.addEventListener('error', (event) => {
      console.error('发生错误:', event);
    });
```

服务器端代码（使用Node.js和Express框架）：
```javascript
    const express = require('express');
    
    const app = express();
    
    app.get('/stream', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    
      // 模拟每5秒发送一次数据给客户端
      setInterval(() => {
        res.write(`data: 服务器主动推送的数据\n\n`);
      }, 5000);
    });
    
    app.listen(8080, () => {
      console.log('服务器已启动');
    });
```

请注意，以上示例仅为简单示例，实际使用时需要根据具体的需求和技术栈进行适当的调整。

### 116 继承

  * **原型链继承** ，将父类的实例作为子类的原型，他的特点是实例是子类的实例也是父类的实例，父类新增的原型方法/属性，子类都能够访问，并且原型链继承简单易于实现，缺点是来自原型对象的所有属性被所有实例共享，无法实现多继承，无法向父类构造函数传参。
```javascript
    function Parent() {
      this.name = 'Parent';
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, I am ' + this.name);
    };
    
    function Child() {}
    
    Child.prototype = new Parent();
    
    var child = new Child();
    child.sayHello(); // Output: Hello, I am Child
```

  * **构造继承** ，使用父类的构造函数来增强子类实例，即复制父类的实例属性给子类，构造继承可以向父类传递参数，可以实现多继承，通过`call`多个父类对象。但是构造继承只能继承父类的实例属性和方法，不能继承原型属性和方法，无法实现函数服用，每个子类都有父类实例函数的副本，影响性能
```javascript
    function Parent(name) {
      this.name = name;
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, I am ' + this.name);
    };
    
    function Child(name) {
      Parent.call(this, name);
    }
    
    var child = new Child('Child');
    child.sayHello(); // Output: Hello, I am Child
```

  * **实例继承** ，为父类实例添加新特性，作为子类实例返回，实例继承的特点是不限制调用方法，不管是new 子类（）还是子类（）返回的对象具有相同的效果，缺点是实例是父类的实例，不是子类的实例，不支持多继承
```javascript
    function createParent() {
      var parent = {
        name: 'Parent',
        sayHello: function() {
          console.log('Hello, I am ' + this.name);
        }
      };
      return parent;
    }
    
    function createChild() {
      var child = Object.create(createParent());
      child.name = 'Child';
      return child;
    }
    
    var child = createChild();
    child.sayHello(); // Output: Hello, I am Child
```

  * **拷贝继承** ：特点：支持多继承，缺点：效率较低，内存占用高（因为要拷贝父类的属性）无法获取父类不可枚举的方法（不可枚举方法，不能使用`for in`访问到）
```javascript
    function copyProperties(target, source) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    }
    
    function Parent() {
      this.name = 'Parent';
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, I am ' + this.name);
    };
    
    function Child() {
      Parent.call(this);
      this.name = 'Child';
    }
    
    copyProperties(Child.prototype, Parent.prototype);
    
    var child = new Child();
    child.sayHello(); // Output: Hello, I am Child
```

  * **组合继承** ：通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用
```javascript
    function Parent(name) {
      this.name = name;
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, I am ' + this.name);
    };
    
    function Child(name) {
      Parent.call(this, name);
    }
    
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
    
    var child = new Child('Child');
    child.sayHello(); // Output: Hello, I am Child
```

  * **寄生组合继承** ：通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点
```javascript
    function Parent(name) {
      this.name = name;
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, I am ' + this.name);
    };
    
    function Child(name) {
      Parent.call(this, name);
    }
    
    function inheritPrototype(child, parent) {
      var prototype = Object.create(parent.prototype);
      prototype.constructor = child;
      child.prototype = prototype;
    }
    
    inheritPrototype(Child, Parent);
    
    var child = new Child('Child');
    child.sayHello(); // Output: Hello, I am Child
```

### 117 有四个操作会忽略enumerable为false的属性

  * `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
```javascript
    var obj = {
      prop1: 'value1',
      prop2: 'value2'
    };
    
    Object.defineProperty(obj, 'prop3', {
      value: 'value3',
      enumerable: false
    });
    
    for (var key in obj) {
      console.log(key); // Output: prop1, prop2
    }
```

  * `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
```javascript
    var obj = {
      prop1: 'value1',
      prop2: 'value2'
    };
    
    Object.defineProperty(obj, 'prop3', {
      value: 'value3',
      enumerable: false
    });
    
    var keys = Object.keys(obj);
    console.log(keys); // Output: ["prop1", "prop2"]
```

  * `JSON.stringify()`：只串行化对象自身的可枚举的属性。
```javascript
    var obj = {
      prop1: 'value1',
      prop2: 'value2'
    };
    
    Object.defineProperty(obj, 'prop3', {
      value: 'value3',
      enumerable: false
    });
    
    var json = JSON.stringify(obj);
    console.log(json); // Output: "{"prop1":"value1","prop2":"value2"}"
```

  * `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象自身的可枚举的属性。
```javascript
    var source = {
      prop1: 'value1',
      prop2: 'value2'
    };
    
    Object.defineProperty(source, 'prop3', {
      value: 'value3',
      enumerable: false
    });
    
    var target = {};
    Object.assign(target, source);
    
    console.log(target); // Output: { prop1: 'value1', prop2: 'value2' }
```

> 在以上示例中，`enumerable` 属性为 `false` 的属性 `prop3` 在遍历、获取键名、序列化、拷贝等操作中都被忽略了。

### 118 属性的遍历

>
> ES6提供了5种方法用于遍历对象的属性，它们分别是`for...in`、O`bject.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`和`Reflect.ownKeys()`。这些方法在遍历对象属性时都遵循相同的次序规则

  * **for...in** `for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
  * **Object.keys(obj)** `Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
  * **Object.getOwnPropertyNames(obj)** `Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
  * **Object.getOwnPropertySymbols(obj)** `Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名。
  * **Reflect.ownKeys(obj)** `Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

> 以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

  * 首先遍历所有数值键，按照数值升序排列。
  * 其次遍历所有字符串键，按照加入时间升序排列。
  * 最后遍历所有 `Symbol` 键，按照加入时间升序排列。
```js
    const obj = {
      [Symbol()]: 'symbol',
      b: 'b',
      10: '10',
      2: '2',
      a: 'a'
    };
    
    // for...in
    for (let key in obj) {
      console.log(key); // Output: 2, 10, b, a
    }
    
    // Object.keys()
    const keys = Object.keys(obj);
    console.log(keys); // Output: ["2", "10", "b", "a"]
    
    // Object.getOwnPropertyNames()
    const propertyNames = Object.getOwnPropertyNames(obj);
    console.log(propertyNames); // Output: ["2", "10", "b", "a"]
    
    // Object.getOwnPropertySymbols()
    const symbols = Object.getOwnPropertySymbols(obj);
    console.log(symbols); // Output: [Symbol()]
    
    // Reflect.ownKeys()
    const allKeys = Reflect.ownKeys(obj);
    console.log(allKeys); // Output: ["2", "10", "b", "a", Symbol()]
```

在上述示例中，对象obj的属性遍历次序为首先数值属性2和10，然后是字符串属性b和a，最后是Symbol属性。

需要注意的是，`for...in`只会遍历可枚举属性且会包括继承的属性，而`Object.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`和`Reflect.ownKeys()`只会遍历对象自身的属性，不包括继承的属性

### 119 为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片

  1. **完成整个HTTP请求+响应** ：使用`GIF`图片可以触发完整的`HTTP`请求+响应流程，尽管在埋点请求中不需要获取和处理响应内容。这样可以确保埋点请求按照正常的`HTTP`流程发送，并且服务器也能正常地接收和处理请求
  2. **无需获取和处理数据** ：`GIF`图片作为埋点请求，不需要获取和处理返回的数据。它只是简单地发送一个`GET`请求，不需要等待响应或处理响应内容，因此能够快速地完成请求并继续执行后续的代码
  3. **跨域友好** ：由于`GIF`图片是通过`<img>`标签加载的，而`<img>`标签在浏览器中天然支持跨域请求，因此使用`1x1`像素的透明`GIF`图片发送埋点请求可以轻松地实现跨域请求，无需关注跨域限制和复杂的配置
  4. **无阻塞执行** ：埋点请求通常是为了收集用户行为或统计数据，对于页面的性能和用户体验来说，不应该影响页面的加载和执行速度。由于`GIF`图片请求是异步的且无阻塞的，页面可以继续加载和执行其他代码，不会因为发送埋点请求而产生阻塞
  5. **性能优化** ：相比使用`XMLHttpRequest`对象发送`GET`请求，使用`1x1`像素的透明`GIF`图片能够在性能上更加高效。`GIF`图片的体积最小，仅需要`43`个字节（最小的`BMP`文件需要`74`个字节，`PNG`需要`67`个字节，而合法的`GIF`，只需要`43`个字节），而且在网络传输中通常会进行`gzip`压缩，进一步减小传输的数据量，这对于大规模的数据埋点和统计是非常有利的

综上所述，使用`1x1`像素的透明`GIF`图片作为数据埋点请求具有简单、快速、跨域友好、无阻塞等优势，使得它成为常用的数据埋点方式之一

### 120 在输入框中如何判断输入的是一个正确的网址

判断输入的内容是否为正确的网址有多种方式，以下是几种常见的方式：

**1\. 使用正则表达式判断**
```javascript
    function isUrlUsingRegex(url) {
        const regex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/;
        return regex.test(url);
    }
```

**2\. 使用URL对象进行解析**
```javascript
    function isUrlUsingURL(url) {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    }
```

**3\. 使用正则表达式和URL对象的结合判断**
```javascript
    function isUrlUsingRegexAndURL(url) {
        const regex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-@?^=%&/~\+#])?$/;
        return regex.test(url) && isUrlUsingURL(url);
    }
```

综上所述，判断输入的内容是否为正确的网址可以通过正则表达式匹配、URL对象进行解析，或者两者结合使用。使用正则表达式可以简单地验证网址的格式是否正确，而使用URL对象可以更严谨地验证网址的各个组成部分是否有效。选择哪种方式取决于具体的需求和使用场景。

### 122 常用设计模式有哪些并举例使用场景

  * **工厂模式** : 
    * 使用场景：当需要根据不同的参数创建不同类型的对象时，可以使用工厂模式。例如，根据用户的选择创建不同类型的支付方式对象。
    * 优点：封装了对象的创建过程，客户端只需关注传入参数即可获取所需对象，降低了耦合度。
    * 缺点：增加了代码的复杂性，需要额外编写工厂方法。
```javascript
    class PaymentFactory {
    createPayment(type) {
      switch (type) {
        case 'credit':
          return new CreditPayment();
        case 'debit':
          return new DebitPayment();
        default:
          throw new Error('Invalid payment type');
      }
    }
    }
    
    const paymentFactory = new PaymentFactory();
    const creditPayment = paymentFactory.createPayment('credit');
    const debitPayment = paymentFactory.createPayment('debit');
```

  * **单例模式** : 
    * 使用场景：当整个系统中只需要一个实例时，可以使用单例模式。例如，全局的系统配置对象。
    * 优点：确保只有一个实例存在，提供了全局访问点，避免了重复创建实例。
    * 缺点：对扩展不友好，单例的实例化和使用耦合在一起。
```javascript
    class SystemConfig {
      constructor() {
        // Initialize system configuration
      }
      
      static getInstance() {
        if (!SystemConfig.instance) {
          SystemConfig.instance = new SystemConfig();
        }
        return SystemConfig.instance;
      }
    }
    
    const config = SystemConfig.getInstance();
```

  * **发布-订阅模式** : 
    * 使用场景：当存在多个对象之间需要进行解耦的消息通信时，可以使用发布-订阅模式。例如，实现一个事件总线用于组件间的通信。
    * 优点：解耦了对象之间的通信，订阅者只需关注自己感兴趣的事件，发布者不需要关心具体的订阅者。
    * 缺点：容易造成内存泄漏，需要手动取消订阅，否则订阅者会一直存在。
```javascript
    const EventBus = {
      events: {},
    
      subscribe(event, callback) {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(callback);
      },
    
      publish(event, data) {
        if (this.events[event]) {
          this.events[event].forEach(callback => callback(data));
        }
      },
    
      unsubscribe(event, callback) {
        if (this.events[event]) {
          this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
      }
    };
    
    // 订阅事件
    EventBus.subscribe('userLoggedIn', handleUserLoggedIn);
    
    // 发布事件
    EventBus.publish('userLoggedIn', { username: 'poetry' });
    
    // 取消订阅事件
    EventBus.unsubscribe('userLoggedIn', handleUserLoggedIn);
```

  * **观察者模式** : 
    * 使用场景：当一个对象的状态发生变化时，需要通知其他依赖该对象的对象进行相应操作时，可以使用观察者模式。例如，实现一个数据的双向绑定功能。
    * 优点：解耦了对象之间的关系，被观察者和观察者之间松耦合，可以动态添加和移除观察者。
    * 缺点：增加了对象之间的相互依赖关系，可能导致系统复杂度增加。
```javascript
    class Observable {
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
        // Perform necessary actions with the data
      }
    }
    
    const observable = new Observable();
    const observer1 = new Observer();
    const observer2 = new Observer();
    
    observable.addObserver(observer1);
    observable.addObserver(observer2);
    
    // Notify observers
    observable.notify({ message: 'Data updated' });
    
    // Remove observer
    observable.removeObserver(observer2);
```

  * **装饰模式** : 
    * 使用场景：当需要在不修改原始对象的情况下，动态地给对象添加额外的功能时，可以使用装饰模式。例如，给一个基本的组件添加日志记录或性能监测的功能。
    * 优点：遵循开放封闭原则，不需要修改原始对象的结构，可以灵活地添加或移除功能。
    * 缺点：增加了类的数量，可能导致类的层次复杂。
```javascript
    class Component {
      operation() {
        // Perform the component's operation
      }
    }
    
    class Decorator {
      constructor(component) {
        this.component = component;
      }
    
      operation() {
        // Add additional functionality
        this.component.operation();
      }
    }
    
    // Create an instance of the component
    const component = new Component();
    
    // Create a decorated component
    const decoratedComponent = new Decorator(component);
    
    // Call the operation on the decorated component
    decoratedComponent.operation();
```

  * **策略模式** : 
    * 使用场景：当需要根据不同的情况选择不同的算法或策略时，可以使用策略模式。例如，根据用户选择的不同排序方式对数据进行排序。
    * 优点：简化了条件语句的复杂度，将算法封装成独立的策略类，方便扩展和维护。
    * 缺点：增加了类的数量，可能导致类的层次复杂。
```javascript
    class SortingStrategy {
      sort(data) {
        // Perform the sorting algorithm
      }
    }
    
    class BubbleSortStrategy extends SortingStrategy {
      sort(data) {
        // Implement bubble sort algorithm
          console.log('Bubble sort applied');
        // Perform bubble sort algorithm
      }
    }
    class QuickSortStrategy extends SortingStrategy {
      sort(data) {
          console.log('Quick sort applied');
          // Perform quick sort algorithm
        }
      }
      class Sorter {
        constructor(strategy) {
          this.strategy = strategy;
      }
      setStrategy(strategy) {
        this.strategy = strategy;
      }
    
      sort(data) {
        this.strategy.sort(data);
      }
    }
    
    // Create sorting strategies
    const bubbleSort = new BubbleSortStrategy();
    const quickSort = new QuickSortStrategy();
    
    // Create sorter and set initial strategy
    const sorter = new Sorter(bubbleSort);
    
    // Sort using current strategy
    sorter.sort(data);
    
    // Change strategy
    sorter.setStrategy(quickSort);
    
    // Sort using new strategy
    sorter.sort(data);
```

**总结**

  * **工厂模式** \- 传入参数即可创建实例 
    * 虚拟 DOM 根据参数的不同返回基础标签的 `Vnode` 和组件 `Vnode`
  * **单例模式** \- 整个程序有且仅有一个实例 
    * `vuex` 和 `vue-router` 的插件注册方法 `install` 判断如果系统存在实例就直接返回掉
  * **发布-订阅模式** (`vue` 事件机制)
  * **观察者模式** (响应式数据原理)
  * **装饰模式** : (`@`装饰器的用法)
  * **策略模式** 策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案-比如选项的合并策略

### 122 原型链判断

请写出下面的答案
```js
    Object.prototype.__proto__;
    Function.prototype.__proto__;
    Object.__proto__;
    Object instanceof Function;
    Function instanceof Object;
    Function.prototype === Function.__proto__;
```

答案
```js
    Object.prototype.__proto__; //null
    Function.prototype.__proto__; //Object.prototype
    Object.__proto__; //Function.prototype
    Object instanceof Function; //true
    Function instanceof Object; //true
    Function.prototype === Function.__proto__; //true
```

> 这道题目深入考察了原型链相关知识点 尤其是 `Function` 和 `Object` 的之间的关系

### 123 RAF 和 RIC 是什么

  * `requestAnimationFrame`： 告诉浏览器在下次重绘之前执行传入的回调函数(通常是操纵 dom，更新动画的函数)；由于是每帧执行一次，那结果就是每秒的执行次数与浏览器屏幕刷新次数一样，通常是每秒 `60` 次。
  * `requestIdleCallback`：: 会在浏览器空闲时间执行回调，也就是允许开发人员在主事件循环中执行低优先级任务，而不影响一些延迟关键事件。如果有多个回调，会按照先进先出原则执行，但是当传入了 `timeout`，为了避免超时，有可能会打乱这个顺序

下面是 `requestAnimationFrame` 和 `requestIdleCallback` 的示例代码：

**requestAnimationFrame**

当使用 `requestAnimationFrame` 实现动画时，通常需要更新 DOM 元素的属性来创建平滑的动画效果。以下是一个使用
`requestAnimationFrame` 的简单示例代码：
```javascript
    function animate() {
      const element = document.getElementById('myElement');
      const position = parseInt(element.style.left) || 0;
      const speed = 2;
    
      // 更新元素位置
      element.style.left = position + speed + 'px';
    
      // 检查是否到达目标位置
      if (position < 200) {
        // 请求下一帧动画
        requestAnimationFrame(animate);
      }
    }
    
    // 开始执行动画
    requestAnimationFrame(animate);
```

在上面的代码中，`animate`
函数用于执行动画操作。在每一帧动画中，我们通过获取元素的当前位置，增加一个速度值，然后更新元素的位置。在这个例子中，我们通过改变 `left`
属性来实现水平移动的动画效果。

在每一帧动画结束后，我们检查是否到达了目标位置（这里假设目标位置为左侧 200px
的位置），如果没有到达目标位置，我们再次请求下一帧动画，从而创建连续的动画效果。

通过使用
`requestAnimationFrame`，可以实现流畅的动画效果，并且能够与浏览器的重绘周期同步，避免了过度绘制的问题。这样可以提供更好的性能和用户体验。

**requestIdleCallback**
```javascript
    function processIdleTasks(deadline) {
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
        // 执行低优先级任务
        const task = tasks.shift();
        task();
      }
    
      if (tasks.length > 0) {
        // 如果还有任务未完成，继续请求下一次 idle callback
        requestIdleCallback(processIdleTasks);
      }
    }
    
    // 添加低优先级任务
    function addTask(task) {
      tasks.push(task);
    
      // 如果当前没有请求进行中，则请求下一次 idle callback
      if (tasks.length === 1) {
        requestIdleCallback(processIdleTasks);
      }
    }
    
    // 低优先级任务列表
    const tasks = [];
    
    // 添加低优先级任务
    addTask(function() {
      console.log('Task 1');
    });
    
    addTask(function() {
      console.log('Task 2');
    });
    
    addTask(function() {
      console.log('Task 3');
    });
```

在上面的代码中，`requestIdleCallback` 用于执行低优先级任务。首先定义了一个 `processIdleTasks`
函数，它会在浏览器空闲时间内执行任务。在函数内部，通过 `deadline.timeRemaining()`
方法判断是否还有空闲时间可用，并且任务队列不为空时，循环执行低优先级任务。如果还有未完成的任务，会继续请求下一次 idle callback。

然后，通过 `addTask` 函数向低优先级任务列表中添加任务。当添加任务时，如果当前没有请求进行中，则请求下一次 idle callback
来执行任务。

通过使用
`requestIdleCallback`，可以在浏览器空闲时间内执行低优先级任务，而不会影响一些延迟关键事件的执行。这有助于提高应用程序的性能和响应能力。

### 124 js自定义事件

> 三要素： `document.createEvent()` `event.initEvent()` `element.dispatchEvent()`

在 JavaScript 中，可以使用以下三个要素来创建和触发自定义事件：

  1. `document.createEvent()`: 这个方法用于创建一个新的事件对象。可以使用不同的方法根据需要创建不同类型的事件对象，例如 `createEvent('Event')`、`createEvent('CustomEvent')` 等。这个方法已经过时，推荐使用更现代的方式创建事件对象，如下文所示。
  2. `Event` 构造函数：这是现代的方式来创建事件对象。可以使用 `new Event(eventName)` 创建一个新的事件对象，其中 `eventName` 是自定义事件的名称。
  3. `event.initEvent()`: 对于使用 `document.createEvent()` 创建的事件对象，可以调用 `initEvent(eventName, bubbles, cancelable)` 方法进行初始化。其中 `eventName` 是事件名称，`bubbles` 是一个布尔值，表示事件是否冒泡，`cancelable` 是一个布尔值，表示事件是否可以被取消。
  4. `element.dispatchEvent()`: 这个方法用于触发自定义事件。可以将创建好的事件对象通过调用 `dispatchEvent(event)` 方法分派到指定的 DOM 元素上，从而触发相应的事件处理程序。

下面是一个示例，演示如何使用这三个要素来创建和触发自定义事件：
```javascript
    // 创建自定义事件对象
    const event = new Event('customEvent');
    
    // 初始化事件对象（可选）
    event.initEvent('customEvent', true, true);
    
    // 获取要触发事件的元素
    const element = document.getElementById('myElement');
    
    // 触发自定义事件
    element.dispatchEvent(event);
```

在上述示例中，首先使用 `Event` 构造函数创建了一个名为 `'customEvent'` 的自定义事件对象。然后，可以选择使用
`initEvent()` 方法对事件对象进行初始化，指定事件名称、冒泡和取消属性。

最后，通过 `getElementById()` 方法获取要触发事件的元素，并调用 `dispatchEvent()`
方法将自定义事件对象分派到该元素上，从而触发自定义事件。

请注意，这里使用的是现代的事件创建和触发方法，而不是使用过时的 `createEvent()` 方法。这是因为现代的方法更加简单直观，并且具有更好的性能。

### 125 前端性能定位、优化指标以及计算方法

> 前端性能优化 已经是老生常谈的一项技术了 很多人说起性能优化方案的时候头头是道 但是真正的对于性能分析定位和性能指标这块却一知半解
> 所以这道题虽然和性能相关 但是考察点在于平常项目如何进行性能定位和分析
>
>   * 我们可以从 前端性能监控-埋点以及 `window.performance`相关的 `api` 去回答
>   * 也可以从性能分析工具 `Performance` 和 `Lighthouse`
>   * 还可以从性能指标 `LCP` `FCP` `FID` `CLS` 等去着手
>

下面是关于前端性能定位、优化指标以及计算方法的一些信息：

  1. 前端性能监控和埋点：通过在关键点上埋点，可以监控网页的加载时间、资源请求、错误等关键性能指标。常用的前端性能监控工具包括自定义的日志记录、第三方服务（如Google Analytics、Sentry等）和开源工具（如Fundebug、Tongji.js等）。此外，`window.performance` API提供了性能数据，可以通过它获取更详细的性能指标，如页面加载时间、资源加载时间等。

  2. 性能分析工具：使用性能分析工具可以深入分析网站的性能瓶颈，并提供有针对性的优化建议。其中两个常用的工具是：

  * Performance：现代浏览器提供的内置性能分析工具，可通过浏览器开发者工具访问。它提供了时间轴记录、CPU、内存和网络分析等功能，帮助开发者找到性能瓶颈并进行优化。
  * Lighthouse：由Google开发的开源工具，可用于自动化测试网页性能，并提供综合的性能报告。它评估网页在多个方面的性能表现，并给出相应的优化建议。

  3. 性能指标：性能指标是用于衡量网站性能的关键指标，常用的指标包括：

  * **LCP** （Largest Contentful Paint）：标识页面上最大的可见内容加载完成的时间，衡量用户可见内容的加载速度。
  * **FCP** （First Contentful Paint）：表示页面上第一个内容元素（如文字、图片）呈现的时间，标识页面加载的起点。
  * **FID** （First Input Delay）：测量从用户首次与页面交互（点击链接、按钮等）到浏览器实际响应该交互的时间。
  * **CLS** （Cumulative Layout Shift）：测量页面上元素布局的稳定性，即元素在页面加载过程中发生的意外移动的累积量。
  * **TTFB** （Time To First Byte）：表示从发起请求到接收到第一个字节的时间，衡量服务器响应速度。
  * **TTI** （Time To Interactive）：表示页面变得可交互的时间，即用户可以进行操作和与页面进行交互的时间点。
  * **TBT** （Total Blocking Time）：衡量页面在加载过程中存在的阻塞时间总和，即浏览器忙于处理 JavaScript 执行而导致无法响应用户输入的时间。

这些指标可以通过性能分析工具或浏览器开发者工具来获得。优化这些指标有助于提升页面加载速度、响应性和用户体验。

**以下是这些指标的计算方法和示例代码：**

**1\. LCP（Largest Contentful Paint）：**

  * 计算方法：监测到页面上的最大可见元素（如图片、视频等）加载完成的时间点。
```javascript
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.renderTime || entry.loadTime);
        }
        }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

**2\. FCP（First Contentful Paint）：**

  * 计算方法：测量页面上第一个内容元素（如文字、图片）呈现的时间。
```javascript
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
        }
        }
    });
    observer.observe({ type: 'paint', buffered: true });
```

**3\. FID（First Input Delay）：**

  * 计算方法： 
    * 测量用户首次与页面交互（点击链接、按钮等）到浏览器实际响应该交互的时间。
    * 计算两个时间点之间的差值，即为 `FID`。
```javascript
    document.addEventListener('DOMContentLoaded', () => {
        const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input' && entry.startTime < 5000) {
            console.log('FID:', entry.processingStart - entry.startTime);
            }
        }
        });
        observer.observe({ type: 'first-input', buffered: true });
    });
```

**4\. CLS（Cumulative Layout Shift）：**

  * 计算方法：监测到页面上元素布局发生变化时，记录布局变化的量。将所有布局变化的量累积起来，即为 CLS。
```javascript
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
```

**5\. TTFB（Time To First Byte）：**

  * 计算方法： 
    * 记录发起请求的时间点。
    * 监测到接收到第一个字节的时间点。
    * 计算两个时间点之间的差值，即为 TTFB。
```javascript
    const startTime = performance.now();
    fetch('https://example.com')
      .then((response) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log('TTFB:', duration);
        return response;
      });
```

**6\. TTI（Time To Interactive）：**

  * 计算方法：测量页面变得可交互的时间，即用户可以进行操作和与页面进行交互的时间点。 
    * 监测到页面上的关键元素加载完成的时间点。
    * 监测到所有关键脚本的执行完成的时间点。
    * 监测到用户首次与页面交互的时间点。
    * 计算这些时间点之间的最大值，即为 TTI。
```javascript
    function calculateTTI() {
        const longTasks = performance.getEntriesByType('longtask');
        const blockingTime = longTasks.reduce((total, task) => total + task.duration, 0);
        console.log('TTI:', blockingTime);
    }
    
    window.addEventListener('load', () => {
        setTimeout(calculateTTI, 5000);
    });
```

**7\. TBT（Total Blocking Time）：**

  * 计算方法：衡量页面在加载过程中存在的阻塞时间总和，即浏览器忙于处理 JavaScript 执行而导致无法响应用户输入的时间。 
    * 监测到页面加载过程中 JavaScript 阻塞用户输入的时间段。
    * 将所有阻塞时间段的持续时间累积起来，即为 TBT。
```javascript
    function calculateTBT() {
        const longTasks = performance.getEntriesByType('longtask');
        const blockingTime = longTasks.reduce((total, task) => total + task.duration, 0);
        console.log('TBT:', blockingTime);
    }
    
    window.addEventListener('load', () => {
        setTimeout(calculateTBT, 5000);
    });
```

上述示例代码可以在页面中嵌入并运行，通过浏览器的开发者工具或控制台查看相应的性能指标输出。注意，这些示例代码只是基本的计算方法，实际使用时可能需要根据具体的情况进行调整和扩展。此外，为了准确测量性能指标，建议在真实用户环境中进行测试和监测。

**使用`web-vitals` 库可以更方便地获取和处理性能指标。下面是使用 `web-vitals` 库的示例代码：**
```javascript
    import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
    
    // CLS (Cumulative Layout Shift)
    getCLS(console.log);
    
    // FID (First Input Delay)
    getFID(console.log);
    
    // LCP (Largest Contentful Paint)
    getLCP(console.log);
    
    // FCP (First Contentful Paint)
    getFCP(console.log);
    
    // TTFB (Time To First Byte)
    getTTFB(console.log);
```

上述代码使用了 `getCLS`、`getFID`、`getLCP`、`getFCP` 和 `getTTFB`
函数来获取对应的性能指标，并将结果通过回调函数打印到控制台。

要使用 `web-vitals` 库，需要先安装该库并在项目中引入。可以使用 npm 或 yarn 进行安装：
```bash
    npm install web-vitals
```

然后，在项目中引入 `web-vitals`：
```javascript
    import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
```

接下来，可以通过调用相应的函数来获取性能指标，并在回调函数中处理指标的结果。示例中使用 `console.log`
打印结果，但你可以根据需要进行其他的处理操作。

请注意，以上示例代码仅展示了如何使用 `web-vitals`
来获取指标，实际应用中可能需要根据具体情况进行处理和使用其他工具或方法来进行更全面的性能分析和优化。

### 126 谈谈你对函数是一等公民的理解

JavaScript 中的函数被称为一等公民（First-class
Citizens），这意味着函数在语言中被视为普通的值，可以像其他数据类型（例如数字、字符串、对象）一样被传递、赋值、存储和返回。

**以下是对 JavaScript 函数作为一等公民的几个重要特性和理解：**

  1. 可以赋值给变量：函数可以像其他数据类型一样赋值给变量。你可以将函数定义存储在变量中，并在需要时将其作为值传递给其他函数或存储在数据结构中。
  2. 可以作为参数传递：函数可以作为参数传递给其他函数。这使得函数能够接受其他函数作为输入，并根据需要执行或处理。
  3. 可以作为返回值：函数可以作为另一个函数的返回值。你可以在一个函数内部定义并返回另一个函数，这使得函数能够灵活地生成和返回其他函数。
  4. 可以存储在数据结构中：函数可以存储在数组、对象或其他数据结构中。这使得你可以在需要时使用函数，并根据需求对其进行组合、迭代或操作。
  5. 可以通过字面量或表达式定义：函数可以通过函数字面量（函数表达式）或函数声明来定义。这为我们提供了灵活性，可以根据需要选择不同的方式来定义函数。
  6. 可以通过闭包捕获状态：由于 JavaScript 中的函数形成了闭包，函数可以访问其所在作用域中的变量。这意味着函数可以捕获并保持对外部变量的引用，即使在函数外部不可访问的情况下也可以使用。

> 这些特性使得 JavaScript
> 中的函数非常强大和灵活。函数作为一等公民使得我们可以使用函数式编程的思想和技术，如高阶函数、函数组合、柯里化等，以更加优雅和灵活地编写代码。
