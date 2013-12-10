
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
	
	this.datdatgui = new UIController();
	

	var self = this;

	function change() {
	
		if(start == self.duration){
			self.changeScene();
			//self.datdatgui.gui();
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
		this.datdatgui.gui();
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controlCam = true;
		whiteClock = document.createElement('div');
	whiteClock.style.position = 'fixed';
	whiteClock.style.width = 100;
	whiteClock.style.height = 100;
	whiteClock.style.color = "black";
	whiteClock.innerHTML = "White Timer:" + blackTime;
	whiteClock.style.top = 0 + 'px';
	whiteClock.style.left = 5 + 'px';
	whiteClock.style.alignContent = 'center';
	blackClock = document.createElement('div');
	blackClock.style.position = 'fixed';
	blackClock.style.width = 100;
	blackClock.style.height = 100;
	blackClock.style.color = "black";
	blackClock.innerHTML = "Black Timer:" + blackTime;
	blackClock.style.top = 15 + 'px';
	blackClock.style.left = 5 + 'px';
	blackClock.style.alignContent = 'center';
	document.body.appendChild(whiteClock);
	document.body.appendChild(blackClock);
	
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	} else {
		this.loading = true;
		scene = this.load.scene;
		
		camera = this.load.camera;
		this.datdatgui.degui();
	}
}

SceneController.prototype.loadChanges = function(poly){
	this.duration = 32;
	if(this.poly != poly){
		this.poly = poly;
		this.duration += 6;
	}
	console.log(this.duration);
	this.load = new LoadScene(this.duration);
	this.changeScene();

	var self = this;

	function reChange() {
		if(start == self.duration){
			self.changeScene();
			//self.datdatgui.gui();
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