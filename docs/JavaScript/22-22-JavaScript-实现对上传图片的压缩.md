# 22 JavaScript 实现对上传图片的压缩？

> 答：读取用户上传的 File 对象，读写到画布（canvas）上，利用 Canvas 的 API 进行压缩，完成压缩之后再转成 `File（Blob）`
> 对象，上传到远程图片服务器；不过有时候我们也需要将一个 `base64` 字符串压缩之后再变为 `base64` 字符串传入到远程数据库或者再转成
> `File（Blob）` 对象。

思路就是 `File + Canvas` 的 `drawImage`

阅读全文
