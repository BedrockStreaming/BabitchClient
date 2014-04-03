'use strict';

var BabitchGamePage = require('./page/game.js'),
	BabitchLivePage = require('./page/live.js'),
	mockConfig      = require('./mock/config.js');

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



var pageManager = null;

describe('Babitch Live', function() {

	beforeEach(function() {
		pageManager = new MultipageManager(browser);
	});

	afterEach(function() {
		pageManager.switchToGamePage().then(function() {
			return browser.executeScript(function() {
				window.close();
			});
		}).then(function() {
			return pageManager.switchToLivePage()
		}).then(function() {
			return browser.executeScript(function() {
				window.close();
			});
		}).then(function() {
			return browser.getAllWindowHandles();
		}).then(function(handle) {
			return browser.switchTo().window(handle[0]);
		});
	})

	it('should display match if a match is selected', function() {
		pageManager.switchToGamePage().then(function() {
			return pageManager.gamePage.startAGame();
		}).then(function() {
			return pageManager.switchToLivePage()
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 0');
		});
	});

	it('should display goal if goal', function() {
		pageManager.switchToGamePage().then(function() {
			return pageManager.gamePage.startAGame();
		}).then(function() {
  			return pageManager.gamePage.getPlayerLocation(3).goal();
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
			return pageManager.gamePage.theEndRestartGame.click();
		}).then(function() {
			return pageManager.switchToLivePage();
		}).then(function() {
			return browser.sleep(2000);
		}).then(function() {
			var page = pageManager.livePage;
			expect(page.score.getText()).toBe('0 : 0');
		});
	}, 50000);

});
