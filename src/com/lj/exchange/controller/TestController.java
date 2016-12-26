package com.lj.exchange.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lj.exchange.service.TestService;



@Controller
public class TestController{
	private Map map = new HashMap();
	@Autowired
	private TestService service;
	
	/**
	 * 进入绑定页面
	 * */
	@RequestMapping(value="/binding",method = RequestMethod.GET)
	public String band(HttpServletRequest request, HttpServletResponse response){
		return "binding";
	}
	
	/**
	 * 扫码控制器
	 * 判断用户是否已绑定二维码
	 * */
	@RequestMapping(value="/checkCode",method = RequestMethod.GET)
//	@ResponseBody
	public String checkCode (HttpServletRequest request, HttpServletResponse response, @RequestParam String code){
		if(!map.isEmpty()){
			if(!map.containsKey(code)){
//				map.put(code, phoneNumber);
				return "redirect:/binding";
			}
		}else{
//			map.put(code, phoneNumber);
			return "redirect:/binding";
		}
//		System.out.println("存入后="+map);
		return "redirect:/tel?code="+code;
	}
	
	/**
	 * 绑定
	 * */
	@RequestMapping(value="/bindingCode",method = RequestMethod.POST)
	@ResponseBody
	public Map bindingCode (HttpServletRequest request, HttpServletResponse response, @RequestParam String code, @RequestParam String phoneNumber){
		map.put(code, phoneNumber);
		Map m=new HashMap();
		m.put("msg", "1");
		return m;
	}
	
	/**
	 * 拨号
	 * */
	@RequestMapping(value="/tel",method = RequestMethod.GET)
	public String tel (HttpServletRequest request, HttpServletResponse response, @RequestParam String code){
		System.out.println(map.get(code));
		request.setAttribute("tel", map.get(code));
		return "tel";
	}
	
	/**
	 * 查询测试
	 */
	@RequestMapping(value="/testFind",method = RequestMethod.GET)
	public void testFind(){
		String s = service.test();
		System.out.println(s);
	}
	
	/**
	 * 上传文件测试
	 */
	@RequestMapping(value="/fileupload",method = RequestMethod.GET)
	public String fileupload(){
		return "jqfileupload";
	}
	
	/**
	 * 音频编辑测试
	 */
	@RequestMapping(value="/audioTest",method = RequestMethod.GET)
	public String audioTest(){
		return "audioTest3";
	}
	
}
