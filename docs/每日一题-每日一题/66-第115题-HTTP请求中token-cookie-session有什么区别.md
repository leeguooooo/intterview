---
title: "HTTP请求中token cookie session有什么区别"
---

# 第115题 HTTP请求中token、cookie、session有什么区别

**cookie**

  * `HTTP`无状态的，每次请求都要携带`cookie`,以帮助识别身份
  * 服务端也可以向客户端`set-cookie`,`cookie`大小`4kb`
  * 默认有跨域限制：不可跨域共享，不可跨域传递`cookie`（可通过设置`withCredential`跨域传递`cookie`）

**cookie本地存储**

  * `HTML5`之前`cookie`常被用于本地存储
  * `HTML5`之后推荐使用`localStorage`和`sessionStorage`

**现代浏览器开始禁止第三方cookie**

  * 和跨域限制不同，这里是：禁止网页引入第三方js设置`cookie`
  * 打击第三方广告设置`cookie`
  * 可以通过属性设置 `SameSite:Strict/Lax/None`

**cookie和session**

  * `cookie`用于登录验证，存储用户表示（`userId`）
  * `session`在服务端，存储用户详细信息，和`cookie`信息一一对应
  * `cookie+session`是常见的登录验证解决方案

![](/images/s_poetries_work_uploads_2023_01_bea409a27a4e9ad2.webp)
```js
    // 登录：用户名 密码
    // 服务端set-cookie: userId=x1 把用户id传给浏览器存储在cookie中
    // 下次请求直接带上cookie:userId=x1 服务端根据userId找到哪个用户的信息
    
    // 服务端session集中存储所有的用户信息在缓存中
    const session = {
      x1: {
        username:'xx1',
        email:'xx1'
      },
      x2: { // 当下次来了一个用户x2也记录x2的登录信息,同时x1也不会丢失
        username:'xx2',
        email:'xx2'
      },
    }
```

**token和cookie**

  * `cookie`是`HTTP`规范（每次请求都会携带），而`token`是自定义传递
  * `cookie`会默认被浏览器存储，而`token`需自己存储
  * `token`默认没有跨域限制

**JWT(json web token)**

  * 前端发起登录，后端验证成功后，返回一个加密的`token`
  * 前端自行存储这个`token`（其他包含了用户信息，加密的）
  * 以后访问服务端接口，都携带着这个`token`，作为用户信息

**session和jwt哪个更好？**

  * **session的优点**
    * 用户信息存储在服务端，可快速封禁某个用户
    * 占用服务端内存，成本高
    * 多进程多服务器时不好同步，需要使用`redis`缓存
    * 默认有跨域限制
  * **JWT的优点**
    * 不占用服务端内存，`token`存储在客户端浏览器
    * 多进程、多服务器不受影响
    * 没有跨域限制
    * 用户信息存储在客户端，无法快速封禁某用户（可以在服务端建立黑名单，也需要成本）
    * 万一服务端密钥被泄露，则用户信息全部丢失
    * `token`体积一般比`cookie`大，会增加请求的数据量
  * 如严格管理用户信息（保密、快速封禁）推荐使用`session`
  * 没有特殊要求，推荐使用`JWT`

**如何实现SSO(Single Sign On)单点登录**

  * 单点登录的`本质就是在多个应用系统中共享登录状态`，如果用户的登录状态是记录在 `Session` 中的，要实现共享登录状态，就要先共享 `Session`

  * 所以实现单点登录的关键在于，如何让 `Session ID`（或 `Token`）在多个域中共享

  * **主域名相同，基于cookie实现单点登录**

    * `cookie`默认不可跨域共享，但有些情况下可设置跨域共享
    * 主域名相同，如`www.baidu.com`、`image.baidu.com`
    * 设置`cookie domain`为主域`baidu.com`，即可共享`cookie`
    * 主域名不同，则`cookie`无法共享。可使用`sso`技术方案来做
  * **主域名不同，基于SSO技术方案实现**

    * 系统`A`、`B`、`SSO`域名都是独立的
    * 用户访问系统`A`，系统`A`重定向到`SSO`登录（登录页面在`SSO`）输入用户名密码提交到`SSO`，验证用户名密码，将登录状态写入`SSO`的`session`，同时将`token`作为参数返回给客户端
    * 客户端携带`token`去访问系统`A`，系统`A`携带`token`去`SSO`验证，`SSO`验证通过返回用户信息给系统`A`
    * 用户访问`B`系统，`B`系统没有登录，重定向到`SSO`获取`token`（由于`SSO`已经登录了，不需要重新登录认证，之前在`A`系统登录过）,拿着`token`去`B`系统，`B`系统拿着`token`去`SSO`里面换取用户信息
    * 整个所有用户的登录、用户信息的保存、用户的`token`验证，全部都在`SSO`第三方独立的服务中处理

![](/images/s_poetries_work_uploads_2023_01_428ac761b592fbc1.webp)
