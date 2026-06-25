# 16 为什么 React 元素有一个 $$typeof 属性

![](/images/s_poetries_work_images_image_20210302200213923.webp)

> 目的是为了防止 `XSS` 攻击。因为 `Synbol` 无法被序列化，所以 `React` 可以通过有没有 `$$typeof` 属性来断出当前的
> `element` 对象是从数据库来的还是自己生成的。

  * 如果没有 `$$typeof` 这个属性，`react` 会拒绝处理该元素。
  * 在 `React` 的古老版本中，下面的写法会出现 `XSS` 攻击：
```js
    // 服务端允许用户存储 JSON
    let expectedTextButGotJSON = {
      type: 'div',
      props: {
        dangerouslySetInnerHTML: {
          __html: '/* 把你想的搁着 */'
        },
      },
      // ...
    };
    let message = { text: expectedTextButGotJSON };
    
    // React 0.13 中有风险
    <p>
      {message.text}
    </p>
```
