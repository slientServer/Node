module.exports = {
  port: 3000, //程序启动端口
  session: { //express-session 配置信息
    secret: 'blog',
    key: 'blog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/blog'//mongodb地址， blog为
};