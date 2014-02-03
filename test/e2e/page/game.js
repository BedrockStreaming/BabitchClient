var BabitchGamePage = function(browser) {
	browser.get(browser.baseUrl + '/?nobackend');

	this.startButton = $('#actionStart button');
	this.restartButton = $$('.the-end  button').get(0);
	this.playersLocation = $$('.seat-layer');
	this.score = $('.score');
	this.firstTeamScore = $$('.score strong').get(0);
	this.secondTeamScore = $$('.score strong').get(1);

	this.getPlayerLocation = function(locationIndex) {
		return new PlayerLocationElement(browser, $$('#match .seat').get(locationIndex));
	};

	this.getCancelLastGoalButton = function() {
		$('.action .btn-group button').click();

		return $('.cancel-last-goal');
	};

	this.startAGame = function() {
		this.getPlayerLocation(0).selectPlayer(0);
		this.getPlayerLocation(1).selectPlayer(1);
		this.getPlayerLocation(2).selectPlayer(2);
		this.getPlayerLocation(3).selectPlayer(3);

		this.startButton.click();
  	};
};

var PlayerLocationElement = function(browser, playerLocation) {
	this.playerLocation = playerLocation;

	this.click = function() {
		this.playerLocation.findElement(by.css('.seat-layer')).click();
	};

	this.selectPlayer = function(playerIndex) {
		this.click();
		$$('.player-list div a').get(playerIndex).click();
	};

	this.getPlayerName = function() {
		return this.playerLocation.findElement(by.css('.player-name big')).getText();
	};

	this.goal = function() {
		this.click();
		$('.button.goal:not(.ng-hide)').click();
	};

	this.autogoal = function() {
		this.click();
		$('.button.autogoal:not(.ng-hide)').click();
	};
};

module.exports = BabitchGamePage;