import { defineClientConfig } from "vuepress/client";
import Layout from "./layouts/Layout.vue";
import Article from "./layouts/Article.vue";
import Category from "./layouts/Category.vue";
import Tag from "./layouts/Tag.vue";
import Timeline from "./layouts/Timeline.vue";
import ProductShowcase from "./components/ProductShowcase.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("ProductShowcase", ProductShowcase);
  },
  // we provide some blog layouts
  layouts: {
    Layout,
    Article,
    Category,
    Tag,
    Timeline
  }
});
