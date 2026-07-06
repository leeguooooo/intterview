---
title: "delete和Vue delete删除数组的区别"
---

# 38 delete和Vue.delete删除数组的区别？

  * `delete`只是被删除的元素变成了 `empty/undefined` 其他的元素的键值还是不变。
  * `Vue.delete`直接删除了数组 改变了数组的键值。
```js
    var a=[1,2,3,4]
    var b=[1,2,3,4]
    delete a[0]
    console.log(a)  //[empty,2,3,4]
    this.$delete(b,0)
    console.log(b)  //[2,3,4]
```
