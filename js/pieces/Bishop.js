/**
*	Bishop Class
* 	This class holds all Bishop logic
*	The class also holds onto the Bishop information
*   and the 3D model object
*/

var Bishop = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a Bishop object
*	also loads the model associated with it
*	@param scene - the Bishop needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the Bishop (white or black)
*	@param spot - the position the Bishop is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
Bishop.prototype.init = function(scene, color, spot, board)
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
	
	// This loadPiece function takes the Bishop object itself, or the loader function will
	// the reference to the Bishop object, it also takes the loader to load with, and a callback for when it completes
	function loadPiece(bishop, loader, callback) {
		// loads the model
		loader.load('Models/Bishop/bishop.obj', 'Models/Bishop/bishop.mtl', function ( object ) {
		// scales and positions the model;
		object.position.z = TOP + (xPos * 20);
		object.position.x = LEFT + (yPos * 20);
		object.position.y = 4.5;

    	object.scale.x = object.scale.y = object.scale.z = 5;

		// sets the model to the Bishop object and adds it to the scene
		bishop.piece = object;
		bishop.scene.add(bishop.piece);
		// calls the callback
		callback();
		});
		
	}
	
	// calls the loadPiece function, gives it this a reference to the Bishop object, 
	// the loader, and the callback function which calls back to the board
	loadPiece(this, this.loader, function() {
		// calls back to the board
		board.callbackFromPiece(spot[0], spot[1]);
	});
	
}



// TODO a move method, should add the Bishop to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Bishop.prototype.move = function(x, y){
	//alert(this.piece);
	//console.log(this.piece);
	this.piece.position.z = TOP + (x * 20);
	this.piece.position.x = LEFT + (y * 20);
	//console.log(this.piece);
}