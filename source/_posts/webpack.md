---
tags:
- webpack
---
前言
-----------
>本质上，[webpack] 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 [webpack] 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

<!--more-->
在开始使用 [webpack] 前，需要了解 [webpack] 的四个核心概念：
* **入口（entry）**：**入口起点（entry point）**指示了 [webpack] 要解析的源码模块，[webpack] 会解析这些模块并构建出其内部 *依赖图*，最后将完整的依赖输出到 bundle 文件中。

&ensp;&ensp; 可以通过在 [webpack 配置](https://www.webpackjs.com/configuration)中配置 `entry` 属性，来指定一个入口起点（或多个入口起点）。默认值为 `./src`。

**单入口配置**：
```
// webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
**多入口配置**：
```
// webpack.config.js
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js', // 入口1
    pageTwo: './src/pageTwo/index.js', // 入口2
    pageThree: './src/pageThree/index.js' // 入口3
  }
};
```
更多配置内容，请参考：[*入口起点*](https://www.webpackjs.com/concepts/entry-points)

* **输出（output）**：output 属性指定 [webpack] 输出 bundles 路径，以及命名规则。默认值为 `./dist`。

&ensp;&ensp; output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist

&ensp;&ensp; 可以通过配置 `output` 字段来配置输出的 bundle 文件：
```
//webpack.config.js
const path = require('path'); // 使用 nodejs 的 path 库

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // 工程根目录的 dist 文件夹
    filename: 'my-first-webpack.bundle.js' // 输出 bundle 名字
  }
};
```
更多配置选择，请参考：[*输出*](https://www.webpackjs.com/configuration/output/)


* **loader**：[webpack] 本身只能处理 JavaScript 文件，对于那些非 JavaScript 的文件，则可以通过自定义 loader 来将其转换成 [webpack] 能够识别并进行处理的模块。

&ensp;&ensp; 比如，在 [webpack] 打包前，loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

&ensp;&ensp; 本质上，loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

在 [webpack] 中， 配置 loader 主要使用以下两个选项：

* **`test` 属性**：标识 loader 要处理的文件类型；
* **`use` 属性**：表示进行转换时，应该使用哪个 loader；
```
//webpack.config.js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```
上述配置中，指定了 webpack 编译器在 `require()` 或 `import` 导入 **txt** 文件时，先使用 **raw-loader** 进行转换，然后再打包。

**注**：loader 支持链式传递。一组链式的 loader 将按照**相反的顺序**执行。loader 链中的第一个 loader 返回值给下一个 loader（简而言之，loader 的执行顺序与配置相反，最后配置的 loader 最先执行）。

更多 loader 的配置，请参考：[*loader*](https://www.webpackjs.com/concepts/loaders/)

更多内置 loader，请查看：[*loaders*](https://www.webpackjs.com/loaders/)

更多第三发 loader，请查看：[*awesome-webpack*](https://github.com/webpack-contrib/awesome-webpack#loaders)


* **插件（plugins）**：loader 是在打包构建过程中用于处理某些类型的模块转换，而插件的能力更大，其在整个构建过程中起作用，可以执行范围更广的任务，比如打包优化和压缩 bundle 文件，甚至于重新定义环境中的变量。

&ensp;&ensp; 这样说吧，loader 就是在构建前对某些特定类型的文件进行预处理，而插件是在构建过程中能做任何事情（应该可以这样认为，loader 其实就是一个小型的插件，其只能对某些特定文件进行预处理。而插件的目的就在于解决 loader 无法处理的事情）。

&ensp;&ensp; 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 new 操作符来创建它的一个实例。
```
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
[webpack] 提供许多开箱可用的插件！查阅我们的 [*插件列表*](https://www.webpackjs.com/plugins) 获取更多信息。

更多第三方插件，请查看 [*awesome-webpack*](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins) 列表。


更多插件配置信息，请参考：[*插件（plugins）*](https://www.webpackjs.com/concepts/plugins/)


安装
---------------
1. 首先安装 [Node.js][nodejs]

2. 本地安装 [webpack]
```
npm install webpack  --save-dev 
npm install webpack-cli --save-dev 
```
**注**：也可以全局安装 [webpack]：`npm install --global webpack`。但是不推荐。

快速入门
--------------
**例子**：要求在 `src/index.js` 中为 `document.body` 添加一个 `div` 子节点，该 `div` 子节点内容为：`"Hello,Webpack"`（要求使用第三方模块 `lodash` 实现字符串拼接）。最后使用 [webpack] 将 `src/index.js` 模块内容打包到 `dist/index.js` 中，`dist/index.html` 引用该生成的 bundle 实现页面动态添加 `div` 子节点功能。

**实践**：
1. 首先创建目录结构，如下所示：
```
  webpackDemo
+ |- /dist
+   |- index.html
+ |- /src
+   |- index.js
```

2. 本地安装 [webpack]
```
npm install webpack webpack-cli --save-dev
```

3. 创建一个 `package.json` 文件：
```
npm init -y
```

4. 根目录下创建 [webpack] 默认配置文件：**webpack.config.js**，并配置其入口起点为：`src/index.js`，打包生产的 bundle 文件为：`dist/index.js`：
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

5. 安装 `lodash`
```
npm install lodash --save-dev
```

6. 编写 `src/index.js` 代码：
```javascript
import _ from 'lodash'

function createDiv(){
    let div = document.createElement('div');
    div.innerHTML = _.join(['Hello',',','Webpack']);
    return div;
}

document.body.appendChild(createDiv());
```

7. 进行打包，打包完成后即可看到 `dist/index.js` 生成：
```
npx webpack
```

8. 手动将生成的 `dist/index.js` 引入到 `dist/index.html` 中，打开浏览器，即可看到效果：
```
<!DOCTYPE html>
<html>
    <head>
        <title>Webpcak Demo</title>
    </head>
    <body>
        <script src="index.js"></script>
    </body>
</html>
```


一些有用配置
------------------
* [**模式(mode)**][mode]：提供 `mode` 配置选项，区分生成环境，告知 webpack 使用相应模式的内置优化。其选择有两个值可选：`development`，`production`
```
module.exports = {
  mode: 'production'
};
```

* **基础配置**：生产环境 + 入口 + 出口
```
// webpack.config.js
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```

* [**resolve.alias**](https://www.webpackjs.com/configuration/resolve/#resolve-alias)：创建 `import` 或 `require` 的别名，来确保模块引入变得更简单。例如，一些位于 `src/` 文件夹下的常用模块：
```
alias: {
  Utilities: path.resolve(__dirname, 'src/utilities/'),
  Templates: path.resolve(__dirname, 'src/templates/')
}
```
像未配置前需要使用全路径或相对路径引入：
```
import Utility from '../../utilities/utility';
```
在配置后，就可以使用别名进行导入：
```
import Utility from 'Utilities/utility'; // 注意使用的是别名：Utilities
```

* **[watch]**：webpack 可以监听文件变化，当它们修改后会重新编译。`watch` 默认为关闭。
```
watch: true
```
还可以通过 `watchOptions` 来进一步控制 `watch` 模式的选项：
```
watchOptions: {
  aggregateTimeout: 300, // 文件更改后，300毫秒后进行重新构建
  poll: 1000, // 轮询时间，每 1s 进行一次检测
  ignored: /node_modules/  // 不监听 node_modules 目录
}
```

* [**外部扩展（externals）**][externals]：防止将某些 `import` 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

&ensp;&ensp; 例如，从 CDN 引入 [jQuery](https://jquery.com/)，而不是把它打包：
```html
<!-- index.html -->
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```
```
// webpack.config.js
externals: {
  jquery: 'jQuery'
}
```
这样就剥离了那些不需要改动的依赖模块，换句话，下面展示的代码还可以正常运行：
```
import $ from 'jquery';
$('.my-element').animate(...);
```
像上述配置了 `jquery` 为外部依赖后，[webpack] 编译器在遇到：`import $ from 'jquery';` 时，就知道了应该排除掉 `jquery` 模块，不将其打包进 bundle 中。

* [**构建目标（targets）**][targets]：使用 `target` 属性可以配置 [webpack] 生成服务器端或者是浏览器端的 JavaScript 代码。
```
// webpack.config.js
module.exports = {
  target: 'node' // 生成服务器端代码
};
```
如果想同时生成多个 Target，可以如下配置：
```
// webpack.config.js
var path = require('path');
var serverConfig = {
  target: 'node',    // 生成服务器端代码
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

var clientConfig = {
  target: 'web', // <=== 默认是 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ]; // 导出两个 bundle
```

[管理资源][asset-management]
--------------------
* **加载 CSS 文件**：需要使用 [style-loader] 和 [css-loader]。

**安装**：
```
npm install style-loader css-loader --save-dev 
```
**配置**：
```
 const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```
**使用**：
1. 现在 `src/` 目录下新建一个 style.css 文件：
```
// style.css
.container {
    color: red;
}
```
2. 修改入口文件：`src/index.js`：
```javascript
import _ from 'lodash';
+ import './style.css'

function createDiv(){
    let div = document.createElement('div');
    div.innerHTML = _.join(['Hello','Webpack'],',');
+    div.classList.add('container')
    return div;
}

document.body.appendChild(createDiv());
```
3. 最后重新打包即可看到效果：`npx webpack`

* **抽离 CSS 文件为单独文件**：前面使用 [style-loader] 最终会将 css 样式注入到页面的 `<head>` 内的 `style` 节点中，即为内部样式表。我们更希望使用的是外部样式表，即通过 `<link>` 标签进行引入，那么通过使用 [mini-css-extract-plugin] 插件即可实现。

**安装**：
```
npm install mini-css-extract-plugin --save-dev 
```
**配置**：
```

const path = require('path');
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'; // 判断当前环境是开发环境还是 部署环境，主要是 mode属性的设置值。

module.exports = {
  module: {
    rules: [
+      {
+        test: /\.(sa|sc|c)ss$/,
+        use: [MiniCssExtractPlugin.loader, 'css-loader']
+      },
    ]
  },
+  plugins: [
+    new MiniCssExtractPlugin({
+      filename: devMode ? '[name].css' : '[name].[hash].css', // 设置最终输出的文件名
+      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
+    })
+  ]
};
```
**使用**：重新打包后，可在浏览器查看是否以外部链接引入样式表。

**注**：由于抽取了样式，因此不再使用 [style-loader] 注入到 html 中了。

* **加载 Sass 文件**：需要使用 [sass-loader]

**安装**：
```
npm install sass-loader node-sass webpack --save-dev
```
**配置**：
```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
+        use: [MiniCssExtractPlugin.loader, 'css-loader',sass-loader]
      },
    ]
  },
};
```

* **加载图片**：需要使用 [file-loader]。

**安装**：
```
npm install file-loader  --save-dev 
```
**配置**：
```
const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
  };
```
**使用**：只需向项目中增加一张图片。比如，在 style.css 中，引入一张图片：
```
.container {
    width: 400px;
    height: 400px;
    color: red;
    background: url('../static/img/horse.png');
}
```
最后，重新打包一下即可看到效果：`npx webpack`

* **图片压缩和优化**：需要使用 [image-webpack-loader]。

**安装**：
```
npm install image-webpack-loader --save-dev
```
**配置**：
```
 const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',
+           {
+             loader: 'image-webpack-loader',
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }
      ]
    }
  };
```
**使用**：重新打包一下，可以看到生成一张已被压缩的图片。

* **将图片转换为 base64 编码**：需要使用 [url-loader]，同时 [url-loader] 可以替换 [file-loader]，其比 [file-loader] 多了将图片编码为 base64 的功能。

**安装**：
```
npm install url-loader --save-dev
```
**配置**：
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico|woff|woff2|eot|ttf|otf)$/,
        use: [
+          {
+            loader: 'url-loader', // 根据图片大小，把图片优化成base64
+            options: {
+              limit: 10000  // 图片小于 10000 字节时，进行 base64 编码
+            }
+          },
          {
            loader: 'image-webpack-loader', // 先进行图片优化
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  }
};
```
**使用**：重新打包后，只要图片小于 10000 字节的，就会被转换成 base64 编码的 DataURL。

**注**：[file-loader] 和 [url-loader] 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。

[管理输出][output-management]
------------------------
前面的操作我们都是手动地对 `index.html` 文件进行管理，但随着项目的增大，手动管理方式将繁琐且容易出错，因此急需一个自动注入资源的方法，这种操作可以通过插件进行完成。

* **自动注入资源**：可以使用 [html-webpack-plugin] 将打包生成的 bundle 自动注入到 `index.html` 中。

**安装**：
```
npm install html-webpack-plugin --save-dev 
```
**配置**：
```
// webpack.config.js
const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
+    app: './src/index.js' // 为入口起点增加命名
  },

  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
+  plugins: [
+    new HtmlWebpackPlugin({
+      title: 'Output Management', // 默认值：Webpack App
+      filename: 'index.html', // 默认值： 'index.html'
+      minify: {
+        collapseWhitespace: true,
+        removeComments: true,
+        removeAttributeQuotes: true // 移除属性的引号
+      }
+    })
+  ]
};
```
**使用**：安装上述配置，打包完成后，[html-webpack-plugin] 插件就会自动把生成的 js 文件插入到 `dist/index.html` 文件中。

* **清理 `/dist` 文件夹**：通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法，因此只会生成用到的文件。需要用到插件 [clean-webpack-plugin]。

**安装**：
```
npm install clean-webpack-plugin --save-dev
```
**配置**：
```

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },

  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
+    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
	...
    })
  ]
};
```
**使用**：上述配置完成后，以后每次打包，`/dist` 目录都会先进行清理，打包后就只生成需要使用到的文件了。

[开发环境搭建][development]
--------------------------------------------
在开发过程中，我们编写的源代码一般有多个，最后交由 [webpack] 打包成单独一个 bundle。因此，如果出现错误，错误显示在 bundle 中，就无法直接定位到我们自己的错误代码中。所以，在开发环境（`development`）中，需要对 [webpack] 进行一些配置，方便我们进行开发。

* **使用 source map**：为了更容易地追踪错误和警告，JavaScript 提供了 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。
**配置**：开启 source map
```
module.exports = {
	devtool: 'inline-source-map',
};
```

* **使用观察模式**：每次我们修改源码后，都需要使用 `npx webpack` 进行手动打包，不免繁琐了点。可以通过配置 webpack "watch" 自动监视文件更改，自动进行编译打包。
**配置**：启动 "watch" 的方法为控制台输入：`npx webpack --watch`，也可以将该命令配置到 `package.json` 的 `scripts` 中，启动一个脚本命令：
```
// package.json
{
  ···
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
+    "start": "npx webpack --watch"
  },
  ···
}
```
**使用**：控制台输入：`npm run watch`

* **使用 webpack-dev-server**：webpack "watch" 可以自动进行打包，但是浏览器端我们还是需要手动进行刷新才能看到修改效果。如果我们也想让浏览器实时监测文件修改，自动刷新，则可以使用 webpack-dev-server。

**安装**：
```
npm install  webpack-dev-server --save-dev
```
**配置**：
```
module.exports = {
	devServer: {
		contentBase: './dist'  // 监听目录变化，实时重载
	},
};
```
**使用**：通过在 `package.json` 中配置一个脚本命令进行启动：`npm run hotload`
```
// package.json
{
  ···
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    "start": "npx webpack --watch",
+    "hotload": "webpack-dev-server --open"
  },
  ···
}
```
[生产环境搭建][production]
---------------------------------------
在生产环境（`production`）中，我们的目标是倾向于生成更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。
因此，可通过以下配置来输出更好匹配生产环境的 bundle。

* **压缩 CSS**：需要使用插件：[optimize-css-assets-webpack-plugin]

**安装**：
```
npm i -D optimize-css-assets-webpack-plugin
```
**配置**：
```
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
+ const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
+  mode: 'production',
+  optimization: {
+    minimizer: [new OptimizeCSSAssetsPlugin({})]
+  },
...
};
```

* **压缩 JavaScript**：需要的插件：[uglifyjs-webpack-plugin]，此插件只在 `mode: ’production’` 下起作用。

**安装**：
```
npm i -D uglifyjs-webpack-plugin
```
**配置**：
```
+ const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
+      new UglifyJsPlugin({
+        cache: true,
+        parallel: true,
+        sourceMap: true // set to true if you want JS source maps
+      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};
```

[区分开发环境和生产环境][production]
------------------------------------
开发环境（`development`）和生产环境（`production`）的构建目标差异很大。两者的构建目标既存在相同部分，也存在不同之处。因此，通常会为每个环境编写 **彼此独立的 webpack 配置**，对于两者皆有的配置，则抽取到一个公共的配置文件中即可。这种分文件配置方法可通过插件 [webpack-merge] 完成。

**安装**：
```
npm install webpack-merge --save-dev
```
**配置**：具体配置详情如下：

* 新建一个文件：**webpack.common.js**。作为开发环境和生产环境公共配置文件：
```
// webpack.common.js
const path = require('path');
// 清理 /dist
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 注入资源到 html
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

* 新建一个文件：**webpack.dev.js**。作为开发环境的配置文件：
```
// webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// merge 第二参数的配置会覆盖第一个参数相同的配置
module.exports = merge(common, {
  // 使能 source map
  devtool: 'inline-source-map',
  // 使能 webpack-dev-server，浏览器自动重载
  devServer: {
    contentBase: './dist' // 监听目录内容改变
  }
});
```

* 新建一个文件：**webpack.prod.js**。作为生产环境的配置文件：
```
```





参考
------------
* [webpack 官网][webpack]

* [webpack 中文网][webpack-china]

* [webpack 入门教程] 



[webpack]:https://webpack.js.org/

[webpack-china]:https://www.webpackjs.com/

[webpack 入门教程]:https://malun666.github.io/aicoder_vip_doc/#/pages/vip_2webpack?id=webpack-入门教程

[mode]:https://www.webpackjs.com/concepts/mode/

[watch]:https://www.webpackjs.com/configuration/watch/

[externals]:https://www.webpackjs.com/configuration/externals/

[targets]:https://www.webpackjs.com/concepts/targets/

[nodejs]:https://nodejs.org/

[asset-management]::https://www.webpackjs.com/guides/asset-management/

[style-loader]:https://www.webpackjs.com/loaders/style-loader

[css-loader]:https://www.webpackjs.com/loaders/css-loader

[file-loader]:https://www.webpackjs.com/loaders/file-loader

[image-webpack-loader]:https://github.com/tcoopman/image-webpack-loader

[url-loader]:https://www.webpackjs.com/loaders/url-loader/

[output-management]:https://www.webpackjs.com/guides/output-management/

[html-webpack-plugin]:https://www.webpackjs.com/plugins/html-webpack-plugin

[clean-webpack-plugin]:https://www.npmjs.com/package/clean-webpack-plugin

[development]:https://www.webpackjs.com/guides/development/

[production]:https://www.webpackjs.com/guides/production/

[mini-css-extract-plugin]:https://github.com/webpack-contrib/mini-css-extract-plugin

[webpack-merge]:https://github.com/survivejs/webpack-merge
