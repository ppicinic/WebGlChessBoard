var CameraController = function (camera) { this.init(camera); }

CameraController.prototype.init = function(camera)
{
	this.camera = camera;
	this.pos = WHITE;
	this.camera.position.x = 0;
	this.camera.position.y = 100;
	this.camera.position.z = 176;
	this.duration = CAMERA_TIME;
	this.movex = 1;
	this.movez = -1;
	this.moving = false;
	this.ttl = 0;
	this.point = 176;
	this.sweepOff = true;
	
}

CameraController.prototype.move = function(){
	this.pos = this.pos;
	this.ttl = 0;
	//this.movez = -this.movez;
	this.duration = CAMERA_TIME;
	this.moving = true;
	if(userCameraControl){
		this.sweepOff = true;
	}else{
		this.sweepOff = false;
	}
}

CameraController.prototype.update = function(){
	if(this.sweepOff){
		this.ttl++;
		if(this.ttl >= 10){
			this.moving = false;
			this.point += (316 * this.movez);
			this.movez = -this.movez;
		}
	}else{
		var movescale = easeInOutSin(this.ttl, this.point, (316 * this.movez), this.duration);
		var factor = 1;
		var yttl = this.ttl;
		var movey = 0;
		if(this.ttl > this.duration / 2){
			factor = -1;
			yttl -= (this.duration / 2);
			movey = easeInSin(yttl, 176, -176, (this.duration/2));
		}else{
			movey = easeOutSin(this.ttl, 0, 176, (this.duration/2));
		}
		if(!userCameraControl){
			this.camera.position.x = movey;
			this.camera.position.z = movescale;
		}

		this.ttl++;
		if(this.ttl > this.duration){
			this.moving = false;
			this.point += (316 * this.movez);
			this.movez = -this.movez;
		}
	}
}

CameraController.prototype.isMoving = function(){
	return this.moving;
}