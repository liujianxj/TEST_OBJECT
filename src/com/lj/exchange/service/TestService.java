package com.lj.exchange.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lj.exchange.dao.mapper.Tlp_cas_userinfoMapper;

@Service
public class TestService {
	@Autowired
	private Tlp_cas_userinfoMapper mapper;
	
	public String test(){
		return mapper.find();
	}
	
}
