<script setup>
const ALL_URL = 'https://app.leeguoo.com/?utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=app-center'
const items = [
  ...(__IS_APP__ ? [] : [{
    name: '前端面试集锦 App',
    desc: '本站题库的 iPhone / iPad 版，离线刷题，免费。',
    href: 'https://apps.apple.com/cn/app/id6818495898',
  }]),
  {
    name: 'Thermo',
    desc: 'Mac 卡、发烫、磁盘满了，一句话告诉你原因；能清理 Claude Code / Codex 的旧会话和模型。免费。',
    href: 'https://app.leeguoo.com/thermo?utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=thermo',
  },
  {
    name: 'Cookie Use',
    desc: '在真实 Chrome 里一键切换多个登录账号，测试多账号不用反复登录。',
    href: 'https://app.leeguoo.com/cookie-use?utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=cookie-use',
  },
]
</script>

<template>
  <aside class="more-from-author" aria-label="作者的其他作品">
    <p class="more-from-author-title">作者的其他作品</p>
    <ul>
      <li v-for="item in items" :key="item.name">
        <a :href="item.href" target="_blank" rel="noopener">{{ item.name }}</a>
        <span class="more-from-author-desc"> — {{ item.desc }}</span>
      </li>
    </ul>
    <a class="more-from-author-all" :href="ALL_URL" target="_blank" rel="noopener">全部产品 →</a>
  </aside>
</template>

<style lang="scss">
.more-from-author {
  max-width: var(--content-width, 740px);
  margin: 0 auto;
  padding: 1rem 2rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--c-text-lighter);

  .more-from-author-title {
    margin: 0 0 0.35rem;
    font-weight: 600;
    color: var(--c-text-light);
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  li {
    margin: 0.15rem 0;
  }

  .more-from-author-all {
    display: inline-block;
    margin-top: 0.35rem;
  }

  a {
    font-weight: 500;
    color: var(--c-text-accent);
  }

  @media (max-width: 959px) {
    padding-inline: 1rem;
  }
}
</style>
