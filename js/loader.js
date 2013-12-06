var container, stats;

var game;
var loadingScene;
var loadingCamera;

var camera, scene, renderer;
var bicycle, frame;
var test;

//Needed for GUI


var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var startTime;
var endTime;
var datdatgui;
var sceneControl;
var loadScene;

init();
var board;
var movep = -1;
var movey = 1;
var start = 0;
var doneLoading = false;
var notPlaying = true;
var moveList = ["Pe2e4", "Pd7d6", "Pd2d4", "Ng8f6", "Nb1c3", "Pg7g6", "Bc1e3", "Bf8g7", 
	"Qd1d2", "Pc7c6", "Pf2f3", "Pb7b5", "Ng1e2", "Nb8d7", "Be3h6", "Bg7h6", "Qd2h6", "Bc8b7", 
	"Pa2a3", "Pe7e5", "Ke1c1", "Qd8e7", "Kc1b1", "Pa7a6", "Ne2c1", "Ke8c8", "Nc1b3", "Pe5d4", 
	"Rd1d4", "Pc6c5", "Rd4d1", "Nd7b6", "Pg2g3", "Kc8b8", "Nb3a5", "Bb7a8", "Bf1h3", "Pd6d5", 
	"Qh6f4", "Kb8a7", "Rh1e1", "Pd5d4", "Nc3d5", "Nb6d5", "Pe4d5", "Qe7d6", "Rd1d4", "Pc5d4", 
	"Re1e7", "Ka7b6", "Qf4d4", "Kb6a5", "Pb2b4", "Ka5a4", "Qd4c3", "Qd6d5", "Re7a7", "Ba8b7", 
	"Ra7b7", "Qd5c4", "Qc3f6", "Ka4a3", "Qf6a6", "Ka3b4", "Pc2c3", "Kb4c3", "Qa6a1", "Kc3d2", 
	"Qa1b2", "Kd2d1", "Bh3f1", "Rd8d2", "Rb7d7", "Rd2d7", "Bf1c4", "Pb5c4", "Qb2h8", "Rd7d3", 
	"Qh8a8", "Pc4c3", "Qa8a4", "Kd1e1", "Pf3f4", "Pf7f5", "Kb1c1", "Rd3d2", "Qa4a7"];
var moveList2 = ["Pe2e4", "Pc7c6", "Pe4e5", "Pf7f5", "Pe5f6"];
var moveList3 = ["Ph2h3", "Pd7d5", "Ph3h4", "Pd5d4", "Pe2e4", "Pd4e3"];
var moveList4 = ["Pe2e4", "Pd7d5", "Pe4d5", "Pe7e5", "Pd5e6", "Pf7e6", "Pd2d4", "Pc7c6", 
				"Nb1c3", "Bf8d6", "Ng1f3", "Ng8f6", "Bc1g5", "Ke8g8", "Bg5f6", "Pg7f6", "Bf1c4",
				"Pe6e5", "Pd4e5", "Pf6e5", "Nc3e4", "Bd6b4", "Pc2c3", "Bb4a5", "Nf3e5", "Bc8f5", 
				"Nd7f6"];//, "Ne4g5", "Pc5c4", "Ke1g1", "Nb8a6", "Bc4a6", "Pb7a6", "Pg2g4", "Bf5c8", 
				//"Ph2h4", "Bc8b7", "Ng5e4", "Qd8c7", "Ne6f8", "Kg8f8", "Qd1a4", "Bb7f3", "Qa4a5", "Pc5c4",
				//"Qa5b4"];
var moveList5 = ["Pe2e4", "Pd7d6", "Pd2d4", "Ng8f6", "Nb1c3", "Pg7g6", "Bc1e3", "Bf8g7", 
	"Qd1d2", "Pc7c6", "Pf2f3", "Pb7b5", "Ng1e2", "Nb8d7", "Be3h6", "Bg7h6", "Qd2h6", "Bc8b7", 
	"Pa2a3", "Pe7e5", "Ke1c1", "Qd8e7", "Kc1b1", "Pa7a6", "Ne2c1", "Ke8c8", "Nc1b3", "Pe5d4", 
	"Rd1d4", "Pc6c5", "Rd4d1", "Nd7b6", "Pg2g3", "Kc8b8", "Nb3a5", "Bb7a8", "Bf1h3", "Pd6d5", 
	"Qh6f4", "Kb8a7", "Rh1e1", "Pd5d4", "Nc3d5", "Nb6d5", "Pe4d5", "Qe7d6", "Rd1d4", "Pc5d4", 
	"Re1e7", "Ka7b6", "Qf4d4", "Kb6a5", "Pb2b4", "Ka5a4", "Qd4c3", "Qd6d5", "Re7a7", "Ba8b7", 
	"Ra7b7", "Qd5c4", "Qc3f6", "Ka4a3", "Qf6a6", "Ka3b4", "Pc2c3", "Kb4c3", "Qa6a1", "Kc3d2", 
	"Qa1b2", "Kd2d1", "Bh3f1", "Rd8d2", "Rb7d7", "Rd2d7", "Bf1c4", "Pb5c4", "Qb2h8", "Rd7d3", 
	"Qh8a8", "Pc4c3", "Qa8a4", "Kd1e1", "Pf3f4", "Pf7f5", "Kb1c1", "Rd3d2", "Qa4a7", "Pg6g5",
	"Pf4g5", "Pc3c2", "Qa7h7", "Ke1e2", "Qh7f5", "Ke2e1", "Pg5g6", "Ke1e2", "Pg6g7", "Ke2e1",
	"Pg7g8Q"];


function init() {
	startTime = new Date().getTime();
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	game = new GameController();
	scene = new THREE.Scene();
	loadScene = new LoadScene;
	sceneControl = new SceneController(game, loadScene);
	/*camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 176;
	camera.position.y = 100;*/
	

	// scene

	
	
	//datdatgui = new UIController();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	document.addEventListener( 'keydown', onKeyDown, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );
	
	
	
	animate();
	//setTimeout(toAnim, 200);
	
	
	

}
function toAnim(){
	if(start == 33){
		datdatgui.gui();
		doneLoading = true;
		scene = game.scene;
		camera = game.camera;
		endTime = new Date().getTime();
		console.log(endTime - startTime);
	}
	else{
		setTimeout(toAnim, 200);
	}
}

function cloneObj ( obj ) {
    var i, cpy = new THREE.Object3D();
    for (var i in obj.children) {
        cpy.add(
            new THREE.Mesh(obj.children[i].geometry)
        );
    }
    return cpy;
}

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

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKeyUp( event ) {
	//camera.position.z = -camera.position.z;
	/*var testloader = new THREE.OBJMTLLoader();
	testloader.load('Models/Pawn/Pawn.obj', 'Models/Pawn/pawn.mtl', function ( object ) {
		// scales and positions the model;
		object.position.z = TOP + 60;
		object.position.x = LEFT + 40;;
		object.position.y = 4.5;

		object.scale.x = object.scale.y = object.scale.z = 5;

		scene.add(object);
		});*/
	if(!sceneControl.loading){
		//var str = prompt("Enter a move");
		//board.move(str);
		if(notPlaying){
			notPlaying = false;
			for(var i = 0; i < moveList5.length; i++){
				game.move(moveList5[i]);
			}
		}
	}
	/*var z = camera.position.z;
	if(z == 170){
		camera.position.z = -140;
	}else{
		camera.position.z = 175;
	}*/
	/*
        Implement keyboard controls for pedaling (i.e., spinning the wheels)
    block commits*/
}

function onKeyDown( event ) {
    /*
        Implement keyboard controls for steering (i.e. turning the handlebars)
    */
}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {
	requestAnimationFrame( animate );
    /*
        TODO Perform updates for animation purposes
    */
	if(!sceneControl.loading){
		//console.log('happens');
		//scene.rotation.x += .5;
		//scene.rotation.y += .5;
		//scene.rotation.x += .5;
		game.update();
	}
	
	
	render();

}

function render() {

	//camera.position.x += ( mouseX - camera.position.x ) * .05;
	//camera.position.y += ( - mouseY - camera.position.y ) * .05;
	//test.position.z += .5;
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}
