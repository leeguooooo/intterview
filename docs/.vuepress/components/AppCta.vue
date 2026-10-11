<script setup>
// 第一屏的引流入口：第一行是最对口的自家 App，第二行是 app.leeguoo.com 上的其他产品。
// 中央 beacon 把 App Store 点击记成 product=interview，点进 app.leeguoo.com 记成 referral。
import { ALL_PRODUCTS_URL, APP_STORE_URL, PRODUCTS } from './products.js'

const show = !__IS_APP__
</script>

<template>
  <div v-if="show" class="app-cta">
    <a
      class="app-cta-main"
      :href="APP_STORE_URL"
      target="_blank"
      rel="noopener"
      aria-label="前端面试集锦 App"
    >
      <span class="app-cta-text">
        <strong>前端面试集锦 App</strong>
        <span class="app-cta-desc">iPhone / iPad 离线刷题，免费</span>
      </span>
      <span class="app-cta-action">App Store 下载 →</span>
    </a>
    <div class="app-cta-more">
      <span class="app-cta-more-label">作者的其他作品</span>
      <a
        v-for="item in PRODUCTS"
        :key="item.name"
        :href="item.href"
        target="_blank"
        rel="noopener"
      >{{ item.name }}<span class="app-cta-more-desc">{{ item.short }}</span></a>
      <a class="app-cta-more-all" :href="ALL_PRODUCTS_URL" target="_blank" rel="noopener">全部产品 →</a>
    </div>
  </div>
</template>

<style lang="scss">
.app-cta {
  // 主题标题用负 margin-top 给锚点让出导航栏高度，会盖住紧挨着的横幅，抬到上层才点得到
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  max-width: var(--content-width, 740px);
  margin: 1.25rem auto 0;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;

  a:hover {
    text-decoration: none;
  }

  .app-cta-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    color: var(--c-text);

    &:hover .app-cta-action {
      text-decoration: underline;
    }
  }

  .app-cta-desc {
    margin-left: 0.5rem;
    color: var(--c-text-lighter);
  }

  .app-cta-action {
    flex-shrink: 0;
    font-weight: 600;
    color: var(--c-text-accent);
  }

  .app-cta-more {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem 1rem;
    padding: 0.45rem 1rem;
    border-top: 1px solid var(--c-border);
    font-size: 0.8125rem;

    a {
      font-weight: 500;
      color: var(--c-text-accent);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .app-cta-more-label {
    color: var(--c-text-lighter);
  }

  .app-cta-more-desc {
    margin-left: 0.3rem;
    font-weight: 400;
    color: var(--c-text-lighter);
  }

  .app-cta-more-all {
    margin-left: auto;
  }

  @media (max-width: 959px) {
    margin-inline: 1rem;

    .app-cta-desc {
      display: block;
      margin-left: 0;
    }

    .app-cta-more-desc {
      display: none;
    }

    .app-cta-more-all {
      margin-left: 0;
    }
  }
}
</style>
