
var SceneController = function(gameScene, loading){ this.init(gameScene, loading); }

SceneController.prototype.init = function(gameScene, loading){

	
	this.loading = true;
	//this.loadscene = loading.scene;
	//this.loadcam = loading.camera;
	this.load = loading;
	this.game = gameScene;
	scene = new THREE.Scene();
	scene = this.load.scene;
	camera = this.load.camera;
	this.datdatgui = new UIController();

	var self = this;

	function change() {
		if(start == 33){
			self.changeScene();
			self.datdatgui.gui();
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
	} else {

	}
}