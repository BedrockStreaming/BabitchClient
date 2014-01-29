(function(angular) {
    if (!document.URL.match(/\?nobackend/i)) {
        return;
    }

    console.log(' ===== USING STUBBED BACKEND ======');

    angular.module('babitchFrontendApp')
        .config(function($provide) {
            $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        })
        .run(function($httpBackend, CONFIG) {
            //Define responses for requests here as usual
            $httpBackend.whenGET(/views\/.*/).passThrough();

            var JsonPlayer = [
               {
                  "id":1,
                  "name":"Nicolas B",
                  "email":"nicolas.bazille@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/21"
                     }
                  }
               },
               {
                  "id":2,
                  "name":"stephanie",
                  "email":"stephanie@shopper.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/20"
                     }
                  }
               },
               {
                  "id":3,
                  "name":"Damien Jv",
                  "email":"Damien@jeuxvideo.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/19"
                     }
                  }
               },
               {
                  "id":4,
                  "name":"JulienB",
                  "email":"Jbesnard.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/18"
                     }
                  }
               },
               {
                  "id":5,
                  "name":"Jean micheng",
                  "email":"jm@jm.de",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/17"
                     }
                  }
               },
               {
                  "id":6,
                  "name":"Gregory",
                  "email":"mail",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/16"
                     }
                  }
               },
               {
                  "id":7,
                  "name":"Pierre Thomas",
                  "email":"ptguillot.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/15"
                     }
                  }
               },
               {
                  "id":8,
                  "name":"Benjamin",
                  "email":"brichard.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/14"
                     }
                  }
               },
               {
                  "id":9,
                  "name":"Antony",
                  "email":"apichoud@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/13"
                     }
                  }
               },
               {
                  "id":10,
                  "name":"Aurelian",
                  "email":"abes.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/12"
                     }
                  }
               },
               {
                  "id":11,
                  "name":"Marc",
                  "email":"marc.cagnat@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/11"
                     }
                  }
               },
               {
                  "id":12,
                  "name":"R\u00e9mi",
                  "email":"rlemonnier.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/10"
                     }
                  }
               },
               {
                  "id":13,
                  "name":"Kenny",
                  "email":"kenny.dits@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/9"
                     }
                  }
               },
               {
                  "id":14,
                  "name":"Nicolas C",
                  "email":"nchaulet.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/8"
                     }
                  }
               },
               {
                  "id":15,
                  "name":"Florent L",
                  "email":"flavy.externe@m6.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/7"
                     }
                  }
               },
               {
                  "id":16,
                  "name":"J\u00e9r\u00e9my",
                  "email":"cytron@m6web.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/6"
                     }
                  }
               },
               {
                  "id":17,
                  "name":"Francis",
                  "email":"cytron@m6web.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/5"
                     }
                  }
               },
               {
                  "id":18,
                  "name":"Morgan",
                  "email":"brunot.morgan@gmail.com",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/4"
                     }
                  }
               },
               {
                  "id":19,
                  "name":"Florent",
                  "email":"cytron@m6web.fr",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/3"
                     }
                  }
               },
               {
                  "id":20,
                  "name":"Denis",
                  "email":"denis.roussel@gmail.com",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/2"
                     }
                  }
               },
               {
                  "id":21,
                  "name":"Adrien",
                  "email":"adrien@kyklydse.com",
                  "_links":{
                     "self":{
                        "href":"http:\/\/api.babitch.m6web.fr\/v1\/players\/1"
                     }
                  }
               }
            ]

            $httpBackend.whenPOST(CONFIG.BABITCH_WS_URL + "/games").respond({});

            $httpBackend.whenGET(CONFIG.BABITCH_WS_URL + "/players").respond(JsonPlayer);

            $httpBackend.whenGET(/v1\/players\/[0-9]*/).respond(function(method, url) {
                var regEx = /v1\/players\/([0-9]*)/;
                var id = regEx.exec(url)[1];
                return [200, JsonPlayer[id - 1]];
            });
        });
})(angular);

