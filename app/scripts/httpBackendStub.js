(function(ng) {
	if (!document.URL.match(/\?nobackend$/)) {
		return;
	}

	console.log(' ===== USING STUBBED BACKEND ======');
	initializeStubbedBackend();

	function initializeStubbedBackend() {
		ng.module('babitchFrontendApp')
			.config(function($provide) {
				$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
			})
			.run(function($httpBackend) {
				//Define responses for requests here as usual
				$httpBackend.whenGET('views/main.html').passThrough();

				JsonPlayer = [{
					"id": 6,
					"name": "Benjamin",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/6"
						}
					}
				}, {
					"id": 5,
					"name": "Marc",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/5"
						}
					}
				}, {
					"id": 4,
					"name": "Remi",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/4"
						}
					}
				}, {
					"id": 3,
					"name": "Nicolas",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/3"
						}
					}
				}, {
					"id": 2,
					"name": "Florent",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/2"
						}
					}
				}, {
					"id": 1,
					"name": "Kenny",
					"email": "",
					"_links": {
						"self": {
							"href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/1"
						}
					}
				}];

				$httpBackend.whenGET("http://127.0.0.1:8081/app_dev.php/v1/players").respond(JsonPlayer);
			});
	}
})(angular);