# 43 Class 与 Style 如何动态绑定

`Class` 可以通过对象语法和数组语法进行动态绑定

对象语法：
```javascript
    <div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
    
    data: {
      isActive: true,
      hasError: false
    }
```

数组语法：
```javascript
    <div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
    
    data: {
      activeClass: 'active',
      errorClass: 'text-danger'
    }
```

`Style` 也可以通过对象语法和数组语法进行动态绑定

对象语法：
```javascript
    <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
    
    data: {
      activeColor: 'red',
      fontSize: 30
    }
```

数组语法：
```javascript
    <div v-bind:style="[styleColor, styleSize]"></div>
    
    data: {
      styleColor: {
         color: 'red'
       },
      styleSize:{
         fontSize:'23px'
      }
    }
```
