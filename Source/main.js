/*
 * Done:
 * Refactoring the code!
 *  - Make all the vector array a numjs object for easier vector manipulution
 *  - make the nodes interaction System more cleaner! i.e, the dragging clicking etc. and also make the click functionality. along with the dragging and selecting the dots funcitonality.
 *  - make the node and the noodles(edges) individual so that you can modify them easily (like delete or add a connection etc.)
 *  - make the output dot display also general! just like input one
  if the dot selected already has a connected node then remove that node and add this one
 *  Create a Clear Dot System {Done!!}
 *   - create the dot based on number of input nodes this Node Supports for e.g. AddNode support 2 inputs  
 *  Vector nodes need support for explicit input text.
 *  Select the node by not dragging... but by selecting
 * 
 * TODO:
 *  take the zoom and origin shifting into account... in order to have a correct selecting and dragging experiance
 *  
 *  Cut the noodles using ctrl and line intersection. 
 *  Create add node button with specified type.
 *  delete node by ctrl clicking a node 
 *  Color the body not the strip
 *  initializing everything by (0,0,0);
 *  Use p53djs instead of threejs
 * 
 */


var NodeDim = [16*7,9*7];
var NodeCount =  0;
var margin = 30;
var zoomlvl = 1;

var NodeArray = [];
var EdgeArray = [];

// mouse Control variables
let lastmpos = [0,0];
let mdrage_start = 0;
let dragdist = [0,0];
let lastdragdist = [0,0];

let cpos = [0,0];


function fetch_node(fromthisnode,node,delornot){
// job:-
//      search node in nodelist and do the following operation using delornot

    nodelist = fromthisnode.childs
    for(let i=0;i<nodelist.length;i++){
        if (nodelist[i] == node){

            if (delornot){// remove or not?
                nodelist.splice(i,1)
                return null;
            }
            else return i;
        }
    }
}

mnode = 0;

var ViewerNodeArray = [];
var text1 = 0;
var gui;

var vector  = 0;
var NodeHUD;
var myvec;
var guiNode;

function setup(){

    var canvas = createCanvas(800,600);

    canvas.parent("#NodeSystem")

    // Initializing Nodes
    for(let i=0;i<NodeCount;i++) {
        let Nnode = new VectorNode(i,[50+ Math.random()*width-50,50+ Math.random()*height-50]);
        // Nnode.output = [Math.floor(random(0,10)),Math.floor(random(0,10)),Math.floor(random(0,10))];
        NodeArray.push(Nnode);
    }
    th = [20,20];
    gridsize = [width/th[0],height/th[1]];

    stroke(070,160,070,50);

    // // adding AddNode
    // let adnode = new AddNode(NodeArray.length,[100,100]);
    // NodeArray.push(adnode);

    // adding viewer node
    let viewernode1 = new ViewerNode(NodeArray.length,[width-150,300]);
    NodeArray.push(viewernode1);
    ViewerNodeArray.push(viewernode1);

    /* GRAPHICAL USER INTERFACE Initialization:- */

    gui = new dat.GUI();


    
    // let viewernode2 = new ViewerNode(NodeArray.length,200,300,1);
    // NodeArray.push(viewernode2);
    // ViewerNodeArray.push(viewernode2);

    var guiparams = function(){
        this.node = null;
        this.type = "Undefiend";
        this.id = "-1";
        this.col = [ 10,10,0];
    };

    guiNode = gui.addFolder("Node Parameters");
    guiAddingNodes = gui.addFolder("AddingNodes");

    myvec= new guiparams;

    guiNode.add(myvec,"type").listen();
    guiNode.add(myvec,"id").listen();
    guiNode.addColor(myvec,"col").name("color");


    myvec.node = NodeArray[1];
    vector = guiNode.addFolder("Vector");

    vector.closed = guiNode.closed = 0;



    var obj = { add:function(){ 
        AddingNodes('add');  
     }};

    guiAddingNodes.add(obj,'add').name("Addition");

    var obj = { add:function(){ 
        AddingNodes('subtract');  
     }};

    guiAddingNodes.add(obj,'add').name("Subtract");

    var obj = { add:function(){ 
        AddingNodes('viewer');  
     }};

    guiAddingNodes.add(obj,'add').name("Viewer");

    var obj = { add:function(){ 
        AddingNodes('scaler');  
     }};

    guiAddingNodes.add(obj,'add').name("Scaler");

    var obj = { add:function(){ 
        AddingNodes('vector');  
     }};

    guiAddingNodes.add(obj,'add').name("Vector");

    var obj = { add:function(){ 
        AddingNodes('multiply');  
     }};

    guiAddingNodes.add(obj,'add').name("Multiplication");

    var obj = { add:function(){ 
        AddingNodes('matrix');  
     }};

    guiAddingNodes.add(obj,'add').name("Matrix");

    background(100);
}

let nodeSelected;
let nodeClicked;

let lastnodesel;
let last2lastnodesel;


function draw(){
    background(060);
    bgrid();

    if(nodeClicked){
        strokeWeight(2)
        stroke(200);
        // if nodeIsClicked then draw the line from "nodeSelected" to current Position of Mouse.
        line( nodeSelected.NodeDotsOut[Outdotindex][0],nodeSelected.NodeDotsOut[Outdotindex][1],mouseX,mouseY);
        strokeWeight(0)
    }

    // console.log(keyCode)
    noStroke();
    fill(250);

    // myvec.node = NodeArray[2];
    // console.log(ViewerNodeArray[0].nodeStripColor);
    // display background grid

    if (lastnodesel != last2lastnodesel){

        // this is Selected;
        lastnodesel.isSelected = true;

        // refresh the gui
        myvec.id = lastnodesel.id;
        myvec.type = lastnodesel.type;
        myvec.col = lastnodesel.nodeStripColor;
        myvec.node = lastnodesel;

        console.log("yeyeyeyeyeyey");
        guiNode.remove(guiNode.__controllers[2]);

        guiNode.addColor(myvec.node,"nodeStripColor");


        guiNode.removeFolder(vector);   
        vector = guiNode.addFolder("Vector");
        vector.closed = 0;

        if (lastnodesel.category == "Information"){

            if (myvec.node.type == "Vector" || myvec.node.type == "Scaler"){
                Object.keys(myvec.node.output).forEach((key) => {
                    vector.add(myvec.node.output, key,-10,10,1);
                });
            }

        }
            if(last2lastnodesel)
            last2lastnodesel.isSelected = false;
            last2lastnodesel = lastnodesel;
    }

    if (lastnodesel != null){
    
        text("ID: "+lastnodesel.id+" type: "+ lastnodesel.type,10,height-10);

    }

    text("zoomlvl: "+zoomlvl+" drag: "+dragdist,10,height-30)
    stroke(0);
    fill(0);
    
    // // displaying the Nodes
    // for (let i=0;i<NodeArray.length;i++){
    //     NodeArray[i].eval();
    //     NodeArray[i].Display();
    //     // NodeArray[i].eval();
    // }

    push();
    translate(width/2,height/2);
    scale(zoomlvl,zoomlvl);
    translate(-width/2,-height/2);

    // translate(cpos[0],cpos[1]);

    // displaying Edges
    for(let i=0;i<EdgeArray.length;i++){
        let cedge = EdgeArray[i];
        // displaying the edge
        cedge.display();
    }

    // displaying the Nodes
    for (let i=0;i<NodeArray.length;i++){
        if(mdrage_start)
            NodeArray[i].updatePos(dragdist);

        NodeArray[i].eval();
        NodeArray[i].Display();
        // NodeArray[i].eval();
    }

    pop();
    // mdrage_start = 0;
    // if(lastnodesel)
    // ellipse(lastnodesel.pos.x,lastnodesel.pos.y,20*zoomlvl,20*zoomlvl)

    if(dragdist === lastdragdist)dragdist = [0,0];  

    lastdragdist = dragdist;
}

function AddingNodes(key){
    switch (key) {
        case 'add':

            console.log("Added AddNode");
            let newAddNode = new AddNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            NodeArray.push(newAddNode);
                
            break;
        case 'subtract':

            console.log("Added SubNode");
            let newSubNode = new SubNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            NodeArray.push(newSubNode);
                
            break;
    
        case 'viewer':

            console.log("Added ViewerNode");
            let newViewerNode = new ViewerNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]],1,0);
            ViewerNodeArray.push(newViewerNode);
            NodeArray.push(newViewerNode);
            break;
        
        case 'vector':

            console.log("Added Ordinary Vector");
            let newNode = new VectorNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            // newNode.output = [Math.floor(random(0,10)),np.array(Math.floor(random(0,10)),Math.floor(random(0,10))];
            NodeArray.push(newNode);
            break;

        case 'matrix':
            console.log("Added Matrix");
            let newMatrixNode = new MatrixNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            // newNode.output = [Math.floor(random(0,10)),np.array(Math.floor(random(0,10)),Math.floor(random(0,10))];
            NodeArray.push(newMatrixNode);
            break;

        case 'scaler':
            console.log("Added ScalerNode");
            let newScalerNode = new ScalerNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            NodeArray.push(newScalerNode);
            break;

        case 'multiply':
            console.log("Added MultNode");
            let newMultNode = new MultNode(NodeArray.length,[width - NodeDim[0],height-NodeDim[1]]);
            NodeArray.push(newMultNode);
            break;


        default:
            break;
    }
    return false;
}

function bgrid(){

    let th = [10,10];
    let gridsize = [width/th[0],height/th[1]];

    // stroke(070,070,180);
    stroke(070,160,070,080);
    strokeWeight(1);
    for(let i=1;i<th[1] && i<th[0];i++){
        line(0,i*gridsize[1],width,i*gridsize[1]);

        // if (i < height/gridsize[1])
        line(i*gridsize[0],0,i*gridsize[0],height);
    }
    stroke(0);
    strokeWeight(1);

    th = [20,20];
    gridsize = [width/th[0],height/th[1]];

    stroke(070,160,070,50);
    strokeWeight(1);
    for(let i=1;i<th[1] && i<th[0];i++){
        line(0,i*gridsize[1],width,i*gridsize[1]);

        // if (i < height/gridsize[1])
        line(i*gridsize[0],0,i*gridsize[0],height);
    }
    stroke(0);
    strokeWeight(1);
}






















/*
function keyTyped(){
    switch (key) {
        case 'a':

            console.log("Added AddNode");
            let newAddNode = new AddNode(NodeArray.length,[200,300]);
            NodeArray.push(newAddNode);
                
            break;
        case 's':

            console.log("Added SubNode");
            let newSubNode = new SubNode(NodeArray.length,[200,30]);
            NodeArray.push(newSubNode);
                
            break;
    
        case 'v':

            console.log("Added ViewerNode");
            let newViewerNode = new ViewerNode(NodeArray.length,[20,300],1,0);
            ViewerNodeArray.push(newViewerNode);
            NodeArray.push(newViewerNode);
            break;
        
        case 'o':

            console.log("Added Ordinary Vector");
            let newNode = new VectorNode(NodeArray.length,[20,300]);
            newNode.output = [Math.floor(random(0,10)),Math.floor(random(0,10)),Math.floor(random(0,10))];
            NodeArray.push(newNode);
            break;

        case 'n':
            console.log("Added ScalerNode");
            let newScalerNode = new ScalerNode(NodeArray.length,[20,300]);
            NodeArray.push(newScalerNode);
            break;
        case 'm':
            console.log("Added MultNode");
            let newMultNode = new MultNode(NodeArray.length,[20,300]);
            NodeArray.push(newMultNode);
            break;
        default:
            break;
    }
    return false;
}

*/

function findordeledge(n1,i1,n2,i2,ford=0){

    for(let i=0;i<EdgeArray.length;i++){
        let cedge = EdgeArray[i];
        // console.log("skdfj",cedge.goingto.node === n2,cedge.goingto.index,i2)
        if ( cedge.goingto.node === n2 && cedge.goingto.dotindex === i2){
                // then remove this edge from nodearray
                console.log(
                    "Found IT!!"
                )
                if(ford == 1){
                    print("deleted")
                    EdgeArray.splice(i,1);
                }
                else return i;
            }
    }
    return -1;
}


function mouseWheel(event){
    console.log("Scrolling!!!",event.deltaY);

    let zoom = event.deltaY;

    if(zoom < 0){
        zoomlvl +=.01;
    }
    else{
        zoomlvl -= 0.01;
    }
    
}

let Isdragging = 0;// are you dragging a Node?
let dragNode   = null; // the Node that you are currently dragging.
function mouseDragged(){
// p5.js Function to Listen mouse Dragging. ( for selecting the node)

    if (Isdragging){
        dragNode.pos.x = mouseX;
        dragNode.pos.y = mouseY;
        lastnodesel = dragNode;
    }

    if (!nodeClicked){
        for(let i=0;i<NodeArray.length;i++){
                let dis = dist(mouseX,mouseY,NodeArray[i].pos.x,NodeArray[i].pos.y);
                if (dis < 50){
                    NodeArray[i].pos.x = mouseX;
                    NodeArray[i].pos.y = mouseY;
                    Isdragging = 1;
                    dragNode = NodeArray[i];
                }
            }
    }

    // drag the workspace
    if(clickedEmpty){
        console.log("entered here");
        if (!nodeClicked && !Isdragging && mdrage_start){
            let newmpos = [mouseX,mouseY];// new mouse pos
            let tmpdd = dragdist;
            console.log("Dragging",dragdist,cpos,lastmpos,newmpos);

            if(lastmpos[0]){
                dragdist[0] = -(1*(Math.floor(lastmpos[0] - newmpos[0])));
                dragdist[1] = -(1*(Math.floor(lastmpos[1] - newmpos[1])));

            }

            // if(dragdist[0] === tmpdd[0] && dragdist[0] === tmpdd[1])dragdist = [0,0];

            lastmpos = newmpos;
            cpos[0]  = dragdist[0];
            cpos[1]  = dragdist[1];

            cpos = dragdist;
            cursor("grab");
        }  
        mdrage_start = 1;
    }
}

function inside_cvs(p){
    if (p.mouseX < 0 || p.mouseY <0 || p.mouseX > p.width || p.mouseY > p.height)
    return false;

    return true;
}

function mouseReleased(){
    if( mdrage_start){
        console.log("OUT");
        mdrage_start = 0;

        dragdist = [0,0];
        lastmpos = [0,0];

        cpos = [0,0];
        // lastmpos[cpos[0],cpos[1]];
        cursor("default")
    }
}
function mouseClicked(){
// we are using mouseClicked explicity because it also ping when we stopped dragging... as it register mouse Press->mouseRelease as clicked
// which is usefull for stopping the dragging variable (i.e, by setting to isdragged to 1)
    console.log("clicked")
    if(Isdragging){
        Isdragging = 0;
        dragNode = null;
    }

    if (!nodeClicked){
        for(let i=0;i<NodeArray.length;i++){

                let dis = dist(mouseX,mouseY,NodeArray[i].pos.x,NodeArray[i].pos.y);
                if (dis < 50){
                    // Isdragging = 1;
                    lastnodesel = NodeArray[i];
                    dragNode = NodeArray[i];
                }
            }
    }
}

function doubleClicked(){
    console.log("this Works!!");
}
var clickedEmpty  = 0
var Outdotindex = 0;
function mousePressed(){
// TODO: first see which node is clicked then check which input dots was clicked specifically
    console.log("mousePressed")

    clickedEmpty = 1;// i.e, if we clicked an empty region then clickedEmpty ==1 else 0
   

    for(let i=0;i<NodeArray.length;i++){
        let thisnode = NodeArray[i];

        // if no output dot is selected then the select the node
        let dis4outdot = 0;
        for(let k=0;k<NodeArray[i].NodeDotsOut.length;k++){
            let currdot = NodeArray[i].NodeDotsOut[k];
            dis4outdot = dist(mouseX,mouseY,currdot[0],currdot[1]) < 20;  ///////////////////////// area of clicking In dot 
            if (dis4outdot) {Outdotindex = k;break;}
        }

        // let dis4indot  = dist(mouseX,mouseY,NodeDot(NodeArray[i],0).x,NodeDot(NodeArray[i],0).y);  ///////////////////////// area of clicking out dot

        // todo loop over all the output dots and see if any of them is pressed and fetch that dot index;

        // let selecteddotinindex = -1; 
        
        // lastnodesel = thisnode; 


        if (!nodeClicked) {
            if (dis4outdot){// if the position of mouse is near to a Node's dot then we clicked that Node's dot
                clickedEmpty = 0;
                console.log("selected",Outdotindex) ;
                // if the Node is clicked for the first time then make nodeClicked = 1
                nodeClicked=1;
                nodeSelected = NodeArray[i];
            }
        }

        else{

            // this section deals about the Connection between 2 nodes.

            for (let j=0;j<thisnode.NodeDotsIn.length;j++){
                let cdotpos = thisnode.NodeDotsIn[j];
                let dis = dist(mouseX,mouseY,cdotpos[0],cdotpos[1]);

                // TODO: Correct the Dot In and DOt Out links
                if( (dis < 20*zoomlvl)){
                // this is the code block which connect nodeSelected to this new Node that is been clicked.

                    if (NodeArray[i] != nodeSelected){
                        nodeClicked=0;// resetting

                        console.log("Node's Pair Selected",NodeArray[i].id  );

                        if (NodeArray[i].param[j] != -1){
                        // there is already a node attached to that goingto_node input dot then remove that and add this one
                        // then there is already a node attached to it 
                        // so remove it!

                            // fetch_node(NodeArray[i].param[j],NodeArray[i],1);// remove this node from the child node list of param input nodes

                            // TODO: Also remove the edge from edgeArray
                            console.log("yupp",NodeArray[i].id,j);
                            let nodelist = NodeArray[i].param[j].childs;
                            let delornot = 1;
                            let node = NodeArray[i];

                            findordeledge(NodeArray[i].param[j],0,NodeArray[i],j,1);

                            for(let k=0;k<nodelist.length;k++){
                                // console.log("logging childs ",NodeArray[i].id,NodeArray[i])
                                if (NodeArray[i].param[j].childs[k][0].id == node.id){

                                    if (delornot){// delete or not?
                                        console.log("is deleted!!");
                                        nodelist.splice(k,1);
                                        // return null;
                                    }
                                    // else return i;
                                }
                            }
                        }

                        // creating new Edge 
                        let current_edge = new Edge(nodeSelected,Outdotindex,NodeArray[i],j);

                        EdgeArray.push(current_edge);

                        // adding child and parent relations in Node
                        nodeSelected.addChild(NodeArray[i],j);

                        // adding parameter to goingto node
                        NodeArray[i].param[j] = nodeSelected;
                        // console.log("nodearray Param: ",NodeArray[i].id,NodeArray[i]);
                        nodeSelected = null;
                    }
                    break;
                }
            }
        }

    }

        // console.log("distance: ",dis)
    if(clickedEmpty){
        nodeClicked=0;
        // lastnodesel = nodeSelected;
        nodeSelected = null;
        console.log("clicked_Empty")
    }


}
