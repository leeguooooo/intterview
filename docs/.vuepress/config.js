import { blogPlugin } from "@vuepress/plugin-blog";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { pwaPlugin } from "@vuepress/plugin-pwa";

const config = defineUserConfig({
  "shouldPrefetch": false,
  "lang": "zh-CN",
  "title": "前端面试题集锦",
  "description": "为前端开发者准备的面试题库",
  "head": [
    ["link", { "rel": "stylesheet", "href": "/safe-area.css" }],
    ["link", { "rel": "manifest", "href": "/manifest.json" }],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1.0, viewport-fit=cover"
      }
    ],
    ["meta", { "name": "theme-color", "content": "#3eaf7c" }],
    ["meta", { "name": "apple-mobile-web-app-capable", "content": "yes" }],
    [
      "meta",
      { "name": "apple-mobile-web-app-status-bar-style", "content": "black" }
    ],
    [
      "link",
      { "rel": "apple-touch-icon", "href": "/images/icons/icon-152x152.png" }
    ],
    [
      "link",
      {
        "rel": "mask-icon",
        "href": "/images/icons/safari-pinned-tab.svg",
        "color": "#3eaf7c"
      }
    ],
    [
      "meta",
      {
        "name": "msapplication-TileImage",
        "content": "/images/icons/icon-144x144.png"
      }
    ],
    ["meta", { "name": "msapplication-TileColor", "content": "#000000" }]
  ],
  "theme": defaultTheme({
    "logo": "images/logo.webp",
    "hostname": "https://interview.leeguoo.com",
    "externalLinkIcon": false,
    "colorModeSwitcher": true,
    "navbar": [
      {
        "text": "首页",
        "link": "/",
        "test": "123"
      },
      {
        "text": "题库",
        "children": [
          {
            "text": "基础篇",
            "link": "/基础篇.html",
            "originUrl":
              "https://interview.poetries.top/docs/base.html#%E4%B8%80%E3%80%81html%E3%80%81http%E3%80%81web%E7%BB%BC%E5%90%88%E9%97%AE%E9%A2%98",
            "updateTime": "2024-06-06 02.23.49"
          },
          {
            "text": "进阶篇",
            "link": "/进阶篇.html",
            "originUrl":
              "https://interview.poetries.top/docs/base/improve.html",
            "updateTime": "2024-06-06 02.23.01"
          },
          {
            "text": "高频篇",
            "link": "/高频篇.html",
            "originUrl":
              "https://interview.poetries.top/docs/base/high-frequency.html",
            "updateTime": "2024-06-06 02.13.00"
          },
          {
            "text": "HTML",
            "link": "/HTML.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/1-HTML%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.12"
          },
          {
            "text": "CSS",
            "link": "/CSS.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/2-CSS%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.14"
          },
          {
            "text": "JavaScript",
            "link": "/JavaScript.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/3-JS%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.18"
          },
          {
            "text": "ES6",
            "link": "/ES6.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/4-ES6%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.22"
          },
          {
            "text": "浏览器",
            "link": "/浏览器.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/5-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.24"
          },
          {
            "text": "React",
            "link": "/React.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/6-React.html",
            "updateTime": "2024-06-06 02.13.26"
          },
          {
            "text": "Vue",
            "link": "/Vue.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/7-Vue.html",
            "updateTime": "2024-06-06 02.13.31"
          },
          {
            "text": "Node",
            "link": "/Node.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/8-Node%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.45"
          },
          {
            "text": "前端工程化",
            "link": "/前端工程化.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/9-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.48"
          },
          {
            "text": "移动多端开发",
            "link": "/移动多端开发.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/10-%E7%A7%BB%E5%8A%A8%E5%A4%9A%E7%AB%AF%E5%BC%80%E5%8F%91.html",
            "updateTime": "2024-06-06 02.13.51"
          },
          {
            "text": "小程序",
            "link": "/小程序.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/11-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.53"
          },
          {
            "text": "Uniapp",
            "link": "/Uniapp.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/12-Uniapp%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.13.55"
          },
          {
            "text": "前端安全",
            "link": "/前端安全.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/13-%E5%89%8D%E7%AB%AF%E5%AE%89%E5%85%A8%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.14.01"
          },
          {
            "text": "性能优化",
            "link": "/性能优化.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/14-%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.14.03"
          },
          {
            "text": "HTTP",
            "link": "/HTTP.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/15-HTTP%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-06 02.14.05"
          },
          {
            "text": "常用设计模式",
            "link": "/常用设计模式.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/16-%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html",
            "updateTime": "2024-06-06 02.14.07"
          },
          {
            "text": "设计模式 2",
            "link": "/设计模式 2.html",
            "originUrl":
              "https://interview.poetries.top/docs/base/design-pattern.html",
            "updateTime": "2024-06-06 02.14.11"
          },
          {
            "text": "框架通识",
            "link": "/框架通识.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/17-%E6%A1%86%E6%9E%B6%E9%80%9A%E8%AF%86.html",
            "updateTime": "2024-06-06 02.14.19"
          },
          {
            "text": "排序算法",
            "link": "/排序算法.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/18-%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95.html",
            "updateTime": "2024-06-06 02.14.22"
          },
          {
            "text": "计算机通识",
            "link": "/计算机通识.html",
            "originUrl":
              "https://interview.poetries.top/docs/excellent-docs/19-%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%80%9A%E8%AF%86.html",
            "updateTime": "2024-06-06 02.14.24"
          }
        ]
      },
      {
        "text": "Vue 源码解析",
        "children": [
          {
            "text": "Vue-生命周期",
            "link": "/Vue源码.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/01-%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BBVue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html",
            "updateTime": "2024-06-06 02.14.27"
          },
          {
            "text": "Vue-组件的本质",
            "link": "/Vue-组件的本质.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/02-%E7%BB%84%E4%BB%B6%E7%9A%84%E6%9C%AC%E8%B4%A8.html",
            "updateTime": "2024-06-06 02.14.28"
          },
          {
            "text": "Vue-有状态组件的设计",
            "link": "/Vue-有状态组件的设计.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html",
            "updateTime": "2024-06-06 02.24.16"
          },
          {
            "text": "Vue-VNode",
            "link": "/Vue-VNode.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html",
            "updateTime": "2024-06-06 02.24.18"
          },
          {
            "text": "Vue-辅助创建VNode的h函数",
            "link": "/Vue-辅助创建 VNode 的 h 函数.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/05-%E8%BE%85%E5%8A%A9%E5%88%9B%E5%BB%BA%20VNode%20%E7%9A%84%20h%20%E5%87%BD%E6%95%B0.html",
            "updateTime": "2024-06-06 02.24.20"
          },
          {
            "text": "Vue-自定义渲染器和异步渲染",
            "link": "/Vue-自定义渲染器和异步渲染.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html",
            "updateTime": "2024-06-06 02.24.22"
          },
          {
            "text": "Vue-渲染器之挂载",
            "link": "/Vue-渲染器之挂载.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html",
            "updateTime": "2024-06-06 02.24.23"
          },
          {
            "text": "Vue-渲染器的核心 Diff 算法",
            "link": "/Vue-渲染器的核心 Diff 算法.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/08-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95.html",
            "updateTime": "2024-06-06 02.24.26"
          },
          {
            "text": "Vue-渲染器之patch",
            "link": "/Vue-渲染器之 patch.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html",
            "updateTime": "2024-06-06 02.24.29"
          },
          {
            "text": "Vue-图解 Vue 响应式原理",
            "link": "Vue-图解 Vue 响应式原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/10-%E5%9B%BE%E8%A7%A3%20Vue%20%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 02.24.32"
          },
          {
            "text": "Vue-图解 Vue 异步更新",
            "link": "Vue-图解 Vue 异步更新.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/11-%E5%9B%BE%E8%A7%A3%20Vue%20%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0.html",
            "updateTime": "2024-06-06 02.24.33"
          },
          {
            "text": "Vue-剖析 Vue 内部运行机制",
            "link": "Vue-剖析 Vue 内部运行机制.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/12-%E5%89%96%E6%9E%90%20Vue%20%E5%86%85%E9%83%A8%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6.html",
            "updateTime": "2024-06-06 02.24.35"
          },
          {
            "text": "Vue-vue响应式原理模拟",
            "link": "Vue-vue响应式原理模拟.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/13-vue%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86%E6%A8%A1%E6%8B%9F.html",
            "updateTime": "2024-06-06 02.24.38"
          },
          {
            "text": "Vue-vue状态管理之vuex",
            "link": "Vue-vue状态管理之vuex.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/14-vue%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E4%B9%8Bvuex.html",
            "updateTime": "2024-06-06 02.24.39"
          },
          {
            "text": "Vue-理解Vue的设计思想及实现Vue",
            "link": "Vue-理解Vue的设计思想及实现Vue.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/15-%E7%90%86%E8%A7%A3Vue%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3%E5%8F%8A%E5%AE%9E%E7%8E%B0Vue.html",
            "updateTime": "2024-06-06 02.24.41"
          },
          {
            "text": "Vue-diff算法深入",
            "link": "Vue-diff算法深入.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/16-diff%E7%AE%97%E6%B3%95%E6%B7%B1%E5%85%A5.html",
            "updateTime": "2024-06-06 02.24.44"
          },
          {
            "text": "Vue-vue router vuex原理分析",
            "link": "Vue-vue router vuex原理分析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/17-vue%20router%20vuex%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html#vue-router",
            "updateTime": "2024-06-06 02.24.46"
          },
          {
            "text": "Vue-Vue3初探响应式原理.",
            "link": "Vue-Vue3初探响应式原理..html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/18-Vue3%E5%88%9D%E6%8E%A2%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86..html",
            "updateTime": "2024-06-06 02.24.48"
          },
          {
            "text": "Vue-vue2源码分析",
            "link": "Vue-vue2源码分析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/19-vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html",
            "updateTime": "2024-06-06 02.24.50"
          },
          {
            "text": "Vue-vue组件化实践",
            "link": "Vue-vue组件化实践.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/vue/20-vue%E7%BB%84%E4%BB%B6%E5%8C%96%E5%AE%9E%E8%B7%B5.html",
            "updateTime": "2024-06-06 02.24.52"
          }
        ]
      },
      {
        "text": "文章",
        "link": "/article/"
      },
      {
        "text": "分类",
        "link": "/category/"
      },
      {
        "text": "标签",
        "link": "/tag/"
      },
      {
        "text": "时间线",
        "link": "/timeline/"
      },
      {
        "text": "React",
        "children": [
          {
            "text": "React-React router原理",
            "link": "React-React router原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/01-React%20router%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.55.08"
          },
          {
            "text": "React-dva 总结",
            "link": "React-dva 总结.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/02-Dva%E6%80%BB%E7%BB%93.html",
            "updateTime": "2024-06-06 13.55.10"
          },
          {
            "text": "React-Mobx 总结",
            "link": "React-Mobx 总结.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/03-MobX%E6%80%BB%E7%BB%93.html",
            "updateTime": "2024-06-06 13.55.12"
          },
          {
            "text": "React-浅析redux saga中间件及用法",
            "link": "React-浅析redux saga中间件及用法.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/04-%E6%B5%85%E6%9E%90redux%20saga%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%8F%8A%E7%94%A8%E6%B3%95.html",
            "updateTime": "2024-06-06 13.55.13"
          },
          {
            "text": "React-Redux之浅析中间件",
            "link": "React-Redux之浅析中间件.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/05-Redux%E4%B9%8B%E6%B5%85%E6%9E%90%E4%B8%AD%E9%97%B4%E4%BB%B6.html#%E4%B8%80%E3%80%81%E5%89%8D%E8%A8%80",
            "updateTime": "2024-06-06 13.55.15"
          },
          {
            "text": "React-Redux之源码分析",
            "link": "React-Redux之源码分析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/06-Redux%E4%B9%8B%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html",
            "updateTime": "2024-06-06 13.55.18"
          },
          {
            "text": "React-Redux之异步Action及操作",
            "link": "React-Redux之异步Action及操作.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/07-Redux%E4%B9%8B%E5%BC%82%E6%AD%A5Action%E5%8F%8A%E6%93%8D%E4%BD%9C.html",
            "updateTime": "2024-06-06 13.55.20"
          },
          {
            "text": "React-浅析中间件",
            "link": "React-浅析中间件.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/08-%E6%B5%85%E6%9E%90%E4%B8%AD%E9%97%B4%E4%BB%B6.html",
            "updateTime": "2024-06-06 13.55.22"
          },
          {
            "text": "React-react结合redux实战",
            "link": "React-react结合redux实战.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/09-react%E7%BB%93%E5%90%88redux%E5%AE%9E%E6%88%98.html",
            "updateTime": "2024-06-06 13.55.24"
          },
          {
            "text": "React-Immutable总结",
            "link": "React-Immutable总结.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/10-Immutable%E6%80%BB%E7%BB%93.html",
            "updateTime": "2024-06-06 13.55.26"
          },
          {
            "text": "React-React16为什么要更改生命周期上",
            "link": "React-React16为什么要更改生命周期上.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/11-React16%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%9B%B4%E6%94%B9%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8A.html",
            "updateTime": "2024-06-06 13.55.31"
          },
          {
            "text": "React-React16为什么要更改生命周期下",
            "link": "React-React16为什么要更改生命周期下.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/12-React16%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%9B%B4%E6%94%B9%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8B.html",
            "updateTime": "2024-06-06 13.55.33"
          },
          {
            "text": "React-React Hooks 设计动机与工作模式",
            "link": "React-React Hooks 设计动机与工作模式.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/13-React%20Hooks%20%E8%AE%BE%E8%AE%A1%E5%8A%A8%E6%9C%BA%E4%B8%8E%E5%B7%A5%E4%BD%9C%E6%A8%A1%E5%BC%8F.html",
            "updateTime": "2024-06-06 13.55.36"
          },
          {
            "text": "React-深入 React Hooks 工作机制",
            "link": "React-深入 React Hooks 工作机制.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/14-%E6%B7%B1%E5%85%A5%20React%20Hooks%20%E5%B7%A5%E4%BD%9C%E6%9C%BA%E5%88%B6.html",
            "updateTime": "2024-06-06 13.55.38"
          },
          {
            "text": "React-15-真正理解虚拟DOM",
            "link": "React-15-真正理解虚拟DOM.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/15-%E7%9C%9F%E6%AD%A3%E7%90%86%E8%A7%A3%E8%99%9A%E6%8B%9FDOM.html",
            "updateTime": "2024-06-06 13.55.41"
          },
          {
            "text": "React-17-setState-到底是同步的-还是异步的",
            "link": "React-17-setState-到底是同步的-还是异步的.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/17-setState%20%E5%88%B0%E5%BA%95%E6%98%AF%E5%90%8C%E6%AD%A5%E7%9A%84%EF%BC%8C%E8%BF%98%E6%98%AF%E5%BC%82%E6%AD%A5%E7%9A%84.html",
            "updateTime": "2024-06-06 13.55.43"
          },
          {
            "text": "React-16-React-中的-栈调和-Stack-Reconciler-过程是怎样的",
            "link":
              "React-16-React-中的-栈调和-Stack-Reconciler-过程是怎样的.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/16-React%20%E4%B8%AD%E7%9A%84%E2%80%9C%E6%A0%88%E8%B0%83%E5%92%8C%E2%80%9D%20Stack%20Reconciler%20%E8%BF%87%E7%A8%8B%E6%98%AF%E6%80%8E%E6%A0%B7%E7%9A%84.html",
            "updateTime": "2024-06-06 13.55.45"
          },
          {
            "text": "React-18-如何理解-Fiber-架构的迭代动机与设计思想",
            "link": "React-18-如何理解-Fiber-架构的迭代动机与设计思想.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/18-%E5%A6%82%E4%BD%95%E7%90%86%E8%A7%A3%20Fiber%20%E6%9E%B6%E6%9E%84%E7%9A%84%E8%BF%AD%E4%BB%A3%E5%8A%A8%E6%9C%BA%E4%B8%8E%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3.html",
            "updateTime": "2024-06-06 13.55.47"
          },
          {
            "text": "React-19-ReactDOM-render-是如何串联渲染链路的",
            "link": "React-19-ReactDOM-render-是如何串联渲染链路的.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/19-ReactDOM.render%20%E6%98%AF%E5%A6%82%E4%BD%95%E4%B8%B2%E8%81%94%E6%B8%B2%E6%9F%93%E9%93%BE%E8%B7%AF%E7%9A%84.html",
            "updateTime": "2024-06-06 13.55.49"
          },
          {
            "text": "React-20-剖析-Fiber-架构下-Concurrent-模式的实现原理",
            "link": "React-20-剖析-Fiber-架构下-Concurrent-模式的实现原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/20-%E5%89%96%E6%9E%90%20Fiber%20%E6%9E%B6%E6%9E%84%E4%B8%8B%20Concurrent%20%E6%A8%A1%E5%BC%8F%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.55.52"
          },
          {
            "text": "React-21-React-事件与-DOM-事件有何不同",
            "link": "React-21-React-事件与-DOM-事件有何不同.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/21-React%20%E4%BA%8B%E4%BB%B6%E4%B8%8E%20DOM%20%E4%BA%8B%E4%BB%B6%E6%9C%89%E4%BD%95%E4%B8%8D%E5%90%8C.html",
            "updateTime": "2024-06-06 13.55.53"
          },
          {
            "text": "React-22-揭秘-Redux-设计思想与工作原理",
            "link": "React-22-揭秘-Redux-设计思想与工作原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/22-%E6%8F%AD%E7%A7%98%20Redux%20%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.55.56"
          },
          {
            "text": "React-23-从-Redux-中间件实现原理切入-理解-面向切面编程-",
            "link":
              "React-23-从-Redux-中间件实现原理切入-理解-面向切面编程-.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/23-%E4%BB%8E%20Redux%20%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E5%88%87%E5%85%A5%EF%BC%8C%E7%90%86%E8%A7%A3%E2%80%9C%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%BC%96%E7%A8%8B%E2%80%9D.html",
            "updateTime": "2024-06-06 13.55.58"
          },
          {
            "text": "React-24-如何打造高性能的-React-应用",
            "link": "React-24-如何打造高性能的-React-应用.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/24-%E5%A6%82%E4%BD%95%E6%89%93%E9%80%A0%E9%AB%98%E6%80%A7%E8%83%BD%E7%9A%84%20React%20%E5%BA%94%E7%94%A8.html",
            "updateTime": "2024-06-06 13.56.00"
          },
          {
            "text": "React-25-跟-React-学设计模式",
            "link": "React-25-跟-React-学设计模式.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/25-%E8%B7%9F%20React%20%E5%AD%A6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html",
            "updateTime": "2024-06-06 13.56.02"
          },
          {
            "text": "React-26-React全部api解读",
            "link": "React-26-React全部api解读.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/26-React%E5%85%A8%E9%83%A8api%E8%A7%A3%E8%AF%BB.html",
            "updateTime": "2024-06-01 13.16.41"
          },
          {
            "text": "React-27-Taro原理",
            "link": "React-27-Taro原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/react/27-Taro%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.04"
          }
        ]
      },
      {
        "text": "Webpack",
        "children": [
          {
            "text": "Webpack-01-Webpack4打包机制原理解析",
            "link": "Webpack-01-Webpack4打包机制原理解析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/01-Webpack4%E6%89%93%E5%8C%85%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90.html",
            "updateTime": "2024-06-06 13.56.06"
          },
          {
            "text": "Webpack-02-webpack中的HMR热更新原理剖析",
            "link": "Webpack-02-webpack中的HMR热更新原理剖析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/02-webpack%E4%B8%AD%E7%9A%84HMR%E7%83%AD%E6%9B%B4%E6%96%B0%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90.html",
            "updateTime": "2024-06-06 13.56.08"
          },
          {
            "text": "Webpack-03-从源码窥探Webpack4-x原理",
            "link": "Webpack-03-从源码窥探Webpack4-x原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/03-%E4%BB%8E%E6%BA%90%E7%A0%81%E7%AA%A5%E6%8E%A2Webpack4.x%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.10"
          },
          {
            "text": "Webpack-04-实现webpack小型打包工具",
            "link": "Webpack-04-实现webpack小型打包工具.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/04-%E5%AE%9E%E7%8E%B0webpack%E5%B0%8F%E5%9E%8B%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7.html",
            "updateTime": "2024-06-06 13.56.12"
          },
          {
            "text": "Webpack-05-Babel原理及其使用",
            "link": "Webpack-05-Babel原理及其使用.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/05-Babel%E5%8E%9F%E7%90%86%E5%8F%8A%E5%85%B6%E4%BD%BF%E7%94%A8.html",
            "updateTime": "2024-06-06 13.56.13"
          },
          {
            "text": "Webpack-06-Webpack-与-Rollup-二者之间该如何选择",
            "link": "Webpack-06-Webpack-与-Rollup-二者之间该如何选择.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/06-Webpack%20%E4%B8%8E%20Rollup%20%E4%BA%8C%E8%80%85%E4%B9%8B%E9%97%B4%E8%AF%A5%E5%A6%82%E4%BD%95%E9%80%89%E6%8B%A9.html",
            "updateTime": "2024-06-06 13.56.15"
          },
          {
            "text": "Webpack-07-前端构建新玩法-Vite-上手与思考",
            "link": "Webpack-07-前端构建新玩法-Vite-上手与思考.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/07-%E5%89%8D%E7%AB%AF%E6%9E%84%E5%BB%BA%E6%96%B0%E7%8E%A9%E6%B3%95%20Vite%20%E4%B8%8A%E6%89%8B%E4%B8%8E%E6%80%9D%E8%80%83.html",
            "updateTime": "2024-06-06 13.56.17"
          },
          {
            "text": "Webpack-08-利用-Webpack-CodeSplitting-完成复杂应用拆包",
            "link":
              "Webpack-08-利用-Webpack-CodeSplitting-完成复杂应用拆包.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/08-%E5%88%A9%E7%94%A8%20Webpack%20CodeSplitting%20%E5%AE%8C%E6%88%90%E5%A4%8D%E6%9D%82%E5%BA%94%E7%94%A8%E6%8B%86%E5%8C%85.html",
            "updateTime": "2024-06-06 13.56.19"
          },
          {
            "text":
              "Webpack-09-玩转-Webpack-的-TreeShaking-与-sideEffects-特性",
            "link":
              "Webpack-09-玩转-Webpack-的-TreeShaking-与-sideEffects-特性.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/09-%E7%8E%A9%E8%BD%AC%20Webpack%20%E7%9A%84%20TreeShaking%20%E4%B8%8E%20sideEffects%20%E7%89%B9%E6%80%A7.html",
            "updateTime": "2024-06-06 13.56.24"
          },
          {
            "text": "Webpack-10-如何配置-Webpack-SourceMap-的最佳实践",
            "link": "Webpack-10-如何配置-Webpack-SourceMap-的最佳实践.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/10-%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%20Webpack%20SourceMap%20%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.html",
            "updateTime": "2024-06-06 13.56.25"
          },
          {
            "text": "Webpack-11-Webpack-运行机制与核心工作原理",
            "link": "Webpack-11-Webpack-运行机制与核心工作原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/webpack/11-Webpack%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6%E4%B8%8E%E6%A0%B8%E5%BF%83%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.27"
          }
        ]
      },
      {
        "text": "Node",
        "children": [
          {
            "text": "Node-01-Node事件循环机制原理",
            "link": "Node-01-Node事件循环机制原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/node/01-Node%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.29"
          },
          {
            "text": "Node-02-express详细使用",
            "link": "Node-02-express详细使用.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/node/02-express%E8%AF%A6%E7%BB%86%E4%BD%BF%E7%94%A8.html",
            "updateTime": "2024-06-06 13.56.31"
          },
          {
            "text": "Node-03-koa基本用法",
            "link": "Node-03-koa基本用法.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/node/03-koa%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95.html",
            "updateTime": "2024-06-06 13.56.33"
          }
        ]
      },
      {
        "text": "Javascript",
        "children": [
          {
            "text": "Javascript-01-JavaScript-引擎如何执行-JavaScript-代码",
            "link":
              "Javascript-01-JavaScript-引擎如何执行-JavaScript-代码.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/js/01-JavaScript%20%E5%BC%95%E6%93%8E%E5%A6%82%E4%BD%95%E6%89%A7%E8%A1%8C%20JavaScript%20%E4%BB%A3%E7%A0%81.html",
            "updateTime": "2024-06-06 13.56.35"
          },
          {
            "text": "Javascript-02-单线程的-JavaScript-如何管理任务",
            "link": "Javascript-02-单线程的-JavaScript-如何管理任务.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/js/02-%E5%8D%95%E7%BA%BF%E7%A8%8B%E7%9A%84%20JavaScript%20%E5%A6%82%E4%BD%95%E7%AE%A1%E7%90%86%E4%BB%BB%E5%8A%A1.html",
            "updateTime": "2024-06-06 13.56.37"
          }
        ]
      },
      {
        "text": "综合",
        "children": [
          {
            "text": "综合-01-虚拟DOM原理分析-什么是-virtual-dom",
            "link": "综合-01-虚拟DOM原理分析-什么是-virtual-dom.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/01-%E8%99%9A%E6%8B%9FDOM%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html#%E4%BB%80%E4%B9%88%E6%98%AF-virtual-dom",
            "updateTime": "2024-06-06 13.56.39"
          },
          {
            "text": "综合-02-setTimeout实现原理和使用注意",
            "link": "综合-02-setTimeout实现原理和使用注意.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/02-setTimeout%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F.html",
            "updateTime": "2024-06-06 13.56.41"
          },
          {
            "text": "综合-03-浅析Promise原理",
            "link": "综合-03-浅析Promise原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/03-%E6%B5%85%E6%9E%90Promise%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.42"
          },
          {
            "text": "综合-04-浏览器渲染原理",
            "link": "综合-04-浏览器渲染原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/04-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.56.44"
          },
          {
            "text": "综合-05-前端面试之MVVM浅析",
            "link": "综合-05-前端面试之MVVM浅析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/05-%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95%E4%B9%8BMVVM%E6%B5%85%E6%9E%90.html",
            "updateTime": "2024-06-06 13.56.46"
          },
          {
            "text": "综合-06-前端面试之组件化",
            "link": "综合-06-前端面试之组件化.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/06-%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95%E4%B9%8B%E7%BB%84%E4%BB%B6%E5%8C%96.html",
            "updateTime": "2024-06-06 13.56.47"
          },
          {
            "text": "综合-07-虚拟DOM-一-",
            "link": "综合-07-虚拟DOM-一-.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/07-%E8%99%9A%E6%8B%9FDOM%EF%BC%88%E4%B8%80%EF%BC%89.html",
            "updateTime": "2024-06-06 13.56.49"
          },
          {
            "text": "综合-08-虚拟DOM-二-",
            "link": "综合-08-虚拟DOM-二-.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/08-%E8%99%9A%E6%8B%9FDOM%EF%BC%88%E4%BA%8C%EF%BC%89.html",
            "updateTime": "2024-06-06 13.56.50"
          },
          {
            "text": "综合-09-前端性能之Performance",
            "link": "综合-09-前端性能之Performance.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/09-%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%B9%8BPerformance.html",
            "updateTime": "2024-06-06 13.56.52"
          },
          {
            "text": "综合-10-小程序开发实践",
            "link": "综合-10-小程序开发实践.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/10-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5.html",
            "updateTime": "2024-06-06 13.56.54"
          },
          {
            "text": "综合-11-对比-Koa-和-Redux-分析前端中的中间件理念",
            "link": "综合-11-对比-Koa-和-Redux-分析前端中的中间件理念.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/11-%E5%AF%B9%E6%AF%94%20Koa%20%E5%92%8C%20Redux-%E5%88%86%E6%9E%90%E5%89%8D%E7%AB%AF%E4%B8%AD%E7%9A%84%E4%B8%AD%E9%97%B4%E4%BB%B6%E7%90%86%E5%BF%B5.html",
            "updateTime": "2024-06-06 13.56.56"
          },
          {
            "text": "综合-12-正则完整篇",
            "link": "综合-12-正则完整篇.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/12-%E6%AD%A3%E5%88%99%E5%AE%8C%E6%95%B4%E7%AF%87.html",
            "updateTime": "2024-06-06 13.56.58"
          },
          {
            "text": "综合-13-打造前端监控系统",
            "link": "综合-13-打造前端监控系统.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/13-%E6%89%93%E9%80%A0%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F.html",
            "updateTime": "2024-06-06 13.57.01"
          },
          {
            "text": "综合-14-浏览器渲染机制",
            "link": "综合-14-浏览器渲染机制.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/14-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%9C%BA%E5%88%B6.html",
            "updateTime": "2024-06-06 13.57.04"
          },
          {
            "text": "综合-15-前端缓存方案解析",
            "link": "综合-15-前端缓存方案解析.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/15-%E5%89%8D%E7%AB%AF%E7%BC%93%E5%AD%98%E6%96%B9%E6%A1%88%E8%A7%A3%E6%9E%90.html",
            "updateTime": "2024-06-06 13.57.06"
          },
          {
            "text": "综合-16-小程序原理",
            "link": "综合-16-小程序原理.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/16-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-06 13.57.09"
          },
          {
            "text": "综合-17-深入剖析浏览器中页面的渲染过程",
            "link": "综合-17-深入剖析浏览器中页面的渲染过程.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/17-%E6%B7%B1%E5%85%A5%E5%89%96%E6%9E%90%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%B8%B2%E6%9F%93%E8%BF%87%E7%A8%8B.html",
            "updateTime": "2024-06-06 13.57.11"
          },
          {
            "text": "综合-18-一个网络请求是怎么进行的",
            "link": "综合-18-一个网络请求是怎么进行的.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/18-%E4%B8%80%E4%B8%AA%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%98%AF%E6%80%8E%E4%B9%88%E8%BF%9B%E8%A1%8C%E7%9A%84.html",
            "updateTime": "2024-06-06 13.57.12"
          },
          {
            "text": "综合-19-前端性能定位",
            "link": "综合-19-前端性能定位.html",
            "originUrl":
              "https://interview.poetries.top/principle-docs/comprehensive/19-%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E5%AE%9A%E4%BD%8D.html",
            "updateTime": "2024-06-06 13.57.15"
          }
        ]
      },
      {
        "text": "面经",
        "children": [
          {
            "text": "面经-前端面经汇总",
            "link": "面经-前端面经汇总.html",
            "originUrl":
              "https://interview.poetries.top/interview-exp/%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F%E6%B1%87%E6%80%BB.html",
            "updateTime": "2024-06-06 13.57.17"
          }
        ]
      },
      {
        "text": "自检",
        "children": [
          {
            "text": "自检-1-前端100题自检",
            "link": "自检-1-前端100题自检.html",
            "originUrl":
              "https://interview.poetries.top/qa/1-%E5%89%8D%E7%AB%AF100%E9%A2%98%E8%87%AA%E6%A3%80.html",
            "updateTime": "2024-06-06 13.57.24"
          }
        ]
      },
      {
        "text": "每日一题",
        "children": [
          {
            "text": "每日一题-每日一题",
            "link": "每日一题-每日一题.html",
            "originUrl":
              "https://interview.poetries.top/days/%E6%AF%8F%E6%97%A5%E4%B8%80%E9%A2%98.html",
            "updateTime": "2024-06-06 13.57.27"
          }
        ]
      },
      {
        "text": "http 基础",
        "children": [
          {
            "text": "http 基础-01-HTTP的前世今生",
            "link": "http 基础-01-HTTP的前世今生.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/01-HTTP%E7%9A%84%E5%89%8D%E4%B8%96%E4%BB%8A%E7%94%9F.html",
            "updateTime": "2024-06-06 13.57.44"
          },
          {
            "text": "http 基础-02-HTTP是什么",
            "link": "http 基础-02-HTTP是什么.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/02-HTTP%E6%98%AF%E4%BB%80%E4%B9%88.html",
            "updateTime": "2024-06-06 13.57.46"
          },
          {
            "text": "http 基础-03-HTTP世界全览",
            "link": "http 基础-03-HTTP世界全览.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/03-HTTP%E4%B8%96%E7%95%8C%E5%85%A8%E8%A7%88.html",
            "updateTime": "2024-06-06 13.57.47"
          },
          {
            "text": "http 基础-04-HTTP分层",
            "link": "http 基础-04-HTTP分层.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/04-HTTP%E5%88%86%E5%B1%82.html",
            "updateTime": "2024-06-06 13.57.50"
          },
          {
            "text": "http 基础-05-键入网址到回车发生什么",
            "link": "http 基础-05-键入网址到回车发生什么.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/05-%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E5%88%B0%E5%9B%9E%E8%BD%A6%E5%8F%91%E7%94%9F%E4%BB%80%E4%B9%88.html",
            "updateTime": "2024-06-06 13.57.52"
          },
          {
            "text": "http 基础-06-HTTP报文是什么样子的",
            "link": "http 基础-06-HTTP报文是什么样子的.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/06-HTTP%E6%8A%A5%E6%96%87%E6%98%AF%E4%BB%80%E4%B9%88%E6%A0%B7%E5%AD%90%E7%9A%84.html",
            "updateTime": "2024-06-06 13.57.53"
          },
          {
            "text": "http 基础-07-理解请求方法",
            "link": "http 基础-07-理解请求方法.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/07-%E7%90%86%E8%A7%A3%E8%AF%B7%E6%B1%82%E6%96%B9%E6%B3%95.html",
            "updateTime": "2024-06-06 13.57.55"
          },
          {
            "text": "http 基础-08-URI",
            "link": "http 基础-08-URI.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/08-URI.html",
            "updateTime": "2024-06-06 13.57.59"
          },
          {
            "text": "http 基础-09-响应状态码",
            "link": "http 基础-09-响应状态码.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/09-%E5%93%8D%E5%BA%94%E7%8A%B6%E6%80%81%E7%A0%81.html",
            "updateTime": "2024-06-06 13.58.00"
          },
          {
            "text": "http 基础-10-HTTP有哪些特点",
            "link": "http 基础-10-HTTP有哪些特点.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/10-HTTP%E6%9C%89%E5%93%AA%E4%BA%9B%E7%89%B9%E7%82%B9.html",
            "updateTime": "2024-06-06 13.58.02"
          },
          {
            "text": "http 基础-11-HTTP优缺点",
            "link": "http 基础-11-HTTP优缺点.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/11-HTTP%E4%BC%98%E7%BC%BA%E7%82%B9.html",
            "updateTime": "2024-06-06 13.58.03"
          },
          {
            "text": "http 基础-12-HTTP的实体数据",
            "link": "http 基础-12-HTTP的实体数据.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/12-HTTP%E7%9A%84%E5%AE%9E%E4%BD%93%E6%95%B0%E6%8D%AE.html",
            "updateTime": "2024-06-06 13.58.05"
          },
          {
            "text": "http 基础-13-HTTP传输大文件",
            "link": "http 基础-13-HTTP传输大文件.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/13-HTTP%E4%BC%A0%E8%BE%93%E5%A4%A7%E6%96%87%E4%BB%B6.html",
            "updateTime": "2024-06-06 13.58.06"
          },
          {
            "text": "http 基础-14-HTTP的连接管理",
            "link": "http 基础-14-HTTP的连接管理.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/14-HTTP%E7%9A%84%E8%BF%9E%E6%8E%A5%E7%AE%A1%E7%90%86.html",
            "updateTime": "2024-06-06 13.58.08"
          },
          {
            "text": "http 基础-15-HTTP的重定向",
            "link": "http 基础-15-HTTP的重定向.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/15-HTTP%E7%9A%84%E9%87%8D%E5%AE%9A%E5%90%91.html",
            "updateTime": "2024-06-06 13.58.10"
          },
          {
            "text": "http 基础-16-HTTP的Cookie机制",
            "link": "http 基础-16-HTTP的Cookie机制.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/16-HTTP%E7%9A%84Cookie%E6%9C%BA%E5%88%B6.html",
            "updateTime": "2024-06-06 13.58.11"
          },
          {
            "text": "http 基础-17-HTTP的缓存控制",
            "link": "http 基础-17-HTTP的缓存控制.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/17-HTTP%E7%9A%84%E7%BC%93%E5%AD%98%E6%8E%A7%E5%88%B6.html",
            "updateTime": "2024-06-06 13.58.13"
          },
          {
            "text": "http 基础-18-HTTP的代理服务",
            "link": "http 基础-18-HTTP的代理服务.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/18-HTTP%E7%9A%84%E4%BB%A3%E7%90%86%E6%9C%8D%E5%8A%A1.html",
            "updateTime": "2024-06-06 13.58.15"
          },
          {
            "text": "http 基础-19-HTTP的缓存代理",
            "link": "http 基础-19-HTTP的缓存代理.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/base/19-HTTP%E7%9A%84%E7%BC%93%E5%AD%98%E4%BB%A3%E7%90%86.html",
            "updateTime": "2024-06-06 13.58.16"
          },
          {
            "text": "http 基础-20-对称加密与非对称加密",
            "link": "http 基础-20-对称加密与非对称加密.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/20-%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86%E4%B8%8E%E9%9D%9E%E5%AF%B9%E7%A7%B0%E5%8A%A0%E5%AF%86.html",
            "updateTime": "2024-06-06 13.58.18"
          },
          {
            "text": "http 基础-21-数字签名与证书",
            "link": "http 基础-21-数字签名与证书.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/21-%E6%95%B0%E5%AD%97%E7%AD%BE%E5%90%8D%E4%B8%8E%E8%AF%81%E4%B9%A6.html",
            "updateTime": "2024-06-06 13.58.20"
          },
          {
            "text": "http 基础-22-TLS1-2连接过程解析",
            "link": "http 基础-22-TLS1-2连接过程解析.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/22-TLS1.2%E8%BF%9E%E6%8E%A5%E8%BF%87%E7%A8%8B%E8%A7%A3%E6%9E%90.html",
            "updateTime": "2024-06-06 13.58.21"
          },
          {
            "text": "http 基础-23-TLS1-3特性解析",
            "link": "http 基础-23-TLS1-3特性解析.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/23-TLS1.3%E7%89%B9%E6%80%A7%E8%A7%A3%E6%9E%90.html",
            "updateTime": "2024-06-06 13.58.23"
          },
          {
            "text": "http 基础-24-HTTPS的优化",
            "link": "http 基础-24-HTTPS的优化.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/24-HTTPS%E7%9A%84%E4%BC%98%E5%8C%96.html",
            "updateTime": "2024-06-06 13.58.25"
          },
          {
            "text": "http 基础-25-迁移到HTTPS",
            "link": "http 基础-25-迁移到HTTPS.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/25-%E8%BF%81%E7%A7%BB%E5%88%B0HTTPS.html",
            "updateTime": "2024-06-06 13.58.27"
          },
          {
            "text": "http 基础-26-HTTP2特性概览",
            "link": "http 基础-26-HTTP2特性概览.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/26-HTTP2%E7%89%B9%E6%80%A7%E6%A6%82%E8%A7%88.html",
            "updateTime": "2024-06-06 13.58.28"
          },
          {
            "text": "http 基础-27-HTTP3展望",
            "link": "http 基础-27-HTTP3展望.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/27-HTTP3%E5%B1%95%E6%9C%9B.html",
            "updateTime": "2024-06-06 13.58.30"
          },
          {
            "text": "http 基础-28-迁移到HTTP2",
            "link": "http 基础-28-迁移到HTTP2.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/advance/28-%E8%BF%81%E7%A7%BB%E5%88%B0HTTP2.html",
            "updateTime": "2024-06-06 13.58.31"
          },
          {
            "text": "http 基础-29-CDN",
            "link": "http 基础-29-CDN.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/extend/29-CDN.html",
            "updateTime": "2024-06-06 13.58.33"
          },
          {
            "text": "http 基础-30-webSocket",
            "link": "http 基础-30-webSocket.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/extend/30-webSocket.html",
            "updateTime": "2024-06-06 13.58.34"
          },
          {
            "text": "http 基础-31-HTTP性能优化上",
            "link": "http 基础-31-HTTP性能优化上.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/extend/31-HTTP%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B8%8A.html",
            "updateTime": "2024-06-06 13.58.36"
          },
          {
            "text": "http 基础-32-HTTP性能优化下",
            "link": "http 基础-32-HTTP性能优化下.html",
            "originUrl":
              "https://interview.poetries.top/fe-base-docs/http-protocol/extend/32-HTTP%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B8%8B.html",
            "updateTime": "2024-06-06 13.58.37"
          }
        ]
      },
      {
        "text": "学习路线",
        "children": [
          {
            "text": "学习路线-frontend",
            "link": "学习路线-frontend.html",
            "originUrl": "https://interview.poetries.top/roadmap/frontend.html",
            "updateTime": "2024-06-06 13.58.39"
          },
          {
            "text": "学习路线-backend",
            "link": "学习路线-backend.html",
            "originUrl": "https://interview.poetries.top/roadmap/backend.html",
            "updateTime": "2024-06-06 13.58.40"
          }
        ]
      }
    ]
  }),

  "plugins": [
    pwaPlugin({
      "serviceWorker": true,
      "updatePopup": true,
      "showInstall": true,
      "cacheHTML": true,
      "maxSize": 1024 * 1024 * 9,
      "maxImageSize": 1024 * 1024 * 80,
      "favicon": "images/Favicons/favicon-32.png"
    }),
    blogPlugin({
      "filter": ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith("posts/") : false,
      "getInfo": ({ frontmatter, title }) => ({
        title,
        "author": frontmatter.author || "未知",
        "date": frontmatter.date || new Date(),
        "category": frontmatter.category || [],
        "tag": frontmatter.tag || [],
        "excerpt": frontmatter.excerpt || "",
        "apple": {
          "icon": "images/Favicons/favicon-152-precomposed.png"
        }
      }),
      "excerptFilter": ({ frontmatter }) =>
        !frontmatter.home && frontmatter.excerpt !== false,
      "category": [
        {
          "key": "category",
          "getter": (page) => page.frontmatter.category || [],
          "layout": "Category",
          "itemLayout": "Category",
          "frontmatter": () => ({
            "title": "分类",
            "sidebar": false
          }),
          "itemFrontmatter": (name) => ({
            "title": `分类：${name}`,
            "sidebar": false
          })
        },
        {
          "key": "tag",
          "getter": (page) => page.frontmatter.tag || [],
          "layout": "Tag",
          "itemLayout": "Tag",
          "frontmatter": () => ({
            "title": "标签",
            "sidebar": false
          }),
          "itemFrontmatter": (name) => ({
            "title": `标签：${name}`,
            "sidebar": false
          })
        }
      ],
      "type": [
        {
          "key": "article",
          "filter": (page) => !page.frontmatter.archive,
          "layout": "Article",
          "frontmatter": () => ({
            "title": "文章",
            "sidebar": false
          }),
          "sorter": (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky;
            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
              return -1;
            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1;
            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            );
          }
        },
        {
          "key": "timeline",
          "filter": (page) => page.frontmatter.date instanceof Date,
          "sorter": (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          "layout": "Timeline",
          "frontmatter": () => ({
            "title": "时间线",
            "sidebar": false
          })
        }
      ],
      "hotReload": true
    })
  ],
  "bundler": viteBundler()
});

export default config;
