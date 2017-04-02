# MongoDB Spec
## Basic configuration
* MongoDB数据默认存在/data/db中, 所以需要创建该文件夹，如果需要别的文件夹，需要在dbpath中进行配置
* 需要确认当前用户拥有对/data/db的读写权限.
* 如果使用默认目录，直接执行mongod就可以启动mongodb.
* 需在环境变量中指定mongod路径: <path to binary>/mongod.
* 如果需要指定数据目录，可以使用mongod --dbpath <path to data directory>.
* 可视化管理工具RoboMongo.