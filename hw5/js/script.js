    /**
     * Loads in the table information from fifa-matches.json 
     */
    
//d3.json('data/fifa-matches.json',function(error,data){

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    /*
    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});
*/



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
 d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {
    let ranktable = {
        "Winner": 7,
        "Runner-Up": 6,
        'Third Place': 5,
        'Fourth Place': 4,
        'Semi Finals': 3,
        'Quarter Finals': 2,
        'Round of Sixteen': 1,
        'Group': 0
    };

    teamData = d3.nest()
            .key(function (d) {
                return d.Team;
            })
            .rollup(function (leaves) {
                let goalmade = d3.sum(leaves,function(l){return l["Goals Made"]});
                let goalconcede = d3.sum(leaves,function(l){return l["Goals Conceded"]});
                let deltagoals = goalmade - goalconcede;
                let wins = d3.sum(leaves,function(l){return l.Wins});
                let losses = d3.sum(leaves,function(l){return l.Losses});

                //Resutl
                let ranking = d3.max(leaves, function(l){return ranktable[l.Result]});
                let label;
                for(let l in leaves){
                    if(ranktable[l.Result]===ranking)
                        label = l.Result;
                }

                //games
                let games = leaves.map(function(l){
                    let value = {
                       "Goals Made": l["Goals Made"],
                       "Goals Conceded": l["Goals Conceded"],
                       "Delta Goals": [],
                       "Wins": [],
                       "Losses": [],
                       "Result": {"label": l.Result, "ranking": ranktable[l.Result]},
                       "type": "game",
                       "Opponent": l.Team,
                    };
                    return {"key": l.Opponent,
                            "value": value};
                });
                //
                //
                return {
                   "Goals Made": goalmade,
                   "Goals Conceded": goalconcede,
                   "Delta Goals": deltagoals,
                   "Wins": wins,
                   "Losses": losses,
                   "Result": {"label": label, "ranking": ranking},
                   "TotalGames": games.length,
                   "type": "aggregate",
                   "games": games
                }; 
            })
            .entries(matchesCSV);
     console.log(teamData);       
//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

//     // ******* TODO: PART I *******
//     //Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();


     });

 });
// // ********************** END HACKER VERSION ***************************
