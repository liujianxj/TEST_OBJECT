<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>哦也</title>
<style>
.bar {
    height: 18px;
    background: green;
}
</style>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload.css"/>
<link rel="stylesheet" href="js/jQuery-File-Upload-9.13.0/css/jquery.fileupload-ui.css"/>
<script type="text/javascript" src="js/jquery-1.7.2-min.js"></script>
<script type="text/javascript" src="js/jQuery-File-Upload-9.13.0/js/vendor/jquery.ui.widget.js"></script>
<script type="text/javascript" src="js/jQuery-File-Upload-9.13.0/js/jquery.iframe-transport.js"></script>
<script type="text/javascript" src="js/jQuery-File-Upload-9.13.0/js/jquery.fileupload.js"></script>
<script>
$(function () {
    $('#fileupload').fileupload({
        dataType: 'json',
        add: function (e, data) {
        	alert(1)
        },
        done: function (e, data) {alert(1)
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
        
    });
});
</script>
</head>
<body>
<span class="btn btn-success fileinput-button">
    <i class="glyphicon glyphicon-plus"></i>
    <span>Add files...</span>
    <input type="file" name="files[]" id="fileupload" data-url="server/php/" multiple="multiple">
</span>
	
	<div id="progress">
	    <div class="bar" style="width: 0%;"></div>
	</div>

</body>
</html>