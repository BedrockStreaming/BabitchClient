'use strict';

var BabitchHomePage = require('./page/home.js');

var page = null;

describe('Babitch : Home', function() {

    beforeEach(function() {
        browser.clearMockModules();
        page = new BabitchHomePage(browser);
    });

    it('should display title', function() {
        expect(page.title.getText()).toBe('Babitch');
    });

    it('should display best elo ranking player', function() {
        expect(page.overallStats.get(0).getText()).toBe('Best Elo Ranking');
    });

    it('should display top goaler', function() {
        expect(page.overallStats.get(1).getText()).toBe('Top Goaler');
    });

    it('should display top victory player', function() {
        expect(page.overallStats.get(2).getText()).toBe('Top Victory');
    });

    it('should display the player who played the most', function() {
        expect(page.overallStats.get(3).getText()).toBe('Play the most');
    });

    it('should display worst elo ranking', function() {
        expect(page.overallStats.get(4).getText()).toBe('Worst Elo Ranking');
    });

    it('should display worst goaler', function() {
        expect(page.overallStats.get(5).getText()).toBe('Worst Goaler');
    });

    it('should display worst top looser', function() {
        expect(page.overallStats.get(6).getText()).toBe('Top Looser');
    });

    it('should display top own goal', function() {
        expect(page.overallStats.get(7).getText()).toBe('Top Own Goal');
    });
});
