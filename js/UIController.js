//Global variables for reference
var cameraFolder, serverFolder, themeFolder, guiServParams, guiThemeParams,speedFolder, moveFolder, gui; 
var UIController = function() { this.init(); }


/**
*DATGUI controller
*Initiates default values for the GUI.
*/
UIController.prototype.init = function(){
	//DEFAULTS
	this.serverUrl = "http://bencarle.com/chess/cg/340";
	this.connection = false; 
	this.currentlyConnected = false;
	var self = this;
	
	guiServParams = { //Needed for GUI, has server settings and Reset. Default settings.
        ServSetting: false, //True for GameID connection
    	ServerUrl: self.serverUrl,
        GameID: "team03",
        Connect: function(){ //On button press, connect to the server.
                var url = "";
                if(!this.ServSetting)
                {
                    url = this.ServerUrl;
                }
                else {
                    url += SERVER_URL + this.GameID;
                }
				self.connection = true;
				self.currentlyConnected = true;
                game.connectToServer(url); //Call over to GameController with url
        },
        Close: function(){//On button press, disconnect from the server.
            game.closeServerConnection();
				self.currentlyConnected = false;
				serverFolder.__controllers[1].remove(); //Remove the Close button
				serverFolder.__controllers.splice(1);
				//Put the connect button back
				serverFolder.add(guiServParams,'Connect').onFinishChange(function(){ 
                        serverFolder.__controllers[1].remove();
                        serverFolder.__controllers.splice(1);
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");
						});
						
        },
		Help: function()
		{//On button press, HTML dialog box opens for help.
			$("#infoBox").dialog("open");
		},
        Reset: function()
        { //Reset the game entirely on button press.
			guiThemeParams.type = "Marble";
			guiThemeParams.type = "Low";
			guiServParams.Close();
			whiteName = "Player 1";
			blackName = "Player 2";
            blackTime = 900;
            whiteTime = 900;
			self.connection = false;
			self.currentlyConnected = false;
			gui.destroy();
			sceneControl.reset();
                
        }
    };
	
	guiMoveParams = { //Manual movement
		moveString: "",
		Move: function()
		{
         game.move(this.moveString);
		 this.moveString = "";
		}
	};
	
	guiCameraParams = { //Camera controls
		control: false, //If true, then camera sweep enabled
		speed:	250, //How fast to camera sweep
		pieceSpeed: 40, //How fast to move the pieces
		//Basic preset camera positions
		cameraSide: function(){camera.position.x = 165; camera.position.y = 65; camera.position.z = -5;},
		cameraWhite: function(){camera.position.x = 0; camera.position.y = 100; camera.position.z = 176;},
		cameraBlack: function(){camera.position.x = 0; camera.position.y = 100; camera.position.z = -140;},
		cameraTop: function(){camera.position.x = -5; camera.position.y = 260; camera.position.z = 130;}
	};

    guiThemeParams = { //Change the textures, models, and skybox
        type: "Marble",
        quality: "Low",
		skybox: "sunnyocean",
		playAudio: false,
		Update: function()
		{//Initiates the reload of the new textures/models
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
				poly = 0;
			}
			else if(guiThemeParams.quality=="High")
			{
				//Make models high.
				poly = 1;
			}
			else
			{
				poly = 2;
			}
            start = 0;
            sceneControl.loadChanges(poly);
            game.updatePieces(poly, texture);
			if(guiThemeParams.skybox == "stormynight")
			{
				guiThemeParams.playAudio = true;
			}
			game.updateSkybox(guiThemeParams.skybox, guiThemeParams.playAudio);
			game.updateLights(guiThemeParams.skybox);
		}
    };
}

/**
*Creates the GUI and displays it.
*Depended on UIController.connection to check if
*the player has already connected to a server.
*Is called on initial load and updating themes on reload.
*/
UIController.prototype.gui = function(){
	gui = new dat.GUI();
	
	//////////////
	//Server Folder
	/////////////
    serverFolder = gui.addFolder('Server');
     
     if(this.connection)
	 {//Only if previously connected create these folders and buttons
	 serverFolder.add(guiServParams,'Close');
	 serverFolder.__controllers[0].remove();
	 
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
	 
	 else{ //If not previously connected (First load) then load the GUI as normal.
    serverFolder.add(guiServParams,'ServSetting').name('Use GameID?').onFinishChange(function(){
		//On Use GameID, remove and add buttons like Server IP and replace as needed.
        if(guiServParams.ServSetting)
        {
			//Connect with GameID
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
			//Connect via server.
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
						//When Connected, remove the buttons so player cannot change stuff.
                        serverFolder.__controllers[0].remove();
						serverFolder.__controllers[1].remove();
                        serverFolder.__controllers[2].remove();

                        serverFolder.__controllers.splice(0,2);
                        //Add the close button.
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");}
        );
    }
    serverFolder.open();
    //////////////
	//Manual Movement Folder
	/////////////
	moveFolder = gui.addFolder('Manual Move');
	moveFolder.add(guiMoveParams, 'moveString').name("Move").listen();
	moveFolder.add(guiMoveParams, 'Move').name("Execute");
	
	//////////////
	//Camera Folder
	/////////////
    cameraFolder = gui.addFolder('Camera'); 
	cameraFolder.add(guiCameraParams, 'control').name("Sweep Camera:").onFinishChange(function()
	{
		if(guiCameraParams.control)
		{
			//Camera is sweeping, dont let changes occur.
			
            userCameraControl = false;
            game.camera.position.y = 100;
			cameraFolder.__controllers[1].remove();
			cameraFolder.__controllers[2].remove();
			cameraFolder.__controllers[3].remove();
			cameraFolder.__controllers[4].remove();
			cameraFolder.__controllers[5].remove();
			cameraFolder.__controllers[6].remove();
			cameraFolder.__controllers[7].remove();
			cameraFolder.__controllers.splice(0,7);
		}
		else
		{	//Manual edit of controls including mouse movement
			userCameraControl = true;
			cameraFolder.add(camera.position, 'x', -500,500).step(5);
			cameraFolder.add(camera.position, 'y', -500,500).step(5);
			cameraFolder.add(camera.position, 'z', -500,500).step(5);
			cameraFolder.add(guiCameraParams,'cameraTop').name("Top Preset");
			cameraFolder.add(guiCameraParams,'cameraWhite').name("White Preset");
			cameraFolder.add(guiCameraParams,'cameraBlack').name("Black Preset");
			cameraFolder.add(guiCameraParams,'cameraSide').name("Side Preset");
		}
	});
	//Default on load is to let the user change camera
	userCameraControl = true;
	cameraFolder.add(camera.position, 'x', -500,500).step(5).listen();
	cameraFolder.add(camera.position, 'y', -500,500).step(5).listen();
	cameraFolder.add(camera.position, 'z', -500,500).step(5).listen();
	cameraFolder.add(guiCameraParams,'cameraTop').name("Top Preset");
	cameraFolder.add(guiCameraParams,'cameraWhite').name("White Preset");
	cameraFolder.add(guiCameraParams,'cameraBlack').name("Black Preset");
	cameraFolder.add(guiCameraParams,'cameraSide').name("Side Preset");
	
	//////////////
	//Speed Folder
	/////////////
	speedFolder = gui.addFolder('Speed');
	speedFolder.add(guiCameraParams, 'speed', 100,500).step(10).name("Sweep Speed").onFinishChange(function()
	{
        CAMERA_TIME = guiCameraParams.speed;
	});
	speedFolder.add(guiCameraParams, 'pieceSpeed', 10,80).step(2).name("Chess Speed").onFinishChange(function()
	{
        SPEED_TIME = guiCameraParams.pieceSpeed;
	});
    
    //////////////
	//Theme Folder
	/////////////
    themeFolder = gui.addFolder('Themes');
    themeFolder.add(guiThemeParams, 'type', ["Marble","Wood"]).name("Piece Type:");
    themeFolder.add(guiThemeParams, 'quality', ["Low","High","Comodore64"]).name("Quality:");
	themeFolder.add(guiThemeParams, 'skybox',["sunnyocean","darknight","sunset","stormynight"]);
	themeFolder.add(guiThemeParams,'Update');
	
	//Buttons on their own
	gui.add(guiThemeParams,'playAudio').name("Play Audio").onFinishChange(function(){
	if(guiThemeParams.playAudio)
	{
		bgSound.play();
	}
	else{bgSound.pause();}
	});
	gui.add(guiServParams, 'Help');
    gui.add(guiServParams,'Reset');
}

/**
*Destroy the gui for loading screens
*/
UIController.prototype.degui = function(){
    gui.destroy();
}
						
						