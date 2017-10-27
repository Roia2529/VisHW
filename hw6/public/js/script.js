
        let votePercentageChart = new VotePercentageChart();

        let tileChart = new TileChart();

        let shiftChart = new ShiftChart();

        //original
        //let electoralVoteChart = new ElectoralVoteChart(shiftChart);

        //add for voteShift
        let vsChart = new voteShiftChart();
        let electoralVoteChart = new ElectoralVoteChart(shiftChart,vsChart);


        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners,vsChart);
            yearChart.update();
        });

        /*
        //original
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {
            let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners);
            yearChart.update();
        });
        */