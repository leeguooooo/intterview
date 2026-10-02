// App 构建(APP_BUILD=1)不收录的内容:来自付费课程 / 小册,没有分发授权。
// 网站照常保留。路径相对 docs/,不带扩展名。
import fs from "node:fs";
import path from "node:path";

// 已经改写成原创版本的文章(相对 docs/、不带扩展名),不再排除,重新收录进 App
const REWRITTEN = new Set(
  JSON.parse(fs.readFileSync(new URL("./rewritten.json", import.meta.url), "utf8"))
);

const EXCLUDE = [
  /^http 基础-/, // 付费专栏
  /^进阶性能优化(\/|$)/, // 小册
  /^面试指南(\/|$)/, // 小册
  /^常用设计模式(\/|$)/, // 小册
  /^设计模式 2(\/|$)/, // 疑似专栏
  /^React-(1[5-9]|2[0-5]|27)-/, // 付费课程 / 小册
  /^React-React16为什么要更改生命周期/,
  /^React-React Hooks 设计动机与工作模式$/,
  /^React-深入 React Hooks 工作机制$/,
  /^Vue-剖析 Vue 内部运行机制$/,
  /^综合-1[05]-/,
];

const normalize = (link) => {
  let p = link.split("#")[0].split("?")[0];
  try {
    p = decodeURI(p);
  } catch {}
  return p
    .replace(/^(\.{0,2}\/)+/, "")
    .replace(/(\.md)+$|\.html$/, "")
    .replace(/\/(README|index)?$/, "");
};

export const isExcluded = (link) => {
  if (typeof link !== "string" || /^[a-z]+:/i.test(link)) return false;
  const p = normalize(link);
  return !REWRITTEN.has(p) && EXCLUDE.some((re) => re.test(p));
};

// pagePatterns 里的排除项:直接列出命中的文件,避免文件名里的特殊字符被当成 glob
export const excludedPagePatterns = (docsDir) => {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".") || e.name === "node_modules") continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else if (e.name.endsWith(".md")) {
        const rel = path.relative(docsDir, abs).split(path.sep).join("/");
        if (isExcluded(rel)) out.push("!" + rel.replace(/[()[\]{}*?!+@]/g, "\\$&"));
      }
    }
  };
  walk(docsDir);
  return out;
};

// 递归去掉 navbar / sidebar 里指向排除页面的项,清理掉变空的分组
export const pruneNav = (items) => {
  if (!Array.isArray(items)) return items;
  return items
    .map((item) => {
      if (typeof item === "string") return isExcluded(item) ? null : item;
      if (isExcluded(item.link)) return null;
      if (item.children) {
        const children = pruneNav(item.children);
        if (!children.length && !item.link) return null;
        return { ...item, children };
      }
      return item;
    })
    .filter(Boolean);
};

export const pruneSidebar = (sidebar) =>
  Object.fromEntries(
    Object.entries(sidebar)
      .filter(([key]) => !isExcluded(key))
      .map(([key, items]) => [key, pruneNav(items)])
  );

// markdown-it 插件:正文里指向排除页面的站内链接降级为纯文本
export const unlinkExcluded = (md) => {
  md.core.ruler.push("unlink-excluded", (state) => {
    for (const block of state.tokens) {
      if (!block.children) continue;
      const kept = [];
      const stack = [];
      for (const t of block.children) {
        if (t.type === "link_open") {
          const drop = isExcluded(t.attrGet("href"));
          stack.push(drop);
          if (drop) continue;
        } else if (t.type === "link_close") {
          if (stack.pop()) continue;
        }
        kept.push(t);
      }
      block.children = kept;
    }
  });
};
