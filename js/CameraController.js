var CameraController = function (camera) { this.init(camera); }

CameraController.prototype.init = function(camera)
{
	this.camera = camera;
	this.pos = WHITE;
	this.camera.position.x = 0;
	this.camera.position.y = 100;
	this.camera.position.z = 176;
	this.movex = 1;
	this.movez = -1;
	this.moving = false;
	this.ttl = 0;
	
}

CameraController.prototype.move = function(){
	this.pos = this.pos;
	this.ttl = CAMERA_TIME;
	//this.movez = -this.movez;
	this.moving = true;
}

CameraController.prototype.update = function(){
	var mid = (176 + -140) / 2;
	console.log("mid " + mid)
	var start = this.camera.position.z;
	this.camera.position.z += this.movez;
	var end = this.camera.position.z;
	var m = (start + end) / 2;
	var n = m - mid;
	console.log("m " + m);
	var change = Math.pow(n, 2) / 10000;
	if(m > mid){
		this.camera.position.x += change;
	}else{
		this.camera.position.x -= change;
	}

	if(end == 176 || end == -140){
		this.moving = false;
		this.movez = -this.movez;
	}
	/*this.camera.position.z += this.movez * ((176 - -140) / CAMERA_TIME);
	this.camera.position.x += this.movex * (158 / (CAMERA_TIME / 2));
	this.ttl--;
	if(this.ttl == (CAMERA_TIME / 2) || this.ttl == 0){
		this.movex = -this.movex;
	}
	if(this.ttl == 0){
		this.moving = false;
		this.movez = -this.movez;
	}*/
}

CameraController.prototype.isMoving = function(){
	return this.moving;
}