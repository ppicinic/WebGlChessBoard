var ChessBoard = function (scene, camera) { this.init(scene, camera); }

var clock = new THREE.Clock(); //clock for dt change
var particles = false; //control the particles being updated before the game starts
var rainControl = false; //Disable rain effect for skybox
var rainEngine; //Direct reference to rain particles to destroy
var bgSound; //Direct reference to rain sound
var source;


var rain =
{ //Rain particles
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
		opacityBase : 0.4,

		particlesPerSecond : 1000,
		particleDeathAge   : 1.0,		
		emitterDeathAge    : 100000
}

var smoke = 
	{ //Smoke particles
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
		particleDeathAge   : 0.6,		
		emitterDeathAge    : 0.1
	}

	/**
	* Creates the chessboard and loads all the pieces, table, skybox, ect.
	* Sets the game up for the initial display during the loading screen.
	*/
ChessBoard.prototype.init = function(scene, camera)
{
	this.scene = scene;
	this.board;
	this.engine = new Array();
	this.table;
	this.camera = new CameraController(camera);
	this.moveQueue = new Array(); // queue of moves to be animated
	this.movingArray = new Array(); // array of concurrently moving pieces
	this.loadStack = new Array();
	this.loader = new THREE.OBJMTLLoader();
	this.whiteCap = new Array();
	this.blackCap = new Array();
	bgSound = document.createElement( 'audio' );
	source = document.createElement( 'source' );
	source.src = 'Sound/mybg.mp3';
	bgSound.appendChild(source);
	bgSound.loop= true;
	

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
	
	///////////////////
	//SKYBOX & TEXTURES
	///////////////////
	this.skybox;
	this.skyboxName = "sunnyocean";
	this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');
	this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitemarble1.jpg');

	this.winner;

	var orangeTexture = THREE.ImageUtils.loadTexture("Models/textures/orange.jpg");
	var orangeBump = THREE.ImageUtils.loadTexture("Models/textures/orangebump.jpg");
	var geometry = new THREE.SphereGeometry(15, 15, 15);
	var material = new THREE.MeshPhongMaterial({map: orangeTexture, bumpMap: orangeBump, shading: THREE.SmoothShading})
	this.orange = new THREE.Mesh(geometry, material);
	this.orange.castShadow = true;
	this.orange.scale.x = this.orange.scale.y = this.orange.scale.z = .5;
	this.orange.position.x = -115;
	this.orange.position.z = -105;
	this.orange.position.y = 8;
	this.scene.add(this.orange);
	
	/**
	*Loads the skybox.
	* @param board the ChessBoard object
	* @param loader the loader object
	* @param skybox the skybox folder to load such as "sunnyocean"
	*/
	function loadSkybox(board,loader,skybox)
	{
		//Load over the textures and create a seamless cube.
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

	/////////////////////
	////Load Board/Pieces
	////////////////////
	
	/**
	* Loads the board model and textures
	* @param board the ChessBoard type (this)
	* @param loader the Loader type
	*/
	function loadBoard(board, loader){
	loader.load( 'Models/Board/board.obj', 'Models/Board/board.mtl', function ( object ) {

		object.position.x = -20;
    	object.scale.x = 10;
    	object.scale.y = 10;
    	object.scale.z = 10;
		object.material = null;
		object.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.receiveShadow = true;
				mesh.material.needsUpdate = true;
			}
		})	
		board.board = object;
		board.scene.add(board.board);
		start++;
    } );
	}
	
	/**
	*Load the table model and textures
	* @param board the ChessBoard type (this)
	* @param loader the Loader type
	*/
	function loadTable(board, loader){
	loader.load( 'Models/Table/table.obj', 'Models/Table/table.mtl', function ( object ) {
		var bump = THREE.ImageUtils.loadTexture("Models/textures/blackwood.jpg");
		
		object.position.x = 0;
		object.position.z = 12;
		object.position.y = -40;
    	object.scale.x = 50;
    	object.scale.y = 50;
    	object.scale.z = 50;
		object.material = null;
	    
		object.traverse(function(mesh){
			if(mesh instanceof THREE.Mesh){
				mesh.receiveShadow = true;
			}
		});
		board.table = object;
		board.scene.add(board.table);
		start++;
    } );
	}
	
	loadSkybox(this,this.loader,"sunnyocean/"); //default to sunnyocean
	loadBoard(this, this.loader);
	loadTable(this,this.loader);

	
	//load in all pieces
	//loader is asynchronous, becareful
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
			board.loadPieces(); //When completed load, execute the piece loading
		}else{
			setTimeout(loadCompleted, 200);
		}
	};
	
	
	setTimeout(loadCompleted, 200);

	
}

/**
*Loads the pieces logically in arrays for manipulation
*/
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

/**
* Update the chessboard render.
* Logic to check and kill pawn pieces when they move, as well as animation.
* Handles the particles too.
*/
ChessBoard.prototype.update = function(){
	var dt = clock.getDelta();
	if(particles)
	{	//When particles are first introduced, begin to update each one pushed to the array
		for(var i = 0; i < this.engine.length; i++)
		{
			this.engine[i].update( dt * 0.5 );	//Update each with the dt from clock
		}
	}
	if(rainControl)
	{
		rainEngine.update(dt * 0.3);
	}
	var bool = false; //WHAT?
	for(var i = 0; i < this.movingArray.length; i++){
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
				}
				else{
					var x = move.x;
					var y = move.y;
					var x2 = move.x2;
					var y2 = move.y2;
					this.pieces[x][y].move(x2, y2);
					if(this.pieces[x2][y2]){//A piece is going to kill another piece.
						
						//create a smoke particle effect.
						//Pushes to this.engine to be updated
						this.engine.push(new ParticleEngine(this.scene));
						smoke.positionBase = new THREE.Vector3(this.pieces[x2][y2].piece.position.x,this.pieces[x2][y2].piece.position.y,this.pieces[x2][y2].piece.position.z);
						this.engine[this.engine.length-1].setValues( smoke );
						this.engine[this.engine.length-1].initialize();
						particles = true;
						
						this.pieces[x2][y2].destroy(this.pieces[x][y].duration, this.pieces[x][y].spaces);
						this.movingArray.push(this.pieces[x2][y2]);
						
						if(this.pieces[x2][y2].color){
							this.whiteCap.push(this.pieces[x2][y2]);
							this.pieces[x2][y2].outPos(this.whiteCap.length);
						}
						else{
							this.blackCap.push(this.pieces[x2][y2]);
							this.pieces[x2][y2].outPos(this.blackCap.length);
						}
					}
					else {
						// en passent happens
						if(move.pawnCap){
							this.engine.push(new ParticleEngine(this.scene));
							smoke.positionBase = new THREE.Vector3(this.pieces[x2][y].piece.position.x,this.pieces[x2][y].piece.position.y,this.pieces[x2][y].piece.position.z);
							this.engine[this.engine.length-1].setValues( smoke );
							this.engine[this.engine.length-1].initialize();
							particles = true;
						
							this.pieces[x2][y].destroy(this.pieces[x][y].duration, this.pieces[x][y].spaces);
							this.movingArray.push(this.pieces[x2][y]);
							
							if(this.pieces[x2][y].color){
								this.whiteCap.push(this.pieces[x2][y]);
								this.pieces[x2][y].outPos(this.whiteCap.length);
							}else{
								this.blackCap.push(this.pieces[x2][y]);
								this.pieces[x2][y].outPos(this.blackCap.length);
							}
						}
					}
					if(move.promote){ //Promotion of pieces.
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
				if(move.camera){
					this.camera.move();
					this.movingArray.push(this.camera);
				}else{//GAMEOVER
					var endAnimation = new GameOver(this.winner);
					endAnimation.move();
					this.movingArray.push(endAnimation);
				}
			}
			
		}
	}
}

/**
*Manual moving pieces with a string in the GUI
*/
ChessBoard.prototype.move = function(str){

		var move = new PieceMove(str);
		var camMove = new CameraMove();
		this.moveQueue.push(move);
		this.moveQueue.push(camMove);
	
}

/**
*Load new textures or models
*@param poly is either high or low
*@param texture is either wood or marble
*/
ChessBoard.prototype.updatePieceLoad = function(poly, texture){
	var polyUpdate = false;
	var board = this;
	if(this.highpoly != poly){
		polyUpdate = true;
		this.highpoly = poly;
		var loadComplete = 0;
		if(this.highpoly){ //LOAD THE HIGH POLY MODELS
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
			//LOAD THE LOW POLY MODELS
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

	if(this.texture != texture){ //TEXTURE LOADING
		this.texture = texture;
		if(this.texture){ //MARBLE
			this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackmarble1.jpg');
			this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitemarble1.jpg');
		} else {	//WOOD
			this.blackTexture = THREE.ImageUtils.loadTexture('Models/textures/blackwood.jpg');
			this.whiteTexture = THREE.ImageUtils.loadTexture('Models/textures/whitewood.jpg');
		}
	}
	
	/**
	* For loading screen
	* Logic to handle when done loading async
	*/
	function waitUpdate(){
	//Wait for the new models and textures to load
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

/**
*Load a new skybox if selected
*@param skybox string of folder
*/
ChessBoard.prototype.updateSkybox = function(skybox)
{
	var board = this;
	if(this.skyboxName != skybox)
	{
		//Load all the textures from the folder and modify the cube
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
			if(this.skyboxName == "stormynight")
			{
				rainEngine = new ParticleEngine(this.scene);
				rainEngine.setValues( rain );
				rainEngine.initialize();
				rainControl = true;
				bgSound.pause();
				bgSound.src = 'Sound/rain.mp3';
				bgSound.play();
			}
	}
	if(this.skyboxName != "stormynight" && rainEngine)
	{
		rainEngine.destroy();
		rainControl = false;
		bgSound.pause();
		bgSound.src = 'Sound/mybg.mp3';
	}
}

/**
*Push the new models and textures onto the pieces
*/
ChessBoard.prototype.updatePieces = function(poly, texture){
	for(var x = 0; x < this.pieces.length; x++){
		for(var y = 0; y < this.pieces[x].length; y++){
			if(this.pieces[x][y]){
				this.pieces[x][y].updatePiece(poly, texture);
			}
		}
	}
	for(var i in this.whiteCap){
		this.whiteCap[i].updatePiece(poly, texture);
	}
	for(var i in this.blackCap){
		this.blackCap[i].updatePiece(poly, texture);
	}

}

/**
*Is the game being played or stopped?
*@return true or false
*/
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

/**
*GameOver screen setup
*@param move count how many moves have occured
*/
ChessBoard.prototype.gameOver = function(count){
	console.log('happens');
	if(count % 2 == 0){
		// black wins
		this.winner = "Black Wins!";
	} else {
		//white wins
		this.winner = "White Wins!"
	}
	if(this.moveQueue.length > 0){
		var l = this.moveQueue.length - 1;
		this.moveQueue[l] = new OverMove();
	}else{
		this.moveQueue.push(new OverMove());
	}
	
}
