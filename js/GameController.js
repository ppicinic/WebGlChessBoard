
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
	this.shadowArray = new Array(6);
	for(var i = 0; i < this.shadowArray.length; i++){
		this.shadowArray[i] = new THREE.SpotLight(0xcccccc, 1, 0, Math.PI, 1);
		this.shadowArray[i].onlyShadow = true;
		this.shadowArray[i].target.position.set(0,0,0);
		this.shadowArray[i].castShadow = true;
		this.shadowArray[i].shadowCameraNear = 700;
		this.shadowArray[i].shadowCameraFar = this.camera.far;
		this.shadowArray[i].shadowCameraFov = 40;
		this.shadowArray[i].shadowMapWidth = 3072;
		this.shadowArray[i].shadowMapHeight = 3072;
		this.shadowArray[i].shadowDarkness = 0.0;
		//this.shadowArray[i].shadowBias = 0.00000000001;
	}
	this.shadowArray[0].position.set(200, 1000, 1000);
	this.shadowArray[1].position.set(1000, 1000, 1000);
	this.shadowArray[2].position.set(600, 1500, 600);
	this.shadowArray[3].position.set(300, 6000, 200);
	this.shadowArray[4].position.set(0, 1000, -600);
	this.shadowArray[5].position.set(300, 1000, -1000);

	this.shadowDark = new Array(6);
	this.shadowDark[0] = 0.8;
	this.shadowDark[1] = 0.3;
	this.shadowDark[2] = 0.5;
	this.shadowDark[3] = 0.7;
	this.shadowDark[4] = 0.4;
	this.shadowDark[5] = 0.6;
	for(var i = 0; i < 6; i++){
		this.scene.add(this.shadowArray[i]);
	}
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

GameController.prototype.setShadows = function(count){
	if(count > this.shadowCount){
		for(var i = this.shadowCount; i < count; i++){
			console.log(this.shadowArray[i]);
			this.shadowArray[i].shadowDarkness = this.shadowDark[i];
			this.shadowArray[i].shadowMapHeight = 3072;
			this.shadowArray[i].shadowMapWidth = 3072;
			//this.scene.add(this.shadowArray[i]);
			//renderer.updateShadowMap(scene, camera);
			console.log(renderer);
			console.log(this.scene);
			console.log(scene);
		}
		this.shadowCount = count;
	}else if(count < this.shadowCount){
		for(var i = this.shadowCount - 1; i >= count; i--){
			this.shadowArray[i].shadowDarkness = 0.0;
			this.shadowArray[i].shadowMapHeight = 100;
			this.shadowArray[i].shadowMapWidth = 100;
		}
		this.shadowCount = count;
	}
}