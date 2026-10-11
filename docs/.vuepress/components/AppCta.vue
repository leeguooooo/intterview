<script setup>
// 面试站最对口的产品就是自家 App。链接走 apps.apple.com，
// 中央 beacon 会把这类点击记成 product=interview / kind=appstore。
const APP_URL = 'https://apps.apple.com/cn/app/id6818495898'
const showApp = !__IS_APP__
</script>

<template>
  <a
    v-if="showApp"
    class="app-cta"
    :href="APP_URL"
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
</template>

<style lang="scss">
.app-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  box-sizing: border-box;
  max-width: var(--content-width, 740px);
  margin: 1.25rem auto 0;
  padding: 0.6rem 1rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--c-text);
  text-decoration: none;

  &:hover {
    border-color: var(--c-text-accent);
    text-decoration: none;
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

  @media (max-width: 959px) {
    margin-inline: 1rem;

    .app-cta-desc {
      display: block;
      margin-left: 0;
    }
  }
}
</style>
