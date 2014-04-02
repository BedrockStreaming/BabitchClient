var BabitchStatsPlayerPage = function(browser) {
    browser.get(browser.baseUrl + '#/stats/players/9?nobackend');
    this.navbarActive = $('ul.nav li.active');
    this.btnGroup = $$('.btn-group button');
    this.name = $('h1');
    this.allStatsTeams = $$('.allStatsTeams tbody tr');
    this.lastGames = $$('.lastGames tbody tr');
    this.btnGroup = $$('.btn-group button');
};

module.exports = BabitchStatsPlayerPage;
