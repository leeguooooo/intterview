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
      {
        text: '首页',
        link: '/',
      },
      {
        text: '基础篇',
        link: '/base.html',
      },
      {
        text: '进阶篇',
        link: '/improve.html',
      },
      {
        text: '高频篇',
        link: '/high-frequency.html',
      },
      // {
      //   text: '精选篇',
      //   link: '/excellent.html',
      // },
      {
        text: 'HTML',
        link: '/html.html',
      },
      {
        text: 'CSS',
        link: '/css.html',
      },
      {
        text: 'JavaScript',
        link: '/js.html',
      },
      {
        text: 'ES6',
        link: '/ES6.html',
      }, {
        text: '浏览器',
        link: '/browser.html',
      },
      {
        text: 'React',
        link: '/react.html',
      },
      {
        text: 'Vue',
        link: '/vue.html',
      }, {
        text: 'Node',
        link: '/node.html',
      }, {
        text: '前端工程化',
        link: '/engineering.html',
      },
      {
        text: '移动多端开发',
        link: '/mobile.html',
      },
      {
        text: '小程序',
        link: '/mini-program.html',
      },
      {
        text: 'Uniapp',
        link: '/uniapp.html',
      },
      {
        text: '前端安全',
        link: '/security.html',
      },
      {
        text: '性能优化',
        link: '/performance.html',
      }, {
        text: 'HTTP',
        link: '/http.html',

      },
      {
        text: '设计模式',
        link: '/design.html',
      },
      {
        text: '框架通识',
        link: '/framework.html',
      }, {
        text: '排序算法',
        link: '/sort.html'
      },
      {
        text: '计算机通识',
        link: '/computer.html',
      },

      {
        text: '高频模块',
        link: '/high-frequency-module.html',
      },
      {
        text: '面试指南',
        link: '/guide.html',
      },
      {
        text: '进阶性能优化',
        link: '/advanced-performance.html',
      },
      {
        text: '手写篇',
        link: '/handwriting.html',
      },
      {
        text: '综合题型',
        link: '/comprehensive.html',
      },
      {
        text: '其他问题',
        link: '/other.html',
      },

      {
        text: '算法篇',
        link: '/algorithm.html',
      },
      {
        text: '前端篇',
        link: '/frontend.html',
      },
      {
        text: '后端篇',
        link: '/backend.html',
      },
      {
        text: '数据库篇',
        link: '/database.html',
      },
      {
        text: '网络篇',
        link: '/network.html',
      },
      {
        text: '工具篇',
        link: '/tool.html',
      },
      {
        text: '面试篇',
        link: '/interview.html',
      },
      {
        text: '关于',
        link: '/about.html',
      },
      {
        text: '文章',
        link: '/article/',
      },
      {
        text: '分类',
        link: '/category/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: '时间线',
        link: '/timeline/',
      },
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
