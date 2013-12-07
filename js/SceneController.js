
var SceneController = function(gameScene, loading){ this.init(gameScene, loading); }

SceneController.prototype.init = function(gameScene, loading){

	this.duration = 39;
	this.loading = true;
	this.poly = false;
	//this.loadscene = loading.scene;
	//this.loadcam = loading.camera;
	this.load = new LoadScene(this.duration);
	console.log(this.load)
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