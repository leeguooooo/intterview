# 12 webpack中如何处理图片的？

在`webpack`中有两种处理图片的`loader`：

  * `file-loader`：解决`CSS`等中引入图片的路径问题；(解决通过`url`,`import/require()`等引入图片的问题)
  * `url-loader`：当图片小于设置的`limit`参数值时，`url-loader`将图片进行`base64`编码(当项目中有很多图片，通过`url-loader`进行`base64`编码后会减少`http`请求数量，提高性能)，大于limit参数值，则使用`file-loader`拷贝图片并输出到编译目录中；
