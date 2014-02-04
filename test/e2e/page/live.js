var BabitchLivePage = function(browser) {
	browser.get(browser.baseUrl + '/?nobackend#/live');
	this.score = $('.score');
};

module.exports = BabitchLivePage;