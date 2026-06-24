# 45 SPA、SSR的区别是什么

我们现在编写的`Vue`、`React`和`Angular`应用大多数情况下都会在一个页面中，点击链接跳转页面通常是内容切换而非页面跳转，由于良好的用户体验逐渐成为主流的开发模式。但同时也会有首屏加载时间长，`SEO`不友好的问题，因此有了`SSR`，这也是为什么面试中会问到两者的区别

  1. `SPA`（Single Page Application）即单页面应用。一般也称为 客户端渲染（Client Side Render）， 简称 `CSR`。`SSR`（Server Side Render）即 服务端渲染。一般也称为 多页面应用（Mulpile Page Application），简称 `MPA`
  2. `SPA`应用只会首次请求`html`文件，后续只需要请求`JSON`数据即可，因此用户体验更好，节约流量，服务端压力也较小。但是首屏加载的时间会变长，而且`SEO`不友好。为了解决以上缺点，就有了`SSR`方案，由于`HTML`内容在服务器一次性生成出来，首屏加载快，搜索引擎也可以很方便的抓取页面信息。但同时SSR方案也会有性能，开发受限等问题
  3. 在选择上，如果我们的应用存在首屏加载优化需求，`SEO`需求时，就可以考虑`SSR`
  4. 但并不是只有这一种替代方案，比如对一些不常变化的静态网站，SSR反而浪费资源，我们可以考虑预渲染（`prerender`）方案。另外`nuxt.js/next.js`中给我们提供了`SSG（Static Site Generate）`静态网站生成方案也是很好的静态站点解决方案，结合一些`CI`手段，可以起到很好的优化效果，且能节约服务器资源

**内容生成上的区别：**

SSR

![](/images/s_poetries_work_uploads_2022_08_a3c8cf7c4b9b8825.png)

SPA

![](/images/s_poetries_work_uploads_2022_08_46149f14f3674b16.png)

**部署上的区别**

![](/images/s_poetries_work_uploads_2022_08_e302c2f6998f2c7e.png)
