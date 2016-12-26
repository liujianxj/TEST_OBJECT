<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>binding</title>
<link rel="stylesheet" href="js/jqm/jquery.mobile-1.4.5.min.css"/>
<script type="text/javascript" src="js/jquery-1.7.2-min.js"></script>
<script type="text/javascript" src="js/jqm/jquery.mobile-1.4.5.min.js"></script>
<script>
	function queding(){
		$.ajax({
		    type : "post",
		    url : "bindingCode",
		    data : {
		      'code' : $("#code").val(),
		      'phoneNumber' : $("#phoneNumber").val()
		    },
		    dataType: "json",
		    success : function(data) {
		    	if(data.msg == "1"){
		    		alert("绑定成功")
		    	}
		    }
		});
	}
</script>
</head>
<body>
<form>
	<label for="text-1">请输入您的车牌号:</label>
	<input type="text" data-clear-btn="true" id="code">
	<label for="text-3">请输入要绑定的手机号码</label>
	<input type="number" data-clear-btn="true" id="phoneNumber">
<br/>
	<input type="button" value="确定" onclick="queding()">
</form>
</body>
</html>