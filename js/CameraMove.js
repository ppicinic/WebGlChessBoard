var CameraMove = function () { this.init(); }

CameraMove.prototype.init = function()
{
	this.piece = false;
	this.camera = true;
}

CameraMove.prototype.isPiece = function()
{
	return this.piece;
}