# 第156题 根据jsx写出vnode和render函数
```html
    <!-- jsx -->
    <div className="container">
      <p onClick={onClick} data-name="p1">
        hello <b>{name}</b>
      </p>
      <img src={imgSrc} />
      <MyComponent title={title}></MyComponent>
    </div>
```

**注意**

  * 注意`JSX`中的常量和变量
  * 注意`JSX`中的`HTML tag`和自定义组件
```js
    const vnode = {
      tag: 'div',
      props: {
        className: 'container'
      },
      children: [
        // <p>
        {
          tag: 'p',
          props: {
            dataset: {
              name: 'p1'
            },
            on: {
              click: onClick // 变量
            }
          },
          children: [
            'hello',
            {
              tag: 'b',
              props: {},
              children: [name] // name变量
            }
          ]
        },
        // <img />
        {
          tag: 'img',
          props: {
            src: imgSrc // 变量
          },
          children: [/**无子节点**/]
        },
        // <MyComponent>
        {
          tag: MyComponent, // 变量
          props: {
            title: title, // 变量
          },
          children: [/**无子节点**/]
        }
      ]
    }
```  
```js
    // render函数
    function render() {
      // h(tag, props, children)
      return h('div', {
        props: {
          className: 'container'
        }
      }, [
    
        // p
        h('p', {
          dataset: {
            name: 'p1'
          },
          on: {
            click: onClick
          }
        }, [
          'hello',
          h('b', {}, [name])
        ])
    
        // img
        h('img', {
          props: {
            src: imgSrc
          }
        }, [/**无子节点**/])
    
        // MyComponent
        h(MyComponent, {
          title: title
        }, [/**无子节点**/])
      ]
      )
    }
```

**在react中jsx编译后**
```js
    // 使用https://babeljs.io/repl编译后效果
    
    React.createElement(
      "div",
      {
        className: "container"
      },
      React.createElement(
        "p",
        {
          onClick: onClick,
          "data-name": "p1"
        },
        "hello ",
        React.createElement("b", null, name)
      ),
      React.createElement("img", {
        src: imgSrc
      }),
      React.createElement(MyComponent, {
        title: title
      })
    );
```
