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
var ac;
var timer;

function loadMusic(url){
	var oUpload = document.getElementById('upload');
	var oLyc = document.getElementById('lyc');
	var n = ++count;   //n保存上一次的歌曲序号 再次点击 count 增1
	xhr.abort();   // ajax终止上一次请球
	xhr.open('GET',url);
	xhr.responseType = 'arraybuffer';
	var name = url.replace('mp3','lrc');
	console.log(name);

	xhr.onload = function(){
		if(source){
			source.stop(0);
			oUpload.innerHTML = '';
			lyc.innerHTML = '';
		}

		if(n !== count){
			oUpload.innerHTML = '';
			lyc.innerHTML = '';
			return;
		};
		var buffer = xhr.response;
		var audioContext = window.audioContext || window.webkitAudioContext;
		ac = new audioContext();
		ac.decodeAudioData(buffer,function(buffer){
			if(n !== count){
				oUpload.innerHTML = '';
				lyc.innerHTML = '';
				return;
			}

			var destination = ac.destination;  //音频目的地
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
		showLycAll(lyc);
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
	var oP = document.createElement('p');
	if(timer){
		clearInterval(timer);
	}
	timer = setInterval(function(){
		curtime = ac.currentTime;
		//console.log(ac.currentTime)
		for(var i = 0; i < lyc.length; i++){
			if(curtime >= lyc[i][0]){
				oP.innerHTML = '<p title='+lyc[i][0]+'>'+lyc[i][1]+'</p>';
				oLyc.appendChild(oP);
			}
		}
	},10);
}

function showLycAll(lyc){
	var oUpload = document.getElementById('upload');
	var oList = document.createElement('ol');
	var fragment = document.createDocumentFragment();
	for(var i = 0; i < lyc.length; i++){
			var oLi = document.createElement('li');
			var oSpan = document.createElement('span');

			oLi.innerHTML = lyc[i][1];
			oLi.title = lyc[i][0];
			oSpan.innerHTML = '<label for="add" ><input id="add" type="file" style="display:none;" value="pic">添加</label>';
			oSpan.title = '点击添加图片';
			oSpan.className = 'addPicBtn';
			oSpan.style.display ='none';
			oLi.appendChild(oSpan);

			fragment.appendChild(oLi);
	}
	oList.appendChild(fragment);
	oUpload.appendChild(oList);

	addPic();
}


var theBox;  //绑定图片的div
function addPic(){
	var aLycLi = document.getElementById('upload').getElementsByTagName('li');
	var oUpload = document.getElementById('upload');
	var addtime,addlyc;  //添加的歌曲时间和歌词
	var aBox = oUpload.getElementsByTagName('div');

	for(var i = 0; i < aLycLi.length; i++){
		(function(i){
			aLycLi[i].onmouseover = function(){
				// console.log(this.children[0]);
				var timeTitle = this.title;
				var addPicBtn = this.children[0];  //添加的按钮

				this.children[0].style.display = 'block';
				console.log(addPicBtn);
				// 添加图片按钮
				addPicBtn.onclick = function(){
					//console.log(this.parentNode.title);
					if(aBox.length){ //存在aBox
						for(var j = 0; j < aBox.length; j++){
							//console.log(aBox[j].getAttribute('data-time'));
							//console.log(this.parentNode.title);
							if(aBox[j].getAttribute('data-time') == this.parentNode.title){
								for(var k = 0; k < aBox.length; k++){
									aBox[k].style.display ='none';
								}
								theBox = aBox[j];
								aBox[j].style.display = 'block';
							}else{
								var oBox = document.createElement('div');
								oBox.className = 'cont-pic';
								addtime = this.parentNode.title;
								addlyc = this.parentNode.textContent.slice(0,-2);
								oBox.setAttribute('data-time',addtime);
								oBox.innerHTML = '<p class="box-lyc">'+addlyc;
								oUpload.appendChild(oBox);
							}
						}
					}else{
						var oBox = document.createElement('div');
						theBox = oBox;
						oBox.className = 'cont-pic';
						addtime = this.parentNode.title;
						oBox.style.display ='block';
						addlyc = this.parentNode.textContent.slice(0,-2);
						oBox.setAttribute('data-time',addtime);
						oBox.innerHTML = '<p class="box-lyc">'+addlyc;

						oUpload.appendChild(oBox);
						//console.log(aBox[0].getAttribute('data-time'));
					}
				}
				document.getElementById('add').addEventListener('change',readPic,false);
			};


			aLycLi[i].onmouseout = function(){
				// console.log(this.childNode);
				this.children[0].style.display = 'none';
			}
		})(i);
	}
}

function readPic(e){
	//console.log('hello');
	var files = e.target.files;
	for(var i = 0, f; f = files[i]; i++){
		//限制是img文件
		if(!f.type.match('image.*')){
			continue;
		}
		var reader = new FileReader();
		reader.onload = (function(theFile){
			return function(e){
				var span = document.createElement('span');
	      span.innerHTML = ['<img class="" src="', e.target.result,'" title="', escape(theFile.name), '"/>'].join('');
	      theBox.appendChild(span);
	      //console.log(theBox);
	      editImg();
			}
		})(f);
		reader.readAsDataURL(f);
	}
}
function editImg(){
	var oImg = document.getElementById('upload').getElementsByTagName('img');
	for(var i = 0; i<oImg.length;i++){
		(function(){
			console.log(oImg[i].offsetHeight);
			console.log(oImg[i].offsetWidth);
			if(oImg[i].offestWight >= oImg[i].offsetHeight){
				oImg[i].className = 'picforWidth';
			}else{
				oImg[i].className = 'picforHeight';
			}
		})(i);
	}
}








