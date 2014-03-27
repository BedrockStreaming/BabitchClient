var BabitchLivePage = function(browser) {
	browser.get(browser.baseUrl + '#/live?nobackend');
	this.score = $('.score');
};

module.exports = BabitchLivePage;
