/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        // ******* TODO: PART I *******
        // Create the x and y scales; make
        // sure to leave room for the axes

        //get boundary from node
        let svgBounds = d3.select("#barChart").node().getBoundingClientRect();
        let xbuffer = 100;
        let ybuffer = 70;

        let widthRange= svgBounds.width - xbuffer;
        let heightRange = svgBounds.height - ybuffer;
        let padding = 2;

        let years = this.allData.map(function (d) {return d.year}).sort();

        //x scales, depends on years
        let rMinX = 0;
        let rMaxX = widthRange;
        let xScale = d3.scaleBand().domain(years).range([rMinX, rMaxX]);

        //y scale
        let minY = 0;
        let maxY = d3.max(this.allData,
            function (d) {
                return d[selectedDimension]
            });
        let rMinY = 0;
        let rMaxY = heightRange;

        let yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([rMaxY, rMinY]) //reverse y value
            .nice();

        // Create colorScale
        let colorScale = d3.scaleLinear()
                            .domain([minY, maxY]) //according to y value
                            .range(['White', 'SteelBlue']);

        // Create the axes (hint: use #xAxis and #yAxis)
        let xAxis = d3.axisBottom().scale(xScale);
        let xAxis_pos = d3.select('#xAxis')
            .attr('transform', 'translate(' + xbuffer + ',' + heightRange + ')')
            .call(xAxis);

            xAxis_pos
            .selectAll('text')
            .attr('transform', 'translate(' + 15 + ', ' + 30 + ') rotate(90)');

        let yAxis = d3.axisLeft().scale(yScale);
        let yAxis_pos = d3.select('#yAxis')
            .transition()
            .duration(2500)
            .attr('transform', 'translate(' + xbuffer + ', 0)')
            .call(yAxis);

            yAxis_pos.selectAll('text')
                    .attr('visibility', function (d, i) {
                            if (i == yAxis_pos.selectAll('text').size() - 1) {
                                return 'hidden';
                            } else {
                                return 'visible';
                            }});

        // Create the bars (hint: use #bars)
        let barwidth = xScale.bandwidth() - padding;
        let bars = d3.select('#bars')
                        .attr('transform', 'translate(' + xbuffer + ', ' + 0 + ')')
                        .selectAll('rect')
                        .data(this.allData);

            bars = bars.enter().append('rect').merge(bars);

            bars
                .transition().duration(2500)
                .attr('x', function (d) {
                    return xScale(d.year) + padding
                })
                .attr('y', function (d) {
                    return yScale(d[selectedDimension])
                })
                .attr('width', barwidth)
                .attr('height', function (d) {
                    return heightRange - yScale(d[selectedDimension])
                })
                .style('fill', function (d) {
                    var self = d3.select(this);
                    if (!self.classed('selected')) {
                        return colorScale(d[selectedDimension]);
                    } else {
                        return 'OrangeRed';
                    }
                });    


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.
            bars.on("click", function (d){
                //reset all bars' color
                d3.select('#bars')
                .selectAll('.selected')
                .classed('selected', false)
                .style('fill', colorScale(d[selectedDimension]));

                //change the color of the selected bar 
                d3.select(this)
                    .classed('selected', true)
                    .style("fill", 'OrangeRed');
            });
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

        //Get selected choice
        var choice = document.getElementById('dataset').value;
        updateBarChart(choice);

    }
}