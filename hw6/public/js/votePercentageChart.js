/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

	        
	    this.svg.append('text')
                .attr('class','electoralVotesNote');   
		        

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */

	                 let tooltip_data = {
		                  "result":[
		                  {"nominee": d[3].D_Nominee_prop,"votecount": d[3].D_Votes_Total,"percentage": d[3].D_PopularPercentage,"party":"D"} ,
		                  {"nominee": d[3].R_Nominee_prop,"votecount": d[3].R_Votes_Total,"percentage": d[3].R_PopularPercentage,"party":"R"} ,
		                  {"nominee": d[3].I_Nominee_prop,"votecount": d[3].I_Votes_Total,"percentage": d[3].I_PopularPercentage,"party":"I"}
		                  ]
	                  };
	                return this.tooltip_render(tooltip_data);
	            });


   			  // ******* TODO: PART III *******
   			  
   			//column: D_PopularPercentage, R_PopularPercentage and I_PopularPercentage
		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.
		    let IPR = parseFloat(electionResult[0].I_PopularPercentage) || 0;
		    let DPR = parseFloat(electionResult[0].D_PopularPercentage) ;
		    let RPR = parseFloat(electionResult[0].R_PopularPercentage) ;

		    let party = ['I', 'D', 'R'];
		    let percentage = [IPR, DPR, RPR]
		    let sum = 0;
		    // since 'I' always start from 0
		    let x = [0].concat(percentage.map((d)=>{return sum+=d;}));

		    //column: 	d[0]	d[1]		d[2]		d[3]
		    //			party  percentage  xposition  electionResult
		    let grouplist = d3.zip(party,percentage,x,electionResult.slice(0, 3));

		    let xScale = d3.scaleLinear()
				        .domain([0, 100])
				        .range([0, this.svgWidth]);

			let bars = this.svg.selectAll('.votesPercentage')
                        .data(grouplist);

		    bars.exit().remove();
		    // 
		    bars = bars.enter().append('rect').merge(bars);
		            bars
		               .attr('x',(d)=>{
		                    return xScale(d[2]);
		               })
		               .attr('y',this.svgHeight/2) 
		               .attr('width',(d)=>{return xScale(d[1])}) 
		               .attr('height',35)
		               .classed('votesPercentage',true)
		               .attr('class',(d)=>{
		                	return this.chooseClass(d[0]);
		                });	        
		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary
	
		    let total = this.svg.selectAll('.votesPercentageText').data(grouplist);
		    total.exit().remove();
		    total = total.enter().append('text').merge(total);

            total.attr('dy','-.5em')  
                  .attr("x", (d) =>{
                      return d[0]==='R'? this.svgWidth-100: d[0]==='I'? 0:xScale(d[2])+100;
                  })
                  .attr('y',this.svgHeight/2)
                  .attr("text-anchor", (d)=> {
                        return d[0]==='R'? "end" : "start";
                  })
                  .attr('class', (d) => { return 'votesPercentageText '+this.chooseClass(d[0]); })
                  .text(function(d) { return d[1]===0? "":d[1]+"%"; });

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.
		    this.svg.selectAll('.middlePoint').remove();

		    this.svg.append('line')   
		        .attr('x1', this.svgWidth/2)
		        .attr('x2', this.svgWidth/2)
		        .attr('y1', this.svgHeight/2-30+18)
		        .attr('y2', this.svgHeight/2+30+18)
		        .style('stroke', 'black')
		        .attr('class', 'middlePoint');

		    let midtext = this.svg.selectAll('.electoralVotesNote');

		    midtext.attr("x", this.svgWidth/2)
		        .attr("text-anchor",'middle')
		        .attr('y', this.svgHeight/3)
		        .text('Popular Vote(50%)');    

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element
		    let candidate = [electionResult[0].I_Nominee,
		    				 electionResult[0].D_Nominee,
		    				 electionResult[0].R_Nominee];
		    let namepos = [0, 
		    				candidate[0]===''? 0 : this.svgWidth/4, 
		    				this.svgWidth]

		    let note = this.svg.selectAll('.votesPercentageNote')
		    			.data(d3.zip(party,candidate,namepos));

		    note.exit().remove();
		    note = note.enter().append('text').merge(note);

            note.attr('dy','-.5em')  
                  .attr("x", (d) =>{ return d[2];})
                  .attr('y',50)
                  .attr("text-anchor", (d)=> {
                        return d[0]==='R'? "end" : "start";
                  })
                  .attr('class', (d) => { return 'votesPercentageNote '+this.chooseClass(d[0]); })
                  .text((d)=> { return d[1]; });

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.
		    this.svg.call(tip)
		    
		    bars.on('mouseover', tip.show)
        		.on('mouseout', tip.hide);
		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}