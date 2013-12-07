
var GameController = function() { this.init(); }

GameController.prototype.init = function(){

	this.serverConnect = false;
	this.serverURL = "";
	this.gameOver = false;
	this.whiteTime = 900;
	this.blackTime = 900;
	this.moveCount = 0;
	this.jsonGame = null;
	this.manualmove = false;

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

	this.shadowCount = 0;
	this.shadowArray = new Array(10);
	for(var i = 0; i < this.shadowArray.length; i++){
		this.shadowArray[i] = new THREE.SpotLight(0x000000, 1, 0, Math.PI, 1);
		this.shadowArray[i].shadowOnly = true;
		this.shadowArray[i].target.position.set(0,0,0);
		this.shadowArray[i].castShadow = true;
		this.shadowArray[i].shadowCameraNear = 1;
		//this.shadowArray[i].shadowCameraVisible = true;
		this.shadowArray[i].shadowCameraFar = this.camera.far;
		this.shadowArray[i].shadowCameraFov = 50;
		this.shadowArray[i].shadowMapWidth = 4096;
		this.shadowArray[i].shadowMapHeight = 4096;
		this.shadowArray[i].shadowBias = 0.001;
	}
	this.shadowArray[0].position.set(200, 1000, 1000);
	this.shadowArray[1].position.set(1000, 1000, 1000);
	this.shadowArray[2].position.set(600, 1500, 600);
	this.shadowArray[3].position.set(300, 6000, 200);
	this.shadowArray[4].position.set(0, 1000, -600);
	this.shadowArray[5].position.set(300, 1000, -1000);
	this.shadowArray[6].position.set(-400, 1500, -1000);
	this.shadowArray[7].position.set(-600, 1000, 0);
	this.shadowArray[8].position.set(-1200, 200, 300);
	this.shadowArray[9].position.set(-900, 2000, 500);

	this.shadowArray[0].shadowDarkness = 0.8;
	this.shadowArray[1].shadowDarkness = 0.3;
	this.shadowArray[2].shadowDarkness = 0.1;
	this.shadowArray[3].shadowDarkness = 0.5;
	this.shadowArray[4].shadowDarkness = 0.83;
	this.shadowArray[5].shadowDarkness = 0.05;
	this.shadowArray[6].shadowDarkness = 0.9;
	this.shadowArray[7].shadowDarkness = 0.36;
	this.shadowArray[8].shadowDarkness = 0.63;
	this.shadowArray[9].shadowDarkness = 0.5;
	for(var i = 0; i < 2; i++){
		this.scene.add(this.shadowArray[i]);
	}

	//this.scene.add(this.shadowArray[0]);

	this.board = new ChessBoard(this.scene, this.camera);
}

GameController.prototype.update = function(){

	this.board.update();
}

GameController.prototype.move = function(str){
	if(!this.serverConnect){
		this.manualmove = true;
		this.board.move(str);
		this.moveCount++;
	}
}

GameController.prototype.updatePieces = function(poly, texture){
	this.board.updatePieceLoad(poly, texture);
}

GameController.prototype.connectToServer = function(url){
	if((!this.serverConnect) && (!this.manualmove)){
		this.serverConnect = true;
		this.serverURL = url;
		var self = this;
		setTimeout(function(){ self.pingServer(); }, 0);
	}
}

GameController.prototype.pingServer = function(){
	if(this.serverConnect){
		if(!this.board.isPlaying()){
			var request = makeHttpObject();
			request.open("GET", this.serverURL, false);
			request.send(null);
			if(request.status == 200){
				var newJSON = eval("(" + request.responseText + ")");
				if(this.jsonGame){
					var moves = newJSON.moves;
					for(var i = this.moveCount; i < moves.length; i++){
						this.board.move(moves[i]);
					}
					this.gameOver = newJSON.gameover;
					this.moveCount = newJSON.lastmovenumber;
					this.blackTime = newJSON.blacktime;
					this.whiteTime = newJSON.whitetime;
					this.jsonGame = newJSON;
					if(this.gameOver){
						this.serverConnect = false;
					}
				}else {
					this.moveCount = newJSON.lastmovenumber;
					this.blackTime = newJSON.blacktime;
					this.whiteTime = newJSON.whitetime;
					this.gameOver = newJSON.gameover;
					var moves = newJSON.moves;
					for(var i in moves){
						this.board.move(moves[i]);
					}
					this.jsonGame = newJSON;
					if(this.gameOver){
						this.serverConnect = false;
					}
				}
			}
		}
		// set up next ping
		var self = this;
		setTimeout(function(){ self.pingServer(); }, 1000);
	}
}

GameController.prototype.closeServerConnection = function(){
	this.serverConnect = false;
}