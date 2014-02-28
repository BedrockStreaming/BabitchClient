'use strict';

angular.module('babitchFrontendApp')
    .directive('ngLiveheighthandler', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // var $element = angular.element(element);

                // var onResize = function () {
                //     var $window = $(this);
                //     var $teams = $element.find('#teams');

                //     if($window.width() >= 600) {
                //         $teams.css('height', 'auto');
                //         return;
                //     }

                //     var $header = $element.find('#header');
                //     var $score = $element.find('#score');

                //     $teams.css('height', $window.height()-$header.height()-$score.height());
                // };

                // angular.element($window).bind('resize', onResize);

                // onResize();
            }
        };
    });
