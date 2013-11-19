var Pawn = function (scene, color, spot, board) { this.init(scene, color, spot, board); }

Pawn.prototype.init = function(scene, color, spot, board)
{
	this.board = board;
	//alert(this.board.children);
	this.scene = scene;
	this.color = color;
	this.spot = spot;
	var xPos = this.spot[0];
	var yPos = this.spot[1];
	this.piece = new THREE.Object3D();
	this.loading = true;
	//var pieceTemp;
	//alert(this.xPos);
	this.loader = new THREE.OBJMTLLoader();
	function loadPiece(pawn, loader, callback) {
		var piece;
		loader.load('Models/Pawn/Pawn.obj', 'Models/Pawn/pawn.mtl', function ( object ) {
		object.position.z = TOP + (xPos * 20);
		object.position.x = LEFT + (yPos * 20);
		object.position.y = 4.5;
    	object.scale.x = object.scale.y = object.scale.z = 5;
		object.receiveShadow = true;
		piece = object;
		pawn.piece = piece;
		pawn.scene.add(pawn.piece);
		callback(piece);
		});
		
	}
	var callhere = function(piece){
		//console.log(this);
	}
	
	loadPiece(this, this.loader, function(piece) {
		//this.piece = piece;
		//this.scene.add(this.piece);
		//this.piece.position.z += 20;
		//callhere(piece);
		//console.log('Piece added.');
		//console.log(this.piece);
		board.callbackFromPiece(spot[0], spot[1]);
	});
	
}

Pawn.prototype.getModel = function(){
	return this.piece;
}

Pawn.prototype.move = function(x, y){
	//alert(this.piece);
	//console.log(this.piece);
	this.piece.position.z = TOP + (x * 20);
	this.piece.position.x = LEFT + (y * 20);
	//console.log(this.piece);
}