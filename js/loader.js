
// Neccessary Global variables
var container, stats;

var game;
var loadingScene;
var loadingCamera;
var controls;

var camera, scene, renderer;
var bicycle, frame;
var test;


var start = 0;
var userCameraControl = true;

var whiteClock, blackClock; //Timers in the top left corner of the game
whiteClock = document.createElement('div'); //HTML text because DATGUI doesn't support unedit vars
whiteClock.style.position = 'fixed';
whiteClock.style.width = 100;
whiteClock.style.height = 100;
whiteClock.style.color = "black";
whiteClock.style.fontSize = "17px";
whiteClock.style.fontWeight = 'bolder';
whiteClock.bold = true;
whiteClock.innerHTML = "";
whiteClock.style.top = 0 + 'px';
whiteClock.style.left = 5 + 'px';
whiteClock.style.alignContent = 'center';
blackClock = document.createElement('div');
blackClock.style.position = 'fixed';
blackClock.style.width = 100;
blackClock.style.fontSize = "17px";
blackClock.style.height = 100;
blackClock.style.color = "black";
blackClock.style.fontWeight = 'bolder';
blackClock.innerHTML = "";
blackClock.style.top = 15 + 'px';
blackClock.style.left = 5 + 'px';
blackClock.style.alignContent = 'center';
document.body.appendChild(whiteClock);
document.body.appendChild(blackClock);

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var startTime;
var endTime;
var datdatgui;
var sceneControl;
var loadScene;
var whiteTime = 900;
var blackTime = 900;

var movep = -1;
var movey = 1;
var doneLoading = false;
var notPlaying = true;

var controlCam = false;

init();


/**
*	Init functions starts the webGl application
*/
function init() {
	// Set up container
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	// Create a new game, scene, and scene Controller
	game = new GameController();
	scene = new THREE.Scene();
	sceneControl = new SceneController(game, loadScene);

	// Create our renderer
	renderer = new THREE.WebGLRenderer({antialias: true, maxLights:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
	animate();
}

//cloneObjMtl to clone object from loading mtl files for instancing
function cloneObjMtl ( objmtl ) {
    var i, cpy = new THREE.Object3D();
    for (var i in objmtl.children) {
    	if(objmtl.children[i] instanceof THREE.Mesh){
        	cpy.add(
            	new THREE.Mesh(objmtl.children[i].geometry,
            	objmtl.children[i].material.clone())
       		);
    	}else {
    		cpy.add(cloneObjMtl(objmtl.children[i]));
    	}
    }
    return cpy;
}

/**
*	Resizes the camera and renderer
*/
function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

/**
*	Animate functions calls updates on objects that need them
*	It then calls render
*/
function animate() {
	requestAnimationFrame( animate );

	if(!sceneControl.loading){
		//No longer loading the game
		game.update();
		
		//////////////
		//Camera bounds
		//////////////
		if(camera.position.z >= 500)
		{
		camera.position.z = 500;
		}
		if(camera.position.y >= 500)
		{
			camera.position.y = 500;
		}
		if(camera.position.x >= 500)
		{
			camera.position.x = 500;
		}
		if(camera.position.z <= -900)
		{
		camera.position.z = -900;
		}
		if(camera.position.y <= 15)
		{
			camera.position.y = 15;
		}
		if(camera.position.x <= -900)
		{
			camera.position.x = -900;
		}
		
		//Manual control of camera with mouse
		if(controlCam && userCameraControl)
		{
			controls.update();
		}
		stats.update();
		
	}else{
		sceneControl.load.update();
	}
	
	render();

}

/**
*	Renders the scene
*/
function render() {
	camera.lookAt( scene.position );
	renderer.render( scene, camera );

}
