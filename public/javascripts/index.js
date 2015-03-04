var oList = document.getElementById('list');
var oPicBtn = document.getElementById('btn-pic');
var oLycBtn = document.getElementById('btn-lyc');
var oPic = document.getElementById('pic');
var oLyc = document.getElementById('lyc');


oList.onmouseover = function(){
	this.style.opacity = 1;
};
oList.onmouseout = function(){
	this.style.opacity = 0.8;
};

oPicBtn.onclick = function(){
	oLyc.style.display = 'none';
	oPic.style.display = 'block';
};

oLycBtn.onclick = function(){
	oLyc.style.display = 'block';
	oPic.style.display = 'none';
};
