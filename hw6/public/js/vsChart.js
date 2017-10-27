/** Class implementing the tileChart. */
class voteShiftChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let voteShift = d3.select("#vsChart").classed("fullView", true);
        this.margin = {top: 30, right: 500, bottom: 90, left: 100, padding: 20};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = voteShift.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;

        this.svg = voteShift.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");

        let legendHeight = 300;
        let legendWidth = 150;
        let legendPosX= this.svgWidth - this.margin.right
        //legend
        this.legendSvg = this.svg.append("g")
                            .attr("width",legendWidth)
                            .attr("height",legendHeight)
                            .attr('id','stateLegend')
                            .attr("transform", "translate(" + legendPosX + ",0)")

        this.svg.append('g')
                .attr('id','yearAxis');  
        this.svg.append('g')
                .attr('id','shiftAxis');

        let textbuffery = this.svgHeight - this.margin.bottom/2; 
        let textbufferx = (this.svgWidth-this.margin.right - this.margin.left )/2;         
        this.svg.append('text')
                .attr('class','yeartext')
                .attr("transform", "translate(" + textbufferx + ","+ textbuffery +")")
                .text('year');

        this.svg.append('text')
                .attr('class','yeartext')
                .attr("transform", "translate(" + this.margin.left/2 + ","+ this.svgHeight/2+") rotate(-90)")
                .text('Voter Shift Percentage'); 

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
            if(row[1]>0)
                text += "<li class = " + this.chooseClass(row[1])+ ">" + row[0]+":\t\t shift toward Republican "+row[1]+"%" + "</li>"
            else if(row[1]<0)
                text += "<li class = " + this.chooseClass(row[1])+ ">" + row[0]+":\t\t shift toward Democrat "+ (-1*row[1])+"%" + "</li>"
            else
                text += "<li class = " + this.chooseClass(row[1])+ ">" + row[0]+":\t\t no shift" + "</li>"
        
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

            console.log(this.stateData);   
            let color = d3.scaleOrdinal()
                          .domain(this.stateData)
                          .range(d3.schemeCategory20);

            let aLineGenerator = d3.line()
                                .x((d) => xScale(d[0]))
                                .y((d) => yScale(d[1])); 
            
            let lines = this.svg.selectAll('.shiftLine').data(stateGroup);

            lines.exit().remove();

            lines = lines.enter().append('path').merge(lines);

            lines.attr('d',(d)=>{ return aLineGenerator(d.value);})
                 .attr('stroke',(d)=>{ return color(d.key); })
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

            //Draw Legend
            let legendQuantile = d3.legendColor()
                                .scale(color);

            this.legendSvg.call(legendQuantile);                   
            
        }
        else{        
            console.log('There is no state data'); 
            return ;
        }        
    
    };


}
