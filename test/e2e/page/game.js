var BabitchGamePage = function(browser) {
	browser.get(browser.baseUrl + '/?nobackend');

	this.startButton = $('#actionStart button');
	this.theEnd = $('.the-end');
	this.theEndRestartGame = $$('.the-end button').get(0);
	this.theEndNewGame = $$('.the-end button').get(1);
	this.playersLocation = $$('.seat-layer');
	this.score = $('.score');
	this.firstTeamScore = $$('.score strong').get(0);
	this.secondTeamScore = $$('.score strong').get(1);
	this.restartButton = $$('.the-end  button').get(0);

	this.getPlayerLocation = function(locationIndex) {
		return new PlayerLocationElement(browser, $$('#match .seat').get(locationIndex));
	};

	this.getCancelLastGoalButton = function() {
		$('.action .btn-group button').click();

		return $('.cancel-last-goal');
	};

	this.startAGame = function() {
		var _this = this;

		return this.getPlayerLocation(0).selectPlayer(0).then(function() {
			return _this.getPlayerLocation(1).selectPlayer(1);
		}).then(function() {
			return _this.getPlayerLocation(2).selectPlayer(2);
		}).then(function() {
			return _this.getPlayerLocation(3).selectPlayer(3);
		}).then(function() {
			return _this.startButton.click();
		});
  	};
};

var PlayerLocationElement = function(browser, playerLocation) {
	this.playerLocation = playerLocation;
	var _this = this;
	this.click = function() {
		return this.playerLocation.findElement(by.css('.seat-layer')).click();
	};

	this.selectPlayer = function(playerIndex) {
		return this.click().then(function() {
			return $$('.player-list div a').get(playerIndex).click();
		});
	};

	this.getPlayerName = function() {
		return this.playerLocation.findElement(by.css('.player-name big')).getText();
	};

	this.goal = function() {
		return this.click().then(function() {
			return $('.button.goal:not(.ng-hide)').click();
		});
	};

	this.autogoal = function() {
		return _this.click().then(function() {
			return $('.button.autogoal:not(.ng-hide)').click();
		});
	};
};

module.exports = BabitchGamePage;