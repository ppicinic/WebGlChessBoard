var ChessBoard = function (scene, camera) { this.init(scene, camera); }

ChessBoard.prototype.init = function(scene, camera)
{
	this.scene = scene;
	this.camera = new CameraController(camera);
	this.moveQueue = new Array(); // queue of moves to be animated
	this.movingArray = new Array(); // array of concurrently moving pieces
	this.loadStack = new Array();
	this.loader = new THREE.OBJMTLLoader();
	this.loader.load( 'Models/Board/board.obj', 'Models/Board/board.mtl', function ( object ) {
		object.position.x = -20;
    	object.scale.x = 10;
    	object.scale.y = 10;
    	object.scale.z = 10;
		object.material = null;
		object.receiveShadow = true;	
		this.scene.add(object);
    } );
	
	this.pieces = new Array(8);
	for(var i = 0; i < this.pieces.length; i++){
		this.pieces[i] = new Array(8);
	}
	var piece;
	for(var x = 0; x < this.pieces.length; x++){
		for(var y = 0; y < this.pieces[x].length; y++){
			if(y == 1){
				piece = new Pawn(this.scene, BLACK, [x,y], this);
				this.pieces[x][y] = piece;
			}else if(y == 6){
				piece = new Pawn(this.scene, WHITE, [x,y], this);
				this.pieces[x][y] = piece;
			}
		}
	}
	//this.add(0,0);
	
	//this.pieces[6][5].move([4, 5]);
}

ChessBoard.prototype.update = function(){
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
			//console.log('pushes here');
			this.movingArray.push(this.moveQueue.shift());
			//console.log(this.movingArray);
			//console.log(this.moveQueue);
			
		}
	}
}
ChessBoard.prototype.move = function(x1, y1, x2, y2){
	this.pieces[x1][y1].move(x2, y2);
	this.pieces[x2][y2] = this.pieces[x1][y1];
	this.pieces[x1][y1] = null;
	this.moveQueue.push(this.pieces[x2][y2]);
}