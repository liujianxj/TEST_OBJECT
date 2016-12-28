/**
 * ambientLight环境光
 */

var ambiColor = "#0c0c0c";
var ambientLight = new THREE.AmbientLight(ambiColor);
scene.add(ambientLight);

var ambientLightGui = new function(){
	this.ambientColor = ambiColor;
    this.disableSpotlight = true;
}