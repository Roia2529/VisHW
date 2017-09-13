/**
 * 
 */
document.getElementById("myButton").onclick = staircase;
document.getElementById("dataset").onchange = changeData;
document.getElementById("random").onchange = changeData;


/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */

function staircase() {
    // ****** TODO: PART II ******
    bcChildren = document.getElementById("barchart1").children;
    //console.log(document);
    for (var i = bcChildren.length - 1; i >= 0; i--) {
        bcChildren[i].setAttribute("height", (i*10).toString());
    }
    //barchart1
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);


    // ****** TODO: PART III (you will also edit in PART V) ******
    console.log(error); //null
    // TODO: Select and update the 'a' bar chart bars
    
    let bc1 = d3.select("#barchart1");
    let bcrect1 = bc1.selectAll("rect").data(data);
    let newbcrect1 = bcrect1.enter().append("rect")
                    .attr("x", function(d,i){
                        return iScale(i)
                    })
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height",5)
                    .style("opacity", 0)
                    .classed("barChart", true);
    //remove old data                
    bcrect1.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();
    //merge        
    bcrect1 = newbcrect1.merge(bcrect1);                  

    //update
    bcrect1.transition()
                .duration(3000)
                .attr("x", function(d,i){
                        return iScale(i)
                })
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", function (d){
                    return aScale(d.a)
                })
                .style("opacity", 1);
                //.classed("barChart", true);
    //
    // TODO: Select and update the 'b' bar chart bars
    
    let bc2 = d3.select("#barchart2");
    let bcrect2 = bc2.selectAll("rect").data(data);
    let newbcrect2 = bcrect2.enter().append("rect")
                    .attr("x", function(d,i){
                        return iScale(i)
                    })
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height",5)
                    .style("opacity", 0)
                    .classed("barChart", true);
    //remove old data                
    bcrect2.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();
    //merge        
    bcrect2 = newbcrect2.merge(bcrect2);                  

    //update
    bcrect2.transition()
                .duration(3000)
                .attr("x", function(d,i){
                        return iScale(i)
                })
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", function (d){
                    return bScale(d.b)
                })
                .style("opacity", 1);

    // TODO: Select and update the 'a' line chart path using this line generator
    let emptyLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => 50);

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    let linec1 = d3.select("#linechart1");
    let path1 = linec1.selectAll("path").data(data);
    let newpath1 = path1.enter().append("path")
                    //.attr("d",emptyLineGenerator(data))
                    .style("opacity", 0)
                    .classed("lines", true);

        path1.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

    //merge        
    path1 = newpath1.merge(path1);          

    path1.transition()
        .duration(3000) // 3 seconds
        .attr("d",aLineGenerator(data))
        .style("opacity", 1);

    // TODO: Select and update the 'b' line chart path (create your own generator)
    
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));

    let linec2 = d3.select("#linechart2");
    let path2 = linec2.selectAll("path").data(data);
    let newpath2 = path2.enter().append("path")
                    .style("opacity", 0)
                    .classed("lines", true);

    path2.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

    //merge        
    path2 = newpath2.merge(path2);          

    path2.transition()
        .duration(3000) // 3 seconds
        .attr("d",bLineGenerator(data))
        .style("opacity", 1);                


    // TODO: Select and update the 'a' area chart path using this area generator
    
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    let areaC1 = d3.select("#Areachart1");
    let area1 = areaC1.selectAll(".areas").data(data);
    let newarea1 = area1.enter().append("path")
                    .style("opacity", 0)
                    .classed("areas", true);

    area1.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

    //merge        
    area1 = newarea1.merge(area1);          

    area1.transition()
        .duration(3000) // 3 seconds
        .attr("d",aAreaGenerator(data))
        .style("opacity", 1);


    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    let areaC2 = d3.select("#Areachart2");
    let area2 = areaC2.selectAll(".areas").data(data);
    let newarea2 = area2.enter().append("path")
                    .style("opacity", 0)
                    .classed("areas", true);

    area2.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

    //merge        
    area2 = newarea2.merge(area2);          

    area2.transition()
        .duration(3000) // 3 seconds
        .attr("d",bAreaGenerator(data))
        .style("opacity", 1);

    // TODO: Select and update the scatterplot points
    let Scat = d3.select("#Scatter");
    let Scatdata = Scat.selectAll("circle").data(data);
    let newScat = Scatdata.enter().append("circle")
                    .attr("cx",15)
                    .attr("cy",15)
                    .attr("r",5)
                    .style("opacity", 0);
    Scatdata.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

    Scatdata = newScat.merge(Scatdata);
    Scatdata.transition()
            .duration(3000)
            .attr("cx",function(d){
                return aScale(d.a)
            })
            .attr("cy",function(d){
                return bScale(d.b)
            })
            .attr("r",5)
            .style("opacity", 1); 


    // ****** TODO: PART IV ******

}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}

