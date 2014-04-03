var BabitchStatsPlayersPage = function(browser) {
    browser.get(browser.baseUrl + '#/stats/players?nobackend');
    this.navbarActive = $('ul.nav li.active');
    this.allStats = $$('.allStatsPlayers tbody tr');
    this.btnGroup = $$('.btn-group button');
};

module.exports = BabitchStatsPlayersPage;
