import comp from "/Users/zhihu/leeguoo.com/intterview/docs/.vuepress/.temp/pages/introduction.html.vue"
const data = JSON.parse("{\"path\":\"/introduction.html\",\"title\":\"介绍\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"介绍\",\"description\":\"了解更多关于本站和面试题集锦。\"},\"headers\":[{\"level\":2,\"title\":\"关于本站\",\"slug\":\"关于本站\",\"link\":\"#关于本站\",\"children\":[]},{\"level\":2,\"title\":\"我们的目标\",\"slug\":\"我们的目标\",\"link\":\"#我们的目标\",\"children\":[]},{\"level\":2,\"title\":\"内容覆盖\",\"slug\":\"内容覆盖\",\"link\":\"#内容覆盖\",\"children\":[]},{\"level\":2,\"title\":\"加入我们\",\"slug\":\"加入我们\",\"link\":\"#加入我们\",\"children\":[]}],\"git\":{\"updatedTime\":1717310441000,\"contributors\":[{\"name\":\"guoli\",\"email\":\"leeguoo@163.com\",\"commits\":1}]},\"filePathRelative\":\"introduction.md\",\"excerpt\":\"\\n<h2>关于本站</h2>\\n<p>本站是为了帮助开发者准备技术面试而创建的。这里汇集了各种常见的编程及技术问题，旨在提供一个全面的面试准备资源。</p>\\n<h2>我们的目标</h2>\\n<p>我们的目标是使每位前来访问的开发者都能找到有价值的面试资源，提高面试时的信心和技术水平。</p>\\n<h2>内容覆盖</h2>\\n<ul>\\n<li><strong>广泛的技术领域</strong>：包括但不限于前端、后端、全栈及软件架构等。</li>\\n<li><strong>深入的解答</strong>：不仅仅是回答问题，更提供背后的原理和相关技术的深入讨论。</li>\\n<li><strong>持续更新</strong>：技术在不断进步，我们的内容也在持续更新，确保与时俱进。</li>\\n</ul>\"}")
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
