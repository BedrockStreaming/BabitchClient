var BabitchStatsGamesPage = function(browser) {
    browser.get(browser.baseUrl + '#/stats/games?nobackend');
    this.navbarActive = $('ul.nav li.active');
    this.lastGames = $$('.lastGames tbody tr');
};

module.exports = BabitchStatsGamesPage;
