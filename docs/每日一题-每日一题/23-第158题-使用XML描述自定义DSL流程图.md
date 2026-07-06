---
title: "使用XML描述自定义DSL流程图"
---

# 第158题 使用XML描述自定义DSL流程图

用`xml`描述这个流程图

![](/images/s_poetries_work_uploads_2023_02_51fa2d56fbff44fa.webp)
```xml
    <chart>
      <start-end id="start">开始</start-end>
      <flow id="flow1">流程1</flow>
      <judge id="judge1">评审</judge>
      <flow id="flow2">流程2</flow>
      <start-end id="end">结束</start-end>
      <arrow from="start" to="flow1"></arrow>
      <arrow from="flow1" to="judge1"></arrow>
      <arrow from="judge1" to="flow2">Y</arrow>
      <arrow from="judge1" to="end">N</arrow>
      <arrow from="flow2" to="end"></arrow>
    </chart>
```
