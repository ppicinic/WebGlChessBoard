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
	
}

CameraController.prototype.move = function(){
	this.pos = this.pos;
	//this.movez = -this.movez;
	this.moving = true;
}

CameraController.prototype.update = function(){
	this.camera.position.z += this.movez;
	this.camera.position.x += this.movex;
	if(this.camera.position.x == 0 || this.camera.position.x == 158){
		this.movex = -this.movex;
	}
	if(this.camera.position.z == 176 || this.camera.position.z == -140){
		this.moving = false;
		this.movez = -this.movez;
	}
}

CameraController.prototype.isMoving = function(){
	return this.moving;
}