import comp from "/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"面试题集锦\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"title\":\"面试题集锦\",\"heroImage\":\"/images/logo.webp\",\"actions\":[{\"text\":\"开始学习\",\"link\":\"/getting-started.html\",\"type\":\"primary\"},{\"text\":\"介绍\",\"link\":\"introduction.md\",\"type\":\"secondary\"},{\"text\":\"文章专栏\",\"link\":\"https://interview.leeguoo.top:16666/article/\",\"type\":\"secondary\"}],\"features\":[{\"title\":\"面试题库\",\"details\":\"涵盖广泛的技术领域，包括前端、后端、全栈及软件架构等。\"},{\"title\":\"实战演练\",\"details\":\"提供详尽的题目解答与解题思路，助你深入理解每个问题。\"},{\"title\":\"持续更新\",\"details\":\"面试题目及解答持续更新，保证内容的时效性与技术的前沿性。\"}],\"footer\":\"MIT 许可证 | 版权所有 © 2018-present VuePress Community\"},\"headers\":[{\"level\":2,\"title\":\"目录\",\"slug\":\"目录\",\"link\":\"#目录\",\"children\":[]}],\"git\":{\"updatedTime\":1717310441000,\"contributors\":[{\"name\":\"guoli\",\"email\":\"leeguoo@163.com\",\"commits\":1}]},\"filePathRelative\":\"README.md\"}")
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
