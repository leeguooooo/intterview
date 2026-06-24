# 1 谈谈你对MVVM的理解

为什么要有这些模式，目的：职责划分、分层（将`Model`层、`View`层进行分类）借鉴后端思想，对于前端而已，就是如何将数据同步到页面上

**MVC模式** 代表：`Backbone` \+ `underscore` \+ `jquery`

![](/images/s_poetries_work_uploads_2022_08_bf9b97960412f53f.png)

  * 传统的 `MVC` 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理，控制器会获取数据。将结果返回给前端,页面重新渲染
  * `MVVM`：传统的前端会将数据手动渲染到页面上, `MVVM` 模式不需要用户手动操作 `dom` 元素,将数据绑定到 `viewModel` 层上，会自动将数据渲染到页面中，视图变化会通知 `viewModel`层 更新数据。`ViewModel` 就是我们 `MVVM` 模式中的桥梁

**MVVM模式** 映射关系的简化，隐藏了`controller`

![](/images/s_poetries_work_uploads_2022_08_41f439971593ef61.png)

> `MVVM`是`Model-View-
> ViewModel`缩写，也就是把`MVC`中的`Controller`演变成`ViewModel`。`Model`层代表数据模型，`View`代表UI组件，`ViewModel`是`View`和`Model`层的桥梁，数据会绑定到`viewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`viewModel`层更新数据。

  * `Model`: 代表数据模型，也可以在`Model`中定义数据修改和操作的业务逻辑。我们可以把`Model`称为数据层，因为它仅仅关注数据本身，不关心任何行为
  * `View`: 用户操作界面。当`ViewModel`对`Model`进行更新的时候，会通过数据绑定更新到`View`
  * `ViewModel`： 业务逻辑层，`View`需要什么数据，`ViewModel`要提供这个数据；`View`有某些操作，`ViewModel`就要响应这些操作，所以可以说它是`Model for View`.

**总结** ： `MVVM`模式简化了界面与业务的依赖，解决了数据频繁更新。`MVVM` 在使用当中，利用双向绑定技术，使得 `Model`
变化时，`ViewModel` 会自动更新，而 `ViewModel` 变化时，`View` 也会自动变化。

我们以下通过一个 `Vue` 实例来说明 `MVVM` 的具体实现
```html
    <!-- View 层 -->
    
    <div id="app">
      <p>{{message}}</p>
      <button v-on:click="showMessage()">Click me</button>
    </div>
```  
```js
    var app = new Vue({
      el: '#app',
      data: {  // 用于描述视图状态  
        message: 'Hello Vue!', // Model 层
      },
      // ViewModel 层：通过事件修改model层数据
      methods: {  // 用于描述视图行为  
        showMessage(){
          let vm = this;
          alert(vm.message);
        }
      },
      created(){
        let vm = this;
        // Ajax 获取 Model 层的数据
        ajax({
          url: '/your/server/data/api',
          success(res){
            vm.message = res;
          }
        });
      }
    })
```
