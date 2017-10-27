   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart,electoralVoteChart){
        this.electoralVoteChart = electoralVoteChart;
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

        this.svg.append('text')
                .attr('class','electoralVotesNote');    
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
    
          // ******* TODO: PART II *******
    let  result = electionResult;
    result.sort((a,b)=>{
        return d3.ascending(+a.RD_Difference,+b.RD_Difference);
    });
    let  cScale = colorScale;      
    //console.log(result);
    
    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    let group = d3.nest()
                   .key(d=>{return d['State_Winner']})
                   .sortKeys((a,b)=>{
                       let keylist = ['I','D','R']; 
                     return keylist.indexOf(a)-keylist.indexOf(b);
                   })
                   .entries(result)
                   .map(function(g) { return g.values; }); 

    let grouplist = group.reduce( (a,b)=> a.concat(b),[] );

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    let sum = 0;
    grouplist.forEach((d)=>{
        d.x = sum;
        sum += +d.Total_EV;
    });

    let xScale = d3.scaleLinear()
        .domain([0, d3.sum(grouplist, function(d) { return +d.Total_EV; })])
        .range([0, this.svgWidth]);

    let bars = this.svg.selectAll('rect')
                        .data(grouplist);

    bars.exit().remove();
    // 
    bars = bars.enter().append('rect').merge(bars);
            bars
               .attr('x',(d)=>{
                    return xScale(d.x);
               })
               .attr('y',this.svgHeight/2) 
               .attr('width',(d)=>{return xScale(d.Total_EV)}) 
               .attr('height',32)
               .classed('electoralVotes',true)
               .attr('fill',(d)=>{
                if(d['State_Winner']==='I'){
                    return 'green';
                }
                else{
                    return cScale(d.RD_Difference);
                }
                });                             
    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    let threegroup = d3.nest()
            .key(d=>{return d['State_Winner']})
            .rollup((leaves)=> {
                let sum = d3.sum(leaves,function(l){return +l.Total_EV});
                let x = d3.min(leaves,function(l){return l.x});
                return {
                   "sum": sum,
                   "x": x,
                };
            })
            .entries(grouplist);

    let total = this.svg.selectAll('.electoralVoteText').data(threegroup);
    total.exit().remove();
    total = total.enter().append('text').merge(total);

            total.attr('dy','-.5em')  
                  .attr("x", (d) =>{
                      return d.key==='R'? this.svgWidth:xScale(d.value.x);
                  })
                  .attr('y',this.svgHeight/2)
                  .attr("text-anchor", (d)=> {
                        return d.key==='R'? "end" : "start";
                  })
                  .attr('class', (d) => { return 'electoralVoteText '+this.chooseClass(d.key); })
                  .text(function(d) { return d.value.sum; });

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    
    this.svg.selectAll('.middlePoint').remove();

    this.svg.append('line')   
        .attr('x1', this.svgWidth/2)
        .attr('x2', this.svgWidth/2)
        .attr('y1', 60)
        .attr('y2', this.svgHeight-30)
        .style('stroke', 'black')
        .attr('class', 'middlePoint');
    
    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element
    let needvote = Math.floor(0.5 * d3.sum(threegroup,function(l){return +l.value.sum})+1);

    let note = this.svg.selectAll('.electoralVotesNote');

    note.attr('class','electoralVotesNote')
        .attr("x", this.svgWidth/2)
        .attr("text-anchor",'middle')
        .attr('y', this.svgHeight/3)
        .text('Electoral Vote (' + needvote + ' needed to win)');
    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    let brushed = ()=>{
        //console.log(d3.event.selection);
        
        if(d3.event.selection){
            let loc = d3.event.selection;
            let selectedState = grouplist.filter((d)=>{
                                let start = xScale(d.x);
                                let end = start+xScale(d.Total_EV);
                                return start >= loc[0] && end <= loc[1];
                            })
                            .map((s)=>{return s.State;});
            this.shiftChart.update(selectedState);
            this.electoralVoteChart.updateStateData(selectedState);                
        }
        //else{
        //    this.shiftChart.update(selectedState);
        //}
    }


    var brush = d3.brushX().extent([[0,0],[this.svgWidth,this.svgHeight]]).on("end", brushed);
    this.svg.append("g").attr("class", "brush").call(brush);

    

    };

    
}
