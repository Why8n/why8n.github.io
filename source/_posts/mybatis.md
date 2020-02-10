
简介
---------------
>[MyBatis] 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。[MyBatis] 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。[MyBatis] 可以使用简单的 XML 或注解来配置和映射原生类型、接口和 Java 的 POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

[入门案例][getting-started.html]
-------------------
下面列举一个简单例子，来阐述 [MyBatis] 的常用操作。

例子：假设数据库`school`内部有一张表`students`，我们希望能使用 [MyBatis] 来实现对`student`表的增删改查操作。

具体步骤如下：
* 首先，我们先创建数据库`school`和表`students`，并插入一些预备数据：
```mysql
# 创建数据库 school
create database if not exists school;
# 使用数据库 school
use school;
# 创建表 student
create table if not exists students (
    -> id int primary key auto_increment,
    -> name varchar(20) not null,
    -> sex varchar(6) default "male",
    -> cls int not null);
# 插入一些数据
insert into students(id,name,sex,cls) values(1,"小明","male",1);
insert into students values(2,"小红","female",2);
insert into students(name,sex,cls) values("小芳","female",2);
insert into students(name,cls) values("小宁",4);
```
经过上面操作后，`students`表就存储了如下内容：

![students](https://upload-images.jianshu.io/upload_images/2222997-78cacdbc5d5c5b93.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


* 创建一个使用 [Maven] 作为依赖管理的普通 Java 工程，如下图所示：

![](https://upload-images.jianshu.io/upload_images/2222997-5b72b6192097a20b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 在 pom.xml 中添加依赖：必须添加的是 [MyBatis] 依赖和 [mysql-connector] 驱动依赖，同时这里我们也添加一个 [log4j] 依赖，用以配置日志输出：
```
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.1</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.16</version>
        </dependency>

        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
    </dependencies>
```
然后在主工程`resources`资源目录下，创建一个配置文件：`log4j.properties`，进行日志信息配置：
```
# Global logging configuration
log4j.rootLogger=DEBUG, stdout
# Console output...
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
```
* 接下来，继续在主工程`resources`目录下创建一个全局的 [MyBatis] 配置文件，该文件可任意命名，我们这里将其命名为：`MyBatisConfig.xml`，具体内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://www.mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 配置环境：和spring整合后 environments配置将废除-->
    <environments default="development">
        <!-- 配置mysql环境 -->
        <environment id="development">
            <!-- 配置事务：使用jdbc事务管理-->
            <transactionManager type="JDBC"/>
            <!-- 数据库连接池-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/school?serverTimezone=GMT"/>
                <!--注意：这里必须是username,一定要规范-->
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```
可以看到，上述全局配置表主要完成的是对开发环境和 MySql 连接信息的配置。
* 要想使用 [MyBatis] 完成对具体某一张表的操作，我们还需要为这张表的相关操作创建相应接口和配置文件，并在全局配置表中将相关配置文件具体内容进行注入。具体操作如下：

1）创建表对应的 POJO 类：
```java
package com.yn.bean;

import java.io.Serializable;

/**
 * @author Whyn
 * @date 7/16/2019 5:37 PM
 */
public class Student implements Serializable {
    private String name;
    private String sex;
    private int cls;

/**
 * 
 *
 * 必须创建一个默认构造函数，否则就需要构造一个映射器，比如
 *     <resultMap id="studentResultMap" type="com.yn.bean.Student">
 *        <constructor>
 *            <arg column="name" javaType="String" />
 *             <arg column="sex" javaType="String" />
 *             <arg column="cls" javaType="_int" />
 *         </constructor>
 *     </resultMap>
  */
    public Student(){

    }
    public Student(String name, String sex, int cls) {
        this.name = name;
        this.sex = sex;
        this.cls = cls;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public int getCls() {
        return cls;
    }

    public void setCls(int cls) {
        this.cls = cls;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", cls=" + cls +
                '}';
    }
}
```
2）创建对表操作的相应接口：
```java
package com.yn.interfaces;

import com.yn.bean.Student;

import java.util.List;

public interface IStudentsDao {
    //    增：添加学生
    void add(Student student);

    //    删：删除学生
    void delete(String name);

    //    改：更改信息
    void update(String name);

    //    查：查询所有
    List<Student> selectAll();
}
```
3）在主工程资源目录`resources`下，创建对表操作的配置信息（对于每一个 Dao，都创建对应包名目录的配置文件，比如：`com.yn.interfaces.IStudentsDao`，则创建对应配置文件：`com/yn/interfaces/IStudentsDao.xml`）：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yn.interfaces.IStudentsDao">

    <insert id="add" parameterType="com.yn.bean.Student">
        insert into students(name,sex,cls) values(#{name},#{sex},#{cls})
    </insert>

    <delete id="delete" parameterType="String">
        delete from students where name=#{name}
    </delete>

    <update id="update" parameterType="com.yn.bean.Student">
        update students set sex=#{sex},cls=#{cls} where name=#{name}
    </update>

    <select id="selectAll" resultType="com.yn.bean.Student">
        select * from students
    </select>
</mapper>
```
**注**：`<mapper>`标签中的`namespace`表示表对应接口类，各个数据库操作的属性`id`表示接口类对应的方法名。因此，由`namespace + id`就可以唯一确定对应的操作方法。

4）创建完对表的操作配置文件后，还需在全局配置文件中注入该配置文件，因此，全局配置表完整内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://www.mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 和spring整合后 environments配置将废除-->
    <environments default="development">
        <environment id="development">
            <!-- 使用jdbc事务管理-->
            <transactionManager type="JDBC"/>
            <!-- 数据库连接池-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/school?serverTimezone=GMT"/>
                <!--注意：这里必须是username,一定要规范-->
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 注入各个具体配置表 -->
    <mappers>
        <!-- 指明具体配置表路径 -->
        <mapper resource="com/yn/interfaces/IStudentsDao.xml"/>
    </mappers>
</configuration>
```
5）最后，就可以通过代码对数据库表进行操作，代码如下所示：
```java
public class Main {

    public static void main(String[] args) throws IOException {
//        加载全局配置文件
        InputStream config = Resources.getResourceAsStream("MyBatisConfig.xml");
//        创建工厂类
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(config);
//        由工厂创建得到操作数据库表的 SqlSession 对象
        SqlSession session = factory.openSession();
//        得到表操作代理对象
        IStudentsDao studentsDaoProxy = session.getMapper(IStudentsDao.class);
//        增：添加学生
        Student student = new Student("Whyn", "male", 7);
        studentsDaoProxy.add(student);
        session.commit();

//        删：删除学生
        studentsDaoProxy.delete("Whyn");
        session.commit();

//        改：更改信息
        student = new Student("小明", "male", 8);
        studentsDaoProxy.update(student);
        session.commit();
//        查：查询所有
        List<Student> students = studentsDaoProxy.selectAll();
//        释放资源
        session.close();
        config.close();
    }
}
```
**注**：此处我们使用的是 [MyBatis] 推荐的基于动态代理生成`IUserDao`代理实例进行数据库操作，当然也可以自己通过实现具体的`IStudentsDao`实例对数据库进行操作，其原理就是在具体实现类内部创建`SqlSession`实例进而操作数据库，具体做法此处就不进行展开了。

以上，就是使用 [MyBatis] 对数据库进行操作的基本操作过程了。

[全局配置文件][configuration]
--------------------------------------------
下面对 [MyBatis] 的全局配置文件（即：`MyBatisConfig.xml`）中的常用配置选项进行讲解：

**注**：以下所讲解的属性配置均位于大标签`<configuration>`内部。

* **[properties]**：这些属性都是外部配置且可动态替换的，既可以在典型的 Java 属性文件中配置，亦可通过`properties`元素的子元素来传递。例如：
```xml
<properties>
    <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/school?serverTimezone=GMT"/>
    <property name="username" value="root"/>
    <property name="password" value="password"/>
</properties>
```
然后其中的属性就可以在整个配置文件中被用来替换需要动态配置的属性值。比如:
```xml
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```
但是，`properties`更常用的方式是读取外部配置文件，通过属性`resource`/`url`指定外部配置文件即可，具体操作如下：
1）在`resources`目录下，创建一个配置文件：**db.properties**，内容如下：
```dos
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/school?serverTimezone=GMT
jdbc.username=root
jdbc.password=password
```
2）然后在全局配置文件（`MyBatisConfig.xml`）中进行导入并配置：
```xml
<configuration>
<!--    导入外部配置文件-->
    <properties resource="db.properties" />

    <environments default="development">
        <environment id="development">
            ...
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <!--注意：这里必须是username,一定要规范-->
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>

        </environment>
    </environments>
    ...
</configuration>
```
**注**：如果同一个属性`property`在多个地方都定义了，那么其读取顺序为：标签`properties`内部指定的属性 > `resource`/`url` 属性中指定的配置文件 > 方法参数。因此，方法参数的优先级最高。

* **[typeAliases]**：类型别名是为 Java 类型设置一个短的名字。 它只和 XML 配置有关，存在的意义仅在于用来减少类完全限定名的冗余。例如：
```xml
<typeAliases>
<!-- type指定类全限定名，alias指定别名，且别名不区分大小写-->
    <typeAlias type="com.yn.bean.Student" alias="student" />
</typeAliases>
```
另一种更简便的配置别名的方法是使用标签`package`：[MyBatis] 会自动搜索`package`标签指定包名下面的所有 Java Bean，并将别名设置为其类名：
```xml
<typeAliases>
<!-- 类名即为别名，且不区分大小写-->
    <package name="com.yn.bean"/>
</typeAliases>
```
**注**：使用`package`标签后，如果不想使用类名作为别名，则可以在使用`@Alias`注解自定义别名：
```java
@Alias("student")
public class Student{
    ...
}
```
最后，就可以在任何使用`com.yn.bean.Student`的配置文件中，更改为使用别名：
```xml
<mapper namespace="com.yn.interfaces.IStudentsDao">

    <insert id="add" parameterType="student">
        insert into students(name,sex,cls) values(#{name},#{sex},#{cls})
    </insert>

    <update id="update" parameterType="Student">
        update students set sex=#{sex},cls=#{cls} where name=#{name}
    </update>

    <select id="selectAll" resultType="student">
        select * from students
    </select>

</mapper>
```
[MyBatis] 中已经为我们内置了许多 Java 类型的别名，具体如下表所示：

|   Alias   |	Mapped Type   |
|   :--:   |	:--:   |
|   _byte   |	byte   |
|   _long   |	long   |
|   _short   |	short   |
|   _int   |	int   |
|   _integer   |	int   |
|   _double   |	double   |
|   _float   |	float   |
|   _boolean   |	boolean   |
|   string   |	String   |
|   byte   |	Byte   |
|   long   |	Long   |
|   short   |	Short   |
|   int   |	Integer   |
|   integer   |	Integer   |
|   double   |	Double   |
|   float   |	Float   |
|   boolean   |	Boolean   |
|   date   |	Date   |
|   decimal   |	BigDecimal   |
|   bigdecimal   |	BigDecimal   |
|   object   |	Object   |
|   map   |	Map   |
|   hashmap   |	HashMap   |
|   list   |	List   |
|   arraylist   |	ArrayList   |
|   collection   |	Collection   |
|   iterator   |	Iterator   |               

* **[mappers]**：映射器配置文件内部定义了 SQL 映射语句，因此我们需要将这些映射文件告诉 [MyBatis]，可以使用相对于类路径的资源引用， 或完全限定资源定位符（包括 file:/// 的 URL），或类名和包名等。例如：
```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>

<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>

<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>

<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```

[映射器配置文件][MapperXML]
------------------------------------------------
下面对 [MyBatis] 的配置 SQL 映射语句的映射文件（即：`IStudentsDao.xml`）中的常用配置选项进行讲解：

* **[select]**： 映射查询语句，如下所示：
```xml
<select id="selectPerson" parameterType="int" resultType="hashmap">
  SELECT * FROM PERSON WHERE ID = #{id}
</select>
```
这个语句被称作`selectPerson`，接受一个`int`（或`Integer`）类型的参数，并返回一个`HashMap`类型的对象，其中的键是列名，值便是结果行中的对应值。

`<select>`标签的属性及其作用如下表所示：

|   属性   |   描述   |
|   :--:   | :--   |
|   `id`   |	在命名空间中唯一的标识符，可以被用来引用这条语句。   |
|   `parameterType`   |	将会传入这条语句的参数类的完全限定名或别名。这个属性是可选的，因为 [MyBatis] 可以通过类型处理器（`TypeHandler`） 推断出具体传入语句的参数，默认值为未设置（`unset`）。   |
|   `resultType`   |	从这条语句中返回的期望类型的类的完全限定名或别名。 **注意如果返回的是集合，那应该设置为集合包含的类型，而不是集合本身**。可以使用 `resultType` 或 `resultMap`，但不能同时使用。   |
|   `resultMap`   |	外部 `resultMap` 的命名引用。结果集的映射是 [MyBatis] 最强大的特性，如果你对其理解透彻，许多复杂映射的情形都能迎刃而解。可以使用 `resultMap` 或 `resultType`，但不能同时使用。   |
|   `flushCache`   |	将其设置为 `true` 后，只要语句被调用，都会导致本地缓存和二级缓存被清空，默认值：`false`。   |
|   `useCache`   |	将其设置为 `true` 后，将会导致本条语句的结果被二级缓存缓存起来，默认值：对 select 元素为 `true`。   |
|   `timeout`   |	这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。默认值为未设置（`unset`）（依赖驱动）。   |
|   `fetchSize`   |	这是一个给驱动的提示，尝试让驱动程序每次批量返回的结果行数和这个设置值相等。 默认值为未设置（`unset`）（依赖驱动）。   |
|   `statementType`   |	`STATEMENT`，`PREPARED`或`CALLABLE` 中的一个。这会让 [MyBatis] 分别使用`Statement`，`PreparedStatement`或`CallableStatement`，默认值：`PREPARED`。   |
|   `resultSetType`   |	`FORWARD_ONLY`，`SCROLL_SENSITIVE`, `SCROLL_INSENSITIVE` 或 `DEFAULT`（等价于 `unset`） 中的一个，默认值为 `unset` （依赖驱动）。   |
|   `databaseId`   |	如果配置了数据库厂商标识（databaseIdProvider），[MyBatis] 会加载所有的不带 `databaseId` 或匹配当前 `databaseId` 的语句；如果带或者不带的语句都有，则不带的会被忽略。   |
|   `resultOrdered`   |	这个设置仅针对嵌套结果 select 语句适用：如果为 `true`，就是假设包含了嵌套结果集或是分组，这样的话当返回一个主结果行的时候，就不会发生有对前面结果集的引用的情况。 这就使得在获取嵌套的结果集的时候不至于导致内存不够用。默认值：`false`。   |
|   `resultSets`   |	这个设置仅对多结果集的情况适用。它将列出语句执行后返回的结果集并给每个结果集一个名称，名称是逗号分隔的。   |

* **[insert, update 和 delete][insert_update_delete]**：数据变更语句 insert，update 和 delete 的实现非常接近：
```xml
<insert
  id="insertAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  keyProperty=""
  keyColumn=""
  useGeneratedKeys=""
  timeout="20">

<update
  id="updateAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">

<delete
  id="deleteAuthor"
  parameterType="domain.blog.Author"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">
```
`<insert>`，`<update>`和`<delete>`标签的属性及其作用如下表所示：

|   属性   |	描述   |
|   :--:   |	:--   |
|   `id`   |	命名空间中的唯一标识符，可被用来代表这条语句。   |
|   `parameterType`   |	将要传入语句的参数的完全限定类名或别名。这个属性是可选的，因为 [MyBatis] 可以通过类型处理器推断出具体传入语句的参数，默认值为未设置（`unset`）。   |
|   `flushCache`   |	将其设置为 `true` 后，只要语句被调用，都会导致本地缓存和二级缓存被清空，默认值：`true`（对于 insert、update 和 delete 语句）。   |
|   `timeout`   |	这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。默认值为未设置（`unset`）（依赖驱动）。   |
|   `statementType`   |	`STATEMENT`，`PREPARED` 或 `CALLABLE` 的一个。这会让 [MyBatis] 分别使用 `Statement`，`PreparedStatement` 或 `CallableStatement`，默认值：`PREPARED`。   |
|   `useGeneratedKeys`   |	（仅对 insert 和 update 有用）这会令 [MyBatis] 使用 JDBC 的 `getGeneratedKeys` 方法来取出由数据库内部生成的主键（比如：像 MySQL 和 SQL Server 这样的关系数据库管理系统的自动递增字段），默认值：false。   |
|   `keyProperty`   |	（仅对 insert 和 update 有用）唯一标记一个属性，[MyBatis] 会通过 `getGeneratedKeys` 的返回值或者通过 insert 语句的 `selectKey` 子元素设置它的键值，默认值：未设置（`unset`）。如果希望得到多个生成的列，也可以是逗号分隔的属性名称列表。   |
|   `keyColumn`   |	（仅对 insert 和 update 有用）通过生成的键值设置表中的列名，这个设置仅在某些数据库（像 PostgreSQL）是必须的，当主键列不是表中的第一列的时候需要设置。如果希望使用多个生成的列，也可以设置为逗号分隔的属性名称列表。   |
|   `databaseId`   |	如果配置了数据库厂商标识（databaseIdProvider），[MyBatis] 会加载所有的不带 `databaseId` 或匹配当前 `databaseId` 的语句；如果带或者不带的语句都有，则不带的会被忽略。   |


[动态 SQL][dynamic-sql]
----------------------
[MyBatis] 为我们提供了一些标签，方便我们进行 SQL 的动态拼接（动态 SQL）。

具体的标签及其功能如下：

* **if**：动态 SQL 最常用处就是作为 where 子句的条件判断。比如：
```
// IStudentsDao.java
public interface IStudentsDao {
	...
    List<Student> findStudentsByCondition(Student student);
}

// IStudentsDao.xml
...
<mapper namespace="com.yn.interfaces.IStudentsDao">
    ...
    <select id="findStudentsByCondition" parameterType="Student" resultMap="studentResultMap">
        select * from students where 1=1
        <if test="name != null">
            and name=#{name}
        </if>
        <if test="sex !=null">
            and sex=#{sex}
        </if>
        <if test="cls != 0">
            and class=#{cls}
        </if>
    </select>

</mapper>

// IStudentsDaoTest.java
    @Test
    public void testFindStudentsByCondition() {
		...
        Student student = new Student();
        student.setSex("male");
        student.setCls(4);
        List<Student> students = this.studentsDaoProxy.findStudentsByCondition(student);
        for(Student stu: students){
            System.out.println(stu);
        }
    }
```

* **where**：见名知意，该标签用于替换 where 子句。正如我们上面那个例子，如果直接使用 where 子句进行 **if** 判断，我们需要手动添加一个为”真“的条件，这样当 **if** 判断失败时，还能确保 SQL 语句的正确性，但使用 **where** 标签，就可以省略这冗余操作：
```xml
    <select id="findStudentsByCondition" parameterType="Student" resultMap="studentResultMap">
        select * from students
        <where>
            <if test="name != null">
                and name=#{name}
            </if>
            <if test="sex !=null">
                and sex=#{sex}
            </if>
            <if test="cls != 0">
                and class=#{cls}
            </if>
        </where>
    </select>
```

* **foreach**：动态 SQL 的另一个常用操作就是对一个集合进行遍历，通常实在构建 IN 条件语句时使用。比如：
```
// StudentVo.java
public class StudentVo {
    private List<Integer> studentIds;

    public List<Integer> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(List<Integer> studentIds) {
        this.studentIds = studentIds;
    }
}

// IStudentDao.java
public interface IStudentsDao {
	...
    List<Student> findStudentsInIds(StudentVo vo);
}

// IStudentDao.xml
<mapper namespace="com.yn.interfaces.IStudentsDao">
    ...
    <select id="findStudentsInIds" parameterType="StudentVo" resultMap="studentResultMap">
        select * from students
        <where>
            <if test="studentIds != null and studentIds.size() > 0">
                <foreach collection="studentIds" open="id in (" close=")" item="id" separator=",">
                    #{id}
                </foreach>
            </if>
        </where>
    </select>

</mapper>

// IStudentDaoTest.java
    @Test
    public void testFindStudentsInIds() {
        List<Integer> ids = Arrays.asList(1,2,3,4);
        StudentVo vo = new StudentVo();
        vo.setStudentIds(ids);
        List<Student> students = this.studentsDaoProxy.findStudentsInIds(vo);
        for(Student student : students){
            System.out.println(student);
        }
    }
```
**foreach** 标签中的`collection`属性用于指定集合对象，在我们上面的例子里就是`StudentVo.studentIds`。`open`+`item`+`separator`+`close`组合而成我们的SQL 查询语句，上面完整的 SQL 语句如下：
```sql
select * from students where id in (1,2,3,4);

```

* **sql**：该标签可以抽取出重复 SQL 语句，用于复用。如下所示：
```sql
<sql id="defaultSelect">
	select * from students
</sql>
<select id="selectAll" resultMap="studentResultMap">
	<include refid="defaultSelect"/>
</select>
```
更多动态 SQL 标签，请查看：[dynamic-sql]

数据库表间关联
-----------------
在关系型数据中，表与表之间存在三种关系：一对一，一对多（多对一）和多对多。下面我们分别针对这三种关联关系给出具体配置。

前提：还是以上文入门案例作为示例，入门案例中已有一张表`students`，下面我们再创建一张表`classes`,并将字段`stu_id`作为指向表`students.id`的外键：
```sql
CREATE TABLE IF NOT EXISTS `classes` (
    -> `id` int(11) NOT NULL AUTO_INCREMENT,
    -> `name` VARCHAR(10) NOT NULL,
    -> `stu_id` int NOT NULL,
    -> PRIMARY KEY (`id`),
    -> KEY `stu_id` (`stu_id`),
    -> CONSTRAINT `stu_id` FOREIGN KEY (`stu_id`) REFERENCES `students` (`id`)
    -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
创建完表`classes`后，顺便插入几条数据：
```sql
insert into classes(name,stu_id) values('一班',1);
insert into classes(name,stu_id) values('二班',2);
insert into classes(name,stu_id) values('三班',3);
insert into classes(name,stu_id) values('四班',4);
```
然后，修改下`students`表：
1）先将表`students`的字段`cls`改为`class_id`：
```sql
alter table students change column cls class_id int not null;
```
2）然后将其列`class_id`修改为指向表`classes.id`的外键：
```
# 禁用外键约束
set foreign_key_checks=0;
# 修改列
alter table students add constraint class_id foreign key(class_id) refererences classes(id);
# 启用外键约束
set foreign_key_checks=1;
```
至此，现数据库中总共有2张表：`students`和`classes`，且`students.class_id`指向表`classes.id`，表`classes.stu_id`指向表`students.id`。


最后，在 [MyBatis] 中以代码方式实现对表`classes`的操作，完整代码如下：
```
// com.yn.bean.Classes.java
public class Classes implements Serializable {
    private int id;
    private String name;
    private int studentId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    @Override
    public String toString() {
        return "Classes{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", studentId=" + studentId +
                '}';
    }
}

// com.yn.interfaces.IClassesDao.java
public interface IClassesDao {
//    查：查询所有
    List<Classes> selectAll();
}

// 全局配置文件：MyBatis.xml
<configuration>
    ...
    <mappers>
	<!--直接使用 package 标签导入全部配置映射文件-->
        <package name="com.yn.interfaces"/>
    </mappers>
</configuration>

// resources/com/yn/interfaces/IClassesDao.xml
...
<mapper namespace="com.yn.interfaces.IClassesDao">
    <resultMap id="classesMap" type="com.yn.bean.Classes">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="studentId" column="stu_id" />
    </resultMap>

    <select id="selectAll" resultMap="classesMap">
        select * from classes;
    </select>
</mapper>
```

到此，我们的准备工作已算完成了，接下来就可以开始进入 [MyBatis] 建立表关联操作的实操。


* **一对一关联**：一个学生对应一个班级，因此，学生表`students`与班级表`classes`的关联关系即为一对一。具体到 [MyBatis] 中，这种关联体现的实现步骤如下:

1. 表`students`对应的 POJO 类为`Student`，每个学生对应一个班级，因此，学生和班级的一对一关联关系在 Java 代码的体现只需为类`Student`内部添加一个`Classes`成员即可：
```java
// com.yn.bean.Student.java
public class Student implements Serializable {
    private String name;
    private String sex;
    private int classId;

//    一对一关联：一个学生对应一个班级
    private Classes cls;
    ...
    public Classes getCls() {
        return cls;
    }

    public void setCls(Classes cls) {
        this.cls = cls;
    }
    ...
``` 
2. 然后配置映射文件使用标签`association`表示一对一关联：
```xml
<mapper namespace="com.yn.interfaces.IStudentsDao">
    ...
    <resultMap id="studentClassMap" type="com.yn.bean.Student">
        <!--配置 Student 输出映射-->
        <result property="name" column="name"/>
        <result property="sex" column="sex"/>
        <result property="classId" column="class_id"/>
        <!--一对一关联：配置 Classes 输出映射-->
        <association property="cls" column="class_id" javaType="com.yn.bean.Classes">
            <id property="id" column="id" />
            <!--select classes.name as classname-->
            <result property="name" column="classname"/>
            <!--这里可以不配置，因为 sql 语句并没有输出该字段内容-->
            <result property="studentId" column="stu_id" />
        </association>

    </resultMap>

    <select id="selectAll" resultMap="studentClassMap">
        select s.*,c.name as classname from students s,classes c where s.class_id=c.id;
    </select>
    ...
</mapper>
```
到这里，我们就已经完成了一对一关联关系表的建立。

* **一对多关联**：一个班级可以有多个学生，因此班级表`classes`与学生表`students`的关系即为一对多关系。具体到 [MyBatis] 中，一对多的关联实现步骤如下所示：

1. 由于一个班级有多个学生，此种一对多的关系在 Java 代码的体现就是：类`Classes`内部维护一个`Students`集合：
```
// com.yn.bean.Classes.java
public class Classes implements Serializable {
    private int id;
    private String name;
    private int studentId;

//    一对多关联：一个班级有多个学生
    private List<Student> students;

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
    ...
}
```
2. 然后配置映射文件中使用标签`collection`表示一对多关联：
```xml
// resources/com/yn/interfaces/IClassesDao.xml
<mapper namespace="com.yn.interfaces.IClassesDao">
    <resultMap id="classStudentsMap" type="com.yn.bean.Classes">
  	    <!--配置 Classes 字段映射-->
        <id property="id" column="id" />
	    <!--select classes.name as classname-->
        <result property="name" column="classname" />
        <result property="studentId" column="stu_id" />
        <!--一对多关联：配置 Student 映射-->
	    <!--ofType表示集合内部元素-->
        <collection property="students" ofType="com.yn.bean.Student">
            <result property="name" column="name" />
            <result property="sex" column="sex" />
            <result property="classId" column="class_id" />
        </collection>
    </resultMap>

    <select id="selectAll" resultMap="classStudentsMap">
        select * from classes
    </select>

</mapper>
```
到这里，我们就已经完成了一对多关联关系的建立。

在讲解 **多对多关联** 前，我们先创建2张表：
1. 老师表`teachers`，用于存储教师信息：
```
create table if not exists teachers (
    -> id int primary key auto_increment,
    -> name varchar(20) not null,
    -> sex varchar(10) default 'male'
    -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 插入一些数据
insert into teachers(name,sex) values('张三','male');
insert into teachers(name,sex) values('李四','female');
insert into teachers(name,sex) values('王五','male');
```
2. 然后需要再创建一张中间表（因为多对多关联需要一张中间表进行连接），称为：`stu_tea`，其内部之包含两个字段：`sid`和`tid`，分别作为指向表`studnets.id`和表`teachers.id`的外键：
```
create table if not exists `stu_tea` (
	-> `sid` int not null,
	->  `tid` int not null,
	->  primary key (`sid`,`tid`),
	-> foreign key (`sid`) references `students` (`id`),
	-> foreign key (`tid`) references `teachers` (`id`)
	-> ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 插入一些数据
insert into stu_tea (sid,tid) values (1,1),(1,3),(2,2),(4,1),(4,2);
```

* **多对多关联**： 一个学生可以有多个老师，一个老师也可以有多个学生。因此，老师与学生的关系是多对多关联。
1. 首先从老师角度来说，其对应多个学生，在 Java 代码上的体现为：POJO 类`Teacher`内部维护一个`Student`集合，完整代码如下：
```
// com.yn.bean.Teacher.java
public class Teacher implements Serializable {
    private int id;
    private String name;
    private String sex;

//    多对多关联：一个老师对应多个学生
    private List<Student> students;
    
    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    } 

    @Override
    public String toString() {
        return "Teacher{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                '}';
    }
}

// com.yn.interfaces.ITeacherDao.java
public interface ITeacherDao {

    List<Teacher> selectAll();
}

// 全局配置文件：resources/MyBatisConfig.xml
<configuration>
    ...
    <mappers>
        <package name="com.yn.interfaces"/>
    </mappers>
</configuration>

// com.yn.interfaces.ITeacherDao.xml
<mapper namespace="com.yn.interfaces.ITeacherDao">
    <resultMap id="teacherStudentsMap" type="com.yn.bean.Teacher">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="sex" column="sex"/>
        <collection property="students" ofType="com.yn.bean.Student">
            <!--select students.name as sname-->
            <result property="name" column="sname"/>
            <!--select students.sex as ssex-->
            <result property="sex" column="ssex"/>
            <result property="classId" column="class_id"/>
        </collection>
    </resultMap>

    <select id="selectAll" resultMap="teacherStudentsMap">
        select t.*,s.name as sname,s.sex as ssex,s.class_id from teachers t
        left outer join stu_tea st on t.id=st.tid
        left outer join students s on s.id=st.sid
    </select>
</mapper>

// junit test
@Test
public void selectAll() {
	List<Teacher> teachers = this.teacherDaoProxy.selectAll();
	for(Teacher teacher: teachers){
		System.out.println(teacher);
		for(Student s : teacher.getStudents()){
			System.out.println(s);
		}
	}
}
```
2. 从学生角度来讲，其对应多个老师，在 Java 代码上的体现为：POJO 类`Student`内部维护一个`Teacher`集合：
```
// com.yn.bean.Student.java
public class Student implements Serializable {
    private String name;
    private String sex;
    private int classId;
//    一对一关联：一个学生对应一个班级
    private Classes cls;

//    多对多关联：一个学生对应多个老师
    private List<Teacher> teachers;

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }
    ...
}

// com.yn.interfaces.IStudentsDao.xml
<mapper namespace="com.yn.interfaces.IStudentsDao">
    ...
    <resultMap id="studentTeachersMap" type="com.yn.bean.Student">
        <result property="name" column="name" />
        <result property="sex" column="sex" />
        <result property="classId" column="class_id" />
        <collection property="teachers" ofType="com.yn.bean.Teacher">
            <!--select teachers.name as tname-->
            <result property="name" column="tname" />
            <!--select teachers.sex as tsex-->
            <result property="sex" column="tsex" />
        </collection>
    </resultMap>

    <select id="selectAll" resultMap="studentTeachersMap">
        select s.name,s.sex,s.class_id,t.name as tname,t.sex as tsex from students s
        left outer join stu_tea st on s.id=st.sid
        left outer join teachers t on t.id =st.tid
    </select>
    ...
</mapper>

// junit test
@Test
public void testSelectAll() throws IOException {
	List<Student> students = this.studentsDaoProxy.selectAll();
	for (Student student : students) {
		System.out.println(student);
		for(Teacher teacher : student.getTeachers()){
			System.out.println(teacher);
		}
	}
}
```
到此，[MyBatis] 中对于数据库表间的关联关系处理已基本完成。

关联表加载模式
---------------
首先了解下两个概念：
* **立即加载**：表间关联时，加载主表时，同时加载关联表。
* **延迟加载**：也即按需加载，关联表数据只有在使用到的时候，才进行加载。

正如我们上文提到的关系型数据库中，各表间可能存在一定的关联关系。比如一对多关联时，当我们查询主表数据时，此时对于关联表而言，就存在两种操作：
1）**立即加载**：查询主表数据时，同时也对关联表数据进行查询。即主副表查询是**同步**的。
2）**延迟加载**：查询主表数据时，不进行关联表数据查询。后续要使用到关联表数据时，才进行查询。即主副表查询是**异步**的。

通常而言，对于 N对一 的关联关系，建议使用 **立即加载**（可认为关联表数据量小）。
对于 N对多 的关联关系，建议使用 **延迟加载**（可认为关联表数据量大）。

在 [MyBatis] 中，开启延迟加载的步骤如下：
1. 首先在全局配置文件中开启全局延迟加载模式：
```
// resources/MyBatisConfig.xml
<configuration>
<!--    导入外部配置文件-->
    <properties resource="db.properties" />
    
    <settings>
        <!--延迟加载：true-->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!--立即加载：false-->
        <setting name="aggressiveLazyLoading" value="false"/>
    </settings>
	...
</configuration>
```
2. 通过提供`select`属性，配置关联表的数据获取（延迟）方法，因为是关系型数据库，关联表的数据获取通常都是通过主表的外键作为其参数，所提提供的方法的参数即为主表外键值，其由`column`属性指定。

比如，按上文学生表`students`和班级表`classes`的一对一关联来说，其配置如下：
1）因为要开启延迟加载，因此主表（即表`students`）操作（SQL 语句）不需要考虑关联表：
```
<!--com/yn/interfaces/IStudentsDao.xml-->
<select id="selectAll" resultMap="studentClassMap">
	select * from students
</select>
```
2）然后，关联表（即表`classes`）要提供关联查询方法，因主表（即表`students`）是通过外键（`class_id`）关联副表（即表`classes`），因此副表需要提供`selectById(int cid)`方法：
```
// com.yn.interfaces.IStudentsDao.java
public interface IClassesDao {

//    查：查询所有
    List<Classes> selectAll();

//    提供通过班级id 关联查询方法
    Classes selectById(Integer cid);
}

<!--com/yn/interfaces/IClassesDao.xml-->
<mapper namespace="com.yn.interfaces.IClassesDao">
    <resultMap id="classesMap" type="com.yn.bean.Classes">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="studentId" column="stu_id" />
    </resultMap>

    <select id="selectById" parameterType="int" resultMap="classesMap">
        select * from classes where id=#{cid}
    </select>
</mapper> 
```
3）最后，通过`select`属性和`column`属性为主表提供副表数据获取（延迟加载）方法：
```
<!--com/yn/interfaces/IStudentsDao.xml-->
<resultMap id="studentClassMap" type="com.yn.bean.Student">
	<!--配置 Student 输出映射-->
	<result property="name" column="name"/>
	<result property="sex" column="sex"/>
	<result property="classId" column="class_id"/>
	<!--一对一关联：配置 Classes 输出映射-->
	<association property="cls" column="class_id" javaType="com.yn.bean.Classes" select="com.yn.interfaces.IClassesDao.selectById">
	</association>
</resultMap>
```
到此，N对一 的配置就完成了。

而对于 N对多 的配置，其与 N对一 的配置是基本一致的。
比如还是按上文班级表`classes`和学生表`students`来说，他们是一对多的关系，即一个班级对应多个学生，那么其关联关系在 [MyBatis] 中的配置具体如下：
1）配置班级表`classes`数据获取 SQL 语句：
```
<!--com/yn/interfaces/IClassesDao.xml-->
<select id="selectAll" resultMap="classStudentsMap">
	select * from classes
</select>
```
2）配置表`students`依据班级`id`获取学生数据方法：
```
// com.yn.interfaces.IStudentsDao.java
public interface IStudentsDao {
	// 一个班级 cid 对应多个学生
    List<Student> selectById(Integer cid);
}

<!--com/yn/interfaces/IStudentsDao.xml-->
<mapper namespace="com.yn.interfaces.IStudentsDao">
    <resultMap id="studentResultMap" type="com.yn.bean.Student">
        <constructor>
            <arg column="name" javaType="String"/>
            <arg column="sex" javaType="String"/>
            <arg column="class_id" javaType="_int"/>
        </constructor>
        <result property="classId" column="class_id"/>
    </resultMap>

    <select id="selectById" parameterType="INT" resultMap="studentResultMap">
        select * from students where class_id=#{cid}
    </select>
    ...
</mapper>
```
3）最后，为主表配置副表数据加载方法：
```
<!--com/yn/interfaces/IClassesDao.xml-->
<resultMap id="classStudentsMap" type="com.yn.bean.Classes">
	<id property="id" column="id" />
	<result property="name" column="name" />
	<result property="studentId" column="stu_id" />
	<collection property="students" ofType="com.yn.bean.Student" column="id" select="com.yn.interfaces.IStudentsDao.selectById">
	</collection>
</resultMap>
```
至此，N对多 的延迟加载特定已配置完成。

**注**：我们上面在全局配置表中开启了全局延迟加载模式，所以对于所有的关联表，默认都会开启延迟加载，但是可以通过为标签`association`/`collection`添加`fetchType`来显示覆盖全局配置，其取值有两个：`eager`表示立即加载，`lazy`表示延迟加载。

比如，我们前面也提到过，对于 N对一 关联的数据库表，通常使用的是立即加载模式，那么我们就可以按如下配置，启动立即加载：
```
<!--com/yn/interfaces/IStudentsDao.xml-->
<resultMap id="studentClassMap" type="com.yn.bean.Student">
	<result property="name" column="name"/>
	<result property="sex" column="sex"/>
	<result property="classId" column="class_id"/>

	<association fetchType="eager" property="cls" column="class_id" javaType="com.yn.bean.Classes" select="com.yn.interfaces.IClassesDao.selectById">
	</association>
</resultMap>
```

缓存
----------
对访问频繁且不常变化的数据进行缓存，可以减少与数据库的交互，提高执行效率。

[MyBatis] 为我们提供了两种缓存功能：
* **一级缓存**：也成为 **本地缓存**，由`SqlSession`对象实例负责缓存。使用同一个`SqlSession`实例进行同一查询，后续的查询结果都是从一级缓存中获取。但该`SqlSession`实例销毁时，缓存随之销毁。

**注**：对于一级缓存而言，其有如下特性：
1. 一级缓存默认开启
2. 一级缓存其实内部是一个`Map`结构，其缓存的是对象实例（相应 POJO 类实例）
3. 但调用`SqlSession`的增加，修改，删除，commit(),close()等方法时，其一级缓存会被清空

* **二级缓存**：由`SqlSessionFactory`对象实例负责缓存。由同一个`SqlSessionFactory`实例生产的`SqlSession`对象实例共享该二级缓存。

**注**：对于二级缓存而言，其有如下特性：
1. 二级缓存默认不开启。手动开启方法如下：
1）全局配置文件中开启二级缓存（可选操作，因为默认已开启）：
```
<!--resources/MyBatisConfig.xml-->
<configuration>
    ...
    <settings>
        <!-- 开启二级缓存 -->
        <setting name="cacheEnabled" value="true"/>
    </settings>
    ...
</configuration>
```
2）在当前配置映射文件中开启二级缓存：
```
<!--com/yn/interfaces/IClassesDao.xml-->
<mapper namespace="com.yn.interfaces.IClassesDao">
    <!--配置映射文件开启二级缓存-->
    <cache />
    ...
</mapper>
```
3）在当前数据库操作中开启二级缓存（注：POJO 类需要实现序列化接口）：
```
<!--com/yn/interfaces/IClassesDao.xml-->
<mapper namespace="com.yn.interfaces.IClassesDao">
    ...
    <!--操作开启二级缓存-->
    <select id="selectAll" resultMap="classStudentsMap" useCache="true">
        select * from classes
    </select>
    ...
</mapper>
```
2. 二级缓存工作机制：在会话中，进行查询只会将结果保存到一级缓存中。只有当会话关闭时，才会将一级缓存的内容保存到二级缓存中（序列化）。
3. **二级缓存缓存的是数据（即序列化）**,也即 SQL 操作从二级缓存获取数据后，再重新组装成对象实例（序列化）。而一级缓存直接缓存的就是对象实例。


其他
------------------
下面列举一些常用配置具体实现：

* **主键自增**：对于插入语句，如果数据库支持自动生成主键的字段（比如 MySQL 和 SQL Server）：比如我们上文入门案例中的使用自增字段`id`作为表`students`的主键。那么此时，可以设置 `useGeneratedKeys=”true”`，然后再把`keyProperty`设置到目标属性上就 OK 了：
```xml
<insert id="add" parameterType="student" useGeneratedKeys="true" keyProperty="id">
    insert into students(name,sex,cls) values(#{name},#{sex},#{cls})
</insert>
```
如果数据库还支持多行插入，那么我们可以传入一个`Student`数组或者集合，并返回自动生成的主键：
```
public interface IStudentsDao {
    ...
    void addAll(List<Student> students);
    ...
}


<!-- IStudentsDao.xml -->
<insert id="addAll" parameterType="java.util.List" useGeneratedKeys="true" keyProperty="id">
    insert into students(name,sex,cls) values
    <foreach collection="list" item="stu" separator=",">
        (#{stu.name},#{stu.sex},#{stu.cls})
    </foreach>
</insert>
```

* **结果映射**：通常来说，我们自定义的 Java Bean 的成员应该与数据库表的字段名称一致，这样 [MyBatis] 就能自动地帮我们进行数据转换。但在实际开发中，往往会出现 Java Bean 的成员名称与数据库表字段名称不一致的情况：比如，我们将上文入门案例的数据库表`students`的`cls`字段更改为`class`：
```sql
alter table students change column cls class int not null;
```
现在，`Student`的成员`cls`就无法匹配数据库表`students`的`class`字段了，我们先查看下表`students`的内容：

![](https://upload-images.jianshu.io/upload_images/2222997-331ae7384a3dcc8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后我们在运行一下获取操作：`selectAll()`，结果如下所示：

![](https://upload-images.jianshu.io/upload_images/2222997-d2a615e70e49ad34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，数据库的`class`字段获取不到了。因此，这里我们需要配置`Student`的`cls`成员到数据库表`students`的`class`字段的映射：比如，我们可以通过更改 Sql 语句来让数据库表`students.class`字段映射到`Student.cls`：
```xml
<select id="selectAll" resultType="student">
    select id,name,sex,class as cls from students
</select>
```
但是，Sql 语句的配置会显得繁琐些，尤其当需要配置字段较多的时候，因此，[MyBatis] 已经为我们提供了相关方法（`resultMap`）解决这个问题，其具体配置如下所示：
```xml
<mapper namespace="com.yn.interfaces.IStudentsDao">
    <!--配置mysql表列名与实体类属性的映射关系-->
    <resultMap id="studentResultMap" type="com.yn.bean.Student">
        <!--主键使用标签 id -->
        <!--<id property="id" column="id"/>-->
        <!--property指Java Bean成员，column指对应数据库字段名-->
        <result property="cls" column="class"/>
    </resultMap>

    <select id="selectAll" resultMap="studentResultMap">
        select * from students;
    </select>
</mapper>
```
其实就是配置一个`resultMap`，并将该`resultMap`放置到所需方法中即可。





[mybatis]:http://www.mybatis.org/mybatis-3

[maven]:http://maven.apache.org/

[mysql-connector]:https://mvnrepository.com/artifact/mysql/mysql-connector-java/8.0.16

[log4j]:https://mvnrepository.com/artifact/log4j/log4j/1.2.17

[getting-started.html]:http://www.mybatis.org/mybatis-3/getting-started.html

[configuration]:http://www.mybatis.org/mybatis-3/configuration.html

[properties]:http://www.mybatis.org/mybatis-3/configuration.html#properties

[typeAliases]:http://www.mybatis.org/mybatis-3/configuration.html#typeAliases

[mappers]:http://www.mybatis.org/mybatis-3/configuration.html#mappers

[MapperXML]:www.mybatis.org/mybatis-3/sqlmap-xml.html

[select]:http://www.mybatis.org/mybatis-3/sqlmap-xml.html#select

[insert_update_delete]:http://www.mybatis.org/mybatis-3/sqlmap-xml.html#insert_update_and_delete

[dynamic-sql]:http://www.mybatis.org/mybatis-3/dynamic-sql.html






