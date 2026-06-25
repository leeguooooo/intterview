# 第118题 script标签的defer和async有什么区别

  * `script`：`HTML`暂停解析，下载`JS`，执行`JS`，在继续解析`HTML`。
  * `defer`：`HTML`继续解析，并行下载`JS`，`HTML`解析完在执行`JS`（不用把`script`放到`body`后面，我们在`head`中`<script defer>`让`js`脚本并行加载会好点）
  * `async`：`HTML`继续解析，并行下载`JS`，执行`JS`（`加载完毕后立即执行`），在继续解析`HTML`
    * 加载完毕后立即执行，这导致`async`属性下的脚本是乱序的，对于 `script` 有先后依赖关系的情况，并不适用

> 注意：`JS`是单线程的，`JS`解析线程和`DOM`解析线程共用同一个线程，`JS执行和HTML解析是互斥的`，加载资源可以并行

![](/images/s_poetries_work_images_20210314221335.webp)

> 蓝色线代表网络读取，红色线代表执行时间，这俩都是针对脚本的；绿色线代表 `HTML` 解析

**连环问：prefetch和dns-prefetch分别是什么**

**preload和prefetch**

  * `preload` 资源在当前页面使用，会优先加载
  * `prefetch` 资源在未来页面使用，空闲时加载
```html
    <head>
      <!-- 当前页面使用 -->
      <link rel="preload" href="style.css" as="style" />
      <link rel="preload" href="main.js" as="script" />
    
      <!-- 未来页面使用 提前加载 比如新闻详情页 -->
      <link rel="prefetch" href="other.js" as="script" />
    
      <!-- 当前页面 引用css -->
      <link rel="stylesheet" href="style.css" />
    </head>
    <body>
      <!-- 当前页面 引用js -->
      <script src="main.js" defer></script>
    </body>
```

**dns-preftch和preconnect**

  * `dns-pretch` `DNS`预查询
  * `preconnect` `DNS`预连接

> 通过预查询和预连接减少`DNS`解析时间
```html
    <head>
      <!-- 针对未来页面提前解析：提高打开速度 -->
      <link rel="dns-pretch" href="https://font.static.com" />
      <link rel="preconnect" href="https://font.static.com" crossorigin />
    </head>
```
