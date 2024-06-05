// docs/.vuepress/config.js
import { blogPlugin } from "@vuepress/plugin-blog";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import pkg from "@vuepress/plugin-pwa";
var { pwaPlugin } = pkg;
var config = defineUserConfig({
  "lang": "zh-CN",
  "title": "\u524D\u7AEF\u9762\u8BD5\u9898\u96C6\u9526",
  "description": "\u4E3A\u524D\u7AEF\u5F00\u53D1\u8005\u51C6\u5907\u7684\u9762\u8BD5\u9898\u5E93",
  "theme": defaultTheme({
    "logo": "images/logo.webp",
    "hostname": "https://interview.leeguoo.com",
    "externalLinkIcon": false,
    "colorModeSwitcher": true,
    "navbar": [
      {
        "text": "\u9996\u9875",
        "link": "/",
        "test": "123"
      },
      {
        "text": "\u9898\u5E93",
        "children": [
          {
            "text": "\u57FA\u7840\u7BC7",
            "link": "/\u57FA\u7840\u7BC7.md",
            "originUrl": "https://interview.poetries.top/docs/base.html#%E4%B8%80%E3%80%81html%E3%80%81http%E3%80%81web%E7%BB%BC%E5%90%88%E9%97%AE%E9%A2%98",
            "updateTime": "2024-06-03 07.35.17"
          },
          {
            "text": "\u8FDB\u9636\u7BC7",
            "link": "/\u8FDB\u9636\u7BC7.html",
            "originUrl": "https://interview.poetries.top/docs/base/improve.html",
            "updateTime": "2024-06-03 08.39.19"
          },
          {
            "text": "\u9AD8\u9891\u7BC7",
            "link": "/\u9AD8\u9891\u7BC7.html",
            "originUrl": "https://interview.poetries.top/docs/base/high-frequency.html",
            "updateTime": "2024-06-03 08.39.42"
          },
          {
            "text": "HTML",
            "link": "/HTML.md",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/1-HTML%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.11.20"
          },
          {
            "text": "CSS",
            "link": "/CSS.md",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/2-CSS%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.11.51"
          },
          {
            "text": "JavaScript",
            "link": "/JavaScript.md",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/3-JS%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.12.26"
          },
          {
            "text": "ES6",
            "link": "/ES6.md",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/4-ES6%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.12.49"
          },
          {
            "text": "\u6D4F\u89C8\u5668",
            "link": "/\u6D4F\u89C8\u5668.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/5-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.23.31"
          },
          {
            "text": "React",
            "link": "/React.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/6-React.html",
            "updateTime": "2024-06-03 08.24.09"
          },
          {
            "text": "Vue",
            "link": "/Vue.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/7-Vue.html",
            "updateTime": "2024-06-03 08.24.31"
          },
          {
            "text": "Node",
            "link": "/Node.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/8-Node%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.25.10"
          },
          {
            "text": "\u524D\u7AEF\u5DE5\u7A0B\u5316",
            "link": "/\u524D\u7AEF\u5DE5\u7A0B\u5316.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/9-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.25.35"
          },
          {
            "text": "\u79FB\u52A8\u591A\u7AEF\u5F00\u53D1",
            "link": "/\u79FB\u52A8\u591A\u7AEF\u5F00\u53D1.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/10-%E7%A7%BB%E5%8A%A8%E5%A4%9A%E7%AB%AF%E5%BC%80%E5%8F%91.html",
            "updateTime": "2024-06-03 08.27.01"
          },
          {
            "text": "\u5C0F\u7A0B\u5E8F",
            "link": "/\u5C0F\u7A0B\u5E8F.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/11-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.27.22"
          },
          {
            "text": "Uniapp",
            "link": "/Uniapp.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/12-Uniapp%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.29.10"
          },
          {
            "text": "\u524D\u7AEF\u5B89\u5168",
            "link": "/\u524D\u7AEF\u5B89\u5168.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/13-%E5%89%8D%E7%AB%AF%E5%AE%89%E5%85%A8%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.29.53"
          },
          {
            "text": "\u6027\u80FD\u4F18\u5316",
            "link": "/\u6027\u80FD\u4F18\u5316.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/14-%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.31.25"
          },
          {
            "text": "HTTP",
            "link": "/HTTP.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/15-HTTP%E6%A8%A1%E5%9D%97.html",
            "updateTime": "2024-06-03 08.31.51"
          },
          {
            "text": "\u5E38\u7528\u8BBE\u8BA1\u6A21\u5F0F",
            "link": "/\u5E38\u7528\u8BBE\u8BA1\u6A21\u5F0F.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/16-%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html",
            "updateTime": "2024-06-03 08.32.56"
          },
          {
            "text": "\u8BBE\u8BA1\u6A21\u5F0F 2",
            "link": "/\u8BBE\u8BA1\u6A21\u5F0F 2.html",
            "originUrl": "https://interview.poetries.top/docs/base/design-pattern.html",
            "updateTime": "2024-06-03 08.04.01"
          },
          {
            "text": "\u6846\u67B6\u901A\u8BC6",
            "link": "/\u6846\u67B6\u901A\u8BC6.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/17-%E6%A1%86%E6%9E%B6%E9%80%9A%E8%AF%86.html",
            "updateTime": "2024-06-03 08.33.15"
          },
          {
            "text": "\u6392\u5E8F\u7B97\u6CD5",
            "link": "/\u6392\u5E8F\u7B97\u6CD5.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/18-%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95.html",
            "updateTime": "2024-06-03 08.33.48"
          },
          {
            "text": "\u8BA1\u7B97\u673A\u901A\u8BC6",
            "link": "/\u8BA1\u7B97\u673A\u901A\u8BC6.html",
            "originUrl": "https://interview.poetries.top/docs/excellent-docs/19-%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%80%9A%E8%AF%86.html",
            "updateTime": "2024-06-03 08.34.01"
          }
        ]
      },
      {
        "text": "Vue \u6E90\u7801\u89E3\u6790",
        "children": [
          {
            "text": "Vue-\u751F\u547D\u5468\u671F",
            "link": "/Vue\u6E90\u7801.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/01-%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BBVue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html",
            "updateTime": "2024-06-03 08.02.53"
          },
          {
            "text": "Vue-\u7EC4\u4EF6\u7684\u672C\u8D28",
            "link": "/Vue-\u7EC4\u4EF6\u7684\u672C\u8D28.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/02-%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BBVue%E7%BB%84%E4%BB%B6%E7%9A%84%E6%9C%AC%E8%B4%A8.html",
            "updateTime": "2024-06-03 08.04.01"
          },
          {
            "text": "Vue-\u6709\u72B6\u6001\u7EC4\u4EF6\u7684\u8BBE\u8BA1",
            "link": "/Vue-\u6709\u72B6\u6001\u7EC4\u4EF6\u7684\u8BBE\u8BA1.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html",
            "updateTime": "2024-06-03 08.04.34"
          },
          {
            "text": "Vue-VNode",
            "link": "/Vue-VNode.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/04-VNode.html",
            "updateTime": "2024-06-03 08.04.56"
          },
          {
            "text": "Vue-\u8F85\u52A9\u521B\u5EFAVNode\u7684h\u51FD\u6570",
            "link": "/Vue-\u8F85\u52A9\u521B\u5EFA VNode \u7684 h \u51FD\u6570.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/05-%E8%BE%85%E5%8A%A9%E5%88%9B%E5%BB%BAVNode%E7%9A%84h%E5%87%BD%E6%95%B0.html",
            "updateTime": "2024-06-03 08.05.21"
          },
          {
            "text": "Vue-\u81EA\u5B9A\u4E49\u6E32\u67D3\u5668\u548C\u5F02\u6B65\u6E32\u67D3",
            "link": "/Vue-\u81EA\u5B9A\u4E49\u6E32\u67D3\u5668\u548C\u5F02\u6B65\u6E32\u67D3.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html",
            "updateTime": "2024-06-03 08.05.48"
          },
          {
            "text": "Vue-\u6E32\u67D3\u5668\u4E4B\u6302\u8F7D",
            "link": "/Vue-\u6E32\u67D3\u5668\u4E4B\u6302\u8F7D.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html",
            "updateTime": "2024-06-03 08.06.12"
          },
          {
            "text": "Vue-\u6E32\u67D3\u5668\u7684\u6838\u5FC3 Diff \u7B97\u6CD5",
            "link": "/Vue-\u6E32\u67D3\u5668\u7684\u6838\u5FC3 Diff \u7B97\u6CD5.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/08-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83Diff%E7%AE%97%E6%B3%95.html",
            "updateTime": "2024-06-03 08.06.37"
          },
          {
            "text": "Vue-\u6E32\u67D3\u5668\u4E4Bpatch",
            "link": "/Vue-\u6E32\u67D3\u5668\u4E4B patch.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html",
            "updateTime": "2024-06-03 08.07.07"
          },
          {
            "text": "Vue-\u56FE\u89E3 Vue \u54CD\u5E94\u5F0F\u539F\u7406",
            "link": "Vue-\u56FE\u89E3 Vue \u54CD\u5E94\u5F0F\u539F\u7406.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/10-%E5%9B%BE%E8%A7%A3%20Vue%20%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.html",
            "updateTime": "2024-06-05 02.28.54"
          },
          {
            "text": "Vue-\u56FE\u89E3 Vue \u5F02\u6B65\u66F4\u65B0",
            "link": "Vue-\u56FE\u89E3 Vue \u5F02\u6B65\u66F4\u65B0.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/11-%E5%9B%BE%E8%A7%A3%20Vue%20%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0.html",
            "updateTime": "2024-06-05 02.36.32"
          },
          {
            "text": "Vue-\u5256\u6790 Vue \u5185\u90E8\u8FD0\u884C\u673A\u5236",
            "link": "Vue-\u5256\u6790 Vue \u5185\u90E8\u8FD0\u884C\u673A\u5236.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/12-%E5%89%96%E6%9E%90%20Vue%20%E5%86%85%E9%83%A8%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6.html",
            "updateTime": "2024-06-05 02.37.02"
          },
          {
            "text": "Vue-vue\u54CD\u5E94\u5F0F\u539F\u7406\u6A21\u62DF",
            "link": "Vue-vue\u54CD\u5E94\u5F0F\u539F\u7406\u6A21\u62DF.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/13-vue%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86%E6%A8%A1%E6%8B%9F.html",
            "updateTime": "2024-06-05 02.38.23"
          },
          {
            "text": "Vue-vue\u72B6\u6001\u7BA1\u7406\u4E4Bvuex",
            "link": "Vue-vue\u72B6\u6001\u7BA1\u7406\u4E4Bvuex.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/14-vue%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E4%B9%8Bvuex.html",
            "updateTime": "2024-06-05 02.40.35"
          },
          {
            "text": "Vue-\u7406\u89E3Vue\u7684\u8BBE\u8BA1\u601D\u60F3\u53CA\u5B9E\u73B0Vue",
            "link": "Vue-\u7406\u89E3Vue\u7684\u8BBE\u8BA1\u601D\u60F3\u53CA\u5B9E\u73B0Vue.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/15-%E7%90%86%E8%A7%A3Vue%E7%9A%84%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3%E5%8F%8A%E5%AE%9E%E7%8E%B0Vue.html",
            "updateTime": "2024-06-05 02.41.16"
          },
          {
            "text": "Vue-diff\u7B97\u6CD5\u6DF1\u5165",
            "link": "Vue-diff\u7B97\u6CD5\u6DF1\u5165.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/16-diff%E7%AE%97%E6%B3%95%E6%B7%B1%E5%85%A5.html",
            "updateTime": "2024-06-05 02.42.09"
          },
          {
            "text": "Vue-vue router vuex\u539F\u7406\u5206\u6790",
            "link": "Vue-vue router vuex\u539F\u7406\u5206\u6790.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/17-vue%20router%20vuex%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.html#vue-router",
            "updateTime": "2024-06-05 02.42.41"
          },
          {
            "text": "Vue-Vue3\u521D\u63A2\u54CD\u5E94\u5F0F\u539F\u7406.",
            "link": "Vue-Vue3\u521D\u63A2\u54CD\u5E94\u5F0F\u539F\u7406..html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/18-Vue3%E5%88%9D%E6%8E%A2%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86..html",
            "updateTime": "2024-06-05 02.43.16"
          },
          {
            "text": "Vue-vue2\u6E90\u7801\u5206\u6790",
            "link": "Vue-vue2\u6E90\u7801\u5206\u6790.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/19-vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html",
            "updateTime": "2024-06-05 02.45.10"
          },
          {
            "text": "Vue-vue\u7EC4\u4EF6\u5316\u5B9E\u8DF5",
            "link": "Vue-vue\u7EC4\u4EF6\u5316\u5B9E\u8DF5.html",
            "originUrl": "https://interview.poetries.top/principle-docs/vue/20-vue%E7%BB%84%E4%BB%B6%E5%8C%96%E5%AE%9E%E8%B7%B5.html",
            "updateTime": "2024-06-05 02.45.45"
          }
        ]
      },
      {
        "text": "\u6587\u7AE0",
        "link": "/article/"
      },
      {
        "text": "\u5206\u7C7B",
        "link": "/category/"
      },
      {
        "text": "\u6807\u7B7E",
        "link": "/tag/"
      },
      {
        "text": "\u65F6\u95F4\u7EBF",
        "link": "/timeline/"
      }
    ]
  }),
  "plugins": [
    pwaPlugin({
      "serviceWorker": true,
      "updatePopup": true
    }),
    blogPlugin({
      "filter": ({ filePathRelative }) => filePathRelative ? filePathRelative.startsWith("posts/") : false,
      "getInfo": ({ frontmatter, title }) => ({
        title,
        "author": frontmatter.author || "\u672A\u77E5",
        "date": frontmatter.date || /* @__PURE__ */ new Date(),
        "category": frontmatter.category || [],
        "tag": frontmatter.tag || [],
        "excerpt": frontmatter.excerpt || ""
      }),
      "excerptFilter": ({ frontmatter }) => !frontmatter.home && frontmatter.excerpt !== false,
      "category": [
        {
          "key": "category",
          "getter": (page) => page.frontmatter.category || [],
          "layout": "Category",
          "itemLayout": "Category",
          "frontmatter": () => ({
            "title": "\u5206\u7C7B",
            "sidebar": false
          }),
          "itemFrontmatter": (name) => ({
            "title": `\u5206\u7C7B\uFF1A${name}`,
            "sidebar": false
          })
        },
        {
          "key": "tag",
          "getter": (page) => page.frontmatter.tag || [],
          "layout": "Tag",
          "itemLayout": "Tag",
          "frontmatter": () => ({
            "title": "\u6807\u7B7E",
            "sidebar": false
          }),
          "itemFrontmatter": (name) => ({
            "title": `\u6807\u7B7E\uFF1A${name}`,
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
            "title": "\u6587\u7AE0",
            "sidebar": false
          }),
          "sorter": (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky;
            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
              return -1;
            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return 1;
            return new Date(pageB.frontmatter.date).getTime() - new Date(pageA.frontmatter.date).getTime();
          }
        },
        {
          "key": "timeline",
          "filter": (page) => page.frontmatter.date instanceof Date,
          "sorter": (pageA, pageB) => new Date(pageB.frontmatter.date).getTime() - new Date(pageA.frontmatter.date).getTime(),
          "layout": "Timeline",
          "frontmatter": () => ({
            "title": "\u65F6\u95F4\u7EBF",
            "sidebar": false
          })
        }
      ],
      "hotReload": true
    })
  ],
  "bundler": viteBundler()
});
var config_default = config;
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3poaWh1L2xlZWd1b28uY29tL2ludHRlcnZpZXcvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96aGlodS9sZWVndW9vLmNvbS9pbnR0ZXJ2aWV3L2RvY3MvLnZ1ZXByZXNzL2NvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvemhpaHUvbGVlZ3Vvby5jb20vaW50dGVydmlldy9kb2NzLy52dWVwcmVzcy9jb25maWcuanNcIjtpbXBvcnQgeyBibG9nUGx1Z2luIH0gZnJvbSBcIkB2dWVwcmVzcy9wbHVnaW4tYmxvZ1wiO1xuaW1wb3J0IHsgZGVmYXVsdFRoZW1lIH0gZnJvbSBcIkB2dWVwcmVzcy90aGVtZS1kZWZhdWx0XCI7XG5pbXBvcnQgeyBkZWZpbmVVc2VyQ29uZmlnIH0gZnJvbSBcInZ1ZXByZXNzXCI7XG5pbXBvcnQgeyB2aXRlQnVuZGxlciB9IGZyb20gXCJAdnVlcHJlc3MvYnVuZGxlci12aXRlXCI7XG5cbmltcG9ydCBwa2cgZnJvbSBcIkB2dWVwcmVzcy9wbHVnaW4tcHdhXCI7XG5jb25zdCB7IHB3YVBsdWdpbiB9ID0gcGtnO1xuXG5jb25zdCBjb25maWcgPSBkZWZpbmVVc2VyQ29uZmlnKHtcbiAgXCJsYW5nXCI6IFwiemgtQ05cIixcbiAgXCJ0aXRsZVwiOiBcIlx1NTI0RFx1N0FFRlx1OTc2Mlx1OEJENVx1OTg5OFx1OTZDNlx1OTUyNlwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiXHU0RTNBXHU1MjREXHU3QUVGXHU1RjAwXHU1M0QxXHU4MDA1XHU1MUM2XHU1OTA3XHU3Njg0XHU5NzYyXHU4QkQ1XHU5ODk4XHU1RTkzXCIsXG4gIFwidGhlbWVcIjogZGVmYXVsdFRoZW1lKHtcbiAgICBcImxvZ29cIjogXCJpbWFnZXMvbG9nby53ZWJwXCIsXG4gICAgXCJob3N0bmFtZVwiOiBcImh0dHBzOi8vaW50ZXJ2aWV3LmxlZWd1b28uY29tXCIsXG4gICAgXCJleHRlcm5hbExpbmtJY29uXCI6IGZhbHNlLFxuICAgIFwiY29sb3JNb2RlU3dpdGNoZXJcIjogdHJ1ZSxcbiAgICBcIm5hdmJhclwiOiBbXG4gICAgICB7XG4gICAgICAgIFwidGV4dFwiOiBcIlx1OTk5Nlx1OTg3NVwiLFxuICAgICAgICBcImxpbmtcIjogXCIvXCIsXG4gICAgICAgIFwidGVzdFwiOiBcIjEyM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTk4OThcdTVFOTNcIixcbiAgICAgICAgXCJjaGlsZHJlblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU1N0ZBXHU3ODQwXHU3QkM3XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU1N0ZBXHU3ODQwXHU3QkM3Lm1kXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2Jhc2UuaHRtbCMlRTQlQjglODAlRTMlODAlODFodG1sJUUzJTgwJTgxaHR0cCVFMyU4MCU4MXdlYiVFNyVCQiVCQyVFNSU5MCU4OCVFOSU5NyVBRSVFOSVBMiU5OFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwNy4zNS4xN1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdThGREJcdTk2MzZcdTdCQzdcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdThGREJcdTk2MzZcdTdCQzcuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9iYXNlL2ltcHJvdmUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zOS4xOVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTlBRDhcdTk4OTFcdTdCQzdcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTlBRDhcdTk4OTFcdTdCQzcuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9iYXNlL2hpZ2gtZnJlcXVlbmN5Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMzkuNDJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSFRNTFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL0hUTUwubWRcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMS1IVE1MJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMTEuMjBcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiQ1NTXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvQ1NTLm1kXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzItQ1NTJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMTEuNTFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSmF2YVNjcmlwdFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL0phdmFTY3JpcHQubWRcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMy1KUyVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjEyLjI2XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkVTNlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL0VTNi5tZFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy80LUVTNiVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjEyLjQ5XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1NkQ0Rlx1ODlDOFx1NTY2OFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1NkQ0Rlx1ODlDOFx1NTY2OC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzUtJUU2JUI1JThGJUU4JUE3JTg4JUU1JTk5JUE4JUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjMuMzFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiUmVhY3RcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9SZWFjdC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzYtUmVhY3QuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yNC4wOVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy83LVZ1ZS5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjI0LjMxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIk5vZGVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9Ob2RlLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvOC1Ob2RlJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjUuMTBcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU1MjREXHU3QUVGXHU1REU1XHU3QTBCXHU1MzE2XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU1MjREXHU3QUVGXHU1REU1XHU3QTBCXHU1MzE2Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvOS0lRTUlODklOEQlRTclQUIlQUYlRTUlQjclQTUlRTclQTglOEIlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yNS4zNVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTc5RkJcdTUyQThcdTU5MUFcdTdBRUZcdTVGMDBcdTUzRDFcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTc5RkJcdTUyQThcdTU5MUFcdTdBRUZcdTVGMDBcdTUzRDEuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xMC0lRTclQTclQkIlRTUlOEElQTglRTUlQTQlOUElRTclQUIlQUYlRTUlQkMlODAlRTUlOEYlOTEuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yNy4wMVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTVDMEZcdTdBMEJcdTVFOEZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTVDMEZcdTdBMEJcdTVFOEYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xMS0lRTUlQjAlOEYlRTclQTglOEIlRTUlQkElOEYlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yNy4yMlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJVbmlhcHBcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9VbmlhcHAuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xMi1VbmlhcHAlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yOS4xMFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTUyNERcdTdBRUZcdTVCODlcdTUxNjhcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTUyNERcdTdBRUZcdTVCODlcdTUxNjguaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xMy0lRTUlODklOEQlRTclQUIlQUYlRTUlQUUlODklRTUlODUlQTglRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yOS41M1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTYwMjdcdTgwRkRcdTRGMThcdTUzMTZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTYwMjdcdTgwRkRcdTRGMThcdTUzMTYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xNC0lRTYlODAlQTclRTglODMlQkQlRTQlQkMlOTglRTUlOEMlOTYlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zMS4yNVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJIVFRQXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvSFRUUC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzE1LUhUVFAlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zMS41MVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTVFMzhcdTc1MjhcdThCQkVcdThCQTFcdTZBMjFcdTVGMEZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTVFMzhcdTc1MjhcdThCQkVcdThCQTFcdTZBMjFcdTVGMEYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xNi0lRTglQUUlQkUlRTglQUUlQTElRTYlQTglQTElRTUlQkMlOEYuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zMi41NlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdThCQkVcdThCQTFcdTZBMjFcdTVGMEYgMlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1OEJCRVx1OEJBMVx1NkEyMVx1NUYwRiAyLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvYmFzZS9kZXNpZ24tcGF0dGVybi5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA0LjAxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1Njg0Nlx1NjdCNlx1OTAxQVx1OEJDNlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1Njg0Nlx1NjdCNlx1OTAxQVx1OEJDNi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzE3LSVFNiVBMSU4NiVFNiU5RSVCNiVFOSU4MCU5QSVFOCVBRiU4Ni5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjMzLjE1XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1NjM5Mlx1NUU4Rlx1N0I5N1x1NkNENVwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1NjM5Mlx1NUU4Rlx1N0I5N1x1NkNENS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzE4LSVFNiU4RSU5MiVFNSVCQSU4RiVFNyVBRSU5NyVFNiVCMyU5NS5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjMzLjQ4XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1OEJBMVx1N0I5N1x1NjczQVx1OTAxQVx1OEJDNlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1OEJBMVx1N0I5N1x1NjczQVx1OTAxQVx1OEJDNi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzE5LSVFOCVBRSVBMSVFNyVBRSU5NyVFNiU5QyVCQSVFOSU4MCU5QSVFOCVBRiU4Ni5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjM0LjAxXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidGV4dFwiOiBcIlZ1ZSBcdTZFOTBcdTc4MDFcdTg5RTNcdTY3OTBcIixcbiAgICAgICAgXCJjaGlsZHJlblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NzUxRlx1NTQ3RFx1NTQ2OFx1NjcxRlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZVx1NkU5MFx1NzgwMS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDEtJUU0JUJCJThFJUU2JUJBJTkwJUU3JUEwJTgxJUU4JUE3JUEzJUU4JUFGJUJCVnVlJUU3JTk0JTlGJUU1JTkxJUJEJUU1JTkxJUE4JUU2JTlDJTlGLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDIuNTNcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1N0VDNFx1NEVGNlx1NzY4NFx1NjcyQ1x1OEQyOFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZS1cdTdFQzRcdTRFRjZcdTc2ODRcdTY3MkNcdThEMjguaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzAyLSVFNCVCQiU4RSVFNiVCQSU5MCVFNyVBMCU4MSVFOCVBNyVBMyVFOCVBRiVCQlZ1ZSVFNyVCQiU4NCVFNCVCQiVCNiVFNyU5QSU4NCVFNiU5QyVBQyVFOCVCNCVBOC5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA0LjAxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTY3MDlcdTcyQjZcdTYwMDFcdTdFQzRcdTRFRjZcdTc2ODRcdThCQkVcdThCQTFcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtXHU2NzA5XHU3MkI2XHU2MDAxXHU3RUM0XHU0RUY2XHU3Njg0XHU4QkJFXHU4QkExLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wMy0lRTYlOUMlODklRTclOEElQjYlRTYlODAlODElRTclQkIlODQlRTQlQkIlQjYlRTclOUElODQlRTglQUUlQkUlRTglQUUlQTEuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNC4zNFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtVk5vZGVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtVk5vZGUuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzA0LVZOb2RlLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDQuNTZcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1OEY4NVx1NTJBOVx1NTIxQlx1NUVGQVZOb2RlXHU3Njg0aFx1NTFGRFx1NjU3MFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZS1cdThGODVcdTUyQTlcdTUyMUJcdTVFRkEgVk5vZGUgXHU3Njg0IGggXHU1MUZEXHU2NTcwLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wNS0lRTglQkUlODUlRTUlOEElQTklRTUlODglOUIlRTUlQkIlQkFWTm9kZSVFNyU5QSU4NGglRTUlODclQkQlRTYlOTUlQjAuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNS4yMVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU4MUVBXHU1QjlBXHU0RTQ5XHU2RTMyXHU2N0QzXHU1NjY4XHU1NDhDXHU1RjAyXHU2QjY1XHU2RTMyXHU2N0QzXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLVx1ODFFQVx1NUI5QVx1NEU0OVx1NkUzMlx1NjdEM1x1NTY2OFx1NTQ4Q1x1NUYwMlx1NkI2NVx1NkUzMlx1NjdEMy5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDYtJUU4JTg3JUFBJUU1JUFFJTlBJUU0JUI5JTg5JUU2JUI4JUIyJUU2JTlGJTkzJUU1JTk5JUE4JUU1JTkyJThDJUU1JUJDJTgyJUU2JUFEJUE1JUU2JUI4JUIyJUU2JTlGJTkzLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDUuNDhcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NkUzMlx1NjdEM1x1NTY2OFx1NEU0Qlx1NjMwMlx1OEY3RFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZS1cdTZFMzJcdTY3RDNcdTU2NjhcdTRFNEJcdTYzMDJcdThGN0QuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzA3LSVFNiVCOCVCMiVFNiU5RiU5MyVFNSU5OSVBOCVFNCVCOSU4QiVFNiU4QyU4MiVFOCVCRCVCRC5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA2LjEyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTZFMzJcdTY3RDNcdTU2NjhcdTc2ODRcdTY4MzhcdTVGQzMgRGlmZiBcdTdCOTdcdTZDRDVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtXHU2RTMyXHU2N0QzXHU1NjY4XHU3Njg0XHU2ODM4XHU1RkMzIERpZmYgXHU3Qjk3XHU2Q0Q1Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wOC0lRTYlQjglQjIlRTYlOUYlOTMlRTUlOTklQTglRTclOUElODQlRTYlQTAlQjglRTUlQkYlODNEaWZmJUU3JUFFJTk3JUU2JUIzJTk1Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDYuMzdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NkUzMlx1NjdEM1x1NTY2OFx1NEU0QnBhdGNoXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLVx1NkUzMlx1NjdEM1x1NTY2OFx1NEU0QiBwYXRjaC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDktJUU2JUI4JUIyJUU2JTlGJTkzJUU1JTk5JUE4JUU0JUI5JThCcGF0Y2guaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNy4wN1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU1NkZFXHU4OUUzIFZ1ZSBcdTU0Q0RcdTVFOTRcdTVGMEZcdTUzOUZcdTc0MDZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS1cdTU2RkVcdTg5RTMgVnVlIFx1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTAtJUU1JTlCJUJFJUU4JUE3JUEzJTIwVnVlJTIwJUU1JTkzJThEJUU1JUJBJTk0JUU1JUJDJThGJUU1JThFJTlGJUU3JTkwJTg2Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuMjguNTRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NTZGRVx1ODlFMyBWdWUgXHU1RjAyXHU2QjY1XHU2NkY0XHU2NUIwXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtXHU1NkZFXHU4OUUzIFZ1ZSBcdTVGMDJcdTZCNjVcdTY2RjRcdTY1QjAuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzExLSVFNSU5QiVCRSVFOCVBNyVBMyUyMFZ1ZSUyMCVFNSVCQyU4MiVFNiVBRCVBNSVFNiU5QiVCNCVFNiU5NiVCMC5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTA1IDAyLjM2LjMyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTUyNTZcdTY3OTAgVnVlIFx1NTE4NVx1OTBFOFx1OEZEMFx1ODg0Q1x1NjczQVx1NTIzNlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLVx1NTI1Nlx1Njc5MCBWdWUgXHU1MTg1XHU5MEU4XHU4RkQwXHU4ODRDXHU2NzNBXHU1MjM2Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xMi0lRTUlODklOTYlRTYlOUUlOTAlMjBWdWUlMjAlRTUlODYlODUlRTklODMlQTglRTglQkYlOTAlRTglQTElOEMlRTYlOUMlQkElRTUlODglQjYuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi4zNy4wMlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtdnVlXHU1NENEXHU1RTk0XHU1RjBGXHU1MzlGXHU3NDA2XHU2QTIxXHU2MkRGXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtdnVlXHU1NENEXHU1RTk0XHU1RjBGXHU1MzlGXHU3NDA2XHU2QTIxXHU2MkRGLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xMy12dWUlRTUlOTMlOEQlRTUlQkElOTQlRTUlQkMlOEYlRTUlOEUlOUYlRTclOTAlODYlRTYlQTglQTElRTYlOEIlOUYuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi4zOC4yM1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtdnVlXHU3MkI2XHU2MDAxXHU3QkExXHU3NDA2XHU0RTRCdnVleFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLXZ1ZVx1NzJCNlx1NjAwMVx1N0JBMVx1NzQwNlx1NEU0QnZ1ZXguaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzE0LXZ1ZSVFNyU4QSVCNiVFNiU4MCU4MSVFNyVBRSVBMSVFNyU5MCU4NiVFNCVCOSU4QnZ1ZXguaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40MC4zNVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU3NDA2XHU4OUUzVnVlXHU3Njg0XHU4QkJFXHU4QkExXHU2MDFEXHU2MEYzXHU1M0NBXHU1QjlFXHU3M0IwVnVlXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtXHU3NDA2XHU4OUUzVnVlXHU3Njg0XHU4QkJFXHU4QkExXHU2MDFEXHU2MEYzXHU1M0NBXHU1QjlFXHU3M0IwVnVlLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xNS0lRTclOTAlODYlRTglQTclQTNWdWUlRTclOUElODQlRTglQUUlQkUlRTglQUUlQTElRTYlODAlOUQlRTYlODMlQjMlRTUlOEYlOEElRTUlQUUlOUUlRTclOEUlQjBWdWUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40MS4xNlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtZGlmZlx1N0I5N1x1NkNENVx1NkRGMVx1NTE2NVwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLWRpZmZcdTdCOTdcdTZDRDVcdTZERjFcdTUxNjUuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzE2LWRpZmYlRTclQUUlOTclRTYlQjMlOTUlRTYlQjclQjElRTUlODUlQTUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40Mi4wOVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtdnVlIHJvdXRlciB2dWV4XHU1MzlGXHU3NDA2XHU1MjA2XHU2NzkwXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtdnVlIHJvdXRlciB2dWV4XHU1MzlGXHU3NDA2XHU1MjA2XHU2NzkwLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xNy12dWUlMjByb3V0ZXIlMjB2dWV4JUU1JThFJTlGJUU3JTkwJTg2JUU1JTg4JTg2JUU2JTlFJTkwLmh0bWwjdnVlLXJvdXRlclwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40Mi40MVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtVnVlM1x1NTIxRFx1NjNBMlx1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNi5cIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS1WdWUzXHU1MjFEXHU2M0EyXHU1NENEXHU1RTk0XHU1RjBGXHU1MzlGXHU3NDA2Li5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTgtVnVlMyVFNSU4OCU5RCVFNiU4RSVBMiVFNSU5MyU4RCVFNSVCQSU5NCVFNSVCQyU4RiVFNSU4RSU5RiVFNyU5MCU4Ni4uaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40My4xNlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtdnVlMlx1NkU5MFx1NzgwMVx1NTIwNlx1Njc5MFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLXZ1ZTJcdTZFOTBcdTc4MDFcdTUyMDZcdTY3OTAuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzE5LXZ1ZTIlRTYlQkElOTAlRTclQTAlODElRTUlODglODYlRTYlOUUlOTAuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40NS4xMFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtdnVlXHU3RUM0XHU0RUY2XHU1MzE2XHU1QjlFXHU4REY1XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtdnVlXHU3RUM0XHU0RUY2XHU1MzE2XHU1QjlFXHU4REY1Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8yMC12dWUlRTclQkIlODQlRTQlQkIlQjYlRTUlOEMlOTYlRTUlQUUlOUUlRTglQjclQjUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi40NS40NVwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTY1ODdcdTdBRTBcIixcbiAgICAgICAgXCJsaW5rXCI6IFwiL2FydGljbGUvXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidGV4dFwiOiBcIlx1NTIwNlx1N0M3QlwiLFxuICAgICAgICBcImxpbmtcIjogXCIvY2F0ZWdvcnkvXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwidGV4dFwiOiBcIlx1NjgwN1x1N0I3RVwiLFxuICAgICAgICBcImxpbmtcIjogXCIvdGFnL1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTY1RjZcdTk1RjRcdTdFQkZcIixcbiAgICAgICAgXCJsaW5rXCI6IFwiL3RpbWVsaW5lL1wiXG4gICAgICB9XG4gICAgXVxuICB9KSxcblxuICBcInBsdWdpbnNcIjogW1xuICAgIHB3YVBsdWdpbih7XG4gICAgICBcInNlcnZpY2VXb3JrZXJcIjogdHJ1ZSxcbiAgICAgIFwidXBkYXRlUG9wdXBcIjogdHJ1ZVxuICAgIH0pLFxuICAgIGJsb2dQbHVnaW4oe1xuICAgICAgXCJmaWx0ZXJcIjogKHsgZmlsZVBhdGhSZWxhdGl2ZSB9KSA9PlxuICAgICAgICBmaWxlUGF0aFJlbGF0aXZlID8gZmlsZVBhdGhSZWxhdGl2ZS5zdGFydHNXaXRoKFwicG9zdHMvXCIpIDogZmFsc2UsXG4gICAgICBcImdldEluZm9cIjogKHsgZnJvbnRtYXR0ZXIsIHRpdGxlIH0pID0+ICh7XG4gICAgICAgIHRpdGxlLFxuICAgICAgICBcImF1dGhvclwiOiBmcm9udG1hdHRlci5hdXRob3IgfHwgXCJcdTY3MkFcdTc3RTVcIixcbiAgICAgICAgXCJkYXRlXCI6IGZyb250bWF0dGVyLmRhdGUgfHwgbmV3IERhdGUoKSxcbiAgICAgICAgXCJjYXRlZ29yeVwiOiBmcm9udG1hdHRlci5jYXRlZ29yeSB8fCBbXSxcbiAgICAgICAgXCJ0YWdcIjogZnJvbnRtYXR0ZXIudGFnIHx8IFtdLFxuICAgICAgICBcImV4Y2VycHRcIjogZnJvbnRtYXR0ZXIuZXhjZXJwdCB8fCBcIlwiXG4gICAgICB9KSxcbiAgICAgIFwiZXhjZXJwdEZpbHRlclwiOiAoeyBmcm9udG1hdHRlciB9KSA9PlxuICAgICAgICAhZnJvbnRtYXR0ZXIuaG9tZSAmJiBmcm9udG1hdHRlci5leGNlcnB0ICE9PSBmYWxzZSxcbiAgICAgIFwiY2F0ZWdvcnlcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJrZXlcIjogXCJjYXRlZ29yeVwiLFxuICAgICAgICAgIFwiZ2V0dGVyXCI6IChwYWdlKSA9PiBwYWdlLmZyb250bWF0dGVyLmNhdGVnb3J5IHx8IFtdLFxuICAgICAgICAgIFwibGF5b3V0XCI6IFwiQ2F0ZWdvcnlcIixcbiAgICAgICAgICBcIml0ZW1MYXlvdXRcIjogXCJDYXRlZ29yeVwiLFxuICAgICAgICAgIFwiZnJvbnRtYXR0ZXJcIjogKCkgPT4gKHtcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJcdTUyMDZcdTdDN0JcIixcbiAgICAgICAgICAgIFwic2lkZWJhclwiOiBmYWxzZVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIFwiaXRlbUZyb250bWF0dGVyXCI6IChuYW1lKSA9PiAoe1xuICAgICAgICAgICAgXCJ0aXRsZVwiOiBgXHU1MjA2XHU3QzdCXHVGRjFBJHtuYW1lfWAsXG4gICAgICAgICAgICBcInNpZGViYXJcIjogZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJrZXlcIjogXCJ0YWdcIixcbiAgICAgICAgICBcImdldHRlclwiOiAocGFnZSkgPT4gcGFnZS5mcm9udG1hdHRlci50YWcgfHwgW10sXG4gICAgICAgICAgXCJsYXlvdXRcIjogXCJUYWdcIixcbiAgICAgICAgICBcIml0ZW1MYXlvdXRcIjogXCJUYWdcIixcbiAgICAgICAgICBcImZyb250bWF0dGVyXCI6ICgpID0+ICh7XG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiXHU2ODA3XHU3QjdFXCIsXG4gICAgICAgICAgICBcInNpZGViYXJcIjogZmFsc2VcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBcIml0ZW1Gcm9udG1hdHRlclwiOiAobmFtZSkgPT4gKHtcbiAgICAgICAgICAgIFwidGl0bGVcIjogYFx1NjgwN1x1N0I3RVx1RkYxQSR7bmFtZX1gLFxuICAgICAgICAgICAgXCJzaWRlYmFyXCI6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIFwidHlwZVwiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtleVwiOiBcImFydGljbGVcIixcbiAgICAgICAgICBcImZpbHRlclwiOiAocGFnZSkgPT4gIXBhZ2UuZnJvbnRtYXR0ZXIuYXJjaGl2ZSxcbiAgICAgICAgICBcImxheW91dFwiOiBcIkFydGljbGVcIixcbiAgICAgICAgICBcImZyb250bWF0dGVyXCI6ICgpID0+ICh7XG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiXHU2NTg3XHU3QUUwXCIsXG4gICAgICAgICAgICBcInNpZGViYXJcIjogZmFsc2VcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBcInNvcnRlclwiOiAocGFnZUEsIHBhZ2VCKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFnZUEuZnJvbnRtYXR0ZXIuc3RpY2t5ICYmIHBhZ2VCLmZyb250bWF0dGVyLnN0aWNreSlcbiAgICAgICAgICAgICAgcmV0dXJuIHBhZ2VCLmZyb250bWF0dGVyLnN0aWNreSAtIHBhZ2VBLmZyb250bWF0dGVyLnN0aWNreTtcbiAgICAgICAgICAgIGlmIChwYWdlQS5mcm9udG1hdHRlci5zdGlja3kgJiYgIXBhZ2VCLmZyb250bWF0dGVyLnN0aWNreSlcbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKCFwYWdlQS5mcm9udG1hdHRlci5zdGlja3kgJiYgcGFnZUIuZnJvbnRtYXR0ZXIuc3RpY2t5KSByZXR1cm4gMTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIG5ldyBEYXRlKHBhZ2VCLmZyb250bWF0dGVyLmRhdGUpLmdldFRpbWUoKSAtXG4gICAgICAgICAgICAgIG5ldyBEYXRlKHBhZ2VBLmZyb250bWF0dGVyLmRhdGUpLmdldFRpbWUoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtleVwiOiBcInRpbWVsaW5lXCIsXG4gICAgICAgICAgXCJmaWx0ZXJcIjogKHBhZ2UpID0+IHBhZ2UuZnJvbnRtYXR0ZXIuZGF0ZSBpbnN0YW5jZW9mIERhdGUsXG4gICAgICAgICAgXCJzb3J0ZXJcIjogKHBhZ2VBLCBwYWdlQikgPT5cbiAgICAgICAgICAgIG5ldyBEYXRlKHBhZ2VCLmZyb250bWF0dGVyLmRhdGUpLmdldFRpbWUoKSAtXG4gICAgICAgICAgICBuZXcgRGF0ZShwYWdlQS5mcm9udG1hdHRlci5kYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgXCJsYXlvdXRcIjogXCJUaW1lbGluZVwiLFxuICAgICAgICAgIFwiZnJvbnRtYXR0ZXJcIjogKCkgPT4gKHtcbiAgICAgICAgICAgIFwidGl0bGVcIjogXCJcdTY1RjZcdTk1RjRcdTdFQkZcIixcbiAgICAgICAgICAgIFwic2lkZWJhclwiOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcImhvdFJlbG9hZFwiOiB0cnVlXG4gICAgfSlcbiAgXSxcbiAgXCJidW5kbGVyXCI6IHZpdGVCdW5kbGVyKClcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThULFNBQVMsa0JBQWtCO0FBQ3pWLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsd0JBQXdCO0FBQ2pDLFNBQVMsbUJBQW1CO0FBRTVCLE9BQU8sU0FBUztBQUNoQixJQUFNLEVBQUUsVUFBVSxJQUFJO0FBRXRCLElBQU0sU0FBUyxpQkFBaUI7QUFBQSxFQUM5QixRQUFRO0FBQUEsRUFDUixTQUFTO0FBQUEsRUFDVCxlQUFlO0FBQUEsRUFDZixTQUFTLGFBQWE7QUFBQSxJQUNwQixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixvQkFBb0I7QUFBQSxJQUNwQixxQkFBcUI7QUFBQSxJQUNyQixVQUFVO0FBQUEsTUFDUjtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUEsVUFDVjtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxRQUFRO0FBQUEsUUFDUixZQUFZO0FBQUEsVUFDVjtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsVUFDQTtBQUFBLFlBQ0UsUUFBUTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsYUFDRTtBQUFBLFlBQ0YsY0FBYztBQUFBLFVBQ2hCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNFLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxRQUFRO0FBQUEsUUFDUixR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
