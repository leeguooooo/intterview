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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3poaWh1L2xlZWd1b28uY29tL2ludHRlcnZpZXcvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96aGlodS9sZWVndW9vLmNvbS9pbnR0ZXJ2aWV3L2RvY3MvLnZ1ZXByZXNzL2NvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvemhpaHUvbGVlZ3Vvby5jb20vaW50dGVydmlldy9kb2NzLy52dWVwcmVzcy9jb25maWcuanNcIjtpbXBvcnQgeyBibG9nUGx1Z2luIH0gZnJvbSBcIkB2dWVwcmVzcy9wbHVnaW4tYmxvZ1wiO1xuaW1wb3J0IHsgZGVmYXVsdFRoZW1lIH0gZnJvbSBcIkB2dWVwcmVzcy90aGVtZS1kZWZhdWx0XCI7XG5pbXBvcnQgeyBkZWZpbmVVc2VyQ29uZmlnIH0gZnJvbSBcInZ1ZXByZXNzXCI7XG5pbXBvcnQgeyB2aXRlQnVuZGxlciB9IGZyb20gXCJAdnVlcHJlc3MvYnVuZGxlci12aXRlXCI7XG5pbXBvcnQgcGtnIGZyb20gXCJAdnVlcHJlc3MvcGx1Z2luLXB3YVwiO1xuY29uc3QgeyBwd2FQbHVnaW4gfSA9IHBrZztcblxuY29uc3QgY29uZmlnID0gZGVmaW5lVXNlckNvbmZpZyh7XG4gIFwibGFuZ1wiOiBcInpoLUNOXCIsXG4gIFwidGl0bGVcIjogXCJcdTUyNERcdTdBRUZcdTk3NjJcdThCRDVcdTk4OThcdTk2QzZcdTk1MjZcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlx1NEUzQVx1NTI0RFx1N0FFRlx1NUYwMFx1NTNEMVx1ODAwNVx1NTFDNlx1NTkwN1x1NzY4NFx1OTc2Mlx1OEJENVx1OTg5OFx1NUU5M1wiLFxuICBcInRoZW1lXCI6IGRlZmF1bHRUaGVtZSh7XG4gICAgXCJsb2dvXCI6IFwiaW1hZ2VzL2xvZ28ud2VicFwiLFxuICAgIFwiaG9zdG5hbWVcIjogXCJodHRwczovL2ludGVydmlldy5sZWVndW9vLmNvbVwiLFxuICAgIFwiZXh0ZXJuYWxMaW5rSWNvblwiOiBmYWxzZSxcbiAgICBcImNvbG9yTW9kZVN3aXRjaGVyXCI6IHRydWUsXG4gICAgXCJuYXZiYXJcIjogW1xuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTk5OTZcdTk4NzVcIixcbiAgICAgICAgXCJsaW5rXCI6IFwiL1wiLFxuICAgICAgICBcInRlc3RcIjogXCIxMjNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0ZXh0XCI6IFwiXHU5ODk4XHU1RTkzXCIsXG4gICAgICAgIFwiY2hpbGRyZW5cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1NTdGQVx1Nzg0MFx1N0JDN1wiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1NTdGQVx1Nzg0MFx1N0JDNy5tZFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9iYXNlLmh0bWwjJUU0JUI4JTgwJUUzJTgwJTgxaHRtbCVFMyU4MCU4MWh0dHAlRTMlODAlODF3ZWIlRTclQkIlQkMlRTUlOTAlODglRTklOTclQUUlRTklQTIlOThcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDcuMzUuMTdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU4RkRCXHU5NjM2XHU3QkM3XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU4RkRCXHU5NjM2XHU3QkM3Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvYmFzZS9pbXByb3ZlLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMzkuMTlcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU5QUQ4XHU5ODkxXHU3QkM3XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU5QUQ4XHU5ODkxXHU3QkM3Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvYmFzZS9oaWdoLWZyZXF1ZW5jeS5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjM5LjQyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkhUTUxcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9IVE1MLm1kXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzEtSFRNTCVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjExLjIwXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkNTU1wiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL0NTUy5tZFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8yLUNTUyVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjExLjUxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIkphdmFTY3JpcHRcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9KYXZhU2NyaXB0Lm1kXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzMtSlMlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4xMi4yNlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJFUzZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9FUzYubWRcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvNC1FUzYlRTYlQTglQTElRTUlOUQlOTcuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4xMi40OVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTZENEZcdTg5QzhcdTU2NjhcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTZENEZcdTg5QzhcdTU2NjguaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy81LSVFNiVCNSU4RiVFOCVBNyU4OCVFNSU5OSVBOCVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjIzLjMxXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlJlYWN0XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvUmVhY3QuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy82LVJlYWN0Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjQuMDlcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvNy1WdWUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4yNC4zMVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJOb2RlXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvTm9kZS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzgtTm9kZSVFNiVBOCVBMSVFNSU5RCU5Ny5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjI1LjEwXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlx1NTI0RFx1N0FFRlx1NURFNVx1N0EwQlx1NTMxNlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1x1NTI0RFx1N0FFRlx1NURFNVx1N0EwQlx1NTMxNi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2V4Y2VsbGVudC1kb2NzLzktJUU1JTg5JThEJUU3JUFCJUFGJUU1JUI3JUE1JUU3JUE4JThCJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjUuMzVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU3OUZCXHU1MkE4XHU1OTFBXHU3QUVGXHU1RjAwXHU1M0QxXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU3OUZCXHU1MkE4XHU1OTFBXHU3QUVGXHU1RjAwXHU1M0QxLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTAtJUU3JUE3JUJCJUU1JThBJUE4JUU1JUE0JTlBJUU3JUFCJUFGJUU1JUJDJTgwJUU1JThGJTkxLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjcuMDFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU1QzBGXHU3QTBCXHU1RThGXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU1QzBGXHU3QTBCXHU1RThGLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTEtJUU1JUIwJThGJUU3JUE4JThCJUU1JUJBJThGJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjcuMjJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVW5pYXBwXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVW5pYXBwLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTItVW5pYXBwJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjkuMTBcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU1MjREXHU3QUVGXHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU1MjREXHU3QUVGXHU1Qjg5XHU1MTY4Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTMtJUU1JTg5JThEJUU3JUFCJUFGJUU1JUFFJTg5JUU1JTg1JUE4JUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMjkuNTNcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU2MDI3XHU4MEZEXHU0RjE4XHU1MzE2XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU2MDI3XHU4MEZEXHU0RjE4XHU1MzE2Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTQtJUU2JTgwJUE3JUU4JTgzJUJEJUU0JUJDJTk4JUU1JThDJTk2JUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMzEuMjVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSFRUUFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL0hUVFAuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xNS1IVFRQJUU2JUE4JUExJUU1JTlEJTk3Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMzEuNTFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU1RTM4XHU3NTI4XHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvXHU1RTM4XHU3NTI4XHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL2RvY3MvZXhjZWxsZW50LWRvY3MvMTYtJUU4JUFFJUJFJUU4JUFFJUExJUU2JUE4JUExJUU1JUJDJThGLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMzIuNTZcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGIDJcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdThCQkVcdThCQTFcdTZBMjFcdTVGMEYgMi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9kb2NzL2Jhc2UvZGVzaWduLXBhdHRlcm4uaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNC4wMVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTY4NDZcdTY3QjZcdTkwMUFcdThCQzZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTY4NDZcdTY3QjZcdTkwMUFcdThCQzYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xNy0lRTYlQTElODYlRTYlOUUlQjYlRTklODAlOUElRTglQUYlODYuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zMy4xNVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdTYzOTJcdTVFOEZcdTdCOTdcdTZDRDVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdTYzOTJcdTVFOEZcdTdCOTdcdTZDRDUuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xOC0lRTYlOEUlOTIlRTUlQkElOEYlRTclQUUlOTclRTYlQjMlOTUuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zMy40OFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJcdThCQTFcdTdCOTdcdTY3M0FcdTkwMUFcdThCQzZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9cdThCQTFcdTdCOTdcdTY3M0FcdTkwMUFcdThCQzYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvZG9jcy9leGNlbGxlbnQtZG9jcy8xOS0lRTglQUUlQTElRTclQUUlOTclRTYlOUMlQkElRTklODAlOUElRTglQUYlODYuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4zNC4wMVwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJWdWUgXHU2RTkwXHU3ODAxXHU4OUUzXHU2NzkwXCIsXG4gICAgICAgIFwiY2hpbGRyZW5cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTc1MUZcdTU0N0RcdTU0NjhcdTY3MUZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWVcdTZFOTBcdTc4MDEuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzAxLSVFNCVCQiU4RSVFNiVCQSU5MCVFNyVBMCU4MSVFOCVBNyVBMyVFOCVBRiVCQlZ1ZSVFNyU5NCU5RiVFNSU5MSVCRCVFNSU5MSVBOCVFNiU5QyU5Ri5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjAyLjUzXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTdFQzRcdTRFRjZcdTc2ODRcdTY3MkNcdThEMjhcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtXHU3RUM0XHU0RUY2XHU3Njg0XHU2NzJDXHU4RDI4Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wMi0lRTQlQkIlOEUlRTYlQkElOTAlRTclQTAlODElRTglQTclQTMlRTglQUYlQkJWdWUlRTclQkIlODQlRTQlQkIlQjYlRTclOUElODQlRTYlOUMlQUMlRTglQjQlQTguaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNC4wMVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU2NzA5XHU3MkI2XHU2MDAxXHU3RUM0XHU0RUY2XHU3Njg0XHU4QkJFXHU4QkExXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLVx1NjcwOVx1NzJCNlx1NjAwMVx1N0VDNFx1NEVGNlx1NzY4NFx1OEJCRVx1OEJBMS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDMtJUU2JTlDJTg5JUU3JThBJUI2JUU2JTgwJTgxJUU3JUJCJTg0JUU0JUJCJUI2JUU3JTlBJTg0JUU4JUFFJUJFJUU4JUFFJUExLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDQuMzRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVZOb2RlXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLVZOb2RlLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wNC1WTm9kZS5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA0LjU2XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdThGODVcdTUyQTlcdTUyMUJcdTVFRkFWTm9kZVx1NzY4NGhcdTUxRkRcdTY1NzBcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtXHU4Rjg1XHU1MkE5XHU1MjFCXHU1RUZBIFZOb2RlIFx1NzY4NCBoIFx1NTFGRFx1NjU3MC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDUtJUU4JUJFJTg1JUU1JThBJUE5JUU1JTg4JTlCJUU1JUJCJUJBVk5vZGUlRTclOUElODRoJUU1JTg3JUJEJUU2JTk1JUIwLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDUuMjFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1ODFFQVx1NUI5QVx1NEU0OVx1NkUzMlx1NjdEM1x1NTY2OFx1NTQ4Q1x1NUYwMlx1NkI2NVx1NkUzMlx1NjdEM1wiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZS1cdTgxRUFcdTVCOUFcdTRFNDlcdTZFMzJcdTY3RDNcdTU2NjhcdTU0OENcdTVGMDJcdTZCNjVcdTZFMzJcdTY3RDMuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzA2LSVFOCU4NyVBQSVFNSVBRSU5QSVFNCVCOSU4OSVFNiVCOCVCMiVFNiU5RiU5MyVFNSU5OSVBOCVFNSU5MiU4QyVFNSVCQyU4MiVFNiVBRCVBNSVFNiVCOCVCMiVFNiU5RiU5My5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA1LjQ4XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTZFMzJcdTY3RDNcdTU2NjhcdTRFNEJcdTYzMDJcdThGN0RcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIi9WdWUtXHU2RTMyXHU2N0QzXHU1NjY4XHU0RTRCXHU2MzAyXHU4RjdELmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8wNy0lRTYlQjglQjIlRTYlOUYlOTMlRTUlOTklQTglRTQlQjklOEIlRTYlOEMlODIlRTglQkQlQkQuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wMyAwOC4wNi4xMlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU2RTMyXHU2N0QzXHU1NjY4XHU3Njg0XHU2ODM4XHU1RkMzIERpZmYgXHU3Qjk3XHU2Q0Q1XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCIvVnVlLVx1NkUzMlx1NjdEM1x1NTY2OFx1NzY4NFx1NjgzOFx1NUZDMyBEaWZmIFx1N0I5N1x1NkNENS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMDgtJUU2JUI4JUIyJUU2JTlGJTkzJUU1JTk5JUE4JUU3JTlBJTg0JUU2JUEwJUI4JUU1JUJGJTgzRGlmZiVFNyVBRSU5NyVFNiVCMyU5NS5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTAzIDA4LjA2LjM3XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTZFMzJcdTY3RDNcdTU2NjhcdTRFNEJwYXRjaFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiL1Z1ZS1cdTZFMzJcdTY3RDNcdTU2NjhcdTRFNEIgcGF0Y2guaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzA5LSVFNiVCOCVCMiVFNiU5RiU5MyVFNSU5OSVBOCVFNCVCOSU4QnBhdGNoLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDMgMDguMDcuMDdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NTZGRVx1ODlFMyBWdWUgXHU1NENEXHU1RTk0XHU1RjBGXHU1MzlGXHU3NDA2XCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtXHU1NkZFXHU4OUUzIFZ1ZSBcdTU0Q0RcdTVFOTRcdTVGMEZcdTUzOUZcdTc0MDYuaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzEwLSVFNSU5QiVCRSVFOCVBNyVBMyUyMFZ1ZSUyMCVFNSU5MyU4RCVFNSVCQSU5NCVFNSVCQyU4RiVFNSU4RSU5RiVFNyU5MCU4Ni5odG1sXCIsXG4gICAgICAgICAgICBcInVwZGF0ZVRpbWVcIjogXCIyMDI0LTA2LTA1IDAyLjI4LjU0XCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidGV4dFwiOiBcIlZ1ZS1cdTU2RkVcdTg5RTMgVnVlIFx1NUYwMlx1NkI2NVx1NjZGNFx1NjVCMFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLVx1NTZGRVx1ODlFMyBWdWUgXHU1RjAyXHU2QjY1XHU2NkY0XHU2NUIwLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xMS0lRTUlOUIlQkUlRTglQTclQTMlMjBWdWUlMjAlRTUlQkMlODIlRTYlQUQlQTUlRTYlOUIlQjQlRTYlOTYlQjAuaHRtbFwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVUaW1lXCI6IFwiMjAyNC0wNi0wNSAwMi4zNi4zMlwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInRleHRcIjogXCJWdWUtXHU1MjU2XHU2NzkwIFZ1ZSBcdTUxODVcdTkwRThcdThGRDBcdTg4NENcdTY3M0FcdTUyMzZcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS1cdTUyNTZcdTY3OTAgVnVlIFx1NTE4NVx1OTBFOFx1OEZEMFx1ODg0Q1x1NjczQVx1NTIzNi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTItJUU1JTg5JTk2JUU2JTlFJTkwJTIwVnVlJTIwJUU1JTg2JTg1JUU5JTgzJUE4JUU4JUJGJTkwJUU4JUExJThDJUU2JTlDJUJBJUU1JTg4JUI2Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuMzcuMDJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLXZ1ZVx1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNlx1NkEyMVx1NjJERlwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLXZ1ZVx1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNlx1NkEyMVx1NjJERi5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTMtdnVlJUU1JTkzJThEJUU1JUJBJTk0JUU1JUJDJThGJUU1JThFJTlGJUU3JTkwJTg2JUU2JUE4JUExJUU2JThCJTlGLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuMzguMjNcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLXZ1ZVx1NzJCNlx1NjAwMVx1N0JBMVx1NzQwNlx1NEU0QnZ1ZXhcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS12dWVcdTcyQjZcdTYwMDFcdTdCQTFcdTc0MDZcdTRFNEJ2dWV4Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xNC12dWUlRTclOEElQjYlRTYlODAlODElRTclQUUlQTElRTclOTAlODYlRTQlQjklOEJ2dWV4Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDAuMzVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVx1NzQwNlx1ODlFM1Z1ZVx1NzY4NFx1OEJCRVx1OEJBMVx1NjAxRFx1NjBGM1x1NTNDQVx1NUI5RVx1NzNCMFZ1ZVwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLVx1NzQwNlx1ODlFM1Z1ZVx1NzY4NFx1OEJCRVx1OEJBMVx1NjAxRFx1NjBGM1x1NTNDQVx1NUI5RVx1NzNCMFZ1ZS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTUtJUU3JTkwJTg2JUU4JUE3JUEzVnVlJUU3JTlBJTg0JUU4JUFFJUJFJUU4JUFFJUExJUU2JTgwJTlEJUU2JTgzJUIzJUU1JThGJThBJUU1JUFFJTlFJUU3JThFJUIwVnVlLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDEuMTZcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLWRpZmZcdTdCOTdcdTZDRDVcdTZERjFcdTUxNjVcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS1kaWZmXHU3Qjk3XHU2Q0Q1XHU2REYxXHU1MTY1Lmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xNi1kaWZmJUU3JUFFJTk3JUU2JUIzJTk1JUU2JUI3JUIxJUU1JTg1JUE1Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDIuMDlcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLXZ1ZSByb3V0ZXIgdnVleFx1NTM5Rlx1NzQwNlx1NTIwNlx1Njc5MFwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLXZ1ZSByb3V0ZXIgdnVleFx1NTM5Rlx1NzQwNlx1NTIwNlx1Njc5MC5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMTctdnVlJTIwcm91dGVyJTIwdnVleCVFNSU4RSU5RiVFNyU5MCU4NiVFNSU4OCU4NiVFNiU5RSU5MC5odG1sI3Z1ZS1yb3V0ZXJcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDIuNDFcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLVZ1ZTNcdTUyMURcdTYzQTJcdTU0Q0RcdTVFOTRcdTVGMEZcdTUzOUZcdTc0MDYuXCIsXG4gICAgICAgICAgICBcImxpbmtcIjogXCJWdWUtVnVlM1x1NTIxRFx1NjNBMlx1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNi4uaHRtbFwiLFxuICAgICAgICAgICAgXCJvcmlnaW5VcmxcIjpcbiAgICAgICAgICAgICAgXCJodHRwczovL2ludGVydmlldy5wb2V0cmllcy50b3AvcHJpbmNpcGxlLWRvY3MvdnVlLzE4LVZ1ZTMlRTUlODglOUQlRTYlOEUlQTIlRTUlOTMlOEQlRTUlQkElOTQlRTUlQkMlOEYlRTUlOEUlOUYlRTclOTAlODYuLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDMuMTZcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLXZ1ZTJcdTZFOTBcdTc4MDFcdTUyMDZcdTY3OTBcIixcbiAgICAgICAgICAgIFwibGlua1wiOiBcIlZ1ZS12dWUyXHU2RTkwXHU3ODAxXHU1MjA2XHU2NzkwLmh0bWxcIixcbiAgICAgICAgICAgIFwib3JpZ2luVXJsXCI6XG4gICAgICAgICAgICAgIFwiaHR0cHM6Ly9pbnRlcnZpZXcucG9ldHJpZXMudG9wL3ByaW5jaXBsZS1kb2NzL3Z1ZS8xOS12dWUyJUU2JUJBJTkwJUU3JUEwJTgxJUU1JTg4JTg2JUU2JTlFJTkwLmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDUuMTBcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiVnVlLXZ1ZVx1N0VDNFx1NEVGNlx1NTMxNlx1NUI5RVx1OERGNVwiLFxuICAgICAgICAgICAgXCJsaW5rXCI6IFwiVnVlLXZ1ZVx1N0VDNFx1NEVGNlx1NTMxNlx1NUI5RVx1OERGNS5odG1sXCIsXG4gICAgICAgICAgICBcIm9yaWdpblVybFwiOlxuICAgICAgICAgICAgICBcImh0dHBzOi8vaW50ZXJ2aWV3LnBvZXRyaWVzLnRvcC9wcmluY2lwbGUtZG9jcy92dWUvMjAtdnVlJUU3JUJCJTg0JUU0JUJCJUI2JUU1JThDJTk2JUU1JUFFJTlFJUU4JUI3JUI1Lmh0bWxcIixcbiAgICAgICAgICAgIFwidXBkYXRlVGltZVwiOiBcIjIwMjQtMDYtMDUgMDIuNDUuNDVcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0ZXh0XCI6IFwiXHU2NTg3XHU3QUUwXCIsXG4gICAgICAgIFwibGlua1wiOiBcIi9hcnRpY2xlL1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTUyMDZcdTdDN0JcIixcbiAgICAgICAgXCJsaW5rXCI6IFwiL2NhdGVnb3J5L1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcInRleHRcIjogXCJcdTY4MDdcdTdCN0VcIixcbiAgICAgICAgXCJsaW5rXCI6IFwiL3RhZy9cIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJ0ZXh0XCI6IFwiXHU2NUY2XHU5NUY0XHU3RUJGXCIsXG4gICAgICAgIFwibGlua1wiOiBcIi90aW1lbGluZS9cIlxuICAgICAgfVxuICAgIF1cbiAgfSksXG5cbiAgXCJwbHVnaW5zXCI6IFtcbiAgICBwd2FQbHVnaW4oe1xuICAgICAgXCJzZXJ2aWNlV29ya2VyXCI6IHRydWUsXG4gICAgICBcInVwZGF0ZVBvcHVwXCI6IHRydWVcbiAgICB9KSxcbiAgICBibG9nUGx1Z2luKHtcbiAgICAgIFwiZmlsdGVyXCI6ICh7IGZpbGVQYXRoUmVsYXRpdmUgfSkgPT5cbiAgICAgICAgZmlsZVBhdGhSZWxhdGl2ZSA/IGZpbGVQYXRoUmVsYXRpdmUuc3RhcnRzV2l0aChcInBvc3RzL1wiKSA6IGZhbHNlLFxuICAgICAgXCJnZXRJbmZvXCI6ICh7IGZyb250bWF0dGVyLCB0aXRsZSB9KSA9PiAoe1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgXCJhdXRob3JcIjogZnJvbnRtYXR0ZXIuYXV0aG9yIHx8IFwiXHU2NzJBXHU3N0U1XCIsXG4gICAgICAgIFwiZGF0ZVwiOiBmcm9udG1hdHRlci5kYXRlIHx8IG5ldyBEYXRlKCksXG4gICAgICAgIFwiY2F0ZWdvcnlcIjogZnJvbnRtYXR0ZXIuY2F0ZWdvcnkgfHwgW10sXG4gICAgICAgIFwidGFnXCI6IGZyb250bWF0dGVyLnRhZyB8fCBbXSxcbiAgICAgICAgXCJleGNlcnB0XCI6IGZyb250bWF0dGVyLmV4Y2VycHQgfHwgXCJcIlxuICAgICAgfSksXG4gICAgICBcImV4Y2VycHRGaWx0ZXJcIjogKHsgZnJvbnRtYXR0ZXIgfSkgPT5cbiAgICAgICAgIWZyb250bWF0dGVyLmhvbWUgJiYgZnJvbnRtYXR0ZXIuZXhjZXJwdCAhPT0gZmFsc2UsXG4gICAgICBcImNhdGVnb3J5XCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2V5XCI6IFwiY2F0ZWdvcnlcIixcbiAgICAgICAgICBcImdldHRlclwiOiAocGFnZSkgPT4gcGFnZS5mcm9udG1hdHRlci5jYXRlZ29yeSB8fCBbXSxcbiAgICAgICAgICBcImxheW91dFwiOiBcIkNhdGVnb3J5XCIsXG4gICAgICAgICAgXCJpdGVtTGF5b3V0XCI6IFwiQ2F0ZWdvcnlcIixcbiAgICAgICAgICBcImZyb250bWF0dGVyXCI6ICgpID0+ICh7XG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiXHU1MjA2XHU3QzdCXCIsXG4gICAgICAgICAgICBcInNpZGViYXJcIjogZmFsc2VcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBcIml0ZW1Gcm9udG1hdHRlclwiOiAobmFtZSkgPT4gKHtcbiAgICAgICAgICAgIFwidGl0bGVcIjogYFx1NTIwNlx1N0M3Qlx1RkYxQSR7bmFtZX1gLFxuICAgICAgICAgICAgXCJzaWRlYmFyXCI6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2V5XCI6IFwidGFnXCIsXG4gICAgICAgICAgXCJnZXR0ZXJcIjogKHBhZ2UpID0+IHBhZ2UuZnJvbnRtYXR0ZXIudGFnIHx8IFtdLFxuICAgICAgICAgIFwibGF5b3V0XCI6IFwiVGFnXCIsXG4gICAgICAgICAgXCJpdGVtTGF5b3V0XCI6IFwiVGFnXCIsXG4gICAgICAgICAgXCJmcm9udG1hdHRlclwiOiAoKSA9PiAoe1xuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlx1NjgwN1x1N0I3RVwiLFxuICAgICAgICAgICAgXCJzaWRlYmFyXCI6IGZhbHNlXG4gICAgICAgICAgfSksXG4gICAgICAgICAgXCJpdGVtRnJvbnRtYXR0ZXJcIjogKG5hbWUpID0+ICh7XG4gICAgICAgICAgICBcInRpdGxlXCI6IGBcdTY4MDdcdTdCN0VcdUZGMUEke25hbWV9YCxcbiAgICAgICAgICAgIFwic2lkZWJhclwiOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcInR5cGVcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJrZXlcIjogXCJhcnRpY2xlXCIsXG4gICAgICAgICAgXCJmaWx0ZXJcIjogKHBhZ2UpID0+ICFwYWdlLmZyb250bWF0dGVyLmFyY2hpdmUsXG4gICAgICAgICAgXCJsYXlvdXRcIjogXCJBcnRpY2xlXCIsXG4gICAgICAgICAgXCJmcm9udG1hdHRlclwiOiAoKSA9PiAoe1xuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIlx1NjU4N1x1N0FFMFwiLFxuICAgICAgICAgICAgXCJzaWRlYmFyXCI6IGZhbHNlXG4gICAgICAgICAgfSksXG4gICAgICAgICAgXCJzb3J0ZXJcIjogKHBhZ2VBLCBwYWdlQikgPT4ge1xuICAgICAgICAgICAgaWYgKHBhZ2VBLmZyb250bWF0dGVyLnN0aWNreSAmJiBwYWdlQi5mcm9udG1hdHRlci5zdGlja3kpXG4gICAgICAgICAgICAgIHJldHVybiBwYWdlQi5mcm9udG1hdHRlci5zdGlja3kgLSBwYWdlQS5mcm9udG1hdHRlci5zdGlja3k7XG4gICAgICAgICAgICBpZiAocGFnZUEuZnJvbnRtYXR0ZXIuc3RpY2t5ICYmICFwYWdlQi5mcm9udG1hdHRlci5zdGlja3kpXG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmICghcGFnZUEuZnJvbnRtYXR0ZXIuc3RpY2t5ICYmIHBhZ2VCLmZyb250bWF0dGVyLnN0aWNreSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBuZXcgRGF0ZShwYWdlQi5mcm9udG1hdHRlci5kYXRlKS5nZXRUaW1lKCkgLVxuICAgICAgICAgICAgICBuZXcgRGF0ZShwYWdlQS5mcm9udG1hdHRlci5kYXRlKS5nZXRUaW1lKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJrZXlcIjogXCJ0aW1lbGluZVwiLFxuICAgICAgICAgIFwiZmlsdGVyXCI6IChwYWdlKSA9PiBwYWdlLmZyb250bWF0dGVyLmRhdGUgaW5zdGFuY2VvZiBEYXRlLFxuICAgICAgICAgIFwic29ydGVyXCI6IChwYWdlQSwgcGFnZUIpID0+XG4gICAgICAgICAgICBuZXcgRGF0ZShwYWdlQi5mcm9udG1hdHRlci5kYXRlKS5nZXRUaW1lKCkgLVxuICAgICAgICAgICAgbmV3IERhdGUocGFnZUEuZnJvbnRtYXR0ZXIuZGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgIFwibGF5b3V0XCI6IFwiVGltZWxpbmVcIixcbiAgICAgICAgICBcImZyb250bWF0dGVyXCI6ICgpID0+ICh7XG4gICAgICAgICAgICBcInRpdGxlXCI6IFwiXHU2NUY2XHU5NUY0XHU3RUJGXCIsXG4gICAgICAgICAgICBcInNpZGViYXJcIjogZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCJob3RSZWxvYWRcIjogdHJ1ZVxuICAgIH0pXG4gIF0sXG4gIFwiYnVuZGxlclwiOiB2aXRlQnVuZGxlcigpXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VCxTQUFTLGtCQUFrQjtBQUN6VixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLG1CQUFtQjtBQUM1QixPQUFPLFNBQVM7QUFDaEIsSUFBTSxFQUFFLFVBQVUsSUFBSTtBQUV0QixJQUFNLFNBQVMsaUJBQWlCO0FBQUEsRUFDOUIsUUFBUTtBQUFBLEVBQ1IsU0FBUztBQUFBLEVBQ1QsZUFBZTtBQUFBLEVBQ2YsU0FBUyxhQUFhO0FBQUEsSUFDcEIsUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osb0JBQW9CO0FBQUEsSUFDcEIscUJBQXFCO0FBQUEsSUFDckIsVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsWUFBWTtBQUFBLFVBQ1Y7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsWUFBWTtBQUFBLFVBQ1Y7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFFBQVE7QUFBQSxZQUNSLFFBQVE7QUFBQSxZQUNSLGFBQ0U7QUFBQSxZQUNGLGNBQWM7QUFBQSxVQUNoQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNFLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsUUFBUTtBQUFBLFFBQ1IsUUFB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
