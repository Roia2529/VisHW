/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******
        let stage = d3.select('#tree'); 
        let xmargin = 100;
        let ymargin = 10;
        stage.attr('transform','translate('+xmargin+','+ymargin+')');

        let height = 800;
        let width = 300;
        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([height, width]);

        //Create a root for the tree using d3.stratify();
         
        let root = d3.stratify()
                    .id(function(d) { return d.id; })
                    .parentId(function(d) {
                        let p = treeData[d.ParentGame] 
                        return p==undefined? '': p.id; })
                    (treeData);

        //root.x0 = height / 2;
        //root.y0 = 100;
        treemap(root);
        //Add nodes and links to the tree.
        let nodes = root.descendants(),
            links = root.descendants().slice(1);

        console.log(nodes);
        console.log(links); 

        let node = stage.selectAll('.node')
                  .data(nodes, function(d) {return d.id; });

        
        let nodeEnter = node.enter().append('g')
                  .attr('class', function(d){
                    return 'node';
                    //if(d.data.Wins=='0') return 'node';
                    //return 'winner';
                  })
                  .classed('winner', function(d){
                    if(d.data.Wins=='0') return false;
                    return true;
                  }) 
                  .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                  })
                  .attr('id',function(d){return d.id});

         // Add Circle for the nodes
          nodeEnter.append('circle')
              .attr('r', 5);

          // Add labels for the nodes
          nodeEnter.append('text')
              .attr("dy", ".35em")
              .attr("x", function(d) {
                  return d.children? -8 : 8;
              })
              .attr("text-anchor", function(d) {
                  return d.children? "end" : "start";
              })
              .text(function(d) { return d.data.Team; });
                  
        let link = stage.selectAll('.link')
                .data(links, function(d) { return d.id; });
        link.enter().append('path')
                .attr('class','link')
                .attr('id',function(d){
                    return d.parent.id+":"+d.id;
                })
                .attr('d',function(d){
                    return diagonal(d,d.parent);
                });

        function diagonal(s, d) {

            let path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`

            return path
        }                

       
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
    }
}
