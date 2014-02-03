'use strict';

var BabitchGamePage = require('./page/game.js');
var BabitchLivePage = require('./page/live.js');

var MultipageManager = function(browser) {

	var _this = this;

	this.switchToGamePage = function() {
		return browser.switchTo().window('game');
	};
	this.switchToLivePage = function() {
		return browser.switchTo().window('live');
	};

	browser.executeScript(function() {
		window.open(null, 'live');
		window.open(null, 'game');
	});

	_this.switchToGamePage().then(function() {
		browser.addMockModule('babitchServer', mockConfig);
		_this.gamePage = new BabitchGamePage(browser);
	});

	_this.switchToLivePage().then(function() {
		browser.addMockModule('babitchServer', mockConfig);
		_this.livePage = new BabitchLivePage(browser);
	});
};

var mockConfig = require('./mock/config.js');

var pageManager = null;

describe('Babitch : Choose player', function() {

	beforeEach(function() {
		pageManager = new MultipageManager(browser);
	});

	it('should display match if a match is selected', function() {
		pageManager.switchToGamePage().then(function() {
			pageManager.gamePage.startAGame();
		}).then(function() {
			return pageManager.switchToLivePage()
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 0');
		});
	});

	it('should display goal if goal', function() {
		pageManager.switchToGamePage()
			.then(function() {
				pageManager.gamePage.startAGame();

  				pageManager.gamePage.getPlayerLocation(3).goal();
		}).then(function() {
			return pageManager.switchToLivePage();
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 1');
		});
	});

	it('should display new game if current game is ended', function() {
		pageManager.switchToGamePage().then(function() {
			pageManager.gamePage.startAGame();
			for (var i = 0; i < 10; i++) {
				expect(pageManager.gamePage.getPlayerLocation(3).goal());
			}
		}).then(function() {
			return pageManager.switchToLivePage();
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 10');

			return pageManager.switchToGamePage();
		}).then(function() {
			pageManager.gamePage.restartButton.click();

			return pageManager.switchToLivePage();
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 0');
		});
	});

});