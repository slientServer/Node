# NodeJs Spec
## exports and module.exports
exports 和 module.exports 的区别介绍
### 总结
* exports 和 module.exports默认指向同一块内存
* exports 实际是帮助module.exports收集属性
* require 返回的是module.exports指向的内容
* 如果module.exports的指向发生改变，需要重新执行exports=module.exports, 否则所有对exports设置的属性都将不能正确的返回
* module.exports 默认指向的是{}

### 测试代码块
定义测试文件obj.js  

```
module.exports="hello, I am module exports.";    
exports.name= "brian.hao";
```

定义执行文件exec.js  

```
var test= require('./obj.js');
test.name();  
```

执行结果  

`TypeError: Object hello, ... has no method 'name'`

分析  

`因为test拿到的是module.exports, 如果module.exports定义了，exports会被自动忽略` 
 
## Promise
### 总结
* Promise 三种状态：Pending, Resolved, Rejected.
* Promise一旦新建，无法取消或终止.
* 基本API包括：resolve(), reject(), Promise.prototype.then(), Promise.prototype.catch(), all(), race().
* Promise.prototype.then 和 Promise.prototype.catch 返回的是Promises所以可以级联.
* Promise.length 返回值为1.  

### 级联调用测试  
```
// 0.5秒后返回input*input的计算结果:
function multiply(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' x ' + input + '...');
        setTimeout(resolve, 500, input * input);
    });
}

// 0.5秒后返回input+input的计算结果:
function add(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' + ' + input + '...');
        setTimeout(resolve, 500, input + input);
    });
}

var p = new Promise(function (resolve, reject) {
    log('start new Promise...');
    resolve(123);
});

p.then(multiply)
 .then(add)
 .then(multiply)
 .then(add)
 .then(function (result) {
    log('Got value: ' + result);
});  
```
### 参考资料
* 入门：http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000
* 进阶：https://github.com/xieranmaya/blog/issues/3
* 进阶：http://www.cnblogs.com/fsjohnhuang/p/4135149.html  

## Package.json
* 每个项目的根目录下都有package.json文件
* 该文件定义了项目所需要的各种模块以及配置信息（名称、版本、许可证）
* version遵守"大版本.次要版本.小版本"
* scripts指定了运行脚本命令的NPM命令的缩写，npm run preinstall、npm run postinstall、npm run start、npm run test  

```
"scripts": {
    "preinstall": "echo here it comes!",
    "postinstall": "echo there it goes!",
    "start": "node index.js",
    "test": "tap test/*.js"
}
```
* dependencies字段指定了项目运行所依赖的模块，devDependencies指定项目开发所需要的模块
* package.json文件可以手工编写，也可以使用npm init命令自动生成
* 有了package.json文件，直接使用npm install命令，就会在当前目录中安装所需要的模块
* 如果一个模块不在package.json文件之中，可以单独安装这个模块，并使用相应的参数，将其写入package.json文件之中,--save参数表示将该模块写入dependencies属性，--save-dev表示将该模块写入devDependencies属性

```
$ npm install express --save
$ npm install express --save-dev
```
* peerDependencies字段，就是用来供插件指定其所需要的主工具的版本
* bin项用来指定各个内部命令对应的可执行文件的位置
* main字段指定了加载的入口文件，require('moduleName')就会加载这个文件。这个字段的默认值是模块根目录下面的index.js
* config字段用于向环境变量输出值
* browser指定该模板供浏览器使用的版本。Browserify这样的浏览器打包工具，通过它就知道该打包那个文件
* engines指明了该项目所需要的node.js版本
* man用来指定当前模块的man文档的位置
* preferGlobal的值是布尔值，表示当用户不将该模块安装为全局模块时（即不用–global参数），要不要显示警告，表示该模块的本意就是安装为全局模块
* style指定供浏览器使用时，样式文件所在的位置。样式文件打包工具parcelify，通过它知道样式文件的打包位置  

## Npm使用指南
* 最好使用 npm.init 初始化项目
* npm i express --save/npm i express -S (安装 express，同时将 "express": "^4.14.0" 写入 dependencies )
* npm i express --save-dev/npm i express -D (安装 express，同时将 "express": "^4.14.0" 写入 devDependencies )
* npm i express --save --save-exact (安装 express，同时将 "express": "4.14.0" 写入 dependencies )
* npm config set save-exact true 会自动添加参数--save-exact
* npm 的 scripts 有一些内置的缩写命令，如常用的：npm start 等价于 npm run start; npm test 等价于 npm run test
* --save-exact可以锁定依赖的版本，但这并不能完全防止意外情况的发生，因为锁定的只是最外一层的依赖，而里层依赖的模块的 package.json 有可能写的是 "mongoose": "*"。为了彻底锁定依赖的版本，让你的应用在任何机器上安装的都是同样版本的模块（不管嵌套多少层），通过运行 npm shrinkwrap，会在当前目录下产生一个 npm-shrinkwrap.json，里面包含了通过 node_modules 计算出的模块的依赖树及版本。上面的截图也显示：只要目录下有 npm-shrinkwrap.json 则运行 npm install 的时候会优先使用 npm-shrinkwrap.json 进行安装，没有则使用 package.json 进行安装
* 如果 node_modules 下存在某个模块（如直接通过 npm install xxx 安装的）而 package.json 中没有，运行 npm shrinkwrap 则会报错。另外，npm shrinkwrap 只会生成 dependencies 的依赖，不会生成 devDependencies 的

## 初始化Express项目
### 初始化
* npm init 初始化项目
* npm i express@4.14.0 --save 安装express并且将依赖保存进package.json

### supervisor
supervisor 可以用来提高效率，无需每次都重启server  

* npm install -g supervisor 全局安装
* supervisor 会监听当前目录下 node 和 js 后缀的文件，当这些文件发生改动时，supervisor 会自动重启程序
* 启动监听命令 supervisor --harmony index
* NodeJS使用V8引擎，而V8引擎对ES6中的东西有部分支持，所以在NodeJS中可以使用一些ES6中的东西。但是由于很多东西只是草案而已，也许正式版会删除，所以还没有直接引入。而是把他们放在了和谐(harmony)模式下，在node的运行参数中加入harmony flag才能启用  

### 路由

```
app.get('/users/:name', function(req, res){
  res.send('hello, '+ req.params.name);
})
```
:name 作为占位符  

* req.query: 解析后的 url 中的 querystring，如 ?name=haha，req.query 的值为 {name: 'haha'}
* req.params: 解析 url 中的占位符，如 /:name，访问 /haha，req.params 的值为 {name: 'haha'}
* req.body: 解析后请求体，需使用相关的模块，如 body-parser，请求体为 {"name": "haha"}，则 req.body 为 {name: 'haha'}

### 路由分离

index.js

```
var express = require('express');
var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
//将index router 挂载在'/'
app.use('/', indexRouter);
// 将user rotuer 挂载在 'users/:name'
app.use('/users', userRouter);

app.listen(3000);
```
routes/index.js

```
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('hello, express');
});

module.exports = router;
```
routes/users.js

```
var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res) {
  res.send('hello, ' + req.params.name);
});

module.exports = router;
```
每个路由文件通过生成一个 express.Router 实例 router 并导出，通过 app.use 挂载到不同的路径

## 模板引擎
### Ejs
安装ejs:  
npm i ejs --save  
设置：  
app.set('views', './views');  设置模板路径  
app.set('view engine', 'ejs'); 设置模板引擎  
未使用模板引擎：  
app.send('string');  
使用模板引擎：
app.render('index', {name: req.params.name});  
ejs模板内容：

* <% code %>：运行 JavaScript 代码，不输出
* <%= code %>：显示转义后的 HTML内容
* <%- code %>：显示原始 HTML 内容

### Includes
引用模板要使用<%- code %> 而不是<%= code %>

### 中间件