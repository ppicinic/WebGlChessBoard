/**
*	Queen Class
* 	This class holds all queen logic
*	The class also holds onto the queen information
*   and the 3D model object
*/

var Queen = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

/**
*	Constructor - creates a queen object
*	also loads the model associated with it
*	@param scene - the queen needs to have a reference to the scene graph 
*		so it can add the model into the scene
*	@param color color of the Queen (white or black)
*	@param spot - the position the Queen is in
*	@param board - a reference to the board that holds it, so the piece can
*	callback to the board to chain properly
*/
Queen.prototype.init = function(scene, color, spot, board)
{
	// initializes all class instances
	this.board = board;
	this.scene = scene;
	this.color = color;
	this.xLoc = spot[0];
	this.yLoc = spot[1];
	this.x = LEFT + (this.xLoc * 20);
	this.y = TOP + (this.yLoc * 20);
	this.moving = false;
	this.dest = false;
	this.ttl = 0;
	this.duration = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.dx = 0;
	this.dy = 0;
	this.promote = false;
	this.deadx = 0;
	this.deady = 0;
	this.deadz = 0;
	this.dead = false;
	this.spaces = 0;

	// Low Poly - false || High Poly - true
	this.poly = board.highpoly;
	// Marble - true || Wood - false
	this.texture = board.texture;
	// create object for scene graph
	this.piece = new THREE.Object3D();
	// instantiate a loader
	this.loader = new THREE.OBJMTLLoader();
	
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
	
	//local variables to the init method to help loading the model
	var xPos = this.xLoc;
	var yPos = this.yLoc;
	this.piece = cloneObjMtl(board.queen);
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
	this.piece.scale.x = this.piece.scale.y = this.piece.scale.z = 5;
	this.piece.position.x = LEFT + (xPos * 20);
	this.piece.position.z = TOP + (yPos * 20);
	this.piece.position.y = 4.5;
	this.scene.add(this.piece);
	start++;
}

Queen.prototype.promoted = function(ttl){
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

// TODO a move method, should add the queen to a move Queue that will animate one move at a time
// Should handle callback to board for promotion
Queen.prototype.move = function(x, y){
	if(this.xLoc != x){
		this.spaces = Math.abs(this.xLoc - x);
	}else{
		this.spaces = Math.abs(this.yLoc - y);
	}
	this.xLoc = x;
	this.yLoc = y;
	this.x2 = LEFT + (x * 20);
	this.y2 = TOP + (y * 20);
		
	this.moving = true;
	this.ttl = 0;
	this.duration = SPEED_TIME * this.spaces;
	console.log(SPEED_TIME);
	console.log(this.duration);
	this.dx = (this.x2 - this.x);
	this.dy = (this.y2 - this.y);
	
}

Queen.prototype.update = function(){
	if(this.dest){
		var self = this;
		if(this.ttl <= (this.duration / this.spaces)){
			//console.log('opacity drops')
			this.piece.traverse(function(mesh){
				if(mesh instanceof THREE.Mesh){
					if(!mesh.material.transparent){
						mesh.material.transparent = true;
						mesh.material.opacity = 1;
					}
					mesh.material.opacity -= (1 / (self.duration / self.spaces));
				}
			});
		}
		this.ttl--;
		if(this.ttl == 0){
			this.dest = false;
			this.dead = true;
			this.ttl = 0;
			this.duration = (this.duration / this.spaces);
			this.piece.position.x = this.deadx;
			this.piece.position.y = this.deady;
			this.piece.position.z = this.deadz;
		}

	}else if(this.dead){
		if(!this.firedSmoke)
				{
					this.board.engine.push(new ParticleEngine(this.scene));
					this.smoke.positionBase = new THREE.Vector3(this.piece.position.x,this.piece.position.y,this.piece.position.z);
					this.board.engine[this.board.engine.length-1].setValues( this.smoke );
					this.board.engine[this.board.engine.length-1].initialize();
					this.firedSmoke = true;
					this.particles = true;
				}
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
					mesh.material.transparent = false;
				}
			});
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
		var newYpos = easeInOutExp(this.ttl, this.y, this.dy, this.duration);
		var newXpos = easeInOutExp(this.ttl, this.x, this.dx, this.duration);
		this.piece.position.z = newYpos;
		this.piece.position.x = newXpos;
		if(this.ttl >= (this.duration / 2)){
			var newTTL = this.ttl - (this.duration / 2);
			this.piece.position.y = easeInOutSin(newTTL, 7.5, -3, (this.duration / 2));
		}else{
			this.piece.position.y = easeInOutSin(this.ttl, 4.5, 3, (this.duration / 2));
		}
		this.ttl++;
		if(this.ttl > this.duration){
			this.moving = false;
			this.x = this.x2;
			this.y = this.y2;
		}
	}
}

Queen.prototype.destroy = function(ttl, spaces){
	this.moving = true;
	this.spaces = spaces;
	this.ttl = ttl;
	this.duration = ttl;
	this.dest = true;
}

Queen.prototype.isMoving = function(){
	return this.moving;
}

Queen.prototype.updatePiece = function(poly, texture){

	var board = this.board;
	var temp = this.piece;

	if(this.poly != poly){
		this.poly = poly;
		this.scene.remove(this.piece);
		this.piece = cloneObjMtl(this.board.queen);
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

Queen.prototype.outPos = function(pos){
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