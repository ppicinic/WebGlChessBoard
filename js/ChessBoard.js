var ChessBoard = function (scene) { this.init(scene); }

ChessBoard.prototype.init = function(scene)
{
	this.scene = scene;
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
	this.add(0,0);
	
	//this.pieces[6][5].move([4, 5]);
}
ChessBoard.prototype.add = function(x, y){
	var piece;
	if(x < 8 && y < 8){
		if(x == 1){
			piece = new Pawn(this.scene, BLACK, [x,y], this);
			this.pieces[x][y] = piece;
		}else if(x == 6){
			piece = new Pawn(this.scene, WHITE, [x,y], this);
			this.pieces[x][y] = piece;
		}else{
			this.pieces[x][y] = null;
			this.callbackFromPiece(x, y);
		}
	}else{
		animate();
		i = 0;
		while(i < 10000){
			i++;
		}
		this.move();
	}
}
ChessBoard.prototype.callbackFromPiece = function(x, y){
	y++;
	if(y == 8){
		y = 0;
		x++;
	}
	this.add(x, y);
}

ChessBoard.prototype.move = function(){

	this.pieces[6][4].move(4, 4);
	this.pieces[1][3].move(3, 3);
}