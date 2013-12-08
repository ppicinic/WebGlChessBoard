var GameOver = function (text) { this.init(text); }
var firework =
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 20, 0 ),
		positionRadius : 10,
		
		velocityStyle  : Type.SPHERE,
		speedBase      : 90,
		speedSpread    : 10,
		
		accelerationBase : new THREE.Vector3( 0, -80, 0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'Models/textures/spark.png' ),
		
		sizeTween    : new Tween( [0.5, 0.7, 1.3], [5, 40, 1] ),
		opacityTween : new Tween( [0.2, 0.7, 2.5], [0.75, 1, 0] ),
		colorTween   : new Tween( [0.4, 0.8, 1.0], [ new THREE.Vector3(0,1,1), new THREE.Vector3(0,1,0.6), new THREE.Vector3(0.8, 1, 0.6) ] ),
		blendStyle   : THREE.AdditiveBlending,  
		
		particlesPerSecond : 3000,
		particleDeathAge   : 2.5,		
		emitterDeathAge    : 0.2
	};

GameOver.prototype.init = function(text)
{
	this.theText = text;
	this.ttl = 0;
	this.duration = 50;
	this.duration2 = 500;
	this.duration3 = 550;
	this.fireworkduration = 0;
	this.moving = false;
	this.clock = new THREE.Clock();
	this.engine = new Array();
	this.particles = false;
	
}

GameOver.prototype.move = function(){
	this.ttl = 0;
	//this.movez = -this.movez;
	this.moving = true;
	this.textMaterial = new THREE.MeshFaceMaterial( [
					new THREE.MeshLambertMaterial( { color: 0xaaccff, shading: THREE.FlatShading, opacity: 0.95 } ),
					new THREE.MeshLambertMaterial( { color: 0xaaaaaa } )
				] );
	this.text3d = new THREE.TextGeometry( this.theText, {
		size: 20,
		height: 25,
		curveSegments: 4,
		font: "helvetiker",

		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 1,

		material: 0,
		extrudeMaterial: 1});

	this.text3d.computeVertexNormals();
	this.text3d.computeBoundingBox();

	this.centerOffset = -.5 * ( this.text3d.boundingBox.max.x - this.text3d.boundingBox.min.x);

	this.text = new THREE.Mesh(this.text3d, this.textMaterial);
	this.text.position.x = this.centerOffset;
	this.text.position.y = -30;
	this.text.position.z = 0;
	this.text.rotation.x = 0;
	if(this.theText == "White Wins!"){
		this.text.rotation.y = Math.PI * 2;
	}else{
		this.text.rotation.y = Math.PI;
		this.text.position.x = -this.centerOffset;
	}
	this.engine.push(new ParticleEngine(scene));
	
	this.engine[0].setValues( firework );
	this.engine[0].initialize();
	
	this.particles = true;
	scene.add(this.text);
}

GameOver.prototype.update = function(){

	var dt = this.clock.getDelta();
	if(this.particles)
	{
		for(var i = 0; i < this.engine.length; i++)
		{
			this.engine[i].update( dt * 0.5 );	
		}
		this.fireworkduration += dt * 0.5;
		if(this.fireworkduration > 1 &&  (this.fireworkduration <= 1 + (dt * 0.5) ))
		{
			this.engine.push(new ParticleEngine(scene));
			this.engine[this.engine.length-1].setValues( firework );
			this.engine[this.engine.length-1].initialize();
		}
		if(this.fireworkduration > 2 &&  (this.fireworkduration <= 2 + (dt * 0.5) ))
		{
			this.engine.push(new ParticleEngine(scene));
			this.engine[this.engine.length-1].setValues( firework );
			this.engine[this.engine.length-1].initialize();
		}
		if(this.fireworkduration > 3 &&  (this.fireworkduration <= 3 + (dt * 0.5) ))
		{
			this.engine.push(new ParticleEngine(scene));
			this.engine[this.engine.length-1].setValues( firework );
			this.engine[this.engine.length-1].initialize();
		}
	}
	if (this.ttl < this.duration){
		this.text.position.y = easeInOutSin(this.ttl, -30, 60, this.duration);
	}else if(this.ttl < this.duration2){

	}else if(this.ttl < this.duration3){
		this.text.position.y = easeInOutSin(this.ttl - this.duration2, 30, -60, this.duration3 - this.duration2);
	}
	this.ttl++;
	if(this.ttl >= this.duration3){
		this.moving = false;
		scene.remove(this.text);
	}
	
}

GameOver.prototype.isMoving = function(){
	return this.moving;
}