 //Needed for GUI
var cameraFolder, serverFolder, themeFolder, guiServParams, guiGfxParams, guiThemeParams,speedFolder, moveFolder, gui; 

						
var UIController = function() { this.init(); }

UIController.prototype.init = function(){
	this.serverUrl = "http://bencarle.com/chess/cg/340";
	this.connection = false;
	this.currentlyConnected = false;
	var self = this;
	guiServParams = { //Needed for GUI, has server settings and Reset. Default settings.
        ServSetting: false, //True for GameID connection
    	ServerUrl: self.serverUrl,
        GameID: "team03",
        Connect: function(){
        //TODO: Connect to server
                var url = "";
                if(!this.ServSetting)
                {
                    //url += SERVER_URL + this.GameID;
                    url = this.ServerUrl;
                }
                else {
                    url += SERVER_URL + this.GameID;
                }
				self.connection = true;
				self.currentlyConnected = true;
                game.connectToServer(url);
        },
        Close: function(){
            game.closeServerConnection();
		
         //TODO:Close connection
                //guiServParams.ServerUrl = "http://test.com";
                //guiServParams.GameID = "team03";
                
				self.currentlyConnected = false;
				serverFolder.__controllers[1].remove();
				serverFolder.__controllers.splice(1);
				serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
                        serverFolder.__controllers[1].remove();

                        serverFolder.__controllers.splice(1);
                        
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");}
						);
						
        },
		Help: function()
		{
			console.log("Help");
			//TODO:Add help doc
		},
        Reset: function()
        {
			guiThemeParams.type = "Marble";
			guiThemeParams.type = "Low";
			guiServParams.Close();
			self.connection = false;
			self.currentlyConnected = false;
			//TODO: Reset chess pieces
			console.log("Reset here");
			gui.destroy();
			sceneControl.reset();
                
        }
    };
	
	guiMoveParams = {
		moveString: "",
		Move: function()
		{
         game.move(this.moveString);
		 //console.log(this.moveString);
		 this.moveString = "";
		 //MAKE MOVES
		}
	};
	
	guiCameraParams = {
		control: false,
		speed:	250,
		pieceSpeed: 40
	};
	
	/*guiGfxParams = {
		shadowMap: 0,
		shadowRes: 250,
		fxaa: false
	};*/

    guiThemeParams = { //Needed for GUI, had theme settings.
        //TODO:Functions here.
        type: "Marble",
        quality: "Low",
		skybox: "sunnyocean",
		Update: function()
		{
            var poly;
            var texture;
			guiCameraParams.control = false;
			if(guiThemeParams.type=="Wood")
			{
				//Make models wood.
                texture = false;
			}
			else
			{
				//Make models Marble.
                texture = true;
			}
			   if(guiThemeParams.quality=="Low")
			{
				//Make models low.
				poly = false;
			}
			else
			{
				//Make models high.
				poly = true;
			}
            start = 0;
            console.log(start);
            sceneControl.loadChanges(poly);
            game.updatePieces(poly, texture);
			game.updateSkybox(guiThemeParams.skybox);
		}
    };
}

UIController.prototype.gui = function(){
	gui = new dat.GUI();
    serverFolder = gui.addFolder('Server');
        
     if(this.connection)
	 {
	 serverFolder.add(guiServParams,'Close');
	 console.log(serverFolder.__controllers);
	 serverFolder.__controllers[0].remove();
	 //serverFolder.__controllers.splice(0);
		if(this.currentlyConnected){
		//Create GUI as if already been connected to server
		 serverFolder.add(guiServParams,'Close').name("Close Connection");
		}else{
			//make it just connect
			serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
                        serverFolder.__controllers[1].remove();

                        serverFolder.__controllers.splice(1);
                        
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");}
						);
		}
	 }
	 
	 else{
    serverFolder.add(guiServParams,'ServSetting').name('Use GameID?').onFinishChange(function(){
        if(guiServParams.ServSetting)
        {
            serverFolder.__controllers[1].remove();
            serverFolder.__controllers[2].remove();
            serverFolder.__controllers.splice(1,2);
            serverFolder.add(guiServParams,'GameID');
            serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
            serverFolder.__controllers[2].remove();
            serverFolder.__controllers.splice(2);
            
            serverFolder.close(); 
            serverFolder.add(guiServParams,'Close').name("Close Connection");});
        }
        else
        {
     
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
    });
	
                
                
    serverFolder.add(guiServParams,'ServerUrl');
    serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
                        serverFolder.__controllers[0].remove();
						serverFolder.__controllers[1].remove();
                        serverFolder.__controllers[2].remove();

                        serverFolder.__controllers.splice(0,2);
                        
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");}
        );
    }
    serverFolder.open();
    
	moveFolder = gui.addFolder('Manual Move');
	moveFolder.add(guiMoveParams, 'moveString').name("Move").listen();
	moveFolder.add(guiMoveParams, 'Move');
	
    cameraFolder = gui.addFolder('Camera');
	cameraFolder.add(guiCameraParams, 'control').name("Sweep Camera:").onFinishChange(function()
	{
		if(guiCameraParams.control)
		{
            userCameraControl = false;
            game.camera.position.y = 100;
			cameraFolder.__controllers[1].remove();
			cameraFolder.__controllers[2].remove();
			cameraFolder.__controllers[3].remove();
			cameraFolder.__controllers.splice(0,3);
		}
		else
		{
			userCameraControl = true;
			cameraFolder.add(camera.position, 'x', -500,500).step(5);
			cameraFolder.add(camera.position, 'y', -500,500).step(5);
			cameraFolder.add(camera.position, 'z', -500,500).step(5);
		}
	});
	userCameraControl = true;
	cameraFolder.add(camera.position, 'x', -500,500).step(5).listen();
	cameraFolder.add(camera.position, 'y', -500,500).step(5).listen();
	cameraFolder.add(camera.position, 'z', -500,500).step(5).listen();
	
	speedFolder = gui.addFolder('Speed');
	speedFolder.add(guiCameraParams, 'speed', 100,500).step(10).name("Sweep Speed").onFinishChange(function()
	{
	});
	speedFolder.add(guiCameraParams, 'pieceSpeed', 10,80).step(2).name("Chess Speed").onFinishChange(function()
	{
	});
    
      
    themeFolder = gui.addFolder('Themes');
    themeFolder.add(guiThemeParams, 'type', ["Marble","Wood"]).name("Piece Type:");
    themeFolder.add(guiThemeParams, 'quality', ["Low","High"]).name("Quality:");
	themeFolder.add(guiThemeParams, 'skybox',["sunnyocean","darknight"]);
	themeFolder.add(guiThemeParams,'Update');
	
	/*gfxFolder = gui.addFolder('Graphics Settings');
    
	gfxFolder.add(guiGfxParams, 'shadowMap', 0, 6).step(1).name("# of Shadows").onFinishChange(function(){
		console.log(guiGfxParams.shadowMap);
		//TODO Change shadowmap quality here
	});
	
	gfxFolder.add(guiGfxParams, 'shadowRes', 100, 1200).step(100).name("Shadow Res").onFinishChange(function(){
		console.log(guiGfxParams.shadowRes);
		//TODO Change shadowmap resolution here
	});
	
	gfxFolder.add(guiGfxParams, 'fxaa').name("FXAA").onFinishChange(function(){
		console.log(guiGfxParams.fxaa);
		//TODO Enable/Disable fxaa here
	});*/
	
	gui.add(guiServParams, 'Help');
    gui.add(guiServParams,'Reset');
	
	
}

UIController.prototype.degui = function(){
    gui.destroy();
}
						
						