var express = require('express');
var router = express.Router();
var musicsPath = 'public/musics';
/* GET home page. */
router.get('/', function(req,res){
	var fs = require('fs');
	fs.readdir(musicsPath,function(err,files){
		if(err){
			console.log(err);
		}else{
			res.render('index',{title:'湘岚爱音乐',music:files});
		}
	});
});

module.exports = router;
