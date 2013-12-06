 //Needed for GUI
var cameraFolder, serverFolder, themeFolder, guiServParams, guiThemeParams, gui; 

						
var UIController = function() { this.init(); }

UIController.prototype.init = function(){
	guiServParams = { //Needed for GUI, has server settings and Reset. Default settings.
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
                guiThemeParams.type = "Low";
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

    guiThemeParams = { //Needed for GUI, had theme settings.
        //TODO:Functions here.
        type: "Marble",
        quality: "Low",
		Update: function()
		{
			  if(guiThemeParams.type=="Wood")
			{
				//Make models wood.
				console.log("wood");
			}
			else
			{
				//Make models Marble.
				console.log("Marble");
			}
			   if(guiThemeParams.quality=="Low")
			{
				//Make models low.
				console.log("low");
			}
			else
			{
				//Make models high.
				console.log("high");
			}
		}
    };
}

UIController.prototype.gui = function(){
	gui = new dat.GUI();
    serverFolder = gui.addFolder('Server');
        
        
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
            console.log(serverFolder);
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
                        serverFolder.__controllers[2].remove();
                        serverFolder.__controllers.splice(2);
                        
                        serverFolder.close(); 
                        serverFolder.add(guiServParams,'Close').name("Close Connection");}
        );
    
    serverFolder.open();
        
    cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x', -500,500).step(5);
    cameraFolder.add(camera.position, 'y', -500,500).step(5);
    cameraFolder.add(camera.position, 'z', -500,500).step(5);
        
    themeFolder = gui.addFolder('Themes');
    themeFolder.add(guiThemeParams, 'type', ["Marble","Wood"]).name("Piece Type:").onFinishChange(function(){
      
    });
    themeFolder.add(guiThemeParams, 'quality', ["Low","High"]).name("Quality:").onFinishChange(function(){
     
    });
	themeFolder.add(guiThemeParams,'Update');
    gui.add(guiServParams,'Reset');
}
						
						