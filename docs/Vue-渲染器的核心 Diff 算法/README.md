
# Vue-渲染器的核心 Diff 算法

## 简版速记

> 面试 30 秒能讲清的版本。核心 Diff 只在「新旧子节点都是多个节点」时启用，目标是**用移动/复用代替删除+新建**。

**为什么要 Diff**：直接「全删全建」会浪费同标签 DOM 的复用机会；逐位置 patch 又处理不了长度不等与乱序。核心 Diff 就是解决「乱序复用」这一最难的情况。

**key 的作用**：没有 key 就只能按下标一一对应，导致本可移动复用的节点被原地更新（甚至全删全建）。key 给每个节点一个稳定身份，让算法能在旧 children 里精确找到可复用节点。所以**列表渲染必须用稳定且唯一的 key，绝不能用数组 index**（index 在增删/排序时会变，等于没 key）。

**三代核心 Diff 算法对比**：

| 算法 | 代表 | 核心思路 | 移动判断 | 典型问题 |
|---|---|---|---|---|
| 简单 Diff（React 早期） | React | 遍历新 children，用 `lastIndex`(遇到的最大旧索引) 判断是否要移动 | 旧索引 `j < lastIndex` 则需移动 | 某些场景会多做几次移动 |
| 双端比较 | Vue2 / snabbdom | 新旧两端各放指针，一轮最多 4 次比较（头头、尾尾、头尾、尾头） | 命中头尾/尾头交叉时移动 | 实现稍复杂，但移动更优 |
| 最长递增子序列 | Vue3 / inferno / ivi | 预处理去掉相同前缀后缀 → 建 key→index 表 → 求 LIS | 不在 LIS 中的节点才移动 | 移动次数最少，需算 LIS |

**Vue3 算法五步**：1) 同步相同前缀；2) 同步相同后缀；3) 前后缀处理完后，若仅剩新增/删除则直接 mount/remove；4) 乱序区建 `source` 数组（新节点在旧 children 的位置，找不到为 -1）+ key 索引表，标记 `moved`；5) 对 `source` 求最长递增子序列(LIS)，**LIS 中的节点保持不动，其余节点移动，source 为 -1 的节点新建挂载**，从后往前插入保证 refNode 已就位。

**复杂度**：朴素双层循环 O(n²)，用 key→index 索引表「空间换时间」降到 O(n)。

**易错点**：移动的是真实 DOM 而非 VNode；patch 后新 VNode 通过 `nextVNode.el = prevVNode.el` 继承真实 DOM 引用；插入用 `insertBefore(node, refNode)`，refNode 为 `null` 时退化为 `appendChild`。


## 目录

- [减小DOM操作的性能开销](./01-减小DOM操作的性能开销.html)
- [尽可能的复用 DOM 元素](./02-尽可能的复用-DOM-元素.html)
- [另一个思路 - 双端比较](./03-另一个思路-双端比较.html)
- [inferno 所采用的核心 Diff 算法及原理](./04-inferno-所采用的核心-Diff-算法及原理.html)
- [不足之处](./05-不足之处.html)
- [References](./06-References.html)
