<script setup>
const items = [
  {
    name: 'ChooseBrowser',
    desc: '按网址规则，把每个链接自动用对的浏览器 / Profile 打开的 Mac 小工具。',
    href: 'https://choosebrowser.leeguoo.com/choose-browser/?utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=choosebrowser',
  },
  {
    name: 'Pastyx',
    desc: '在线剪贴板，免安装，多设备实时同步（也有原生 Mac 版）。',
    href: 'https://paste.leeguoo.com/?utm_source=interview.leeguoo.com&utm_medium=cta&utm_campaign=pastyx',
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

  a {
    font-weight: 500;
    color: var(--c-text-accent);
  }

  @media (max-width: 959px) {
    padding-inline: 1rem;
  }
}
</style>
