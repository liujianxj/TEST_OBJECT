<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="description" content="Xenon Boostrap Admin Panel" />
	<meta name="author" content="" />
	
	<title>LJ登录</title>

	<link rel="stylesheet" href="static/assets/css/fonts/linecons/css/linecons.css">
	<link rel="stylesheet" href="static/assets/css/fonts/fontawesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="static/assets/css/bootstrap.css">
	<link rel="stylesheet" href="static/assets/css/xenon-core.css">
	<link rel="stylesheet" href="static/assets/css/xenon-forms.css">
	<link rel="stylesheet" href="static/assets/css/xenon-components.css">
	<link rel="stylesheet" href="static/assets/css/xenon-skins.css">
	<link rel="stylesheet" href="static/assets/css/custom.css">

	<script src="static/assets/js/jquery-1.11.1.min.js"></script>

	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
	
	
</head>
<body class="page-body login-page">

	
	<div class="login-container">
	
		<div class="row">
		
			<div class="col-sm-6">
			
				<script type="text/javascript">
					jQuery(document).ready(function($)
					{
						// Reveal Login form
						setTimeout(function(){ $(".fade-in-effect").addClass('in'); }, 1);
						
						
						// Validation and Ajax action
						$("form#login").validate({
							rules: {
								username: {
									required: true
								},
								
								passwd: {
									required: true
								}
							},
							
							messages: {
								username: {
									required: '用户名不能为空！'
								},
								
								passwd: {
									required: '密码不能为空！'
								}
							},
							
							// Form Processing via AJAX
							submitHandler: function(form)
							{
								var opts = {
									"closeButton": true,
									"debug": false,
									"positionClass": "toast-top-full-width",
									"onclick": null,
									"showDuration": "300",
									"hideDuration": "1000",
									"timeOut": "5000",
									"extendedTimeOut": "1000",
									"showEasing": "swing",
									"hideEasing": "linear",
									"showMethod": "fadeIn",
									"hideMethod": "fadeOut"
								};
								
								$.ajax({
									url: "loginAjax",
									type : "post",
									//dataType: 'json',
									data: {
										username: $(form).find('#username').val(),
										password: $(form).find('#passwd').val()
									},
									success: function(data){
										if(data == "success")
										{
											window.location.href = 'main';
										}else{
											toastr.error("You have entered wrong password, please try again. User and password is <strong>demo/demo</strong> :)", "Invalid Login!", opts);
											$passwd.select();
										}
									},
									error:function(data){
										console.log(data)
									}
								});
						
							}
						});
						
						// Set Form focus
						$("form#login .form-group:has(.form-control):first .form-control").focus();
					});
				</script>
				
				<!-- Errors container -->
				<div class="errors-container">
				
									
				</div>
				
				<!-- Add class "fade-in-effect" for login form effect -->
				<form method="post" role="form" id="login" class="login-form fade-in-effect">
					
					<div class="login-header">
						<p>欢迎登录!</p>
					</div>
	
					
					<div class="form-group">
						<label class="control-label" for="username">用户名</label>
						<input type="text" class="form-control input-dark" name="username" id="username" autocomplete="off" />
					</div>
					
					<div class="form-group">
						<label class="control-label" for="passwd">密码</label>
						<input type="password" class="form-control input-dark" name="passwd" id="passwd" autocomplete="off" />
					</div>
					
					<div class="form-group">
						<button type="submit" class="btn btn-dark  btn-block text-left">
							<i class="fa-lock"></i>
							登录
						</button>
					</div>
					
				</form>
				
			</div>
			
		</div>
		
	</div>



	<!-- Bottom Scripts -->
	<script src="static/assets/js/bootstrap.min.js"></script>
	<script src="static/assets/js/TweenMax.min.js"></script>
	<script src="static/assets/js/resizeable.js"></script>
	<script src="static/assets/js/joinable.js"></script>
	<script src="static/assets/js/xenon-api.js"></script>
	<script src="static/assets/js/xenon-toggles.js"></script>
	<script src="static/assets/js/jquery-validate/jquery.validate.min.js"></script>
	<script src="static/assets/js/toastr/toastr.min.js"></script>


	<!-- JavaScripts initializations and stuff -->
	<script src="static/assets/js/xenon-custom.js"></script>

</body>
</html>