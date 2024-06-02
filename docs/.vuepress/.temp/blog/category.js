export const categoriesMap = {"category":{"/":{"path":"/category/","map":{"react":{"path":"/category/react/","indexes":[0]},"CategoryC":{"path":"/category/categoryc/","indexes":[1,2]}}}},"tag":{"/":{"path":"/tag/","map":{"react setState":{"path":"/tag/react-setstate/","indexes":[0]},"tag E":{"path":"/tag/tag-e/","indexes":[1,2]}}}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

