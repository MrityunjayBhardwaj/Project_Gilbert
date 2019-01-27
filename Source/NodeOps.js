// This File Consist of all the Vector Operations that are going to performe by our Nodes

// TODO: Convert all the arrays into numjs object which act as the nearest thing to an actual vector/matrix

var NodeDim = [16*7,9*7];

function displaydotpos(edgepos,nodelen,dotCount){
// top_pos ,bot_pos = {x: ,y: }
// dotCount = number of dots

    // divide this length based on dot count
    let dotposArr = []; // array of all the dot position

    for (let i=0;i<dotCount;i++){
        /**
         *  1 (nodelen/2)*cnode
         *  2 (nodelen/3)*cnode
         **/
        let ax = edgepos.x;// because the x value will always be the same
        let ay = edgepos.y + (nodelen/(dotCount+1))*(i+1)

       dotposArr.push([ax,ay]);
    }

    return dotposArr;
}

function initparam(dotCount){let val=[];for(let i=0;i<dotCount;i++){val.push([-1]);};return val;}

var Node = function(id,pos,dotCountIn=1,dotCountOut=1){

    this.id = id;
    this.pos         = {x: pos[0],y:pos[1]}; // position of this Node on canvas
    this.opos        = {x: pos[0],y:pos[1]};
    this.isClicked   = false;
    this.childs      = [];  // array of nodes that take's this Node's output as there input.... so those nodes are like the child of this node in a sense that they use the gene(i.e, output) of this Node as there input along with the index of dot to connect to.
    this.param       = initparam(dotCountIn);// parameters used in the function of this Node
    this.output      = initparam(dotCountOut); // output (Evaluated) Value of this Node
    this.NodeDotsIn  = displaydotpos({x: this.pos.x - NodeDim[0],y: this.pos.y - NodeDim[1]},NodeDim[1],dotCountIn); // all the properties of all the node dots of input  
    this.NodeDotsOut = displaydotpos({x:this.pos.x  + NodeDim[0],y: this.pos.y + NodeDim[1]},NodeDim[1],dotCountOut); // all the properties of all the node dots of output  
    this.nodeStripColor = [100,100,100];
    this.type = 'information'; // type of the node
    this.category = "undefined";
    this.color = [0,100,0];
    this.isSelected = false;

    this.addChild = function(newNode,dotindex=0){
        this.childs.push([newNode,dotindex]);
    }

    this.addParam = function(newNode,index){
        // add parameter to this Node's Function
        this.param[index] = newNode;
    }
    this.updatePos = function(npos){
        this.pos = {x: this.pos.x+npos[0] , y: this.pos.y+npos[1]};
    }
    this.ViewOutput = function(){
        return this.output;
    }

    this.eval = function(){
        if (this.param.length == 0){
            // console.log("no Parameter Specified")
            return null
        }

    }

    this.guiNodeParameter = function(){

    }
    this.Display = function(){
        // this.NodeDots  = displaydotpos({x: this.pos.x - NodeDim[0]/2,y: this.pos.y -NodeDim[1]/2},NodeDim[1],dotCountIn); // all the properties of all the node dots  

        // recalculate displaydotposition
        this.NodeDotsIn  = displaydotpos({x: this.pos.x - NodeDim[0]/2,y: this.pos.y - NodeDim[1]/2},NodeDim[1],dotCountIn); // all the properties of all the node dots of input  
        this.NodeDotsOut = displaydotpos({x:this.pos.x  + NodeDim[0]/2,y: this.pos.y - NodeDim[1]/2},NodeDim[1],dotCountOut); // all the properties of all the node dots of output  


        /* Base Structure */
        fill(200,200,200,200);
        // noStroke();
        if (this.isSelected){
            stroke(200,200,0);
            strokeWeight(4);

        }
        rect(this.pos.x-(NodeDim[0]/2),this.pos.y-(NodeDim[1]/2),NodeDim[0],NodeDim[1],5,5);

        noStroke();
        /* Information Strip */
        fill(this.nodeStripColor[0],this.nodeStripColor[1],this.nodeStripColor[2]);// upper strip color

        rect(this.pos.x-(NodeDim[0]/2),this.pos.y-(NodeDim[1]/2),NodeDim[0],NodeDim[1]*.2,5,5,0,0);

        strokeWeight(2);
        stroke(0);
        fill(0);

        strokeWeight(0);
        stroke(200);
        fill(200);

        let charsize = 10
        text(this.type, this.pos.x-(NodeDim[0]/2)+charsize, this.pos.y-(NodeDim[1]/2)+charsize,)

        stroke(00);
        fill(00);

        // Drawing Output Values
        text("val: "+this.output,this.pos.x-(NodeDim[0]/2)+charsize,this.pos.y)
        strokeWeight(1);

        let dotrad = 10;

        for (let i=0;i<this.NodeDotsOut.length;i++){
            let cdotpos_out = this.NodeDotsOut[i];

            fill([0,255,0]);// green color
            ellipse(cdotpos_out[0],cdotpos_out[1],dotrad);
            stroke(0);
        }

        for (let i=0;i < this.NodeDotsIn.length;i++){
            let cdotpos = this.NodeDotsIn[i];

            fill([0,100,170]); // blue color
            ellipse(cdotpos[0],cdotpos[1],dotrad);
            stroke(0)

        }


    }

}


var Edge = function(node_cf=null,ind_cf=-1,node_gt=null,ind_gt=-1){

    this.comingfrom = {node: node_cf,dotindex: ind_cf};// index of comming from dot
    this.goingto    = {node: node_gt,dotindex: ind_gt}; // index f to the node where this "comming from" go to.

    this.display = function(){
    // displaying edges of nodes
        // print("edge: ",this.comingfrom.node.NodeDotsut[this.comingfrom.dotindex]);
        let comingfromdotpos = {x:this.comingfrom.node.NodeDotsOut[this.comingfrom.dotindex][0],y:this.comingfrom.node.NodeDotsOut[this.comingfrom.dotindex][1]};
        let goingtodotpos =    {x:this.goingto.node.NodeDotsIn[this.goingto.dotindex][0],y:this.goingto.node.NodeDotsIn[this.goingto.dotindex][1]};

        stroke(200);
        strokeWeight(2);

        // THE NOODLE!!
        line(comingfromdotpos.x,comingfromdotpos.y,goingtodotpos.x,goingtodotpos.y);

        // line(100,10,200,30)
        stroke(0);
        strokeWeight(1);
    }
}

function ScalerNode(a,posarr,d=0,w=1){
    Node.call(this,a,posarr,d,w);

    this.type     = "Scaler";
    this.category = "Information";
    // this.nodeStripColor = [0,100,200];
    this.output =  [2];

    this.eval = function(){
        // console.log("inside AddNOde");
        if (this.param.length == 0){
            return null
        }

    }

}

// inheriting from Node Class
ScalerNode.prototype = Object.create(Node.prototype);


function VectorNode(a,posarr,d=0,w=1){
    Node.call(this,a,posarr,d,w);

    this.type = "Vector";
    this.category = "Information";
    // this.nodeStripColor = [0,250,070];
    this.output =  [0,0,0];
    // this.output = [0,0,0];

    this.eval = function(){
        // console.log("inside AddNOde");
        if (this.param.length == 0){
            return null
        }
    }

}

// inheriting from Node Class
VectorNode.prototype = Object.create(Node.prototype);

function MatrixNode(a,posarr,d=0,w=1){
    Node.call(this,a,posarr,d,w);

    this.type = "Matrix";
    this.category = "Information";
    // this.nodeStripColor = [0,250,070];
    this.output = [[1,1,1],[1,1,1]];
    this.eval = function(){
        // console.log("inside AddNOde");
        if (this.param.length == 0){
            return null
        }

    }
}

// inheriting from Node Class
MatrixNode.prototype = Object.create(Node.prototype);


function ViewerNode(a,posarr,d=1,w=0){
// the Node which links  the three.js Viewer;

    Node.call(this,a,posarr,d,w);

    this.type = "Viewer";
    this.category = "Output";
    // this.nodeStripColor = [100,40,200];
    // this.output[0] = [0,0,0]
    // this.output[1] = [0,0,0]

    this.output = [0,0,0];

    this.eval = function(){
        
        // console.log(this.param)
        // if (this.param[0] != -1){
        //     this.output[0] = this.param[0].output // origin;
        // }

        // if (this.param[1] != -1)
        // this.output[1] = this.param[1].output

        if (this.param[0].type == "Scaler")
        this.output = [this.param[0].output[0],0,0] // Cheat: converting scaler to Vector for Visualizing
        
        // console.log(this.param[0].type);
        // if (this.param[0].type == "Vector")
        if (this.param[0] != -1)
        this.output = this.param[0].output 

        if (this.param[0].type == "Matrix")
        this.output = this.param[0].output[0]

        // this.param = [];
    }
}

ViewerNode.prototype = Object.create(Node.prototype);

function AddNode(a,posarr,d=2,w=1){
    Node.call(this,a,posarr,d,w);

    this.type = "Addition";
    this.category = "Operation";
    // this.nodeStripColor = [0,100,200];

    // this.param[0] = [0,0,0];
    // this.param[1] = [0,0,0];

    this.eval = function(){
        // console.log("inside AddNOde");
        if (this.param[0] == -1 || this.param[1] == -1 ){
            return null
        }


        // Error Handling
        // console.log(this.param[0].type,this.param[1].type,(this.param[0].type == this.param[1].type) != "Vector")
        if(this.param[0].type == this.param[1].type != "Vector"){
            // console.error("Invalid Node Input!\n both the input nodes should be of type \"Vector\"");
            // window.alert("Error!!");
            // return null;
        }

        this.output = nj.add(this.param[0].output,this.param[1].output).tolist();

    }


}

// inheriting from Node Class
AddNode.prototype = Object.create(Node.prototype);

function SubNode(a,k,d=2,w=1){
    Node.call(this,a,k,d,w);

    this.type = "subtract";
    this.category = "Operation";
    // this.nodeStripColor = [060,040,200];

    this.eval = function(){
        // console.log("inside addnode");
        if (this.param[0] == -1 || this.param[1] == -1){
            return null
        }

        // Error Handling
        if(this.param[0].type == this.param[1].type == "Vector"){
            console.error("Invalid Node Input!\n both the input nodes should be of type \"Vector\"");
        }

        this.output = nj.subtract(this.param[0].output,this.param[1].output).tolist();
    }

}


// inheriting from node class
SubNode.prototype = Object.create(Node.prototype);

// TODO: Make a clear Multiply node
function MultNode(a,k,d=2,w=1){
    Node.call(this,a,k,d,w);


    this.type = "Multiply";
    this.category = "Operation";
    // this.nodeStripColor = [080,070,100];
    this.output = [0,0,0]
    this.mult_type = 2; // 0 = dot 1 == cross 2 == element wise
    this.eval = function(){
        // console.log("inside multnode");
        if (this.param[1] == -1 || this.param[0] == -1){
            return null
            // window.alert("Invalid Configuration");
        }

        // cases: elemnt wise multiply
        if(this.mult_type == 2){
            if (this.param[0].type == "Scaler"){
                this.output = [this.param[1].output[0]*this.param[0].output[0],this.param[1].output[1]*this.param[0].output[0],this.param[1].output[2]*this.param[0].output[0]];
                return null; 
            }

            // if (this.param[0].type == "Vector")
            this.output = [this.param[1].output[0]*this.param[0].output[0],this.param[1].output[1]*this.param[0].output[1],this.param[1].output[2]*this.param[0].output[2]];

            // if (this.param[0].type == "Matrix")
            console.log("itz matrix")
        }

        if (this.mult_type == 0){// dot product first we need to check its dimensions

            // Cheat: output is a scaler... converting it to vector
            this.output = nj.dot(nj.array(this.param[0]),nj.array(this.param[1])).tolist();
            this.output = [this.output,0,0];
        }
    }

    this.exp_param = function(){
        // this function gives us the gui of all our desired exposed parameters.
    }
}

// inheriting from node class
MultNode.prototype = Object.create(Node.prototype);


/* Converter Nodes */
/*  Converter Nodes */

// function Matrix2Vec(){
// }