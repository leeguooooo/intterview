export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"面试题集锦"} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/getting-started.html", { loader: () => import(/* webpackChunkName: "getting-started.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/getting-started.html.js"), meta: {"title":"开始学习"} }],
  ["/introduction.html", { loader: () => import(/* webpackChunkName: "introduction.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/introduction.html.js"), meta: {"title":"介绍"} }],
  ["/posts/react-setState.html", { loader: () => import(/* webpackChunkName: "posts_react-setState.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/react-setState.html.js"), meta: {"_blog":{"title":"《React setState 面试题解析》","author":"leeguoo","date":"2024-06-02T00:00:00.000Z","category":["react"],"tag":["react setState"],"excerpt":""},"title":"《React setState 面试题解析》"} }],
  ["/posts/sticky.html", { loader: () => import(/* webpackChunkName: "posts_sticky.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/sticky.html.js"), meta: {"_blog":{"title":"Sticky Article","author":"未知","date":"2021-01-01T00:00:00.000Z","category":["CategoryC"],"tag":["tag E"],"excerpt":"<p>A sticky article demo.</p>"},"title":"Sticky Article"} }],
  ["/posts/sticky2.html", { loader: () => import(/* webpackChunkName: "posts_sticky2.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/sticky2.html.js"), meta: {"_blog":{"title":"Sticky Article with Higher Priority","author":"未知","date":"2020-01-01T00:00:00.000Z","category":["CategoryC"],"tag":["tag E"],"excerpt":""},"title":"Sticky Article with Higher Priority"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/category/", { loader: () => import(/* webpackChunkName: "category_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/index.html.js"), meta: {"title":"分类"} }],
  ["/category/react/", { loader: () => import(/* webpackChunkName: "category_react_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/react/index.html.js"), meta: {"title":"分类：react"} }],
  ["/category/categoryc/", { loader: () => import(/* webpackChunkName: "category_categoryc_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/categoryc/index.html.js"), meta: {"title":"分类：CategoryC"} }],
  ["/tag/", { loader: () => import(/* webpackChunkName: "tag_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/index.html.js"), meta: {"title":"标签"} }],
  ["/tag/react-setstate/", { loader: () => import(/* webpackChunkName: "tag_react-setstate_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/react-setstate/index.html.js"), meta: {"title":"标签：react setState"} }],
  ["/tag/tag-e/", { loader: () => import(/* webpackChunkName: "tag_tag-e_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-e/index.html.js"), meta: {"title":"标签：tag E"} }],
  ["/article/", { loader: () => import(/* webpackChunkName: "article_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/article/index.html.js"), meta: {"title":"文章"} }],
  ["/timeline/", { loader: () => import(/* webpackChunkName: "timeline_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/timeline/index.html.js"), meta: {"title":"时间线"} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
