var CameraMove = function () { this.init(); }

CameraMove.prototype.init = function()
{
	this.piece = false;
}

CameraMove.prototype.isPiece = function()
{
	return this.piece;
}