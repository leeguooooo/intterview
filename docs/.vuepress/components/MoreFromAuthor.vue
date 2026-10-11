<script setup>
import { ALL_PRODUCTS_URL, APP_STORE_URL, PRODUCTS } from './products.js'

const ALL_URL = ALL_PRODUCTS_URL
const items = [
  ...(__IS_APP__ ? [] : [{
    name: '前端面试集锦 App',
    desc: '本站题库的 iPhone / iPad 版，离线刷题，免费。',
    href: APP_STORE_URL,
  }]),
  ...PRODUCTS,
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
