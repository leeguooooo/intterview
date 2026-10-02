# App Store 上架资料 — 前端面试集锦

- Bundle ID：`com.leeguoo.interview`（已注册到 LI GUO / 6ZPXG4KVVS）
- App Store Connect App ID：`6818495898`（SKU `frontend-interview-ios`，2026-10-02 创建）
- 已通过 API 填好：副标题、描述、关键词、支持 URL、隐私政策 URL、分类、版权、年龄分级问卷（全部「无」）、价格（免费）、销售地区（175 个，含新地区）
- 待办：App 隐私（营养标签，选「不收集数据」）、截图、上传构建版本
- 平台：iPhone + iPad（通用 App），最低 iOS 13
- 主要语言：简体中文
- 类别：教育（主）/ 参考资料（次）
- 价格：免费，无内购
- 年龄分级：4+（问卷全选「无」）
- 隐私政策 URL：https://interview.leeguoo.com/privacy.html
- 支持 URL：https://interview.leeguoo.com/
- 隐私营养标签：**不收集数据**（App 构建已去掉 AdSense / GA4 / PostHog / visitor beacon，见 `docs/.vuepress/config.js` 的 `IS_APP`）
- 出口合规：不含非豁免加密（Info.plist 已设 `ITSAppUsesNonExemptEncryption = NO`）

## 名称 / 副标题

- 名称：前端面试集锦
- 副标题（≤30 字）：离线前端面试题库与知识速记

## 关键词（≤100 字符，逗号分隔）

前端,面试,面试题,JavaScript,Vue,React,CSS,HTML,浏览器,算法,手写题,Node,TypeScript,性能优化,网络

## 描述

前端面试集锦把前端面试中最常考的知识点整理成一套可以离线阅读的题库，覆盖 HTML、CSS、JavaScript、ES6、浏览器原理、网络与 HTTP、Vue、React、Node、前端工程化、性能优化、算法与手写题等模块。

- 全部内容打包在 App 内，地铁、飞机上没有网络也能复习
- 大部分专题开头都有「简版速记」，适合面试前快速过一遍
- 按模块分类的侧边栏目录，长文按章节拆分，翻阅流畅
- 适配 iPhone 与 iPad，支持横竖屏、分屏和深色模式
- 无广告、无需注册、不收集任何个人数据

## 审核备注（App Review Notes）

本 App 是一个离线前端面试题库：全部题目和讲解（约 800 个页面）都打包在 App 内，无需联网即可浏览。App 不需要登录，没有内购、广告或第三方统计，运行时不发起任何网络请求（不提供互联网信息服务，因此无需 ICP 备案）。文中的外部链接只在用户点击时由系统 Safari 打开。

## 截图

需要上传：
- iPhone 6.9"（1320×2868 或 1290×2796）：至少 1 张，建议 3–5 张
- iPad 13"（2064×2752 或 2048×2732）：至少 1 张（通用 App 必须提供）

在模拟器里截：`xcrun simctl io booted screenshot shot.png`
