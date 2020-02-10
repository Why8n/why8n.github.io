---
tags:
- java
- spring
---

简介
---------------------
首先明确一下概念：

* **Spring**：指 Spring Framework 以及基于 Spring Framework 上构建的[项目][projects]的集合。简而言之，Spring 是一个大集合，它由许多基于 Spring Framework 构建的开源框架和组件组成。

* **[Spring Framework][spring-framework]**：中文称为 *Spring框架*，是 Spring 里面的一个开源框架，提供了很多模块与组件，方便快速进行 JavaEE 企业级应用开发。

**[注][What We Mean by "Spring"]**：现实生活中，我们一般讲到 Spring，一般就是指代 Spring Framework。因此，下文中所有出现 Spring 位置的地方，均指 Spring Framework，请知悉。

[Spring 架构体系（5.0）][Introduction to the Spring Framework]
--------------------------
![Spring Framework Runtime](https://upload-images.jianshu.io/upload_images/2222997-c57fa2d581efc4bb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Spring框架是一个分层架构，从总体来看，Spring 分为3层，最底层是核心层，包括 IOC、AOP 等核心模块，中间层是封装的 JavaEE 服务、作为中间的驱动组件，最上层是各个应用。

组成 Spring框架的每个模块（或组件）都可以单独存在，或者与其他一个或多个模块联合实现。每个模块的功能如下：

* **核心容器（Core Conatiner）**：Spring 核心容器是 Spring框架中最重要的模块，其主要提供了 Spring 基础功能之一的 IOC 功能，其他层次的模块必须构建于核心容器之上。

核心容器由 spring-core、spring-beans、spring-context、spring-context-support 和 spring-expression 模块组成：

核心容器中 spring-core、spring-beans 提供了框架的基本功能，包括控制反转（IOC），其主要组件是 [BeanFactory]，借助复杂工厂模式的实现，将配置和特定的依赖从实际程序逻辑中解耦。

context 模块建立在 core 和 beans 模块的基础上，增加了对国际化的支持、事件广播、资源加载和创建上下文，[ApplicationContext] 是 context 模块的重点。

spring-context-support 提供对常见第三方库的支持，集成到 Spring上下文中，比如缓存(ehcache,guava)、通信(javamail)、调度(commonj,quartz)、模板引擎等(freemarker,velocity)。

spring-expression 模块提供了一个强大的表达式语言用来在运行时查询和操作对象图，这种语言支持对属性值、属性参数、方法调用、数组内容存储、集合和索引、逻辑和算数操作及命名变量，并且通过名称从spring的控制反转容器中取回对象。



* **面向切面编程（AOP）**：spring-aop 模块为 Spring框架提供了面向切面的编程实现，spring-aspects 模块提供了aspectj 的集成与使用。

* **服务器工具（Instrumentation）**：spring-instrument 提供一些类级的工具支持和 ClassLoader 级的实现，用于服务器。spring-instrument-tomcat 针对 tomcat 的 instrument 实现。

* **消息组件（Messaging）**：Spring框架4 包含了 spring-messaging 模块，从 Spring 集成项目中抽象出来，比如 Messge、MessageChannel、MessageHandler 及其他用来提供基于消息的基础服务。

* **数据访问/集成（Data Access/Integration）**：数据访问和集成层主要作为持久层的解决方案，其由 JDBC、ORM、OXM、JMS 和事务模块组成。

* **网络（Web）**：Web层由 spring-web、spirng-webmvc、spring-websocket 和 spring-webmvc-portlet 模块组成。

spring-web 模块提供了基本的面向 Web 开发的集成功能，例如多文件上传、使用 servert listeners 和 Web 开发应用程序上下文初始化 IOC 容器。也包含 HTTP 客户端以及 Spring 远程访问的支持的 Web 相关部分。

spring-webmvc 包含 Spring 的 model-view-controller 和 REST web services 实现的 Web 应用程序。

* **测试（Test）**：[spring-test] 模块支持通过组合 Junit 或 TestNG 来进行单元测试和集成测试，提供了连续的加载 [ApplicationContext] 并且缓存这些上下文。


Spring 优势
-------------------------
* **方便解耦，简化开发**：通过 Spring 提供的 IOC 容器，可以将对象间的依赖关系交由 Spring 进行控制，避免硬编码所造成的过度程序耦合。

* **低侵入 / 低耦合**：降低组件之间的耦合度，实现软件各层之间的解耦

* **AOP 编程支持**：通过 Spring 的 AOP 功能，为程序增加了面向切面的编程方式，从另一个维度上进行编程，可以解决传统 OOP 上难以优雅实现的一些辅助功能编程。

* **声明式事务的支持**：通过声明式方式（即配置文件方式）灵活的进行事务的管理，可以优雅解决之前单调繁琐的事务管理代码。

* **方便程序的测试**：可以用非容器依赖的编程方式进行几乎所有的测试工作，测试不再是昂贵的操作而是随手可做的事情。

* **方便集成各种优秀第三方框架**：Spring 可以降低各种框架的使用难度，提供了对各种优秀框架（SpringMVC，MyBatis等）的直接支持。


控制反转（IOC）和 依赖注入（DI）
---------------------------------------------------
以 OOP 的思想进行代码编写时，基本上我们都会创建多个类，类与类之间存在协作关系，共同完成某个功能。

比如，假设现在我想喝绿茶，那我们就会自己去泡杯绿茶，如下代码所示：
```
public class Me {

    public static void main(String[] args) {
        // 自己泡杯绿茶
        Tea tea = new GreenTea();
        Me.drink(tea);
    }

    public static void drink(Tea tea) {
        System.out.println(tea.flavor());
    }

    private interface Tea {
        String flavor();
    }

    private static class GreenTea implements Tea {

        public String flavor() {
            return "Green Tea";
        }
    }
}
```
但是现在我突然想喝红茶了（业务需求更改），那我们就把绿茶去掉，改为红茶：
```
public class Me {

    public static void main(String[] args) {
        // 自己泡杯红茶
        Tea tea = new RedTea();
        Me.drink(tea);
    }
    ...
    private static class RedTea implements Tea {

        public String flavor() {
            return "Red Tea";
        }
    }
}
```
到这里其实就可以看出，如果我们自己（`Me`）动手创建依赖类（`GreenTea`/`RedTea`），每次当业务需求更改时，我们都要手动更改业务代码，两者之间的正向依赖耦合太重。

其实一个更好的方法就是我们自己不去泡茶，而是直接向饮品店（第三方）进行购买，想买啥口味的直接更饮品店说即可：
```
public static void main(String[] args) {
        // 向饮品店直接购买茶
        Tea tea = DrinkShop.makeTea("Red Tea");
        Me.drink(tea);
    }
    ...
    public static class DrinkShop {
        public static Tea makeTea(String flavor) {
            Tea tea = null;
            switch (flavor) {
                case "Red Tea":
                    tea = new RedTea();
                    break;
                case "Green Tea":
                    tea = new GreenTea();
                    break;
            }
            return tea;
        }
    }
}
```
我们通过一个第三方类`DrinkShop`就解耦了客户`Me`与具体饮品`GreenTea`/`RedTea`的耦合了。这其实就是工厂模式的应用，也是 IOC 的一个简单实现。

* **IOC（Inversion of Control）**：即 **控制反转**，IOC 不是一种具体的技术，而是一种设计思想。指的是将程序原本的依赖对象创建交由第三方进行管理控制，程序直接向第三方获取所需依赖对象即可。

* **依赖正控**：类间存在依赖关系时，通常直接在依赖类内直接`new`一个被依赖类，如上文在`Me`中直接创建：`new GreenTea()`/`new RedTea()`。自己需要某个对象，就自己进行创建，这种行为即称为 **依赖正控**。

* **依赖反控**：类间存在依赖关系时，依赖类直接向一个第三方管理容器获取所需依赖类即可。如上文`Me`想喝茶，直接向`DrinkShop`获取茶即可。依赖类对象的创建交由第三方容器进行管理，这种方式称为 **依赖反控**。

对于上文示例来说，`Me`从刚开始的自己动手泡茶`new GreenTea()`/`new ReaTea()`，到最后通过饮品店`DrinkShop`获取茶`DrinkShop.makeTea`，最后这个过程就是`Me`的控制被反转了（更具体来说，是`Me`获取依赖对象的过程被反转了）。

* **DI（Dependency Injection）**：即 **依赖注入**。类间存在依赖关系时，使用依赖类`Me`之前，必须向注入被依赖类`Tea`。依赖注入的方法可以通过构造函数注入或者`setter`函数注入：
```
public class Me {
    private Tea tea;
    public static void main(String[] args) {
        // 构造函数注入依赖
        Me me = new Me(new GreenTea());
        me.drink();

        me = new Me();
        // setter注入依赖
        me.setTea(new RedTea());
        me.drink();
    }

    public Me(){
    }

    public Me(Tea tea){
        this.tea = tea;
    }
    public void setTea(Tea tea){
        this.tea = tea;
    }
    public void drink(){
        System.out.println(this.tea.flavor());
    }
    ...
}
```
 **IOC** 和 **DI** 其实是对同一概念的不同描述，两者都是为了解决类间耦合，但 **IOC** 关注的是由第三方容器管理被依赖类，强调的是控制反转，而 **DI** 关注的是被依赖类如何注入到依赖类，强调的是注入。

**DI** 其实可以借助 **IOC容器** 进行依赖注入：**IOC容器** 先进行依赖查找，再进行依赖注入。

不严格情况下，通常我们将 **DI** 等同于 **IOC**。

Spring 中使用 IOC
---------------------------
这里使用 Spring IOC 复写上文示例代码，具体步骤如下：
1. 首先创建一个 Maven 普通 Java 项目，然后添加 [spring-context] 依赖：
```
<packaging>jar</packaging>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.1.9.RELEASE</version>
    </dependency>
</dependencies>
```
[spring-context] 内部包含了 Spring框架核心容器的所有功能，如下图所示：

![spring-context](https://upload-images.jianshu.io/upload_images/2222997-1aebf19bbfcc7a1d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 在`resources`资源目录下，创建配置文件`bean.xml`，并注入被依赖对象：
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置 bean 类，交由 Spring IOC容器进行管理 -->
    <bean id="redTea" class="com.yn.spring.ioc.Me$RedTea" />
    <bean id="greenTea" class="com.yn.spring.ioc.Me$GreenTea" />
</beans>
```
3. 源码获取 IOC容器管理对象，并获取依赖对象：
```
public class Me {
    public static void main(String[] args) {
        // 创建Spring框架核心容器对象，并加载配置文件
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        // 获取 bean 对象
        Tea tea = ac.getBean("greenTea", Tea.class);
        Me.drink(tea);

        // 获取 bean 对象
        tea = ac.getBean("redTea", Tea.class);
        Me.drink(tea);
    }

    public static void drink(Tea tea) {
        System.out.println(tea.flavor());
    }

    private interface Tea {
        String flavor();
    }

    private static class RedTea implements Tea {

        public String flavor() {
            return "Red Tea";
        }
    }

    private static class GreenTea implements Tea {

        public String flavor() {
            return "Green Tea";
        }
    }
}
```

Spring框架中 IOC 相关常用 api 讲解
----------------------------------------------------------
* **Spring IOC 容器**
Spring IOC 容器的设计主要涉及到以下两个接口：
1）**[BeanFactory]**：Spring IOC 容器的访问根接口。其提供的访问接口有：
![BeanFactory](https://upload-images.jianshu.io/upload_images/2222997-181f14d5d0707408.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，通过 [BeanFactory] 接口我们就可以对 Spring IOC 容器进行对象获取等操作。


&ensp;&ensp; 2）**[ApplicationContext]**：为应用提供配置的中央接口。通常在应用程序运行时，该接口只允许读操作，但在某些操作实现允许情况下，支持重载操作。

先看下 [ApplicationContext] 的继承体系：

![ApplicationContext](https://upload-images.jianshu.io/upload_images/2222997-ab7efbe3ca289284.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到 [ApplicationContext] 继承了很多了接口，其中就包括 [BeanFactory]，因此，[ApplicationContext] 也具备访问 Spring IOC 容器的功能。具体来说，[ApplicationContext] 支持以下操作：
* 提供 Bean 工厂访问应用组件接口方法，从 [ListableBeanFactory] 继承而来的。
* 具备以通用方式加载资源的能力，从 [ResourceLoader] 接口继承而来的。
* 具备事件广播能力，从 [ApplicationEventPublisher] 继承而来的。
* 具备消息处理，支持国际化操作，从 [MessageSource] 接口继承而来。
* 支持多态，子类上下文对象的配置会优先于父类对象。比如，一个父类上下文对象可以在整个 web 应用中使用，但每个 Servlet 可以拥有彼此独立的上下文对象。

[ApplicationContext] 是一个功能十分强大的接口，在实际项目中，绝大部分场景下都使用 [ApplicationContext] 访问 Spring IOC 容器。

[ApplicationContext] 是一个接口，因此它必然有自己的实现类来提供具体操作，我们来看下 [ApplicationContext] 的子类实现体系：

![ApplicationContext子类](https://upload-images.jianshu.io/upload_images/2222997-f97ddf1b9b2a85ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[ApplicationContext] 有很多实现类，这里我们着重讲述以下 3 个实现类：
* **[ClassPathXmlApplicationContext]**：独立的 XML 应用上下文对象，它可以加载类路径下的配置文件。
* **[FileSystemXmlApplicationContext]**：独立的 XML 应用上下文对象，可以加载磁盘任意路径或 URL 指向的配置文件。
* **[AnnotationConfigApplicationContext]**：独立的应用上下文对象，支持从注解中读取配置。它支持的注解有：[@Configuration]，[@Component]，被`javax.inject`注解的 JSR-330 兼容类。支持 [@register] 注解的类，支持扫描 [@scan] 注解指定类路径下所有的类。

通常如果使用 XML 配置 IOC 容器，则一般使用 [ClassPathXmlApplicationContext]；
如果使用注解配置 IOC 容器，则使用 [AnnotationConfigApplicationContext]。

**注**：默认情况下，[BeanFactory] 加载配置文件创建 IOC 容器时，使用的是延迟加载模式，也即只有在获取 bean 对象（`getBean`）时，才会反射创建对应 bean 对象；而 [ApplicationContext] 在加载配置文件创建 IOC 容器时，采用的是立即加载模式，也即扫描到标签`<bean>`后，就立即反射创建该 bean 对象。
无论是 [BeanFactory] 还是 [ApplicationContext]，均可以直接在配置文件中指定加载模式（`lazy-init`）覆盖默认加载。

Spring IOC 容器管理 bean 对象方式
-------------------------------------------------
Spring IOC 容器管理 bean 对象可以大致分为如下几种类型：
* **创建 bean 对象**：使用 XML 配置文件创建 bean 对象时，有如下两种配置方式：
1. **构建 bean 对象**：可使用如下几种方法配置进行构建 bean 对象：

&ensp;&ensp;  1）使用默认构造函数配置创建 bean 对象：
```
<bean id="redTea" class="com.yn.spring.ioc.Me$RedTea" />
```
&ensp;&ensp; 2）获取对象方法返回的对象，并存入 Spring IOC 容器：`factory-bean`指定工厂类 bean 对象，`factory-method`指定工厂类对象方法
```
public class Me {

    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        Tea tea = ac.getBean("greenTea", Tea.class);
        Me.drink(tea);
    }

    // 工厂类
    public static class DrinkShop{
        public Tea makeGreenTea(){
            return new GreenTea();
        }
    }
...
}
```
```
<!-- 创建工厂类 -->
<bean id="teaFactory" class="com.yn.spring.ioc.Me$DrinkShop" />
<!-- 指定工厂类对象方法 -->
<bean id="greenTea" factory-bean="teaFactory" factory-method="makeGreenTea" />
```
&ensp;&ensp; 3）获取静态方法返回的对象，并存入 Spring IOC 容器：`class`指定工厂类，`factory-method`指定工厂类静态方法
```
// 工厂类
public static class DrinkShop{
	// 静态方法
	public static Tea makeGreenTea(){
		return new GreenTea();
	}
}
```
```
<!-- 指定工厂类静态方法 -->
<bean id="greenTea" class="com.yn.spring.ioc.Me$DrinkShop" factory-method="makeGreenTea"/>
```
通常当要创建库提供的一个很复杂的对象时，在 XML 中配置可能相对繁琐，则此时可以采用第2和第3条创建对象的方式，直接在代码中构建复杂对象，再在配置文件中配置从方法获取对象即可。

2. **构建 bean 对象并进行依赖注入**：可使用如下几种方法进行配置：

&ensp;&ensp; 1）**注入数据类型**：构建 bean 对象，并注入基本数据类型或`String`：`value`
```
public class User {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```
```
<bean id="user" class="com.yn.entity.User">
	<property name="age" value="10" />
	<property name="name" value="Roy" />
</bean>
```
&ensp;&ensp; 2）**注入数据类型**：构建 bean 对象，并注入 bean 类型对象：`ref`。
```
<bean id="greenTea" class="com.yn.spring.ioc.Me$GreenTea" />
<bean id="me" class="com.yn.spring.ioc.Me">
    <!-- 构造函数注入 -->
    <constructor-arg name="tea" ref="greenTea" />
</bean>
```
&ensp;&ensp; 3）**注入数据类型**：构建 bean 对象，并注入复杂/集合类型对象：`array`，`list`，`set`，`map`，`props`
```
public class ComplexObject {
    private String[] arrays;
    private List<String> lists;
    private Set<String> sets;
    private Map<String, String> maps;
    private Properties properties;

    public void setArrays(String[] arrays) {
        this.arrays = arrays;
    }

    public void setLists(List<String> lists) {
        this.lists = lists;
    }

    public void setSets(Set<String> sets) {
        this.sets = sets;
    }

    public void setMaps(Map<String, String> maps) {
        this.maps = maps;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    @Override
    public String toString() {
        return String.format("%s\n%s\n%s\n%s\n%s",
                Arrays.toString(this.arrays),
                this.lists,
                this.sets,
                this.maps,
                this.properties);
    }
}
```
```
<bean id="complexObj" class="com.yn.entity.ComplexObject">
    <property name="arrays">
        <array>
            <value>AAA</value>
            <value>BBB</value>
            <value>CCC</value>
        </array>
    </property>
    <property name="lists">
        <list>
            <value>AAA</value>
            <value>BBB</value>
            <value>CCC</value>
        </list>
    </property>
    <property name="sets">
        <set>
            <value>AAA</value>
            <value>BBB</value>
            <value>CCC</value>
        </set>
    </property>
    <property name="maps">
        <map>
            <entry key="aaa" value="AAA" />
            <entry key="bbb">
                <value>BBB</value>
            </entry>
        </map>
    </property>
    <property name="properties">
        <props>
            <prop key="aaa">AAA</prop>
            <prop key="bbb">BBB</prop>
        </props>
    </property>
</bean>
```

&ensp;&ensp; 4）**依赖注入**：使用构造函数配置创建 bean 对象：`constructor-arg`
```
<bean id="greenTea" class="com.yn.spring.ioc.Me$GreenTea" />
<bean id="me" class="com.yn.spring.ioc.Me">
    <!-- 构造函数注入 -->
	<constructor-arg name="tea" ref="greenTea" />
</bean>
```
&ensp;&ensp; 5）**依赖注入**：通过`setter`函数进行配置：`property`
```
<bean id="greenTea" class="com.yn.spring.ioc.Me$GreenTea" />
<bean id="me" class="com.yn.spring.ioc.Me">
    <!-- setter函数注入 -->
	<property name="tea" ref="greenTea" />
</bean>
```

&ensp;&ensp; 6）**依赖注入**：自动注入`autowire`，配置了`autowire`的 bean 对象，Spring IOC 容器会自动查找符合需求的依赖注入到 bean 对象中。`autowire`有如下几个选项可供配置：
**`no`**：不进行自动注入，该值为默认值；
**`byName`**：根据属性名称自动进行注入；
**`byType`**：根据属性类型自动进行注入（要求：IOC 容器不能存在两个相同类型的 bean 对象）；
**`constructor`**：根据构造函数参数类型自动进行注入，与`byType`类似。
```
public class Me {
    private Tea tea;

    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        Me me = ac.getBean("me", Me.class);
        me.drink();
    }

    public void setTea(Tea tea) {
        this.tea = tea;
    }
    ...
}
```
```
<bean id="me" class="com.yn.spring.ioc.Me" autowire="byType" />
<bean id="tea" class="com.yn.spring.ioc.Me$GreenTea" />
```


* **控制 bean 对象的作用域**：默认情况下，Spring IOC 容器对配置文件中的 bean 对象都保存为单例对象，因此根据名称从 IOC 容器中获取对象，均为同一对象。可以在配置文件中使用`scope`属性配置 bean 对象的作用域：
```
<bean id="redTea" class="com.yn.spring.ioc.Me$RedTea" scope="singleton"/>
```
`scope`属性其值有如下几个选项：
**`singleton`**：全局单例模式，该选项为默认值；
**`prototype`**：原型模式，也即多例模式，每次`getBean`时，重新创建一个 bean 对象；
**`request`**：作用于 Web 应用的请求范围；
**`session`**：作用于 Web 应用的会话范围；
**`global-session`**：作用于集群环境的会话范围（全局会话范围），若处于非集群环境时，该选项等同于`session`；

* **bean 对象的生命周期**：对于不同的`scope`，bean 对象具有不同的生命周期。
1）当`scope="singleton"`时，也即默认情况下，bean 对象的生命周期与 Spring IOC 容器一致：当加载配置文件创建 IOC 容器时，bean 对象也会被加载并执行初始化函数`init-method`，当 IOC 容器关闭时，bean 对象就会执行销毁函数`destroy-method`：
```
public class User {
    private String name;
    private int age;

    public static void main(String[] args) {
        // 创建 IOC 容器并加载配置文件
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
        // 获取 bean 对象
        User user = context.getBean("user", User.class);
        System.out.println(user);
        // 关闭 IOC 容器，调用 bean 对象销毁方法
        context.close();
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void init() {
        System.out.println("invoke init method");
    }

    public void destroy() {
        System.out.println("invoke destroy method");
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```
```
<bean name="user" class="com.yn.entity.User" init-method="init" destroy-method="destroy">
    <property name="age" value="10" />
    <property name="name" value="Roy" />
</bean>
```
&ensp;&ensp;2）当`scope=prototype`时，bean 对象只有在获取（`getBean`）的时候，进行创建并执行其初始化函数`init-method`，无论 IOC 容器关闭与否，bean 对象的销毁函数绝不会被调用，因为对于原型对象，Spring IOC 容器只负责反射创建，但不进行维护。


Spring IOC 常用注解
-----------------------------
使用 XML 配置 IOC 容器时，配置与代码的隔离十分彻底，但是当配置项较多时，XML 配置会显得臃肿并且难以维护。因此，Spring框架还为我们提供了注解配置方法。

我们将 Spring 的注解配置分为如下几类：

* **配置类**：配置类相当于 XML 配置文件。其涉及的注解主要有：

1. **[@Configuration]**：该注解用于定义配置类，可替换 XML 配置文件，被注解的类内部通常会包含有一个或多个被 [@Bean] 注解的方法，这些方法将会被 [AnnotationConfigApplicationContext] 或 [AnnotationConfigWebApplicationContext] 类进行扫描，并用于构建 bean 对象，初始化 Spring IOC 容器。其相当于 XML 文件配置中的`<beans />`
```
@Configuration
public class TestConfiguration {
    public static void main(String[] args) {
        // 使用 AnnotationConfigApplicationContext 加载注解 @Configuration 注解的类，启动 IOC 容器
        ApplicationContext context = new AnnotationConfigApplicationContext(TestConfiguration.class);
        if (context != null) {
            System.out.println("Spring IOC 容器初始化成功！");
        }
    }
}
```
**注**：查看 [@Configuration] 源码，可以看到：
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {
    @AliasFor(
        annotation = Component.class
    )
    String value() default "";
}
```
源码中说 [@Configuration] 是 [@Component] 的别名，即两者作用一致。但实际上，两者不仅概念上存在区别，在一些场合下效果可能还存在不同之处（下文有提及）。

2. **[@Import]**：导入其他配置类（[@Configuration]）。通常，存在多个配置文件时，可以在一个总配置类中使用 [@Import] 导入其他配置类：
```
// config.ConfigAll
@Configuration // 总配置类
@Import({Config1.class,Config2.class})
public class ConfigAll {
    public static void main(String[] args) {
        // 加载配置类 ConfigAll.class，创建 IOC 容器并进行扫描
        ApplicationContext ac = new AnnotationConfigApplicationContext(ConfigAll.class);
        Date config1Bean = ac.getBean("date",Date.class);
        System.out.println(config1Bean);
        String config2Bean = ac.getBean("string",String.class);
        System.out.println(config2Bean);
    }
}
// config1.Config1
@Configuration 
public class Config1 {

    @Bean("date")
    @Scope("prototype")
    public Date date() {
        return new Date();
    }
}
// config2.Config2
// @Import 时可省略 @Configuration 注解，但建议加上，表明该类是一个配置类
//@Configuration
public class Config2 {

    @Bean("string")
    public String str(){
        return "Hello Import!";
    }
}
```
**注**：上述代码中直接使用：`new AnnotationConfigApplicationContext(Config1.class,Config2.class)`或`@ComponentScan("config1","config2")`也可以加载`Config1`和`Config2`两个配置类，但使用 [@Import] 组织效果会更清晰。

3. **[@PropertySource]**：加载配置文件。
```
@Configuration
@PropertySource("classpath:db.properties")
@Component("db")
public class DbConfig {
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String username;
    @Value("${jdbc.password}")
    private String password;

    public static void main(String[] args){
        ApplicationContext ac = new AnnotationConfigApplicationContext(DbConfig.class);
        DbConfig db = ac.getBean("db",DbConfig.class);
        System.out.println(db.driver);
        System.out.println(db.url);
        System.out.println(db.username);
        System.out.println(db.password);
    }
}
```

* **注解扫描类**：注解扫描类相当于指定 XML 配置文件路径，使用 XML 配置文件时，我们会手动传递该配置文件给到 Spring，让其加载配置。同样，使用注解配置，我们也需要手动指定相关扫描注解类给到 Spring，让其有个入口可以进行扫描配置。有如下两个注解扫描类：
1. **[@ComponentScan]**：指定需要扫描的包，Spring 会扫描该注解指定的包及其子包下的所有类，并把符合需求的类（指被 [@Configuration]，[@Component] 等注解的类）创建并存放进 IOC 容器中。其相当于 XML 配置的`<context:component-scan>`
```
@ComponentScan({"com.yn.entity", "com.yn.spring.ioc"})
public class Config{
    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(Config.class);
        ...
    }  
}
```
[@ComponentScan] 有以下属性：

| Modifier and Type                              | Element                                             | Description                                                                                       |
|------------------------------------------------|-----------------------------------------------------|----------------------------------------------------------------------------------------------------|
| String[]                                       | [basePackages][@ComponentScan-basePackages]         | 指定需要扫描的根包                                                                                  |
| String[]                                       | [**value**][@ComponentScan-value]                       | 等同于 [basePackages][@ComponentScan-basePackages],当未指定具体包名时，默认扫描被注解类所在的包及其子包 |
| Class<?>[]                                     | [basePackageClasses][@ComponentScan-basePackageClasses] | 指定需要扫描的类所在的包及其子包，可替换 [basePackages][@ComponentScan-basePackages]                         |
| [ComponentScan.Filter[]][ComponentScan.Filter] | [excludeFilters][@ComponentScan-excludeFilters]                                    | 指定排除扫描的类型                                                                                                |
| [ComponentScan.Filter[]][ComponentScan.Filter]                                             | [includeFilters][@ComponentScan-includeFilters]                                                  | 指定进行扫描的类型                                                                                              |
| boolean                                             | [lazyInit][@ComponentScan-lazyInit]                                                  | 指定扫描到的 bean 的加载模式                                                                                                |
| Class<? extends [BeanNameGenerator]>                                             | [nameGenerator][@ComponentScan-nameGEnerator]                                                  | 使用 [BeanNameGenerator] 命名 Spring容器扫描到的组件                                                                                                |
| String                                             | [resourcePattern][@ComponentScan-resourcePattern]                                                  | 指定要扫描的类文件匹配模式                                                                                                |
| [ScopedProxyMode]                                             | [scopedProxy][@ComponentScan-scopedProxy]                                                  | 指定是否需要为扫描到的组件创建代理对象                                                                                                |
| Class<? extends [ScopeMetadataResolver]>                                             | [scopeResolver][@ComponentScan-scopeResolver]                                                  | 使用 [ScopeMetadataResolver] 解决组件的作用域范围                                                                                                |
| boolean                                             | [useDefaultFilters][@ComponentScan-useDefaultFilters]                                                  | 指定是否使能自动扫描被 [@Component]，[@Repository]，[@Service],[@Controller] 注解的类                                                                                                |

2. **[@ComponentScans]**：作为 [@ComponentScan] 的聚合集。
```
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
public @interface ComponentScans {
    ComponentScan[] value();
}
```


**总结**：一般使用使用注解进行配置，通用模型为：
```
@Configuration // 配置 <beans />
@ComponentScan // 扫描包
@Component     // 配置 <bean />
public class Xxxx{...}
```
**注**：当 [@Configuration] 注解的类与 [`new AnnotationConfigApplicationContext(Class<?> ...)`][AnnotationConfigApplicationContext] 的参数是同一个类时，此时 [@Configuration] 可省略，因为[`new AnnotationConfigApplicationContext(Class<?> ...)`][AnnotationConfigApplicationContext] 的时候，默认就会扫描参数类。

* **创建 bean 对象**：对应 XML 配置的`<bean>`标签，涉及到的注解有如下几个：
1. **[@Component]**：表示被注解的类是一个组件，Spring 扫描会把该注解的类创建并存放到 IOC 容器中。相当于 XML 配置中的`<bean id="" class="">`
```
@ComponentScan
@Component
public class User {
    @Value("Whyn") // 使用 @Value 注入简单值
    private String name;
    @Value("12")
    private int age;

    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(User.class);
        User user = ac.getBean("user",User.class);
        System.out.println(user);
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

**注**：当 [@Component] 不指定 bean 的 id 时，则默认使用当前被注解的类名，且首字母小写。
**当使用注解进行依赖注入时，无须提供`setter`函数。**

2. **[@Controller]**/**[@Service]**/**[@Repository]**：这三个注解的作用与 [@Component] 一摸一样，只是当作用于 MVC 架构时，可以使层次更加清晰：
[@Controller]：一般用于表现层；
[@Service]：一般用于业务层；
[@Repository]：一般用于持久层；

3. **[@Bean]**：注解在方法上，Spring IOC 容器会对方法返回的 bean 对象进行管理。[@Bean] 注解通常用于被 [@Configuration] 或 [@Component] 注解的类中。
```
@Configuration // 配置 <beans />
@ComponentScan // 扫描包
public class User {

    @Bean(name = "date")
    @Scope("prototype")
    public Date getDate() {
        return new Date();
    }

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(User.class);
        System.out.println(ac.getBean("date"));
    }
}
```
**注**：建议 [@Bean] 注解在 [@Configuration] 注解的类中。如果是注解在 [@Component] 类中，可能出现与预期不符的效果，详情请查看：[Spring @Configuration vs @Component]

4. **[@Conditional]**：根据条件判断是否创建 bean 对象到 Spring IOC 容器中。该注解需要传入一个或多个实现 [`Condition`][Condition] 接口的类数组，当类数组返回`true`时，创建 bean 对象到 Spring IOC 容器中，返回`false`则不进行创建。
该注解可用于类和方法上，当用于类时，会对类内一系列创建 bean 对象进行判断；当用于方法时，只对该方法创建 bean 对象进行条件判断。
示例：以下代码用于判断当前项目环境配置了数据库连接信息时，才创建`DataSource`对象并加载到 Spring IOC 容器。
```
@Configuration
@PropertySource(value = {"classpath:jdbc.properties"}, ignoreResourceNotFound = true)
@Component
public class DbConfig {

    @Bean("dataSource")
    @Conditional({DbConfig.DatabaseConditonal.class})
    public DataSource getDataSource(
            @Value("${jdbc.driver}") String driver,
            @Value("${jdbc.url}") String url,
            @Value("${jdbc.username}") String username,
            @Value("${jdbc.password}") String password
    ) {
        Properties props = new Properties();
        props.setProperty("driver", driver);
        props.setProperty("url", url);
        props.setProperty("username", username);
        props.setProperty("passwork", password);
        DataSource dataSource = null;
        try {
            dataSource = BasicDataSourceFactory.createDataSource(props);
        } catch (
                Exception e) {
            e.printStackTrace();
        }
        return dataSource;
    }

    static class DatabaseConditonal implements Condition {

        /**
         * @param conditionContext      条件上下文
         * @param annotatedTypeMetadata 注解类型的元数据
         * @return true 装配 Bean，
         * fasle 不装配 Bean
         */
        public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
            // 获取环境配置
            Environment env = conditionContext.getEnvironment();
            // 判断数据库配置信息是否存在
            return env.containsProperty("jdbc.driver")
                    && env.containsProperty("jdbc.url")
                    && env.containsProperty("jdbc.username")
                    && env.containsProperty("jdbc.password");
        }

    }

    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(DbConfig.class);
        System.out.println(ac.containsBean("dataSource"));
    }
}
```
**注**：[@Conditional] 注解传入多个类时，它们之间的关系为 **与** 关系，只有当所有类都返回`true`时，才会加载 Bean 对象到 Spring IOC 容器中。


* **依赖注入**：依赖注入可分为如下几种类型：
1. **[@Value]**：用于注入基本数据类型或`String`
```
@ComponentScan
@Component
public class User {
    @Value("Whyn")
    private String name;
    @Value("12")
    private int age;
...
}
```
2. **[@Autowired]**：自动按照类型进行注入。当 Spring IOC 容器存在唯一 bean 对象匹配要注入的类型时，则注入成功。该注解可用于成员变量，构造函数，`setter`函数或者其他配置方法上。其对应于 XML 配置的`<bean autowire="byType">`
```
@ComponentScan
@Component("me")
public class Me {
    @Autowired // 自动注入 Tea 类型
    private Tea tea;

    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(Me.class);
        Me me = ac.getBean("me", Me.class);
        me.drink();
    }

    private void drink() {
        System.out.println(this.tea.flavor());
    }

    private interface Tea {
        String flavor();
    }

    @Component
    private static class RedTea implements Tea {

        public String flavor() {
            return "Red Tea";
        }
    }
}
```
**解析**：[@ComponentScan] 会扫描`Me`所在的包，扫描到被 [@Component] 注解的类有两个：`Me`和`RedTea`，则会分别进行反射创建对应 bean 对象并存放到 Spring IOC 容器中。当扫描到 [@Autowired] 注解时，发现其需要注入一个`Tea`类型对象，则从 Spring IOC 容器中进行查找，刚好有唯一符合的 bean 对象`RedTea`，则注入成功。

**注**：[@Autowired] 的注入执行模型为：[@Autowired] 首先会根据 **注入类型** 在 Spring IOC 容器中进行依赖查找，当 Spring IOC 容器存在唯一匹配要注入类型时，则注入成功。如果 IOC 容器存在多个匹配注入类型 bean 对象，则 [@Autowired] 就会依据要注入对象的 **名称（id）**进行查找，如果找到名称相同的，则注入成功，否则，无法进行注入，程序报错。
比如：`@Autowired private Tea tea;`，先会依据类型`Tea`进行查找，若 IOC 容器存在多个`Tea`类型对象，则再按照名称`tea`进行查找。

3. **[@Qualifier]**：在自动注入的基础上（依据类型），再按照名称（id）进行注入。该注解通常结合 [@Autowired] 一起使用，其无法单独作用域类成员变量，当可单独作用于方法参数上。
```
@ComponentScan
@Component("me")
public class Me {

    @Autowired  
    @Qualifier("greenTea") // 自动注入类型为Tea，名称为greenTea的bean对象
    private Tea tea;

    public static void main(String[] args) {
        ApplicationContext ac = new AnnotationConfigApplicationContext(Me.class);
        Me me = ac.getBean("me", Me.class);
        me.drink();
    }

    private void drink() {
        System.out.println(this.tea.flavor());
    }

    private interface Tea {
        String flavor();
    }

    @Component("redTea")
    private static class RedTea implements Tea {

        public String flavor() {
            return "Red Tea";
        }
    }

    @Component("greenTea")
    private static class GreenTea implements Tea {

        public String flavor() {
            return "Green Tea";
        }
    }
}
```
4. **[@Resource]**：根据名称（id）进行注入。
```
@ComponentScan
@Component("me")
@Scope("prototype")
public class Me {

    @Resource(name="greenTea")
    private Tea tea;
    ...
}
```
**注**：[@Resource] 注解属于 JavaEE api。在 Java9 的时候，JavaEE 就被标记为废弃状态，并且在 Java11 进行了移除。因此，我们需要加入相关依赖：[javax.annotation-api]

* **[@Scope]**：控制 bean 对象的作用域，其默认值为`""`，表示`singleton`。对应于 XML 配置的`<bean scope=""`>`
```
@ComponentScan
@Component("me")
@Scope("prototype")
public class Me {
...
}
```
* **bean 对象的生命周期**：主要用于配置 bean 对象的初始化和销毁函数，对应于 XML 配置的`<bean scope="singleton" init-method="" destroy-method="">`，涉及的注解如下所示：
1. **[@PostConstruct]**：用于指定 bean 对象创建时执行的初始化函数。
2. **[@PreDestroy]**：用于指定 bean 对象销毁时执行的销毁函数。
```
@ComponentScan
@Component
public class User {
    ...
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext(User.class);
        User user = ac.getBean("user",User.class);
        System.out.println(user);
        ac.close();
    }

    @PostConstruct
    public void init() {
        System.out.println("invoke init method");
    }

    @PreDestroy
    public void destroy() {
        System.out.println("invoke destroy method");
    }
}
```
**注**：[@PostConstruct] 和 [@PreDestroy] 都属于 JavaEE api，无法使用时，则需要加入相关依赖：[javax.annotation-api]

XML 配置和注解配置选择方案
----------------------------------------------
无论是使用 XML 配置还是注解配置开发，其本质都是一样的。

通常，对于自己编写的代码，我们选择使用注解开发；对于第三方库提供的 api，我们使用 XML 配置开发。

由于使用了 XML 配置，因此 Spring IOC 容器的创建一般采用 [ClassPathXmlApplicationContext]，此时要使能注解开发，就需要在 XML 文件中进行注解扫描相关配置：
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 指定注解相关扫描类 -->
    <context:component-scan base-package="com.yn.spring.ioc" />

</beans>
```
具体代码如下：
```
@Component("me")
public class Me {
    ...
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        Me me = ac.getBean("me", Me.class);
        me.drink();
    }
    ...
}
```
Spring AOP 简介
----------------------------------------
Spring框架提供的两个核心功能就是 IOC 和 AOP。

前面已对 IOC 进行了讲述，下面主要对 AOP 进行讲解。

* **AOP（Aspect Oriented Program）**：即 **面向切面编程**。其作用主要在于切割关注点，分离核心功能与辅助功能，松散耦合各模块，最后在运行时把各模块“编织”到一起，实现完整功能。

很久之前写过一篇介绍 AOP 的文章：[AOP简介]，现在简单总结一下：

传统 OOP（Object-Oriented Programing，面向对象编程） 编程中，其思想是将事务对象化，一切皆对象，对象行为完全由自己控制。在实际编程中，对象的某个行为总是会附属带上其他一些辅助性操作（比如日志），使得行为的操作并不具备 *单一职责*，代码稍显混乱且臃肿。

而 AOP 具备“编织”代码能力，其可以将不同模块的内容在运行时很好地组织到一起，因此我们便可以将对象行为的核心功能和辅助功能进行切割，在运行时再通过 AOP 组织到一起。AOP 的出现可以让我们更加专注于模块开发，其很好地实现了各模块间的松散耦合。

简单举个例子：传统 OOP 编程中，日志打印需要嵌入到类的每个方法内部，而在 AOP 中，我们可以将日志打印当成一个辅助模块，并以声明的方式应用到需要日志的其他组件上。系统其他组件无须知道日志模块的存在，日志模块对其他组件无侵入，最后又能完整地实现 OOP 上所需的功能。

AOP 和 OOP 是两种不同的编程思想，AOP 很好地解决了 OOP 编程中存在的一些缺陷，可以说 AOP 是 OOP 的补充与完善。

AOP 中的一些术语
-----------------------------------
* *Joinpoint（连接点）*：指程序执行时被拦截到的点（被切入代码的点），例如类中的一个方法,类中设置变量或获取变量的地方都可以视作一个Joinpoint。在 Spring 中，这些点指的是方法，因为 Spring 只支持方法的拦截。

* ***Pointcut（切入点）***：指要具体进行拦截的 Joinpoint，即要被进行切入/增强的点。在 Spring 中，Pointcut 即指定要具体进行拦截/切入的方法。

* ***Advice（通知 /增强）***：是 Pointcut 的执行代码，是执行“方面”的具体逻辑。通知有如下几种类型：
1）**前置通知（before）**：指 Pointcut 前切入的代码。
2）**后置通知（after-returning）**：指 Pointcut 后切入的代码。
3）**异常通知（after-throwing）**：指 Pointcut 后抛出异常处切入的代码。
4）**最终通知（after）**：指 Pointcut 后`finially`处切入的代码。
5）**环绕通知（around）**：可以手动控制代码切入时机，即环绕通知可以实现上述所讲的所有通知类型。
具体执行顺序如下所示：
```
try{
    before;                     // 前置通知
    method.invoke(target,args); // 业务方法
    after-returning;            // 后置通知
    return;
}catch (Exception e){
    after-throwing;             // 异常通知
}finally {
    after;                      // 最终通知
}
```

* *Introduction（引介）*：引介是一种特殊的通知，在不修改代码的前提下，引介可以在运行期为对象动态地属性和方法，从而达到修改对象结构的目的。

* *Target（目标对象）*：指被代理的对象。

* *Weaving（织入）*：指为 Target 切入增强代码的过程。Spring 采用动态代理织入，而 AspectJ 采用编译器织入和类装载期织入。

* *Proxy（代理）*：指 Target 被织入增强代码后生成的代理类。

* ***Aspect（切面）***：指 Pointcut + Advice/Introduction，即 切面=切入点+通知/引介，也即完成切入的地方。

**注**：**粗暴理解如下**：
* Joinpoint（连接点）= 方法
* Pointcut（切入点）= 要切入代码的方法
* Advice（通知 /增强）= 切入代码的位置
* Aspect（切面）= 方法（Pointcut）具体位置（Advice）被切入了代码

Spring 中使用 AOP
---------------------------------------
1. 首先导入 Sprig IOC 支持包：[spring-context]，再导入 AOP 切入点表达式解析包：[aspectjweaver]
```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.1.9.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.4</version>
</dependency>
```
2. 创建一个业务类，模拟真实项目的业务方法：
```
public class TestService {
    public void doSomething(){
        System.out.println("执行业务方法!");
    }
}
```
3. 创建一个日志类，模拟日志打印功能：
```
public final class Logger {

    public Object printLog(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("start log: " + joinPoint.getSignature().getName());
        Object obj = joinPoint.proceed();
        System.out.println("end log: "+joinPoint.getSignature().getName());
        return obj;
    }
}
```
4. 配置文件中配置业务类和日志类 bean 对象，并配置一个 AOP 切面，实现业务类注入日志功能：
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 配置业务类 -->
    <bean id="testService" class="com.yn.service.TestService" />
    <!-- 配置日志类 -->
    <bean id="logger" class="com.yn.utils.Logger" />

    <!-- 配置AOP -->
    <aop:config>
        <!-- 配置一个切入点：
                id：切入点名称
                expression：切入点表达式（执行切入的目标方法）
         -->
        <aop:pointcut id="logPointcut" expression="execution(* com.yn.service.TestService.*(..))"/>
        
        <!-- 配置一个切面：
                id：切面名称
                ref：切面通知引用的对象
        -->
        <aop:aspect id="log" ref="logger">
            <!-- 配置通知和切入点 -->
            <aop:around method="printLog" pointcut-ref="logPointcut" />
        </aop:aspect>
    </aop:config>
</beans>
```
5. 创建一个测试类，运行业务类方法，查看日志是否切入成功：
```
public class TestServiceTest {

    @Test
    public void doSomething() {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        TestService service = ac.getBean("testService", TestService.class);
        service.doSomething();
    }
}
```
运行结果如下：

![运行结果](https://upload-images.jianshu.io/upload_images/2222997-0eb1b33b79cfd30d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**注**：上述例子中唯一一个需要了解的就是 **切入点表示式（`<aop:pointcut expression="表达式" />`）**。



切入点表达式的标准格式为：
```
[访问修饰符] 返回值 包名.包名.包名...类名.方法名(参数列表)
```
**注**：访问修饰符是可选的。

比如，下面就是一个标准的切入点表达式写法：其作用就是指定要拦截的方法，织入切片代码
```
public void com.yn.service.TestService.doSomething()
```
切入点表达式支持通配符匹配，其中：
* **\*** ：表示匹配所有
* **..** ：表示匹配0个或多个。常用于匹配多级包名和任意参数：
```
// 匹配任意包名下的 void TestService.doSomething() 方法
void *..TestService.doSomething()
// 匹配任意包名下的任意参数列表的 void TestService.doSomething 方法
void *..TestService.doSomething(..)
```
按上述所讲的切入点表达式写法，我们甚至可以写出一个匹配任何方法的全通配符表达式：
```
// 全通配符表达式：任意返回值 任意级包 任意类.任意方法(0个或多个任意参数)
* *..*.*(..)
```

Spring 基于注解的 AOP 配置
--------------------------------------
与 IOC 一样，Spring 同样为 AOP 提供了注解配置功能。

这里我们使用注解配置更改上面的 AOP 日志示例，具体步骤如下：

1. 修改配置文件`bean.xml`，加入注解开启配置：
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 开启扫描 -->
    <context:component-scan base-package="com.yn"/>

    <!-- 配置Spring开启注解 AOP 支持 -->
    <aop:aspectj-autoproxy />

    <!-- 配置业务类 -->
    <bean id="testService" class="com.yn.service.TestService"/>
</beans>
```
**注**：开启 Spring 注解支持也可以使用注解：[@EnableAspectJAutoProxy]，其相当于 XML 配置文件中的`<aop:aspectj-autoproxy />`。

2. 修改日志类，使用 AOP 相关注解：
```
@Component
@Aspect //表示该类是一个切面类
public final class Logger {

    // 定义一个切入点
    @Pointcut("execution(* com.yn.service.TestService.*(..))")
    public void logPointcut() {
    }

    // 定义一个通知，这里使用环绕通知
    @Around("logPointcut()")
    public Object printLog(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("start log: " + joinPoint.getSignature().getName());
        Object obj = joinPoint.proceed();
        System.out.println("end log: " + joinPoint.getSignature().getName());
        return obj;
    }
}
```
以上，我们便使用注解完成了 AOP 配置功能。

**注**：Spring AOP 注解配置存在一个问题：在没有异常情况下，最终通知（after）会优先于后置通知（after-returning）执行，与正常执行顺序相反。因此，使用注解配置时，建议使用环绕通知（around）进行处理。

更多 AOP 注解使用方法，请查看：[AspectJ之切点语法]


Spring 整合 junit
-------------------------------
1. `pom.xml`中导入 JUnit：
```
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.12</version>
	<scope>test</scope>
</dependency>        
```
2. `pom.xml'`导入 [spring-test] 包：
```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.1.9.RELEASE</version>
    <scope>test</scope>
</dependency>
```
3. 使用 Spring 提供的运行器替换 JUnit 默认运行器：
```
@RunWith(SpringJUnit4ClassRunner.class)
```
4. 告知 Spring 允许器配置方式（xml 或 注解配置），并提供配置文件路径：
```
// 注解配置，配置类为 SpringConfiguration.class
@ContextConfiguration(classes = SpringConfiguration.class)

// XML 配置，配置文件为 bean.xml
@ContextConfiguration(locations = "classpath:bean.xml")
```
5. 到此，就可以直接获取 Spring IOC 容器内部的 bean 对象了：
```xml
// resources/bean.xml
<beans ...>
    <bean id="date" class="java.util.Date" />
</beans>
```
```
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:bean.xml")
public class TestSpring {

    @Autowired
    private Date date;

    @Test
    public void testMerge(){
        Assert.assertNotNull(this.date);
        System.out.println(this.date);
    }
}
```

参考
----------------
* [Spring技术内幕：设计理念和整体架构概述]


[What We Mean by "Spring"]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/spring-framework-reference/overview.html#overview-spring

[spring-framework]:https://spring.io/projects/spring-framework

[projects]:https://spring.io/projects

[Introduction to the Spring Framework]:https://docs.spring.io/spring/docs/5.0.0.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#overview

[Spring技术内幕：设计理念和整体架构概述]:https://juejin.im/post/5b012b00518825673564cbbe

[spring-context]:https://mvnrepository.com/artifact/org.springframework/spring-context

[BeanFactory]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/BeanFactory.html

[ApplicationContext]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/ApplicationContext.html

[ListableBeanFactory]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/ListableBeanFactory.html

[ResourceLoader]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/core/io/ResourceLoader.html

[ApplicationEventPublisher]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/ApplicationEventPublisher.html "interface in org.springframework.context"

[MessageSource]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/MessageSource.html

[ClassPathXmlApplicationContext]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/support/ClassPathXmlApplicationContext.html

[AnnotationConfigApplicationContext]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/AnnotationConfigApplicationContext.html

[FileSystemXmlApplicationContext]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/support/FileSystemXmlApplicationContext.html

[@Configuration]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Configuration.html

[@Component]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/stereotype/Component.html

[@Repository]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/stereotype/Repository.html

[@Service]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/stereotype/Service.html

[@Controller]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/stereotype/Controller.html

[@register]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/AnnotationConfigApplicationContext.html#register-java.lang.Class...-

[@scan]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/AnnotationConfigApplicationContext.html#scan-java.lang.String...-

[@ComponentScan]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html

[@ComponentScan-basePackageClasses]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#basePackageClasses--

[@ComponentScan-basePackages]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#basePackages--

[@ComponentScan-excludeFilters]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#excludeFilters--

[@ComponentScan-includeFilters]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#includeFilters--

[@ComponentScan-lazyInit]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#lazyInit--

[@ComponentScan-nameGenerator]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#nameGenerator--

[@ComponentScan-resourcePattern]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#resourcePattern--

[@ComponentScan-scopedProxy]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#scopedProxy--

[@ComponentScan-scopeResolver]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#scopeResolver--

[@ComponentScan-useDefaultFilters]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#useDefaultFilters--

[@ComponentScan-value]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.html#value--

[ComponentScan.Filter]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScan.Filter.html

[BeanNameGenerator]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/support/BeanNameGenerator.html

[ScopedProxyMode]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ScopedProxyMode.html

[ScopeMetadataResolver]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ScopeMetadataResolver.html

[@ComponentScans]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/ComponentScans.html

[@Value]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/annotation/Value.html

[@Autowired]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/annotation/Autowired.html

[@Qualifier]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/beans/factory/annotation/Qualifier.html

[@Scope]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Scope.html

[javax.annotation-api]:https://mvnrepository.com/artifact/javax.annotation/javax.annotation-api/1.3.2

[@Resource]:https://docs.oracle.com/javaee/7/api/javax/annotation/Resource.html

[@PostConstruct]:https://docs.oracle.com/javaee/7/api/javax/annotation/PostConstruct.html

[@PreDestroy]:https://docs.oracle.com/javaee/7/api/javax/annotation/PreDestroy.html

[@Bean]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Bean.html

[AnnotationConfigWebApplicationContext]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/context/support/AnnotationConfigWebApplicationContext.html

[Spring @Configuration vs @Component]:http://dimafeng.com/2015/08/29/spring-configuration_vs_component/

[@Import]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Import.html

[@PropertySource]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/PropertySource.html

[spring-test]:https://mvnrepository.com/artifact/org.springframework/spring-test/5.1.9.RELEASE

[AOP简介]:https://www.jianshu.com/p/1109a4724b16

[aspectjweaver]:https://mvnrepository.com/artifact/org.aspectj/aspectjweaver

[@EnableAspectJAutoProxy]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/EnableAspectJAutoProxy.html

[AspectJ之切点语法]:https://www.jianshu.com/p/e94cdbe67a84

[Condition]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Condition.html

[@Conditional]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/context/annotation/Conditional.html



