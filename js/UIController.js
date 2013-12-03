
var UIController = function() {this.init()}

UIController.prototype.init = function(){
	this.cameraFolder;
	this.serverFolder
	this.themeFolder; 
	this.gui;
	this.guiServParams = { //Needed for GUI, has server settings and Reset. Default settings.
		ServSetting: false, //True for GameID connection
				ServerUrl: "http://test.com",
				GameID: "team03",
				Connect: function(){
				//TODO: Connect to server
					if(!this.ServSetting)
					{
						console.log("Connect to " + this.ServerUrl);
					}
					else {
					console.log("Connect to ID: " + this.GameID);
					}
				},
				Close: function(){
				 //TODO:Close connection
					console.log("Close");
				},
				Reset: function()
				{
					guiServParams.ServerUrl = "http://test.com";
					guiServParams.GameID = "team03";
					guiThemeParams.type = "Marble";
					guiThemeParams.type = "High";
					guiServParams.Close();
					//TODO: Reset chess pieces
					console.log("Reset here");
					serverFolder.close();
					serverFolder.__controllers[1].remove();
					serverFolder.__controllers[2].remove();
					serverFolder.__controllers.splice(1,2);

					serverFolder.add(guiServParams,'ServerUrl');
					serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
					serverFolder.__controllers[2].remove();
					serverFolder.__controllers.splice(2);
					serverFolder.close(); 
					serverFolder.add(guiServParams,'Close').name("Close Connection");}
						);
				}
			
			};
	
	this.guiThemeParams = { //Needed for GUI, had theme settings.
			//TODO:Functions here.
			type: "Marble",
			quality: "High"
			};
}

UIController.prototype.gui = function(){
	this.gui = new dat.GUI();
    var serverFolder = this.gui.addFolder('Server');
	
	serverFolder.add(this.guiServParams,'ServSetting').name('Use GameID?').onFinishChange(function(){
		if(guiServParams.ServSetting)
		{
			serverFolder.__controllers[1].remove();
			serverFolder.__controllers[2].remove();
			serverFolder.__controllers.splice(1,2);
			serverFolder.add(this.guiServParams,'GameID');
			serverFolder.add(this.guiServParams,'Connect').onFinishChange(function(){ 
			serverFolder.__controllers[2].remove();
			serverFolder.__controllers.splice(2);
			
			serverFolder.close(); 
			serverFolder.add(this.guiServParams,'Close').name("Close Connection");});
		}
		else
		{
			console.log(serverFolder);
			serverFolder.__controllers[1].remove();
			serverFolder.__controllers[2].remove();
			serverFolder.__controllers.splice(1,2);

			serverFolder.add(this.guiServParams,'ServerUrl');
			serverFolder.add(this.guiServParams,'Connect').onFinishChange(function(){ 
			serverFolder.__controllers[2].remove();
			serverFolder.__controllers.splice(2);
			serverFolder.close(); 
			serverFolder.add(this.guiServParams,'Close').name("Close Connection");}
				);
		}
		
	});
		
		
	serverFolder.add(this.guiServParams,'ServerUrl');
    serverFolder.add(this.guiServParams,'Connect').onFinishChange(function(){ 
			serverFolder.__controllers[2].remove();
			serverFolder.__controllers.splice(2);
			
			serverFolder.close(); 
			serverFolder.add(this.guiServParams,'Close').name("Close Connection");}
	);
    
    serverFolder.open();
	
    this.cameraFolder = this.gui.addFolder('Camera');
    this.cameraFolder.add(camera.position, 'x', -500,500).step(5);
	this.cameraFolder.add(camera.position, 'y', -500,500).step(5);
    this.cameraFolder.add(camera.position, 'z', -500,500).step(5);
	
	this.themeFolder = this.gui.addFolder('Themes');
    this.themeFolder.add(this.guiThemeParams, 'type', ["Marble","Wood"]).name("Piece Type:").onFinishChange(function(){
			if(this.guiThemeParams.type=="Wood")
			{
				//Make models wood.
				console.log("wood");
			}
			else
			{
			//Make models Marble.
			console.log("Marble");
			}
		});
	this.themeFolder.add(this.guiThemeParams, 'quality', ["High","Low"]).name("Quality:").onFinishChange(function(){
			if(this.guiThemeParams.quality=="Low")
			{
				//Make models low.
				console.log("low");
			}
			else
			{
			//Make models high.
			console.log("high");
			}
		});
	this.gui.add(this.guiServParams,'Reset');
}