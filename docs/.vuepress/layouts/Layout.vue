<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import MoreFromAuthor from '../components/MoreFromAuthor.vue'
</script>

<template>
  <ParentLayout>
    <!-- page-bottom 只在普通内容页渲染（首页 home:true 走 Home 组件，不含此插槽） -->
    <template #page-bottom>
      <MoreFromAuthor />
    </template>
  </ParentLayout>
</template>
