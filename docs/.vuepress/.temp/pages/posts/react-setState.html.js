import comp from "/Users/leeguoo/leeguoo.com/interview/docs/.vuepress/.temp/pages/posts/react-setState.html.vue"
const data = JSON.parse("{\"path\":\"/posts/react-setState.html\",\"title\":\"《React setState 面试题解析》\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2024-06-02T00:00:00.000Z\",\"category\":[\"react\"],\"tag\":[\"react setState\"],\"author\":\"leeguoo\"},\"headers\":[],\"git\":{\"updatedTime\":1717310441000,\"contributors\":[{\"name\":\"guoli\",\"email\":\"leeguoo@163.com\",\"commits\":1}]},\"filePathRelative\":\"posts/react-setState.md\",\"excerpt\":\"\\n<p>在 React 开发中，<code>setState</code> 是一个至关重要的方法。以下是一些常见的与 <code>setState</code> 相关的面试题：</p>\\n<ol>\\n<li>\\n<p>请简述 <code>setState</code> 的作用。</p>\\n<ul>\\n<li><code>setState</code> 主要用于更新组件的状态，从而触发组件的重新渲染，以反映状态的变化。</li>\\n</ul>\\n</li>\\n<li>\\n<p><code>setState</code> 是同步还是异步执行的？</p>\\n<ul>\\n<li>在一般情况下，它是异步执行的，但在某些特定场景下，如在事件处理函数中，可以通过回调函数来确保在状态更新后执行相应操作。例如：</li>\\n</ul>\\n</li>\\n</ol>\"}")
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
