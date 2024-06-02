export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"面试题集锦"} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/getting-started.html", { loader: () => import(/* webpackChunkName: "getting-started.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/getting-started.html.js"), meta: {"title":"开始学习"} }],
  ["/introduction.html", { loader: () => import(/* webpackChunkName: "introduction.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/introduction.html.js"), meta: {"title":"介绍"} }],
  ["/posts/archive1.html", { loader: () => import(/* webpackChunkName: "posts_archive1.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/archive1.html.js"), meta: {"_blog":{"title":"","author":"未知","date":"1998-01-01T00:00:00.000Z","category":["History"],"tag":["react setState"],"excerpt":""},"title":""} }],
  ["/posts/archive2.html", { loader: () => import(/* webpackChunkName: "posts_archive2.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/archive2.html.js"), meta: {"_blog":{"title":"Archive Article2","author":"未知","date":"1998-01-02T00:00:00.000Z","category":["History"],"tag":["WWII"],"excerpt":""},"title":"Archive Article2"} }],
  ["/posts/article1.html", { loader: () => import(/* webpackChunkName: "posts_article1.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article1.html.js"), meta: {"_blog":{"title":"Article 1","author":"未知","date":"2022-01-01T00:00:00.000Z","category":["CategoryA"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 1"} }],
  ["/posts/article10.html", { loader: () => import(/* webpackChunkName: "posts_article10.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article10.html.js"), meta: {"_blog":{"title":"Article 10","author":"未知","date":"2022-01-10T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 10"} }],
  ["/posts/article11.html", { loader: () => import(/* webpackChunkName: "posts_article11.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article11.html.js"), meta: {"_blog":{"title":"Article 11","author":"未知","date":"2022-01-11T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 11"} }],
  ["/posts/article12.html", { loader: () => import(/* webpackChunkName: "posts_article12.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article12.html.js"), meta: {"_blog":{"title":"Article 12","author":"未知","date":"2022-01-12T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 12"} }],
  ["/posts/article2.html", { loader: () => import(/* webpackChunkName: "posts_article2.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article2.html.js"), meta: {"_blog":{"title":"Article 2","author":"未知","date":"2022-01-02T00:00:00.000Z","category":["CategoryA"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 2"} }],
  ["/posts/article3.html", { loader: () => import(/* webpackChunkName: "posts_article3.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article3.html.js"), meta: {"_blog":{"title":"Article 3","author":"未知","date":"2022-01-03T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 3"} }],
  ["/posts/article4.html", { loader: () => import(/* webpackChunkName: "posts_article4.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article4.html.js"), meta: {"_blog":{"title":"Article 4","author":"未知","date":"2022-01-04T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 4"} }],
  ["/posts/article5.html", { loader: () => import(/* webpackChunkName: "posts_article5.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article5.html.js"), meta: {"_blog":{"title":"Article 5","author":"未知","date":"2022-01-05T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 5"} }],
  ["/posts/article6.html", { loader: () => import(/* webpackChunkName: "posts_article6.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article6.html.js"), meta: {"_blog":{"title":"Article 6","author":"未知","date":"2022-01-06T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag A","tag B"],"excerpt":""},"title":"Article 6"} }],
  ["/posts/article7.html", { loader: () => import(/* webpackChunkName: "posts_article7.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article7.html.js"), meta: {"_blog":{"title":"Article 7","author":"未知","date":"2022-01-07T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 7"} }],
  ["/posts/article8.html", { loader: () => import(/* webpackChunkName: "posts_article8.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article8.html.js"), meta: {"_blog":{"title":"Article 8","author":"未知","date":"2022-01-08T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 8"} }],
  ["/posts/article9.html", { loader: () => import(/* webpackChunkName: "posts_article9.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/article9.html.js"), meta: {"_blog":{"title":"Article 9","author":"未知","date":"2022-01-09T00:00:00.000Z","category":["CategoryA","CategoryB"],"tag":["tag C","tag D"],"excerpt":""},"title":"Article 9"} }],
  ["/posts/sticky.html", { loader: () => import(/* webpackChunkName: "posts_sticky.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/sticky.html.js"), meta: {"_blog":{"title":"Sticky Article","author":"未知","date":"2021-01-01T00:00:00.000Z","category":["CategoryC"],"tag":["tag E"],"excerpt":"<p>A sticky article demo.</p>"},"title":"Sticky Article"} }],
  ["/posts/sticky2.html", { loader: () => import(/* webpackChunkName: "posts_sticky2.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/sticky2.html.js"), meta: {"_blog":{"title":"Sticky Article with Higher Priority","author":"未知","date":"2020-01-01T00:00:00.000Z","category":["CategoryC"],"tag":["tag E"],"excerpt":""},"title":"Sticky Article with Higher Priority"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
  ["/category/", { loader: () => import(/* webpackChunkName: "category_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/index.html.js"), meta: {"title":"分类"} }],
  ["/category/history/", { loader: () => import(/* webpackChunkName: "category_history_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/history/index.html.js"), meta: {"title":"分类：History"} }],
  ["/category/categorya/", { loader: () => import(/* webpackChunkName: "category_categorya_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/categorya/index.html.js"), meta: {"title":"分类：CategoryA"} }],
  ["/category/categoryb/", { loader: () => import(/* webpackChunkName: "category_categoryb_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/categoryb/index.html.js"), meta: {"title":"分类：CategoryB"} }],
  ["/category/categoryc/", { loader: () => import(/* webpackChunkName: "category_categoryc_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/categoryc/index.html.js"), meta: {"title":"分类：CategoryC"} }],
  ["/tag/", { loader: () => import(/* webpackChunkName: "tag_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/index.html.js"), meta: {"title":"标签"} }],
  ["/tag/wwii/", { loader: () => import(/* webpackChunkName: "tag_wwii_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/wwii/index.html.js"), meta: {"title":"标签：WWII"} }],
  ["/tag/tag-a/", { loader: () => import(/* webpackChunkName: "tag_tag-a_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-a/index.html.js"), meta: {"title":"标签：tag A"} }],
  ["/tag/tag-b/", { loader: () => import(/* webpackChunkName: "tag_tag-b_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-b/index.html.js"), meta: {"title":"标签：tag B"} }],
  ["/tag/tag-c/", { loader: () => import(/* webpackChunkName: "tag_tag-c_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-c/index.html.js"), meta: {"title":"标签：tag C"} }],
  ["/tag/tag-d/", { loader: () => import(/* webpackChunkName: "tag_tag-d_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-d/index.html.js"), meta: {"title":"标签：tag D"} }],
  ["/tag/tag-e/", { loader: () => import(/* webpackChunkName: "tag_tag-e_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/tag-e/index.html.js"), meta: {"title":"标签：tag E"} }],
  ["/article/", { loader: () => import(/* webpackChunkName: "article_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/article/index.html.js"), meta: {"title":"文章"} }],
  ["/timeline/", { loader: () => import(/* webpackChunkName: "timeline_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/timeline/index.html.js"), meta: {"title":"时间线"} }],
  ["/posts/react-setState.html", { loader: () => import(/* webpackChunkName: "posts_react-setState.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/react-setState.html.js"), meta: {"_blog":{"title":"","author":"未知","date":"2024-06-02T06:35:39.835Z","category":[],"tag":[],"excerpt":""},"title":""} }],
  ["/tag/react-setstate/", { loader: () => import(/* webpackChunkName: "tag_react-setstate_index.html" */"/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/tag/react-setstate/index.html.js"), meta: {"title":"标签：react setState"} }],
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
