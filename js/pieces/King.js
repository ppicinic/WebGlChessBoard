/**
*	King Class
* 	This class holds all king logic
*	The class also holds onto the king information
*   and the 3D model object
*/

var King = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a king object
*	also loads the model associated with it
*	@param scene - the king needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the King (white or black)
*	@param spot - the position the King is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
King.prototype.init = function(scene, color, spot, board)
{
	// initializes all class instances
	this.board = board;
	this.scene = scene;
	this.color = color;
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	// piece fix info
	this.xfix = -2;
	this.zfix = -2;
	this.x = LEFT + (this.xLoc * 20) + this.xfix;
	this.y = TOP + (this.yLoc * 20) + this.zfix;
	this.moving = false;
	this.ttl = 0;
	this.duration = 0;
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
	this.piece = cloneObjMtl(board.king);
	if(this.color){
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.castShadow = true;
				
				mesh.material.map = board.whiteTexture;
			}
		});
	} else {
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.castShadow = true;
				
				mesh.material.map = board.blackTexture;
			}
		});
	} 
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20) + this.xfix;
	this.piece.position.z = TOP + (yPos * 20) + this.zfix;
	this.piece.position.y = 4.5;
	this.piece.rotation.y = 90 * (Math.PI / 180);
	this.scene.add(this.piece);
	start++;
}



// TODO a move method, should add the king to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
King.prototype.move = function(x, y){
	var spaces = 1;
	if(this.xLoc != x){
		spaces = Math.abs(this.xLoc - x);
	}else{
		spaces = Math.abs(this.yLoc - y);
	}
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20) + this.xfix;
	this.y2 = TOP + (y * 20) + this.zfix;
	console.log(spaces);
	
	this.moving = true;
	this.ttl = 0;
	this.duration = TIME_TO_MOVE * spaces;
	this.dx = (this.x2 - this.x);
	this.dy = (this.y2 - this.y);
	
}

King.prototype.update = function(){
	var newYpos = easeInOutSin(this.ttl, this.y, this.dy, this.duration);
	var newXpos = easeInOutSin(this.ttl, this.x, this.dx, this.duration);
	this.piece.position.z = newYpos;
	this.piece.position.x = newXpos;
	this.ttl++;
	if(this.ttl > this.duration){
		this.moving = false;
		this.x = this.x2;
		this.y = this.y2;
	}
}

King.prototype.isMoving = function(){
	return this.moving;
}