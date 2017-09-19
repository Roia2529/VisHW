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
        var svgBounds = d3.select("#barChart").node().getBoundingClientRect();
        var xleft = 100,
        var yup = 70;

        var widthbar= svgBounds.width - xleft,
        var heightbar = svgBounds.height - yup,
        var padding = 2;

        var years = this.allData.map(function (d) {return d.year}).sort();

        //x scales, depends on years
        var rMinX = 0;
        var rMaxX = widthbar;
        var xScale = d3.scaleBand().domain(years).range([rMinX, rMaxX]);

        //y scale
        var minY = 0;
        var maxY = d3.max(allWorldCupData,
            function (d) {
                return d[selectedDimension]
            });
        var rMinY = 0;
        var rMaxY = heightbar;

        var yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([rMaxY, rMinY])
            .nice();
        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

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
        let choice = document.getElementById('dataset').value;
        updateBarChart(choice);

    }
}