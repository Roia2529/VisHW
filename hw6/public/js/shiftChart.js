/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
        this.statelist = d3.select("#stateList")
                            .append('ul')
                            .attr('id','slist');
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates){
     
     // ******* TODO: PART V *******
    //Display the names of selected states in a list
    //console.log(selectedStates);
    let list = d3.select("#slist").selectAll('li').data(selectedStates);

    list.exit().remove();
    list = list.enter().append('li').merge(list);
                    
    list.text(function (d) {return d})
        .attr('class', 'brushtext'); 

    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };


}
