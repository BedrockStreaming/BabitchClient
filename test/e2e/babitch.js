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
		expect(element('.actionStart button').text()).toMatch('Start');
	});

	it('should have 4 select box', function() {
		expect(element('.players select').count()).toBe(4);
	});

	it('should not begin game without 4 selected players', function() {
		element('.actionStart :button').click();
  		expect(element('.score ul').css('display')).toBe('none');
	});
	it('should not begin game without less than 4 selected players', function() {
		using('li.blue.attack').select('player.player_id').option('0');
		using('li.blue.defense').select('player.player_id').option('1');
		using('li.red.attack').select('player.player_id').option('2');
		using('li.red.defense').select('player.player_id').option('?');

		element('.actionStart :button').click();

  		expect(element('.score ul').css('display')).toBe('none');
	});

	it('should begin game with 4 different selected players', function() {
		using('li.blue.attack').select('player.player_id').option('0');
		using('li.blue.defense').select('player.player_id').option('1');
		using('li.red.attack').select('player.player_id').option('2');
		using('li.red.defense').select('player.player_id').option('3');

		element('.actionStart :button').click();

		//Le score doit être affiché
  		expect(element('.score ul').css('display')).toBe('block');
  		// et de 0-0
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
  		expect(element('.score ul li:eq(1)').text()).toBe('0');
	});

	

});

describe('Babitch : Game', function() {

	beforeEach(function() {
		browser().navigateTo('/?nobackend');
		
		//Choose 4 players
		using('li.blue.attack').select('player.player_id').option('0');
		using('li.blue.defense').select('player.player_id').option('1');
		using('li.red.attack').select('player.player_id').option('2');
		using('li.red.defense').select('player.player_id').option('3');

		//Begin a match
		element('.actionStart :button').click();
	});

	//Defense goal
	it('should add a goal for the blue team if the blue defender goal',function() {
		var player = {team: "blue", position: "defense", player_id: 1};
		using('li.blue.defense').element(':button:eq(0)').click(player);
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
	});

	it('should add a goal for the red team if the red defender goal',function() {
		var player = {team: "red", position: "defense", player_id: 3};
		using('li.red.defense').element(':button:eq(0)').click(player);
  		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('0');
	});

	//Defense CSC
	it('should add a goal for red team if the blue defender goal csc',function() {
		using('li.blue.defense').element(':button:eq(1)').click();
  		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('0');
	});

	it('should add a goal for blue team if the red defender goal csc',function() {
		using('li.red.defense').element(':button:eq(1)').click();
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
	});

	//Attack Goal
	it('should add a goal for the blue team if the blue attacker goal',function() {
		var player = {team: "blue", position: "attack", player_id: 0};
		using('li.blue.attack').element(':button:eq(0)').click(player);
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
	});

	it('should add a goal for the red team if the red attacker goal',function() {
		var player = {team: "red", position: "attack", player_id: 2};
		using('li.red.defense').element(':button:eq(0)').click(player);
  		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('0');
	});

	//Attack CSC
	it('should add a goal for red team if the blue attacker goal csc',function() {
		using('li.blue.attack').element(':button:eq(1)').click();
  		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('0');
	});

	it('should add a goal for blue team if the red attacker goal csc',function() {
		using('li.red.attack').element(':button:eq(1)').click();
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
	});

	//Cancel a Goal
	it('should cancel last goal',function() {
		var player = {team: "blue", position: "attack", player_id: 0};
		using('li.blue.attack').element(':button:eq(0)').click(player);
		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
		
		//The "cancel last goal" button must be visible after a goal
		var cancelButton = using('.actionCancel').element(':button:eq(1)');
		expect(cancelButton.css('display')).toBe('inline-block');
		
		//Cancel the goal
		cancelButton.click();
		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('0');

		expect(cancelButton.css('display')).toBe('none');
	});

	//Reverse Table
	it('should reverse the table and keep score on the right team',function() {
		var player = {team: "blue", position: "attack", player_id: 0};
		using('li.blue.attack').element(':button:eq(0)').click(player);
		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');

		var reverseTableButton = using('.actionReverseTable').element(':button:eq(0)');
		reverseTableButton.click();
		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('0');
		reverseTableButton.click();
		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');
	});

});