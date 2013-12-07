var sprite = THREE.ImageUtils.loadTexture("Models/textures/disc.png");

var LoadScene = function(duration) { this.init(duration); }

LoadScene.prototype.init = function(duration){
	this.duration = duration;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x0a0a00, 0.001 );

	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	this.camera.position.z = 1000;

	this.geometry = new THREE.Geometry();

	

	//TODO - Particles effects
	for(var i = 0; i < 35000; i++){
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

	// Add Loading Sign
	this.theText = "Loading...";

	var hash = document.location.hash.substr( 1 );

				if ( hash.length !== 0 ) {

					this.theText = hash;

				}

	this.textMaterial = new THREE.MeshFaceMaterial( [
					new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, opacity: 0.95 } ),
					new THREE.MeshLambertMaterial( { color: 0xffffff } )
				] );
	var text = this.theText;
	this.text3d = new THREE.TextGeometry( text, {font: "hevletiker"});

	//this.text3d.computerVertexNormals();
	//this.text3d.computeBoundingBox();

	//this.centerOffset - -.5 * ( this.text3d.boundingBox.max.x - this.text3d.boundingBox.min.x);

	//this.text = new THREE.Mesh(this.text3d, this.textMaterial);
	//this.text.position.x = centerOffset;
	//this.text.position.y = 130;
	//this.text.position.z = 0;
	//this.text.rotation.x = 0;
	//this.text.rotation.y = Math.PI * 2;

	//this.scene.add(this.text);




}