package com.lj.exchange.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class FF {
	public static void main(String[] args) {   
	    String path = "C://Users/dell/Desktop/ffmpeg-20161021-0cfd6cc-win64-static/ff-prompt-lj.bat ffmpeg -i lj.mp4 -f mp3 liujian.mp3";   
	    Runtime run = Runtime.getRuntime();   
	    try {     
	        Process process = run.exec("cmd.exe /k start " + path);   

	        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));  
	        
            String line = null;  
  
            while ((line = input.readLine()) != null) {  
                System.out.println(line);  
            } 
	    } catch (Exception e) {            
	        e.printStackTrace();   
	    }   
	}  
}
