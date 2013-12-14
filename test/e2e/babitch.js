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


});