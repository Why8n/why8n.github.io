---
tags:
- java
- spring
- springmvc
---
三层架构 和 MVC模型
--------------------------------
* **三层架构**：我们在[Servlet 学习笔记]讲过，当前 Web应用体系主要为 **C/S架构** 和 **B/S架构**。**C/S架构**  是一种历史悠久且技术非常成熟的一种架构，**B/S架构** 从 **C/S架构** 演变而来，属于新生代架构，在当今 Web 应用时代，是最被广泛进行使用的架构。

在标准 **B/S架构** 中，系统分为以下三层：
* **表现层**：也就是我们常说的 web 层，该层主要负责与客户端进行交互，接受客户端请求（控制层）和向客户端响应结果（展示层）。SpringMVC框架就属于表现层。
* **业务层**：也就是我们常说的 service 层，该层主要负责业务逻辑的处理。Spring框架其实属于业务层。
* **持久层**：也就是我们常说的 dao（Data Access Object，数据访问对象） 层，该层主要负责数据持久化，也即对数据库进行增删改查操作。MyBatis框架就属于持久层。

整个服务器 **B/S架构** 简单示意图如下所示：

![B/S架构](https://upload-images.jianshu.io/upload_images/2222997-e40d496cdfffca38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* **MVC模型**：MVC 是 Model - View - Controller 的缩写，即 模型 - 视图 - 控制器。

<!-- more -->

MVC模型也是一种分层模型，与 **B/S架构** 一样，其也分为了三层：
* **模型（Model）**：对应于数据模型，该层主要负责对数据进行封装，也就是我们常说的 dao，bean。
* **视图（View）**：用于展示模型中的数据，通常指的就是 jsp页面 或 html页面。
* **控制器（Controller）**：接收客户端请求，处理程序逻辑，从模型中获取需要的数据，显示到不同的视图上。控制器的典型角色就是 Servlet。

综上：服务器 **B/S架构** 中，表现层的设计模型一般使用的都是 MVC。更具体来讲，宏观上看，**B/S架构** 三层架构之间职责明确，各层间存在一定的依赖关系，呈相互合作之势。将表现层拆分成 MVC 模型，层次更加精细，可以说将原本表现层对业务层的依赖，精细化为控制器（Controller）层对业务层的依赖，当表现层控制器（Controller）接收到请求时，就会对请求进行解析，然后将解析结果给到业务层，业务层就会调用持久层进行 CRUD 操作，然后将结果传递给表现层的模型层（Model）进行数据封装，最后返回给客户端。

[SpringMVC] 简介
-----------------------------
* **[SpringMVC]**：其正式名称为 Spring Web MVC，其是以 MVC 作为设计模型，基于 Servlet API 的基础上构建的一套 **请求驱动类型（请求 - 响应模型 ）** 的轻量级 Web 框架，从最开始的时候就集成到 Spring框架中。

[SpringMVC] 目前已成为最主流的 MVC 框架之一，它通过一套注解，可以让一个 POJO 类作为请求处理的控制器（Controller），无须实现任何额外接口，对源码侵入性低，并且它还支持 RESTful 编程风格的请求。

[SpringMVC] 优势
-----------------------------
* 采用组件化开发，组件可插拔，组件间松散耦合。

* 基于 MVC 设计模型，各层分工明确，扩展性极强。

* 无缝集成 Spring框架，无须额外配置。

SpringMVC 使用
--------------------------------
举个例子：浏览器请求地址：`http://localhost:8080/hello`，要求服务器返回页面`hello.html`。

我们使用 IDEA 创建该工程，具体步骤如下：
1. 创建一个 Maven 的 webapp 工程，如下图所示：

![maven-archetype-webapp](https://upload-images.jianshu.io/upload_images/2222997-1eed3e68e502c614.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/711/format/webp)

2. IDEA 默认创建的 web 工程目录补全，因此我们需要手动进行补全：
* **补全源代码目录**：在 src/main/ 目录下，创建文件夹 java - 右键该文件夹 - Mark Directory as - Sources Root。

* **补全源代码资源目录**：在 src/main/ 目录下，创建文件夹 resources - 右键该文件夹 - Mark Directory as - Resources Root。

* **补全测试代码目录**：在 src/ 目录下，创建文件夹 test/java - 右键该文件夹 - Mark Directory as - Test Sources Root。

* **补全测试代码资源目录**：在 src/test 目录下，创建文件夹 resources - 右键该文件夹 - Mark Directory as - Test Resources Root。

![](https://upload-images.jianshu.io/upload_images/2222997-29b85ff8bfdfaf63.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 在`pom.xml`中导入相关依赖：
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
   
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <!-- 统一版本号 -->
        <spring.version>5.1.9.RELEASE</spring.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>

    </dependencies>
</project>
```
4. 在`webapp/WEB-INF/`目录下，创建文件夹`pages`，再创建一个`hello.jsp`页面：

![pages](https://upload-images.jianshu.io/upload_images/2222997-7ec1285aa41d95b1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5. 创建类`HellController`，接收客户端请求，返回`hello.jsp`页面：
```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public String hello(){       
        return "hello";
    }
}
```
6. 在`resources`目录下，创建 Spring 配置文件`applicationContext.xml`，开启注解扫描和 [SpringMVC] 注解支持，并配置一个视图解析器：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc
        https://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!-- 开启注解扫描 -->
    <context:component-scan base-package="com.yn"/>
    <!-- 开启SpringMVC注解 -->
    <mvc:annotation-driven />
    <!-- 视图解析器 -->
    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/pages/" />
        <property name="suffix" value=".jsp" />
    </bean>
</beans>
```
7. 在`webapp/WEB-INF/web.xml`中，配置一个前端控制器，当前端控制器启动时，同时加载 Spring 配置文件：
```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>Archetype Created Web Application</display-name>

    <!-- 配置前端控制器 -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- 加载 Spring 配置文件 -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:applicationContext.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <!-- 拦截所有 -->
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```
8. 配置 Tomcat 服务器：

![配置tomcat](https://upload-images.jianshu.io/upload_images/2222997-96fc4b79973b8784.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

9. 运行项目，此时浏览器输入：`localhost:8080/hello`，就可以看到输出了。

[SpringMVC] 执行模型
-------------------------------------
在分析上述例子之前，我们首先需要了解下 [SpringMVC] 的执行模型。

* **[SpringMVC] 执行模型**：[SpringMVC] 是基于组件的方式完成整个请求流程的。具体流程如下图所示：

![SpringMVC 执行模型](https://upload-images.jianshu.io/upload_images/2222997-9968fed79274231a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


其中，各个组件的具体功能如下：

1. **前端控制器（DispatcherServlet）**：客户端请求都会统一被`DispatcherServlet`接收，由`DispatcherServlet`委托给其他组件进行处理，其是整个请求流程控制中心，协同调配各组件共同完成一次 HTTP 请求。`DispatcherServlet`的存在降低了组件间的耦合。

2. **处理器映射器（HandlerMapping）**：HandlerMapping 会根据请求URL 找到对应的处理器（Handler），生成一个处理器执行链（HandlerExecutionChain），其包含一个处理器（Handler）对象（即 Controller）和0个或多个拦截器对象（HandlerInterceptor））。 
**注**：处理器（Handler）即控制器（Controller），HandlerMapping 会解析出 请求URL 的路径，找到对应的 Controller，将请求交由其进行处理。

3. **处理器适配器（HandlerAdapter）**：HandlerAdapter 会调用 Hanlder 处理请求，然后将结果适配为一个的 ModelAndView 对象（模型+视图），返回给 DispatcherServlet。
**注**：HandlerAdapter 采用适配器模式，将不同的 Handler 处理的结果适配为统一的样式 ModelAndView，通过扩展适配器可以对更多类型的 Handler 进行执行。

4. **视图解析器（ViewResolver）**：ViewResolver 会接收 ModelAndView 对象，根据其逻辑视图名解析成具体的物理页面地址，即返回一个具体的页面。

现在，我们就可以对上文例子进行解析了。其完整的请求过程如下：
1. 浏览器访问`http://localhost:8080/hello`，发送一个请求。

2. 服务器配置前端请求器（DispatcherServlet）对所有请求进行拦截，因此 DispatcherServlet 会拦截到`http://localhost:8080/hello`这个请求。

3. DispatcherServlet 会将请求转发给处理器映射器（HandlerMapping），HandlerMapping 会解析请求URL：`http://localhost:8080/hello`，得到请求路径`/hello`，然后根据路径找到了其对应的处理器（Handler）为：`HelloController`，然后将该 Handler 和 该路径对应的拦截器（HandlerInterceptor）封装到一个处理器执行链（HandlerExecutionChain）对象中，返回给 DispatcherServlet。

4. DispatcherServlet 获取到 HandlerExecutionChain 后，先执行所有我们定义的拦截器（interceptor）的`preHandle`方法，然后将处理器（Handler）发送给相应处理器适配器（HandlerAdapter），HandlerAdapter 会执行 Handler，并将其结果封装到一个 ModelAndView 对象中，返回给 DispatcherServlet，最后还会执行拦截器（interceptor）的`postHandle`方法。

5. DispatcherServlet 从返回的 ModelAndView 对象中获取到其逻辑视图名，将之传递给视图解析器（ViewResolver），ViewResolver 根据该逻辑视图名就可以解析出实际的具体页面 View，然后将该 View 发送给 DispatcherServlet 。

6. View 进行视图渲染，View 会根据传进来的 Model模型数据进行渲染。

7. 返回控制权给 DispatcherServlet，由 DispatcherServlet 返回响应给用户，完成一个请求流程。

**注**：在 [SpringMVC] 的各个组件中，处理器映射器（HandlerMapping），处理器适配器（HandlerAdapter）和 视图解析器（ViewResolver）称为 [SpringMVC] 的三大组件。
当配置了 [SpringMVC] 注解支持：`<mvc:annotation-driven />`时，这个配置会自动帮我们加载 **处理映射器（RequestMappingHandlerMapping）** 和 **处理器适配器（RequestMappingHandlerAdapter）**。因此，一般情况下， 我们只需配置一个 视图解析器 即可。

上面较详细地阐述了 [SpringMVC] 的执行模型，为了方便理解，我们可以对其进行简化，大致可以理解为：
1. 客户端发送请求，被服务器前端控制器（DispatcherServlet）拦截到。

2. DispatcherServlet 将请求转发给处理器映射器（HandlerMapping）查找得到对应的控制器（Controller）（可以根据 XML配置，注解进行查找）。

3. DispatcherServlet 通过处理器适配器去执行 Controller 对应的映射方法，然后将结果封装到一个 视图对象（ModelAndView）中。

4. DispatcherServlet 从该 ModleAndView 中取出逻辑视图名发送给视图解析器（ViewResolver），ViewResolver 根据该逻辑视图名就可找到真实的页面对象（View）。

5. 最后由 DispatcherServlet 将 ModelAndView 中的 Model 数据传递给页面对象（View），让其进行渲染。

6. 渲染完成后交由 DispatcherServlet 响应给客户端，完成请求过程。

[SpringMVC] 常用注解
------------------------------------------
* **[@RequestMapping]**：用于建立请求URL 和 请求处理方法 之间的对应/映射关系。
```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface RequestMapping {
    String name() default "";

    @AliasFor("path")
    String[] value() default {};

    @AliasFor("value")
    String[] path() default {};

    RequestMethod[] method() default {};

    String[] params() default {};

    String[] headers() default {};

    String[] consumes() default {};

    String[] produces() default {};
}
```
[@RequestMapping] 注解可用于类和方法上，分别作为第一，二级目录，其属性具体含义如下表所示：

| Modify and Type                  | Element  | Description                                      |
|----------------------------------|----------|--------------------------------------------------|
| Sting[]                          | path     | URL路径                                          |
| String[]                         | value    | 等同于 path                                      |
| String                           | name     | 该映射名称                                       |
| [RequestMethod[]][RequestMethod] | method   | 指定请求方法                                     |
| String[]                         | params   | 指定限制的请求参数                                   |
| String[]                         | headers  | 指定限制的请求头部                                   |
| String[]                         | consumes | 指定请求的媒体资源类型（匹配头部：Content-Type） |
| String[]                         | produces | 指定可接收的媒体类型（匹配头部：Accept）         |

* **[@GetMapping]**：映射方法支持 HTTP GET请求。其是` @RequestMapping(method = RequestMethod.GET)`的缩写。
```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(
    method = {RequestMethod.GET}
)
public @interface GetMapping {
    @AliasFor(
        annotation = RequestMapping.class
    )
    String name() default "";

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] value() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] path() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] params() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] headers() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] consumes() default {};

    @AliasFor(
        annotation = RequestMapping.class
    )
    String[] produces() default {};
}
```
同理：[@PostMapping]，[@PutMapping]，[@DeleteMapping]，[@PatchMapping] 分别支持 Post，Put，Delete，Patch 请求。

* **[@RequestBody]**：表示将请求体作为`Controller`方法的参数。[@RequestBody] 会读取请求体内容，然后通过系统默认配置的`HttpMessageConverter`进行解析，并将解析结果绑定到`Controller`方法参数上。
```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestBody {
    boolean required() default true;
}
```
**注**：Get 方法不适用该注解。

示例：
```java
@PostMapping("/requestBody")
public String requestBody(@RequestBody String body) {
    return body;
}
```

* **[@ResponseBody]**：表示方法返回值作为响应体内容。即将`Controller`方法返回的对象，通过适当的`HttpMessageConverter`转换为指定格式后，写入到`Response`对象的响应体中。
```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ResponseBody {
}
```
* **[@RestController]**：该注解是一个组合注解，相当于 [@Controller] 和 [@ResponseBody] 的组合。当使用该注解时，方法上的 [@RequestMapping] 注解默认会带上 [@ResponseBody] 的语义。
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {
    @AliasFor(
        annotation = Controller.class
    )
    String value() default "";
}
```

* **[@RequestParam]**：用于把请求携带的参数赋值给控制器方法参数。
```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestParam {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;

    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```
[@RequestParam] 注解只能用于参数上，其属性具体含义如下表所示：

| Modifier and Type | Element      | Description                                      |
|-------------------|--------------|--------------------------------------------------|
| String            | name         | 请求参数名称                                     |
| String            | value        | 等同于 name                                          |
| String            | defaultValue | 默认值。当请求参数未提供或为空时，使用该默认值。 |
| boolean           | required     | 请求参数是否必须提供此参数                             |
示例：
```java
@GetMapping("/requestParam")
public String requestParam(@RequestParam("name") String username) {
    return username;
}
```
* **[@RequestHeader]**：用于获取请求头，赋值给方法参数。
```
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestHeader {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;

    String defaultValue() default "\n\t\t\n\t\t\n\ue000\ue001\ue002\n\t\t\t\t\n";
}
```
示例：
```
@GetMapping("/requestHeader")
public String requestHeader(@RequestHeader("User-Agent") String userAgent) {
    return userAgent;
}
```

* **[@PathVariable]**：用于绑定 URL 占位符，赋值给方法参数。比如，url为`/delete/{id}`，则`{id}`即为占位符。
```
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PathVariable {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;
}
```

示例：
```
@GetMapping("/pathVariable/{uid}")
public String pathVariable(@PathVariable("uid") Integer userId) {
    return "Your id is " + userId;
}
```
* **[@ModelAttribute]**：用于把一个方法参数或方法返回值绑定到一个模型属性上。
```
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ModelAttribute {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean binding() default true;
}
```

该注解可用于方法和参数上：
1. 注解于参数上时，当该模型不存在时（没有 [@ModelAttribute] 注解的方法返回相应模型对象），会自动实例化一个新的模型对象，并且当请求携带有与模型字段相匹配的参数时，模型会自动将这些参数值绑定到对应域变量上（数据绑定）。

示例：
```
@RestController
public class UserController {
    static class User implements Serializable {
        String name;
        Integer age;

        public User(String name, Integer age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString() {
            if (this.age == null) {
                return String.format("[%s]", this.name);
            }
            return String.format("[%s:%d years old]", this.name, this.age);
        }
    }

    @RequestMapping("/modelAttribute")
    public String modelAttribute(@ModelAttribute User user) {
        return user.toString();
    }
}
```
分析：当客户端请求`/modelAttribute`时，被 [@ModelAttribute] 注解的参数`user`会自动创建一个实例对象，如果请求携带参数：`/modelAttribute?name=Whyn`，则该实例对象的属性`name`就会自动获取请求对应值，即：`user.name=Whyn`。

2. 注解于方法上时，当接收到请求时，会先执行被 [@ModelAttribute]  注解的方法，然后再执行控制器对应请求映射方法。

&ensp;&ensp;注解于方法上可分为两种情形：

&ensp;&ensp;1）方法没有返回值，也即不提供模型对象给控制器方法参数。不过一般使用 [@ModelAttribute]，都是为了提供自定义的模型对象给到控制器映射方法，因此，对于没有返回值的方法，若想提供模型对象，则需要`Model`对象进行辅助：
```
@ModelAttribute
public void getUser(@RequestParam("name") String name,
                    @RequestParam(value = "age", required = false) Integer age,
                    Model model) {
    User user = new User(name, age);
    model.addAttribute("user",user);
}

@RequestMapping("/modelAttribute")
public String modelAttribute(@ModelAttribute("user") User user) {
    return user.toString();
}
```
**注**：参数`Model`具体类型为`BindingAwareModelMap`，其实质就是一个`Map`键值对对象，使用该`Map`帮助我们存储模型对象，内部的具体实现其实是将键值对存储到`Request`域中，因此我们可以在控制器内不同方法间共享该模型对象。
控制器方法参数的 [@ModelAttribute] 注解属性`value`用于指定`Model`键值，可忽略，忽略时系统直接根据参数名称进行获取。
控制器方法参数的 [@ModelAttribute] 注解可忽略不写，系统会自动查找相应模型进行注入。

&ensp;&ensp;2）当 [@ModelAttribute] 注解的方法有返回值时，该返回值会被传入给控制器请求映射方法的参数上。
```
@ModelAttribute("user")
public User getUser(@RequestParam("name") String name,
                    @RequestParam(value = "age", required = false) Integer age) {
    return new User(name, age);
}

@RequestMapping("/modelAttribute")
public String modelAttribute(@ModelAttribute("user") User user) {
    return user.toString();
}
```
分析：方法`getUser`其实就相当于调用了`model.addAttribute("user",user)`，键从注解 [@ModelAttribute] 获取，值即为方法返回值。

* **[@ExceptionHandler]**：用于捕获控制器/方法抛出的异常的处理方案。当`Controller`或映射方法抛出异常时，如果该异常符合 [@ExceptionHandler] 注解声明的异常时，则会被该注解声明的方法进行捕获。
```
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ExceptionHandler {
    Class<? extends Throwable>[] value() default {};
}
```
示例：
```
@Controller
public class ExceptionController {

    @GetMapping("/runtimeexception")
    public String exception() {
        throw new RuntimeException("runtime exception occured!");
    }

    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    @ExceptionHandler({IOException.class, RuntimeException.class})
    public ModelAndView handlerException(Exception e) {
        e.printStackTrace();
        return new ModelAndView("error");
    }
}
```

* **[@InitBinder]**：该注解用于初始化 [WebDataBinder]，从而可以对前台请求参数进行预处理。
[@InitBinder] 支持 [@RequestMapping] 注解方法上的所有参数，除了命令/表单对象和相应的验证结果对象。
[@InitBinder] 注解的方法不能有返回结果，通常都设置返回值为`void`。
```
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface InitBinder {
    String[] value() default {};
}
```
**注**：当前端控制器（DispatcherServlet）接收到请求时，在调用相应控制器（`Controller`）映射方法前，都会调用 [@InitBinder] 注解的方法对相应请求参数进行预处理。

示例：对前台请求参数日期数据（形如`2019-08-30`）进行转换，使控制器映射方法能接收该参数：
```
@GetMapping("/date")
public String today(@RequestParam("date") Date date){
    return date.toString();
}

@InitBinder
public void transformDate(WebDataBinder binder){
    binder.addCustomFormatter(new DateFormatter("yyyy-MM-dd"));
}
```
分析：对于大多数请求参数，Spring 已经为我们实现了自动数据绑定功能。但是总有一些自定义的参数数据，Spring 无法自动进行转换，因此需要我们手动提供一个转换器，就比如对于上例自定义上传的日期格式（`yyyy-MM-dd`），Spring 没有提供相应转换器，此时我们就可以借助 [@InitBinder] 对参数进行预处理，使之能转换成相应的类型。
**注**：[@InitBinder] 的属性只有`value`，其用于声明要进行预处理的命令/表单属性 或者 请求参数名称。默认则对所有参数进行预处理。

* **[@ControllerAdvice]**：用于为 [@ExceptionHandler]，[@InitBinder] 和 [@ModelAttribute] 定义多控制器（`Controller`）共享的组件。相当于声明一个全局处理组件，为多个`Controller`设置一套相同的处理机制。
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface ControllerAdvice {
    @AliasFor("basePackages")
    String[] value() default {};

    @AliasFor("value")
    String[] basePackages() default {};

    Class<?>[] basePackageClasses() default {};

    Class<?>[] assignableTypes() default {};

    Class<? extends Annotation>[] annotations() default {};
}
```
[@ControllerAdvice] 只能作用于类上，其属性具体含义如下表所示：

| Modifier and Type             | Element            | Description                    |
|-------------------------------|--------------------|--------------------------------|
| String[]                      | basePackages       | 指定要进行拦截的包（根包）             |
| String[]                      | value              | 等同于 basePackages            |
| Class<?>[]                    | basePackageClasses | 指定要进行拦截的类所在的包（根包）     |
| Class<?>[]                    | assignableTypes    | 指定要进行拦截的具体类（类型） |
| Class<? extends Annotation>[] | annotations        | 指定拦截被相关注解注解的类     |

示例：为所有控制器（`Controller`）设置一个全局异常处理器：
```
@ControllerAdvice
public class ExceptionController {

    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    @ExceptionHandler({IOException.class, RuntimeException.class})
    public ModelAndView handlerException(Exception e) {
        e.printStackTrace();
        return new ModelAndView("error");
    }
}
```

数据绑定
----------------------
当我们发送一个请求时，一般都会携带请求参数，服务器则需要解析请求获取参数值。

比如，我们发送了请求：`curl "localhost:8080/params?name=Whyn&password=1234"`，对于服务器来说，其需要获取参数`name`和`password`的值，进行使用。

对于原生 Servlet 来说，获取请求参数方法如下：
```
@WebServlet("/params")
public class BindServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String password = request.getParameter("password");
        System.out.println(String.format("%s:%s",name,password));
    }
}
```
在 [SpringMVC] 中，我们同样可以在控制器中接收`HttpServletRequest` 和 `HttpServletResponse`对象，从而获取请求参数：
```
@Controller
public class BindController {

    @GetMapping("/params")
    public void bindParams(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String name = request.getParameter("name");
        String password = request.getParameter("password");
        String result = String.format("%s:%s", name, password);
        System.out.println(result);
        response.getWriter().write(result);
    }
}
```
上述例子的做法其实是直接使用底层 Servlet API 进行参数获取，这样一方面数据获取需要手动操作，比较繁琐；另一方面，控制器（`Controller`）由于映射方法接收了`HttpServletRequest`类型等作为参数，使得`Controller`和 Servlet 产生了耦合。

其实，[SpringMVC] 已经为我们提供了对请求参数进行解析和绑定的功能，我们称之为 **数据绑定**。

[SpringMVC] 提供了对 **简单类型**，**实体类型（Bean）** 和 **复杂类型** 以及 **自定义类型** 的数据绑定功能。

* **简单类型**：即自动绑定基本数据类型和字符串数据。
示例：发送请求：`curl "localhost:8080/params?name=Whyn&age=10"`
要求：解析得到参数值
代码：
```
@GetMapping("/params")
@ResponseBody
public String bindParams(@RequestParam("name") String name, @RequestParam("age") Integer age) {
    return String.format("%s:%s", name, age);
}
```
**注**：参数注解`@RequestParam`指定了请求参数名称，此处可忽略不写，则 [SpringMVC] 会根据参数名称自动进行数据绑定，通常建议加上`@RequestParam`注解进行显示指定参数名称。

* **实体类型**：即自动绑定请求参数到 Java Bean 中。
示例：发送请求：`curl "localhost:8080/params?name=Whyn&age=10"`
要求：解析参数，将其值封装到一个`User`类中。
代码：
```
@Controller
public class BindController {

    static class User implements Serializable {
        // 请求参数必须于属性名一致
        private String name;
        private Integer age;

        // 需要提供 setter 方法，让 Spring 进行注入
        public void setName(String name) {
            this.name = name;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        @Override
        public String toString() {
            return "User{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    '}';
        }
    }

    @GetMapping("/params")
    @ResponseBody
    public String bindParams(User user) {
        return user.toString();
    }
}
```
解析：当请求参数要封装到 Java Bean 类时，要求 Bean 类对象属性名与请求参数名一致才会进行注入：即`name`赋给`user.name`，`age`赋给`user.age`（通过反射`setter`函数注入）。

如果 Java Bean 内还嵌套有 Java Bean，如下代码所示：
```
static class Book implements Serializable {
    private String name;
    private Double price;

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Book{" +
                "name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}

static class User implements Serializable {
    // 请求参数必须于属性名一致
    private String name;
    private Integer age;
    // 嵌套 Java Bean
    private Book book;

    // 需要提供 setter 方法，让 Spring 进行注入
    public void setName(String name) {
        this.name = name;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    // 对于嵌套 bean 类，需要提供 getter 函ServletModelAttributeMethodProcessor数
    public Book getBook() {
        return book;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", book=" + book +
                '}';
    }
}
```
**注**：对于嵌套 Bean 需提供相应`getter`函数才能注入成功。

`User`类内部嵌套了一个 Bean 类`Book`，此时如果还想能进行自动数据绑定，则需要在发送请求时，指明参数具体类型，比如：
示例：发送请求：`curl "localhost:8080/params?name=Whyn&age=10&book.name=SpringMVC&book.price=100.00"`
要求：解析参数，自动绑定到一个`User`类中。
代码：
```
@RequestMapping("/params")
@ResponseBody
public String bindParams(User user) {
    return user.toString();
}
```
分析：请求参数`book.name`和`book.price`，前缀`book`表示嵌套 Bean 在外部 Bean 的名称，后缀表示嵌套 Bean 的各个属性名。

* **复杂类型**：即自动绑定集合类型。集合类型大致可以分为以下两种：
1. **绑定数组类型**：主要用于当请求参数具备一个或多个相同名称的时候。
示例：发送请求：`curl "localhost:8080/params?name=Whyn01&name=Whn02"`
要求：解析参数，将参数名相同的值封装到数组中。
代码：
```
@RequestMapping("/params")
@ResponseBody
public String bindParams(@RequestParam("name") String[] names) {
    return Arrays.toString(names);
}
```
2. **绑定集合对象（`List`，`Set`，`Map`）**：对于集合类型，在 [SpringMVC] 中，我们需要单独设置一个包装类进行辅助，其属性为请求参数的集合类型（比如`List<Book>`，`Set<Book>`，`Map<String,Book>`）。
示例：发送请求：`curl "localhost:8080/params" -d "bookList[0].name=SpringMVC01&bookList[0].price=10.0&bookSet[0].name=SpringMVC02&bookSet[0].price=20.0&bookMap['one'].name=SpringMVC03&bookMap['one'].price=30.0"`
要求：解析参数，将参数名相同的值封装到相应集合中。
代码：
```
static class BookVo implements Serializable {
    private List<Book> bookList;
    private Set<Book> bookSet;
    private Map<String, Book> bookMap;

    public BookVo() {
        // Set 集合必须进行初始化，且每次传参时，不能超过该集合大小
        this.bookSet = new HashSet<>();
        // Set 集合大小为 1
        this.bookSet.add(new Book());
    }

    public List<Book> getBookList() {
        return bookList;
    }

    public void setBookList(List<Book> bookList) {
        this.bookList = bookList;
    }

    public Set<Book> getBookSet() {
        return bookSet;
    }

    public void setBookSet(Set<Book> bookSet) {
        this.bookSet = bookSet;
    }

    public Map<String, Book> getBookMap() {
        return bookMap;
    }

    public void setBookMap(Map<String, Book> bookMap) {
        this.bookMap = bookMap;
    }

    @Override
    public String toString() {
        return "BookVo{" +
                "bookList=" + bookList +
                ", bookSet=" + bookSet +
                ", bookMap=" + bookMap +
                '}';
    }
}

@PostMapping("/params")
@ResponseBody
public String bindParams(BookVo bookVo) {
    return bookVo.toString();
}
```
**注**：[SpringMVC] 对于复杂类型的数据绑定支持并不是很好，实际使用中，对于复杂类型，更多的是通过 JSON，XML 等数据格式进行传输。

* **自定义类型**：前台传递的请求参数，对于后台来说，都是字符串类型。对于大多数常见类型，[SpringMVC] 已经提供了相关转换器进行转换，但对于自定义类型数据，[SpringMVC] 无法进行转换，此时就需要我们自己手动实现一个转换器，并注册给 [SpringMVC]。
示例：我们为类`Book`增加一个属性：发布日期`publishDate`，其格式为`yyyy-MM-dd`。
前台会发送请求：`curl "localhost:8080/params?name=SpringMVC&price=100.0&publishDate=2019-08-31"`。
要求：解析参数，封装到一个`Book`对象中。
分析：对于请求参数`name`和`price`，[SpringMVC] 内置转换器已可进行数据类型正确转换，但对于参数`publishDate`，[SpringMVC] 无法进行转换，因此，我们需要手动实现一个转换器，并注册给 [SpringMVC]，具体操作如下：
1. 自定义一个转换器：`String2DateConverter`
```
import org.springframework.core.convert.converter.Converter;

public class String2DateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String source) {
        String dateFormat = "yyyy-MM-dd";
        try {
            return new SimpleDateFormat(dateFormat).parse(source);
        } catch (ParseException e) {
            throw new IllegalArgumentException("无效日期格式，请使用：" + dateFormat);
        }
    }
}
```
2. 注册自定义转换器，并配置让其生效：
```
<!-- ApplicationContext.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
    ...
    <!-- 配置类型转换器 -->
    <bean id="converterService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
        <property name="converters">
            <set>
                <!-- 注入自定义类型转换器 -->
                <bean class="com.yn.convverter.String2DateConverter"/>
            </set>
        </property>
    </bean>
    <!-- 开启SpringMVC注解，并使能自定义类型转换器 -->
    <mvc:annotation-driven conversion-service="converterService"/>
</beans>
```
3. 完成控制器代码
```
@Controller
public class DataBindController {

    static class Book implements Serializable {
        private String name;
        private Double price;

        private Date publishDate;

        public Date getPublishDate() {
            return publishDate;
        }

        public void setPublishDate(Date publishDate) {
            this.publishDate = publishDate;
        }
        ...
    }

    @RequestMapping("/params")
    @ResponseBody
    public String bindParams(Book book) {
        return book.toString();
    }
}
```

拦截器（HandlerInterceptor）
-----------------------------------------------
* **拦截器（HandlerInterceptor）**：[SpringMVC] 中的拦截器（HandlerInterceptor）与 Servlet 中的过滤器（Filter）功能类似，都是用于拦截请求。区别在于 Filter 是对 Servlet 进行拦截，HandlerInterceptor 是对 Controller 进行拦截。

Filter 和 HandlerInterceptor 的一次完整请求过程大致如下图所示：

![](https://upload-images.jianshu.io/upload_images/2222997-70d49c9cdc1f2a36.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

理解上面这张图，应该就可以很清晰地掌握 Filter 和 HandlerInterceptor 的关系与执行模型。

**注**：对于 tomcat 服务器来说，所有的资源访问都是通过 Servlet 来实现的，对于静态资源，其使用的是 DefaultServlet 来处理。
因此，Filter 可以拦截静态资源，而 HandlerInterceptor 由于只能拦截 Controller 方法，故其不能拦截静态资源。

下面看下 [SpringMVC] 的 HandlerInterceptor 接口：

![HandlerInterceptor](https://upload-images.jianshu.io/upload_images/2222997-a69919c5523d2c01.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

HandlerInterceptor 提供了三个接口方法：
* **`preHandle`**：该方法在`Controller`映射方法执行前调用，用以对请求做一些预处理操作。需要注意的是，该方法是 HandlerInterceptor 接口方法中唯一一个有返回值的接口，其返回值类型为`boolean`：当返回`true`时，表示继续执行处理器执行链（HandlerExecutionChain）的下一结点；当返回`false`时，表示打断处理器执行链，直接由该方法处理请求给到 DispatcherServlet，完成请求。因此，处理器执行链的后续节点不会得到执行。
* **`postHandle`**：该方法在`Controller`映射方法执行后，返回`ModelAndView`之前执行。
* **`afterCompletion`**：该方法视图页面渲染完成后执行。

**注**：`postHandle`对于`@ResponseBody`和`ResponseEntity`方法来说作用相对有限，因为这些方法在`HandlerAdapter`内部的响应就会被写入并进行提交，时序上优先于`postHandle`，因此`postHandle`此时就无法对响应进行修改。在这种场景下，可以通过实现`ResponseBodyAdvice`，并将其声明为一个 Controller Advice bean 或者直接通过`RequestMappingHandlerAdapter`进行配置。

构建一个 HandlerInterceptor 很简单，只需两个步骤：
1. 首先构建一个 HandlerInterceptor 类：
```
public class InterceptorOne implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println(this.getClass().getSimpleName()+" preHandle");
        return true; // don't break the chain
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println(this.getClass().getSimpleName()+" postHandler");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println(this.getClass().getSimpleName()+" afterCompletion");
    }
}
```
2. 对创建的 HandlerInterceptor 类进行配置：
```
<!-- ApplicatioinContext.xml -->
<!-- 拦截器 -->
<mvc:interceptors>
    <!-- 配置拦截器 -->
    <mvc:interceptor>
        <!-- 配置拦截路径，/**：表示拦截所有URL及其子路径-->
        <mvc:mapping path="/**"/>
        <!-- 配置拦截器对象 -->
        <bean class="com.yn.interceptor.InterceptorOne"/>
    </mvc:interceptor>
</mvc:interceptors>
```








文件上传/下载
-----------------------
* **文件上传原理**：文件上传是以`multipart/form-data`的 MIME 类型进行上传，此时请求报文的`Content-Type`会随机生成一个 boundary（分界符），这个 boundary 标记请求体的一段数据（多个文件用多个 boundary 进行分隔）。也即服务端只需查找请求头`Content-Type`，获取 boundary，然后根据该 boundary，在请求体中第一次出现该 boundary 的位置到第二次出现该 boundary 的位置的中间部分即为上传文件的内容，具体格式如下所示：

![文件上传格式](https://upload-images.jianshu.io/upload_images/2222997-5a74df8a61b5e7e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


**注**：文件上传 from 表单的请求正文类型`enctype`必须为`multipart/form-data`，其他客户端则设置`Content-Type:multipart/data`，`method`的取值必须为`post`

这里我们借助开源库 [commons-fileupload] 对上传文件进行解析，首先导入该库：
```
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>
```
对于文件上传，传统方式是对`request`对象进行解析，获取请求体内容，再解析出文件内容，进行保存。

而在 [SpringMVC] 中，其是由组件构建完成请求，因此，我们只需添加一个文件上传解析器，[SpringMVC] 就能自动帮我们将上传文件解析处理（具体为`MultipartFile`对象），因此，控制器映射方法只需接收解析出来的文件即可。

文件解析器配置方法如下：
```
<!-- ApplicationContext.xml -->
<!-- 配置文件上传解析器 -->
<!-- id 必须为 multipartResolver -->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"/>
```

到这里，我们就可以实现文件上传了。

常见的文件上传有三种方式，以下依次进行讲解：

* **单文件上传**：每次只上传一个文件，具体步骤如下：
1. 前端页面写一个单文件上传 form 表单：
```
<h1>上传单文件</h1>
<form enctype="multipart/form-data" method="post" action="/uploadSingleFile">
    <input type="file" name="uploadFile"/>
    <input type="submit" value="提交"/>
</form>
```
2. 控制器映射方法接收上传文件，并进行磁盘保存操作：
```
@RestController
public class UploadController {

    // 支持单文件上传
    @PostMapping("/uploadSingleFile")
    public String uploadSingleFile(HttpServletRequest request,
                                   @RequestParam("uploadFile") MultipartFile uploadFile) throws IOException {
        // 创建上传目录
        String path = request.getServletContext().getRealPath("/uploads/");
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdir();
        }

        // 获取上传文件名
        String filename = uploadFile.getOriginalFilename();
        // 写入磁盘
        uploadFile.transferTo(new File(dir, filename));
        return filename + " upload successful";
    }
}
```
* **多文件上传**：每次上传多个文件，具体步骤如下：
1. 前端页面 form 表单支持多文件选择：
```
<h1>上传多文件</h1>
<form enctype="multipart/form-data" method="post" action="/uploadMultiFiles">
    <input type="file" name="uploadFiles" multiple="multiple"/>
    <input type="submit" value="提交"/>
</form>
```
**注**：其实就是多个`multiple`属性。
2. 多文件上传与单文件上传其实实现很相似，借助于 [SpringMVC] 数据绑定功能，我们只需将控制器映射方法设成数组即可：
```
@RestController
public class UploadController {
    // 支持多文件上传
    @PostMapping("/uploadMultiFiles")
    public String uploadMultiFiles(HttpServletRequest request,
                                  @RequestParam("uploadFiles")MultipartFile[] uploadFiles) throws IOException {
        // 创建上传目录
        String path = request.getServletContext().getRealPath("/uploads/");
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdir();
        }


        for (MultipartFile file : uploadFiles) {
            // 获取上传文件名
            String filename = file.getOriginalFilename();
            System.out.println("upload file: " + filename);
            // 写入磁盘
            file.transferTo(new File(dir, filename));
            System.out.println("upload file done: " + filename);
        }
        return "upload files done";
    }
}
```
* **多文件上传+额外表单字段**：有时候可能需要对上传文件进行一些额外信息描述，此时除了上传文件外，还需上传一些额外字段：
1. 前端页面 form 表单增加额外字段：
```
<h1>上传多文件</h1>
<form enctype="multipart/form-data" method="post" action="/uploadMultiFiles">
    name:<input type="text" name="name"/>
    <br>
    description:<input type="text" name="description"/>
    <br>
    upload files:<input type="file" name="uploadFiles" multiple="multiple"/>
    <br>
    <input type="submit" value="提交"/>
</form>
```
2. 后端我们使用一个新的 Java Bean 类，用于 [SpringMVC] 封装表单数据：
```
@RestController
public class UploadController {

    // 封装表单数据
    static class UploadFiles implements Serializable {
        private String name;
        private String description;
        private List<MultipartFile> uploadFiles;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<MultipartFile> getUploadFiles() {
            return uploadFiles;
        }

        public void setUploadFiles(List<MultipartFile> uploadFiles) {
            this.uploadFiles = uploadFiles;
        }

        @Override
        public String toString() {
            return "UploadFiles{" +
                    "name='" + name + '\'' +
                    ", description='" + description + '\'' +
                    ", uploadFiles=" + uploadFiles +
                    '}';
        }
    }

    // 支持多文件上传
    @PostMapping("/uploadMultiFiles")
    public String uploadMultiFiles(HttpServletRequest request,
                                   @ModelAttribute UploadFiles uploadFiles) throws IOException {
        // 创建上传目录
        String path = request.getServletContext().getRealPath("/uploads/");
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdir();
        }

        System.out.println(uploadFiles.getName());
        System.out.println(uploadFiles.getDescription());

        List<MultipartFile> files = uploadFiles.getUploadFiles();
        for (MultipartFile file : files) {
            // 获取上传文件名
            String filename = file.getOriginalFilename();
            System.out.println("upload file: " + filename);
            // 写入磁盘
            file.transferTo(new File(dir, filename));
            System.out.println("upload file done: " + filename);
        }
        return "upload files done";
    }
}
```

* **文件下载原理**：服务端`response`对象可以获取输出流，通过输出流将文件输入流写到浏览器即可完成文件下载功能。

文件下载的关键是设置以下两个头信息：
1. 设置响应文件的 MIME 类型：`ContentType:xxx/yyyy`
**注**：如果想浏览器一直弹出下载对话框，可直接设置：`Content-Type:application/octet-stream`或`Content-Type:application/x-msdownload`

2. 设置文件下载名称：`Content-Disposition:attachement;filename=下载名称`

示例：下载一个图片文件。

具体步骤如下：
1. 假设我们要下载的图片的真实路径为`/WEB-INF/downloads/images/`：

![downloads](https://upload-images.jianshu.io/upload_images/2222997-6f37a2446714ecca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 由于`/WEB-INF`目录为默认安全目录，浏览器无法直接访问。因此服务器端通过一个控制器进行转发获取资源：
```
@Controller
public class DownloadController {
    @GetMapping("/downloads/{filename:.+}") // .+ 表示不过滤 PathVariable 点后缀
    public void download(HttpServletRequest request,
                         HttpServletResponse response,
                         @PathVariable("filename") String filename) throws IOException {
        ServletContext context = request.getServletContext();
        String downloadDir = context.getRealPath("WEB-INF/downloads/images/");
        Path file = Paths.get(downloadDir, filename);
        System.out.println(filename + " exists? " + Files.exists(file));
        if (Files.exists(file)) {
            String fileMime = context.getMimeType(filename);
            System.out.println(filename + ":" + fileMime);
            response.setContentType(fileMime);
            response.addHeader("Content-Disposition", "attachment; filename=" + filename);
            Files.copy(file, response.getOutputStream());
            response.getOutputStream().flush();
        }
    }
}
```



其他
--------------
* **不拦截静态资源**：在 [SpringMVC] 中，前端控制器（DispatcherServlet）一般配置为对所有请求进行拦截，这同时包括了对静态资源（js，css，images...）的拦截，导致静态资源无法获取。因此，我们需要配置前端控制器，让其不对静态资源进行拦截，具体的配置方法有如下两种：
1. 配置 default servlet，优先处理请求：
```
<!-- ApplicationContext.xml -->
<mvc:default-servlet-handler/>
```
2. 手动指定静态资源映射及路径，让前端控制器不进行拦截：
```
<!-- ApplicationContext.xml -->
<mvc:resources mapping="/static/**" location="/static/" />
<mvc:resources mapping="/resources/**" location="/resources/" />
<mvc:resources mapping="/images/**" location="/images/" />
<mvc:resources mapping="/js/**" location="/js/" />
```

* **JSON 支持**：为控制器添加接收 JSON 参数和返回 JSON 数据。当前很多应用都采用了 Restful 请求，通讯格式基本都采用 JSON 进行数据交互，我们可以配置 [SpringMVC]，让其支持 JSON 数据绑定，具体步骤如下：
1. 添加 JSON 支持库，这里我们使用 [jackson]：
```
<properties>
    <jackson.version>2.9.9</jackson.version>
</properties>

<dependencies>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-core</artifactId>
        <version>${jackson.version}</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>${jackson.version}</version>
    </dependency>
</dependencies>
```
2. 编写后端接收 JSON 数据控制器：
```
@Controller
@RequestMapping("/user")
public class JsonController {

    static class User implements Serializable {
        private String name;
        private Integer age;

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

        @Override
        public String toString() {
            return "User{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    '}';
        }
    }
    @RequestMapping("/json")
    public @ResponseBody User jsonUser(@RequestBody User user){
        System.out.println(user);
       return user;
    }
}
```
3. 前台页面使用 jQuery 发送 JSON 数据：
```
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
<script>
    $(function () {
       $('#btn').click(()=>{
           $.ajax({
               url:'user/json',
               type:'post',
               contentType:'application/json;charset=utf-8',
               data:'{"name":"Whyn","age":10}',
               success:function(data){
                   alert(data);
               }
           });
       });
    });
</script>
```

* **解决中文乱码**：请求体和响应体都可能携带中文：
1. 请求携带中文：
1）对于 Get 请求，在 Tomcat 8 以后，统一采用 UTF-8 格式接收请求，此时就无须进行编码转换了（前提：网页编码使用的是 UTF-8）。
2）对于 Post 请求，参数位于请求体，如果请求头`Content-Type`没有指定请求体编码方式，那么 [SpringMVC] 默认使用 *ISO-8859-1* 进行处理，那么对于客户端发送的 utf-8 数据，则会产生乱码。
解决方案：[SpringMVC] 为我们提供了一个编码过滤器，可以通过设置该编码过滤器让 web 容器使用 utf-8 编码解析请求参数：
```
<!-- web.xml -->
<!-- 解决中文乱码过滤器 -->
<filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
2. 对于响应：使用 [@RequestBody] 返回字符串响应时，[SpringMVC] 默认使用 *ISO-8859-1* 格式进行编码，因此客户端接收到数据后，使用 utf-8 格式进行解码，此时就会出现乱码。
解决方案：配置 [SpringMVC] 响应使用 utf-8 编码：
```
<!-- ApplicationContext.xml -->
<!-- 开启SpringMVC注解  -->
<mvc:annotation-driven >
    <!-- 消息转换器 -->
    <mvc:message-converters register-defaults="true">
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <property name="supportedMediaTypes">
                <list>
                    <value>text/plain;charset=UTF-8</value>
                    <value>text/html;charset=UTF-8</value>
                </list>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```


参考
---------------
* [SpringMVC学习笔记(1)——SpringMVC介绍]
* [SpringMVC执行流程及源码解析]
* [Spring MVC之@ControllerAdvice详解]
* [POST和GET请求参数编码方式详细处理]

[Servlet 学习笔记]:https://www.jianshu.com/p/a1b278560621

[SpringMVC]:https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc

[SpringMVC学习笔记(1)——SpringMVC介绍]:https://crowhawk.github.io/2017/04/10/SpringMVC_1/

[SpringMVC执行流程及源码解析]:http://cxis.me/2017/04/06/SpringMVC执行流程及源码解析/

[@RequestMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/

[@GetMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/GetMapping.html

[@PostMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/PostMapping.html

[@PutMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/PutMapping.html

[@DeleteMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/DeleteMapping.html

[@PatchMapping]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/PatchMapping.html

[RequestMethod]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/RequestMethod.html

[@ResponseBody]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/ResponseBody.html

[@RestController]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/RestController.html

[@RequestBody]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/RequestBody.html

[@RequestParam]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html

[@PathVariable]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/PathVariable.html

[@ModelAttribute]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/ModelAttribute.html

[@ExceptionHandler]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html

[@ControllerAdvice]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/ControllerAdvice.html

[@RequestHeader]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/RequestHeader.html

[@Controller]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/stereotype/Controller.html

[@InitBinder]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/annotation/InitBinder.html

[WebDataBinder]:https://docs.spring.io/spring/docs/5.1.9.RELEASE/javadoc-api/org/springframework/web/bind/WebDataBinder.html

[Spring MVC之@ControllerAdvice详解]:https://my.oschina.net/zhangxufeng/blog/2222434

[jackson]:https://github.com/FasterXML/jackson

[commons-fileupload]:https://mvnrepository.com/artifact/commons-fileupload/commons-fileupload/1.4

[POST和GET请求参数编码方式详细处理]:https://blog.csdn.net/lplife/article/details/79593316






