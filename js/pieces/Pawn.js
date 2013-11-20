/**
*	Pawn Class
* 	This class holds all pawn logic
*	The class also holds onto the pawn information
*   and the 3D model object
*/

var Pawn = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a pawn object
*	also loads the model associated with it
*	@param scene - the pawn needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the Pawn (white or black)
*	@param spot - the position the Pawn is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
Pawn.prototype.init = function(scene, color, spot, board)
{
	// initializes all class instances
	this.board = board;
	this.scene = scene;
	this.color = color;
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	this.x = TOP + (this.xLoc * 20)
	this.y = LEFT + (this.yLoc * 20)
	this.moving = false;
	this.ttl = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	
	// This loadPiece function takes the Pawn object itself, or the loader function will
	// the reference to the Pawn object, it also takes the loader to load with, and a callback for when it completes
	function loadPiece(pawn, loader, callback) {
		// loads the model
		loader.load('Models/Pawn/Pawn.obj', 'Models/Pawn/pawn.mtl', function ( object ) {
		// scales and positions the model;
		object.position.z = TOP + (xPos * 20);
		object.position.x = LEFT + (yPos * 20);
		object.position.y = 4.5;

    	object.scale.x = object.scale.y = object.scale.z = 5;

		// sets the model to the pawn object and adds it to the scene
		pawn.piece = object;
		pawn.scene.add(pawn.piece);
		// calls the callback
		callback();
		});
		
	}
	
	// calls the loadPiece function, gives it this a reference to the pawn object, 
	// the loader, and the callback function which calls back to the board
	loadPiece(this, this.loader, function() {
		// calls back to the board
		board.callbackFromPiece(spot[0], spot[1]);
	});
	
}



// TODO a move method, should add the pawn to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Pawn.prototype.move = function(x, y){
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = TOP + (x * 20);
	this.y2 = LEFT + (y * 20);
	this.moving = true;
	this.ttl = TIME_TO_MOVE;
	this.dx = (this.x2 - this.x) / this.ttl;
	this.dy = (this.y2 - this.y) / this.ttl;
	
}

Pawn.prototype.update = function(){
	this.piece.position.z += this.dx;
	this.piece.position.x += this.dy;
	this.ttl--;
	if(this.ttl == 0){
		this.moving = false;
		this.x = this.x2;
		this.y = this.y2;
		
	}
}

Pawn.prototype.isMoving = function(){
	return this.moving;
}