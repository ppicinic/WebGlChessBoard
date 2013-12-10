
var SceneController = function(gameScene, loading){ this.init(gameScene, loading); }

var stats;

SceneController.prototype.init = function(gameScene, loading){

	this.duration = 41;
	this.loading = true;
	this.poly = false;
	
	this.load = new LoadScene(this.duration);
	this.game = gameScene;
	scene = new THREE.Scene();
	scene = this.load.scene;
	camera = this.load.camera;
	
	this.datdatgui = new UIController();//datgui load
	var self = this;

	function change() {
	
		if(start == self.duration){
			self.changeScene();
			
		}else{
			setTimeout(change, 200);
		}
	}

	setTimeout(change, 200);

}

SceneController.prototype.changeScene = function(){
	if(this.loading){
		scene = this.game.scene;
		camera = this.game.camera;
		this.loading = false;
		this.datdatgui.gui(); //Begin to show the gui
		controls = new THREE.OrbitControls( camera, renderer.domElement ); //Mouse camera controls
		controlCam = true; //Manual camera control
		
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
	} else {
	//Game is loading
		this.loading = true;
		scene = this.load.scene;
		camera = this.load.camera;
		
		this.datdatgui.degui(); //Destroy gui
	}
}

SceneController.prototype.loadChanges = function(poly){
	this.duration = 32;
	if(this.poly != poly){
		this.poly = poly;
		this.duration += 6;
	}

	this.load = new LoadScene(this.duration);
	this.changeScene();

	whiteClock.innerHTML = ""; //Hide timer text during loading screen
	blackClock.innerHTML = "";
	var self = this;

	function reChange() {
		if(start == self.duration){
			self.changeScene();

		}else{
			setTimeout(reChange, 200);
		}
	}

	setTimeout(reChange, 0);
}

SceneController.prototype.reset = function(){
	start = 0;
	this.duration = 41;
	this.loading = true;
	this.load = new LoadScene(this.duration);
	scene = this.load.scene;
	camera = this.load.camera;
	game = new GameController();
	this.game = game;
	whiteClock.innerHTML = ""; //Hide timer text
	blackClock.innerHTML = "";
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