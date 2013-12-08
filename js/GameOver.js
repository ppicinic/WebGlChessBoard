var GameOver = function (text) { this.init(text); }

GameOver.prototype.init = function(text)
{
	this.theText = text;
	this.ttl = 0;
	this.duration = 50;
	this.duration2 = 500;
	this.duration3 = 550;
	this.moving = false;
	
}

GameOver.prototype.move = function(){
	this.ttl = 0;
	//this.movez = -this.movez;
	this.moving = true;
	this.textMaterial = new THREE.MeshFaceMaterial( [
					new THREE.MeshLambertMaterial( { color: 0xaaaaff, shading: THREE.FlatShading, opacity: 0.95 } ),
					new THREE.MeshLambertMaterial( { color: 0xaaaaff } )
				] );
	this.text3d = new THREE.TextGeometry( this.theText, {
		size: 20,
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
	this.text.position.y = 30;
	this.text.position.z = 0;
	this.text.rotation.x = 0;
	this.text.rotation.y = Math.PI * 2;

	scene.add(this.text);
	this.text.traverse(function(mesh){
		if(mesh instanceof THREE.Mesh){
			mesh.material.opacity = 0;
			mesh.material.transparent = true;
			//mesh.castShadow = true;
		}
	});
}

GameOver.prototype.update = function(){
	if (this.ttl < this.duration){
		this.text.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.opacity += (1/ 50);
			}
		});
		if(this.ttl >= this.duration - 1){
			this.text.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = true;
				}
			});
		}
	}else if(this.ttl < this.duration2){

	}else if(this.ttl < this.duration3){
		this.text.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.transparent = true;
				mesh.material.opacity -= (1 / 50);
			}
		});
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