var sprite = THREE.ImageUtils.loadTexture("Models/textures/disc.png");

var LoadScene = function(duration) { this.init(duration); }

LoadScene.prototype.init = function(duration){
	this.duration = duration;

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	this.camera.position.z = 1000;

	this.geometry = new THREE.Geometry();

	//TODO - Particles effects
	for(var i = 0; i < 10000; i++){
		var vertex = new THREE.Vector3();
		vertex.x = 2000 * Math.random() - 1000;
		vertex.y = 2000 * Math.random() - 700;
		vertex.z = 2000 * Math.random() - 700;

		this.geometry.vertices.push( vertex );
	}

	this.material = new THREE.ParticleSystemMaterial( {size: 35, sizeAttenuation: false, map: sprite, transparent: true} );
	this.material.color.setRGB(0.0, 0.5, 0.7);
	this.particles = new THREE.ParticleSystem(this.geometry, this.material);
	this.particles.sortParticles = true;
	this.scene.add(this.particles);




}