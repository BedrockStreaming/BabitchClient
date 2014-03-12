angular.module('babitchFrontendApp')
.directive('d3Bars', ['$window', '$timeout', 'd3Service', 'gravatarService',
function($window, $timeout, d3Service, gravatarService) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            type: '@',
            label: '@',
            onClick: '&'
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {

                var renderTimeout;
                var margin = parseInt(attrs.margin) || 20,
                barHeight = parseInt(attrs.barHeight) || 20,
                barPadding = parseInt(attrs.barPadding) || 5;

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

                    if (!data) return;
                    if (renderTimeout) clearTimeout(renderTimeout);

                    renderTimeout = $timeout(function() {

                        var RectBegin = (scope.type == "teams" ? 250 : 150);
                        var RectEnd = 50;
                        var width = d3.select(ele[0])[0][0].offsetWidth - margin - RectBegin - RectEnd;

                        if (width<0) return;

                        var height = scope.data.length * (barHeight + barPadding);
                        var color = d3.scale.category20();
                        var d3min = d3.min(d3.values(data), function(d) {
                            return d.stat;
                        });

                        if(d3min >= 0) {
                            d3min = 0;
                        }

                        var d3max = d3.max(d3.values(data), function(d) {
                            return d.stat;
                        });

                        var xScale = d3.scale.linear()
                        .domain([d3min, d3max])
                        .range([0, width]);

                        svg.attr('height', height);

                        svg.selectAll('rect')
                        .data(d3.values(data))
                        .enter()
                        .append('rect')
                        .on('click', function(d,i) {
                            return scope.onClick({item: d});
                        })
                        .attr('height', barHeight)
                        .attr('width', 140)
                        .attr('x', RectBegin + Math.round(margin/2))
                        .attr('y', function(d,i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('fill', function(d) {
                            return color(d.stat);
                        })
                        .transition()
                        .duration(1000)
                        .attr('width', function(d) {
                            if(typeof d.stat == "number") {
                                return xScale(d.stat);
                            }
                            else return 0;
                        });

                        //Gravatar
                        if(scope.type == 'players') {
                            var imgs = svg.selectAll("image")
                            .data(d3.values(data))
                            .enter()
                            .append("svg:image")
                            .attr("xlink:href", function(d) {
                                return gravatarService.url(d.email);
                            })
                            .attr("x", RectBegin - barHeight - barPadding + Math.round(margin/2))
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr("width", barHeight)
                            .attr("height", barHeight);
                        }
                        else {
                            var imgs = svg.selectAll("image")
                            .data(d3.values(data));

                            imgs.enter()
                            .append("svg:image")
                            .attr("xlink:href", function(d) {
                                return gravatarService.url(d.email1);
                            })
                            .attr("x", RectBegin - barHeight - barPadding + Math.round(margin/2))
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr("width", barHeight)
                            .attr("height", barHeight);

                            imgs.enter()
                            .append("svg:image")
                            .attr("xlink:href", function(d) {
                                return gravatarService.url(d.email2);
                            })
                            .attr("x", RectBegin - barHeight - barPadding + Math.round(margin/2) - barHeight - barPadding)
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr("width", barHeight)
                            .attr("height", barHeight);

                        }


                        var texts = svg.selectAll('text')
                        .data(d3.values(data));

                        texts.enter()
                        .append('text')
                        .attr('fill', '#000')
                        .attr('y', function(d,i) {
                            return i * (barHeight + barPadding) + 15;
                        })
                        .attr('x', (scope.type == "teams" ? RectBegin - barHeight - barHeight - barPadding : RectBegin - barHeight))
                        .attr("text-anchor", "end")
                        .text(function(d) {
                            return (d.name ? d.name : d.name1 + ' - ' + d.name2);
                        });

                        texts.enter()
                        .append('text')
                        .attr('fill', '#000')
                        .attr('y', function(d,i) {
                            return i * (barHeight + barPadding) + 15;
                        })
                        .attr('x', 140 + RectBegin + barPadding + barPadding)
                        .attr("text-anchor", "start")
                        .text(function(d) {
                            return (typeof d.stat == "undefined" ? "" : d.stat);
                        })
                        .transition()
                        .duration(950)
                        .attr('x',function(d) {
                            if(typeof d.stat == "number") {
                                return xScale(d.stat) + RectBegin + barPadding + barPadding;
                            }
                            else return 0;
                        });

                    }, 200);
                };
            });
        }}
    }])
