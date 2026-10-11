<script setup>
// 首页的作品区块（README 里直接写 <ProductShowcase />）。
import { ALL_PRODUCTS_URL, APP_STORE_URL, PRODUCTS } from './products.js'

const show = !__IS_APP__
const items = [
  { name: '前端面试集锦 App', desc: '本站题库的 iPhone / iPad 版，离线刷题，免费。', href: APP_STORE_URL },
  ...PRODUCTS,
]
</script>

<template>
  <section v-if="show">
  <h2 id="作者的产品">作者的产品</h2>
  <div class="product-showcase">
    <a v-for="item in items" :key="item.name" class="product-card" :href="item.href" target="_blank" rel="noopener">
      <strong>{{ item.name }}</strong>
      <span>{{ item.desc }}</span>
    </a>
    <a class="product-card product-card-all" :href="ALL_PRODUCTS_URL" target="_blank" rel="noopener">
      <strong>全部产品 →</strong>
      <span>app.leeguoo.com 应用中心</span>
    </a>
  </div>
  </section>
</template>

<style lang="scss">
.product-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;

  .product-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--c-text-lighter);

    &:hover {
      border-color: var(--c-text-accent);
      text-decoration: none;
    }

    strong {
      color: var(--c-text-accent);
    }
  }
}
</style>
