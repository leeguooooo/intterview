---
title: "项目经历中有写 SSR 说一下你是怎么实现的"
---

# 项目经历中有写 SSR，说一下你是怎么实现的

Next.js

### 如何保证同构的模块不会挂掉，例如在服务端访问 document

没有做过

据了解，这种写法应该禁止

### ts问题

上一个面试说过，业务项目中经常存在线上会出现 null、undefined 等类型错误，所以迁移了 ts，ts解决了什么问题

### 你觉得 ts 很重吗，如何确保你的同事不写 any

配置禁掉了 any，如果用了 `//@ts-ignore` 会在 review 过问

### ts 给你带来的价值

### 实现一个 ts 的工具函数
```typescript
    type A = {
      a: number;
      b: string;
      c: () => void;
      d: (s: string) => boolean;
    }
```

实现一个工具函数 `GetOnlyFnProps<T>` ，提取泛型类型 T 中字段值是函数的类型。
```typescript
    type GetOnlyFnKeys<T extends object> = {
      [K in keyof T]: T[K] extends Function ? K : never
    }[keyof T]
    
    type GetOnlyFnProps<T extends object> = {
      [K in GetOnlyFnKeys<T>]: T[K]
    }
```

### 你有维护组件库，说一下如何管理组件

git + lerna

### 组件质量如何保存

### 没有测试用例的情况下，组件发布完全靠测试去人工测试？有没有遇到出错的情况。

### 组件发布的是不是所有依赖这个组件库的项目都需要升级？

### 发布问题

如果业务A需要组件进行修改，发布了版本 1.0.1，此时业务B没有升级，仍然是 1.0.0，如果此时业务 B 需要组件修改，发布版本
1.0.2，这时候就会带上 1.0.1上的修改，这上面的修改有可能会引发业务 B 的问题，如何处理

### 除了 lerna，还有其他的方式吗

### 你们组件库，别人如何能知道如何使用

storybook

### 假如现在是下午 5 点 35 分，时针和分针的夹角是多少

时钟每一大格是 30 度，每一小格是 6 度

时针每过一分钟移动 0.5 度
