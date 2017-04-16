# 项目开发文档
## 建立目录结构
* models: 存放操作数据库的文件
* public: 存放静态文件
* routes: 存放路由文件
* views: 存放模板文件
* index.js: 程序入口文件
* package.json: 项目名，描述，以及依赖

## 安装依赖模块  
* 安装命令

```
npm i config-lite connect-flash connect-mongo ejs   
express express-formidable express-session marked moment mongolass
```
* 模块介绍  
express: web 框架   
express-session: session 中间件  
connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用  
connect-flash: 页面通知提示的中间件，基于 session 实现  
ejs: 模板  
express-formidable: 接收表单及文件的上传中间件  
config-lite: 读取配置文件  
marked: markdown 解析  
moment: 时间格式化  
mongolass: mongodb 驱动  
objectid-to-timestamp: 根据 ObjectId 生成时间戳  
sha1: sha1 加密，用于密码加密  
winston: 日志  
express-winston: 基于 winston 的用于 express 的日志中间件  

## config-lite
* config-lite 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同从当前执行进程目录下的 config 目录加载不同的配置文件。如果不设置 NODE_ENV，则读取默认的 default 配置文件，如果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件
* 如果程序以 NODE_ENV=test node app 启动，则通过 require('config-lite') 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置; 如果程序以 NODE_ENV=production node app 启动，则通过 require('config-lite') 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置
* 创建config文件夹并创建默认配置文件default.js

```
module.exports = {
  port: 3000, //程序启动端口
  session: { //express-session 配置信息
    secret: 'blog',
    key: 'blog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/blog'//mongodb地址， blog为
};
```
## 功能及路由设计

```
注册
注册页：GET /signup
注册（包含上传头像）：POST /signup
登录
登录页：GET /signin
登录：POST /signin
登出：GET /signout
查看文章
主页：GET /posts
个人主页：GET /posts?author=xxx
查看一篇文章（包含留言）：GET /posts/:postId
发表文章
发表文章页：GET /posts/create
发表文章：POST /posts
修改文章
修改文章页：GET /posts/:postId/edit
修改文章：POST /posts/:postId/edit
删除文章：GET /posts/:postId/remove
留言
创建留言：POST /posts/:postId/comment
删除留言：GET /posts/:postId/comment/:commentId/remove
```
## Restful
* URI中不应该包含动词，/posts/show/1是不合适的，正确的写法应该是/posts/1, 使用get方法.
* GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源
* 资源可以是一种服务，如转账transaction
* 版本号不应该出现在uri中，应该出现在请求的头信息中
* 返回状态码

```
200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
204 NO CONTENT - [DELETE]：用户删除数据成功。
400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
```
* Http 动词

```
GET（SELECT）：从服务器取出资源（一项或多项）。
POST（CREATE）：在服务器新建一个资源。
PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
DELETE（DELETE）：从服务器删除资源。
HEAD：获取资源的元数据。
OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。
```

## 系统实现
### 相关实现
* API的身份认证应该使用OAuth 2.0框架 http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html
* 服务器返回的数据格式，应该尽量使用JSON，避免使用XML
* OAuth2.0 四种授权模式：授权码模式，简化模式，密码模式，客户端模式
* Session 通过express-session中间件来实现
* 页面通知需要connect-flash中间件实现，并依赖于session

### 权限控制
新建中间件来实现权限控制

### 中间件加载  
中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，这样静态文件的请求就不会落到业务逻辑的路由里；flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 的.

### Semantic-UI框架定制前端界面  
http://www.jianshu.com/p/5d1aa9d735e6

### app.locals 和 res.locals

express/lib/application.js  

```
app.render = function render(name, options, callback) {
  ...
  var opts = options;
  var renderOptions = {};
  ...
  // merge app.locals
  merge(renderOptions, this.locals);

  // merge options._locals
  if (opts._locals) {
    merge(renderOptions, opts._locals);
  }

  // merge options
  merge(renderOptions, opts);
  ...
  tryRender(view, renderOptions, done);
};
```
express/lib/response.js  

```
res.render = function render(view, options, callback) {
  var app = this.req.app;
  var opts = options || {};
  ...
  // merge res.locals
  opts._locals = self.locals;
  ...
  // render
  app.render(view, opts, done);
};
```
在调用 res.render 的时候，express 合并（merge）了 3 处的结果后传入要渲染的模板，优先级：res.render 传入的对象> res.locals 对象 > app.locals 对象，所以 app.locals 和 res.locals 几乎没有区别，都用来渲染模板，使用上的区别在于：app.locals 上通常挂载常量信息（如博客名、描述、作者信息），res.locals 上通常挂载变量信息，即每次请求可能的值都不一样（如请求者信息，res.locals.user = req.session.user）

### DB操作

Mongolass

### 注册与文件上传

express-formidable 

### 404页面

```
// 404 page
app.use(function (req, res) {
  if (!res.headersSent) {
    res.status(404).render('404');
  }
});
```

### 错误页面

### 日志
我们将正常请求的日志打印到终端并写入了 logs/success.log，将错误请求的日志打印到终端并写入了 logs/error.log。需要注意的是：记录正常请求日志的中间件要放到 routes(app) 之前，记录错误请求日志的中间件要放到 routes(app) 之后.

```
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
// 路由
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));
```

## gitignore
如果我们想把项目托管到 git 服务器上（如: GitHub），而不想把线上配置、本地调试的 logs 以及 node_modules 添加到 git 的版本控制中，这个时候就需要 .gitignore 文件了，git 会读取 .gitignore 并忽略这些文件

## 测试

