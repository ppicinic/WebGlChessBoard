
var LoadScene = function(duration) { this.init(duration); }

LoadScene.prototype.init = function(duration){
	this.duration = duration;
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	this.camera.position.z = 176;
	this.camera.position.y = 100;

	//TODO - Particles effects
}