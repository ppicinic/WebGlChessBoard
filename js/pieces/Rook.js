/**
*	Rook Class
* 	This class holds all Rook logic
*	The class also holds onto the Rook information
*   and the 3D model object
*/

var Rook = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a Rook object
*	also loads the model associated with it
*	@param scene - the Rook needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the Rook (white or black)
*	@param spot - the position the Rook is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
Rook.prototype.init = function(scene, color, spot, board)
{
	// initializes all class instances
	this.board = board;
	this.scene = scene;
	this.color = color;
	this.spot = spot;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.spot[0];
	var yPos = this.spot[1];
	
	// This loadPiece function takes the Rook object itself, or the loader function will
	// the reference to the Rook object, it also takes the loader to load with, and a callback for when it completes
	function loadPiece(rook, loader, callback) {
		// loads the model
		loader.load('Models/Rook/rook.obj', 'Models/Rook/rook.mtl', function ( object ) {
		// scales and positions the model;
		object.position.z = TOP + (xPos * 20);
		object.position.x = LEFT + (yPos * 20);
		object.position.y = 4.5;

    	object.scale.x = object.scale.y = object.scale.z = 5;

		// sets the model to the Rook object and adds it to the scene
		rook.piece = object;
		rook.scene.add(rook.piece);
		// calls the callback
		callback();
		});
		
	}
	
	// calls the loadPiece function, gives it this a reference to the Rook object, 
	// the loader, and the callback function which calls back to the board
	loadPiece(this, this.loader, function() {
		// calls back to the board
		board.callbackFromPiece(spot[0], spot[1]);
	});
	
}



// TODO a move method, should add the Rook to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Rook.prototype.move = function(x, y){
	//alert(this.piece);
	//console.log(this.piece);
	this.piece.position.z = TOP + (x * 20);
	this.piece.position.x = LEFT + (y * 20);
	//console.log(this.piece);
}