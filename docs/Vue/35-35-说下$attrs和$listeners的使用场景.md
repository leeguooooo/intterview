---
title: "说下$attrs和$listeners的使用场景"
---

# 35 说下$attrs和$listeners的使用场景

API考察，但`$attrs`和`$listeners`是比较少用的边界知识，而且`vue3`有变化，`$listeners`已经移除，还是有细节可说的

**体验**

一个包含组件透传属性的对象
```html
    <template>
        <child-component v-bind="$attrs">
            将非属性特性透传给内部的子组件
        </child-component>
    </template>
```

**回答范例**

  * 我们可能会有一些属性和事件没有在`props`中定义，这类称为非属性特性，结合`v-bind`指令可以直接透传给内部的子组件。
  * 这类“属性透传”常常用于包装高阶组件时往内部传递属性，常用于爷孙组件之间传参。比如我在扩展A组件时创建了组件B组件，然后在C组件中使用B，此时传递给C的属性中只有`props`里面声明的属性是给B使用的，其他的都是A需要的，此时就可以利用`v-bind="$attrs"`透传下去。
  * 最常见用法是结合`v-bind`做展开；`$attrs`本身不是响应式的，除非访问的属性本身是响应式对象。
  * `vue2`中使用`listeners`获取事件，`vue3`中已移除，均合并到`attrs`中,使用起来更简单了

**原理**

查看透传属性`foo`和普通属性`bar`，发现`vnode`结构完全相同，这说明`vue3`中将分辨两者工作由框架完成而非用户指定：
```html
    <template>
      <h1>{{ msg }}</h1>
      <comp foo="foo" bar="bar" />
    </template>
```  
```html
    <template>
      <div>
        {{$attrs.foo}} {{bar}}
      </div>
    </template>
    
    <script setup>
    defineProps({
      bar: String
    })
    </script>
```  
```javascript
    _createVNode(Comp, {
        foo: "foo",
        bar: "bar"
    })
```
