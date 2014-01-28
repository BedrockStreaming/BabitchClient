'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Babitch : Choose player', function() {

	beforeEach(function() {
		browser().navigateTo('/?nobackend');
	});


	it('should automatically redirect to /', function() {
		expect(browser().location().url()).toBe("/");
	});

	it('should have a start button', function() {
		expect(element('#actionStart button').text()).toMatch('Start');
		expect(element('#actionStart').css('display')).toMatch('none');

	});

	it('should have 4 selectable players', function() {
		expect(element('.player-name').count()).toBe(4);
	});

	it('should not begin game without less than 4 selected players', function() {
		element('#match .seat-layer:eq(0)').click();
		element('.player-list div a:eq(0)').click();
		expect(element('.player-name:eq(0) big').text()).toBe('Adrien');
  		expect(element('.score').css('display')).toBe('none');

  		expect(element('#actionStart').css('display')).toMatch('none');
	});

	it('should begin game with 4 different selected players', function() {
		element('#match .seat-layer:eq(0)').click();
		element('.player-list div a:eq(0)').click();
		expect(element('.player-name:eq(0) big').text()).toBe('Adrien');

		element('#match .seat-layer:eq(1)').click();
		element('.player-list div a:eq(1)').click();
		expect(element('.player-name:eq(1) big').text()).toBe('Antony');

		element('#match .seat-layer:eq(2)').click();
		element('.player-list div a:eq(2)').click();
		expect(element('.player-name:eq(2) big').text()).toBe('Aurelian');

		element('#match .seat-layer:eq(3)').click();
		element('.player-list div a:eq(3)').click();
		expect(element('.player-name:eq(3) big').text()).toBe('Benjamin');


  		expect(element('#actionStart').css('display')).toMatch('block');

		//Ugly $timeout e2e issue here :/
  		element('#actionStart button').click();

  		expect(element('.score').css('display')).toBe('block');

  		// et de 0-0
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('0');
	});
});

describe('Babitch : Game', function() {

	beforeEach(function() {
		browser().navigateTo('/?nobackend');
		
		//Choose 4 players
		element('#match .seat-layer:eq(0)').click();
		element('.player-list div a:eq(0)').click();
		expect(element('.player-name:eq(0) big').text()).toBe('Adrien');

		element('#match .seat-layer:eq(1)').click();
		element('.player-list div a:eq(1)').click();
		expect(element('.player-name:eq(1) big').text()).toBe('Antony');

		element('#match .seat-layer:eq(2)').click();
		element('.player-list div a:eq(2)').click();
		expect(element('.player-name:eq(2) big').text()).toBe('Aurelian');

		element('#match .seat-layer:eq(3)').click();
		element('.player-list div a:eq(3)').click();
		expect(element('.player-name:eq(3) big').text()).toBe('Benjamin');

		//Begin a match
		element('#actionStart button').click();
	});

	//Defense goal
	it('should add a goal for the blue team if the blue defender goal',function() {
		element('#match .seat-layer:eq(3)').click();
		element('.button:eq(0)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('1');
	});

	it('should add a goal for the red team if the red defender goal',function() {
		element('#match .seat-layer:eq(0)').click();
		element('.button:eq(0)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('1');
  		expect(element('.score strong:eq(1)').text()).toBe('0');
	});

	//Defense CSC
	it('should add a goal for red team if the blue defender goal csc',function() {
		element('#match .seat-layer:eq(3)').click();
		element('.button:eq(2)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('1');
  		expect(element('.score strong:eq(1)').text()).toBe('0');
	});

	it('should add a goal for blue team if the red defender goal csc',function() {
		element('#match .seat-layer:eq(1)').click();
		element('.button:eq(2)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('1');
	});

	//Attack Goal
	it('should add a goal for the blue team if the blue attacker goal',function() {
		element('#match .seat-layer:eq(2)').click();
		element('.button:eq(0)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('1');
	});

	it('should add a goal for the red team if the red attacker goal',function() {
		element('#match .seat-layer:eq(0)').click();
		element('.button:eq(0)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('1');
  		expect(element('.score strong:eq(1)').text()).toBe('0');
	});

	//Attack CSC
	it('should add a goal for red team if the blue attacker goal csc',function() {
		element('#match .seat-layer:eq(2)').click();
		element('.button:eq(2)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('1');
  		expect(element('.score strong:eq(1)').text()).toBe('0');
	});

	it('should add a goal for blue team if the red attacker goal csc',function() {
		element('#match .seat-layer:eq(1)').click();
		element('.button:eq(2)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('1');
	});

	//Cancel a Goal
	it('should cancel last goal',function() {
		element('#match .seat-layer:eq(3)').click();
		element('.button:eq(0)').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('1');
		
		//The "cancel last goal" button must be visible after a goal
		expect(element('.action .btn-group ul li:eq(2) a').css('display')).toBe('block');
		expect(element('.action .btn-group ul li:eq(2) a').text()).toMatch('Cancel last goal');

		//Cancel the goal
		element('.action .btn-group ul li:eq(2) a').click();
  		expect(element('.score strong:eq(0)').text()).toBe('0');
  		expect(element('.score strong:eq(1)').text()).toBe('0');

  		//The button must be hidden
		expect(element('.action .btn-group ul li:eq(1)').css('display')).toBe('none');
	});

});