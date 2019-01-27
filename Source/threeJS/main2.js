
// var gui = new dat.GUI();    

var inpMatxt = function(){
    this.mat = "[[0,0,0],[1,1,1]";
}

function init(){
	let winSize=  [800,600];
	// winSize =[window.innerWidth,window.innerHeight] ;
	// winSize =[window.innerWidth*(2/3),window.innerHeight] ;

	// winSize = [1,1]
	// renderer need 2 things == 1=> scene and 2==> camera
	var scene  = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(35,winSize[0]/winSize[1],.1,1000);
	// camera position :-
	camera.position.z = 26.8;
	camera.position.y = 12.2;
	camera.position.x = 13.4;

	camera.rotation.x = -.4;

	// creating renderer and appending to the html div element
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor('rgb(050,050,050)');

	renderer.setSize(winSize[0],winSize[1]);
	document.getElementById("webgl").appendChild(renderer.domElement);


	var axis_helper = new THREE.AxisHelper(2);
	scene.add(axis_helper);

	var gridXZ = new THREE.GridHelper(20, 10,(0x006600), (0x006600));
	// gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	scene.add(gridXZ);
	var gridXY = new THREE.GridHelper(20, 10,(0x000066),  (0x000066) );
	gridXY.rotation.x = Math.PI/2;
	// scene.add(gridXY);
	var gridYZ = new THREE.GridHelper(20, 10,{color:0x660000}, {color:0x660000});
	gridYZ.rotation.z = Math.PI/2;
	// scene.add(gridYZ);

	// Oribt Control
	let control = new THREE.OrbitControls(camera,renderer.domElement);



	////////////// ADDING STUFF FROM HERE...

    // let v0 = new VecViz([2,4,9],"vecfromThreejs 0");
    // scene.add(v0.arrow)

	// ColumnSpaceViz([[2,-1],[1,1]],[2,3],[1,5],scene);


    update(scene,camera,renderer,control);

	// renderer.render(scene,camera)

}

let speed = 0;
function update(scene,camera,renderer){

	// scene.remove(cVector);

	// console.log(scene.getObjectByName("vecfromNode "+0))

	// Visualizing Viwer Node Output
	for(let i=0;i<ViewerNodeArray.length;i++){
		let currViewerNode = ViewerNodeArray[i];
		let cCoords = currViewerNode.output;

		// let cCoordsOrigin = currViewerNode.output[0];

		let cCoordsOrigin = [0,0,0];

		if (cCoords == undefined)continue;

		let vec2change = scene.getObjectByName("vecfromNode "+i);

		// console.log("CCORDS: ",cCoords);
		let vec_pos = new THREE.Vector3(cCoords[0],cCoords[1],cCoords[2]);
		let vec_origin = new THREE.Vector3(cCoordsOrigin[0],cCoordsOrigin[1],cCoordsOrigin[2]);

		if (vec2change != undefined ){// then its a new Vector and we need to create and add it to the scene.
			vec2change.setDirection(vec_pos.clone().normalize());
			vec2change.setLength(vec_pos.length());

			let thisVecCol = currViewerNode.nodeStripColor; 
			let c3 = new THREE.Color("rgb("+Math.floor(thisVecCol[0])+","+Math.floor(thisVecCol[1])+","+Math.floor(thisVecCol[2])+")");

			vec2change.setColor(c3);
		}
		else{
			// if the vec2change is undefined that means new ViewerNode is added so create a Vector for it!

				let cCoords = currViewerNode.output;
				let cCoordsOrigin = currViewerNode.output[0];
				console.log(cCoords)
				if (cCoords == undefined)cCoords = [0,0,0];

				console.log("CCORDS: ",cCoords);
				let cVector = new VecViz(cCoords,"vecfromNode "+i,cCoordsOrigin);
				
				scene.add(cVector.arrow);
		}
	}


	renderer.render(scene,camera);
	// speed+=.1;

	requestAnimationFrame(function(){
		update(scene,camera,renderer);
	});
}




init();


function vec2arr(v){return[v.x,v.y,v.z];};

function arr2Vec(a){

	let	vec = new THREE.Vector3(a[0],a[1],a[2]);
	return	vec; 

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


function VecViz(direction,vecname,origin=(0,0,0),color=0x00ff00){

	this.originVec = new THREE.Vector3(origin[0],origin[1],origin[2]);
	this.dirVec    = new THREE.Vector3(direction[0],direction[1],direction[2]);

	this.arlen = this.dirVec.length();
	this.arrow = new THREE.ArrowHelper(this.dirVec.clone().normalize(),this.originVec,1, color);

	this.arrow.setLength(this.arlen,this.arlen/10,this.arlen*.04);
	// this.arrow.line.material.linewidth = this.arlen*1;

	this.arrow.name = vecname;
	this.getArrow = function() { return this.arrow};
	this.getDir = function(){return this.dirVec};
	this.getOrigin = function(){return this.originVec};

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


function scaleVarr(varr,scaler){
	// for(let i=0;i<varr.length;i++){
		varr = [scaler[0]*varr[0],scaler[1]*varr[1]]
	// }
	return varr
}

function scaleMarr(Mat,scale){
	// let newMat = [];

	for(let i=0;i<Mat.length;i++){
		let currVec = Mat[i];
		Mat[i] = scaleVarr(currVec,scale);
		// newMat.push(Mat[i]);
	}
	return Mat;
}

function ColumnSpaceViz(A,x,b,scene){
	// Viz the Matrix "A"

	A = [[2,1],[-1,1]]
	matrixViz(A,scene);

	// Viz the resultant vector b
	let bvec = new VecViz(b,origin=[0,0,0],color=0xf0f000);

	// let newA = scaleMarr(A,x);
	let newA = [[4,3],[-3,3]];

	scene.add(bvec.arrow);

	console.log(newA);

	matrixViz(newA,scene);

	let cv = new VecViz(b,newA[0])
	scene.add(cv.arrow)

	let cv2 = new VecViz(b,newA[1])
	scene.add(cv2.arrow);

	// for( let i=0;i<newA.length;i++){
	// 	let currVec = new VecViz(b,newA[i]);
	// 	scene.add(currVec.arrow);
	// }
}