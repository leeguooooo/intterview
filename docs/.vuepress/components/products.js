// 作者在 app.leeguoo.com 上的产品，顶部横幅和页脚共用这一份。
const utm = (campaign) =>
  `utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=${campaign}`

export const APP_STORE_URL = 'https://apps.apple.com/cn/app/id6818495898'
export const ALL_PRODUCTS_URL = `https://app.leeguoo.com/?${utm('app-center')}`

export const PRODUCTS = [
  {
    name: 'Thermo',
    short: 'Mac 体检，免费',
    desc: 'Mac 卡、发烫、磁盘满了，一句话告诉你原因；能清理 Claude Code / Codex 的旧会话和模型。免费。',
    href: `https://app.leeguoo.com/thermo?${utm('thermo')}`,
  },
  {
    name: 'Cookie Use',
    short: '多账号一键切换',
    desc: '在真实 Chrome 里一键切换多个登录账号，测试多账号不用反复登录。',
    href: `https://app.leeguoo.com/cookie-use?${utm('cookie-use')}`,
  },
  {
    name: 'ChooseBrowser',
    short: '链接自动选浏览器',
    desc: '按网址规则，把每个链接自动用对的浏览器 / Profile 打开的 Mac 小工具。',
    href: `https://choosebrowser.leeguoo.com/choose-browser/?${utm('choosebrowser')}`,
  },
  {
    name: 'Pastyx',
    short: '剪贴板历史',
    desc: 'Mac、Windows、iPhone 上的剪贴板管理器，复制过的一切随手搜、随手粘贴。',
    href: `https://app.leeguoo.com/paste?${utm('pastyx')}`,
  },
]
