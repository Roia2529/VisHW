/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels
        let info = d3.select('#details');
        info.select('#edition').text(oneWorldCup.EDITION);
        info.select('#host').text(oneWorldCup.host);
        info.select('#winner').text(oneWorldCup.winner);
        info.select('#silver').text(oneWorldCup.runner_up);

        //all participating teams
        //unordered HTML list
        info.select('#teams').select('ul').remove();
        let teams = info.select('#teams')
                        .append('ul')
                        .selectAll('li')
                        .data(oneWorldCup.teams_names);

            teams.enter()
                 .append('li')
                 .text(function (d) {return d});                

    }

}