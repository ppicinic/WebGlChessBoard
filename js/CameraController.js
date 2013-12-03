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
	this.point = 178;
	
}

CameraController.prototype.move = function(){
	this.pos = this.pos;
	this.ttl = 0;
	//this.movez = -this.movez;
	this.moving = true;
	this.point = camera.position.z;
}

CameraController.prototype.update = function(){
	var movescale = easeInOutSin(this.ttl, this.point, (316 * this.movez), CAMERA_TIME);
	var factor = 1;
	var yttl = this.ttl;
	var movey = 0;
	if(this.ttl > CAMERA_TIME / 2){
		factor = -1;
		yttl -= (CAMERA_TIME / 2);
		movey = easeInSin(yttl, 176, -176, (CAMERA_TIME/2));
	}else{
		movey = easeOutSin(this.ttl, 0, 176, (CAMERA_TIME/2));
	}
	camera.position.x = movey;

	var mid = (176 + -140) / 2;
	
	var start = this.camera.position.z;
	this.camera.position.z = movescale;
	var end = this.camera.position.z;
	var m = (start + end) / 2;
	var n = m - mid;
	
	var change = Math.pow(n, 2) / 4000;

	this.ttl++;
	if(this.ttl > CAMERA_TIME){
		this.moving = false;
		this.movez = -this.movez;
	}
	/*if(end == 176 || end == -140){
		this.moving = false;
		this.movez = -this.movez;
	}*/
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