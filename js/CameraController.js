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
	this.camera.position.z += this.movez * ((176 - -140) / CAMERA_TIME);
	this.camera.position.x += this.movex * (158 / (CAMERA_TIME / 2));
	this.ttl--;
	if(this.ttl == (CAMERA_TIME / 2) || this.ttl == 0){
		this.movex = -this.movex;
	}
	if(this.ttl == 0){
		this.moving = false;
		this.movez = -this.movez;
	}
}

CameraController.prototype.isMoving = function(){
	return this.moving;
}