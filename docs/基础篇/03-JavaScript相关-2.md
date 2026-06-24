# 三、JavaScript相关（2/4）

### 30 JS的基本数据类型和引用数据类型

  * 基本数据类型： 
    * `undefined`: 表示未定义或未初始化的值。
    * `null`: 表示空值或不存在的对象。
    * `boolean`: 表示逻辑上的`true`或`false`。
    * `number`: 表示数值，包括整数和浮点数。
    * `string`: 表示字符串。
    * `symbol`: 表示唯一的、不可变的值，通常用作对象的属性键。
  * 引用数据类型： 
    * `object`: 表示一个复杂的数据结构，可以包含多个键值对。
    * `array`: 表示一个有序的、可变长度的集合。
    * `function`: 表示可执行的代码块，可以被调用执行。

基本数据类型在赋值时是按值传递的，每个变量都有自己的存储空间，修改一个变量不会影响其他变量。而引用数据类型在赋值时是按引用传递的，多个变量引用同一个对象，修改一个变量会影响其他变量。需要注意的是，`null`和`undefined`既是基本数据类型，也是特殊的值，表示不同的含义。

### 31 介绍js有哪些内置对象

JavaScript中有许多内置对象，用于提供各种功能和方法，常见的内置对象包括：

  1. `Object`: 所有对象的基类。
  2. `Array`: 用于表示和操作数组的对象。
  3. `Boolean`: 代表布尔值 `true` 或 `false`。
  4. `Number`: 代表数字，用于执行数值操作和计算。
  5. `String`: 代表字符串，用于处理和操作文本数据。
  6. `Date`: 用于处理日期和时间。
  7. `RegExp`: 用于进行正则表达式匹配。
  8. `Function`: 用于定义和调用函数。
  9. `Math`: 提供数学计算相关的方法和常量。
  10. `JSON`: 用于解析和序列化 JSON 数据。
  11. `Error`: 用于表示和处理错误。
  12. `Map`: 一种键值对的集合，其中键可以是任意类型。
  13. `Set`: 一种集合数据结构，存储唯一的值。
  14. `Promise`: 用于处理异步操作和编写更优雅的异步代码。
  15. `Symbol`: 代表唯一的标识符。

这些内置对象提供了丰富的功能和方法，可以满足不同的编程需求。开发人员可以利用这些对象来处理数据、执行操作、处理错误等。

### 32 说几条写JavaScript的基本规范

下面是几条常见的写JavaScript的基本规范：

  1. 使用驼峰命名法（camel case）命名变量、函数和对象属性，例如：`firstName`, `getUserData()`, `myObject.property`
  2. 使用大写字母开头的驼峰命名法（Pascal case）命名构造函数或类，例如：`Person`, `UserModel`
  3. 使用全大写字母和下划线命名常量，例如：`MAX_VALUE`, `API_KEY`
  4. 使用单行注释（`//`）或块注释（`/* */`）对代码进行注释，解释代码的用途和实现思路
  5. 使用缩进（通常是四个空格或一个制表符）来表示代码块的层次结构，增加代码的可读性
  6. 使用严格模式（`"use strict";`）来提高代码的安全性和效率，避免使用隐式全局变量
  7. 尽量避免使用全局变量，封装代码到函数或模块中，使用局部变量来限制作用域，减少命名冲突
  8. 在声明变量时，使用`let`或`const`来代替`var`，避免变量提升和作用域问题
  9. 尽量避免使用隐式类型转换，使用严格相等运算符（`===`和`!==`）进行比较，避免类型不匹配的问题
  10. 在使用条件语句（`if`、`else`）和循环语句（`for`、`while`）时，始终使用花括号来明确代码块的范围，避免歧义和错误
  11. 使用单引号或双引号来表示字符串，保持一致性，推荐使用单引号
  12. 尽量使用模板字符串来拼接字符串，避免使用字符串连接符（`+`）或复杂的字符串拼接操作
  13. 使用数组和对象的字面量语法（`[]`和`{}`）来创建数组和对象，而不是使用构造函数，例如：`let arr = [1, 2, 3]`, `let obj = {name: 'poetry', age: 25}`
  14. 对于长的逻辑语句或表达式，可以使用合适的换行和缩进来增加可读性，或者使用括号将其分成多行
  15. 避免使用`eval()`函数和`with`语句，它们可能引起安全问题和性能问题

这些规范旨在提高代码的可读性、可维护性和一致性，促进团队协作和代码质量的提升。在编写JavaScript代码时，遵循这些规范可以帮助开发人员写出更优雅、健壮和易于

### 33 JavaScript有几种类型的值

JavaScript有以下几种类型的值：

  1. 原始数据类型：

  * `Undefined`：表示未定义的值。
  * `Null`：表示空值。
  * `Boolean`：表示布尔值，只有两个取值：`true`和`false`。
  * `Number`：表示数字，包括整数和浮点数。
  * `String`：表示字符串，用于表示文本数据。
  * `Symbol`（ES6新增）：表示唯一的、不可变的值。

  1. 引用数据类型：

  * `Object`：表示对象，是一种复合值，可以包含多个键值对。
  * `Array`：表示数组，是一种有序的、可变的集合。
  * `Function`：表示函数，可以执行特定的任务。
  * `Date`：表示日期和时间。
  * `RegExp`：表示正则表达式，用于匹配和处理字符串。
  * `Error`：表示错误对象，用于捕获和处理异常情况。

原始数据类型存储在栈中，通过值的复制来进行赋值和传递。而引用数据类型存储在堆中，通过引用的方式进行赋值和传递，实际上传递的是指向堆中对象的引用地址。

注意：ES6新增的`Symbol`类型是一种唯一的、不可变的数据类型，用于创建唯一的标识符，主要用于对象属性的键值。

### 34 eval是做什么的

`eval()` 是 JavaScript 的一个全局函数，用于将传入的字符串作为 JavaScript 代码进行解析和执行。

其主要功能有以下几个方面：

  1. 动态执行代码：`eval()` 可以将字符串作为 JavaScript 代码进行执行，将字符串解析为可执行的 JavaScript 代码。这样可以动态生成和执行代码，灵活性较高。
  2. 计算字符串表达式：`eval()` 可以计算传入的字符串表达式并返回结果。
  3. 解析 JSON：在某些情况下，可以使用 `eval()` 将 JSON 字符串解析为 JavaScript 对象。但是需要注意，使用 `eval()` 解析 JSON 字符串存在安全风险，因为它会执行传入的任意代码，可能导致恶意代码的注入。

需要注意的是，由于 `eval()` 执行的字符串会被解析和执行，因此在使用 `eval()`
时要格外小心，避免执行不可信的代码，以防止安全漏洞和性能问题。在大多数情况下，可以通过其他方式实现相同的功能，而不必使用 `eval()`。

### 35 null，undefined 的区别

`null` 和 `undefined` 是 JavaScript 中表示空值或缺失值的两个特殊值。

**区别如下：**

  1. `undefined` 表示变量声明了但没有被赋值，或者访问对象属性不存在时的默认返回值。

  * 当变量被声明但未被赋值时，默认值为 `undefined`。
  * 当访问对象的不存在属性时，返回值为 `undefined`。

  2. `null` 表示变量被赋予了一个空值，表示有一个对象，但该对象为空。

  * 当想要明确表示一个变量为空对象时，可以将其赋值为 `null`。
  * `null` 是一个特殊的对象值，表示对象为空，即不指向任何内存地址。

**总结：**

  * `undefined` 表示缺少值或未定义的值，常见于变量声明但未赋值的情况。
  * `null` 表示空对象，常见于显式地将对象赋值为空。

在使用条件判断时，要注意区分它们的差异。对于严格相等比较，推荐使用 `===` 来避免类型转换，以准确判断两者是否相等。

### 36 ["1", "2", "3"].map(parseInt) 答案是多少

**parseInt(str, radix)**

  * 解析一个字符串，并返回`10`进制整数
  * 第一个参数`str`，即要解析的字符串
  * 第二个参数`radix`，基数（进制），范围`2-36` ，以`radix`进制的规则去解析`str`字符串。不合法导致解析失败
  * 如果没有传`radix`
    * 当`str`以`0`开头，则按照`16`进制处理
    * 当`str`以`0`开头，则按照`8`进制处理（但是`ES5`取消了，可能还有一些老的浏览器使用）会按照`10`进制处理
    * 其他情况按照`10`进制处理
  * `eslint`会建议`parseInt`写第二个参数（是因为`0`开始的那个`8`进制写法不确定（如`078`），会按照`10`进制处理）
```js
    // 拆解
    const arr = ["1", "2", "3"]
    const res = arr.map((item,index,array)=>{
      // item: '1', index: 0
      // item: '2', index: 1
      // item: '3', index: 2
      return parseInt(item, index)
      // parseInt('1', 0) // 0相当没有传，按照10进制处理返回1 等价于parseInt('1')
      // parseInt('2', 1) // NaN 1不符合redix 2-36 的一个范围
      // parseInt('3', 2) // 2进制没有3 返回NaN
    })
    
    // 答案 [1, NaN, NaN] 
```

### 37 javascript 代码中的"use strict";是什么意思

`"use strict"`是一种特定的指令（directive），用于告诉 JavaScript 解析器在解析代码时采用严格模式。它可以出现在
JavaScript 代码的顶部（全局严格模式）或函数体的顶部（函数级严格模式）。

使用严格模式的好处包括：

  1. 消除了一些 JavaScript 的不安全操作，使代码更加安全。
  2. 阻止使用一些不推荐或已废弃的语法和特性。
  3. 强制执行更严格的语法和错误检查，减少潜在的错误。
  4. 提高性能，某些优化措施只在严格模式下生效。

严格模式对一些错误和不合理的行为进行了修正，例如：

  * 未声明的变量不能被使用。
  * 不能对只读属性进行赋值。
  * 函数的参数不能有重复的名称。
  * 不能删除变量或函数。
  * 不能使用八进制字面量（例如 `0123`）。
  * 不能使用 `with` 语句。

要注意的是，启用严格模式可能会导致一些代码在非严格模式下不起作用，因为严格模式对语法和行为有更高的要求。因此，在使用严格模式之前，需要仔细测试和检查代码，确保代码在严格模式下正常运行。

示例：
```javascript
    "use strict";
    
    function myFunction() {
      // 函数级严格模式
      // ...
    }
    
    // 全局严格模式
```

上述代码中的`"use strict"`指令告诉 JavaScript 解析器在解析函数或全局代码时应该采用严格模式。

### 38 JSON 的了解

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，以文本形式表示结构化的数据。它采用类似于 JavaScript
对象的键值对的方式来描述数据，易于阅读和编写，同时也便于机器解析和生成。

JSON具有以下特点：

  1. **数据格式简单明确** ：JSON使用键值对（key-value pairs）的形式表示数据，使用大括号 `{}` 定义对象，使用方括号 `[]` 定义数组，键和值之间使用冒号 `:` 分隔。
  2. **支持多种数据类型** ：JSON支持包括字符串、数字、布尔值、对象、数组和null在内的基本数据类型。
  3. **跨平台和语言** ：JSON是一种通用的数据交换格式，不依赖于特定的编程语言或平台，可以被各种编程语言解析和生成。

在 JavaScript 中，可以使用内置的`JSON`对象进行 JSON 字符串与 JavaScript 对象之间的转换。常用的方法有：

  * `JSON.parse()`：将 JSON 字符串解析为 JavaScript 对象。
  * `JSON.stringify()`：将 JavaScript 对象转换为 JSON 字符串。

示例：
```javascript
    // JSON字符串转换为JSON对象
    var jsonString = '{"name": "poetry", "age": 28, "city": "shenzhen"}';
    var jsonObj = JSON.parse(jsonString);
    
    // JSON对象转换为JSON字符串
    var obj = {name: "poetry", age: 28, city: "shenzhen"};
    var jsonString = JSON.stringify(obj);
```

通过使用 JSON，我们可以方便地在不同的系统和平台之间传递和处理数据。它在 Web 开发中被广泛应用于前后端数据交互、API 接口设计等场景。

### 39 js延迟加载的方式有哪些

延迟加载（Deferred Loading）是一种优化网页性能的技术，可以延迟加载页面中的资源（如脚本、样式表、图片等），从而加快页面的初始加载速度。

以下是几种常见的 JavaScript 延迟加载的方式：

  1. **defer 属性** ：将脚本标签的 `defer` 属性设置为 `"defer"`，使得脚本在页面完成解析时执行。例如：`<script src="script.js" defer></script>`
  2. **动态创建 script DOM** ：通过 JavaScript 动态创建 `<script>` 元素，并将其插入到页面中。这样可以控制脚本的加载时机，例如在页面加载完毕后再加载脚本
```javascript
    var script = document.createElement('script');
    script.src = 'script.js';
    document.body.appendChild(script);
```

  3. **XmlHttpRequest 脚本注入** ：使用 XMLHttpRequest 对象加载 JavaScript 脚本，并将其注入到页面中。这种方式可以在页面加载过程中异步加载脚本。示例代码如下：
```javascript
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'script.js', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var script = document.createElement('script');
        script.textContent = xhr.responseText;
        document.body.appendChild(script);
      }
    };
    xhr.send();
```

  4. **延迟加载工具** ：使用第三方的延迟加载工具库，如 `LazyLoad`，可以更方便地管理和控制页面中的延迟加载资源。这些工具通常提供了更多的功能和配置选项，例如按需加载、懒加载、预加载等。

这些延迟加载的方式可以根据具体的需求和场景选择合适的方式来优化页面加载性能，提升用户体验。

### 40 同步和异步的区别

  * 同步：浏览器访问服务器请求，用户看得到页面刷新，重新发请求,等请求完，页面刷新，新内容出现，用户看到新内容,进行下一步操作
  * 异步：浏览器访问服务器请求，用户正常操作，浏览器后端进行请求。等请求完，页面不刷新，新内容也会出现，用户看到新内容

常见的异步操作包括`网络请求`（Ajax）、`定时器`（setTimeout、setInterval）、`事件处理`等。在这些异步操作中，任务的执行不会阻塞程序的其他部分，而是在后台进行，当任务完成时，会通过回调函数或事件来通知程序进行下一步操作。

>
> 总结：同步操作是按照顺序依次执行任务，阻塞程序的执行；异步操作是通过回调函数或事件触发来执行任务，不会阻塞程序的执行，提高了程序的并发性和响应性。在实际开发中，异步操作通常用于处理耗时操作和需要等待结果的任务，以提高程序的性能和用户体验。

### 41 defer和async

>   * `defer`并行加载`js`文件，会按照页面上`script`标签的顺序执行
>   * `async`并行加载`js`文件，下载完成立即执行，不会按照页面上`script`标签的顺序执行
>

**下面是更详细的解释：**

**defer** 和**async** 是用于控制`<script>`标签加载和执行的属性。

  * **defer** 属性用于延迟脚本的执行，即脚本会被并行下载，但会等到整个文档解析完成后再执行。多个带有`defer`属性的脚本会按照它们在文档中的顺序执行。这样可以确保脚本在操作DOM之前加载，避免阻塞页面的渲染。需要注意的是，只有外部脚本（通过`src`属性引入的脚本）才能使用`defer`属性。
```html
    <script src="script1.js" defer></script>
    <script src="script2.js" defer></script>
```

  * **async** 属性用于异步加载脚本，即脚本会被并行下载，并在下载完成后立即执行。多个带有`async`属性的脚本的执行顺序是不确定的，哪个脚本先下载完成就先执行。这样可以提高脚本的加载性能，但可能会导致脚本之间的依赖关系出现问题。同样，只有外部脚本才能使用`async`属性。
```html
    <script src="script1.js" async></script>
    <script src="script2.js" async></script>
```

需要注意的是，`defer`和`async`属性只在外部脚本中生效，即通过`src`属性引入的脚本。如果脚本直接嵌入在`<script>`标签中，这两个属性不起作用。

选择使用`defer`还是`async`取决于脚本的加载和执行顺序的重要性。如果脚本之间有依赖关系，并且需要按照顺序执行，应使用`defer`。如果脚本之间没有依赖关系，且可以并行加载和执行，可以使用`async`来提高加载性能。

### 42 说说严格模式的限制

严格模式（Strict Mode）是 ECMAScript 5 引入的一种特殊模式，用于限制 JavaScript
代码中的一些不安全或不规范的语法，提供更严格的语法检查，减少一些怪异行为，并改善代码质量和可维护性。

**严格模式的一些限制包括但不限于：**

  1. 变量必须先声明再使用，禁止隐式全局变量。
  2. 函数的参数不能有同名属性，否则会报错。
  3. 禁止使用 `with` 语句。
  4. 不能对只读属性赋值，否则会报错。
  5. 不能使用前缀 `0` 表示八进制数，否则会报错。
  6. 不能删除不可删除的属性，不能删除变量，只能删除对象属性。
  7. `eval` 函数在其内部引入的变量不会影响外部作用域。
  8. `eval` 和 `arguments` 不能被重新赋值。
  9. `arguments` 不会自动反映函数参数的变化。
  10. 不能使用 `arguments.callee` 和 `arguments.caller`。
  11. 禁止 `this` 指向全局对象。
  12. 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈。
  13. 增加了一些保留字，如 `protected`、`static` 和 `interface`。

使用严格模式可以提高代码的可靠性，减少意外错误和怪异行为。要启用严格模式，可以在脚本文件或函数体的开头加上 `'use strict';` 来指示
JavaScript 解析器以严格模式解析代码。

### 43 attribute和property的区别是什么

>   * `attribute`是`dom`元素在文档中作为`html`标签拥有的属性；
>   * `property`就是`dom`元素在`js`中作为对象拥有的属性。
>   * 对于`html`的标准属性来说，`attribute`和`property`是同步的，是会自动更新的
>   * 但是对于自定义的属性来说，他们是不同步的
>

`attribute`和`property`是用于描述DOM元素的特性和属性的两个概念。

**区别如下：**

  * `Attribute`（属性）是DOM元素在HTML文档中定义的特性，它可以在HTML标签上声明并存储相关信息。例如，`<div class="container">`中的`class`就是一个属性。在JavaScript中，可以通过`getAttribute`和`setAttribute`方法来获取和设置属性的值。

  * `Property`（属性）是DOM元素作为对象的属性，用于访问和操作元素的状态和行为。例如，`document.getElementById('myElement').className`中的`className`就是DOM对象的属性。在JavaScript中，可以直接通过`.`运算符来访问和修改对象的属性。

**主要区别：**

  1. 同步性：对于HTML标准属性来说，属性和特性是同步的，它们会相互影响和更新。但是对于自定义的属性，特性和属性之间是不同步的。
  2. 值的类型：属性值是具体的数据类型，例如字符串、布尔值、数字等。而特性值始终是字符串。
  3. 访问方式：属性可以通过直接访问对象的属性来获取和设置，而特性需要使用相关的方法（例如`getAttribute`和`setAttribute`）来访问和操作。

需要注意的是，大多数情况下，我们更常使用属性来操作DOM元素，因为它们更直观和方便。而特性主要用于处理自定义属性或一些特殊情况下的操作。

### 44 谈谈你对ES6的理解

ES6（ECMAScript
2015）是JavaScript的第六个主要版本，引入了许多新的语言特性和改进，以提升开发人员的效率和代码质量。以下是ES6的一些重要特性：

  1. **块级作用域** ：引入`let`和`const`关键字，允许在块级作用域中声明变量，解决了变量提升和作用域污染的问题。
  2. **箭头函数** ：使用箭头(`=>`)定义函数，简化了函数的书写，并且自动绑定了`this`。
  3. **模板字符串** ：使用反引号（`）包裹字符串，可以在字符串中使用变量和表达式，实现更灵活的字符串拼接和格式化。
  4. **解构赋值** ：通过解构赋值语法，可以从数组或对象中提取值，并赋给对应的变量，简化了变量赋值的操作。
  5. **默认参数** ：函数可以定义默认参数值，简化了函数调用时传参的操作。
  6. **扩展运算符** ：使用三个点（`...`）进行数组和对象的展开操作，可以将一个数组或对象拆分为独立的元素，或者将多个数组或对象合并为一个。
  7. **Promise** ：引入了`Promise`对象，用于更好地处理异步操作，解决了回调地狱的问题，并提供了更清晰的异步编程模式。
  8. **类和模块化** ：ES6引入了类的概念，可以使用`class`关键字定义类，实现了更接近传统面向对象编程的方式。同时，ES6还提供了模块化的支持，可以使用`import`和`export`语法导入和导出模块。
  9. **模块化** ：引入了模块化的概念，可以使用`import`和`export`语法导入和导出模块，提供了更好的代码组织和模块复用的方式。
  10. **迭代器和生** 成器**：引入了迭代器和生成器的概念，可以通过自定义迭代器来遍历数据集合，并使用生成器函数来生成迭代器。
  11. **管道操作符** ：提案阶段的特性，引入了管道操作符(`|>`)，可以将表达式的结果作为参数传递给下一个表达式，简化了函数调用和方法链的写法。

这些特性只是ES6的一部分，还有其他许多特性，如`Promise.all`、`Map`、`Set`、`Proxy`、`Reflect`等。ES6的引入使得JavaScript语言更加现代化和强大，提供了更多的编程工具和语法

当然，以下是对ES6特性的一些示例代码：

  1. 箭头函数：
```javascript
    // 传统函数
    function sum(a, b) {
      return a + b;
    }
    
    // 箭头函数
    const sum = (a, b) => a + b;
    
    // 使用箭头函数作为回调函数
    const numbers = [1, 2, 3, 4, 5];
    const squaredNumbers = numbers.map(num => num * num);
    console.log(squaredNumbers); // [1, 4, 9, 16, 25]
```

  2. 模板字符串：
```javascript
    const name = "Alice";
    const age = 25;
    
    // 使用模板字符串进行字符串拼接和变量插值
    const message = `My name is ${name} and I am ${age} years old.`;
    console.log(message); // My name is Alice and I am 25 years old.
```

  3. 解构赋值：
```javascript
    // 数组解构赋值
    const numbers = [1, 2, 3, 4, 5];
    const [first, second, ...rest] = numbers;
    console.log(first); // 1
    console.log(second); // 2
    console.log(rest); // [3, 4, 5]
    
    // 对象解构赋值
    const person = { name: "Alice", age: 25 };
    const { name, age } = person;
    console.log(name); // Alice
    console.log(age); // 25
```

  4. 默认参数：
```javascript
    // 函数默认参数
    function greet(name = "Anonymous") {
      console.log(`Hello, ${name}!`);
    }
    
    greet(); // Hello, Anonymous!
    greet("Alice"); // Hello, Alice!
```

  5. 扩展运算符：
```javascript
    // 数组展开
    const numbers = [1, 2, 3];
    const combined = [...numbers, 4, 5];
    console.log(combined); // [1, 2, 3, 4, 5]
    
    // 对象展开
    const person = { name: "Alice", age: 25 };
    const copiedPerson = { ...person };
    console.log(copiedPerson); // { name: "Alice", age: 25 }
```

  6. Promise：
```javascript
    // Promise示例
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Data fetched successfully");
        }, 2000);
      });
    };
    
    fetchData()
      .then(data => {
        console.log(data); // Data fetched successfully
      })
      .catch(error => {
        console.error(error);
      });
```

这些示例展示了ES6的一些特性的用法，但请注意，ES6的特性在不同的环境中可能有不同的支持程度，因此在实际开发中需要注意目标环境的兼容性。

### 45 什么是面向对象编程及面向过程编程，它们的异同和优缺点

面向过程编程（Procedural Programming）和面向对象编程（Object-Oriented Programming）是两种不同的编程范式。

**面向过程编程**
是一种以过程（函数、方法）为中心的编程方式，将程序看作是一系列的步骤，通过顺序执行这些步骤来解决问题。面向过程编程强调的是解决问题的步骤和算法，将问题划分为不同的子任务，通过函数的调用和数据的传递来实现任务之间的协作。

面向过程编程的特点：

  * 程序以过程为单位进行组织，以函数为基本单位。
  * 数据和函数是分离的，函数对于数据的操作是通过参数进行传递。
  * 强调算法和步骤，对问题进行分解和抽象，通过顺序、选择、循环等基本结构来控制程序的流程。
  * 程序的可重用性较低，容易产生大量的重复代码。

**面向对象编程**
是一种以对象为中心的编程方式，将程序看作是一系列相互关联的对象，通过对象之间的交互和消息传递来解决问题。面向对象编程强调的是事物（对象）的抽象、封装、继承和多态性。

面向对象编程的特点：

  * 程序以对象为单位进行组织，对象是数据和方法的封装体。
  * 数据和函数（方法）是紧密关联的，对象通过方法来操作自己的数据。
  * 强调对象之间的关系和交互，通过继承、封装和多态性来实现代码的复用和灵活性。
  * 程序的可重用性较高，易于维护和扩展。

异同和优缺点：

  * 异同： 
    * 异同点在于编程的思维方式和组织代码的方式不同，面向过程注重解决问题的步骤和算法，面向对象注重对象和对象之间的关系和交互。
    * 面向过程将问题分解为不同的函数来实现，而面向对象将问题抽象为对象，通过对象的方法来实现功能。
  * 优点： 
    * 面向过程编程的优点包括：简单、直观、执行效率高。
    * 面向对象编程的优点包括：可重用性高、易于扩展和维护、代码更加模块化和灵活。
  * 缺点： 
    * 面向过程编程的缺点包括：代码重复性高、维护困难、扩展性差。
    * 面向对象编程的缺点包括：复杂性高、学习曲线陡

### 46 面向对象编程思想

面向对象编程（Object-Oriented
Programming，简称OOP）是一种编程思想和方法论，其基本思想是以对象为中心，通过封装、继承和多态等机制来组织和管理代码。以下是面向对象编程的基本思想：

  1. **封装（Encapsulation）** ：将数据和对数据的操作封装在一起，形成对象。对象对外暴露有限的接口，隐藏内部实现细节，提供更好的模块化和抽象性。
  2. **继承（Inheritance）** ：通过继承机制，一个类（子类）可以继承另一个类（父类）的属性和方法，并可以在此基础上添加、修改或扩展功能。继承可以实现代码的重用性和层次化的组织。
  3. **多态（Polymorphism）** ：多态是指同一个方法名可以在不同的对象上产生不同的行为。通过多态，可以以统一的方式处理不同类型的对象，提高代码的灵活性和可扩展性。

面向对象编程的优点包括：

  * **易维护性** ：对象的封装性和模块化使得代码易于维护和理解。对修改封闭、对扩展开放的原则可以减少对已有代码的影响。
  * **代码重用性** ：通过继承和组合等机制，可以重用已有的类和代码，减少重复编写代码的工作量。
  * **灵活性和可扩展性** ：面向对象编程提供了灵活的结构和抽象层次，使得代码易于扩展和修改，适应需求的变化。
  * **可靠性** ：封装和继承等机制可以提高代码的可靠性和可测试性，减少错误的发生和影响范围。
  * **可理解性** ：面向对象的代码通常具有良好的可读性和可理解性，对象和类的设计使得代码更加直观和自然。

面向对象编程可以提供更高层次的抽象和组织，适用于复杂的系统和大型项目的开发。但同时，面向对象编程也有一些限制和挑战，如学习曲线较陡、设计复杂度高、性能开销等。适合选择何种编程思想取决于具体的项目需求和开发场景。

### 47 对web标准、可用性、可访问性的理解

> Web标准（Web Standards）是指由W3C（World Wide Web
> Consortium）等组织制定的用于开发和实现Web内容的一系列规范和标准。它包括HTML、CSS、JavaScript等技术规范，旨在确保不同浏览器和设备在呈现网页时的一致性和互操作性。遵循Web标准可以提高网站的可维护性、可访问性和可扩展性，同时提升用户体验。

  * 可用性（Usability）是指一个产品或系统在用户使用过程中的易用性和用户满意度。一个具有良好可用性的产品能够满足用户的需求，提供直观、简洁、一致的用户界面，减少用户的学习成本和操作复杂度，提供明确的反馈和帮助信息，从而提升用户的效率和满意度。
  * 可访问性（Accessibility）是指Web内容对于所有用户，包括残障用户，的可阅读和可理解性。它涉及到使用无障碍技术和遵循无障碍设计原则，以确保残障用户能够平等地获取和使用Web内容。这包括为视觉、听觉、运动和认知等方面的残障用户提供适当的辅助功能和支持，如屏幕阅读器、放大器、辅助键盘等。
  * 可维护性（Maintainability）是指一个系统或代码的易维护性和可理解性。一个具有良好可维护性的系统能够快速定位和修复问题，容易进行功能扩展和修改。为了提高可维护性，代码应具有良好的结构和组织，遵循设计模式和编程规范，提供清晰的注释和文档，同时采用合适的工具和方法进行版本控制和测试。

这三个概念在Web开发中都非常重要。遵循Web标准可以提高网站的可访问性和可用性，从而更好地服务于用户的需求。同时，考虑可维护性可以降低代码的维护成本和风险，使开发团队能够更加高效地进行开发和迭代。

### 48 如何通过JS判断一个数组

  1. `instanceof`方法：使用`instanceof`运算符判断对象是否为数组，返回布尔值。例如：`arr instanceof Array`。
  2. `constructor`方法：使用`constructor`属性返回对象的构造函数，并判断该构造函数是否为数组构造函数。例如：`arr.constructor == Array`。
  3. 使用`Object.prototype.toString.call()`方法：利用`Object.prototype.toString.call(value)`方法，将要判断的变量作为参数传入，并判断返回的字符串是否为`"[object Array]"`。例如：`Object.prototype.toString.call(arr) == '[object Array]'`。
  4. `ES5`新增的`isArray()`方法：使用`Array.isArray()`方法判断一个值是否为数组，返回布尔值。例如：`Array.isArray(arr)`。

### 49 谈一谈let与var的区别

**1\. 块级作用域：**

  * `let`声明的变量具有块级作用域，在块级作用域内定义的变量只在该块内有效。
  * `var`声明的变量没有块级作用域，它的作用域是函数级的或全局的。

示例代码：
```javascript
    // 使用 let 声明变量
    function example1() {
      let x = 10;
    
      if (true) {
        let x = 20;
        console.log(x); // 输出 20
      }
    
      console.log(x); // 输出 10
    }
    
    example1();
    
    // 使用 var 声明变量
    function example2() {
      var y = 30;
    
      if (true) {
        var y = 40;
        console.log(y); // 输出 40
      }
    
      console.log(y); // 输出 40
    }
    
    example2();
```

**2\. 变量提升：**

  * 使用 `let` 声明的变量不存在变量提升，必须在声明后使用。
  * 使用 `var` 声明的变量会存在变量提升，可以在声明之前使用。

示例代码：
```javascript
    // 使用 let 声明变量
    function example3() {
      console.log(x); // 报错：ReferenceError: x is not defined
      let x = 10;
    }
    
    example3();
    
    // 使用 var 声明变量
    function example4() {
      console.log(y); // 输出 undefined
      var y = 20;
    }
    
    example4();
```

**3\. 重复声明：**

  * 使用 `let` 声明的变量不允许重复声明，重复声明会导致报错。
  * 使用 `var` 声明的变量允许重复声明，不会报错，后面的声明会覆盖前面的声明。

示例代码：
```javascript
    // 使用 let 声明变量
    let z = 30;
    let z = 40; // 报错：SyntaxError: Identifier 'z' has already been declared
    
    // 使用 var 声明变量
    var w = 50;
    var w = 60; // 不会报错，后面的声明覆盖前面的声明
    console.log(w); // 输出 60
```

**4\. 循环中的区别**

在`for`循环中，使用`var`声明的变量具有函数作用域，因此在循环结束后仍然可以访问到循环变量；而使用`let`声明的变量具有块级作用域，因此在每次循环迭代时会创建一个新的变量实例，避免了常见的循环中的问题。

  * 使用 `let` 声明的变量在循环体内部具有块级作用域，每次迭代都会创建一个新的变量。
  * 使用 `var` 声明的变量在循环体内部没有块级作用域，变量是函数级的或全局的。
```js
    // 使用 let 声明变量的循环
    for (let i = 0; i < 3; i++) {
      setTimeout(function() {
        console.log(i); // 输出 0, 1, 2
      }, 1000);
    }
    
    // 使用 var 声明变量的循环
    for (var j = 0; j < 3; j++) {
      setTimeout(function() {
        console.log(j); // 输出 3, 3, 3
      }, 1000);
    }
```

### 50 map与forEach的区别

  * `forEach`方法是无法中断的，即使在遍历过程中使用`return`语句也无法停止遍历。而`map`方法可以使用`return`语句中断遍历。
  * `map`方法会生成一个新的数组，并将每次遍历的返回值按顺序放入新数组中。而`forEach`方法没有返回值，仅用于遍历数组。
  * `map`方法可以链式调用其他数组方法，比如`filter`、`reduce`等。而`forEach`方法不能链式调用其他数组方法。

示例代码：
```javascript
    const numbers = [1, 2, 3, 4, 5];
    
    // 使用 forEach 方法遍历数组
    numbers.forEach(function(item, index, array) {
      console.log(item); // 输出数组元素
      console.log(index); // 输出索引值
      console.log(array); // 输出原数组
    });
    
    // 使用 map 方法遍历数组并生成新数组
    const doubledNumbers = numbers.map(function(item, index, array) {
      return item * 2;
    });
    console.log(doubledNumbers); // 输出 [2, 4, 6, 8, 10]
```

在上面的示例中，使用`forEach`方法遍历数组并输出元素、索引和原数组。而使用`map`方法遍历数组并返回每个元素的两倍值，生成一个新的数组`doubledNumbers`。注意，在`map`的回调函数中使用了`return`语句来指定返回值。

>
> 总结：`forEach`方法用于遍历数组，没有返回值；`map`方法也用于遍历数组，返回一个新的数组，并且可以通过在回调函数中使用`return`语句来指定每次遍历的返回值。

### 51 谈一谈你理解的函数式编程

>   * 简单说，"函数式编程"是一种"编程范式"（programming paradigm），也就是如何编写程序的方法论
>   * 它具有以下特性：闭包和高阶函数、惰性计算、递归、函数是"第一等公民"、只用"表达式"
>

函数式编程（Functional
Programming）是一种编程范式，它强调将计算过程视为函数求值的数学模型，通过组合和应用函数来进行程序开发。函数式编程具有以下特点：

  1. **纯函数** （Pure Functions）：函数的输出只由输入决定，不会产生副作用，即对同样的输入始终返回相同的输出。纯函数不会修改传入的参数，也不会改变外部状态，使得代码更加可预测和易于测试。
  2. **不可变性** （Immutability）：数据一旦创建就不能被修改，任何对数据的改变都会创建一个新的数据副本。这种不可变性使得代码更加安全，避免了一些潜在的错误。
  3. **高阶函数** （Higher-Order Functions）：函数可以作为参数传递给其他函数，也可以作为返回值返回。这种高阶函数的能力可以用来进行函数的组合、封装和抽象，提高代码的复用性和可读性。
  4. **函数组合** （Function Composition）：通过将多个函数组合成一个新的函数，可以实现更复杂的逻辑。函数组合可以通过函数的返回值作为参数传递给另一个函数，将多个函数连接起来形成一个函数链。
  5. **惰性计算** （Lazy Evaluation）：只在需要的时候才进行计算，避免不必要的计算。这种惰性计算可以提高程序的性能和效率。

下面是一个简单的函数式编程的示例代码：
```javascript
    // 纯函数示例：计算一个数组中所有偶数的平均值
    function calculateAverage(numbers) {
      const evenNumbers = numbers.filter((num) => num % 2 === 0);
      const sum = evenNumbers.reduce((acc, curr) => acc + curr, 0);
      return sum / evenNumbers.length;
    }
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const average = calculateAverage(numbers);
    console.log(average); // 输出 6
    
    // 高阶函数示例：使用 map 和 reduce 计算数组中每个元素的平方和
    function calculateSquareSum(numbers) {
      return numbers.map((num) => num * num).reduce((acc, curr) => acc + curr, 0);
    }
    
    const numbers = [1, 2, 3, 4, 5];
    const squareSum = calculateSquareSum(numbers);
    console.log(squareSum); // 输出 55
    
    // 函数组合示例：组合两个函数计算数组中偶数的平方和
    const evenNumbersSquareSum = calculateSquareSum(numbers.filter((num) => num % 2 === 0));
    console.log(evenNumbersSquareSum); // 输出 20
```

在上面的示例代码中，我们使用纯函数的方式编写了两个函数`calculateAverage`和`calculateSquareSum`，它们接收一个数组作为参数，并根据函数式编程的原则

### 52 谈一谈箭头函数与普通函数的区别？

  1. **`this`指向：** 箭头函数没有自己的`this`，它会捕获所在上下文的`this`值。而普通函数的`this`是在运行时确定的，根据调用方式决定。
```javascript
    // 普通函数中的this指向调用者
    function greet() {
      console.log(`Hello, ${this.name}!`);
    }
    
    const person = { name: 'Alice' };
    
    greet.call(person); // 输出：Hello, Alice!
    
    // 箭头函数中的this指向定义时的上下文
    const greetArrow = () => {
      console.log(`Hello, ${this.name}!`);
    };
    
    greetArrow.call(person); // 输出：Hello, undefined!
```

  2. **不可作为构造函数：** 箭头函数不能使用`new`关键字来创建实例，它没有自己的`prototype`属性，无法进行实例化。
```javascript
    const Person = (name) => {
      this.name = name; // 错误，箭头函数不能作为构造函数
    };
    
    const person = new Person('Alice'); // 错误，无法实例化箭头函数
```

  3. **无`arguments`对象：** 箭头函数没有自己的`arguments`对象，可以使用`Rest`参数来代替。
```javascript
    function sum() {
      console.log(arguments); // 输出函数的参数列表
    }
    
    sum(1, 2, 3); // 输出：Arguments(3) [1, 2, 3]
    
    const sumArrow = (...args) => {
      console.log(args); // 输出函数的参数列表
    };
    
    sumArrow(1, 2, 3); // 输出：[1, 2, 3]
```

  4. **无`yield`命令：** 箭头函数不能用作`Generator`函数，无法使用`yield`命令进行函数的暂停和恢复。
```javascript
    function* generatorFunc() {
      yield 1;
      yield 2;
    }
    
    const gen = generatorFunc();
    console.log(gen.next().value); // 输出：1
    
    const arrowGen = () => {
      yield 1; // 错误，箭头函数不能使用yield命令
    };
```

>
> 综上所述，箭头函数与普通函数在`this`指向、构造函数能力、`arguments`对象和`yield`命令等方面有明显的区别。根据具体的使用场景和需求，选择适合的函数类型进行编程。

**总结**

  * 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象
  * 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误
  * 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用`Rest`参数代替
  * 不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数

### 53 谈一谈函数中this的指向

函数中的`this`指向是根据函数的调用方式而确定的，有以下几种常见的情况：

  1. **方法调用模式：** 当函数作为对象的方法被调用时，`this`指向调用该方法的对象。
```javascript
    const person = {
      name: 'Alice',
      greet: function() {
        console.log(`Hello, ${this.name}!`);
      }
    };
    
    person.greet(); // 输出：Hello, Alice!
```

  2. **函数调用模式：** 当函数独立调用时，`this`指向全局对象（在浏览器环境中通常指向`window`对象）或`undefined`（在严格模式下）。
```javascript
    function greet() {
      console.log(`Hello, ${this.name}!`);
    }
    
    const name = 'Alice';
    
    greet(); // 输出：Hello, undefined!
    
    // 在严格模式下
    'use strict';
    greet(); // 输出：Hello, undefined!
```

  3. **构造器调用模式：** 当函数用作构造器（使用`new`关键字）创建对象时，`this`指向新创建的对象。
```javascript
    function Person(name) {
      this.name = name;
      this.greet = function() {
        console.log(`Hello, ${this.name}!`);
      };
    }
    
    const person = new Person('Alice');
    
    person.greet(); // 输出：Hello, Alice!
```

  4. **`apply`/`call`调用模式：** 使用`apply`或`call`方法来调用函数时，可以手动指定`this`的值。
```javascript
    function greet() {
      console.log(`Hello, ${this.name}!`);
    }
    
    const person = {
      name: 'Alice'
    };
    
    greet.call(person); // 输出：Hello, Alice!
    greet.apply(person); // 输出：Hello, Alice!
```

>
> 总结来说，函数中的`this`指向是根据函数的调用方式来确定的，可以是调用函数的对象、全局对象、新创建的对象，或者通过`apply`/`call`方法手动指定。了解函数的调用方式可以帮助理解和正确使用`this`关键字。

总结

**1\. this 指向有哪几种**

  * 默认绑定：全局环境中，`this`默认绑定到`window`
  * 隐式绑定：一般地，被直接对象所包含的函数调用时，也称为方法调用，`this`隐式绑定到该直接对象
  * 隐式丢失：隐式丢失是指被隐式绑定的函数丢失绑定对象，从而默认绑定到`window`。显式绑定：通过`call()`、`apply()`、`bind()`方法把对象绑定到`this`上，叫做显式绑定
  * `new`绑定：如果函数或者方法调用之前带有关键字`new`，它就构成构造函数调用。对于`this`绑定来说，称为`new`绑定 
    * 构造函数通常不使用`return`关键字，它们通常初始化新对象，当构造函数的函数体执行完毕时，它会显式返回。在这种情况下，构造函数调用表达式的计算结果就是这个新对象的值
    * 如果构造函数使用`return`语句但没有指定返回值，或者返回一个原始值，那么这时将忽略返回值，同时使用这个新对象作为调用结果
    * 如果构造函数显式地使用`return`语句返回一个对象，那么调用表达式的值就是这个对象

**2\. 改变函数内部 this 指针的指向函数（bind，apply，call的区别）**

  * `apply`：调用一个对象的一个方法，用另一个对象替换当前对象。例如：`B.apply(A, arguments)`;即A对象应用B对象的方法
  * `call`：调用一个对象的一个方法，用另一个对象替换当前对象。例如：`B.call(A, args1,args2)`;即A对象调用B对象的方法
  * `bind`除了返回是函数以外，它的参数和`call`一样

**3\. 箭头函数**

  * 箭头函数没有`this`，所以需要通过查找作用域链来确定`this`的值，这就意味着如果箭头函数被非箭头函数包含，`this`绑定的就是最近一层非箭头函数的`this`，
  * 箭头函数没有自己的`arguments`对象，但是可以访问外围函数的`arguments`对象
  * 不能通过`new`关键字调用，同样也没有`new.target`值和原型

### 54 异步编程的实现方式

  * 回调函数：在异步操作完成后，通过回调函数来处理结果 
    * 优点：简单、容易理解
    * 缺点：不利于维护，代码耦合高
```js
    function fetchData(callback) {
      setTimeout(() => {
        const data = 'Hello, world!';
        callback(data);
      }, 1000);
    }
    
    fetchData((data) => {
      console.log(data); // 输出：Hello, world!
    });
```

  * 事件监听：通过事件的发布和订阅来实现异步操作 
    * 优点：容易理解，可以绑定多个事件，每个事件可以指定多个回调函数
    * 缺点：事件驱动型，流程不够清晰
```js
    function fetchData() {
      setTimeout(() => {
        const data = 'Hello, world!';
        eventEmitter.emit('dataReceived', data);
      }, 1000);
    }
    
    eventEmitter.on('dataReceived', (data) => {
      console.log(data); // 输出：Hello, world!
    });
    
    fetchData();
```

  * 发布/订阅(观察者模式)：类似于事件监听，但是可以通过消息中心来管理发布者和订阅者 
    * 类似于事件监听，但是可以通过‘消息中心’，了解现在有多少发布者，多少订阅者
```js
    function fetchData() {
      setTimeout(() => {
        const data = 'Hello, world!';
        messageCenter.publish('dataReceived', data);
      }, 1000);
    }
    
    messageCenter.subscribe('dataReceived', (data) => {
      console.log(data); // 输出：Hello, world!
    });
    
    fetchData();
```

  * Promise对象：使用Promise对象可以更方便地处理异步操作的结果和错误 
    * 优点：可以利用then方法，进行链式写法；可以书写错误时的回调函数；
    * 缺点：编写和理解，相对比较难
```js
    function fetchData() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const data = 'Hello, world!';
          resolve(data);
        }, 1000);
      });
    }
    
    fetchData()
      .then((data) => {
        console.log(data); // 输出：Hello, world!
      })
      .catch((error) => {
        console.error(error);
      });
```

  * Generator函数：使用Generator函数可以实现函数体内外的数据交换和错误处理 
    * 优点：函数体内外的数据交换、错误处理机制
    * 缺点：流程管理不方便
```js
    function* fetchData() {
      try {
        const data = yield new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('Hello, world!');
          }, 1000);
        });
        console.log(data); // 输出：Hello, world!
      } catch (error) {
        console.error(error);
      }
    }
    
    const generator = fetchData();
    const promise = generator.next().value;
    promise
      .then((data) => {
        generator.next(data);
      })
      .catch((error) => {
        generator.throw(error);
      });
```

  * async函数：async函数是Generator函数的语法糖，可以更方便地编写和理解异步代码 
    * 优点：内置执行器、更好的语义、更广的适用性、返回的是Promise、结构清晰。
    * 缺点：错误处理机制
```js
    async function fetchData() {
      try {
        const data = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('Hello, world!');
          }, 1000);
        });
        console.log(data); // 输出：Hello, world!
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchData();
```

### 56 谈谈你对原生Javascript了解程度

>
> 数据类型、运算、对象、Function、继承、闭包、作用域、原型链、事件、`RegExp`、`JSON`、`Ajax`、`DOM`、`BOM`、内存泄漏、跨域、异步装载、模板引擎、前端`MVC`、路由、模块化、`Canvas`、`ECMAScript`

**1\. 数据类型：JavaScript具有多种数据类型，包括字符串、数字、布尔值、对象、数组、函数等** **2\.
运算：JavaScript支持常见的算术运算、逻辑运算和比较运算，也支持位运算和三元运算符**
```js
    let sum = 5 + 3;
    let isTrue = true && false;
    let isEqual = 10 === 5;
    let bitwiseOr = 3 | 5;
    let result = (num > 0) ? "Positive" : "Negative";
```

**3\. 对象：JavaScript中的对象是键值对的集合，可以通过字面量形式或构造函数创建对象**
```js
    let person = { name: "poetry", age: 25 };
    let car = new Object();
    car.brand = "Toyota";
    car.color = "Blue";
```

**4\. Function：JavaScript中的函数是一等公民，可以作为变量、参数或返回值进行操作**
```js
    function add(a, b) {
      return a + b;
    }
    
    let multiply = function(a, b) {
      return a * b;
    };
    
    let result = multiply(2, 3);
```

**5\. 继承：** JavaScript使用原型链实现对象之间的继承关系
```js
    function Animal(name) {
      this.name = name;
    }
    
    Animal.prototype.sayHello = function() {
      console.log("Hello, I'm " + this.name);
    };
    
    function Dog(name, breed) {
      Animal.call(this, name);
      this.breed = breed;
    }
    
    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;
    
    let dog = new Dog("Max", "Labrador");
    dog.sayHello();
```

**6\. 闭包：闭包是指函数能够访问其词法作用域外的变量，通过闭包可以实现数据的私有化和封装**
```js
    function outerFunction() {
      let count = 0;
    
      return function() {
        count++;
        console.log(count);
      };
    }
    
    let increment = outerFunction();
    increment(); // 输出：1
    increment(); // 输出：2
```

**7\. 作用域：JavaScript具有函数作用域和块级作用域，在不同的作用域中变量的可访问性不同**
```js
    function example() {
      let x = 10;
    
      if (true) {
        let y = 20;
        console.log(x); // 输出：10
        console.log(y); // 输出：20
      }
    }
```

**8\. 原型链：原型链是JavaScript中实现对象继承的机制，每个对象都有一个原型对象，形成一个链式结构**
```javascript
    function Animal(name) {
      this.name = name;
    }
    
    Animal.prototype.sayHello = function() {
      console.log("Hello, I'm " + this.name);
    };
    
    function Dog(name, breed) {
      this.breed = breed;
    }
    
    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;
    
    let dog = new Dog("Max", "Labrador");
    dog.sayHello();
```

**9\. 事件：JavaScript通过事件来响应用户的操作，可以通过事件监听和事件处理函数来实现**
```js
    let button = document.getElementById("myButton");
    
    button.addEventListener("click", function() {
      console.log("Button clicked");
    });
```

**10\. RegExp：正则表达式是一种用于匹配和操作字符串的强大工具，JavaScript中提供了内置的RegExp对象**
```js
    let pattern = /[a-zA-Z]+/;
    let text = "Hello, World!";
    let result = pattern.test(text);
    console.log(result); // 输出：true
```

**11\. JSON：JSON是一种用于数据交换的格式，JavaScript提供了JSON对象来进行解析和生成JSON数据**
```js
    let jsonStr = '{"name":"poetry", "age":25}';
    let obj = JSON.parse(jsonStr);
    console.log(obj.name); // 输出：poetry
    
    let obj2 = { name: "Jane", age: 30 };
    let jsonStr2 = JSON.stringify(obj2);
    console.log(jsonStr2); // 输出：{"name":"Jane","age":30}
```

**12\. Ajax：Ajax是一种在后台与服务器进行异步通信的技术，可以实现页面的局部刷新和动态数据加载**
```js
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.example.com/data", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.responseText;
        console.log(response);
      }
    };
    xhr.send();
```

**13\. DOM：DOM是JavaScript操作网页内容和结构的接口，可以通过DOM来增删改查网页元素**
```js
    let element = document.getElementById("myElement");
    element.innerHTML = "New content";
    
    let newElement = document.createElement("div");
    newElement.textContent = "Dynamic element";
    document.body.appendChild(newElement);
```

**14\. BOM：BOM（浏览器对象模型）提供了与浏览器窗口交互的接口，如操作浏览器历史记录、定时器等**
```js
    window.location.href = "https://www.example.com";
    let screenWidth = window.screen.width;
    let timer = setTimeout(function() {
       console.log("Timer expired");
    }, 5000);
```

**15\. 内存泄漏：内存泄漏是指无用的内存占用没有被释放，JavaScript中需要注意避免造成内存泄漏**
```javascript
    function createHeavyObject() {
      let bigArray = new Array(1000000).fill("data");
      return bigArray;
    }
    
    let data = createHeavyObject();
    
    // 释放无用的引用，帮助垃圾回收器回收内存
    data = null;
```

**16\. 跨域：跨域是指在浏览器中访问不同源的资源，需要遵守同源策略或通过CORS等方式解决**
```javascript
    // 跨域请求示例
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.example.com/data", true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.responseText;
        console.log(response);
      }
    };
    xhr.send();
```

**17\. 异步装载：通过异步加载资源，如图片、样式表和脚本，可以提高页面加载和性能**
```javascript
    // 异步加载脚本
    let script = document.createElement("script");
    script.src = "https://example.com/script.js";
    document.head.appendChild(script);
    
    // 异步加载图片
    let image = new Image();
    image.src = "https://example.com/image.jpg";
    image.onload = function() {
      console.log("Image loaded");
    };
```

**18\. 模板引擎：模板引擎是用于生成动态HTML内容的工具，可以将数据和模板进行结合生成最终的HTML**
```javascript
    let data = { name: "poetry", age: 25 };
    
    let template = `
      <h1>My Profile</h1>
      <p>Name: ${data.name}</p>
      <p>Age: ${data.age}</p>
    `;
    
    document.getElementById("profileContainer").innerHTML = template;
```

**19\. 前端MVC：前端MVC（Model-View-Controller）是一种将应用程序分为数据模型、视图和控制器的架构模式**
```javascript
    // 模型（Model）
    let user = {
      name: "poetry",
      age: 25
    };
    
    // 视图（View）
    function renderUser(user) {
      let container = document.getElementById("userContainer");
      container.innerHTML = `
        <p>Name: ${user.name}</p>
        <p>Age: ${user.age}</p>
      `;
    }
    
    // 控制器（Controller）
    function updateUserAge(newAge) {
      user.age = newAge;
      renderUser(user);
    }
    
    updateUserAge(30);
```

**20\. 路由：路由是指根据不同的URL路径切换不同的页面或视图，前端路由可以通过URL的变化来加载对应的组件或页面**
```js
    // 设置路由规则
    const routes = [
      { path: "/", component: Home },
      { path: "/about", component: About },
      { path: "/contact", component: Contact }
    ];
    
    // 监听URL变化
    window.addEventListener("hashchange", () => {
      const path = window.location.hash.substring(1);
      const route = routes.find(route => route.path === path);
    
      if (route) {
        const component = new route.component();
        component.render();
      }
    });
    
    // 渲染组件
    class Home {
      render() {
        document.getElementById("app").innerHTML = "<h1>Home Page</h1>";
      }
    }
    
    class About {
      render() {
        document.getElementById("app").innerHTML = "<h1>About Page</h1>";
      }
    }
    
    class Contact {
      render() {
        document.getElementById("app").innerHTML = "<h1>Contact Page</h1>";
      }
    }
    
    // 初始加载默认路由
    window.location.hash = "/";
```

**21\. 模块化：JavaScript模块化通过将代码分割为独立的模块，每个模块具有自己的作用域和接口**
```js
    // 模块A
    export function add(a, b) {
      return a + b;
    }
    
    export function multiply(a, b) {
      return a * b;
    }
    
    // 模块B
    import { add, multiply } from "./moduleA.js";
    
    let sum = add(2, 3);
    let product = multiply(4, 5);
```

**22.Canvas：Canvas是HTML5提供的用于绘制图形和动画的API，可以通过JavaScript操作Canvas元素**
```js
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.stroke();
```

**23\. ECMAScript：ECMAScript是JavaScript的标准化规范，定义了语法、数据类型、函数等核心特性**
```js
    // ECMAScript 6示例
    let name = "poetry";
    let age = 25;
    
    let message = `My name is ${name} and I'm ${age} years old.`;
    
    console.log(message);
```

>
> 这些是原生JavaScript的一些重要特性和示例代码，涵盖了数据类型、运算、对象、函数、继承、闭包、作用域、原型链、事件、正则表达式、JSON、Ajax、DOM、BOM、内存泄漏、跨域、异步装载、模板引擎、前端MVC、路由、模块化、Canvas和ECMAScript。当然，JavaScript还有许多其他特性和用法，这只是其中一部分。

### 57 Js动画与CSS动画区别及相应实现

在JavaScript中实现动画可以通过以下方式：

  1. 使用`setTimeout`或`setInterval`函数结合DOM操作来实现逐帧动画。这种方式需要手动计算和控制每一帧的变化，并且需要注意处理动画的性能问题。
```javascript
    let element = document.getElementById("animate");
    let position = 0;
    
    function animate() {
      position += 1;
      element.style.left = position + "px";
    
      if (position < 200) {
        setTimeout(animate, 10);
      }
    }
    
    animate();
```

  2. 使用`requestAnimationFrame`函数来实现更高效的动画。`requestAnimationFrame`会在浏览器每一帧绘制之前调用指定的回调函数，可以更好地利用浏览器的刷新机制。
```javascript
    let element = document.getElementById("animate");
    let position = 0;
    
    function animate() {
      position += 1;
      element.style.left = position + "px";
    
      if (position < 200) {
        requestAnimationFrame(animate);
      }
    }
    
    animate();
```

  3. 使用现代JavaScript动画库，如`GSAP`（GreenSock Animation Platform），它提供了丰富的动画功能和更高级的控制选项。
```javascript
    let element = document.getElementById("animate");
    
    gsap.to(element, {
      x: 200,
      duration: 1,
      ease: "power2.out"
    });
```

  4. 使用`Pixi.js`实现动画方式

>
> `Pixi.js`是一个基于WebGL的2D渲染引擎，它提供了丰富的功能和工具来创建高性能的动画效果。使用`Pixi.js`可以轻松实现复杂的动画效果，并且可以充分利用硬件加速来提高性能。

以下是使用`Pixi.js`实现动画的示例代码：

4.1 创建`Pixi.js`应用程序：
```javascript
    // 创建一个Pixi.js应用程序
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x000000
    });
    
    // 将Pixi.js应用程序添加到HTML文档中的某个元素中
    document.getElementById("container").appendChild(app.view);
```

4.2 创建并添加精灵对象：
```javascript
    // 创建一个精灵对象
    const sprite = PIXI.Sprite.from("image.png");
    
    // 设置精灵对象的位置和缩放
    sprite.x = 100;
    sprite.y = 100;
    sprite.scale.set(0.5);
    
    // 将精灵对象添加到舞台中
    app.stage.addChild(sprite);
```

4.3 实现动画效果：
```javascript
    // 创建一个Tween动画对象
    const tween = PIXI.tweenManager.createTween(sprite);
    
    // 设置动画的起始位置和结束位置
    tween.from({ x: 100, y: 100 }).to({ x: 500, y: 300 });
    
    // 设置动画的持续时间和缓动函数
    tween.time = 1000;
    tween.easing = PIXI.tween.Easing.outCubic;
    
    // 开始动画
    tween.start();
```

通过使用`Pixi.js`提供的`TweenManager`和`Tween`类，我们可以轻松地创建和控制动画效果。可以设置动画对象的起始状态、结束状态、持续时间和缓动函数，然后调用`start()`方法开始动画。

除了`Tween`动画，`Pixi.js`还提供了许多其他功能，如粒子效果、骨骼动画、滤镜效果等，可以根据具体需求选择合适的方式来实现动画效果。

需要注意的是，使用`Pixi.js`来实现动画需要先引入`Pixi.js`库，并在HTML文档中创建一个容器元素用于显示`Pixi.js`应用程序的画布。
```html
    <div id="container"></div>
```

然后通过上述示例代码来创建`Pixi.js`应用程序，并实现所需的动画效果。

**相比之下，CSS动画具有以下优点：**

  * **性能优化** ：浏览器可以对CSS动画进行硬件加速，以提高动画的性能和流畅度。
  * **简单易用** ：使用CSS关键帧动画可以通过简单的CSS样式声明来定义动画，代码相对简单。
  * **兼容性** ：CSS动画在现代浏览器中得到很好的支持，并且在某些情况下可以更好地处理动画效果。

**然而，CSS动画也有一些限制：**

  * **控制能力受限** ：CSS动画通常只能实现简单的线性或简单的缓动效果，对于复杂的动画效果和交互控制，可能需要使用JavaScript来实现。
  * **兼容性局限** ：某些老版本的浏览器可能不支持某些CSS动画属性和效果。

因此，根据实际需求和性能考虑，选择合适的动画实现方式是很重要的。在简单的动画效果和性能要求较高时，可以优先考虑使用CSS动画；而在复杂的动画控制和交互需求时，使用JavaScript来实现动画更为灵活。

### 58 JS 数组和对象的遍历方式，以及几种方式的比较

**数组的遍历方式：**

**1\. for循环：**

  * 可以使用普通的`for`循环来遍历数组元素。
  * 优点：灵活性高，可以根据索引进行操作。
  * 缺点：代码相对繁琐，需要手动管理索引。
```javascript
    const array = [1, 2, 3];
    for (let i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
```

**2\. forEach方法：**

  * 使用数组的`forEach`方法进行遍历。
  * 优点：简洁、易读，无需手动管理索引。
  * 缺点：无法使用`break`和`continue`跳出循环。
```javascript
    const array = [1, 2, 3];
    array.forEach((element) => {
      console.log(element);
    });
```

**3\. for...of循环：**

  * 使用`for...of`循环来遍历数组。
  * 优点：语法简洁，无需手动管理索引，可以遍历任何可迭代对象。
  * 缺点：无法获取当前元素的索引。
```javascript
    const array = [1, 2, 3];
    for (const element of array) {
      console.log(element);
    }
```

**4\. map方法：**

  * 使用数组的`map`方法进行遍历并返回新数组。
  * 优点：可以同时遍历和转换数组的元素，返回一个新数组。
  * 缺点：不适合仅需要遍历而不需要返回新数组的情况。
```javascript
    const array = [1, 2, 3];
    const mappedArray = array.map((element) => element * 2);
    console.log(mappedArray);
```

**对象的遍历方式：**

**1\. for...in循环：**

  * `for...in循`环是用于遍历对象属性的，但也可用于遍历数组。
  * 优点：可以遍历数组的索引或属性。
  * 缺点：会遍历数组的原型链，不稳定且性能较差，不推荐在数组上使用。
```javascript
    const obj = { a: 1, b: 2, c: 3 };
    for (const key in obj) {
      console.log(key, obj[key]);
    }
```

**2\. Object.keys方法结合forEach方法：**
```javascript
    const obj = { a: 1, b: 2, c: 3 };
    Object.keys(obj).forEach((key) => {
      console.log(key, obj[key]);
    });
```

**3\. Object.entries方法结合forEach方法：**
```javascript
    const obj = { a: 1, b: 2, c: 3 };
    Object.entries(obj).forEach(([key, value]) => {
      console.log(key, value);
    });
```

**比较总结：**

  * `for`循环是最基本的遍历方式，适用于所有情况，但代码较为繁琐。
  * `forEach`方法是数组专用的遍历方法，代码简洁，但无法使用`break`和`continue`跳出循环。
  * `for...o`f循环适用于遍历可迭代对象，如数组、字符串等，语法简单，但无法获取索引。
  * `map`方法适用于对数组进行映射转换，返回新数组。
  * `for...in`循环适用于遍历对象的属性，但会遍历原型链上的属性。
  * `Object.keys`方法结合`forEach`方法适用于遍历对象的属性，不遍历原型链。
  * `Object.entries`方法结合`forEach`方法适用于遍历对象的键值对。

>
> 根据不同的需求和数据结构，选择合适的遍历方式可以提高代码的可读性和性能。使用基本的`for`循环可以处理各种情况，`forEach`和`map`方法提供了简洁的数组遍历方式，`for...of`循环适用于遍历可迭代对象，`for...in`循环和`Object.keys/Object.entries`结合`forEach`方法适用于遍历对象的属性和键值对。

### 59 gulp是什么

>
> gulp`是前端开发过程中一种基于流的代码构建工具，是自动化项目的构建利器；它不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成

  * Gulp的核心概念：流，简单来说就是建立在面向对象基础上的一种抽象的处理数据的工具。在流中，定义了一些处理数据的基本操作，如读取数据，写入数据等，程序员是对流进行所有操作的，而不用关心流的另一头数据的真正流向
  * gulp正是通过流和代码优于配置的策略来尽量简化任务编写的工作
  * Gulp的特点： 
    * **易于使用** ：通过代码优于配置的策略，gulp 让简单的任务简单，复杂的任务可管理
    * **构建快速** 利用 `Node.js` 流的威力，你可以快速构建项目并减少频繁的 `IO` 操作
    * **易于学习** 通过最少的 `API`，掌握 `gulp` 毫不费力，构建工作尽在掌握：如同一系列流管道
```js
    const gulp = require('gulp');
    const cleanCSS = require('gulp-clean-css');
    
    // 压缩CSS任务
    gulp.task('minify-css', () => {
      return gulp.src('src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
    });
    
    // 默认任务
    gulp.task('default', gulp.series('minify-css'));
```

上述示例定义了一个名为`minify-
css`的任务，用于压缩CSS文件。通过使用`gulp.src`选择要处理的文件，然后通过`cleanCSS`插件进行压缩操作，最后将压缩后的文件保存到`dist/css`目录下。通过`gulp.task`定义任务，最后通过`gulp.series`定义默认任务，将`minify-
css`任务作为默认任务执行。

>
> 总结：`Gulp`的特点在于其简单的`API`和基于流的处理方式。通过使用`Gulp`，开发者可以轻松地定义和执行各种任务，提高开发效率。它的易用性、快速构建和易学性使得`Gulp`成为前端开发中常用的自动化构建工具之一

### 60 说一下Vue的双向绑定数据的原理

> `vue.js` 则是采用数据劫持结合发布者-
> 订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调

Vue的双向绑定数据的原理是基于`数据劫持和发布者-订阅者模式`的组合。

**具体步骤如下：**

  1. Vue通过`Object.defineProperty()`方法对数据对象进行劫持。
  2. 在劫持过程中，为每个属性添加了`getter`和`setter`。
  3. 当访问属性时，会触发`getter`函数，而当属性值发生变化时，会触发`setter`函数。
  4. 在`setter`函数中，Vue会通知相关的订阅者，即依赖于该属性的视图或其他数据。
  5. 订阅者收到通知后，会执行相应的更新操作，将新的数据反映到视图上。

这样，当数据发生变化时，Vue能够自动更新相关的视图，实现了双向绑定的效果。

这种原理结合了数据劫持和发布者-订阅者模式的特点，实现了数据与视图之间的自动同步。通过数据劫持，Vue能够捕获数据的变化，而发布者-
订阅者模式则确保了数据变化时的及时通知和更新。

示例代码：
```javascript
    // 定义一个数据对象
    const data = {
      message: 'Hello Vue!',
    };
    
    // 通过Object.defineProperty()劫持数据对象
    Object.defineProperty(data, 'message', {
      get() {
        console.log('访问数据');
        return this._message;
      },
      set(newValue) {
        console.log('更新数据');
        this._message = newValue;
        // 通知订阅者，执行更新操作
        notifySubscribers();
      },
    });
    
    // 定义一个订阅者列表
    const subscribers = [];
    
    // 订阅者订阅数据
    function subscribe(callback) {
      subscribers.push(callback);
    }
    
    // 通知订阅者，执行更新操作
    function notifySubscribers() {
      subscribers.forEach((callback) => {
        callback();
      });
    }
    
    // 订阅者更新视图
    function updateView() {
      console.log('视图更新：', data.message);
    }
    
    // 订阅数据变化
    subscribe(updateView);
    
    // 修改数据，触发更新
    data.message = 'Hello VueJS!';
```

>
> 在上述示例中，我们通过`Object.defineProperty()`对`data`对象的`message`属性进行劫持，并在`getter`和`setter`中添加了相应的日志和更新操作。订阅者通过`subscribe`方法订阅数据变化，并在`updateView`方法中更新视图。当我们修改`data.message`的值时，会触发`setter`函数，从而通知订阅者执行更新操作，最终更新了视图。

通过这种方式，Vue实现了双向绑定的效果，使得数据的变化能够自动反映到视图上。

### 61 let var const区别

**let**

  * 允许你声明一个作用域被限制在块级中的变量、语句或者表达式
  * `let`绑定不受变量提升的约束，这意味着`let`声明不会被提升到当前
  * 该变量处于从块开始到初始化处理的“暂存死区”

**var**

  * 声明变量的作用域限制在其声明位置的上下文中，而非声明变量总是全局的
  * 由于变量声明（以及其他声明）总是在任意代码执行之前处理的，所以在代码中的任意位置声明变量总是等效于在代码开头声明

**const**

  * 声明创建一个值的只读引用 (即指针)
  * 基本数据当值发生改变时，那么其对应的指针也将发生改变，故造成 `const`申明基本数据类型时
  * 再将其值改变时，将会造成报错， 例如 `const a = 3` ; `a = 5`时 将会报错
  * 但是如果是复合类型时，如果只改变复合类型的其中某个`Value`项时， 将还是正常使用

示例代码：

**let:**
```javascript
    function example() {
      let x = 10;
      if (true) {
        let x = 20;
        console.log(x); // Output: 20
      }
      console.log(x); // Output: 10
    }
    
    example();
```

**var:**
```javascript
    function example() {
      var x = 10;
      if (true) {
        var x = 20;
        console.log(x); // Output: 20
      }
      console.log(x); // Output: 20
    }
    
    example();
```

**const:**
```javascript
    function example() {
      const x = 10;
      if (true) {
        const x = 20;
        console.log(x); // Output: 20
      }
      console.log(x); // Output: 10
    }
    
    example();
```

在上述示例中，使用`let`关键字声明的变量`x`具有块级作用域，它的作用范围仅限于`if`语句块内部。而使用`var`关键字声明的变量`x`则具有函数级作用域，它的作用范围在整个函数内部都可见。

对于`const`关键字声明的变量`x`，它创建了一个只读的引用，也就是说它的值不能被修改。在示例中，`const x =
10`声明了一个常量`x`，而在`if`语句块内部再次使用`const x = 20`声明了一个新的常量`x`，它的作用范围也仅限于`if`语句块内部。

**总结：**

  * `let`关键字声明的变量具有块级作用域，不会被提升，存在暂存死区。
  * `var`关键字声明的变量具有函数级作用域，会被提升到当前作用域的顶部。
  * `const`关键字声明的变量创建一个只读的引用，其值不可修改，但对于复合类型的变量，可以修改其属性或元素的值。

### 62 快速的让一个数组乱序

**方法1：使用数组的sort方法结合随机数**
```javascript
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    arr.sort(function() {
      return Math.random() - 0.5;
    });
    console.log(arr);
```

**方法2：使用Fisher-Yates算法**
```javascript
    function shuffleArray(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      
      return array;
    }
    
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    console.log(shuffleArray(arr));
```

**方法3：使用lodash库的shuffle方法**
```javascript
    import shuffle from 'lodash/shuffle'
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    console.log(shuffle(arr));
```

**对比总结：**

  * 方法1使用数组的`sort`方法结合随机数，是一种简单快速的方式，但并不是真正意义上的乱序，因为它是通过排序来实现的。
  * 方法2使用`Fisher-Yates`算法，通过交换数组中的元素来实现乱序，是一种更可靠的乱序方式。
  * 方法3使用`lodash`库的`shuffle`方法，提供了一个方便的工具函数来实现数组的乱序，不需要自己编写乱序算法。

总体而言，如果只是需要简单的乱序，方法一已经足够。但如果对于乱序的质量和随机性有较高的要求，可以使用方法二的Fisher-
Yates算法或者借助第三方库来实现。

### 63 如何渲染几万条数据并不卡住界面

**方式1：使用requestAnimationFrame**

> 这道题考察了如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 `DOM`，那么就可以通过
> `requestAnimationFrame` 来每 `16 ms` 刷新一次

在渲染大量数据时，避免一次性将所有数据都渲染出来可以提高性能，以保持界面的流畅性。以下是一个示例代码，演示如何使用`requestAnimationFrame`来分批渲染大量数据，避免卡住界面：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      <ul>控件</ul>
      <script>
        setTimeout(() => {
          // 插入十万条数据
          const total = 100000
          // 一次插入 20 条，可以根据实际性能调整
          const once = 20
          // 渲染数据总共需要几次
          const loopCount = total / once
          let countOfRender = 0
          let ul = document.querySelector("ul");
    
          function add() {
            // 优化性能，使用文档片段插入，减少回流
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < once; i++) {
              const li = document.createElement("li");
              li.innerText = Math.floor(Math.random() * total);
              fragment.appendChild(li);
            }
            ul.appendChild(fragment);
            countOfRender += 1;
            loop();
          }
    
          function loop() {
            if (countOfRender < loopCount) {
              // 使用requestAnimationFrame在每一帧中执行渲染
              window.requestAnimationFrame(add);
            }
          }
    
          loop();
        }, 0);
      </script>
    </body>
    </html>
```

上述代码会将十万条数据分批插入到`ul`列表中，每次插入20条数据，并通过`requestAnimationFrame`在每一帧中执行渲染，保证不卡住界面。这样用户可以逐步看到数据的渲染过程，而不是等待所有数据都渲染完毕后才显示。这种方式可以提高用户体验并避免界面卡顿。

**方式2：使用虚拟滚动**

使用虚拟滚动（Virtual
Scrolling）可以在渲染大量数据时提高性能，只渲染可见区域的数据，而不是将所有数据都插入到DOM中。这样可以减少DOM操作和内存占用，从而提升性能和响应速度。以下是使用虚拟滚动完成这道题的示例代码：
```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      <style>
        .container {
          height: 400px;
          overflow: auto;
        }
        .item {
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #ccc;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content"></div>
      </div>
      <script>
        setTimeout(() => {
          // 插入十万条数据
          const total = 100000;
          // 可见区域的高度
          const visibleHeight = 400;
          // 单个元素的高度
          const itemHeight = 30;
          // 计算可见区域能容纳的元素数量
          const visibleItemCount = Math.ceil(visibleHeight / itemHeight);
          // 当前滚动位置对应的元素索引
          let startIndex = 0;
          let endIndex = visibleItemCount;
          let container = document.querySelector(".container");
          let content = document.querySelector(".content");
    
          function renderItems() {
            content.innerHTML = "";
            for (let i = startIndex; i < endIndex; i++) {
              const item = document.createElement("div");
              item.className = "item";
              item.innerText = Math.floor(Math.random() * total);
              content.appendChild(item);
            }
          }
    
          function handleScroll() {
            // 计算当前滚动位置对应的元素索引
            startIndex = Math.floor(container.scrollTop / itemHeight);
            endIndex = startIndex + visibleItemCount;
            renderItems();
          }
    
          // 监听滚动事件
          container.addEventListener("scroll", handleScroll);
    
          // 初始渲染可见区域的元素
          renderItems();
        }, 0);
      </script>
    </body>
    </html>
```

> 在上述代码中，通过设置一个具有固定高度的容器，使用`overflow:
> auto`来实现滚动。通过计算可见区域的高度和单个元素的高度，确定可见区域能容纳的元素数量。然后根据滚动位置计算出当前可见区域的元素索引范围，只渲染这一部分数据，从而实现虚拟滚动。随着滚动事件的触发，动态更新可见区域的元素。这样在大量数据的情况下，只有可见区域的元素会被渲染，大大提高了性能和响应速度。

### 64 希望获取到页面中所有的checkbox怎么做？
```js
     var domList = document.getElementsByTagName(‘input’)
     var checkBoxList = [];
     var len = domList.length;　　//缓存到局部变量
     while (len--) {　　//使用while的效率会比for循环更高
     　　if (domList[len].type == ‘checkbox’) {
         　　checkBoxList.push(domList[len]);
     　　}
     }
```

  * 这段代码使用`document.getElementsByTagName('input')`获取到页面中所有的`input`元素，并通过遍历筛选出`type`为`checkbox`的元素，然后将它们存储在`checkBoxList`数组中
  * 请注意，这段代码假设所有的复选框都是通过`<input>`元素实现的，如果你的页面中还有其他方式创建的复选框，可能无法正确获取到。另外，建议将`domList.length`缓存到局部变量中，可以提高代码的性能。

### 65 怎样添加、移除、移动、复制、创建和查找节点

下面是一些用于添加、移除、移动、复制、创建和查找节点的常用方法：

**创建新节点**
```javascript
    document.createElement(tagName); // 创建一个指定标签名的元素节点
    document.createTextNode(text); // 创建一个包含指定文本的文本节点
    document.createDocumentFragment(); // 创建一个空的文档片段节点
```

**添加、移除、替换、插入节点**
```javascript
    parentNode.appendChild(node); // 在父节点的末尾添加一个子节点
    parentNode.removeChild(node); // 从父节点中移除指定的子节点
    parentNode.replaceChild(newNode, oldNode); // 用新节点替换指定的旧节点
    parentNode.insertBefore(newNode, referenceNode); // 在参考节点之前插入一个新节点
```

**查找节点**
```javascript
    document.getElementsByTagName(tagName); // 返回指定标签名的元素节点集合
    document.getElementsByName(name); // 返回具有指定名称的元素节点集合
    document.getElementById(id); // 返回具有指定 id 的元素节点
```

注意，以上方法都是基于`document`对象进行操作的，如果需要在特定的节点上执行这些操作，可以使用相应节点的方法，例如`parentNode.appendChild(node)`。

示例代码：
```javascript
    // 创建新节点
    var newElement = document.createElement('div');
    var newText = document.createTextNode('Hello, world!');
    var fragment = document.createDocumentFragment();
    
    // 添加节点
    document.body.appendChild(newElement);
    newElement.appendChild(newText);
    
    // 移除节点
    document.body.removeChild(newElement);
    
    // 替换节点
    var oldElement = document.getElementById('old');
    var newElement = document.createElement('div');
    document.body.replaceChild(newElement, oldElement);
    
    // 插入节点
    var referenceElement = document.getElementById('reference');
    var newNode = document.createElement('p');
    document.body.insertBefore(newNode, referenceElement);
    
    // 查找节点
    var elementsByTagName = document.getElementsByTagName('div');
    var elementsByName = document.getElementsByName('name');
    var elementById = document.getElementById('id');
```

以上代码演示了如何创建新节点、添加节点、移除节点、替换节点、插入节点以及查找节点的方法。请根据实际情况调整代码并操作相应的节点。

### 66 正则表达式

正则表达式构造函数`RegExp()`和正则表达字面量的主要区别在于语法和使用方式。

**正则表达式构造函数`RegExp()`**

  * 使用字符串作为参数，需要进行双重转义，即需要使用双反斜杠来表示特殊字符，如`\d`表示数字，`\w`表示字母数字下划线等。
  * 构造函数的参数可以是一个字符串，也可以是两个字符串，第一个字符串是正则表达式模式，第二个字符串是修饰符。
  * 如果正则表达式模式是一个变量，只能使用构造函数的方式创建正则表达式。

**正则表达字面量`//`**

  * 使用两个斜杠`//`将正则表达式包围起来。
  * 字面量的方式更简洁，不需要进行双重转义，直接使用特殊字符即可。
  * 正则表达式字面量的模式和修饰符直接写在斜杠之间。

在前端面试中，正则表达式是一个常见的考点。以下是一些与正则表达式相关的重要知识点总结：

**1\. 基本语法**

  * 正则表达式是由字符和特殊字符组成的模式，用于匹配字符串中的文本。
  * 常见的特殊字符包括元字符（如`.`、`*`、`+`、`?`等）和字符类（如`[...]`、`[^...]`、`\d`、`\w`等）。

**2\. 匹配模式**

  * 使用正则表达式可以进行文本匹配、查找、替换等操作。
  * 匹配模式可以包括固定文本和通配符，用于定义要匹配的模式。
  * 量词（如`*`、`+`、`?`、`{n}`、`{n,m}`等）用于指定匹配的次数。

**3\. 常见的正则表达式应用场景**

  * 邮箱验证：匹配邮箱的正则表达式可以验证邮箱的合法性。
  * 密码验证：通过正则表达式可以验证密码的复杂度要求。
  * 手机号验证：使用正则表达式可以验证手机号码的格式是否正确。
  * URL 提取：通过正则表达式可以从文本中提取出符合 URL 格式的链接。
  * HTML 标签处理：正则表达式可以用于匹配和处理 HTML 标签。
  * 字符串替换：使用正则表达式可以进行字符串的替换操作。

**4\. 常见的正则表达式方法**

  * `test()`：测试字符串是否匹配正则表达式。
  * `exec()`：在字符串中查找匹配的文本，并返回匹配结果。
  * `match()`：在字符串中查找匹配的文本，并返回所有匹配结果的数组。
  * `search()`：在字符串中查找匹配的文本，并返回第一个匹配结果的索引。
  * `replace()`：将匹配的文本替换为指定的字符串。
  * `split()`：根据正则表达式将字符串拆分为数组。
```js
    // 示例字符串
    const str = 'Hello, World! This is a test string.';
    
    // test(): 测试字符串是否匹配正则表达式
    const regex1 = /test/;
    console.log(regex1.test(str)); // true
    
    // exec(): 在字符串中查找匹配的文本，并返回匹配结果
    const regex2 = /is/g;
    let result;
    while ((result = regex2.exec(str)) !== null) {
      console.log(result[0]); // "is" (每次循环匹配的结果)
      console.log(result.index); // 匹配的起始索引
    }
    
    // match(): 在字符串中查找匹配的文本，并返回所有匹配结果的数组
    const regex3 = /o/g;
    console.log(str.match(regex3)); // ["o", "o", "o"]
    
    // search(): 在字符串中查找匹配的文本，并返回第一个匹配结果的索引
    const regex4 = /World/;
    console.log(str.search(regex4)); // 7
    
    // replace(): 将匹配的文本替换为指定的字符串
    const regex5 = /test/;
    const newStr = str.replace(regex5, 'replacement');
    console.log(newStr); // "Hello, World! This is a replacement string."
    
    // split(): 根据正则表达式将字符串拆分为数组
    const regex6 = /[,!\s]/;
    const arr = str.split(regex6);
    console.log(arr); // ["Hello", "World", "This", "is", "a", "test", "string"]
```

**5\. 贪婪匹配和非贪婪匹配**

  * 贪婪匹配是指正则表达式默认匹配尽可能长的字符串。
  * 非贪婪匹配是指正则表达式匹配尽可能短的字符串，在量词后加上`?`实现非贪婪匹配。

**以下是一些常见的正则表达式面试题考点及其答案总结：**

**1\. 什么是正则表达式？**

正则表达式是一种用于匹配和操作字符串的模式，它由字符和特殊字符组成，用于定义匹配规则。

**2\. 正则表达式的创建方式有哪些？**

正则表达式可以通过两种方式创建：

  * 字面量方式：使用两个斜杠`//`将正则表达式包围起来，如：`/pattern/`。
  * 构造函数方式：使用`RegExp()`构造函数创建，接受一个字符串参数，如：`new RegExp("pattern")`。

**3\. 常见的正则表达式修饰符有哪些？**

常见的正则表达式修饰符包括：

  * `i`：不区分大小写匹配。
  * `g`：全局匹配，找到所有匹配项。
  * `m`：多行匹配，将 `^` 和 `$` 应用到每一行。

**4\. 常用的正则表达式元字符有哪些？**

常用的正则表达式元字符包括：

  * `.`：匹配除换行符以外的任意字符。
  * `^`：匹配字符串的开始位置。
  * `$`：匹配字符串的结束位置。
  * `\d`：匹配数字字符。
  * `\w`：匹配字母、数字、下划线。
  * `\s`：匹配空白字符。

**5\. 如何匹配邮箱地址？**

可以使用以下正则表达式进行邮箱地址的匹配：
```javascript
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

**6\. 如何匹配手机号码？** 可以使用以下正则表达式进行手机号码的匹配：
```javascript
    /^1[3456789]\d{9}$/;
```

**7\. 如何匹配 URL 地址？**

可以使用以下正则表达式进行 URL 地址的匹配：
```javascript
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/;
```

**8\. 如何提取字符串中的数字部分？** 可以使用以下正则表达式提取字符串中的数字部分：
```javascript
    /\d+/g;
```

**9\. 如何验证密码的复杂度要求？**

可以使用以下正则表达式验证密码的复杂度要求，包括至少包含一个大写字母、一个小写字母和一个数字，长度为8-20个字符：
```javascript
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
```

**10\. 如何匹配日期格式（YYYY-MM-DD）？**

可以使用以下正则表达式匹配日期格式（YYYY-MM-DD）：
```javascript
    /^\d{4}-\d{2}-\d{2}$/;
```

**11\. 如何匹配 IP 地址？**

可以使用以下正则表达式匹配 IP 地址：
```javascript
    /^((25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/;
```

**12\. 如何匹配 HTML 标签？**

可以使用以下正则表达式匹配 HTML 标签：
```javascript
    /<[^>]+>/g;
```

**13\. 如何移除字符串中的 HTML 标签？**

可以使用以下正则表达式移除字符串中的 HTML 标签：
```javascript
    str.replace(/<[^>]+>/g, '');
```

### 67 Javascript中callee和caller的作用？

`callee`和`caller`是两个旧的非标准属性，它们在现代的 JavaScript 中已经不推荐使用，且在严格模式下不可用。

  * `caller`属性：`caller`属性用于获取调用当前函数的函数的引用。它返回一个函数对象或者`null`。这个属性主要用于追踪函数的调用来源。但由于其潜在的安全性问题和性能问题，它已经被废弃了，并且在严格模式下无法使用。
  * `callee`属性：`callee`属性返回当前正在执行的函数的引用。它通常在匿名函数或递归函数中使用，允许函数引用自身。但同样由于其潜在的安全性和性能问题，它也已经被废弃了，并且在严格模式下无法使用。

应该尽量避免使用`caller`和`callee`属性，而使用更现代的 JavaScript
特性和技术来完成相应的任务。例如，可以使用具名函数表达式来递归调用函数，使用函数引用作为参数传递来追踪函数调用的来源。

以下是一个示例，

如果一对兔子每月生一对兔子；一对新生兔，从第二个月起就开始生兔子；假定每对兔子都是一雌一雄，试问一对兔子，第n个月能繁殖成多少对兔子？（使用`callee`完成）
```js
    var result=[];
    function fn(n){  //典型的斐波那契数列
      if(n==1){
        return 1;
      }else if(n==2){
        return 1;
      }else{
        if(result[n]){
          return result[n];
        }else{
          //argument.callee()表示fn()
          result[n]=arguments.callee(n-1)+arguments.callee(n-2);
          return result[n];
        }
      }
    }
```

以下是一个示例，展示了如何使用具名函数表达式进行递归调用：
```javascript
    const factorial = function calculateFactorial(n) {
      if (n <= 1) {
        return 1;
      }
      return n * calculateFactorial(n - 1);
    };
    
    console.log(factorial(5)); // 输出: 120
```

在这个示例中，使用具名函数表达式`calculateFactorial`来递归调用自身，计算阶乘的结果。这种方式比使用`callee`属性更清晰和可维护。

**总结**

  * `caller`是返回一个对函数的引用，该函数调用了当前函数；
  * `callee`是返回正在被执行的`function`函数，也就是所指定的`function`对象的正文

### 68 window.onload和$(document).ready

>
> 原生`JS`的`window.onload`与`Jquery`的`$(document).ready(function(){})`有什么不同？如何用原生JS实现Jq的`ready`方法？

  * `window.onload()`方法是必须等到页面内包括图片的所有元素加载完毕后才能执行。
  * `$(document).ready()`是`DOM`结构绘制完毕后就执行，不必等到加载完毕
```js
    function ready(fn){
        if(document.addEventListener) {        //标准浏览器
          document.addEventListener('DOMContentLoaded', function() {
              //注销事件, 避免反复触发
              document.removeEventListener('DOMContentLoaded',arguments.callee, false);
              fn();            //执行函数
          }, false);
        }else if(document.attachEvent) {        //IE
          document.attachEvent('onreadystatechange', function() {
              if(document.readyState == 'complete') {
                  document.detachEvent('onreadystatechange', arguments.callee);
                  fn();        //函数执行
              }
          });
        }
     };
```

### 69 addEventListener()和attachEvent()的区别

  * `addEventListener()`是DOM Level 2 标准定义的方法，而`attachEvent()`是早期IE浏览器的非标准方法。
  * `addEventListener()`可以为同一个元素的同一个事件类型添加多个事件处理函数，而`attachEvent()`只能绑定一个事件处理函数。
  * `addEventListener()`使用事件捕获阶段或冒泡阶段来处理事件，可以通过第三个参数来指定是在捕获阶段处理还是在冒泡阶段处理。而`attachEvent()`只能在冒泡阶段处理事件。
  * `addEventListener()`的事件处理函数中的`this`指向触发事件的元素，而`attachEvent()`的事件处理函数中的`this`指向`window`对象。
  * `addEventListener()`中的事件处理函数可以通过`event`参数来获取事件信息，而`attachEvent()`的事件处理函数需要通过`window.event`来获取事件信息。

由于`attachEvent()`是早期IE浏览器的非标准方法，且在现代浏览器中已经被废弃，推荐使用`addEventListener()`来绑定事件。

### 70 获取页面所有的checkbox
```js
    var resultArr= [];
    var input = document.querySelectorAll('input');
    for(var i = 0; i < input.length; i++ ) {
      if(input[i].type == 'checkbox') {
        resultArr.push( input[i] );
      }
    }
    //resultArr即中获取到了页面中的所有checkbox
```
