package com.lj.exchange.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.lj.exchange.VO.FileVo;
import com.lj.exchange.util.UUIDGenerator;

@Controller
public class FileUploadController{
	
	
	/**
	 * 上传文件到临时文件夹
	 * */
	@RequestMapping(value="/FileUploadTemp",method = RequestMethod.POST)
	@ResponseBody
	public void FileUploadTemp(@RequestParam MultipartFile[] fd,HttpServletRequest request, HttpServletResponse response, Integer imgWidth, Integer imgHeight, String mark) throws IllegalStateException, IOException{
		for(int i = 0;i<fd.length;i++){  
            MultipartFile Filedata = fd[i];  
            //实体类
    		FileVo vo = new FileVo();
    		//临时文件存放地址
    		String realPath = request.getSession().getServletContext().getRealPath("/WEB-INF/upload/");
            //获取扩展名
            String prefix = Filedata.getOriginalFilename().substring(Filedata.getOriginalFilename().lastIndexOf(".")+1);
            if("blob".equals(prefix)){
            	prefix = "wav";
            }
            //生成新名字
            String newfileName = UUIDGenerator.getUUID()+"."+prefix;
            String filePath = realPath +"/"+ newfileName;
            
            File file = new File(filePath);
            //如果文件夹不存在则创建
            if(!file.exists() && !file.isDirectory()){
                file.mkdirs();
            }
            
            Filedata.transferTo(file);
            
            
    		vo.setFileName(newfileName);
    		vo.setPrimitiveName(Filedata.getOriginalFilename());
    		vo.setPath("/upload/temp/"+newfileName);
    		vo.setExtension(prefix);
    		vo.setServicePath(filePath);
    		vo.setType("temp");
    		FileChannel fc= null;
    		FileInputStream fis= new FileInputStream(file);  
            fc= fis.getChannel();
    		vo.setSize(fc.size());
    		fc.close();
    		fis.close();  
        }
		
		
	}
	
	@RequestMapping(value="/FileUploadTemp2",method = RequestMethod.POST)
	@ResponseBody
	public void FileUploadTemp2(@RequestParam MultipartFile[] file,HttpServletRequest request, HttpServletResponse response) throws IllegalStateException, IOException{
           System.out.println(file);
		
	}
}
