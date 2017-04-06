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







