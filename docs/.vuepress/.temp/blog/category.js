export const categoriesMap = {"category":{"/":{"path":"/category/","map":{"React":{"path":"/category/react/","indexes":[0]},"Frontend Development":{"path":"/category/frontend-development/","indexes":[0]}}}},"tag":{"/":{"path":"/tag/","map":{"React":{"path":"/tag/react/","indexes":[0]},"setState":{"path":"/tag/setstate/","indexes":[0]},"useState":{"path":"/tag/usestate/","indexes":[0]},"JavaScript":{"path":"/tag/javascript/","indexes":[0]},"Web Development":{"path":"/tag/web-development/","indexes":[0]}}}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

