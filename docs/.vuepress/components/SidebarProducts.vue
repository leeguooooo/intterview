<script setup>
// 侧边栏顶部：每页都在，手机上展开菜单抽屉也能看到。
import { ALL_PRODUCTS_URL, APP_STORE_URL, PRODUCTS } from './products.js'

const show = !__IS_APP__
</script>

<template>
  <aside v-if="show" class="sidebar-products" aria-label="作者的作品">
    <a class="sidebar-products-app" :href="APP_STORE_URL" target="_blank" rel="noopener">
      <strong>前端面试集锦 App</strong>
      <span>iPhone / iPad 离线刷题，免费 →</span>
    </a>
    <ul>
      <li v-for="item in PRODUCTS" :key="item.name">
        <a :href="item.href" target="_blank" rel="noopener">{{ item.name }}</a>
        <span> · {{ item.short }}</span>
      </li>
    </ul>
    <a class="sidebar-products-all" :href="ALL_PRODUCTS_URL" target="_blank" rel="noopener">全部产品 →</a>
  </aside>
</template>

<style lang="scss">
.sidebar-products {
  margin: 1rem 1rem 0;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--c-text-lighter);

  a {
    color: var(--c-text-accent);
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .sidebar-products-app {
    display: block;
    margin-bottom: 0.35rem;

    strong {
      display: block;
      color: var(--c-text);
    }

    span {
      font-weight: 400;
    }
  }

  ul {
    margin: 0 0 0.25rem;
    padding: 0;
    list-style: none;
  }
}
</style>
