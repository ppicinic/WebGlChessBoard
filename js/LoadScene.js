var sprite = THREE.ImageUtils.loadTexture("Models/textures/load.png");

var LoadScene = function(duration) { this.init(duration); }

LoadScene.prototype.init = function(duration){
	this.duration = duration;

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x0a0a00, 0.00065);

	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
	this.camera.position.set(0, 0, 1000);

	this.geometry = new THREE.Geometry();

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, -1, 1 );
	directionalLight.position.normalize();
	this.scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xaaaaaa, 2, 300 );
	pointLight.position.set( 0, 0, 0 );
	this.scene.add( pointLight );
	
	for(var i = 0; i < 35000; i++){
		var vertex = new THREE.Vector3();
		vertex.x = 3000 * Math.random() - 1500;
		vertex.y = 2000 * Math.random() - 1000;
		vertex.z = 3000 * Math.random() - 3100;

		this.geometry.vertices.push( vertex );
	}

	this.material = new THREE.ParticleSystemMaterial( {size: 35, sizeAttenuation: false, map: sprite, transparent: true} );
	this.color = [0.0, 0.5, 0.7];
	this.material.color.setRGB(0.0, 0.5, 0.7);
	this.particles = new THREE.ParticleSystem(this.geometry, this.material);
	this.particles.sortParticles = true;
	this.scene.add(this.particles);

	// Add Loading Sign
	this.theText = "Loading...";

	this.textMaterial = new THREE.MeshFaceMaterial( [
					new THREE.MeshLambertMaterial( { color: 0xaaaaff, shading: THREE.FlatShading, opacity: 0.95 } ),
					new THREE.MeshLambertMaterial( { color: 0xaaaaff } )
				] );
	this.text3d = new THREE.TextGeometry( this.theText, {
		size: 70,
		height: 25,
		curveSegments: 4,
		font: "helvetiker",

		bevelEnabled: true,
		bevelThickness: 2,
		bevelSize: 2,

		material: 0,
		extrudeMaterial: 1});

	this.text3d.computeVertexNormals();
	this.text3d.computeBoundingBox();

	this.centerOffset = -.5 * ( this.text3d.boundingBox.max.x - this.text3d.boundingBox.min.x);

	this.text = new THREE.Mesh(this.text3d, this.textMaterial);
	this.text.position.x = this.centerOffset;
	this.text.position.y = 0;
	this.text.position.z = -50;
	this.text.rotation.x = 0;
	this.text.rotation.y = Math.PI * 2;

	this.scene.add(this.text);
}

LoadScene.prototype.update = function(){
	var load = Math.floor(((start / this.duration) * 100));
	whiteClock.innerHTML = "Loading: " + load + "%";
}