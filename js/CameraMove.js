/**
*	Camera Move Class
*	An object that tells the board to initiate A Camera move
*/
var CameraMove = function () { this.init(); }

/**
*	Constructor, creates the object fields
*/
CameraMove.prototype.init = function()
{
	this.piece = false;
	this.camera = true;
}

/**
*	Tells if the object is a piece
*	@return false, the camera is not a piece
*/
CameraMove.prototype.isPiece = function()
{
	return this.piece;
}