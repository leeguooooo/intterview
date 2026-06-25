# 2 React合成事件机制

  * `React16`事件绑定到`document`上
  * `React17`事件绑定到`root`组件上，有利于多个`react`版本共存，例如微前端
  * `event`不是原生的，是`SyntheticEvent`合成事件对象
  * 和`Vue`不同，和`DOM`事件也不同

> 为了解决跨浏览器兼容性问题，`React` 会将浏览器原生事件（`Browser Native
> Event`）封装为合成事件（`SyntheticEvent`）传入设置的事件处理器中。这里的合成事件提供了与原生事件相同的接口，不过它们屏蔽了底层浏览器的细节差异，保证了行为的一致性。另外有意思的是，`React`
> 并没有直接将事件附着到子元素上，而是以单一事件监听器的方式将所有的事件发送到顶层进行处理。这样 `React` 在更新 `DOM`
> 的时候就不需要考虑如何去处理附着在 `DOM` 上的事件监听器，最终达到优化性能的目的

![](/images/s_poetries_work_uploads_2023_02_2ed64c281a747078.webp)

**合成事件图示**

![](/images/s_poetries_work_uploads_2023_02_bd7cd8acbb3cfd85.webp)

**为何需要合成事件**

  * 更好的兼容性和跨平台，如`react native`
  * 挂载到`document`或`root`上，减少内存消耗，避免频繁解绑
  * 方便事件的统一管理（如事务机制）
```js
    // 事件的基本使用
    import React from 'react'
    
    class EventDemo extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                name: 'zhangsan',
                list: [
                    {
                        id: 'id-1',
                        title: '标题1'
                    },
                    {
                        id: 'id-2',
                        title: '标题2'
                    },
                    {
                        id: 'id-3',
                        title: '标题3'
                    }
                ]
            }
    
            // 修改方法的 this 指向
            this.clickHandler1 = this.clickHandler1.bind(this)
        }
        render() {
            // // this - 使用 bind
            // return <p onClick={this.clickHandler1}>
            //     {this.state.name}
            // </p>
    
            // // this - 使用静态方法
            // return <p onClick={this.clickHandler2}>
            //     clickHandler2 {this.state.name}
            // </p>
    
            // // event
            // return <a href="https://test.com/" onClick={this.clickHandler3}>
            //     click me
            // </a>
    
            // 传递参数 - 用 bind(this, a, b)
            return <ul>{this.state.list.map((item, index) => {
                return <li key={item.id} onClick={this.clickHandler4.bind(this, item.id, item.title)}>
                    index {index}; title {item.title}
                </li>
            })}</ul>
        }
        clickHandler1() {
            // console.log('this....', this) // this 默认是 undefined
            this.setState({
                name: 'lisi'
            })
        }
        // 静态方法，this 指向当前实例
        clickHandler2 = () => {
            this.setState({
                name: 'lisi'
            })
        }
        // 获取 event
        clickHandler3 = (event) => {
            event.preventDefault() // 阻止默认行为
            event.stopPropagation() // 阻止冒泡
            console.log('target', event.target) // 指向当前元素，即当前元素触发
            console.log('current target', event.currentTarget) // 指向当前元素，假象！！！
    
            // 注意，event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent 组合事件
            console.log('event', event) // 不是原生的 Event ，原生的 MouseEvent
            console.log('event.__proto__.constructor', event.__proto__.constructor)
    
            // 原生 event 如下。其 __proto__.constructor 是 MouseEvent
            console.log('nativeEvent', event.nativeEvent)
            console.log('nativeEvent target', event.nativeEvent.target)  // 指向当前元素，即当前元素触发
            console.log('nativeEvent current target', event.nativeEvent.currentTarget) // 指向 document ！！！
    
            // 1. event 是 SyntheticEvent ，模拟出来 DOM 事件所有能力
            // 2. event.nativeEvent 是原生事件对象
            // 3. 所有的事件，都被挂载到 document 上
            // 4. 和 DOM 事件不一样，和 Vue 事件也不一样
        }
        // 传递参数
        clickHandler4(id, title, event) {
            console.log(id, title)
            console.log('event', event) // 最后追加一个参数，即可接收 event
        }
    }
```
