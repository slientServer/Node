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

`module.exports="hello, I am module exports."`   
`exports.name= "brian.hao"`

定义执行文件exec.js

`var test= require('./obj.js');`  
`test.name();`   

执行结果

`TypeError: Object hello, ... has no method 'name'`

分析  

`因为test拿到的是module.exports, 如果module.exports定义了，exports会被自动忽略`



