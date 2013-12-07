/**
*	Bishop Class
* 	This class holds all bishop logic
*	The class also holds onto the bishop information
*   and the 3D model object
*/

var Bishop = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a bishop object
*	also loads the model associated with it
*	@param scene - the bishop needs to have a reference to the scene graph 
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
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	
	this.moving = false;
	this.dest = false;
	this.ttl = 0;
	this.duration = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	this.xfix = -2;
	this.zfix = 0;
	this.promote = false;

	// Low Poly - false || High Poly - true
	this.poly = false;
	// Marble - true || Wood - false
	this.texture = true;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	this.piece = cloneObjMtl(board.bishop);
	if(this.color){
		this.zfix = -2;
		this.piece.rotation.y = 90 * (Math.PI / 180);
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.whiteTexture;
				mesh.castShadow = true;
			}
		});
	} else {
		this.zfix = 2;
		this.piece.rotation.y = -90 * (Math.PI / 180);
		this.piece.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.material.map = board.blackTexture;
				mesh.castShadow = true;
			}
		});
	} 
	this.x = LEFT + (this.xLoc * 20) + this.xfix;
	this.y = TOP + (this.yLoc * 20) + this.zfix;
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20) + this.xfix;
	this.piece.position.z = TOP + (yPos * 20) + this.zfix;
	this.piece.position.y = 4.5;
	this.scene.add(this.piece);
	start++;	
}
Bishop.prototype.promoted = function(ttl){
	console.log('queen promotion');
	this.piece.traverse(function(mesh){
		if(mesh instanceof THREE.Mesh){
			mesh.material.transparent = true;
			mesh.material.opacity = 0;
		}
	});
	this.ttl = ttl + (FADE_TIME * 2);
	this.moving = true;
	this.promote = true;
}



// TODO a move method, should add the bishop to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Bishop.prototype.move = function(x, y){
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

Bishop.prototype.update = function(){
	if(this.dest){
		if(this.ttl <= TIME_TO_MOVE){
			//console.log('opacity drops')
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					if(!mesh.material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = 1;
					}
					mesh.material.opacity -= (1 / TIME_TO_MOVE);
				}
			});
		}
		this.ttl--;
		if(this.ttl == 0){
			this.moving = false;
		}

	}else if(this.promote){
		if(this.ttl <= FADE_TIME){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.opacity += (1 / FADE_TIME);
				}
			});
		}
		this.ttl--;
		if(this.ttl == 0){
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					mesh.material.transparent = false;
				}
			});
			this.moving = false;
			this.promote = false;
		}
	}else {
		var newYpos = easeInOutQuad(this.ttl, this.y, this.dy, this.duration);
		var newXpos = easeInOutQuad(this.ttl, this.x, this.dx, this.duration);
		this.piece.position.z = newYpos;
		this.piece.position.x = newXpos;
		this.ttl++;
		if(this.ttl > this.duration){
			this.moving = false;
			this.x = this.x2;
			this.y = this.y2;
		}
	}
}

Bishop.prototype.destroy = function(ttl){
	this.moving = true;
	this.ttl = ttl;
	this.dest = true;
}

Bishop.prototype.isMoving = function(){
	return this.moving;
}

Bishop.prototype.updatePiece = function(poly, texture){

	var board = this.board;
	var temp = this.piece;

	if(this.poly != poly){
		this.poly = poly;
		this.scene.remove(this.piece);
		this.piece = cloneObjMtl(this.board.bishop);
		this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
		this.piece.position.x = temp.position.x;
		this.piece.position.z = temp.position.z;
		this.piece.position.y = temp.position.y;
		this.piece.rotation.y = temp.rotation.y;
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