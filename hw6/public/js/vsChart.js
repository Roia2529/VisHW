/** Class implementing the tileChart. */
class voteShiftChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let voteShift = d3.select("#vsChart").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 90, left: 100};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = voteShift.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.svg = voteShift.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");
        this.svg.append('g')
                .attr('id','yearAxis');  
        this.svg.append('g')
                .attr('id','shiftAxis');
        this.stateData = [];
        this.years;
        this.yearsData;                           
    };

     /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2>" + tooltip_data.state + "</h2>";
        text +=  "Voter Shift: ";
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row[1])+ ">" + row[0]+":\t\t"+row[1]+"%" + "</li>"
        });
        text += "</ul>";

        return text;
    }

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party > 0){
            return "republican";
        }
        else if (party < 0){
            return "democrat";
        }
        else{
            return "independent";
        }
    }
    /**
     * Save a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    updateStateData(selectedStates){
        this.stateData = selectedStates;

    }
    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param years election data for the year selected
     */
    update (years,yearsData){
        //console.log(yearsData[0]);
        this.years = years;
        this.yearsData = yearsData;

        let xpadding = 0.2;
        let xScale = d3.scalePoint()
            .padding([xpadding])
            .domain(years)
            .range([0, this.svgWidth - this.margin.left - this.margin.right]);

        let xAxis = d3.axisBottom().scale(xScale);

        let xloc = this.svgHeight-this.margin.bottom; 
        this.svg.select('#yearAxis')
            .attr('transform', 'translate(' + this.margin.left + ',' + xloc + ')')
            .attr('class','yeartext')
            .call(xAxis);

        let dataForYears = [];

        
        if(this.stateData.length > 0){
            let chosenStateData = this.yearsData.filter((d)=>{
                                    return this.stateData.includes(d.State);
                                });
            //console.log(chosenStateData);

            let stateGroup = d3.nest()
                .key(d=>{return d.State})
                .rollup((leaves)=> {
                    let years = leaves.map((l)=>{
                                    return l.Year;
                                });
                    let shift = leaves.map((l)=>{
                                    let dir = l['Direction'];
                                    //if(dir=='Right') 
                                    return dir=='Right'? +l['Shift']:-1*l['Shift'];
                                });
                    let data = d3.zip(years,shift);
                    return data;
                })
                .entries(chosenStateData);

            console.log(stateGroup);

            let maxS = d3.max(stateGroup, (d)=> {
                return d3.max(d.value, (y)=>{
                    return y[1];
                })
            });
            let minS = d3.min(stateGroup, (d)=> {
                return d3.min(d.value, (y)=>{
                    return y[1];
                })
            });
            let yScale = d3.scaleLinear()
            //.domain([minS,maxS])
            .domain([-100,100])
            .range([0, this.svgHeight-this.margin.top - this.margin.bottom]);

            let yAxis = d3.axisLeft().scale(yScale);

            this.svg.select('#shiftAxis')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
                .attr('class','yAxis')
                .call(yAxis);

            let color = d3.scaleOrdinal(d3.schemeCategory20);
            let aLineGenerator = d3.line()
                                .x((d) => xScale(d[0]))
                                .y((d) => yScale(d[1])); 
            
            let lines = this.svg.selectAll('.shiftLine').data(stateGroup);

            lines.exit().remove();

            lines = lines.enter().append('path').merge(lines);

            lines.attr('d',(d)=>{ return aLineGenerator(d.value);})
                 .attr('stroke',(d,i)=>{ return color(i); })
                 .attr('transform', 'translate(' + this.margin.left + ',' + 0 + ')')
                 .attr('class','shiftLine'); 

            //tooltip
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('se')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                    
                    let tooltip_data = {
                        "state": d.key,
                        "result":d.value
                      };
                    return this.tooltip_render(tooltip_data);

                });

            this.svg.call(tip);
            
            lines.on('mouseover', tip.show)
                .on('mouseout', tip.hide);                
            
        }
        else{        
            console.log('There is no state data'); 
            return ;
        }        
    
    };


}
