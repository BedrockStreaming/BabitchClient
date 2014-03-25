angular.module('babitchFrontendApp')
.directive('d3Timeline', ['$window', '$timeout', 'd3Service', 'gravatarService',
function($window, $timeout, d3Service, gravatarService) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            label: '@',
            onClick: '&'
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {

                var renderTimeout;

                var svg = d3.select(ele[0])
                .append('svg')
                .style('width', '100%');

                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(scope.data);
                });

                scope.$watch('data', function(newData) {
                    scope.render(newData);
                }, true);

                scope.render = function(data) {
                    svg.selectAll('*').remove();

                    if (!data || !data.goals) {
                        return;
                    }
                    if (renderTimeout) {
                        clearTimeout(renderTimeout);
                    }

                    renderTimeout = $timeout(function() {
                        var width = parseInt(svg.style('width'), 10);
                        var barHeight = 20;
                        var margin = 5;
                        var ended_at = new Date(data.ended_at);
                        var started_at = new Date(data.started_at);
                        var game_length = (ended_at - started_at) / 1000;

                        //var height = data.goals.length*15;
                        var height = 20 + game_length * 2 || 400;
                        // Add 15px by goal
                        height += data.goals.length*15;
                        svg.attr('height', height);

                        svg.selectAll("rect")
                            .data([1])
                            .enter()
                            .append("rect")
                            .attr("x", Math.round(width/2) - 2)
                            .attr('y', 20)
                            .attr("width", 4)
                            .attr("height", height)
                            .style("fill","black");

                        svg.selectAll("circle")
                            .data(data.goals)
                            .enter()
                            .append("circle")
                            .attr("cx", Math.round(width/2))
                            .attr("cy", function(d,i) {
                                var goal_at = new Date(d.scored_at);
                                var goal_time = (goal_at - started_at) / 1000;
                                return 20 + (game_length - goal_time) * 2  + 15*i;
                            })
                            .attr("r", 8)
                            .style("fill", function(d) {
                                if(d.autogoal) {
                                    return "red";
                                }
                                return "black";
                            });

                        var texts = svg.selectAll('text')
                            .data(data.goals);

                        //Add player action
                        texts.enter()
                            .append('text')
                            .attr('fill', '#000')
                            .attr('y', function(d,i) {
                                var goal_at = new Date(d.scored_at);
                                var goal_time = (goal_at - started_at) / 1000;
                                return 20 + (game_length - goal_time) * 2 + 5 + 15*i;
                            })
                            .attr('x', function(d) {
                                var x = Math.round(width/2);
                                x += (d.team == "red" ? -20 : 20);
                                return x;
                            })
                            .style('text-anchor',function(d) {
                                return (d.team == "red" ? "end" : "start");
                            })
                            .text(function(d) {
                                var text = d.player_name + ' (' + d.position + ') ';
                                if(d.autogoal) {
                                    text += 'autogoal';
                                }
                                else text += 'goal ' + d.conceder_name;
                                return text;
                            });

                        //Add time
                        texts.enter()
                            .append('text')
                            .attr('fill', '#ccc')
                            .attr('y', function(d,i) {
                                var goal_at = new Date(d.scored_at);
                                var goal_time = (goal_at - started_at) / 1000;
                                return 20 + (game_length - goal_time) * 2 + 5 + 15*i;
                            })
                            .attr('x', function(d) {
                                var x = (d.team == "red" ? 0 : width);
                                return x;
                            })
                            .style('text-anchor',function(d) {
                                return (d.team == "red" ? "start" : "end");
                            })
                            .text(function(d) {
                                var time = (new Date(d.scored_at) - started_at) / 1000;
                                text = ~~( time / 60) + 'mn' + time % 60 + 's';
                                return text;
                            });

                    }, 200);
                };
            });
        }}
    }])
