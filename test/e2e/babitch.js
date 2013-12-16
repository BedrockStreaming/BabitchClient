'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Babitch', function() {

	beforeEach(function() {
		browser().navigateTo('/');
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

	it('should add a goal for blue team if the blue defender goal',function() {
		var player = {team: "blue", position: "defense", player_id: 0};
		using('li.blue.defense').element(':button:eq(0)').click(player);
		sleep(3);
  		expect(element('.score ul li:eq(0)').text()).toBe('0');
		expect(element('.score ul li:eq(1)').text()).toBe('1');

	});

	it('should add a goal for red team if the blue defender goal csc',function() {
		using('li.blue.defense').element(':button:eq(1)').click();
  		expect(element('.score ul li:eq(0)').text()).toBe('1');
		expect(element('.score ul li:eq(1)').text()).toBe('1');


	});

});