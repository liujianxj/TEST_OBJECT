/**
 * 缩放控制
 */
var scale = new function(){
	this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1
}


//缩放用立方体cube
var scalecubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var scalecubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
var scaleCube = new THREE.Mesh(scalecubeGeometry, scalecubeMaterial);
scaleCube.castShadow = true;//允许放出阴影
scaleCube.receiveShadow = true;
scaleCube.position.x = -10;
scaleCube.position.y = 2.4;
scaleCube.position.z = -10;
scene.add(scaleCube);

