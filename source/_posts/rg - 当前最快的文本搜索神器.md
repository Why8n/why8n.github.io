---
categories: tools
tags:
- rg
---

前言
--------------
之前有写过一篇文本搜索工具简单使用博文：[ag - the Silver Searcher]，后来发现 [ag] 在 Windows 下搜索结果中文显示乱码，官方至今一直仍未解决。

并且现在，又出现了一款更加优秀的文本搜索神器：[rg]，稍微试了一下，速度很快，跨平台并且支持中文，很符合本人需求。

下面就简单介绍下 [rg] 及其最常用的几项选项。

简介
--------------
>依据正则匹配递归搜索目录

依据给定的正则表达式，rg 以面向行为单位的模式进行递归搜索。默认情况下，rg 会尊重你的`.gitignore`配置以及自动忽略隐藏文件/目录和二进制文件。

rg 具有以下一些特性：
* 自动递归搜索目录（相当于：`grep -R`）
* 自动高亮匹配结果
* 默认自动忽略`.gitignore`指定的文件，隐藏文件和二进制文件
* 可以搜索指定文件类型
* 支持`grep`大部分常用特性
* 支持各种文件编译（UTF-8， UTF-16， latin-1, GBK, EUC-JP, Shift_JIS 等等）
* 支持搜索常见压缩文件（gzip，xz，lzma，bzip2，lz4）
* 不支持多行搜索和花哨的正则


用法
-------------
*****格式：**

```dos
USAGE:

    rg [OPTIONS] PATTERN [PATH ...]
    rg [OPTIONS] [-e PATTERN ...] [-f PATTERNFILE ...] [PATH ...]
    rg [OPTIONS] --files [PATH ...]
    rg [OPTIONS] --type-list
    command | rg [OPTIONS] PATTERN
```
举个例子：
```shell
rg RxJava  // 递归搜索当前目录内含 RxJava 的文件
rg install ReadMe.md // 在 ReadMe.txt 中搜索字符串 install
```

常用选项简介
----------------
* *输出选项**

>-g, --glob <GLOB>...                    
        Include or exclude files and directories for searching that match the given
        glob. This always overrides any other ignore logic. Multiple glob flags may be
        used. Globbing rules match .gitignore globs. Precede a glob with a ! to exclude
        it.
正则匹配添加或排除搜索某些类型文件或目录。在`glob`之前加上一个`!`表示排除搜索。

eg：在当前目录搜索`require('uglifyjs-webpack-plugin')`：
```
rg -F "require('uglifyjs-webpack-plugin')" -g "*.md"  // 搜索所有`.md`文件
rg -F "require('uglifyjs-webpack-plugin')" -g "!*.md" // 不搜索`.md`文件
```

>`--iglob <GLOB>`：同`-g, --glob <GLOB>`,但忽略大小写。

>-l, --files-with-matches                
        Only print the paths with at least one match.
只打印匹配内容的文件名。

>`-v, --invert-match`：Invert matching. Show lines that do not match the given patterns.
反向匹配。


>`-C/--context [Lines]`: Show the lines surrounding a match.
输出匹配内容前后[ LINES ]行内容

eg：搜索`require('uglifyjs-webpack-plugin')`，输出该行前后各2行内容：
```
rg -C 2 "require\('uglifyjs-webpack-plugin'\)" // 括号需要转义
```

>`-F, --fixed-strings`: Treat the pattern as a literal string instead of a regular expression.
        When this flag is used, special regular expression meta characters such as `.(){}*+`
        do not need to be escaped.
将匹配字符作为字符串，而不是正则表达式。也就是匹配字符`.(){}*+`无须进行转义。

eg：搜索`require('uglifyjs-webpack-plugin')`，输出该行前后各2行内容：
```
rg -C 2 -F "require('uglifyjs-webpack-plugin')" ./   // 括号无须转义
```

>`--max-depth <NUM>`: Limit the depth of directory traversal to NUM levels beyond the paths given. A
    value of zero only searches the explicitly given paths themselves.
    
    For example, 'rg --max-depth 0 dir/' is a no-op because dir/ will not be
    descended into. 'rg --max-depth 1 dir/' will search only the direct children of
    'dir'.
限制文件夹递归搜索深度。`rg --max-depth 0 dir/`则不执行任何搜索；`rg --max-depth 1 dir/`只在`dir/`当前目录中进行搜索。



>`-M/--max-columns`: Limit the length of lines printed by ripgrep.
限制输出最大行数。

>`--files`: Print the files that ripgrep would search, but don't actually search them.
打印会进行查找的文件，该选项并不会执行实际查询操作。格式：`rg [OPTIONS] --files [PATH ...]`,此处不能加`pattern`。i

eg：打印当前文件会进行查找的文件：
```
rg --files . // 列出当前文件夹会进行查询的所有文件
```
**注**：该选项其实可相当于：`find . -type f`，查找当前目录所有文件

>`-c/--count`: Report a count of total matched lines.
计算匹配文件数量


>`--debug`: Shows ripgrep's debug output. This is useful for understanding why a particular file might be ignored from search, or what kinds of configuration ripgrep is loading from the environment.
显示调试信息。有利于了解某一个具体文件被忽略的原因，或者 rg 从环境变量中加载了什么配置。

* *输入选项**

>`-e, --regexp <PATTERN>`: A pattern to search for. This option can be provided multiple times, where
        all patterns given are searched. Lines matching at least one of the provided
        patterns are printed. This flag can also be used when searching for patterns
        that start with a dash.
        
        For example, to search for the literal '-foo', you can use this flag:
        
            rg -e -foo
        
        You can also use the special '--' delimiter to indicate that no more flags
        will be provided. Namely, the following is equivalent to the above:
        
            rg -- -foo
使用正则搜索。

**注**：rg 本身就支持正则表达式，`-e`主要用于匹配前缀带`-`的字符串 或者 想匹配多个字符串（多次使用该选项即可）。

eg：搜索内容包含`startXXXend`的字符串：
```
rg -e "start.*end" .  // 这样，`startXXXend`，`XXXstartendXXX`，`XXXstartXXXend`，`XXXstartXXXendXXX`都会匹配
``` 

>`-i/--ignore-case`: When searching for a pattern, ignore case differences. That is `rg -i fast` matches `fast`, `fASt`, `FAST`, etc.
忽略大小写

>`-S/--smart-case`: This is similar to `--ignore-case`, but disables itself if the pattern contains any uppercase letters. Usually this flag is put into alias or a config file.
打开智能大小写，通常该选项相当于`--ignore-case`,但在输入大写时，则取消忽略大小写功能。

>`-w/--word-regexp`: Require that all matches of the pattern be surrounded by word boundaries. That is, given `pattern`, the `--word-regexp` flag will cause ripgrep to behave as if `pattern` were actually `\b(?:pattern)\b`.
打开单词边界，只进行单词匹配。

>`-a/--text`: Search binary files as if they were plain text.
搜索二进制文件（将二进制文件看出文本文件）

>`--hidden`:Search hidden files and directories. By default, hidden files and directories
    are skipped. Note that if a hidden file or a directory is whitelisted in an
    ignore file, then it will be searched even if this flag isn't provided.
搜索隐藏文件。默认不搜索隐藏文件，如果隐藏文件处于配置白名单中，则会进行搜索，无须显示提供该选项。



其他
-------------
* *****自动过滤********：前面说过，rg 在递归搜索时，会自动过滤`.gitignore`匹配规则，忽略隐藏文件和目录，忽略二进制文件和链接。
但所有这些过滤都可以通过各自指定标记进行消除：
1）`--no-ignore/-u`：不响应`.gitignore`的匹配规则
2）`--hidden/-uu`：搜索隐藏文件和目录
3）`-a/--text/-uuu`：搜索二进制文件
4）`-L/--folow`：追踪链接文件

* **手动过滤:globs（`-g, --glob`）**：手动过滤会议于`.gitignore`·一样的模式被j解析，也就是，位于后面的 glob 会替换前面的 glob。
举个例子：`rg clap -g "*.toml" -g "!*.toml"`，其实相当于：`rg clap -g "!*.toml"`，也就是不会搜索`.toml`文件了。

* **手动过滤：文件类型（`-g, --glob`）**：使用上述 **globs** 模式其实就能实现文件类型的过滤了，但每次都写`-g "*.xxx"`太繁琐了，为此，rg 已为我们内置了另一个直接支持文件类型的选项：`-t/--type`。
举个例子：
```
rg "fn run" --type rust // 文件类型：rust
rg "fn run" --trust     // 文件类型：rust，更简洁
rg "int main" -tc       // 文件类型：C，包含`.c`和`.h`文件，相当于：rg "int main" -g "*.{c,h}"

rg clap --type-not rust // 排序 rust 文件
rg clap -Trust          // 排序 rust 文件,更简洁
```
*****注**：即`-t`包含文件类型，`-T`排除文件类型。
文件类型可通过：`rg --type-list`进行查看。














参考
------------
* [User Guide]

* [最快的文本搜索神器ripgrep -- grep的最好代替者]






[ripgrep]:https://github.com/BurntSushi/ripgrep

[ag - the Silver Searcher]:https://www.jianshu.com/p/a6a373636894

[ag]:https://github.com/ggreer/the_silver_searcher


[最快的文本搜索神器ripgrep -- grep的最好代替者]:https://segmentfault.com/a/1190000016170184

[User Guide]:https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md
