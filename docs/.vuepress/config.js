import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'zh-CN',

  title: '面试题集锦',
  description: '为软件开发者准备的面试题库',

  theme: defaultTheme({
    logo: 'images/logo.webp',

    navbar: [
      { 'text': '首页', 'link': '/', 'test': '123' },
      { 'text': '基础篇', 'link': '/基础篇.md', 'originUrl': 'https://interview.poetries.top/docs/base.html#%E4%B8%80%E3%80%81html%E3%80%81http%E3%80%81web%E7%BB%BC%E5%90%88%E9%97%AE%E9%A2%98', 'updateTime': '2024-06-03 07.35.17' },
      { 'text': '进阶篇', 'link': '/进阶篇.html', 'originUrl': 'https://interview.poetries.top/docs/base/improve.html', 'updateTime': '2024-06-03 08.39.19' },
      { 'text': '高频篇', 'link': '/高频篇.html', 'originUrl': 'https://interview.poetries.top/docs/base/high-frequency.html', 'updateTime': '2024-06-03 08.39.42' },
      { 'text': 'HTML', 'link': '/HTML.md', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/1-HTML%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.11.20' },
      { 'text': 'CSS', 'link': '/CSS.md', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/2-CSS%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.11.51' },
      { 'text': 'JavaScript', 'link': '/JavaScript.md', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/3-JS%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.12.26' },
      { 'text': 'ES6', 'link': '/ES6.md', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/4-ES6%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.12.49' },
      { 'text': '浏览器', 'link': '/浏览器.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/5-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.23.31' },
      { 'text': 'React', 'link': '/React.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/6-React.html', 'updateTime': '2024-06-03 08.24.09' },
      { 'text': 'Vue', 'link': '/Vue.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/7-Vue.html', 'updateTime': '2024-06-03 08.24.31' },
      { 'text': 'Node', 'link': '/Node.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/8-Node%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.25.10' },
      { 'text': '前端工程化', 'link': '/前端工程化.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/9-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.25.35' },
      { 'text': '移动多端开发', 'link': '/移动多端开发.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/10-%E7%A7%BB%E5%8A%A8%E5%A4%9A%E7%AB%AF%E5%BC%80%E5%8F%91.html', 'updateTime': '2024-06-03 08.27.01' },
      { 'text': '小程序', 'link': '/小程序.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/11-%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.27.22' },
      { 'text': 'Uniapp', 'link': '/Uniapp.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/12-Uniapp%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.29.10' },
      { 'text': '前端安全', 'link': '/前端安全.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/13-%E5%89%8D%E7%AB%AF%E5%AE%89%E5%85%A8%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.29.53' },
      { 'text': '性能优化', 'link': '/性能优化.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/14-%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.31.25' },
      { 'text': 'HTTP', 'link': '/HTTP.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/15-HTTP%E6%A8%A1%E5%9D%97.html', 'updateTime': '2024-06-03 08.31.51' },
      { 'text': '常用设计模式', 'link': '/常用设计模式.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/16-%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html', 'updateTime': '2024-06-03 08.32.56' },
      { 'text': '设计模式 2', 'link': '/设计模式 2.md', 'originUrl': 'https://interview.poetries.top/docs/base/design-pattern.html', 'updateTime': '2024-06-03 08.04.01' },
      { 'text': '框架通识', 'link': '/框架通识.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/17-%E6%A1%86%E6%9E%B6%E9%80%9A%E8%AF%86.html', 'updateTime': '2024-06-03 08.33.15' },
      { 'text': '排序算法', 'link': '/排序算法.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/18-%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95.html', 'updateTime': '2024-06-03 08.33.48' },
      { 'text': '计算机通识', 'link': '/计算机通识.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/19-%E8%AE%A1%E7%AE%97%E6%9C%BA%E9%80%9A%E8%AF%86.html', 'updateTime': '2024-06-03 08.34.01' },
      { 'text': '高频考点', 'link': '/高频考点.html', 'originUrl': '/Users/zhihu/Downloads/高频考点 _ 前端进阶之旅.html', 'updateTime': '2024-06-03 08.42.11' },
      { 'text': '面试指南', 'link': '/面试指南.html', 'updateTime': '2024-06-03 08.38.22', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/%E9%9D%A2%E8%AF%95%E6%8C%87%E5%8D%97.html' },
      { 'text': '进阶性能优化', 'link': '/进阶性能优化.html', 'originUrl': 'https://interview.poetries.top/docs/excellent-docs/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.html', 'updateTime': '2024-06-03 08.38.43' },
      { 'text': '手写篇', 'link': '/手写篇.md', 'originUrl': 'https://interview.poetries.top/docs/base/handwritten.html', 'updateTime': '2024-06-03 07.56.37' },
      { 'text': '综合题型', 'link': '/综合题型.md', 'originUrl': 'https://interview.poetries.top/docs/base/comprehensive.html', 'updateTime': '2024-06-03 08.02.08' },
      { 'text': '其他问题', 'link': '/其他问题.md', 'originUrl': 'https://interview.poetries.top/docs/base/other-questions.html', 'updateTime': '2024-06-03 08.02.52' },
      { 'text': '文章', 'link': '/article/' },
      { 'text': '分类', 'link': '/category/' },
      { 'text': '标签', 'link': '/tag/' },
      { 'text': '时间线', 'link': '/timeline/' },
      { 'text': 'Vue-生命周期', 'link': '/Vue源码.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/01-%E4%BB%8E%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BBVue%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.html', 'updateTime': '2024-06-03 08.44.43' },
      { 'text': 'Vue-组件的本质', 'link': '/Vue-组件的本质.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/02-%E7%BB%84%E4%BB%B6%E7%9A%84%E6%9C%AC%E8%B4%A8.html', 'updateTime': '2024-06-03 08.46.22' },
      { 'text': 'Vue-有状态组件的设计', 'link': '/Vue-有状态组件的设计.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/03-%E6%9C%89%E7%8A%B6%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84%E8%AE%BE%E8%AE%A1.html', 'updateTime': '2024-06-03 08.47.22' },
      { 'text': 'Vue-VNode', 'link': '/Vue-VNode.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/04-%E8%AE%BE%E8%AE%A1%20VNode.html', 'updateTime': '2024-06-03 08.48.33' },
      { 'text': 'Vue-辅助创建 VNode 的 h 函数', 'link': '/Vue-辅助创建 VNode 的 h 函数.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/05-%E8%BE%85%E5%8A%A9%E5%88%9B%E5%BB%BA%20VNode%20%E7%9A%84%20h%20%E5%87%BD%E6%95%B0.html', 'updateTime': '2024-06-03 08.49.46' },
      { 'text': 'Vue-自定义渲染器和异步渲染', 'link': '/Vue-自定义渲染器和异步渲染.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/06-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E5%92%8C%E5%BC%82%E6%AD%A5%E6%B8%B2%E6%9F%93.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86', 'updateTime': '2024-06-03 08.51.21' },
      { 'text': 'Vue-渲染器之挂载', 'link': '/Vue-渲染器之挂载.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/07-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8B%E6%8C%82%E8%BD%BD.html', 'updateTime': '2024-06-03 08.52.10' },
      { 'text': 'Vue-渲染器的核心 Diff 算法', 'link': '/Vue-渲染器的核心 Diff 算法.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/08-%E6%B8%B2%E6%9F%93%E5%99%A8%E7%9A%84%E6%A0%B8%E5%BF%83%20Diff%20%E7%AE%97%E6%B3%95.html', 'updateTime': '2024-06-03 08.52.55' },
      { 'text': 'Vue-渲染器之patch', 'link': '/Vue-渲染器之patch.html', 'originUrl': 'https://interview.poetries.top/principle-docs/vue/09-%E6%B8%B2%E6%9F%93%E5%99%A8%E4%B9%8Bpatch.html', 'updateTime': '2024-06-03 08.53.38' }
    ],
  }),

  plugins: [
    blogPlugin({
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      getInfo: ({ frontmatter, title }) => ({
        title,
        author: frontmatter.author || '未知',
        date: frontmatter.date || new Date(),
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt: frontmatter.excerpt || '',
      }),

      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home && frontmatter.excerpt !== false,

      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: '分类',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `分类：${name}`,
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: '标签',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `标签：${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: 'article',
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: '文章',
            sidebar: false,
          }),
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky
            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1
            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1
            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          filter: (page) => page.frontmatter.date instanceof Date,
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: '时间线',
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
  ],

  bundler: viteBundler(),
})
