// DEMO List:

/**
 * Elementry:
 *
 * Cross Product Viz
 * Dot   Product Viz
 * and do the split screen to see the comparison
 * Determinant Viz
 * InverseMatrix Viz
 * Linear Combination Visualization using Interpolation
 *
 *  Gilbert:
 * Ax = b Viz
 * Row And Column Picture
 *
 */

// init Dat.GUI
var gui = new dat.GUI();

// input matrix text
var inpMatxt = function(){
	this.message = "print it";
} 

function init(){
	let speed = 0.001;
	let winSize=  [800,600];
	// winSize =[window.innerWidth,window.innerHeight] ;
	// winSize =[window.innerWidth*(2/3),window.innerHeight] ;

	// winSize = [1,1]
	// renderer need 2 things == 1=> scene and 2==> camera
	var scene  = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45,winSize[0]/winSize[1],.1,1000);
	// winSize =[window.innerWidth*(2/3),window.innerHeight] ;

	// creating renderer and appending to the html div element
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor('rgb(00,00,20)');
	// renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setSize(winSize[0],winSize[0]);
	document.getElementById("webgl").appendChild(renderer.domElement);

	// now creting geometry to add to the scene
	var box_geo = new THREE.BoxGeometry(1,1,1);
	var box_mat = new THREE.MeshPhongMaterial({color: 0xff0000,side: THREE.DoubleSide})
	var box_mesh = new THREE.Mesh(box_geo,box_mat);

	box_mesh.name = "box_mesh";

	// var plain_geo = new THREE.PlaneGeometry(20,20);
	// var plain_mat = new THREE.MeshPhongMaterial({color: 0x00ff00,side: THREE.DoubleSide})
	// var plain_mesh = new THREE.Mesh(plain_geo,plain_mat);

	// plain_mesh.rotation.x = Math.PI/2;
	// plain_mesh.position.y = -.5;


	// adding mesh to the scene
	// scene.add(box_mesh)
	// scene.add(plain_mesh)

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
	camera.position.z = 6.8;
	camera.position.y = 2.2;
	camera.position.x = 3.4;

	camera.rotation.x = -.4;

	let control = new THREE.OrbitControls(camera,renderer.domElement);

	speed = new spd(.001);

	var axis_helper = new THREE.AxisHelper(2);

	var gridXZ = new THREE.GridHelper(20, 10,(0x009999), (0x009999));
	gridXZ.material.linewidth =1.2;

	// gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	scene.add(gridXZ);

	// var gridXY = new THREE.GridHelper(20, 10,(0x000066),  (0x000066) );
	// gridXY.rotation.x = Math.PI/2;
	// scene.add(gridXY);

	// var gridYZ = new THREE.GridHelper(20, 10,{color:0x660000}, {color:0x660000});
	// gridYZ.rotation.z = Math.PI/2;
	// scene.add(gridYZ);



	// adding grid helpers

	// adding vectors
	var vec3_0 = new THREE.Vector3(3,1,2)


// direction (normalized), origin, length, color(hex)
	let vec1 = new VecViz([3,2,1]);
	// scene.add(vec1.arrow);

	let vec2 = new VecViz([3,3,3],[0,0,0],0xff0000);
	vec2.arrow.name = "vec2";

	scene.add(vec2.arrow);

	// let subVec = subvecViz(vec1,vec2,0xf5f204);
	// scene.add(subVec.arrow);


	// matrixViz([[1,2,3],[4,5,6],[7,8,9]],scene)


	SpanViz([1,2,3],scene);

	// CODE

	var inpMat = new inpMatxt();
	var pretxt = inpMat.message;

	// console.log("text: ",text.message);

	//GUI
	gui.add(inpMat,"message");
	gui.add(light,'intensity',0,10);
	gui.add(light.position,'x',0,5);
	gui.add(speed,"speed",0,5);

	// if (pretxt != inpMat.message){
	// 	// it means the value is changed.
	// 	pretxt = inpMat.message;
	// 	print("it is changed ",pretxt);
	// }

	// gui.add()
	// console.log("get dir: ",vec2.arrow)

	let ndir_v = new VecViz([3,1,7],[0,0,0]);
	let ldir_v = new VecViz([1,4,2],[0,0,0]);

	scene.add(ndir_v.arrow)
	scene.add(ldir_v.arrow)

	var spriteMap = new THREE.TextureLoader().load( "sprite.png" );
	var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
	var sprite = new THREE.Sprite( spriteMaterial );
	// sprite.name = "spritey";
	// scene.add( sprite );

	var spritey = makeTextSprite( " Hello, ",
		{ fontsize: 14, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
	spritey.position.set(5,4,3);
	spritey.name = "spritey";
	scene.add( spritey );


	// Rendering the Scene
	// renderer.render(scene,camera);
	// animate
	update(scene,camera,renderer,control,speed);
}

var alpha = 0;
var addit = 0.01;
function update(scene,camera,renderer,orbitctrl,speed){

	renderer.render(scene,camera);


	let box = scene.getObjectByName("box_mesh");

	// let npos = new THREE.Vector3([4,5,6]);
	// let vec = new VecViz([1,3,3]);
	// vec.dirVec.lerp(npos,alpha)
	// scene.add(vec.arrow);

	// box.rotation.y +=speed.speed;
	// alpha +=.01;

	// let alpha = speed.speed;
	alpha +=addit;

	if (alpha  > 1 || alpha< 0){addit*=-1}

	let vec2 = scene.getObjectByName("vec2");

	let fac = 0;
	let sprite = scene.getObjectByName("spritey");

	// console.log("inside update: ",vec2)
	let ndir = new THREE.Vector3(3,1,7);
	let ldir = new THREE.Vector3(1,4,2);

	ndir.lerp(ldir,alpha);

	sprite.position.set(ndir.x+0.4,ndir.y+0,ndir.z-1.2);

	vec2.setDirection(ndir.clone().normalize())
	vec2.setLength(ndir.length());

	// sprite.position.set(1,1,1)

	orbitctrl.update();

	requestAnimationFrame(function(){
		update(scene,camera,renderer,orbitctrl,speed);
	});
}

function matrixViz(M,scene){

	// dim of the matrix.
	let dim = 	{n:M.length,m:M[0].length};

	// now it becomes a threejs matrix
	let TJ_M =[];
	for(let i=0;i<dim.n;i++){
		let currVec = new VecViz(M[i]);
		TJ_M.push(currVec);
		console.log(currVec);
		scene.add(currVec.arrow);
	}

	// return TJ_M;
}

function dotProd(a,b){
	// this is the value of the matrix that we want b but we need to decompose it in to single time step
	return 	a.dot(b);
}

function GaussElemViz(M){
	let opframs = [];

	let curMat = M;
	for (let i=0;i<M.length;i++){
	}
}
function MatrixAnimate(marr){
// where marr is the array of matrix at every time step.
// Plan: show the matrix of the corrosponding time step.

}
function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	// var spriteAlignment = THREE.SpriteAlignment.topLeft;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness/4;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 0);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	//alignment: spriteAlignment

	var spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture, useScreenCoordinates: false,color:0xffffff } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(3*1,3*.5,-5.0);
	return sprite;
}


// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
}

function arr2Vec(a){

	let	vec = new THREE.Vector3(a[0],a[1],a[2]);
	return	vec; 

}

function SpanViz(M,scene){
	let span_geo = new THREE.PlaneGeometry(3,3);
	let span_mat = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
	let span_mesh = new THREE.Mesh(span_geo,span_mat);

	scene.add(span_mesh);
}

function columnSpaceViz(M,b,scene){
	// M = Matrix
	// b = answer vector i.e, place where it intersects

	matrixViz(M,scene)

	// represent the b vector as a point in 3d space
	let point_dir = new THREE.Vector3(b);

	let point_geo = new THREE.SphereGeometry(point_dir);
	let point_mat = new THREE.MeshBasicMaterial();
	let point_mesh = new THREE.Mesh(point_geo,point_mat);

	scene.add(point_mesh);
}

function addvecViz(v1,v2){
	// visualization of subtracting 2 vectors
	let addVec_dir = v1.dirVec.clone().add(v2.dirVec);
	let addVec_vec = new VecViz(vec2arr(addVec_dir),vec2arr(v2.dirVec));
	return addVec_vec;

}

function subvecViz(v1,v2,color=0x00ff00){
	// visualization of subtracting 2 vectors
	let subVec_dir = v1.dirVec.clone().sub(v2.dirVec);
	let subVec_vec = new VecViz(vec2arr(subVec_dir),vec2arr(v2.dirVec),color);

	return subVec_vec;
}

function vec2arr(v){return[v.x,v.y,v.z];};
init();

function spd(k){this.speed = k;};

function matrix(dir){

}

function VecViz(direction,origin=(0,0,0),color=0x00ff00){

	this.originVec = new THREE.Vector3(origin[0],origin[1],origin[2]);
	this.dirVec    = new THREE.Vector3(direction[0],direction[1],direction[2]);

	this.arlen = this.dirVec.length();
	this.arrow = new THREE.ArrowHelper(this.dirVec.clone().normalize(),this.originVec,1, color);

	this.arrow.setLength(this.arlen,this.arlen/10,this.arlen*.04);
	// this.arrow.line.material.linewidth = this.arlen*1;

	this.getArrow = function() { return this.arrow};
	this.getDir = function(){return this.dirVec};
	this.getOrigin = function(){return this.originVec};

}
function setup(){
	canvas = createCanvas(100, 300);
	canvas.parent("sketch");

	background(0)
	noLoop();
}