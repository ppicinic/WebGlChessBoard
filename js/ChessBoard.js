var ChessBoard = function (scene, camera) { this.init(scene, camera); }

var clock = new THREE.Clock();
var engine;
var particles = false;

var rain =
{
positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 200, 0 ),
		positionSpread   : new THREE.Vector3( 600, 0, 600 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, -400, 0 ),
		velocitySpread   : new THREE.Vector3( 10, 50, 10 ), 
		accelerationBase : new THREE.Vector3( 0, -10,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'Models/textures/raindrop2flip.png' ),

		sizeBase    : 8.0,
		sizeSpread  : 4.0,
		colorBase   : new THREE.Vector3(0.66, 1.0, 0.7), // H,S,L
		colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
		opacityBase : 0.6,

		particlesPerSecond : 1000,
		particleDeathAge   : 1.0,		
		emitterDeathAge    : 60
}

var smoke =
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, 0 ,0 ) , //Must set this before activating
		positionSpread   : new THREE.Vector3( 10, 0, 10 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, 150, 0 ),
		velocitySpread   : new THREE.Vector3( 80, 50, 80 ), 
		accelerationBase : new THREE.Vector3( 0,-10,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'Models/textures/smokeparticle.png'),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 5,
		angleVelocitySpread     : 720,
		
		sizeTween    : new Tween( [0, 1], [32, 128] ),
		opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
		colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

		particlesPerSecond : 200,
		particleDeathAge   : 1.0,		
		emitterDeathAge    : 0.1
	}

ChessBoard.prototype.init = function(scene, camera)
{
	this.scene = scene;
	this.board;
	this.camera = new CameraController(camera);
	this.moveQueue = new Array(); // queue of moves to be animated
	this.movingArray = new Array(); // array of concurrently moving pieces
	this.loadStack = new Array();
	this.loader = new THREE.OBJMTLLoader();
	this.destroyedArray = new Array();
	

	// Low Poly - false || High Poly - true
	this.highpoly = false;
	// Marble - true || Wood - false
	this.texture = true;
	this.pawn;
	this.rook;
	this.knight;
	this.bishop;
	this.queen;
	this.king;
	this.skybox;
	this.skyboxName = "sunnyocean";
	this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');
	this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitemarble1.jpg');
	
	function loadSkybox(board,loader,skybox)
	{
		var imagePrefix = "Models/textures/Skybox/";
	var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
	
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + skybox + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );

		board.skybox = skyBox;
		// add it to the scene
		board.scene.add(board.skybox);
		start++;
		
		
	}


	function loadBoard(board, loader){
	loader.load( 'Models/Board/board.obj', 'Models/Board/board.mtl', function ( object ) {
		object.position.x = -20;
    	object.scale.x = 10;
    	object.scale.y = 10;
    	object.scale.z = 10;
		object.material = null;
		object.receiveShadow = true;	
		board.board = object;
		board.scene.add(board.board);
		start++;
    } );
	}
	
	function loadTable(board, loader){
	loader.load( 'Models/Table/table.obj', 'Models/Table/table.mtl', function ( object ) {
		object.position.x = 0;
		object.position.z = 12;
		object.position.y = -40;
    	object.scale.x = 50;
    	object.scale.y = 50;
    	object.scale.z = 50;
		object.material = null;
		object.receiveShadow = true;
	    board.board = object;
		board.scene.add(board.board);
		start++;
    } );
	}
	
	loadSkybox(this,this.loader,"sunnyocean/");
	loadBoard(this, this.loader);
	loadTable(this,this.loader);

	
	//load in all pieces
	var board = this;
	var loadComplete = 0;
	this.loader.load('Models/Pawn/pawnlow.obj', 'Models/Pawn/pawn.mtl', function (object){
		board.pawn = object;
		loadComplete++;
		start++;
	});
	this.loader.load('Models/Rook/rooklow.obj', 'Models/Rook/rook.mtl', function (object){
		board.rook = object;
		loadComplete++;
		start++;
	});
	this.loader.load('Models/Knight/knightlow.obj', 'Models/Knight/knight.mtl', function (object){
		board.knight = object;
		
		//object.children[0].children[0].position.z -= 1;
		//console.log(object.children[0].children[0]);
		loadComplete++;
		start++;
	});
	this.loader.load('Models/Bishop/bishoplow.obj', 'Models/Bishop/bishop.mtl', function (object){
		board.bishop = object;
		loadComplete++;
		start++;
	});
	this.loader.load('Models/Queen/queenlow.obj', 'Models/Queen/queen.mtl', function (object){
		board.queen = object;
		loadComplete++;
		start++;
	});
	this.loader.load('Models/King/kinglow.obj', 'Models/King/king.mtl', function (object){
		board.king = object;
		loadComplete++;
		start++;
	});

	var loadCompleted = function(){
		if(loadComplete == 6){
	
	
	board.loadPieces();
	
	
	
		}else{
			setTimeout(loadCompleted, 200);
		}
	};

	setTimeout(loadCompleted, 200);

	
}

ChessBoard.prototype.loadPieces = function(){
	this.pieces = new Array(8);
	for(var i = 0; i < this.pieces.length; i++){
		this.pieces[i] = new Array(8);
	}

	var piece;
	for(var x = 0; x < this.pieces.length; x++){
		for(var y = 0; y < this.pieces[x].length; y++){
			if(y == 0){
				if(x == 0 || x == 7){
					piece = new Rook(this.scene, BLACK, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 1 || x == 6){
					piece = new Knight(this.scene, BLACK, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 2 || x == 5){
					piece = new Bishop(this.scene, BLACK, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 3){
					piece = new Queen(this.scene, BLACK, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 4){
					piece = new King(this.scene, BLACK, [x, y], this);
					this.pieces[x][y] = piece;
				}
			}else if(y == 1){
				piece = new Pawn(this.scene, BLACK, [x,y], this);
				this.pieces[x][y] = piece;
			}else if(y == 6){
				piece = new Pawn(this.scene, WHITE, [x,y], this);
				this.pieces[x][y] = piece;
			}else if(y == 7){
				if(x == 0 || x == 7){
					piece = new Rook(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 1 || x == 6){
					piece = new Knight(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 2 || x == 5){
					piece = new Bishop(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 3){
					piece = new Queen(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
				if(x == 4){
					piece = new King(this.scene, WHITE, [x, y], this);
					this.pieces[x][y] = piece;
				}
			}
		}
	}
}
ChessBoard.prototype.update = function(){
	var dt = clock.getDelta();
	if(particles)
	{
		engine.update( dt * 0.5 );	
	}
	var bool = false;
	for(var i = 0; i < this.movingArray.length; i++){
		//console.log(this.movingArray[i].isMoving());
		//console.log(this.movingArray[i].isMoving());
		if(this.movingArray[i].isMoving()){
			this.movingArray[i].update();
			bool = true;
		}
	}
	if(!bool){
		this.movingArray = new Array();
		if(this.moveQueue.length > 0){
			var move = this.moveQueue.shift();
			if(move.isPiece()){
				if(move.castle){
					var x = move.x;
					var y = move.y;
					var x2 = move.x2;
					var y2 = move.y2;
					var rx = -1;
					var ry = y;
					var rx2 = -1;
					var ry2 = y;
					if(move.queenCastle){
						rx = 0;
						rx2 = x2 + 1;
					}else{
						rx = 7;
						rx2 = x2 - 1;
					}
					this.pieces[x][y].move(x2, y2);
					this.pieces[x2][y2] = this.pieces[x][y];
					this.pieces[x][y] = null;
					this.pieces[rx][ry].castled(rx2, ry2, this.pieces[x2][y2].duration);
					this.pieces[rx2][ry2] = this.pieces[rx][ry];
					this.pieces[rx][ry] = null;
					this.movingArray.push(this.pieces[x2][y2]);
					this.movingArray.push(this.pieces[rx2][ry2]);
				}else{
					var x = move.x;
					var y = move.y;
					var x2 = move.x2;
					var y2 = move.y2;
					this.pieces[x][y].move(x2, y2);
					if(this.pieces[x2][y2]){
					
					var dz = 0;
					if(this.pieces[x2][y2] instanceof Pawn)
						{
							dz = -50;
						}
						engine = new ParticleEngine(this.scene);
						
						smoke.positionBase = new THREE.Vector3(this.pieces[x2][y2].x,this.pieces[x2][y2].y,dz);
						engine.setValues( smoke );
						engine.initialize();
						particles = true;
						console.log('piece dies');
						
						this.pieces[x2][y2].destroy(this.pieces[x][y].duration);
						
						this.movingArray.push(this.pieces[x2][y2]);
						this.destroyedArray.push(this.pieces[x2][y2]);
						
						
					}else {
						// en passent happens
						if(move.pawnCap){
							console.log('piece dies');
							this.pieces[x2][y].destroy(this.pieces[x][y].duration);
							this.movingArray.push(this.pieces[x2][y]);
							this.destroyedArray.push(this.pieces[x2][y]);
						}
					}
					if(move.promote){
						this.pieces[x][y].promoted();
						this.movingArray.push(this.pieces[x][y]);
						if(move.promoteType == 'Q'){
							this.pieces[x2][y2] = new Queen(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'N'){
							this.pieces[x2][y2] = new Knight(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'R'){
							this.pieces[x2][y2] = new Rook(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}else if(move.promoteType == 'B'){
							this.pieces[x2][y2] = new Bishop(this.scene, this.pieces[x][y].color, [x2, y2], this);
						}
						
						this.pieces[x2][y2].promoted(this.pieces[x][y].duration);
						this.movingArray.push(this.pieces[x2][y2]);
						this.pieces[x][y] = null;
					}else{
						this.pieces[x2][y2] = this.pieces[x][y];
						this.pieces[x][y] = null;
						this.movingArray.push(this.pieces[x2][y2]);
					}
				}
			}else{
				this.camera.move();
				this.movingArray.push(this.camera);
			}
			
			//console.log(this.movingArray);
			//console.log(this.moveQueue);
			
		}
	}
}
ChessBoard.prototype.move = function(str){
	var move = new PieceMove(str);
	var camMove = new CameraMove();
	this.moveQueue.push(move);
	this.moveQueue.push(camMove);
	
}

ChessBoard.prototype.updatePieceLoad = function(poly, texture){
	var polyUpdate = false;
	var board = this;
	if(this.highpoly != poly){
		polyUpdate = true;
		this.highpoly = poly;
		var loadComplete = 0;
		if(this.highpoly){
			this.loader.load('Models/Pawn/pawn.obj', 'Models/Pawn/pawn.mtl', function (object){
				board.pawn = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Rook/rook.obj', 'Models/Rook/rook.mtl', function (object){
				board.rook = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Knight/knight.obj', 'Models/Knight/knight.mtl', function (object){
				board.knight = object;
				
				//object.children[0].children[0].position.z -= 1;
				//console.log(object.children[0].children[0]);
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Bishop/bishop.obj', 'Models/Bishop/bishop.mtl', function (object){
				board.bishop = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Queen/queen.obj', 'Models/Queen/queen.mtl', function (object){
				board.queen = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/King/king.obj', 'Models/King/king.mtl', function (object){
				board.king = object;
				loadComplete++;
				start++;
			});
		}else{
			
			var loadComplete = 0;
			this.loader.load('Models/Pawn/pawnlow.obj', 'Models/Pawn/pawn.mtl', function (object){
				board.pawn = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Rook/rooklow.obj', 'Models/Rook/rook.mtl', function (object){
				board.rook = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Knight/knightlow.obj', 'Models/Knight/knight.mtl', function (object){
				board.knight = object;
				
				//object.children[0].children[0].position.z -= 1;
				//console.log(object.children[0].children[0]);
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Bishop/bishoplow.obj', 'Models/Bishop/bishop.mtl', function (object){
				board.bishop = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/Queen/queenlow.obj', 'Models/Queen/queen.mtl', function (object){
				board.queen = object;
				loadComplete++;
				start++;
			});
			this.loader.load('Models/King/kinglow.obj', 'Models/King/king.mtl', function (object){
				board.king = object;
				loadComplete++;
				start++;
			});
		}
	}

	if(this.texture != texture){
		this.texture = texture;
		if(this.texture){
			this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');
			this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitemarble1.jpg');
		} else {
			this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackwood.jpg');
			this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitewood.jpg');
		}
	}

	function waitUpdate(){
		if(loadComplete == 6){
			board.updatePieces(poly, texture);
		}else {
			setTimeout(waitUpdate, 200);
		}
	}

	if(polyUpdate){
		setTimeout(waitUpdate, 200);
	}else{
		board.updatePieces(poly, texture);
	}

}

ChessBoard.prototype.updateSkybox = function(skybox)
{
	var board = this;
	if(this.skyboxName != skybox)
	{
		var imagePrefix = "Models/textures/Skybox/";
		var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
		var imageSuffix = ".png";	
		
			var materialArray = [];
			for (var i = 0; i < 6; i++)
				materialArray.push( new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture( imagePrefix + skybox + "/" + directions[i] + imageSuffix ),
					side: THREE.BackSide
				}));
			var skyMaterial = new THREE.MeshFaceMaterial( materialArray );

			board.skybox.material = skyMaterial;
			board.skyboxName = skybox;
	}
}

ChessBoard.prototype.updatePieces = function(poly, texture){
	for(var x = 0; x < this.pieces.length; x++){
		for(var y = 0; y < this.pieces[x].length; y++){
			if(this.pieces[x][y]){
				this.pieces[x][y].updatePiece(poly, texture);

			}
		}
	}
	for(var i in this.destroyedArray){
		this.destroyedArray[i].updatePiece(poly, texture);
	}

}

ChessBoard.prototype.isPlaying = function(){
	var bool = false;
	for(var i in this.movingArray){
		if(this.movingArray[i].isMoving()){
			bool = true;
		}
	}
	if(this.moveQueue.length > 0){
		bool = true;
	}

	return bool;
}
