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