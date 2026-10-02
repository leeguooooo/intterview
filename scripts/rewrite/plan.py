#!/usr/bin/env python3
"""生成剩余待改写文章的清单;大文件按 H2(必要时 H3)切块。输出 rewrite-staging/plan.json"""
import json, os, re, subprocess, sys
LIMIT, BIG = 22_000, 40_000
pats = json.loads(subprocess.run(["node", "-e", 'import("./docs/.vuepress/app-exclude.js").then(m=>console.log(JSON.stringify(m.excludedPagePatterns("docs"))))'], capture_output=True, text=True, check=True).stdout)
files = [re.sub(r"\\(.)", r"\1", p[1:]) for p in pats]
def slug(rel):
    base = os.path.basename(rel)[:-3]
    num = (re.search(r"^(\d+)", base) or re.search(r"-(\d+)-", base) or [None, ""])[1]
    if rel.startswith("http 基础-"): return f"http-{num}"
    for pre, s in (("进阶性能优化/", "perf"), ("面试指南/", "guide"), ("常用设计模式/", "pattern"), ("设计模式 2/", "pattern2")):
        if rel.startswith(pre):
            if base == "README": return f"{s}-index"
            sib = sorted(f for f in os.listdir("docs/" + pre) if f.endswith(".md") and f != "README.md")
            return f"{s}-{sib.index(os.path.basename(rel)) + 1:02d}"
    special = {"React-React16为什么要更改生命周期上": "react-lifecycle-1", "React-React16为什么要更改生命周期下": "react-lifecycle-2",
               "React-React Hooks 设计动机与工作模式": "react-hooks-motivation", "React-深入 React Hooks 工作机制": "react-hooks-internals",
               "Vue-剖析 Vue 内部运行机制": "vue-internals", "React-27-Taro原理": "react-taro"}
    if base in special: return special[base]
    if rel.startswith("React-"): return f"react-{num}"
    if rel.startswith("综合-"): return f"misc-{num}"
    sys.exit("no slug: " + rel)
def split_sections(text, level):
    parts = re.split(rf"(?m)^(?={'#' * level} )", text)
    return [p for p in parts if p.strip()]
def chunk(text):
    secs = []
    for s in split_sections(text, 2):
        secs += split_sections(s, 3) if len(s.encode()) > LIMIT else [s]
    out, cur = [], ""
    for s in secs:
        if cur and len((cur + s).encode()) > LIMIT: out.append(cur); cur = ""
        cur += s
    if cur: out.append(cur)
    return out
plan = []
for rel in sorted(files):
    src = "docs/" + rel; size = os.path.getsize(src); item = {"src": rel, "slug": slug(rel), "size": size}
    if size > BIG:
        text = open(src, encoding="utf-8").read()
        m = re.match(r"^---\n.*?\n---\n", text, re.S); body = text[m.end():] if m else text
        cs = chunk(body); d = f"rewrite-staging/chunks/{item['slug']}"; os.makedirs(d, exist_ok=True)
        item["chunks"] = []
        for i, c in enumerate(cs, 1):
            p = f"{d}/{i:02d}.src.md"; open(p, "w", encoding="utf-8").write(c)
            heads = re.findall(r"(?m)^#{2,3} .*", c)
            item["chunks"].append({"path": p, "size": len(c.encode()), "headings": heads[:6]})
    plan.append(item)
slugs = [p["slug"] for p in plan]; assert len(slugs) == len(set(slugs)), "duplicate slug"
json.dump(plan, open("rewrite-staging/plan.json", "w"), ensure_ascii=False, indent=1)
print(len(plan), "articles;", sum(1 for p in plan if "chunks" in p), "chunked")
for p in plan:
    if "chunks" in p: print(p["slug"], p["size"] // 1024, "K ->", [c["size"] // 1024 for c in p["chunks"]])
