(function(){
	var $ = function(s){
		return document.querySelector(s);
	};
	var aLi = document.querySelectorAll('#list li');
	for(var i = 0; i < aLi.length; i++){
		aLi[i].onclick = function(){
			loadMusic('/musics/'+this.title);
		};
	}
})();

var xhr = new XMLHttpRequest();
var count = 0;
var source = null;  //音频资源
var audioContext = window.audioContext || window.webkitAudioContext;
var ac = new audioContext();
var destination = ac.destination;  //音频目的地


function loadMusic(url){
	var n = ++count;   //n保存上一次的歌曲序号 再次点击 count 增1
	xhr.abort();   // ajax终止上一次请球
	xhr.open('GET',url);
	xhr.responseType = 'arraybuffer';
	var name = url.replace('mp3','lrc');
	console.log(name);
	xhr.onload = function(){
		source && source.stop(0);
		if(n !== count)return;
		var buffer = xhr.response;
		ac.decodeAudioData(buffer,function(buffer){
			if(n !== count)return;
			var audioBufferSource = ac.createBufferSource();
			audioBufferSource.buffer = buffer;
			audioBufferSource.connect(destination);

			loadLyc(name);//加载歌词

			audioBufferSource.start(0);
			source = audioBufferSource;
		},function(err){
			console.log(err);
		});
	};
	xhr.send();
}

function loadLyc(url){
	xhr.open('GET',url);
	xhr.responseType = 'text';

	xhr.onload = function(){
		var lyc = parserLyc(xhr.response);
		//console.log(parserLyc(xhr.response));
		showLyc(lyc);
	};
	xhr.send();
}

function parserLyc(text){
	var textArr = text.split('\n'),
		reg = /\[\d{2}:\d{2}.\d{2}\]/g,
		result = [];
	//console.log(textArr);
	//去掉不含时间的值
	while(!reg.test(textArr[0])){
		textArr = textArr.slice(1);
	}
	
	textArr[textArr.length -1].length === 0  && textArr.pop();
	// console.log(textArr);
	textArr.forEach(function(value,index){
		var time = value.match(reg);  //获取时间
		var lyc = value.replace(reg, '');
		time.forEach(function(v,i){
			var t = v.slice(1,-1).split(':');  //去掉中括号  并以:分成数组
			result.push([parseInt(t[0],10)*60 + parseFloat(t[1]) ,lyc]);
		});
	});
	result.sort(function(a,b){
		return a[0]-b[0];
	});
	return result;
}

function showLyc(lyc){
	var oLyc = document.getElementById('lyc');
	// var oP = document.createElement('p');
	setInterval(function(){
		curtime = ac.currentTime;
		//console.log(ac.currentTime)
		for(var i = 0; i < lyc.length; i++){
			if(curtime >= lyc[i][0]+2){   //慢两秒
				oLyc.textContent = lyc[i][1];
			}
		}
	},10);
}







