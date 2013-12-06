
var GameController = function() { this.init(); }

GameController.prototype.init = function(){

	this.serverConnect = false;
	this.serverURL = "";
	this.gameOver = false;
	this.whiteTime = 900;
	this.blackTime = 900;

	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	this.camera.position.z = 176;
	this.camera.position.y = 100;
	
	this.scene = new THREE.Scene();
	
	this.ambient = new THREE.AmbientLight( 0x00000f );
	this.scene.add( this.ambient );
	this.areaLight1 = new THREE.AreaLight( 0xffffff, 100 );
	this.areaLight1.position.set( 0.0001, 10.0001, 0.5001 );
	//areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 );
	this.areaLight1.width = 100;
	this.areaLight1.height = 100;
	this.scene.add( this.areaLight1 );
				
	this.light = new THREE.PointLight( 0xffffff, .5, 10000 );
	this.light.position.set( 90, 140, 90 );
	//this.scene.add( light );
				
	this.light2 = new THREE.PointLight( 0xffffff, .5, 10000 );
	this.light2.position.set( -90, 140, -90 );
	this.scene.add( this.light2 );
			
	this.light3 = new THREE.PointLight( 0xffffff, .5, 10000 );
	this.light3.position.set( -90, 140, 90 );
	//this.scene.add( light3 );
	this.directionalLight = new THREE.DirectionalLight( 0x8b8b8b );
	this.directionalLight.position.set( 0, 10, 0 ).normalize();
	this.scene.add( this.directionalLight );
				
	this.spotLight = new THREE.SpotLight( 0x111111 );
	this.spotLight.position.set( 0, 10000, -500 );
	this.scene.add(this.spotLight);
	
	this.board = new ChessBoard(this.scene, this.camera);
}

GameController.prototype.update = function(){
	this.board.update();
}

GameController.prototype.move = function(str){
	this.board.move(str);
}

GameController.prototype.updatePieces = function(poly, texture){
	this.board.updatePieceLoad(poly, texture);
}