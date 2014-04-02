'use strict';

var BabitchStatsPage = require('./page/stats.js');
var BabitchStatsGamesPage = require('./page/statsGames.js');
var BabitchStatsPlayersPage = require('./page/statsPlayers.js');
var BabitchStatsTeamsPage = require('./page/statsTeams.js');
var BabitchStatsPlayerPage = require('./page/statsPlayer.js');

var page = null;

describe('Babitch : Overall', function() {

    beforeEach(function() {
        browser.clearMockModules();
        page = new BabitchStatsPage(browser);
    });

    it('should be on overview tabs', function() {
        expect(page.navbarActive.getText()).toBe('Overview');
    });

    it('should display title', function() {
        expect(page.title.getText()).toBe('Babitch Stats');
    });

    it('should display topGoaler', function() {
        expect(page.overallStats.get(0).getText()).toBe('Top Goaler');
    });

    it('should display topVictory', function() {
        expect(page.overallStats.get(1).getText()).toBe('Top Victory');
    });

    it('should display topOwnGoal', function() {
        expect(page.overallStats.get(2).getText()).toBe('Top Own Goal');
    });

    it('should display topLooser', function() {
        expect(page.overallStats.get(3).getText()).toBe('Top Looser');
    });
});

describe('Babitch : Last Games', function() {

    beforeEach(function() {
        page = new BabitchStatsGamesPage(browser);
    });

    it('should be on Last Games tabs', function() {
        expect(page.navbarActive.getText()).toBe('Last Games');
    });

    it('should have a Last Games table with 3 games', function() {
        expect(page.lastGames.count()).toBe(3);
    });

    it('should have the last game first', function() {
        expect(page.lastGames.get(0).getText()).toBe('Gregory Kenny 9 : 10 Aurelian Nicolas C');
        expect(page.lastGames.get(1).getText()).toBe('Aurelian Florent L 3 : 10 Kenny Nicolas C');
        expect(page.lastGames.get(2).getText()).toBe('Florent L Gregory 6 : 10 Nicolas C Kenny');
    });
});

describe('Babitch : Stats Players', function() {

    beforeEach(function() {
        page = new BabitchStatsPlayersPage(browser);
    });

    it('should be on Player Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Player Stats');
    });

    it('should have a "All stats" table with 5 players', function() {
        expect(page.allStats.count()).toBe(5);
    });

    it('should load d3Charts', function() {
        expect( $$('svg').count()).toBe(0);

        //Click on the 1st button
        page.btnGroup.get(1).click();
        expect( $$('svg').count()).toBe(1);
    });
});

describe('Babitch : Stats Teams', function() {

    beforeEach(function() {
        page = new BabitchStatsTeamsPage(browser);
    });

    it('should be on Team Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Team Stats');
    });

    it('should have a "All stats" table with 5 teams', function() {
        expect(page.allStats.count()).toBe(5);
    });

    it('should load d3Charts', function() {
        expect( $$('svg').count()).toBe(0);

        //Click on the 1st button
        page.btnGroup.get(1).click();
        expect( $$('svg').count()).toBe(1);
    });
});

describe('Babitch : Player view', function() {

    beforeEach(function() {
        page = new BabitchStatsPlayerPage(browser);
    });

    it('should be on Player Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Player Stats');
    });

    it('should select the good player', function() {
        expect(page.name.getText()).toBe('Kenny');
    });

    it('should have a "team stats" table with 2 teams', function() {
        expect(page.allStatsTeams.count()).toBe(2);
    });

    it('should have a Last Games table with 3 games', function() {
        expect(page.lastGames.count()).toBe(3);
    });

    it('should load d3Charts', function() {
        expect( $$('svg').count()).toBe(0);

        //Click on the 1st button
        page.btnGroup.get(1).click();
        expect( $$('svg').count()).toBe(1);
    });

});
