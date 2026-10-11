<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import MoreFromAuthor from '../components/MoreFromAuthor.vue'
import AppCta from '../components/AppCta.vue'
</script>

<template>
  <ParentLayout>
    <!-- page-bottom 只在普通内容页渲染（首页 home:true 走 Home 组件，不含此插槽） -->
    <template #page-top>
      <AppCta />
    </template>
    <template #page-bottom>
      <MoreFromAuthor />
      <p class="author-byline">作者 <a href="https://leeguoo.com/about" rel="author">郭立</a>（leeguoo）· <a href="https://blog.leeguoo.com/zh/">郭立的技术博客</a></p>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.author-byline {
  max-width: var(--content-width, 740px);
  margin: 0 auto;
  padding: 0.5rem 2rem 1.5rem;
  font-size: 0.875rem;
  color: var(--c-text-lighter);
}
</style>
