---
title: "Babel环境搭建和基本配置"
---

# 15 Babel环境搭建和基本配置

  * `.babelrc`配置
  * `presets`和`plugins`
```json
      "devDependencies": {
        "@babel/cli": "^7.7.5",
        "@babel/core": "^7.7.5",
        "@babel/plugin-transform-runtime": "^7.7.5",
        "@babel/preset-env": "^7.7.5"
      },
      "dependencies": {
        "@babel/polyfill": "^7.7.0",
        "@babel/runtime": "^7.7.5"
      }
```  
```js
    // .babelrc
    
    {
        "presets": [
            [
                "@babel/preset-env", // 一堆plugins的集合，包含常用的plugins
                {
                    "useBuiltIns": "usage", // 按需引入babel-polyfill
                    "corejs": 3 // corejs版本3
                }
            ]
        ],
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                    "absoluteRuntime": false,
                    "corejs": 3,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": false
                }
            ]
        ]
    }
```  
```js
    // 运行编译代码
    npx babel src/index.js
```
