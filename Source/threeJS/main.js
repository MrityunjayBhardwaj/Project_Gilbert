
let ThreeCanvasDim  = [400,400]

function init(){
	var gui = new dat.GUI();
	let speed = 0.001;

	// renderer need 2 things == 1=> scene and 2==> camera
	var scene  = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45,200/400,.1,1000);

	// creating renderer and appending to the html div element
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor('rgb(100,100,100)');
	// renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setSize(400,400);
	document.getElementById("webgl").appendChild(renderer.domElement);

	// now creting geometry to add to the scene
	var box_geo = new THREE.BoxGeometry(1,1,1);
	var box_mat = new THREE.MeshPhongMaterial({color: 0xff0000,side: THREE.DoubleSide})
	var box_mesh = new THREE.Mesh(box_geo,box_mat);

	box_mesh.name = "box_mesh";

	// box_mesh.rotation.x =
	var plain_geo = new THREE.PlaneGeometry(20,20);
	var plain_mat = new THREE.MeshPhongMaterial({color: 0x00ff00,side: THREE.DoubleSide})
	var plain_mesh = new THREE.Mesh(plain_geo,plain_mat);

	plain_mesh.rotation.x = Math.PI/2;
	plain_mesh.position.y = -.5;


	// adding mesh to the scene
	scene.add(box_mesh)
	scene.add(plain_mesh)

	var light = new THREE.PointLight(0xffffff,1);
	light.position.y = 2;
	light.position.z = 1;
	light.position.x = .5;

	scene.add(lightsphere_mesh);
	scene.add(light);

	// create object to track light physically
	var lightsphere_geo = new THREE.SphereGeometry(.1,32,32);
	var lightsphere_mat = new THREE.MeshBasicMaterial({color:0xffffff});
	var lightsphere_mesh = new THREE.Mesh(lightsphere_geo,lightsphere_mat);

	light.add(lightsphere_mesh);


	// now because the default position of both the box and camera is at 0,0,0 so the camera is
	// covered by box .... so in order to view anything we need to shift it in z direction

	// camera.lookAt(0,0,0)

	// camera position :-
	camera.position.z = 3.2;
	camera.position.y = 1.2;
	camera.position.x = 1.4;

	camera.rotation.x = -.4;

	let control = new THREE.OrbitControls(camera,renderer.domElement);

	speed = new spd(.001);

	// animate
	update(scene,camera,renderer,control,speed);

	// gui.
	gui.add(light,'intensity',0,10);
	gui.add(light.position,'x',0,5);
	// gui.add(speed,'speed',0,.2);

	var axis_helper = new THREE.AxisHelper(2);

	var gridXZ = new THREE.GridHelper(20, 10,(0x006600), (0x006600));
	// gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	scene.add(gridXZ);

	var gridXY = new THREE.GridHelper(20, 10,(0x000066),  (0x000066) );
	gridXY.rotation.x = Math.PI/2;
	scene.add(gridXY);

	var gridYZ = new THREE.GridHelper(20, 10,{color:0x660000}, {color:0x660000});
	gridYZ.rotation.z = Math.PI/2;
	scene.add(gridYZ);


	scene.add(axis_helper);
	scene.add(grid_helper);

	// adding grid helpers

	// Rendering the Scene
	renderer.render(scene,camera);

}

init();

function spd(k){this.speed = k;};

function update(scene,camera,renderer,orbitctrl,speed){

	renderer.render(scene,camera);

	let box = scene.getObjectByName("box_mesh");
	box.rotation.y +=speed.speed;

	orbitctrl.update();

	requestAnimationFrame(function(){
		update(scene,camera,renderer,orbitctrl,speed);
	});
}