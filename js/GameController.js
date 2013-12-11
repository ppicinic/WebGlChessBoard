/**
*	Game Controller class hooks together the UI to the Board that has the visual work
*/
var GameController = function() { this.init(); }

/**
*	Constructor that create the Game Controller class
*/
GameController.prototype.init = function(){
	// Sets up all data fields
	this.serverConnect = false;
	this.serverURL = "";
	this.gameOver = false;
	this.whiteTime = 900;
	this.blackTime = 900;
	this.deltaTime = Date.now();
	this.moveCount = 0;
	this.jsonGame = null;
	this.manualmove = false;
	this.whitesturn = true;
	this.timerNeedsUpdate = true;

	// Creates camera
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
	this.camera.position.z = 176;
	this.camera.position.y = 100;
	
	// Creates scene
	this.scene = new THREE.Scene();
	
	// Adds all lights
	this.ambient = new THREE.AmbientLight( 0x00000f );
	this.scene.add( this.ambient );
	this.areaLight1 = new THREE.AreaLight( 0xffffff, 100 );
	this.areaLight1.position.set( 0.0001, 10.0001, 0.5001 );
	this.areaLight1.width = 100;
	this.areaLight1.height = 100;
	this.scene.add( this.areaLight1 );
				
	this.light2 = new THREE.PointLight( 0xffffff, .5, 10000 );
	this.light2.position.set( -90, 140, -90 );
	this.scene.add( this.light2 );
	
	this.directionalLight = new THREE.DirectionalLight( 0x8b8b8b );
	this.directionalLight.position.set( 0, 10, 0 ).normalize();
	this.scene.add( this.directionalLight );
				
	this.spotLight = new THREE.SpotLight( 0x111111 );
	this.spotLight.position.set( 0, 10000, -500 );
	this.scene.add(this.spotLight);

	// Shadow camera for shadow mapping
	this.shadow = new THREE.SpotLight(0xcccccc, 1, 0, Math.PI, 1);
	this.shadow.onlyShadow = true;
	this.shadow.target.position.set(0,0,0);
	this.shadow.castShadow = true;
	this.shadow.shadowCameraNear = 1;
	this.shadow.shadowCameraFar = this.camera.far;
	this.shadow.shadowCameraFov = 110;
	this.shadow.shadowDarkness = 0.7;
	this.shadow.position.set(0, 100, 0);
	this.scene.add(this.shadow);

	// Create chess board
	this.board = new ChessBoard(this.scene, this.camera);
}

/**
* 	Update Timer updates the timer
*	Note: Pinging server is expensive so it is only done as needed
*	Timer may not be up to date because of this.
*/
GameController.prototype.updateTimer = function(){
	if(this.serverConnect && !this.gameOver){
		var s = Date.now();
		var diff = s - this.deltaTime;
		var seconds = Math.floor(diff / 1000);
		if(this.whitesturn){
			whiteTime = this.whiteTime - seconds;
		}else{
			blackTime = this.blackTime - seconds;
		}
		if(!sceneControl.loading){
			blackClock.innerHTML = "Black Timer: " + blackTime;
			whiteClock.innerHTML = "White Timer: " + whiteTime;
		}
		var self = this;
		setTimeout(function(){self.updateTimer();}, 1000);
	}else{
		this.timerNeedsUpdate = true;
	}
}

/**
*	Update call pass update call to the board
*/
GameController.prototype.update = function(){
	
	this.board.update();
}

/**
*	Move calls the move on the board
*	if the connected to a server or the game is over
*	it will fail silently
*	@param str the move string
*/
GameController.prototype.move = function(str){
	if((!this.serverConnect) && (!this.gameOver) ){
		this.manualmove = true;
		this.board.move(str);
		this.moveCount++;
	}
}

/**
*	Calls updatePieces on the board
*	@param poly geometry type
*	@param texture the texture type
*/
GameController.prototype.updatePieces = function(poly, texture){
	this.board.updatePieceLoad(poly, texture);
}

/**
*	Updates the sky box
*	@param the skybox type
*/
GameController.prototype.updateSkybox = function(skybox, audioB){
	this.board.updateSkybox(skybox,audioB);
}

/**
*	Sets up connection to server
*	@param url the url of the server
*/
GameController.prototype.connectToServer = function(url){
	if((!this.serverConnect) && (!this.manualmove)){
		this.serverConnect = true;
		this.serverURL = url;
		var self = this;
		setTimeout(function(){ self.pingServer(); }, 0);
	}
}

/**
*	Changes the lights based on the skybox
*	@param skybox the skybox that has been changed to
*/
GameController.prototype.updateLights = function(skybox)
{
	
	if(skybox == "sunset")
	{
		this.scene.remove(this.directionalLight);
		this.directionalLight = new THREE.DirectionalLight( 0xFDEAD1 );
		this.directionalLight.position.set( 0, 10, 0 ).normalize();
		this.scene.add(this.directionalLight);
		this.scene.remove(this.light2);
		this.light2 = new THREE.PointLight( 0xFDEAD1, .5, 10000 );
		this.light2.position.set( -90, 140, -90 );
		this.scene.add( this.light2 );
	}
	else if(skybox == "stormynight")
	{
		this.scene.remove(this.directionalLight);
		this.directionalLight = new THREE.DirectionalLight( 0x383838 );
		this.directionalLight.position.set( 0, 10, 0 ).normalize();
		this.scene.add( this.directionalLight );
	}
	if(skybox == "tron")
	{
		this.scene.remove(this.directionalLight);
		this.directionalLight = new THREE.DirectionalLight( 0xFFA347 );
		this.directionalLight.position.set( 0, 10, 0 ).normalize();
		this.scene.add(this.directionalLight);
		this.scene.remove(this.light2);
		this.light2 = new THREE.PointLight( 0xFFA347, .5, 10000 );
		this.light2.position.set( -90, 140, -90 );
		this.scene.add( this.light2 );
	}
	else
	{
	this.scene.remove(this.light2);
	this.light2 = new THREE.PointLight( 0xffffff, .5, 10000 );
	this.light2.position.set( -90, 140, -90 );
	this.scene.add( this.light2 );
	
	this.scene.remove(this.directionalLight);
	this.directionalLight = new THREE.DirectionalLight( 0x8b8b8b );
	this.directionalLight.position.set( 0, 10, 0 ).normalize();
	this.scene.add( this.directionalLight );
	}
	
}

/**
*	Pings the server with the url it has
*/
GameController.prototype.pingServer = function(){
	// Only ping on open connection
	if(this.serverConnect){
		// Only ping if the board is done playing the moves it already has
		if(!this.board.isPlaying()){
			// Make a get request and send it
			var request = makeHttpObject();
			request.open("GET", this.serverURL, false);
			request.send(null);
			// If status is ok, evaluate JSON and do stuff
			if(request.status == 200){
				// Eval JSON
				var newJSON = JSON.parse(request.responseText);
				// If a JSON game already exists we only want moves we don't have
				if(this.jsonGame){
					//set the moves and all moves not in game yet
					var moves = newJSON.moves;
					
					for(var i = this.moveCount; i < moves.length; i++){
						
						this.board.move(moves[i]);
					}
					// Update all other info
					this.gameOver = newJSON.gameover;
					this.moveCount = newJSON.lastmovenumber;
					this.whitesturn = newJSON.whitesturn;
					this.blackTime = Math.floor(newJSON.blacktime);
					this.whiteTime = Math.floor(newJSON.whitetime);
					blackTime = this.blackTime;
					whiteTime = this.whiteTime;
					whiteName = newJSON.whitename;
					blackName = newJSON.blackname;
					wTeamName.innerHTML = "White Name: " + whiteName;
					bTeamName.innerHTML = "Black Name: " + blackName;
					blackClock.innerHTML = "Black Timer: " + blackTime;
					whiteClock.innerHTML = "White Timer: " + whiteTime;
					this.deltaTime = Date.now();
					this.jsonGame = newJSON;
					// if game over set the flags and close the connection
					// Also intiate a game over scene
					if(this.gameOver){
						this.serverConnect = false;
						this.board.gameOver(this.moveCount);
					}
				// We don't have any game info, we add all the moves
				}else {
					// Update all fields
					this.moveCount = newJSON.lastmovenumber;
					this.whitesturn = newJSON.whitesturn;
					this.blackTime = Math.floor(newJSON.blacktime);
					this.whiteTime = Math.floor(newJSON.whitetime);
					blackTime = this.blackTime;
					whiteTime = this.whiteTime;
					whiteName = newJSON.whitename;
					blackName = newJSON.blackname;
					wTeamName.innerHTML = "White Name: " + whiteName;
					bTeamName.innerHTML = "Black Name: " + blackName;
					blackClock.innerHTML = "Black Timer: " + blackTime;
					whiteClock.innerHTML = "White Timer: " + whiteTime;
					this.deltaTime = Date.now();
					this.gameOver = newJSON.gameover;
					// Add and play and the moves in the JSON
					var moves = newJSON.moves;
					for(var i in moves){
						this.board.move(moves[i]);
					}
					this.jsonGame = newJSON;
					// if game over set the flags and close the connection
					// Also intiate a game over scene
					if(this.gameOver){
						this.serverConnect = false;
						this.board.gameOver(this.moveCount);
					}
				}
			}
		}
		// set up next ping
		var self = this;
		if(this.timerNeedsUpdate){
			this.timerNeedsUpdate = false;
			setTimeout(function(){self.updateTimer();}, 1000);
		}
		setTimeout(function(){ self.pingServer(); }, 1000);
	}
}

/**
*	Closes the connection to the server
*/
GameController.prototype.closeServerConnection = function(){
	this.serverConnect = false;
}