# 第169题 手写Promise加载一张图片
```js
    function loadImg(src) {
      return new Promise(
        (resolve, reject) => {
          const img = document.createElement('img')
          img.onload = () => {
              esolve(img)
          }
          img.onerror = () => {
            const err = new Error(`图片加载失败 ${src}`)
            reject(err)
          }
          img.src = src
        }
      )
    }
```  
```js
    // 测试
    
    const url = 'https://s.poetries.work/uploads/2022/07/ee7310c4f45b9bd6.png'
    loadImg(url).then(img => {
      console.log(img.width)
      return img
    }).then(img => {
      console.log(img.height)
    }).catch(ex => console.error(ex))
    
    const url1 = 'https://s.poetries.work/uploads/2022/07/ee7310c4f45b9bd6.png'
    const url2 = 'https://s.poetries.work/images/20210414100319.png'
    
    loadImg(url1).then(img1 => {
      console.log(img1.width)
      return img1 // 普通对象
    }).then(img1 => {
      console.log(img1.height)
      return loadImg(url2) // promise 实例
    }).then(img2 => {
      console.log(img2.width)
      return img2
    }).then(img2 => {
      console.log(img2.height)
    }).catch(ex => console.error(ex))
```
