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
	this.x = LEFT + (this.xLoc * 20)
	this.y = TOP + (this.yLoc * 20)
	this.moving = false;
	this.fadettl = TIME_TO_MOVE;
	this.dest = false;
	this.ttl = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	this.promote = false;
	this.promoting = false;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	
	this.piece = cloneObjMtl(board.pawn);
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20);
	this.piece.position.z = TOP + (yPos * 20);
	this.piece.position.y = 4.5;
	this.scene.add(this.piece);
	start++;
}



// TODO a move method, should add the pawn to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Pawn.prototype.move = function(x, y){
	var spaces = 1;
	if(this.xLoc != x){
		spaces = Math.abs(this.xLoc - x);
	}else{
		spaces = Math.abs(this.yLoc - y);
	}
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20);
	this.y2 = TOP + (y * 20);
	console.log(spaces);
	
	this.moving = true;
	this.ttl = TIME_TO_MOVE * spaces;
	this.dx = (this.x2 - this.x) / this.ttl;
	this.dy = (this.y2 - this.y) / this.ttl;
	
}

Pawn.prototype.update = function(){
	if(this.promoting){
		this.piece.traverse(function(mesh) {
			if(mesh instanceof THREE.Mesh){
				mesh.material.transparent = true;
				mesh.material.opacity -= (1 / FADE_TIME);
			}
		});
		this.ttl--;
		if(this.ttl == 0){
			this.moving = false;
			this.promoting = false;
		}
	}else if(this.dest){
		if(this.ttl <= TIME_TO_MOVE){
			//console.log('opacity drops')
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = true;
					mesh.material.opacity -= (1 / TIME_TO_MOVE);
				}
			});
		}
		this.ttl--;
		if(this.ttl == 0){
			this.moving = false;
		}

	}else {
		this.piece.position.z += this.dy;
		this.piece.position.x += this.dx;
		this.ttl--;
		if(this.ttl == 0){
			this.moving = false;
			this.x = this.x2;
			this.y = this.y2;
			if(this.promote){
				this.moving = true;
				this.ttl = FADE_TIME;
				this.promoting = true;
				this.promote = false;
			}
			
		}
	}
}

Pawn.prototype.destroy = function(ttl){
	this.moving = true;
	this.ttl = ttl;
	this.dest = true;
}

Pawn.prototype.isMoving = function(){
	return this.moving;
}

Pawn.prototype.promoted = function(){
	this.promote = true;
}