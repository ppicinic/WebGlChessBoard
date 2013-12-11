/**
*	SceneController class controls which scene is currently running
*/
var SceneController = function(gameScene, loading){ this.init(gameScene, loading); }

var stats;

/**
*	Constructor creates the object and starts the loading scene
*	@param gameScene the game object given to the SceneController
*/
SceneController.prototype.init = function(gameScene, loading){
	// Set load properties
	this.duration = 41;
	this.loading = true;
	this.poly = 0;
	
	// Set up game and load scene initialize scene and camera
	// to that of loadScene
	this.load = new LoadScene(this.duration);
	this.game = gameScene;
	scene = new THREE.Scene();
	scene = this.load.scene;
	camera = this.load.camera;
	
	// Create UI
	this.datdatgui = new UIController();//datgui load
	var self = this;

	// Switch to Game Scene
	function change() {
	
		if(start == self.duration){
			self.changeScene();
			
		}else{
			setTimeout(change, 200);
		}
	}

	setTimeout(change, 200);

}

/**
*	Changes the scene from load to game scene, and vice-versa
*/
SceneController.prototype.changeScene = function(){
	// Change to game scene
	if(this.loading){
		scene = this.game.scene;
		camera = this.game.camera;
		this.loading = false;
		this.datdatgui.gui(); //Begin to show the gui
		controls = new THREE.OrbitControls( camera, renderer.domElement ); //Mouse camera controls
		controlCam = true; //Manual camera control
		
	wTeamName.innerHTML = "White Team: " + whiteName;
	bTeamName.innerHTML = "Black Team: " + blackName;
	blackClock.innerHTML = "Black Timer: " + blackTime; //Set the timers up
	whiteClock.innerHTML = "White Timer: " + whiteTime; 
	////////
	//FPS
	////////
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	}
	// Change to load screen 
	else {
	//Game is loading
		this.loading = true;
		scene = this.load.scene;
		camera = this.load.camera;
		
		this.datdatgui.degui(); //Destroy gui
	}
}

/**
*	Change scene to load scene for loading in piece changes
*	@param poly indicate whether new geometries must be loaded in
*/
SceneController.prototype.loadChanges = function(poly){
	// Calculate loadScene duration
	this.duration = 32;
	if(this.poly != poly){
		this.poly = poly;
		this.duration += 6;
	}

	// Create new loadScene and switch to it
	this.load = new LoadScene(this.duration);
	this.changeScene();

	//Hide timer text during loading screen
	wTeamName.innerHTML = "";
	bTeamName.innerHTML = "";
	whiteClock.innerHTML = ""; 
	blackClock.innerHTML = "";
	var self = this;

	// Change back to game scene on finish
	function reChange() {
		if(start == self.duration){
			self.changeScene();

		}else{
			setTimeout(reChange, 200);
		}
	}

	setTimeout(reChange, 0);
}

/**
*	Reset Game and switch scenes accordingly
*/
SceneController.prototype.reset = function(){
	// Set up duration calculation
	start = 0;
	this.duration = 41;
	this.loading = true;
	this.poly = 0;

	// Create a new LoadScene and switch to it
	this.load = new LoadScene(this.duration);
	scene = this.load.scene;
	camera = this.load.camera;
	// Create a new game forces a fresh reset
	game = new GameController();
	this.game = game;
	//Hide timer text
	wTeamName.innerHTML = "";
	bTeamName.innerHTML = "";
	whiteClock.innerHTML = ""; 
	blackClock.innerHTML = "";
	// Switch to Game scene when loading is complete
	var self = this;
	function resetChange(){
		if(start == self.duration){
			self.changeScene();
		}else{
			setTimeout(resetChange, 200);
		}
	}

	setTimeout(resetChange, 200);


}