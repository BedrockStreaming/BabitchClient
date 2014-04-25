var BabitchStatsGamePage = function(browser) {
    browser.get(browser.baseUrl + '#/stats/games/252?nobackend');
    this.navbarActive = $('ul.nav li.active');
    this.lastGames = $$('.tableGame tbody tr');
    this.timeline = $$('svg');
    this.timelineGoals = $$('svg circle');
};

module.exports = BabitchStatsGamePage;
