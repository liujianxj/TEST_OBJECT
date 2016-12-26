<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>Testing websockets</title>
</head>
<link href="../js/ueditor1_2_2/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">
<script src="../js/jquery-1.7.2-min.js"></script>
<script type="text/javascript" charset="utf-8" src="../js/ueditor1_2_2/umeditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="../js/ueditor1_2_2/umeditor.min.js"></script>
<script type="text/javascript" src="../js/ueditor1_2_2/lang/zh-cn/zh-cn.js"></script>

<script type="text/javascript">
	var webSocket = new WebSocket('ws://192.168.16.26:8080/LJCMS/test/websocket');

	webSocket.onerror = function(event) {
		onError(event)
	};

	webSocket.onopen = function(event) {
		onOpen(event)
	};

	webSocket.onmessage = function(event) {
		onMessage(event)
	};

	function onMessage(event) {
		document.getElementById('messages').innerHTML += '<br />' + event.data;
		var div = document.getElementById('messages');
		div.scrollTop = div.scrollHeight;
		getNameList();
	}

	function onOpen(event) {
		document.getElementById('messages').innerHTML = '您以连接成功！';
	}

	function onError(event) {
		alert(event.data);
	}
	
	function setUserName(){
		var username = $("#userName").val();
		webSocket.send("{socketType:'name',userName:'"+username+"'}");
		$("#userName").attr("disabled","disabled");
		$("#userNamebutton").attr("disabled","disabled");
		
		$("#msg").css("display","block");
		
		return false;
	}

	function start(){
		var usermessage = UM.getEditor('myEditor').getContent();
		//清除守卫换行符
		usermessage = usermessage.replace(/^\n+|\n+$/g,"");
		var json = "{socketType:'msg',userMessage:'"+usermessage+"'}";
		webSocket.send(json);
		
		return false;
	}
	
	function getNameList(){
		$("#userlist").html("");
		$.ajax({
		    type : "post",
		    url : "../test/getNameList",
		    dataType: "json",
		    success : function(data) {
		    	//alert(JSON.stringify(data));
		    	for(var i=0; i<data.length; i++){
		    		$("#userlist").append(data[i]+"<br/>");
		    	}
		    },
		    error:function(data){
		    	alert("error");
		    }
		});
	}
	
	function setNameList(){
		$.ajax({
		    type : "post",
		    url : "../test/setNameList",
		    data : {
				'username' : $("userName").html()
			},
		    dataType: "json",
		    success : function(data) {
		    	
		    },
		    error:function(data){
		    	alert("error");
		    }
		});
	}

	$(function(){
		var um = UM.getEditor('myEditor');
		$('#myEditor').keydown(function(e){
			if(e.keyCode==13){
				start();
				$("#myEditor").html("");
			}
		});
	});
	 
</script>

<body>
<div>

<table>
	<tr>
		<td><div id="messages" style="OVERFLOW-Y: auto; width:800px; height:400px; border:1px solid #000;">您的浏览器不支持HTML5轻升级浏览器</div></td>
		<td><div id="userlist" style="OVERFLOW-Y: auto; width:200px; height:400px; border:1px solid #000;"></div></td>
	</tr>
</table>

昵称：<input type="text" id="userName" maxlength="10"/><input type="button" id="userNamebutton" value="确定名称" onclick="setUserName()"/><br/>

</div>
<div id="msg" style="display: none">
	<script type="text/plain" id="myEditor" style="width:1000px;height:240px;"></script>
	<div>
		<input type="button" value="发送" onclick="start()" />
		<input type="button" value="mingzi" onclick="getNameList()"/>
	</div>
</div>
	
</body>
</html>