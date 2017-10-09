/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = null; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        //this.tableElements = null;
        this.tableElements = teamData.slice(0,teamData.length); 
        //console.log(this.tableElements);
        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        this.goalScale = d3.scaleLinear()
            .domain([0, d3.max(this.teamData,function(t){return t.value["Goals Made"]})])
            .range([this.cell.buffer, this.cell.width *2]);

        this.gameScale = d3.scaleLinear()
            .domain([0, d3.max(this.teamData, function(d) {return d.value.TotalGames;})])
            .range([0, this.cell.width]);

        this.goalColorScale = d3.scaleQuantize()
            .domain([-1, 1])
            .range(['#cb181d', '#034e7b']); 

        this.aggregateColorScale = d3.scaleLinear()
            .domain([0, d3.max(this.teamData, function(d) {return d.value.TotalGames;})])
            .range(['#ece2f0', '#016450']);        

        let GoalAxis = d3.axisTop().scale(this.goalScale);
        d3.select('#goalHeader')
          .append('svg')
            .attr('width', 2 * this.cell.width+this.cell.buffer)
            .attr('height', this.cell.height+1)
          .append('g')
            .attr('transform', 'translate(0,' + this.cell.height + ')') 
            .call(GoalAxis);
   
        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {

        //console.log(this.tableElements);
        // ******* TODO: PART III *******
        //Create table rows
        let tbody = d3.select("#matchTable").select('tbody');

        let self = this;
        let tbodytr = tbody.selectAll('tr').data(this.tableElements)
                .enter()
                .append('tr')
                .attr('class',function(d){return d.value.type;})
                .on('click', function(d,i){self.updateList(i)});

        //Append th elements for the Team Names
        //Note: return []!!!
        tbodytr.selectAll('th')
               .data(function(trdata){
                    return[{ "key": trdata.key,
                            "type": trdata.value.type}];
                })
               .enter()
               .append('th')
               .text(function(d){
                    if(d.type === "aggregate")
                        return d.key;
                    else
                        return "x"+d.key;
               });
        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let rowtd = tbodytr.selectAll('td')
               .data(function(d){
                //console.log(d.value.Result.label);
             return[{ 'vis':'goalaxis', 'type':d.value.type, 'value': {'gMade':d.value["Goals Made"], 'gConcede': d.value["Goals Conceded"]}},
                        { 'vis':'text', 'type':d.value.type, 'value': d.value.Result.label},
                        { 'vis': 'bar', 'type':d.value.type, 'value': d.value.Wins},
                        { 'vis': 'bar', 'type':d.value.type, 'value': d.value.Losses},
                        { 'vis': 'bar', 'type':d.value.type, 'value': d.value.TotalGames}];
                })
               .enter()
               .append('td');

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )
        let barscale = this.gameScale;
        let barfillscale = this.aggregateColorScale; 
        let goalscale = this.goalScale;
        let goalcolor = this.goalColorScale;

        //Create diagrams in the goals column
        let allgoal = rowtd.filter(function (d) {
                        return d.vis == 'goalaxis'
                    });
        let goalvis = allgoal
                        .style('padding', 0)    
                        .append('svg')
                        .attr('width', 2 * this.cell.width+this.cell.buffer).attr('height', this.cell.height)
                        .append('g');
                        
        goalvis.append('rect')
               .attr('x',function(d){ return goalscale(Math.min(d.value.gMade,d.value.gConcede));})
               .attr('y',function(d){return d.type == 'aggregate'? 3:7})
               .attr('width',function(d){return Math.abs(goalscale(d.value.gMade)-goalscale(d.value.gConcede));})
               .attr('height',function(d){return d.type == 'aggregate'? 14:7})
               .style('fill',function(d){
                //console.log(d.value.gMade-d.value.gConcede);
                return goalcolor(+d.value.gMade-+d.value.gConcede);})
               .classed('goalBar', true);  
        
        goalvis.append('circle')
                .attr('cx',function(d){return goalscale(d.value.gMade);})
                .attr('cy',10)
                .classed('goalCircle', true)
                .style('fill', function(d) {return d.type == 'aggregate' ? '#364e74' : 'white';})
                .style('stroke', '#364e74');

        goalvis.append('circle')
                .attr('cx',function(d){return goalscale(d.value.gConcede);})
                .attr('cy',10)
                .classed('goalCircle', true)
                .style('fill', function(d) {return d.type == 'aggregate' ? '#be2714' : 'white';})
                .style('stroke', '#be2714');        

        //Set the color of all games that tied to light gray        
        let tiegames = goalvis.filter(function(d){return d.value.gMade==d.value.gConcede});
        tiegames.selectAll('circle')
                .style('fill', function(d){ return d.type== 'aggregate' ? 'gray' : 'white';})
                .style('stroke', 'gray');  

        //bar chart
        let allbar = rowtd.filter(function (d) {
                        return d.vis == 'bar'
                    });
        let barvis = allbar.style('padding-left', 0)
                        .append('svg')
                        .attr('width', this.cell.width).attr('height', this.cell.height);
                   
        barvis.append('rect')
              .attr('x',0)
              //.attr('y',5)
              .attr('width',function(d){return d.value==undefined? 0:barscale(d.value);})
              .attr('height',this.bar.height)
              .style('fill',function(d){return barfillscale(d.value);});

        barvis.append('text')      
              .text(function(d){return d.value;})
              .style('fill','white')
              .attr('y', this.cell.buffer-1)
              .attr('x', function(d) {
                    //console.log(d.value);
                    return d.value==undefined? 0:barscale(d.value - 1);
              });
        
        //Result column
        let Round = rowtd.filter(function(d){return d.vis=='text'}); 
        Round.attr('class','label').text(function(d){return d.value;}).attr('width',this.cell.width*2);

        

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
        //let newatableElement = this.tableElements;
        console.log(i);
        //console.log(this.tableElements);
        //Only update list for aggregate clicks, not game clicks
        if(i==undefined || this.tableElements[i].value.type !='aggregate') return;

        //expand
        if(this.tableElements[i+1]==undefined || this.tableElements[i+1].value.type=='aggregate'){
            let gameslist = this.tableElements[i].value.games;
            this.tableElements = this.tableElements.slice(0, i+1).concat(gameslist).concat(this.tableElements.slice(i+1));
        }
        //shrink
        else{
            this.tableElements = this.tableElements.slice(0, i+1).concat(this.tableElements.slice(i+1+this.tableElements[i].value.games.length));
        }
        d3.select('#matchTable').select('tbody').selectAll('tr').remove();
        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
