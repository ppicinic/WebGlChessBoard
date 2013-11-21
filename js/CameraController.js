var CameraController = function (camera) { this.init(camera); }

CameraController.prototype.init = function(camera)
{
	this.camera = camera;
	this.z = 176;
	this.y = 100;
	this.x = 0;
	this.pos = WHITE;
	this.camera.position.x = this.x;
	this.camera.position.y = this.y;
	this.camera.position.z = this.z;
}