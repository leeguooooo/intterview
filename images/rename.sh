#!/bin/bash

# 切换到当前目录
cd "$(dirname "$0")"

# 查找当前目录下所有以 .png? 结尾的文件
for file in *.png?; do
  # 检查是否存在匹配的文件
  if [ -e "$file" ]; then
    # 去掉问号，并重命名文件
    new_file="${file%\?}"
    mv "$file" "$new_file"
    echo "Renamed $file to $new_file"
  fi
done
