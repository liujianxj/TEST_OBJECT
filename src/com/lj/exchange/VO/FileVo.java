package com.lj.exchange.VO;

import java.util.Date;

public class FileVo {

	private String fileName;//文件名称（uuid）
	private String allPath;//文件访问路径
	private String primitiveName;//文件原名
	private String path;//文件存放地址
	private String uploadDate;//文件上传时间
	private Long size;//文件大小
	private String extension;//文件扩展名
	private String type;//文件状态（temp,formal）
	private String servicePath;//服务器文件地址
	
	//如果是图片拥有宽高属性
	private int imgWidth;
	private int imgHeigth;
	private String smallImgAllPath;
	private int smallImgWidth;
	private int smallImgHeigth;
	private String smallImgPath;
	
	//聚牛用的文件地址
	private String fileUrl;
	
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getAllPath() {
		return allPath;
	}
	public void setAllPath(String allPath) {
		this.allPath = allPath;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getUploadDate() {
		return uploadDate;
	}
	public void setUploadDate(String uploadDate) {
		this.uploadDate = uploadDate;
	}
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getImgWidth() {
		return imgWidth;
	}
	public void setImgWidth(int imgWidth) {
		this.imgWidth = imgWidth;
	}
	public int getImgHeigth() {
		return imgHeigth;
	}
	public void setImgHeigth(int imgHeigth) {
		this.imgHeigth = imgHeigth;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
	public String getPrimitiveName() {
		return primitiveName;
	}
	public void setPrimitiveName(String primitiveName) {
		this.primitiveName = primitiveName;
	}
	public Long getSize() {
		return size;
	}
	public void setSize(Long size) {
		this.size = size;
	}
	public String getServicePath() {
		return servicePath;
	}
	public void setServicePath(String servicePath) {
		this.servicePath = servicePath;
	}
	public String getSmallImgPath() {
		return smallImgPath;
	}
	public void setSmallImgPath(String smallImgPath) {
		this.smallImgPath = smallImgPath;
	}
	public int getSmallImgWidth() {
		return smallImgWidth;
	}
	public void setSmallImgWidth(int smallImgWidth) {
		this.smallImgWidth = smallImgWidth;
	}
	public int getSmallImgHeigth() {
		return smallImgHeigth;
	}
	public void setSmallImgHeigth(int smallImgHeigth) {
		this.smallImgHeigth = smallImgHeigth;
	}
	public String getSmallImgAllPath() {
		return smallImgAllPath;
	}
	public void setSmallImgAllPath(String smallImgAllPath) {
		this.smallImgAllPath = smallImgAllPath;
	}
	
}
