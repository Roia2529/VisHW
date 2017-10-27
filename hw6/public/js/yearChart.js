
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners, voteShiftChart) {
        this.voteShiftChart = voteShiftChart;
        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        this.dataForYears;    
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

       // ******* TODO: PART I *******  
    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
    let xScale = d3.scaleLinear()
            .domain([d3.min(this.electionWinners,function(t){return +t.YEAR}), d3.max(this.electionWinners,function(t){return +t.YEAR})])
            .range([this.margin.left, this.svgWidth-this.margin.left]);

    let circles = this.svg.selectAll('circle')
                        .data(this.electionWinners);
        circles.enter().append('circle')
                .attr('r', 15)
                .attr('cx',function(d){
                    let y = +d.YEAR;
                    return xScale(y);
                })
                .attr('cy',this.svgHeight/2)
                .attr('class',(d)=>{
                    return this.chooseClass(d.PARTY);
                });
    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements
    let texts = this.svg.selectAll('.yeartext')
                .data(this.electionWinners.map(d=>d.YEAR));
    texts.enter().append('text')
                  .attr('dy','2.0em')  
                  .attr("x", function(d) {
                      return xScale(+d);
                  })
                  .attr('y',this.svgHeight/2)
                  .attr('class','yeartext')
                  .text(function(d) { return d; });           
    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line
    let linesy = this.svgHeight/2;
    let lines = this.svg
                .append('line')
                .attr('x1', 0)
                .attr('x2', this.svgWidth)
                .attr('y1', linesy)
                .attr('y2', linesy)
                .attr('class', 'lineChart');
    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle
    let circlegroup = this.svg.selectAll('circle');

    circlegroup.on('click', (d,i)=>{
                    circlegroup.classed('selected',false);
                    let onecircle = circlegroup.filter(function(elm,j){return i == j;});
                                   
                    onecircle.classed('selected',true);
                    d3.csv('data/Year_Timeline_' + d.YEAR + '.csv', (error, electionResult)=> {
                    this.electoralVoteChart.update(electionResult, this.colorScale);
                    this.votePercentageChart.update(electionResult);
                    this.tileChart.update(electionResult, this.colorScale);
                    });
                });
    circlegroup
        .on('mouseover', function() {
            d3.select(this)
                .classed('highlighted', true);
        })
        .on('mouseout', function () {
            d3.select(this)
                .classed('highlighted', false);
        });
    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    let brushed = ()=>{
        console.log(d3.event.selection);
        if(d3.event.selection){
            let loc = d3.event.selection;
            let selectedYear = this.electionWinners.filter((d)=>{
                                let start = xScale(+d.YEAR)-15;
                                let end = start+30;
                                return start >= loc[0] && end <= loc[1];
                            })
                            .map((s)=>{return s.YEAR;});
            let self = this;                
            this.dataForYears = [];
            
            if(selectedYear.length>0)
                this.loadSeveralYear(selectedYear,0,self);
              
        }
    }


    var brush = d3.brushX().extent([[0,20],[this.svgWidth,this.svgHeight/2]]).on("end", brushed);
    this.svg.append("g").attr("class", "brush").call(brush);

    };


    loadSeveralYear(selectedYear,index,self){
        if(index==selectedYear.length){
            self.voteShiftChart.update(selectedYear,self.dataForYears);
            return ;
        }
            d3.csv('data/Year_Timeline_' + selectedYear[index] + '.csv',(d)=>{
                    if (d === undefined) {
                        console.log("unable to load file");
                    }
                    else{
                            d.forEach((c)=>{
                               self.dataForYears.push(c); 
                            });
                        self.loadSeveralYear(selectedYear,index+1,self);
                    }
                });
    }
};