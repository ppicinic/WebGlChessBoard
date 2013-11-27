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
	// ease out function found online
	//t is time in frames (our ttl)
	// b is start value either 178 or -142
	// c is change in value always going to be 178 + 142 (negative from white to black, positive from black to white)
	// d camera time constant
	function easeInOut(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	};

	function easeIn(t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	};

	function easeOut(t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	};
	var movescale = easeInOut(this.ttl, this.point, (316 * this.movez), CAMERA_TIME);
	var factor = 1;
	var yttl = this.ttl;
	var movey = 0;
	if(this.ttl > CAMERA_TIME / 2){
		factor = -1;
		yttl -= (CAMERA_TIME / 2);
		movey = easeIn(yttl, 176, -176, (CAMERA_TIME/2));
	}else{
		movey = easeOut(this.ttl, 0, 176, (CAMERA_TIME/2));
	}
	camera.position.x = movey;

	console.log(movescale);
	var mid = (176 + -140) / 2;
	//console.log("mid " + mid)
	var start = this.camera.position.z;
	this.camera.position.z = movescale;
	var end = this.camera.position.z;
	var m = (start + end) / 2;
	var n = m - mid;
	//console.log("m " + m);
	var change = Math.pow(n, 2) / 4000;
	if(m > mid){
		//this.camera.position.x += change;
	}else{
		//this.camera.position.x -= change;
	}
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