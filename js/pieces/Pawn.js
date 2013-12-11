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
	// Holds board and scene references
	this.board = board;
	this.scene = scene;
	
	// Sets Color
	this.color = color;

	//Sets all required position info
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	this.x = LEFT + (this.xLoc * 20);
	this.y = TOP + (this.yLoc * 20);
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	// Animation info
	this.moving = false;
	this.fadettl = TIME_TO_MOVE;
	this.dest = false;
	this.ttl = 0;
	this.duration = 0;
	this.spaces = 1;

	//Promotion Info
	this.promote = false;
	this.promoting = false;

	// Dead position - needed for moving off table
	this.deadx = 0;
	this.deady = 0;
	this.deadz = 0;
	this.dead = false;

	// Low Poly - false || High Poly - true
	this.poly = board.highpoly;
	// Marble - true || Wood - false
	this.texture = board.texture;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	
	//Particles
	this.clock = new THREE.Clock();
	this.particles = false;
	this.firedSmoke = false;
	this.smoke =
	{
		positionStyle  : Type.SPHERE,
		positionBase   : new THREE.Vector3( 0, 50, 0 ),
		positionRadius : 2,
				
		velocityStyle : Type.SPHERE,
		speedBase     : 40,
		speedSpread   : 8,
		
		particleTexture : THREE.ImageUtils.loadTexture( 'Models/textures/smokeparticle.png' ),

		sizeTween    : new Tween( [0, 0.1], [1, 150] ),
		opacityTween : new Tween( [0.7, 1], [1, 0] ),
		colorBase    : new THREE.Vector3(0.02, 1, 0.4),
		blendStyle   : THREE.AdditiveBlending,  
		
		particlesPerSecond : 60,
		particleDeathAge   : 0.1,		
		emitterDeathAge    : 0.1
	};
	
	// Clone piece from the reference piece in board
	this.piece = cloneObjMtl(board.pawn);
	//Set it's texture and tell it to cast a shadow
	if(this.color){
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.whiteTexture;
				mesh.castShadow = true;
			}
		});
	} else {
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.blackTexture;
				mesh.castShadow = true;
			}
		});
	} 
	// Scale and Place the piece in its position
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20);
	this.piece.position.z = TOP + (yPos * 20);
	this.piece.position.y = 4.5;
	// Add the piece to scene
	this.scene.add(this.piece);
	//Tell the loader the piece has finished loading
	start++;
}



/**
*	Move method sets a piece up to be moved
* 	Move locations are in regards to board spots 1 through 8
*	not WebGL locations
*	@param x the board x location the piece is moved to
* 	@param y the board y location the piece is moved to
*/
Pawn.prototype.move = function(x, y){
	// Counts the number of spaces to move
	if(this.xLoc != x){
		this.spaces = Math.abs(this.xLoc - x);
	}else{
		this.spaces = Math.abs(this.yLoc - y);
	}
	// Recalculates position info for after move
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20);
	this.y2 = TOP + (y * 20);

	//Sets up moving boolean for animation
	this.moving = true;
	// Sets up time to live for animation
	this.ttl = 0;
	// Sets the duration of animation
	this.duration = SPEED_TIME * this.spaces;
	// Calculates the distance traveled in webgl points
	this.dx = (this.x2 - this.x)
	this.dy = (this.y2 - this.y);
	
}

/**
*	Update method is called if the piece is currently moving
* 	This method handles animating the piece
*/
Pawn.prototype.update = function(){
	//Handles animation if promoting pawn to another piece
	if(this.promoting){
		//fades out pawn
		this.piece.traverse(function(mesh) {
			if(mesh instanceof THREE.Mesh){
				if(!mesh.material.transparent){
					mesh.material.transparent = true;
					mesh.material.opacity = 1;
				}
				mesh.material.opacity -= (1 / FADE_TIME);
			}
		});
		// Moves to next frame
		this.ttl--;
		//Ends animation
		if(this.ttl == 0){
			this.moving = false;
			this.promoting = false;
		}
	// Handles Fading out piece on capture
	}else if(this.dest){
		// Fades out pieces once the capturing piece gets close
		if(this.ttl <= (this.duration / this.spaces) ){
			//console.log('opacity drops')
			var self = this;
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = true;
					mesh.material.opacity -= (1 / (self.duration / self.spaces));
				}
			});
		}
		// Moves to Next frame
		this.ttl--;
		// Ends fade out
		if(this.ttl == 0){
			// Ends Fading out and set ups fade in on the table
			this.dest = false;
			this.dead = true;
			this.ttl = 0;
			// Resets opacity to 0 just in case, Float math can be inaccurate
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.opacity = 0;
				}
			});
			//Sets up duration for Fade back in
			this.duration = (this.duration / this.spaces);
			//Sets location on table
			this.piece.position.x = this.deadx;
			this.piece.position.y = this.deady;
			this.piece.position.z = this.deadz;
		}
	// Handles fading back in on the table
	}else if(this.dead){
		// Particle effect when the piece is placed on the table
		if(!this.firedSmoke)
		{
			this.board.engine.push(new ParticleEngine(this.scene));
			this.smoke.positionBase = new THREE.Vector3(this.piece.position.x,this.piece.position.y,this.piece.position.z);
			this.board.engine[this.board.engine.length-1].setValues( this.smoke );
			this.board.engine[this.board.engine.length-1].initialize();
			this.firedSmoke = true;
			this.particles = true;
		}
		//
		var self = this;
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.opacity += (1 / self.duration);
				
			}
		});
		this.ttl++;
		if(this.ttl == this.duration){
			this.moving = false;
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.opacity = 1;
					mesh.material.transparent = false;
				}
			});
		}

	}else {
		var newYpos = easeInOutSin(this.ttl, this.y, this.dy, this.duration);
		var newXpos = easeInOutSin(this.ttl, this.x, this.dx, this.duration);
		if(this.ttl >= (this.duration / 2)){
			var newTTL = this.ttl - (this.duration / 2);
			this.piece.position.y = easeInOutSin(newTTL, 6, -1.5, (this.duration / 2));
		}else{
			this.piece.position.y = easeInOutSin(this.ttl, 4.5, 1.5, (this.duration / 2));
		}
		this.piece.position.z = newYpos;
		this.piece.position.x = newXpos;
		this.ttl++;
		if(this.ttl > this.duration){
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
		// old method
		/*this.piece.position.z += this.dy;
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
			
		}*/
	}
}


Pawn.prototype.destroy = function(ttl, spaces){
	this.moving = true;
	this.duration = ttl;
	this.ttl = ttl;
	this.spaces = spaces;
	this.dest = true;
}

Pawn.prototype.isMoving = function(){
	return this.moving;
}

Pawn.prototype.promoted = function(){
	this.promote = true;
}

Pawn.prototype.updatePiece = function(poly, texture){

	var board = this.board;
	var temp = this.piece;

	if(this.poly != poly){
		this.poly = poly;
		this.scene.remove(this.piece);
		this.piece = cloneObjMtl(this.board.pawn);
		this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
		this.piece.position.x = temp.position.x;
		this.piece.position.z = temp.position.z;
		this.piece.position.y = temp.position.y;
		this.texture = texture;
		if(this.color){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.whiteTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} 
		this.scene.add(this.piece);

	}

	if(this.texture != texture){
		this.texture = texture;
		if(this.color){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.whiteTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} else {
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.map = board.blackTexture;
					if(temp.children[0].children[0].material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = temp.children[0].children[0].material.opacity;
					}
					mesh.castShadow = true;
				}
			});
		} 
	}

	start++;

}

Pawn.prototype.outPos = function(pos){
	var spot = pos;
	if(pos > 11){
		spot -= 11;
	}
	if(this.color){
		this.deadx = -85;
		if(pos > 11){
			this.deadx -= 15;
		}
		this.deadz = TOP + ((spot - 1) * 15) - 5; 
	}else{
		this.deadx = 90;
		if(pos > 11){
			this.deadx += 15;
		}
		this.deadz = 80 - ((spot - 1) * 15) + 5;
		
	}
	
	
	
	this.deady = 2.2;

}