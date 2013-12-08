var OverMove = function () { this.init(); }

OverMove.prototype.init = function()
{
	this.piece = false;
	this.camera = false;
}

OverMove.prototype.isPiece = function()
{
	return this.piece;
}