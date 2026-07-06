---
title: "如何拦截全局Promise reject"
---

# 第63题 如何拦截全局Promise reject
```js
    // 使用Try catch 只能拦截try语句块里面的
    try {
      new Promise((resolve, reject) => {
        reject("WTF 123");
      });
    } catch (e) {
      console.log("e", e);
      throw e;
    }
    
    // 使用 unhandledrejection 来拦截全局错误 
    window.addEventListener("unhandledrejection", (event) => {
      event && event.preventDefault();
      console.log("event", event);
    });
```
