<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>

<script src="./js/jquery-1.7.2-min.js"></script>
<script>
function login(){
	var username = $("#username").val();
	var password = $("#password").val();
	$.ajax({
	    type : "post",
	    url : "./loginAjax",
	    data : {
	      'username' : username,
	      'password' : password
	    },
	    dataType: "json",
	    success : function(data) {
	    	if(data == "success"){
	    		window.location.href="./liujian"
	    	}else{
	    		alert("账号错误！")
	    	}
	    }
	});
}
</script>
</head>
<body>
	用户名：<input type="text" id="username"/><br/>
	密码：<input type="password" id="password"/><br/>
	<input type="button" value="登陆" onclick="login()"/>
</body>
</html>