# 第113题 requestIdleCallback和requestAnimationFrame有什么区别

由`react fiber`引起的关注

  * 组件树转为链表，可分段渲染
  * 渲染时可以暂停，去执行其他高优先级任务，空闲时在继续渲染（`JS`是单线程的，`JS`执行的时候没法去`DOM`渲染）
  * 如何判断空闲？`requestIdleCallback`

**区别**

  * `requestAnimationFrame` 每次渲染完在执行，高优先级
  * `requestIdleCallback` 空闲时才执行，低优先级
  * 都是宏任务，要等待DOM渲染完后在执行

![](/images/s_poetries_work_images_20210414212916.png)
![](/images/s_poetries_work_uploads_2023_01_c49d6ea59a1482e4.png)
```html
    <p>requestAnimationFrame</p>
    
    <button id="btn1">change</button>
    <div id="box"></div>
    
    <script>
      const box = document.getElementById('box')
      
      document.getElementById('btn1').addEventListener('click', () => {
      let curWidth = 100
      const maxWidth = 400
    
      function addWidth() {
        curWidth = curWidth + 3
        box.style.width = `${curWidth}px`
        if (curWidth < maxWidth) {
            window.requestAnimationFrame(addWidth) // 时间不用自己控制
        }
      }
      addWidth()
    })
    </script>
```  
```js
    window.onload = () => {
      console.info('start')
      setTimeout(() => {
        console.info('timeout')
      })
      // 空闲时间才执行
      window.requestIdleCallback(() => {
        console.info('requestIdleCallback')
      })
      window.requestAnimationFrame(() => {
        console.info('requestAnimationFrame')
      })
      console.info('end')
    }
    
    // start
    // end
    // timeout
    // requestAnimationFrame
    // requestIdleCallback
```
