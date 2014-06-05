'use strict';

var BabitchStatsGamesPage = require('./page/statsGames.js');
var BabitchStatsGamePage = require('./page/statsGame.js');
var BabitchStatsPlayersPage = require('./page/statsPlayers.js');
var BabitchStatsTeamsPage = require('./page/statsTeams.js');
var BabitchStatsPlayerPage = require('./page/statsPlayer.js');

var page = null;

describe('Babitch : Game view', function() {

    beforeEach(function() {
        browser.clearMockModules();
        page = new BabitchStatsGamePage(browser);
    });

    it('should have a Last Games table with 1 game', function() {
        expect(page.lastGames.count()).toBe(1);
    });

    it('should have the last game first', function() {
        expect(page.lastGames.get(0).getText()).toBe('Gregory Kenny 9 : 10 Aurelian Nicolas C');
    });

    it('should have a timeline with 19 goals', function() {
        expect(page.timeline.count()).toBe(1);


        browser.sleep(750)
            .then(function() {
                expect( page.timelineGoals.count()).toBe(19);
            });
    });
});

describe('Babitch : Last Games', function() {

    beforeEach(function() {
        page = new BabitchStatsGamesPage(browser);
    });

    it('should be on Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Stats');
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
        expect(page.navbarActive.getText()).toBe('Stats');
    });

    it('should have a "All stats" table with 5 players', function() {
        expect(page.allStats.count()).toBe(5);
    });

    it('should load d3Charts', function() {
        expect( $$('svg').count()).toBe(0);

        //Click on the 1st button
        page.selectStatd3.get(2).click();
        expect( $$('svg').count()).toBe(1);
    });
});

describe('Babitch : Stats Teams', function() {

    beforeEach(function() {
        page = new BabitchStatsTeamsPage(browser);
    });

    it('should be on Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Stats');
    });

    it('should have a "All stats" table with 5 teams', function() {
        expect(page.allStats.count()).toBe(5);
    });

    it('should load d3Charts', function() {
        expect( $$('svg').count()).toBe(0);

        //Click on the 1st button
        page.selectStatd3.get(2).click();
        expect( $$('svg').count()).toBe(1);
    });
});

describe('Babitch : Player view', function() {

    beforeEach(function() {
        page = new BabitchStatsPlayerPage(browser);
    });

    xit('should be on Stats tabs', function() {
        expect(page.navbarActive.getText()).toBe('Stats');
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
        page.selectStatd3.get(2).click();
        expect( $$('svg').count()).toBe(1);
    });
});
