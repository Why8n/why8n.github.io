
简介
-------------
>Redis is an in-memory database that persists on disk. The data model is key-value, but many different kind of values are supported: Strings, Lists, Sets, Sorted Sets, Hashes, Streams, HyperLogLogs, Bitmaps. 

* **[Redis]**：全称为：Remote Dictionary Server，是一个使用 ANSI C 编写的基于 Key-Value 数据模型的高性能 NoSql 数据库。

[Redis] 通常被用作为数据结构服务器，我们可以通过 [Redis] 客户端（*redis-cli*）使用一些命令操作 [Redis] 服务器（*redis-server*），*redis-cli* 和 *redis-server* 之间通过 Socket 进行通信，因此不同的进程都可以使用同样的方式对同一个数据进行查询和修改。

[Redis] 最大的特点是：基于内存操作的 NoSql 数据库，[Redis] 默认将数据存储在内存中，因此具备高效的数据操作性能。但同时，[Redis] 也具备持久化功能，可以将内存中的数据持久化到磁盘，下次启动时，可以再次加载并进行使用。

[Redis] 的数据存储模型为 **键值对**，但其提供了较丰富的值存储类型：字符串（String），列表（List），哈希（Hash），集合（Set），有序集合（zset），HyperLogLogs，Bitmaps···

[Redis] 实现的数据结构有一些特殊的属性：
* [Redis] 关注持久化功能，即使数据始终都在服务器内存中进行操作，也会在某个时刻被持久化到磁盘中。这表明 [Redis] 不仅性能高，而且具备非易失性。
* 数据结构的实现强调内存效率，[Redis] 内部使用的数据结构相对于其他高级语言实现的相同数据结构，内存占用更少。
* [Redis] 提供了数据库常见的一些特性，比如复制，持久化调节，集群，高可用性。



优缺点
--------------
[Redis] 优点：

* **性能极高**：[Redis] 读取的速度是 110000次/s,写入的速度是 81000次/s 。
* **丰富的数据类型**：[Redis] 不仅仅支持简单的 Key-Value 类型的数据，同时还提供 List，Hash，Set，zset 等数据结构的存储。
* **原子性**：[Redis] 是单线程工作模型，因此其所有单个操作都是原子性的。对于多个操作，也可以通过相应指令配置成事务进行原子性操作。
* **丰富的特性**：[Redis] 还支持 publish/subscribe, 通知, key 过期等特性。
* **支持主从复制数据备份**：[Redis] 支持数据的备份，即 master-slave 模式的数据备份。

[Redis] 缺点：

* **内存占用过高**：由于 [Redis] 是将所有数据都存储于内存中，因此其内存占用非常高。
* **持久化效率低**：[Redis] 提供了两种方式实现持久化：
1）**定时快照（RDB））**：在指定的时间间隔对内存中整个数据库进行快照存储，持久化到一个 dump.rdb 文件中。由于每次都是写全部数据，会产生大量 I/O 操作，因此效率特别低，代价非常高。
2）**日志追加（AOF）**：以日志形式记录所有对服务器的写入/删除操作，当服务器重启时，重新执行这些命令来恢复原始数据。由于 AOF 采用文件追加的方式进行记录，每次的写命令都会记录到单独的日志文件中，最终会导致日志文件过大，且恢复速度慢。


安装
-----------------
[Redis] 官方只提供 Linux 版本，因此，对于Windows 版本，需要采用其他方法进行安装。
* **Windows平台安装**：具体方法请参考：[redis在window10上的几种安装方式]。这里我选择使用 docker 进行安装，既方便又可以始终选择最新版本。具体步骤如下：
1. win10 系统开启虚拟化：*任务管理器（ctrl+alt+delete）- Performance - 查看 Virtualization*。如果虚拟化未启用（disable），那么需要重启电脑进入 bios 开启虚拟化。

![Virtualization](https://upload-images.jianshu.io/upload_images/2222997-9a4f38cb1a6625ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 启用 Windows 系统自带的虚拟机平台 Hyper-v：*控制面板 - Programs - Programs and Features - Turn Windows features on or off - 勾选上 Hyper-V - 重启系统*。

![Hyper-v](https://upload-images.jianshu.io/upload_images/2222997-9a08b9c0c2d7e7d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 下载安装 [docker](https://hub.docker.com/?overlay=onboarding)，安装完成后最好更改下镜像源：*docker Settings - deamon - Register mirrors*，填入`https://registry.docker-cn.com`。
**注**：控制台输入`docker --version`，查看 docker 是否安装成功。
控制台输入`docker info`，查看镜像源是否配置成功。

![docker info](https://upload-images.jianshu.io/upload_images/2222997-3d485036c7ec37c3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 启动 docker，进行 [Redis] 镜像安装：`docker pull redis`

5. 如果出现以下错误：
```dos
no matching manifest for windows/amd64 10.0.xxxxx in the manifest list entries
```
则需要将 docker 切换到 Linux 容器：*docker - Switch to Linux Container...*。因为很多软件都是开发给 Linux，不适用于 Windows 架构。
**注**：切换容器后，还需要重新设置下镜像源，方法参照步骤3。

5. 运行 [Redis]：`docker run -d -p 6379:6379 --name redis-container redis`，其中，`redis-container`为容器名，可通过命令`docker container ls`，`-p`配置端口映射，将容器内的 6379 端口映射到 Windows 系统的 6379 端口。

6. 输入`docker ps`，就可以查看到容器内部已经运行了 [Redis]。

7. 从`docker ps`中，就可以获取到 [Redis] 运行所在的容器的 id，下面我们进入该容器内部，启动 [Redis] 客户端，并进行测试：
```
# 进入 redis 容器
docker exec -it ee0a8f1babe9 /bin/bash
# ping 一下 redis 服务器
root@ee0a8f1babe9:/data# redis-cli
127.0.0.1:6379> ping
PONG # redis-server 回复，表示连通
```


* **Linux 平台安装（Ubuntu 16.04）**：可以直接在官网下载[安装包][redis_release_official]，但这里我们采用编译安装，具体步骤如下：

1. 下载 [Redis] 源文件：
```shell
git clone https://github.com/antirez/redis.git
```
2. 进入 [Redis] 目录，执行编译：
```
cd redis
sudo make MALLOC=libc
```
编译成功后，会在`redis/src`目录下产生 6 个可执行文件：

| name                                | description                                        |
|-------------------------------------|----------------------------------------------------|
| **redis-server**                        | [Redis]服务端程序                                  |
| **redis-cli**                           | [Redis] 客户端程序                                   |
| redis-sentinel                      | [Redis] 哨兵模式（监控和故障转移）                   |
| redis-benchmark                     | [Redis] 性能检测                                     |
| redis-check-aof 和 redis-check-dump | 这两个可执行程序对于不常见的数据文件损坏修复很有用 |

3. **可选步骤**：编译成功后，可以选择运行测试用例，保证编译成功：
```
# 测试需要安装 tcl
sudo apt-get update
sudo apt-get install build-essential tcl
# 进行测试
sudo make test
```
4. 安装 [Redis]：通常将 **redis-server** 和 **redis-cli** 复制到`/usr/local/bin`即可：
```
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/
```
或者直接使用以下命令进行安装：
```
sudo make install
```
5. 配置 [Redis]：[Redis] 安装完成后，就可以对它进行一些配置，首先需要创建一个配置目录，通常为`/etc/redis`，并创建一个配置文件`redis.conf`：
```
sudo mkdir /etc/redis
sudo cp redis/redis.conf /etc/redis
```
6. 编辑 [Redis] 配置文件，修改如下内容：
```
# supervised no
supervised systemd  # 因为 Ubuntu 使用 systemd 作为系统启动初始化系统
# dir ./
dir /var/lib/redis  # 保存持久化数据文件目录
```
7. 新建 [Redis] 服务进程系统启动文件：
```
# 首先打开 redis.service 文件进行编辑
sudo vim /etc/systemd/system/redis.service
# 添加一些描述
[Unit]
Description=Redis In-Memory Data Store # 描述
After=network.target # 启动此服务之前网络必须可用
# 指定服务的行为
[Service]
User=redis # 服务所属用户
Group=redis # 服务所属组
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf # redis 服务启动
ExecStop=/usr/local/bin/redis-cli shutdown # redis 服务停止
Restart=always # 配置 redis 尽快能从失败中恢复
# 定义服务应该附加到的 systemd 目标
[Install]
WantedBy=multi-user.target
```
8. 由于步骤7中配置了 [Redis] 服务进行归属于 redis 用户和 redis 组，因此这里需要创建用户和组：
```
sudo adduser --system --group --no-create-home redis
sudo mkdir /var/lib/redis
sudo chown redis:redis /var/lib/redis  # 更改文件目录拥有者属性
sudo chmod 770 /var/lib/redis          # 更改文件目录读写模式，只允许 redis 用户及超级管理员
```
9. 启动和测试 [Redis]：
```
sudo systemctl start redis  # 启动 redis 服务
sudo systemctl status redis # 检查 redis 服务是否有错误
```
**注**：步骤5 到 步骤9 所做的其实本质上就是为了启动 redis-server，如果嫌麻烦，直接命令行启动 redis-server 也可以。

10. 步骤9完成后，理论上 redis-server 就已经启动了，那么此时我们就可以启动客户端 redis-cli，与 redis-server 进行通信：
```
why8n@VM-0-11-ubuntu:/$ redis-cli     # 启动 redis 客户端
127.0.0.1:6379> ping                  # ping 服务端，查看是否连通
PONG                                  # 服务端回复 PONG，表示连通
127.0.0.1:6379> set test "store data" # 设置键
OK
127.0.0.1:6379> get test              # 获取键值
"store data"
127.0.0.1:6379> exit                  # 退出客户端
why8n@VM-0-11-ubuntu:/$ redis-cli     # 重新开启一个 redis 客户端
127.0.0.1:6379> get test              # 获取前面设置的键值
"store data"
127.0.0.1:6379> exit
```
11. 通信成功后，最后设置 [Redis] 开机启动：
```
sudo systemctl enable redis
```
配置文件常用[配置项][config]
-------------------------------
[Redis] 支持直接启动，此时使用的是 [Redis] 内置的默认配置，但直接启动只建议用于测试和开发环境中使用。

在项目部署启动时，建议加上指定配置文件：
```
redis-server /etc/redis/redis.conf
```
其中，`/etc/redis/redis.conf`为配置文件，常用的配置项如下表所示：

| 配置项         | 描述                                             |
|----------------|--------------------------------------------------|
| `daemonize no` | 配置是否已守护进程方式运行。其值有：<br>`yes`： 以守护进程方式运行<br>`no`：以普通进程运行|
| `pidfile /var/run/redis.pid`      | 指定当 [Redis] 以守护进程方式运行时，写入其 pid 的文件。                                                                        |
| `port 6379`                       | 指定 [Redis] 监听端口。默认端口号为 6379。                                                                                      |
| `bind 127.0.0.1`                  | 设置绑定主机地址                                                                                                                |
| `timeout 0`                       | 指定超时时间(单位：秒)，当客户端闲置超过该时间后，关闭客户端连接。`0`表示关闭超时，即永久不超时。                               |
| `loglevel notice`                 | 指定日志记录级别。[Redis] 工支持四个日记记录级别：`debug`，`verbose`，`notice`，`warning`，默认为`notice`                       |
| `logfile stdout`                  | 配置日志记录方式，默认为标准输出`stdout`。如果在标准输出模式下，[Redis] 以守护进程方式运行，则日志会被输出到`dev/null`          |
| `database 16`                     | 设置数据库数量，默认为`0`                                                                                                       |
| `save <seconds> <changes>`        | 指定在多长时间段内，超过多少次更新，则将数据库持久化到磁盘中                                                                    |
| `dbfilename dump.rdb`             | 指定持久化本地数据库文件名，默认为 dump.rdb                                                                                     |
|`appendonly no`|指定是否在每次更新操作后进行日志记录，默认为`no`|
|`appendfilename appendonly.aof`|指定更新日志文件名，默认为 appendonly.aof|
|`appendfsync everysec`|指定更新日志条件，共有 3 个可选值：<br>`no`：表示等操作系统进行数据缓存同步到磁盘（快）<br>`always`：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全）<br>`everysec`：表示每秒同步一次（折中，默认值）|
| `dir ./`                          | 指定本地数据库存放目录                                                                                                        |
| `slaveof <masterip> <masterport>` | 设置主从数据库复制，设置当本机为 slave 服务时，指定 master 服务的 IP 及 端口，在 [Redis] 启动时，它会自动从 master 进行数据同步 |
| `masterauth <master-password>` | 设置 master 服务密码                                                                                                                                       |
| `requirepass foobared`         | 设置 [Redis] 连接密码，此时客户端进行连接时，需要使用 `AUTH <password>`命令进行连接                                                                        |
| `maxclients 128`               | 设置同一时间最大客户端连接数。默认为`0`，表示不限制。当客户端连接数到达限制时，[Redis] 会关闭新的连接并向客户端返回`max number of clients reached`错误信息 |
| `maxmemory <bytes>`            | 设置 [Redis] 最大内存限制                                                                                                                                  |
| `include /path/to/local.conf`  | 加载其他配置文件                                                                                                                                           |

更多配置选项，请查看：[redis.conf]

**注**：通过修改`redis.conf`文件或使用`CONFIG set`命令来修改配置，可以通过`CONFIG`命令查看或设置配置项：
```
127.0.0.1:6379> config set loglevel "notice" # 配置 loglevel
OK
127.0.0.1:6379> config get loglevel # 查询配置 loglevel
1) "loglevel"
2) "notice"
```





常用命令
---------------
[Redis] 提供了一些命令，让我们可以对数据进行一些增删改查操作。

这里我们通过客户端（redis-cli）进行操作，请确保执行命令前 [Redis] 服务端（redis-server）已启动。

下面介绍常用的命令：

1. **[Redis] 支持常见的 5 种数据类型：String，List，Hash，Set，zset（Sorted Set）**
* **字符串（String）**：String 是 [Redis] 最基本的类型，一个 Key 对应一个 Value（key => String）。

**增**：`set key value`，添加字符串数据
示例：
```
127.0.0.1:6379> set name whyn
OK
```
**查**：`get key`，查询键为 key 的值
示例：
```
127.0.0.1:6379> get name
"whyn"
```
**改**：格式同 **增**

**删**：`del key`，删除键为 key 的数据
示例：
```
127.0.0.1:6379> del  name
(integer) 1
127.0.0.1:6379> get name
(nil)
```
**注**：String 类型的值最大能存储 512MB。

* **列表（List）**：List 是一个简单的字符串可变数组。在 [Redis] 中一个 Key 可以对应一个 List（key => List）。

**增**：添加一个或多个值到列表头部（左插）或尾部（右插）：
1）将一个或多个值插入到列表头部：`LPUSH key value1 [value2]`
```
127.0.0.1:6379> lpush list1 value1 value2
(integer) 2
```
2）将一个或多个值插入到列表尾部：`RPUSH key value1 [value2]`
```
127.0.0.1:6379> rpush list1 value3 value4
(integer) 4
```
3）将一个值插入到列表头部，如果列表不存在，插入无效：`LPUSHX key value`
4）将一个值插入到列表尾部，如果列表不存在，插入无效：`RPUSHX key value`

**查**：查询列表
1）通过索引获取列表中的元素：`LINDEX key index`
```
127.0.0.1:6379> lindex list1 0  # 查询 list1 列表第1个元素
"value2"
127.0.0.1:6379> lindex list1 -1 # 查询 list1 列表最后一个元素
"value4"
```
2）指定列表范围获取列表中的元素：`LRANGE key start stop`
```
127.0.0.1:6379> lrange list1 0 -1 # list1列表的第1个到最后一个，即全部元素
1) "value2"
2) "value1"
3) "value3"
4) "value4"
```
3）获取列表长度：`LLEN key`

**改**：更改列表元素的值
1）通过索引设置列表元素的值：`LSET key index value`
2）在列表的指定元素前或者后插入元素：`LINSERT key BEFORE|AFTER pivot value`
```
127.0.0.1:6379> rpush mylist "Hello" "World"
(integer) 2
127.0.0.1:6379> lrange mylist 0 -1
1) "Hello"
2) "World"
127.0.0.1:6379> linsert mylist before "World" "My" # 在 World 之前插入 My
(integer) 3
127.0.0.1:6379> lrange mylist 0 -1
1) "Hello"
2) "My"
3) "World"
```

**删**：删除列表元素
1）移除并获取列表的第一个元素：`LPOP key`
2）移除列表的最后一个元素，返回值为移除的元素：`RPOP key`
3）对一个列表进行修剪(trim)，只保留指定区间的元素：`LTRIM key start stop`
4）移除并获取列表的第一个元素， 如果列表为空，则会 **阻塞** 直到有新元素添加或超时：`BLPOP key1 [key2 ] timeout`
5）移除并获取列表的最后一个元素，如果列表为空，则会 **阻塞** 直到有新元素添加或超时：`BRPOP key1 [key2 ] timeout`

* **哈希（Hash）**：Hash 是一个键值对集合。在 [Redis] 中表现为一个 Key 对应一个 Map（key => Map）。

**增**：添加一个或多个键值对：
1）添加一个键值对：`HSET key field value`
```
127.0.0.1:6379> hset hash1 field1 value1
(integer) 1
```
2）添加多个键值对：`HMSET key field1 value1 [field2 value2 ]`
```
127.0.0.1:6379> hmset hash2 field2 value2 field22 value22
OK
```

**查**：对 key 进行查询：
1）查询 key 对应的哈希表中指定字段的值：`HGET key field`
```
127.0.0.1:6379> hget hash1 field1
"value1"
```
2）查询 key 对应的哈希表所有的字段和值：`HGETALL key`
```
127.0.0.1:6379> hgetall hash2
1) "field2"
2) "value2"
3) "field22"
4) "value22"
```
3）查询 key 对应的哈希表的所有字段：`HKEYS key`
```
127.0.0.1:6379> hkeys hash2
1) "field2"
2) "field22"
```
4）获取所有给定字段的值：`HMGET key field1 [field2]`
```
127.0.0.1:6379> hmget hash2 field2 field22
1) "value2"
2) "value22"
```
5）查看哈希表 key 中，指定的字段是否存在：`HEXISTS key field`

**注**：[Redis] 中每个 Hash 可以存储 $2^{32} -1$ 个键值对（40多亿）。

**改**：格式同 **增**

**删**：删除 key 对应哈希表的一个或多个字段：`HDEL key field1 [field2]`

* **集合（Set）**：Set 是 String 类型的无序集合。在 [Redis] 中一个 Key 可以对应一个 Set（key => Set）。

**增**：添加一个或多个值到集合中：`SADD key member1 [member2]`
```
127.0.0.1:6379> sadd set1 member1 member2
(integer) 2
```
**查**：查询 key 对应集合中的元素：
1）返回集合中的所有成员：`SMEMBERS key`
```
127.0.0.1:6379> smembers set1
1) "member2"
2) "member1"
```
2）判断 member 元素是否是 key 集合的成员：`SISMEMBER key member`
```
127.0.0.1:6379> sismember set1 member
(integer) 0  # 不是成员
127.0.0.1:6379> sismember set1 member1
(integer) 1  # 是成员
```
3）获取集合元素大小：`SCARD key`
```
127.0.0.1:6379> scard set1
(integer) 2
```
4）**差集**：获取多个集合间的差集（不同部分）：`SDIFF key1 [key2]`
```
127.0.0.1:6379> sadd set1 member1 member2
(integer) 2
127.0.0.1:6379> sadd set2 member2 member22
(integer) 2
127.0.0.1:6379> sdiff set1 set2    # set1与set2的差集
1) "member1"
```
5）**交集**：获取多个集合间的交集（共有元素）：`SINTER key1 [key2]`
```
127.0.0.1:6379> sinter set1 set2
1) "member2"
```
6）**并集**：获取多个集合间的并集：`SUNION key1 [key2]`
```
127.0.0.1:6379> sunion set1 set2
1) "member2"
2) "member22"
3) "member1"
```

**改**：格式同 **增**

**删**：删除 key 对应集合中的元素：
1）移除集合中一个或多个成员：`SREM key member1 [member2]`
2）移除并返回集合中的一个随机元素：`SPOP key [count]`

**注**：[Redis] 中每个 Set 集合中最大的成员数为$2^{32} - 1$（4294967295, 每个集合可存储 40多亿个成员）。

* **有序集合（zset，Sorted Set）**：zset 和 Set 一样也是 String 类型元素的集合,且不允许重复的成员。不同的是 zset 每个元素都会关联一个 double 类型的分数，作为权重。[Redis] 正是根据该分数来对集合中的元素进行从小到大的排序（key => Sorted Set）。

**增**：添加一个或多个值到有序集合中：
1）向有序集合添加一个或多个成员，或者更新已存在成员的分数：`ZADD key score1 member1 [score2 member2]`
```
127.0.0.1:6379> zadd zset1 1 member1 2 member2
(integer) 2
```

**查**：查询有序集合数据
1）通过索引区间返回有序集合指定区间内的成员（默认按分数（score）从低到高排序）：`ZRANGE key start stop [WITHSCORES]`
```
127.0.0.1:6379> zrange zset1 0 -1
1) "member1"
2) "member2"
```
2）通过索引区间返回有序集合指定区间内的成员，按分数（score）从高到低排序：`ZREVRANGE key start stop [WITHSCORES]`
```
127.0.0.1:6379> zrevrange zset1 0 -1
1) "member2"
2) "member1"
```
3）通过分数（score）返回有序集合指定区间内的成员：`ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT]`
```
# 返回分数为[1,10]之间的成员
127.0.0.1:6379> zrangebyscore zset1 0 10
1) "member1"
2) "member2"
```
4）返回有序集中指定分数（score）区间内的成员，按分数（score）从高到低排序：`ZREVRANGEBYSCORE key max min [WITHSCORES]`：
```
127.0.0.1:6379> zrevrangebyscore zset1 10 0
1) "member2"
2) "member1"
```
5）返回有序集中，成员的分数值：`ZSCORE key member`
```
127.0.0.1:6379> zscore zset1 member1
"1"
127.0.0.1:6379> zscore zset1 member2
"2"
```
6）返回有序集合中指定成员的索引：`ZRANK key member`
```
127.0.0.1:6379> zrank zset1 member2
(integer) 1
```
7）获取有序集合大小：`ZCARD key`
```
127.0.0.1:6379> zcard zset1
(integer) 2
```
8）获取有序集合在指定分数区间的元素个数：`ZCOUNT key min max`
```
127.0.0.1:6379> zcount zset1 0 10
(integer) 2
```

**改**：格式同 **增**

**删**：删除有序集合一个或多个成员数据
1）移除有序集合中的一个或多个成员：`ZREM key member [member ...]`
2）移除有序集合中给定的分数区间的所有成员：`ZREMRANGEBYSCORE key min max`
3）移除有序集合中给定的排名区间的所有成员：`ZREMRANGEBYRANK key start stop`

2. **对键进行操作的命令：**
* **`DEL key [key ...]`**：删除 key 对应的数据结构。
* **`DUMP key`**：序列化给定 key ，并返回被序列化的值。
* **`EXISTS key`**：检查给定 key 是否存在。返回`1`表示存在，`0`表示不存在。
* **`EXPIRE key seconds`**：给 key 设置过期时间（单位：秒）。
* **`PEXPIRE key milliseconds`**：给 key 设置过期时间（单位：毫秒）。
* **`EXPIREAT key timestamp`**：给 key 设置过期时间，以时间戳方式设置。
* **`TTL key`**：显示 key 的剩余过期时间（单位：秒）。
* **`PTTL key`**：显示 key 的剩余过期时间（单位：毫秒）。
* **`PERSIST key`**：移除 key 的过期时间，key 将持久保持。
* **`KEYS pattern`**：查找所有符合给定模式( pattern)的 key。
```
127.0.0.1:6379> keys * # 查找所有键
1) "name"
```
* **`RENAME key newkey`**：修改 key 的名称。
* **`TYPE key`**：返回 key 储存的值的类型。
```
127.0.0.1:6379> type name
string
```
* **`RANDOMKEY`**：从当前数据库中随机返回一个 key。

3. **对数据库进行操作的命令**：[Redis] 可以支持多个数据库操作，比如`database 16`，表示支持 16 个数据库，各个数据索引为：0~15。
* 选择数据库/切换数据库：`SELECT index`
* 清空当前数据库：`FLUSHDB [ASYNC]`
* 清除 [Redis] 所有数据库的所有 key：`FLUSHALL [ASYNC]`


4. **发布-订阅**：[Redis] 支持发布-订阅（pub/sub）消息通信模式，其执行模型为：一个频道（channel）可以被一个或多个 [Redis] 客户端进行订阅，当有新消息通过`PUBLISH`命令发送给该频道时，这个消息就会被发送给订阅该频道的所有客户端。具体模型如下图所示：

![pub/sub](https://upload-images.jianshu.io/upload_images/2222997-e4b2a2c1adf64ad6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[Redis] 发布-订阅相关命令如下所示：
* 订阅一个或多个频道：`SUBSCRIBE channel [channel ...]`
* 发布消息给指定频道：`PUBLISH channel message`
* 取消订阅指定频道：`UNSUBSCRIBE [channel [channel ...]]`

更多其他相关命令，请查看：[commands#pubsub](https://redis.io/commands#pubsub)

示例：启动三个客户端（redis-cli），其中两个订阅频道`chatChannel`，剩余最后一个客户端发布消息到`chatChannel`频道，查看订阅者是否能接收到该信息。
具体步骤如下：
1）首先启动3个客户端（redis-cli)，其中两个订阅频道`chatChannel`：
```
subscrieb chatChannel
```
2）剩余一个客户端发布消息到频道`chatChannel`，此时另外两个客户端应该能接收到这条消息：
```
publish chatChannel hello
```
![](https://upload-images.jianshu.io/upload_images/2222997-818fb3684af1c12a.gif?imageMogr2/auto-orient/strip)

5. **[Redis] 事务**：[Redis] 是单线程运行模型，其单个操作是具备原子性的，而对于多个操作，[Redis] 也提供了事务支持，使多个操作也具备原子性。

**[Redis] 事务执行模型**：开启事务时，[Redis] 并不会直接运行命令，而是将命令序列号并放入队列缓存，在执行事务（`EXEC`）时，会依次执行队列中命令，整个队列执行是一个原子操作，队列中的命令要么依次按顺序执行，要么就完全不执行。

一个典型的 [Redis] 事务会经历 3 个过程：**开始事务（`MULTI`）**，**命令入队**，**执行事务（`EXEC`）**。[Redis] 事务可以一次执行多个命令，并且同时带有以下 3 个保证：
* 事务中的所有命令都会被序列化并按顺序执行。在事务执行过程，其他客户端提交的命令请求不会插入到事务执行命令序列中。
* 事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行。
* 当使用`WATCH`命令时，[Redis] 通过乐观锁实现了check-and-set (CAS) 操作，使得我们可以对一个或多个 key 进行监控，确保只有在监控的 key 都没有被修改的前提下，才执行事务。

[Redis] 事务相关命令如下所示：
* 开启事务：`MULTI`
* 执行事务：`EXEC`
* 取消事务：`DISCARD`
* 监控 key：`WATCH key [key ...]`
如果被监控的 key 在事务执行之前（`EXEC`）被其他命令修改了，那么事务就会被打断。
* 取消对所有 key 的监控：`UNWATCH`

示例：开启一个事务，实现用户A转账 100 元给到用户B。
具体步骤如下：
```
127.0.0.1:6379> set A 100    # 创建用户A
OK
127.0.0.1:6379> set B 0      # 创建用户B
OK
127.0.0.1:6379> multi        # 开启事务
OK
127.0.0.1:6379> get A        # 获取 A
QUEUED                       # get A 入队成功
127.0.0.1:6379> get B
QUEUED                       # get B 入队成功
127.0.0.1:6379> decrby A 100 # A-100
QUEUED                       # decrby A 100 入队成功
127.0.0.1:6379> incrby B 100 # B+100
QUEUED                       # incrby B 100 入队成功
127.0.0.1:6379> get A        # 再次获取 A 的值
QUEUED                       # get A 入队成功
127.0.0.1:6379> get B        # 获取 B 的值
QUEUED                       # get B 入队成功
127.0.0.1:6379> exec         # 执行事务
1) "100"                     # get A
2) "0"                       # get B
3) (integer) 0               # decrby A 100
4) (integer) 100             # incrby B 100
5) "0"                       # get A
6) "100"                     # get B
```
**注**：[Redis] 的事务与传统的关系型数据库的事务不太一样。[Redis] 事务中可能出现两种错误类型：
* **无法入队**：比如使用 [Redis] 无法识别的指令（参数个数错误，指令名错误···），或者其他更严重的错误，比如内存不足等等，这样 [Redis] 就无法将该指令放入队列中，因此会直接 **回滚** 整个操作：
```
127.0.0.1:6379> set key1 hello                                          # 创建键 key1 = hello
OK
127.0.0.1:6379> multi                                                   # 开启事务
OK
127.0.0.1:6379> set key1 hi                                             # 修改键 key1 = hi
QUEUED
127.0.0.1:6379> adasdfasdfasdf                                          # 无法识别的指令
(error) ERR unknown command `adasdfasdfasdf`, with args beginning with:
127.0.0.1:6379> get key1                                                # 获取键
QUEUED
127.0.0.1:6379> exec                                                    # 执行事务
(error) EXECABORT Transaction discarded because of previous errors.     # 事务执行失败
127.0.0.1:6379> get key1
"hello"                                                                 # 获取键值为 hello，表示事务执行确实失败，未能更改 key1 的值
```
* **命令执行错误**：[Redis] 事务中包含有多个命令，当顺序执行这些命令时，有可能某些命令会执行失败，当这些命令执行失败并不会影响下一条命令的执行，此处的处理就与我们通常认识的关系型数据库的事务处理存在区别。在关系型数据库事务中，通常只要事务中某个操作出现错误，就会打断事务，并进行回滚，而在 [Redis] 中，某个命令的执行失败不会产生额外影响，事务会继续进行。
```
127.0.0.1:6379> set key1 hello                         # 创建 key1 = hello
OK
127.0.0.1:6379> multi                                  # 开启事务
OK
127.0.0.1:6379> set key1 hi                            # 修改 key1 = hi
QUEUED
127.0.0.1:6379> incrby key1 10                         # key1+=10，字符串无法进行加减，此会命令执行会失败
QUEUED
127.0.0.1:6379> get key1                               # 获取 key1
QUEUED
127.0.0.1:6379> exec                                   # 执行事务
1) OK                                                  # set key1 hi 执行成功
2) (error) ERR value is not an integer or out of range # incrby key1 10 执行失败
3) "hi"                                                # get key1 执行成功
127.0.0.1:6379> get key1                               # key1 = "hi"，说明事务执行成功
"hi"
```
**注**：区分 [Redis] 事务会不会 **回滚**，主要看事务中的命令是否能放入队列中，如果都能，则不管命令执行是否成功，都不会进行回滚。反之，只要出现无法入队的指令，[Redis] 就会回滚整个操作。

由于多个客户端可以对 [Redis] 数据库的同一个 key 进行操作，因此，在某个客户端执行事务前，数据可能存在偏差（被其他客户端进行修改），导致结果出现异常。[Redis] 为了解决上述问题，为我们提供了`WATCH`命令，可以让我们对一个或多个 key 进行监控，确保相应的 key 未被意外修改后，才执行事务。

示例：开启两个客户端，在客户端A 内监控键`watchedKey`，并开启一个事务，修改键`watchedKey`。客户端B 在客户端A 执行事务前，修改下键`watchedKey`，查看运行效果。
具体步骤如下：
1）创建键`watchedKey`，随意赋一个值：
```
127.0.0.1:6379> set watchedKey hello   
OK   
```
2）客户端A 监控键`watchedKey`，并开启一个事务，修改`watchedKey`：
```
127.0.0.1:6379> watch watchedKey
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set watchedKey HELLO
QUEUED
```
3）此时，客户端B 修改键`watchedKey`：
```
why8n@VM-0-11-ubuntu:~$ redis-cli
127.0.0.1:6379> set watchedKey hi
OK
```
4）客户端A 执行事务，查看结果：
```
127.0.0.1:6379> exec
(nil) # 表示事务被打断
127.0.0.1:6379> get watchedKey
"hi" # 事务没有被执行，因此 watchedKey != HELLO
```
可以看到，在我们执行事务前，如果监控的 key 被修改了，那么事务不会执行。

3. **其他命令：**
* **PING**：用于测试 [Redis] 服务是否启动。当接收到 PONG 回复时，表明 [Redis] 服务已启动，客户端可以和服务端正常通信。
```
127.0.0.1:6379> ping
PONG
```
* **`redis-cli -h host -p port -a password`**：指定连接特定的 [Redis] 服务：
```shell
# 连接到主机为 127.0.0.1，端口为 6379 ，密码为 mypass 的 redis 服务上
redis-cli -h 127.0.0.1 -p 6379 -a "mypass"
```



更多命令，请参考：[**commands**][commands]

参考
-------------
* [Ubuntu 16.04 安装和配置 Redis]

* [Redis 教程 | 菜鸟教程]










[Redis]:https://github.com/antirez/redis

[redis_for_windows]:https://github.com/microsoftarchive/redis/releases

[redis_release_official]:https://github.com/antirez/redis/releases

[redis在window10上的几种安装方式]:https://blog.csdn.net/daydream13580130043/article/details/90734895


[Ubuntu 16.04 安装和配置 Redis]:https://www.cnblogs.com/feiffy/p/9327501.html

[commands]:https://redis.io/commands

[config]:https://redis.io/topics/config

[redis.conf]:https://raw.githubusercontent.com/antirez/redis/4.0/redis.conf

[Redis 教程 | 菜鸟教程]:https://www.runoob.com/redis/redis-tutorial.html






