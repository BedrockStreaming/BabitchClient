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

                scope.dynamicSort = function (property) {
                    var sortOrder = 1;
                    if(property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1);
                    }
                    return function (a,b) {
                        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                        return result * sortOrder;
                    }
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

                        var width = d3.select(ele[0])[0][0].offsetWidth - margin;

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
                        .attr('x', Math.round(margin/2))
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
                            .attr("x", Math.round(margin/2))
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
                            .attr("x", Math.round(margin/2))
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
                            .attr("x", Math.round(margin/2)+barHeight)
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr("width", barHeight)
                            .attr("height", barHeight);

                        }


                        svg.selectAll('text')
                        .data(d3.values(data))
                        .enter()
                        .append('text')
                        .attr('fill', '#fff')
                        .attr('y', function(d,i) {
                            return i * (barHeight + barPadding) + 15;
                        })
                        .attr('x', barHeight + (scope.type=="teams" ? barHeight*2 : barHeight))
                        .text(function(d) {
                            return (d.name ? d.name : d.name1 + ' - ' + d.name2) + " (" + (typeof d.stat == "undefined" ? "" : d.stat) + ")";
                        });
                    }, 200);
                };
            });
        }}
    }])
