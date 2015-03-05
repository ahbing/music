var oList = document.getElementById('list');
var oUploadBtn = document.getElementById('btn-upload');
var oLycBtn = document.getElementById('btn-lyc');
var oUpload = document.getElementById('upload');
var oLyc = document.getElementById('lyc');


oList.onmouseover = function(){
	this.style.opacity = 1;
};
oList.onmouseout = function(){
	this.style.opacity = 0.8;
};

oUploadBtn.onclick = function(){
	oLyc.style.display = 'none';
	oUpload.style.display = 'block';
};

oLycBtn.onclick = function(){
	oLyc.style.display = 'block';
	oUpload.style.display = 'none';
};
