/**
* 	Over Move object tells that a Game Over Scene should be played
*/
var OverMove = function () { this.init(); }

/**
*	Constructor initializes object fields
*/
OverMove.prototype.init = function()
{
	this.piece = false;
	this.camera = false;
}

/**
*	Tells if the object is a piece
*	@return false, this object is not a piece
*/
OverMove.prototype.isPiece = function()
{
	return this.piece;
}