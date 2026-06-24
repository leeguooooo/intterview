# 16 使用babel-loader会有哪些问题？可以怎样优化？

  1. 会使得编译很慢。解决办法是可以在`webpack`的`babel-loader`配置中使用`exclude`这个可选项来去除一些不需要编译的文件夹(例如`node_modules`和`bower_components`)，另一种可以设置`cacheDirectory`选项为`true`, 开启缓存, 转译的结果将会缓存到文件系统中, 这样使`babel-loader`至少提速两倍(代码量越多效果应该越明显)。
  2. `babel-loader`使得打包文件体积过大。`Babel` 对一些公共方法使用了非常小的辅助代码, 比如 `_extend`.默认情况下会被添加到每一个需要它的文件中, 所以会导致打包文件体积过大.解决办法: 引入`babel runtime`作为一个单独的模块, 来避免重复。也就是可以使用`@babel/plugin-transform-runtime`和`babel-runtime`。
