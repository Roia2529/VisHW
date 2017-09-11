/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	//var list = new Array(0);

	constructor(json) {
		
		this.list = [];
		var i=0;
		json.forEach( function(Entry) {
			// statements
			console.log(Entry['name']);
			var newnode = new Node(Entry['name'],Entry['parent']);
			//console.log("size:"+this.size);
			this.list[i++]=newnode;
		},this);

	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		
		for (var i = 0; i < this.list.length; ++i) {
			var tmpNode = this.list[i];
			//console.log("parent:"+tmpNode.name);
    		//if (tmpNode.parentName=="root") {
    			//root node for recursive function
    		//	this.root = tmpNode;
    		//}
    		for(var j = 0; j < this.list.length; j++){
    			if(this.list[j].parentName==tmpNode.name){
    				tmpNode.children.push(this.list[j]);
    				this.list[j].parentNode = tmpNode;
    			}
    		}

		}
	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
		
		this.assignLevel(this.list[0],0);
		//this.initialPosIndex();
		this.assignPosition(this.list[0],0);
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		//iterative function
		var level = -1;
		var pos = 0;
		var queue = [];
		queue.push(this.list[0]);
		while(queue.length>0){
			var tmpNode = queue.shift();
			if(tmpNode.level!=level){
				var par =tmpNode.parentNode; 
				pos = par==null? 0:Math.max(par.position,0);
				level = tmpNode.level;
			}
			tmpNode.position = pos++;
			var childlist = tmpNode.children;
			for(var i=0;i<childlist.length;i++){
				queue.push(childlist[i]);
			}
		}
		/*
		//recursive function
		node.position = position;
		var childlist = node.children;
		var posstart = Math.max(this.posindex[node.level+1],position);
		for(var i=0;i<childlist.length;i++){
			var tmpNode = childlist[i];
			this.assignPosition(tmpNode,i+posstart);
			
		}
		if (node.level<this.maxlevel){
			this.posindex[node.level+1]=posstart+childlist.length;
		}
		//end of recursive function
		*/
	}
	/**
	 * 
	 */
	/*
	initialPosIndex(){
		this.posindex = [];
		var i=0;
		while(i<=this.maxlevel){
			this.posindex[i++] = 0;
		}
	}
	*/
	/**
	 * Recursive function that assign levels to each node
	 */
	
	assignLevel(node, level) {
		
		node.level = level;
		var childlist = node.children;
		for(var i=0;i<childlist.length;i++){
			var tmpNode = childlist[i];
			this.assignLevel(tmpNode,level+1); 
		}
	}
	

	/**
	 * Function that renders the tree
	 */
	renderTree() {
		var body = d3.select("body");
		body.append("svg");
		 var svg = d3.select("svg");
		 svg
		 	.attr("height", 1200)
		 	.attr("width", 1200);

		 var xscale = 180;
		 var yscale = 110;
		 var xshift = 100;
		 var yshift = 100;
		 var radius = 44;
		 for(var i=0;i<this.list.length;i++){
			var tmpNode = this.list[i];

			tmpNode.children.forEach( function(Entry) {
				svg.append("line")
				.attr("x1",tmpNode.level*xscale+xshift)
				.attr("y1",tmpNode.position*yscale+100)
				.attr("x2",Entry.level*xscale+xshift)
				.attr("y2",Entry.position*yscale+yshift);
			
			},);

			svg.append("circle")
				.attr("cx",tmpNode.level*xscale+xshift)
				.attr("cy",tmpNode.position*yscale+yshift)
				.attr("r", radius);

			svg.append("text")
				.text(tmpNode.name)
				.attr("class","label")
				.attr("x",tmpNode.level*xscale+xshift)
				.attr("y",tmpNode.position*yscale+yshift);
		}
	}
		
}