package com.lj.exchange.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PageController {

	/**
	 * 登录页
	 * */
	@RequestMapping(value="/login",method = RequestMethod.GET)
	public String login(HttpServletRequest request, HttpServletResponse response){
		return "login";
	}
	
	@RequestMapping(value="/403",method = RequestMethod.GET)
	public String Page403(HttpServletRequest request, HttpServletResponse response){
		return "403";
	}
	
	@RequestMapping(value="/main",method = RequestMethod.GET)
	public String PageMain(HttpServletRequest request, HttpServletResponse response){
		return "main";
	}
}
