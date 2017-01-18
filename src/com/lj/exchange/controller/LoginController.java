package com.lj.exchange.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginController{

	/**
	 * 登录
	 * */
	@RequestMapping(value="/loginAjax",method = RequestMethod.POST)
	@ResponseBody
	public String loginAjax (HttpServletRequest request, HttpServletResponse response, String username,String password){
		UsernamePasswordToken token = new UsernamePasswordToken();
		token.setUsername(username);
		token.setPassword(password.toCharArray());
		try {
			SecurityUtils.getSubject().login(token);
			//更新登陆时间
			Subject currentUser = SecurityUtils.getSubject();
			return "success";
		} catch (AuthenticationException e) {//登陆失败
			//如果登陆失败销毁session
			Subject currentUser = SecurityUtils.getSubject();
    		Session session = currentUser.getSession();
    		session.removeAttribute("loginUser");
			
			if(e.getMessage() == "usererror"){//用户不存在
				return "usererror";
			}else if(e.getMessage() == "enterpriseEnableError"){//账号禁用
				return "enterpriseEnableError";
			}
			return "error";//用户密码错误
		}
	}
	
	
}
