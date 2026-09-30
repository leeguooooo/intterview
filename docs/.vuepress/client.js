import { defineClientConfig } from "vuepress/client";
import Layout from "./layouts/Layout.vue";
import Article from "./layouts/Article.vue";
import Category from "./layouts/Category.vue";
import Tag from "./layouts/Tag.vue";
import Timeline from "./layouts/Timeline.vue";
import ExampleComponent from "./components/ExampleComponent.vue";

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
    Layout,
    Article,
    Category,
    Tag,
    Timeline
  },
  enhance({ app, router, siteData }) {
    app.component("ExampleComponent", ExampleComponent);
  }
});
