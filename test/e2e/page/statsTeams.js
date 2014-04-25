var BabitchStatsTeamsPage = function(browser) {
    browser.get(browser.baseUrl + '#/stats/teams?nobackend');
    this.navbarActive = $('ul.nav li.active');
    this.allStats = $$('.allStatsTeams tbody tr');
    this.selectStatd3 = $$('select.form-control option');
};

module.exports = BabitchStatsTeamsPage;
