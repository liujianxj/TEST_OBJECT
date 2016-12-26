<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>哦也</title>
<style>
html, body {
    margin: 0;
    font-family: arial, "Microsoft YaHei";
    background-color: #272822;
    color: #FEFEFE;
}
</style>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload.css"/>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload-ui.css"/>
<script type="text/javascript" src="js/jquery-1.7.2-min.js"></script>
<script>
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

var file = null;
var AudioBufferSouceNode = null;
var audioContext = null;
var allCapsReachBottom = false;
var status = 0;
var animationId = null;

loadSound("html/mp3.mp3"); //调用
//定义加载音频文件的函数
function loadSound(url) {
	var request = new XMLHttpRequest(); //建立一个请求
	request.open('GET', url, true); //配置好请求类型，文件路径等
	request.responseType = 'arraybuffer'; //配置数据返回类型
	// 一旦获取完成，对音频进行进一步操作，比如解码
	request.onload = function() {
		var dogBarkingBuffer = null;
		try {
			audioContext = new window.AudioContext();
			
			//解析音频
			audioContext.decodeAudioData(request.response, function(buffer) {
            	//播放音频
            	AudioBufferSouceNode = audioContext.createBufferSource();
            	
            	
            	//创建分析器
            	var analyser = audioContext.createAnalyser();
            	//将source与分析器连接 (可以与扬声器直接链接，这样就只播放声音不会分析音频)
            	AudioBufferSouceNode.connect(analyser);
            	
            	//将分析器与destination连接，这样才能形成到达扬声器的通路
            	analyser.connect(audioContext.destination)
            	AudioBufferSouceNode.buffer = buffer;
            	
            	if (animationId !== null) {
                    cancelAnimationFrame(this.animationId);
                }
            	
            	AudioBufferSouceNode.start(0);
            	
            	
            	//开始绘图
            	canvas = document.getElementById('canvas'),
	            cwidth = canvas.width,
	            cheight = canvas.height - 2,
	            meterWidth = 10, //width of the meters in the spectrum
	            gap = 1, //gap between meters
	            capHeight = 2,
	            capStyle = '#fff',
	            meterNum = 800 / (10 + 2), //count of the meters
	            capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
	            
            	var array = new Uint8Array(analyser.frequencyBinCount),
            	ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#0f0');
                gradient.addColorStop(0.5, '#ff0');
                gradient.addColorStop(0, '#f00');
                
                analyser.getByteFrequencyData(array);
                
                alert(array.length+"aaa")
                
                //for(var i=0; i<array.length; i++){
                	var h = 320;
                	ctx.fillStyle = capStyle;
                	ctx.fillRect(10,h-30,10,30);
                //}
                	requestAnimationFrame(alert());
               	for(var i=0; i<array.length; i++){
               		console.log(array[i])
               	}
                //ctx.fillRect(1 * 12 , cheight - value + capHeight, meterWidth, cheight);
               	requestAnimationFrame(drawMeter);
            }, function(e) {
                //that._updateInfo('!Fail to decode the file', false);
                console.log(e);
            });
		} catch (e) {
			alert('浏览器不支持');
		}
	}
	request.send();
}

function timer(){
	$("#time").html(audioContext.currentTime);
	setTimeout("timer()",1000);
}

</script>
</head>
<body>
<canvas id='canvas' width="800" height="350"></canvas>
<div id="time"></div>
<input type="button" value="开始" onclick="AudioBufferSouceNode.start(0);"/>
<input type="button" value="停止" onclick="AudioBufferSouceNode.stop();"/>
</body>
</html>