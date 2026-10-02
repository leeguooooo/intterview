#!/usr/bin/env python3
"""检查改写稿和原文的文字重合度。
用法: python3 scripts/rewrite/overlap-check.py <原文.md> <改写.md>
输出 JSON:
  prose_overlap   改写稿正文 13 字符片段在原文中出现的比例(去掉代码、标点、空白)
  long_runs       与原文连续相同且 >= 30 字符的正文片段(应改写)
  code_line_overlap 改写稿里 >= 25 字符的代码行与原文逐行相同的比例"""
import json, re, sys
def split(md):
    md = re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S)
    code = "\n".join(re.findall(r"```[^\n]*\n(.*?)```", md, re.S))
    prose = re.sub(r"```.*?```", "", md, flags=re.S)
    prose = re.sub(r"!\[[^\]]*\]\([^)]*\)|\]\([^)]*\)|<[^>]+>|https?://\S+", "", prose)
    prose = re.sub(r"[\s`*_#>|\-:：，。、；！？,.;!?()（）\[\]【】「」“”\"'0-9]+", "", prose)
    return prose, code
o_prose, o_code = split(open(sys.argv[1], encoding="utf-8").read())
r_prose, r_code = split(open(sys.argv[2], encoding="utf-8").read())
K = 13
grams = {o_prose[i:i+K] for i in range(len(o_prose)-K+1)}
r_grams = [r_prose[i:i+K] for i in range(len(r_prose)-K+1)]
hit = [g in grams for g in r_grams]
runs, i = [], 0
while i < len(hit):
    if hit[i]:
        j = i
        while j < len(hit) and hit[j]: j += 1
        if j - i + K - 1 >= 30: runs.append(r_prose[i:j+K-1])
        i = j
    else: i += 1
norm = lambda s: re.sub(r"\s+", " ", s).strip()
o_lines = {norm(l) for l in o_code.splitlines() if len(norm(l)) >= 25}
r_lines = [norm(l) for l in r_code.splitlines() if len(norm(l)) >= 25]
print(json.dumps({
    "prose_overlap": round(sum(hit)/len(hit), 3) if hit else 0,
    "long_runs": runs[:20],
    "code_line_overlap": round(sum(l in o_lines for l in r_lines)/len(r_lines), 3) if r_lines else 0,
}, ensure_ascii=False, indent=1))
