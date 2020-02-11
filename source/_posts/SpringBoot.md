---
tags:
- java
- spring
- springboot

password: 123456
---

前言
------------------
当前 Java 领域主流的 Web 应用开发框架是 **SSM**，即 Spring+SpringMVC+MyBatis。

Spring 的核心功能是 IOC 和 AOP，大量的其他框架组件借助这两个功能很好地集成到了 Spring Framework 中，简化了代码的开发难度。然而，其基于配置的开发模式，不同的框架有不同的设计理念，导致对每一个框架，都有不同的配置选项，随着项目规模的不断扩大，第三方框架的不断集成，最终配置文件逐渐冗余与复杂，导致“配置地狱”。

代码编写与文件配置是两种不同的思维方法，Spring 简化了代码编写，却又带来了文件配置方面的时间损耗，再加上复杂的依赖管理等问题，Java Web 开发逐渐变得不是那么顺畅。

Java 的一个生命力体现就在于它每每都能在某个关键时期迸发出自己的活力，无论是 PC互联网的 Spring 大家族，还是移动互联网的 Android，甚至于当前大数据时代下，Java 还是拥有一席之地···

因此对于上述 Spring 开发企业级 JavaEE 出现的问题，Java 又再一次展现出勃勃生机，新的框架应运而生 - **[Spring Boot]**。
<!-- more -->

[Spring Boot] 简介
--------------------------------
>**BUILD ANYTHING WITH SPRING BOOT**
>
>Spring Boot is the starting point for building all Spring-based applications. Spring Boot is designed to get you up and running as quickly as possible, with minimal upfront configuration of Spring.

[Spring Boot] 是用于构建基于 Spring 应用的起点。[Spring Boot] 的设计理念是 **约定优于配置**，以最小的配置让应用尽可能快的运行起来。

* **约定优于配置（convention over configuration）**：其是一种软件设计范式，通过定制一些默认约定规则，减少程序员自定义行为，简化程序开发。

通过遵守约定的行为，就可以省略一些默认配置选项；
对于不符合约定的部分，才需要进行相关配置。

比如：
* 我们约定 Controller 层就是 Web 请求层，那么就可以省略 SpringMVC 的配置；
* 我们约定以 Service 结尾的类就是业务层，我们就会对其自动注入事务，此时就可以省略 Spring 切面事务的配置。
···

**约定优于配置** 的设计理念在 [Spring Boot] 体系中体现的淋漓尽致，小到配置文件、中间件的默认配置，大到内置容器、生态中的各种 Starters 无不遵循此设计规则。

遵循 **约定优于配置** 理念，以后无论我们引入多少第三方框架库，也无须进行配置，可以直接进行业务开发，让编程变得简单。

[Spring Boot] 特点
------------------------------------
* 创建独立 Spring 应用

* 内置 Tomcat，Jetty 和 Undertow 三种 Web容器（无需发布 WAR 包）
 
* 提供内置 **Starter** 依赖，简化构建配置

* 自动配置 Spring 和 第三方库

* 提供测量，健康检测和外部配置等产品特性

* 无代码生成，无需 XML 配置

* **[Spring Boot] 不是对 Spring 功能上的增强，而是提供了一种快速使用 Spring 的方式**

快速入门
-------------------
例子：编写一个 Web 应用，要求浏览器访问`localhost:8080/hello`，输出`Hello Spring Boot!`。

具体步骤如下：
1. 创建一个 Maven 普通 Java 工程：

![Java Project](https://upload-images.jianshu.io/upload_images/2222997-f90548059407d33c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 添加 [Spring Boot] 项目起步依赖：[spring-boot-starter-parent]
```
<!-- Spring Boot所有项目都要继承起步依赖：spring-boot-starter-parent -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.7.RELEASE</version>
</parent>
```
3. 我们需要 Web 功能，因此需要添加一个提供 Web 功能的起步依赖：[spring-boot-starter-web]
```xml
    <dependencies>
        <!-- 添加 Web 功能起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
```
4. 编写 [Spring Boot] 引导类：
```
@SpringBootApplication // 声明当前类是 Sprig Boot 的一个引导类
public class SpringBootApp {
    public static void main(String[] agrs) {
        SpringApplication.run(SpringBootApp.class);
    }
}
```
5. 创建一个`Controller`，支持 Web 访问：
```
@Controller
public class HelloController {

    @RequestMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```
6. 启动应用，浏览器直接输入：`localhost:8080/hello`，就可以看到结果。

**总结**：根本无须任何 XML 配置。




核心功能
--------------------------------------
[Spring Boot] 核心功能有两个：**起步依赖（Starter）** 和 **自动配置**。

* **起步依赖（Starter）**：Starter 是一种为应用添加依赖的简便描述符，具备为快速应用开发提供 "一站式服务" 的能力。本质上 Starter 是一个 Maven 项目对象模型（Project Object Model，POM），定义了对其他库的传递依赖，共同完成某一项功能。

传统应用开发，我们导入第三方库时，需要拷贝粘贴该库及其关联库，还要抓取一些样本代码，但是借助于 Starter，我们只需引入该库对应 Starter 即可，由于其遵循 **约定优于配置**，因此很多配置都采用了默认项，一般情况下只需零配置或少量配置就可以使用组件功能。

比如，像之前我们要搭建一个 Web 工程的时候，会导入 [SpringMVC] 相关依赖：
```
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-web</artifactId>
  <version>5.1.9.RELEASE</version>
</dependency>
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-webmvc</artifactId>
  <version>5.1.9.RELEASE</version>
</dependency>
```
也就是分别需要导入`spring-web`和`spring-webmvc`两个依赖，且版本号最好保持一致。而在 [Spring Boot] 中，只需导入一个相关 Starter：
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
这里我们无需导入版本号，因为`spring-boot-starter-parent`内部已提供了常用库的默认版本依赖。

进入`spring-boot-starter-web`，可以看到：
```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <version>2.1.7.RELEASE</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-json</artifactId>
        <version>2.1.7.RELEASE</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
        <version>2.1.7.RELEASE</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.hibernate.validator</groupId>
        <artifactId>hibernate-validator</artifactId>
        <version>6.0.17.Final</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>5.1.9.RELEASE</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.1.9.RELEASE</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```
`spring-boot-starter-web`这个 Starter 其实内置了常用的 Web 依赖，包括：
* `spring-web`/`spring-webmvc`：[SpringMVC] 依赖包
* `spring-boot-starter-json`：JSON 支持库
* `spring-boot-starter-tomcat`：内置 Tomcat 服务器
......


简单来说，**起步依赖（Starter）** 就是将具备某种功能的坐标打包到一起，并且自动处理各个坐标之间的依赖与版本匹配问题。

下面 简单分析下 [Spring Boot] **起步依赖（Starter）** 的实现原理：

1. 首先看下`spring-boot-starter-parent`内容：
```
<project ...>
    ...
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.1.7.RELEASE</version>
        <relativePath>../../spring-boot-dependencies</relativePath>
    </parent>
    ...
    <properties>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
        <resource.delimiter>@</resource.delimiter>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>
    <build>
        <resources>
            <resource>
                <filtering>true</filtering>
                <directory>${basedir}/src/main/resources</directory>
                <includes>
                    <include>**/application*.yml</include>
                    <include>**/application*.yaml</include>
                    <include>**/application*.properties</include>
                </includes>
            </resource>
            ...
    </build>
</project>
```
`spring-boot-starter-parent`该 Starter 主要三方面内容：
1）对 Java 版本，源码编译版本，源码编码等进行设置：
```
<properties>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
    <resource.delimiter>@</resource.delimiter>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```
2）引入自定义配置文件：`resources/application*.yml`/`resources/application*.yaml`/`resources/application*.properties`：
```
<resource>
    <filtering>true</filtering>
    <directory>${basedir}/src/main/resources</directory>
    <includes>
        <include>**/application*.yml</include>
        <include>**/application*.yaml</include>
        <include>**/application*.properties</include>
    </includes>
</resource>
```
开发人员可通过自定义配置文件覆盖 [Spring Boot] 的默认配置。

3）`spring-boot-starter-parent`继承起步依赖：`spring-boot-dependencies`：
```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.1.7.RELEASE</version>
    <relativePath>../../spring-boot-dependencies</relativePath>
</parent>
```
我们进入`spring-boot-dependencies`，可以看到：
```
...
<!-- 版本控制 -->
  <properties>
    <aspectj.version>1.9.4</aspectj.version>
    <dom4j.version>1.6.1</dom4j.version>
    <elasticsearch.version>6.4.3</elasticsearch.version>
    <jackson.version>2.9.9</jackson.version>
    <junit.version>4.12</junit.version>
    <mysql.version>8.0.17</mysql.version>
    <netty.version>4.1.38.Final</netty.version>
    <slf4j.version>1.7.26</slf4j.version>
    <spring.version>5.1.9.RELEASE</spring.version>
    <spring-framework.version>${spring.version}</spring-framework.version>
    <spring-security.version>5.1.6.RELEASE</spring-security.version>
    <thymeleaf.version>3.0.11.RELEASE</thymeleaf.version>
    <tomcat.version>9.0.22</tomcat.version>
    ...
  </properties>
  <!-- 依赖管理 -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot</artifactId>
        <version>2.1.7.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
        <version>2.1.7.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <version>2.1.7.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <version>2.1.7.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
        <version>2.1.7.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson</groupId>
        <artifactId>jackson-bom</artifactId>
        <version>${jackson.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-to-slf4j</artifactId>
        <version>${log4j2.version}</version>
      </dependency>
      <dependency>
        <groupId>org.apache.tomcat</groupId>
        <artifactId>tomcat-annotations-api</artifactId>
        <version>${tomcat.version}</version>
      </dependency>
      <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>${mysql.version}</version>
        <exclusions>
          <exclusion>
            <artifactId>protobuf-java</artifactId>
            <groupId>com.google.protobuf</groupId>
          </exclusion>
        </exclusions>
      </dependency>
      <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>${aspectj.version}</version>
      </dependency>
      ...
      </plugins>
    </pluginManagement>
  </build>
</project>
```
`spring-boot-dependencies`内置了许多常用库的版本（`<properties>`）与依赖管理（`<dependencyManagement>`）。当我们在自己的项目中引入了第三方库时，如果此时`spring-boot-dependencies`已经内置了该库（根据`groupId`和`artifactId`进行匹配），那么就会加载该库并使用内置定义的版本及其配置。这也是为什么我们前面说有些 Starter 无须引入版本号的原因，因为`spring-boot-dependencies`已经为我们配置了兼容当前版本`spring-boot-starter-parent`的所有依赖版本。

**Starter** 是 [Spring Boot] 的一大特色，在项目启动的时候，根据约定信息对组件进行加载，初始化，达到 ”开箱即用“ 的效果

**Starter** 的效用已深入人心，不仅 [Spring Boot] 官方提供了大量的 Starter，其他的开源框架也都主动提供了相应的 Starter 组件，比如 MyBatis···。

[Spring Boot] 现在如此受欢迎的原因之一，就在于其提供了大量的 Starter，依赖如此丰富且功能强大，却又支持 "开箱即用" 的模块，可以让软件开发人员更加专注与高效地进行业务开发。

* **自动配置**：[Spring Boot] 提供了一些满足日常开发常用库的默认配置类，在应用程序启动时，[Spring Boot] 会反射加载对应库的默认配置类到 Spring 容器中，完成默认配置。

**自动配置** 的实现原理如下所示：

1. 在快速入门案例中，我们知道需要使用注解`@SpringBootApplication`来标记一个 [Spring Boot] 的启动引导类，因此我们首先看下`@SpringBootApplication`源码：
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
    @AliasFor(
        annotation = EnableAutoConfiguration.class
    )
    Class<?>[] exclude() default {};

    @AliasFor(
        annotation = EnableAutoConfiguration.class
    )
    String[] excludeName() default {};

    @AliasFor(
        annotation = ComponentScan.class,
        attribute = "basePackages"
    )
    String[] scanBasePackages() default {};

    @AliasFor(
        annotation = ComponentScan.class,
        attribute = "basePackageClasses"
    )
    Class<?>[] scanBasePackageClasses() default {};
}
```
可以看到，`@SpringBootApplication`其实是一个组合注解，相当于`@SpringBootConfiguration`+`@ComponentScan`+`@EnableAutoConfiguration`，其中：
1）**`@SpringBootConfiguration`**：其实就是注解`@Configuration`，即 Spring 的一个配置类，相当于 XML 配置的`<beans>`，其源码如下：
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {
}
```
2）**`@ComponentScan`**：该注解会扫描当前类的包及其子包的所有类。因此，[Spring Boot] 在启动时，就会自动扫描启动引导类所在的包及其子包，把被`@Configuration`/`@Controller`等注解注解的类配置到 Spring 容器中。

3）**`@EnableAutoConfiguration`**：见名知意，该注解就是用于使能自动配置功能，我们看下该注解源码：
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```
从源码中看到，该注解导入了一个配置类：`AutoConfigurationImportSelector（自动配置导入选择器）`，那我们看下该配置类源码：
```
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        ...
        AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(autoConfigurationMetadata, annotationMetadata);
        ...
    }

    protected AutoConfigurationImportSelector.AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
        ...
        List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
        ...
    }

    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
        Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
        return configurations;
    }

    protected Class<?> getSpringFactoriesLoaderFactoryClass() {
        return EnableAutoConfiguration.class;
    }
    ...
}
```
该类中方法`getAutoConfigurationEntry`用于获取自动配置入口，其内部调用了方法`getCandidateConfigurations`，用于获取可选的默认配置项。
从`getCandidateConfigurations`内部注释中可以看到，其自动配置类位于`META-INF/spring.factories`文件中，我们来看下`SpringFactoriesLoader.loadFactoryNames`源码，看下是否正确：
```
public final class SpringFactoriesLoader {
    ...
    public static List<String> loadFactoryNames(Class<?> factoryClass, @Nullable ClassLoader classLoader) {
        // 即 EnableAutoConfiguration
        String factoryClassName = factoryClass.getName(); 
        return (List)loadSpringFactories(classLoader).getOrDefault(factoryClassName, Collections.emptyList());
    }

    private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
        ...
        Enumeration<URL> urls = classLoader != null ? classLoader.getResources("META-INF/spring.factories") : ClassLoader.getSystemResources("META-INF/spring.factories");
        while(urls.hasMoreElements()) {
            Properties properties = PropertiesLoaderUtils.loadProperties(resource);
            ...
        }
    }
}
```
`SpringFactoriesLoader.loadFactoryNames`的第一个参数为`EnableAutoConfiguration.class`，然后该方法会调用`SpringFactoriesLoader.loadSpringFactories`方法，`loadSpringFactories`内部会加载`META-INF/spring.factories`文件，把配置文件内容封装成`Properties`对象，最终封装到一个`Map`中，组后将`META-INF/spring.factories`文件中`key`为`EnableAutoConfiguration`的所有值取出（`getOrDefault`），这些值其实就是 **自动配置类的全限定名**。

![](https://upload-images.jianshu.io/upload_images/2222997-5a346d9cefa8bc2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来我们看下`META-INF/spring.factories`的文件内容：
```xml
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration,\
...
```
可以看到，[Spring Boot] 内置了许多我们常用的自动配置类，比如`aop`，`web`，`elasticsearch`等等，这些类的命名遵循一定规则：`xxxAutoConfiguration`，即末尾都为`AutoConfiguration`。

到此，我们就知道了，在 [Spring Boot] 启动时，就会加载`META-INF/spring.factories`文件信息，筛选出`key`为`EnableAutoConfiguration`的自动配置类全限定名，然后反射创建类实现自动配置。

接下来我们来分析下自动配置类的默认配置过程，此处随便选择一个自动配置类，比如：`ServletWebServerFactoryAutoConfiguration`，查看下其源码：
```java
@Configuration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
		ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
		ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
		ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {
...
}
```
其中，`@EnableConfigurationProperties(ServerProperties.class)`表示加载配置属性类`ServerProperties`，查看下`ServerProperties`源码：
```
@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)
public class ServerProperties {

	/**
	 * Server HTTP port.
	 */
	private Integer port;

	/**
	 * Network address to which the server should bind.
	 */
	private InetAddress address;
    ...
}
```
注解`@ConfigurationProperties`支持 Spring 元数据，被`@ConfigurationProperties`注解的节点对象在被创建时，其成员变量会从外部配置文件（`application*.yml`/`application*.yaml`/`application*.properties`）中获取对应值并进行设置。

因此，对于`ServerProperties`来说，在 [Spring Boot] 进行加载时，如果有外部配置文件设置了`server.port`，则其成员变量`port`会自动被赋值；如果没有进行设置，则使用默认值，默认值位于类`Tomcat`中：
```
package org.apache.catalina.startup;

public class Tomcat {
    ...
    protected int port = 8080;
    ...
}
```
以上，便是 [Spring Boot] 的自动配置全过程。


[Spring Boot] 配置文件
--------------------------------------
前面我们提过，[Spring Boot] 是基于约定的，因此有很多的配置项都有默认值（具体配置项默认值请查看：[common-application-properties]）。

如果我们想修改默认配置，那么可以通过在`resources`目录下创建配置文件：`application*.yml`/`application*.yaml`/`application*.properties`，在其中覆写配置项即可。

[Spring Boot] 支持 properties 和 YML格式的配置文件：
* **properties**：就是键值对，比较简单直接。
```
# application.properties
server.port=8081
```
* **YML**：YML 文件格式是 YAML（YAML Aint Markup Language）编写的文件格式，YAML 是一种直观的能够被电脑识别的的数据数据序列化格式，并且容易被人类阅读，容易和脚本语言交互的，可以被支持YAML库的不同的编程语言程序导入，比如： C/C++，Ruby，Python，Java，Perl，C#，PHP 等。YML 文件是 **以数据为核心** 的，比传统的 xml 方式更加简洁。
**注**：YML 文件的扩展名可以使用`.yml`或者`.yaml`。

**注**：前面 **起步依赖（Starter）**中有提及，`spring-boot-starter-parent`里面配置了外部配置文件的加载顺序：**`application*.yml` > `application*.yaml` > `application*.properties`**，越晚加载则优先级越高，即`application*.properties`的配置会覆盖`.yaml`/`.yml`配置。 
```
<resource>
    <filtering>true</filtering>
    <directory>${basedir}/src/main/resources</directory>
    <includes>
        <include>**/application*.yml</include>
        <include>**/application*.yaml</include>
        <include>**/application*.properties</include>
    </includes>
</resource>
```

下面对 YML 文件配置语法进行简单介绍：

* **配置普通键值对数据**

语法：
```yml
key: value
```

示例：
```yml
name: Whyn
```

* **配置对象数据**

语法：YML 配置对象语法有两种格式：
1. 缩进配置（推荐）
```yml
object:
  key1: value1
  key2: value2
```
2. 行内对象配置
```yml
object: {key1: value1,key2: value2}
```
示例：
```yml
# 缩进配置
user:
  name: Whyn
  age: 10
  addr: shenzhen

# 行内对象配置
user2: {name: Whyn,age: 10,addr: shenzhen}
```

* **配置复杂/集合类型数据**

语法：YML 配置复杂/集合类型数据语法有两种格式：
1. 缩进配置（推荐）
```yml
array:
  - value1
  - value2
```
2. 行内配置
```yml
array: [value1,value2]
```

示例：
```yml
# 缩进配置
# 集合元素为普通字符串
city:
  - beijing
  - shanghai
  - guangzhou
  - shenzhen

# 集合元素为对象
users:
  - name: Whyn1
    age: 10
    addr: shenzhen
  - name: Whyn2
    age: 11
    addr: beijing

# 行内配置
city1: [beijing,shanghai,guangzhou,shenzhen]
users1: [{name: Whyn1,age: 10,addr: shenzhen},{name: Whyn2,age: 11,addr: beijing}]
```

**注**：YML 配置文件中，冒号`:`和横杠`-`后面若带值，必须在其后带一个空格。
建议在 YML 文件中，凡是遇到冒号`:`和横杠`-`就在其后加一个空格。

[Spring Boot] 集成其他框架
-------------------------------------
前面说过，很多第三方库都提供了相应的 Starter，这为 [Spring Boot] 集成该框架带来了极大便利性。

下面我们主要介绍两个集成案例，其他框架的集成与之类似。
* **[Spring Boot] 集成 JUnit**：具体步骤如下：
1. 导入 JUnit 的起步依赖（Starter）：[spring-boot-starter-test]
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```
2. 下面就可以编写 Spring 的测试程序：
```
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpringBootApp.class) // 引导类
public class HelloControllerTest {

    @Autowired
    private HelloController controller;

    @Test
    public void hello() {
        assertNotNull(this.controller);
    }
}
```

* **[Spring Boot] 集成 MyBatis**：具体步骤如下：

1. 导入 MyBatis 的 起步依赖（Starter）：[mybatis-spring-boot-starter]
```
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```
2. 导入数据库连接驱动：[mysql-connector-java]
```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```
3. 创建一张`users`表：
```
create table if not exists users (
    -> id int primary key auto_increment,
    -> name varchar(20) not null,
    -> age int not null,
    -> address varchar(30));
```
4. 创建`users`表对应 POJO 类：
```
public class User implements Serializable {
    private Integer id;
    private String name;
    private Integer age;
    private String address;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
    }
}
```
5. 创建`users`表操作接口：
```
@Mapper
public interface IUserDao {
    // 增：添加用户
    void add(User user);

    // 删：删除用户
    void delete(String name);

    // 改：更改信息
    void update(User user);

    // 查：查询所有
    List<User> selectAll();
}
```
6. `resources`目录下创建表的映射配置文件：`mapper/UserMapper.xml`
```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yn.dao.IUserDao">

    <insert id="add" parameterType="com.yn.entity.User">
        insert into users(name,age,address) values(#{name},#{age},#{address})
    </insert>

    <delete id="delete" parameterType="String">
        delete from users where name=#{name}
    </delete>

    <update id="update" parameterType="com.yn.entity.User">
        update users set age=#{age},address=#{address} where name=#{name}
    </update>

    <select id="selectAll" resultType="com.yn.entity.User">
        select * from users
    </select>
</mapper>
```
7. 在`resources/application.properties`中配置数据库相关信息 和 MyBatis 相关信息：
```
# 数据库连接信息
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&useSSL=true
spring.datasource.username=root
spring.datasource.password=password
# 配置 MyBatis 信息
# Spring 集成 MyBatis环境
# POJO 别名扫描包
mybatis.type-aliases-package=com.yn.entity
# 加载 MyBatis 映射文件
mybatis.mapper-locations=classpath:mapper/*Mapper.xml
```
[Spring Boot] 会自动加载`spring.datasource.*`相关配置，数据源就会自动注入到`SqlSessionFactory`中，`SqlSessionFactory`会自动注入到`Mapper`中，我们什么都不用管，直接使用就行。
8. 到上面其实已经配置完成了，这里我们可以编写测试用例进行检测：
```
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpringBootApp.class)
public class IUserDaoTest {

    @Autowired
    IUserDao userDao;

    @Test
    public void add() {
        User user = new User();
        user.setName("Whyn01");
        user.setAge(10);
        user.setAddress("深圳");
        this.userDao.add(user);

        user = new User();
        user.setName("Whyn02");
        user.setAge(12);
        user.setAddress("北京");
        this.userDao.add(user);
    }

    @Test
    public void delete() {
        this.userDao.delete("Whyn02");
    }

    @Test
    public void update() {
        User user = new User();
        user.setName("Whyn01");
        user.setAge(12);
        user.setAddress("上海");
        this.userDao.update(user);
    }

    @Test
    public void selectAll() {
        List<User> users = this.userDao.selectAll();
        System.out.println(users);
    }
}
```
其他
------------------
* **~~[Spring Boot] 支持热部署~~**：热部署在修改代码后，[Spring Boot] 可以自动进行编译并启动，达到实时更新效果。具体配置步骤如下：
1. 导入热部署起步依赖（Starter）：
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-devtools</artifactId>
</dependency>
```
2. 对于 IDEA，还需进行以下设置：
1）打开自动编译：*File - Settings - Compiler*，勾选：*Build project automatically*
2）开启 IDEA 的自动编译（动态）：快捷键 *Ctrl+Shift+Alt+/*，选择 *Registry*，勾选：*compiler.automake.allow.when.app.running*
3. 重新运行程序，热部署即可启动。


参考
-------
* [Spring Boot 产生的背景和它的设计理念]
* [Spring Boot面试杀手锏————自动配置原理]
* [SpringBoot自动配置原理]
* [Spring Boot 配置文件]










[Spring Boot]:https://docs.spring.io/spring-boot/docs/current/reference/html/

[SpringMVC]:https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc

[spring-boot-starter-parent]:https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-parent

[spring-boot-starter-web]:https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web

[Spring Boot 产生的背景和它的设计理念]:https://gitbook.cn/gitchat/column/5b86228ce15aa17d68b5b55a/topic/5b93c957780fdb5e97d2f35c

[spring-boot @ConfigurationProperties脑洞真大]:https://blog.csdn.net/guduyishuai/article/details/70879952

[SpringBoot自动配置原理]:https://segmentfault.com/a/1190000018011535

[Spring Boot 原理分析]:https://zhuanlan.zhihu.com/p/53016043

[Spring Boot面试杀手锏————自动配置原理]:https://blog.csdn.net/u014745069/article/details/83820511


[common-application-properties]:https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#common-application-properties

[Spring Boot 配置文件]:https://zhuanlan.zhihu.com/p/53294876

[mybatis-spring-boot-starter]:https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter

[mysql-connector-java]:https://mvnrepository.com/artifact/MySQL/mysql-connector-java

[spring-boot-starter-test]:https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-test
