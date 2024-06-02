import comp from "/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/category/react/index.html.vue"
const data = JSON.parse("{\"path\":\"/category/react/\",\"title\":\"分类：React\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"分类：React\",\"sidebar\":false,\"blog\":{\"type\":\"category\",\"name\":\"React\",\"key\":\"category\"},\"layout\":\"Category\"},\"headers\":[],\"git\":{},\"filePathRelative\":null,\"excerpt\":\"\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
