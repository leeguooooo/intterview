#!/usr/bin/env python3
"""把一个 HTML 示例渲染成裁好白边的 webp 配图。
用法: python3 scripts/rewrite/render-figure.py <in.html> <out.webp> [视口宽度,默认 900]
HTML 里尽量用白底;页面脚本可以测量元素位置后画标注,渲染前会执行完。"""
import os, subprocess, sys, tempfile, glob
from PIL import Image, ImageChops
src, out = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 900
cands = glob.glob(os.path.expanduser("~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell"))
if not cands: sys.exit("找不到 chrome-headless-shell(Playwright 缓存)")
png = tempfile.mktemp(suffix=".png")
subprocess.run([sorted(cands)[-1], "--headless", "--hide-scrollbars", "--force-device-scale-factor=2",
                f"--window-size={width},2400", "--virtual-time-budget=2000", f"--screenshot={png}",
                "file://" + os.path.abspath(src)], check=True, capture_output=True)
im = Image.open(png).convert("RGB")
box = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
if not box: sys.exit("渲染结果是空白,检查 HTML")
pad = 32
im = im.crop((max(0, box[0]-pad), max(0, box[1]-pad), min(im.width, box[2]+pad), min(im.height, box[3]+pad)))
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
im.save(out, "WEBP", quality=88)
print(f"{out} {im.size[0]}x{im.size[1]}")
