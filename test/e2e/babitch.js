'use strict';

var BabitchGamePage = require('./page/game.js');

var page = null;

describe('Babitch : Choose player', function() {

	beforeEach(function() {
		page = new BabitchGamePage(browser);
	});

	it('should not display startButton', function() {
		expect(page.startButton.isDisplayed()).toBe(false);
	});

	it('should have 4 selectable players', function() {
		expect(page.playersLocation.count()).toBe(4);
	});

    it('should not display startButton without less than 4 selected players', function() {
        var playerLocation = page.getPlayerLocation(0);
        playerLocation.selectPlayer(0);
        expect(playerLocation.getPlayerName()).toBe('Adrien');
        expect(page.startButton.isDisplayed()).toBe(false);
    });

    it('should begin game with 4 different selected players', function() {
        var playerLocation1 = page.getPlayerLocation(0);
        playerLocation1.selectPlayer(0);
        expect(playerLocation1.getPlayerName()).toBe('Adrien');

		var playerLocation2 = page.getPlayerLocation(1);
		playerLocation2.selectPlayer(1);
		expect(playerLocation2.getPlayerName()).toBe('Antony');

		var playerLocation3 = page.getPlayerLocation(2);
		playerLocation3.selectPlayer(2);
		expect(playerLocation3.getPlayerName()).toBe('Aurelian');

		var playerLocation3 = page.getPlayerLocation(3);
		playerLocation3.selectPlayer(3);
		expect(playerLocation3.getPlayerName()).toBe('Benjamin');


  		expect(page.startButton.isDisplayed()).toBe(true);

		//Ugly $timeout e2e issue here :/
  		page.startButton.click();

  		expect(page.score.isDisplayed()).toBe(true);

  		// et de 0-0
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});
});

describe('Babitch : Game', function() {
	beforeEach(function() {
		page = new BabitchGamePage(browser);

		//Choose 4 players
		var playerLocation1 = page.getPlayerLocation(0);
		playerLocation1.selectPlayer(0);
		expect(playerLocation1.getPlayerName()).toBe('Adrien');

		var playerLocation2 = page.getPlayerLocation(1);
		playerLocation2.selectPlayer(1);
		expect(playerLocation2.getPlayerName()).toBe('Antony');

		var playerLocation3 = page.getPlayerLocation(2);
		playerLocation3.selectPlayer(2);
		expect(playerLocation3.getPlayerName()).toBe('Aurelian');

		var playerLocation3 = page.getPlayerLocation(3);
		playerLocation3.selectPlayer(3);
		expect(playerLocation3.getPlayerName()).toBe('Benjamin');

		//Begin a match
		page.startButton.click();

		browser.waitForAngular();
	}, 60000);

	//Defense goal
	it('should add a goal for the blue team if the blue defender goal',function() {
		var playerLocation = page.getPlayerLocation(3);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});


    it('should add a goal for the red team if the red defender goal',function() {
        var playerLocation = page.getPlayerLocation(0);
        playerLocation.goal();
        expect(page.firstTeamScore.getText()).toBe('1');
        expect(page.secondTeamScore.getText()).toBe('0');
    });

	//Defense CSC
	it('should add a goal for red team if the blue defender goal csc',function() {
		var playerLocation = page.getPlayerLocation(3);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	it('should add a goal for blue team if the red defender goal csc',function() {
		var playerLocation = page.getPlayerLocation(1);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	//Attack Goal
	it('should add a goal for the blue team if the blue attacker goal',function() {
		var playerLocation = page.getPlayerLocation(2);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	it('should add a goal for the red team if the red attacker goal',function() {
		var playerLocation = page.getPlayerLocation(0);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	//Attack CSC
	it('should add a goal for red team if the blue attacker goal csc',function() {
		var playerLocation = page.getPlayerLocation(2);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	it('should add a goal for blue team if the red attacker goal csc',function() {
		var playerLocation = page.getPlayerLocation(1);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	//Cancel a Goal
	it('should cancel last goal',function() {
		var cancelLastGoalButton = page.getCancelLastGoalButton(),
			optionButtion = page.getOptionButton();

		expect(cancelLastGoalButton.isDisplayed()).toBe(false);

		var playerLocation = page.getPlayerLocation(3);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');

  		optionButtion.click().then(function() {
  			browser.waitForAngular();
  		}).then(function () {
  			//Cancel the goal
			expect(cancelLastGoalButton.isDisplayed()).toBe(true);
			cancelLastGoalButton.click();

	  		//The button must be hidden
	  		expect(page.firstTeamScore.getText()).toBe('0');
	  		expect(page.secondTeamScore.getText()).toBe('0');
	  		expect(cancelLastGoalButton.isDisplayed()).toBe(false);
  		});
	});

	it('should propose to restart or to make a new game',function() {
		expect(page.theEnd.isDisplayed()).toBe(false);
		var playerLocation = page.getPlayerLocation(2);
		for(var i=0; i<10 ; i++) {
			playerLocation.goal();
		}
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('10');
  		expect(page.theEnd.isDisplayed()).toBe(true);
	});

	it('should start a new game',function() {
		var playerLocation = page.getPlayerLocation(2);
  		expect(page.score.isDisplayed()).toBe(true);
		for(var i=0; i<10 ; i++) {
			playerLocation.goal();
		}
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('10');
  		expect(page.theEnd.isDisplayed()).toBe(true);
  		page.theEndNewGame.click();
  		expect(page.score.isDisplayed()).toBe(false);

  		//Select adrien again
  		var playerLocation1 = page.getPlayerLocation(0);
		playerLocation1.selectPlayer(0);
		expect(playerLocation1.getPlayerName()).toBe('Adrien');
	});

});