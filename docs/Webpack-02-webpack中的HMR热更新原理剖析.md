原文链接: [https://interview.poetries.top/principle-docs/webpack/02-webpack%E4%B8%AD%E7%9A%84HMR%E7%83%AD%E6%9B%B4%E6%96%B0%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90.html](https://interview.poetries.top/principle-docs/webpack/02-webpack%E4%B8%AD%E7%9A%84HMR%E7%83%AD%E6%9B%B4%E6%96%B0%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90.html)

`Hot Module Replacement`（以下简称 `HMR`）是 `webpack` 发展至今引入的最令人兴奋的特性之一
，当你对代码进行修改并保存后，`webpack`
将对代码重新打包，并将新的模块发送到浏览器端，浏览器通过新的模块替换老的模块，这样在不刷新浏览器的前提下就能够对应用进行更新。

> 基本实现原理大致这样的，构建 `bundle` 的时候，加入一段 `HMR runtime` 的 js 和一段和服务沟通的 js 。文件修改会触发
> `webpack` 重新构建，服务器通过向浏览器发送更新消息，浏览器通过 `jsonp` 拉取更新的模块文件，`jsonp` 回调触发模块热替换逻辑

### 热更新配置

> 使用`webpack-dev-server`,设置 `hot` 属性为 `true.`写模块时，按照以下写法:
```js
    if (module.hot) { //判断是否有热加载
        module.hot.accept('./hmrTest.js', function() { //热加载的模块路径
            console.log('Accepting the updated printMe module!'); //热加载的回调，即发生了模块更新时，执行什么 callback
            printMe();
        })
    }
```

  * 缺点：更新逻辑得自己写。比如要使页面显示的内容生效，需要在回调中写入`document.append(xxx)`

> `react` 的热加载，使用 `react-hot-loader`
```javascript
    import { hot } from'react-hot-loader';
        const Record = ()=>{
            ...
        }
        exportdefault hot(module)(Record);
    或
    
        if (module.hot) {
            module.hot.accept('./App', function () {
                var NextApp = require('./App')
                ReactDOM.render(<NextApp />, rootEl)
            })
        }
```

### 实现过程

  * `watch` 编译过程、`devServer` 推送更新消息到浏览器
  * 浏览器接收到服务端消息做出响应
  * 对模块进行热更新或刷新页面

### watch 编译过程、devServer 推送更新消息到浏览器

  1. `webpack-dev-server` 里引用了 `webpack-dev-middleware`，相关的 `watch` 逻辑就是在里面实现的
```js
    //webpack-dev-server/lib/Server.js
    setupDevMiddleware() {
        this.middleware = webpackDevMiddleware(
            this.compiler,
            Object.assign({}, this.options, { logLevel: this.log.options.level })
        );
    }
    // webpack-dev-middleware/index.js
    if (!options.lazy) {
        context.watching = compiler.watch(options.watchOptions, (err) => {
        ...
        });
    }
```

> 以上代码可以看出，`webpack-dev-middleware` 是通过调用 `webpack` 的 `api` 对文件系统 `watch`
> 的。`watchOptions`
> 如果没有配置的话，会取默认值。值的含义见：https://webpack.js.org/configuration/watch/

  2. 当文件发生变化时，重新编译输出 `bundle.js`。`devServer` 下，是没有文件会输出到 `output.path` 目录下的，这时 `webpack` 是把文件输出到了内存中。`webpack` 中使用的操作内存的库是 `memory-fs`，它是 `NodeJS`原生 `fs` 模块内存版(`in-memory`)的完整功能实现，会将你请求的`url`映射到对应的内存区域当中，因此读写都比较快
```js
    // webpack-dev-middleware/lib/fs.js
    fileSystem = fs;
    } elseif (isMemoryFs) {
        fileSystem = compiler.outputFileSystem;
    } else {
        fileSystem = new MemoryFileSystem();
        compiler.outputFileSystem = fileSystem;
    }
```

  3. `devServer` 通知浏览器端文件发生改变，在启动 `devServer` 的时候，`sockjs` 在服务端和浏览器端建立了一个 `webSocket` 长连接，以便将 `webpack` 编译和打包的各个阶段状态告知浏览器，最关键的步骤还是 `webpack-dev-server` 调用 `webpack api` 监听 `compile`的 `done` 事件，当`compile` 完成后，`webpack-dev-server`通过 `_sendStatus` 方法将编译打包后的新模块 `hash` 值发送到浏览器端
```js
    // webpack-dev-server/lib/Server.js
    const addHooks = (compiler) => {
        ...
        done.tap('webpack-dev-server', (stats) => {
            this._sendStats(this.sockets, this.getStats(stats));
            this._stats = stats;
        });
    };
    ...
    _sendStats(sockets, stats, force) {
        ...
        this.sockWrite(sockets, 'hash', stats.hash);
        if (stats.errors.length > 0) {
            this.sockWrite(sockets, 'errors', stats.errors);
        } elseif (stats.warnings.length > 0) {
            this.sockWrite(sockets, 'warnings', stats.warnings);
        } else {
            this.sockWrite(sockets, 'ok');
        }
    }
```

### 浏览器接收到服务端消息做出响应

  1. 这里的主要逻辑位于 `webpack-dev-server/client-src` 中，`webpack-dev-server` 修改了`webpack` 配置中的 `entry` 属性，在里面添加了 `webpack-dev-client` 的代码，这样在最后的 `bundle.js` 文件中就会有接收 `websocket` 消息的代码了
```js
    //webpack-dev-server/lib/utils/addEntries.js
    let hotEntry;
    if (options.hotOnly) {
        hotEntry = require.resolve('webpack/hot/only-dev-server');
    } elseif (options.hot) {
        hotEntry = require.resolve('webpack/hot/dev-server');
    }
    ...
    if (hotEntry && checkInject(options.injectHot, config, true)) {
        additionalEntries.push(hotEntry);
    }
    config.entry = prependEntry(config.entry || './src', additionalEntries);
```

  2. 以上代码可以看出，如果选择了热加载，输出的 `bundle.js` 会包含接收 `websocket` 消息的代码。而且 plugin 也会注入一个 `HotModuleReplacementPlugin`，构建过程中热加载相关的逻辑都在这个插件中。这个插件主要处理两部分逻辑：

  * 注入 `HMR runtime` 逻辑
  * 找到修改的模块，生成一个补丁 `js` 文件和更新描述 `json` 文件

先看一张图，看看 websocket 中的消息长什么样子：

![](/images/s_poetries_work_gitee_2020_07_71.png)

> 可以看到，接收的消息只有 `type` 和 `hash` 两个内容。在 `client` 里面的逻辑，他们分别对应不同的处理逻辑：
```js
    // webpack-dev-server/client-src/default/index.js
    hash(hash) {
        status.currentHash = hash;
    },
    ...
    ok() {
            sendMessage('Ok');
        if (options.useWarningOverlay || options.useErrorOverlay) {
            overlay.clear();
        }
        if (options.initial) {
            return (options.initial = false);
        } // eslint-disable-line no-return-assign
        reloadApp(options, status);
    }
```

  3. 可以看出，当接收到 `type` 为 `hash` 消息后会将 `hash` 值暂存起来，当接收到 `type` 为 `ok` 的消息后对应用执行 `reload` 操作，而 `hash` 消息是在 `ok` 消息之前的。再看看 `reload` 里面的处理逻辑：
```js
    // webpack-dev-server/client-src/default/reloadApp.js
    if (hot) {
        ...
        const hotEmitter = require('webpack/hot/emitter');
            hotEmitter.emit('webpackHotUpdate', currentHash);
        if (typeof self !== 'undefined' && self.window) {
            self.postMessage(`webpackHotUpdate${currentHash}`, '*');
        }
    }
```

  4. 可以看出，如果配置了模块热更新，就调用 `webpack/hot/emitter` 将最新 `hash` 值发送给 `webpack`，然后将控制权交给 `webpack` 客户端代码。如果没有配置模块热更新，就进行 `liveReload` 的逻辑。`webpack/hot/dev-server` 中会监听 `webpack-dev-server/client-src` 发送的 `webpackHotUpdate` 消息,然后调用 `webpack/lib/HotModuleReplacement.runtime` 中的 `check` 方法，检测是否有新的更新：
```js
    // webpack/hot/dev-server.js
    var hotEmitter = require("./emitter");
        hotEmitter.on("webpackHotUpdate", function(currentHash) {
            lastHash = currentHash;
            if (!upToDate() && module.hot.status() === "idle") {
                log("info", "[HMR] Checking for updates on the server...");
                check();
            }
        });
        
    // webpack/lib/HotModuleReplacement.runtime
        function hotCheck(apply) {
        ...
            return hotDownloadManifest(hotRequestTimeout).then(function(update) {
                ...
                    hotEnsureUpdateChunk(chunkId);
                ...
                return promise;
            });
        }
```

  5. 以上代码可以看出，在 `check` 过程中，主要调用了两个方法 `hotDownloadManifest` 和 `hotDownloadUpdateChunk`。`hotDownloadManifest` 是通过 `Ajax` 向服务器请求十分有更新的文件，如果有就返回对应的文件信息，`hotDownloadUpdateChunk` 是通过`Jsonp`的方式，请求最新的代码模块。如下图所示:

![](/images/s_poetries_work_gitee_2020_07_72.png)
![](/images/s_poetries_work_gitee_2020_07_73.png)

> 补充，这两个文件的名称是可以配置的，如果没有配置，则取定义在 `WebpackOptionsDefaulter` 中的默认配置。
```js
    this.set("output.hotUpdateChunkFilename", "[id].[hash].hot-update.js");
    this.set("output.hotUpdateMainFilename", "[hash].hot-update.json");
```

### 对模块进行热更新或刷新页面

> 综上，我们获得了更新的内容。接下来就可以进行更新了。这部分的逻辑在 `webpack/lib/HotModuleReplacement.runtime`
> 中。

  1. 首先，更新过的模块，现在都属于 `outdate`d 的模块，所以先找出过期的模块及其依赖:
```js
    //webpack/lib/HotModuleReplacement.runtime  
    function getAffectedStuff(updateModuleId) {
      var outdatedModules = [updateModuleId];
      var outdatedDependencies = {};
      ...
      return {
          type: "accepted",
          moduleId: updateModuleId,
          outdatedModules: outdatedModules,
          outdatedDependencies: outdatedDependencies
      };
    }
```

  2. 根据调用的 `Api` 信息，对结果进行标注及处理。
```js
    switch (result.type) {
      case"self-declined":
          ...
          break;
      case"declined":
          ...
          break;
      case"unaccepted":
          ...
          break;
      case"accepted":
          if (options.onAccepted) options.onAccepted(result);
          doApply = true;
          break;
      case"disposed":
          if (options.onDisposed) options.onDisposed(result);
          doDispose = true;
          break;
    }
```

  3. 从缓存中删除过期的模块和依赖
```js
    // remove module from cache
      delete installedModules[moduleId];
    
      // when disposing there is no need to call dispose handler
      delete outdatedDependencies[moduleId];
    
      // remove "parents" references from all children
      for (j = 0; j < module.children.length; j++) {
          ...
      }
      // remove outdated dependency from module children
    var dependency;
    var moduleOutdatedDependencies;
    for (moduleId in outdatedDependencies) {
      ...
    }
```

  4. 将新的模块添加到 `modules` 中，当下次调用 `webpack_require` (`webpack` 重写的 `require` 方法)方法的时候，就是获取到了新的模块代码了。
```js
    // insert new code
    for (moduleId in appliedUpdate) {
      if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
        modules[moduleId] = appliedUpdate[moduleId];
      }
    }
```

> 最后就是错误的兼容了，如果热加载失败，将会刷新浏览器。

阅读全文

