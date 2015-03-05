// 设置链接数据库
//引入配置文件
var setting = require('../setting'),
		Db = require('mongodb').Db,
		Connection = require('mongodb').Connection,
		Server = require('mongodb').Server;
//导出链接数据库
module.exports = new Db( setting.db, new Server( setting.host, setting.port));