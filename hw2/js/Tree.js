/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	//var list = new Array(0);

	constructor(json) {
		this.size = json.length;
		
		this.list = [];
		var jsonarray = json;
		var i=0;
		//this.list[0] = new Node(jsonarray[0]['name'],jsonarray[0]['parent']);
		jsonarray.forEach( function(Entry) {
			// statements
			//console.log(Entry['name']);
			var newnode = new Node(Entry['name'],Entry['parent']);
			//console.log("size:"+this.size);
			this.list[i++]=newnode;
		},this);

		this.maxlevel = 0;
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
		
		for (var i = 0; i < this.size; ++i) {
			var tmpNode = this.list[i];
    		if (tmpNode.parentName=="root") {
    			//root node for recursive function
    			this.root = tmpNode;
    		}
    		for(var j = 0; j < this.size; j++){
    			if(this.list[j].parentName==tmpNode.name){
    				//console.log("name:"+this.list[j].name);
    				tmpNode.children.push(this.list[j]);
    				this.list[j].parentNode = tmpNode;
    			}
    		}

		}
	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
		
		this.assignLevel(this.root,0);
		//this.initialPosIndex();
		this.assignPosition(this.root,0);
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		//iterative function
		var level = -1;
		var pos = 0;
		var queue = [];
		queue.push(this.root);
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
	initialPosIndex(){
		this.posindex = [];
		var i=0;
		while(i<=this.maxlevel){
			this.posindex[i++] = 0;
		}
	}
	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		if(level>this.maxlevel)
			this.maxlevel = level;
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
		 var svg = d3.select("svg");
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