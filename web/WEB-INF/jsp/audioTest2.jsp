<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>哦也</title>
<style>

</style>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload.css"/>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload-ui.css"/>
<script type="text/javascript" src="js/jquery-1.7.2-min.js"></script>


</head>
<body>
<canvas id="canvas" width="400" height="100"></canvas><br/>
<script>
canvas.style.border="1px solid #CCC";
var AudioContext=AudioContext||webkitAudioContext;
var context=new AudioContext;
//加载媒体
var audio=new Audio("html/mp3.mp3");
//创建节点
var source=context.createMediaElementSource(audio);
var analyser=context.createAnalyser();
//连接：source → analyser → destination
source.connect(analyser);
analyser.connect(context.destination);
//Canvas初始化
var width=canvas.width,height=canvas.height;
var ctx=canvas.getContext("2d");
ctx.translate(0.5,0.5);

//计算出采样频率44100所需的缓冲区长度
var length=analyser.frequencyBinCount*44100/context.sampleRate|0;
//创建数据
var output=new Uint8Array(length);
//播放帧
(function callee(e){
  analyser.getByteFrequencyData(output);
  //将缓冲区的数据绘制到Canvas上
  //ctx.clearRect(-0.5,-0.5,width,height);
  ctx.beginPath(),ctx.moveTo(0,height);
  for(var i=0;i<width;i++)
    ctx.lineTo(i,height-height*output[Math.round(length*i/width)]/255);
  ctx.lineTo(i,height),ctx.fill();
  //请求下一帧
  requestAnimationFrame(callee);
})();
//播放
audio.play();
</script>
<input type="button" onclick="audio.play()" value="播放" />
<input type="button" onclick="audio.pause()" value="暂停" />
</body>
</html>