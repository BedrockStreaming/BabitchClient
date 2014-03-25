angular.module('babitchFrontendApp')
.directive('d3Matrix', ['$window', '$timeout', 'd3Service', 'gravatarService',
function($window, $timeout, d3Service, gravatarService) {
    return {
        restrict: 'A',
        scope: {
            data: '=',
            players: '=',
            type: '@',
            label: '@',
            onClick: '&'
        },
        link: function(scope, ele, attrs) {
            d3Service.d3().then(function(d3) {

                var renderTimeout;

                var margin = {top: 80, right: 0, bottom: 10, left: 80};

                var width = (d3.select(ele[0])[0][0].offsetWidth - margin.left - margin.right ) / 1.4;
                if (width < 0) {
                    return;
                }

                var height = width;

                var svg = d3.select(ele[0]).append("svg")
                    .attr("class","center-block")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    //.style("margin-left", -margin.left + "px")
                    .style('font','10px sans-serif')
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //Re-render on resize
                $window.onresize = function() {
                    scope.$apply();
                };

                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(scope.data);
                });

                //Re-render on data changed
                scope.$watch('data', function(newData) {
                    scope.render(newData);
                }, true);

                scope.render = function(data) {
                    svg.selectAll('*').remove();

                    if (!data ) {
                        return;
                    }

                    if(data.length <= 1) {
                        return;
                    }

                    if (renderTimeout) {
                        clearTimeout(renderTimeout);
                    }

                    renderTimeout = $timeout(function() {

                    var x = d3.scale.ordinal().rangeBands([0, width]);

                    var matrix = [],
                        nodes = scope.players,
                        n = nodes.length;

                    // Compute index per node.
                    nodes.forEach(function(node, i) {
                        node.index = i;
                        node.count = 0;
                        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
                    });

                    // Convert links to matrix; count character occurrences.
                    data.forEach(function(link) {
                        matrix[link.source][link.target].z += link.value;
                        matrix[link.target][link.source].z += link.value;
                        //matrix[link.source][link.source].z += link.value;
                        //matrix[link.target][link.target].z += link.value;
                        nodes[link.source].count += link.value;
                        nodes[link.target].count += link.value;
                    });

                    // Precompute the orders.
                    var orders = {
                        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
                        count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
                        group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
                    };


                    var d3max = d3.max(matrix, function(d) {
                        return d3.max(d, function(d1) {
                            return d1.z;
                        });
                    });

                    var z = d3.scale.linear().domain([0, d3max]).clamp(true);

                    //Color range according to max values
                    var c = d3.scale
                        .category10()
                        .domain(d3.range(d3max));

                    // The default sort order.
                    x.domain(orders.name);

                    var row = svg.selectAll(".row")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "row")
                        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                        .each(row);

                    row.append("line")
                        .style("stroke","#fff")
                        .attr("x2", width);

                    row.append("text")
                        .attr("class","playerName")
                        .attr("x", -6)
                        .attr("y", x.rangeBand() / 2)
                        .attr("dy", ".32em")
                        .attr("text-anchor", "end")
                        .text(function(d, i) { return nodes[i].name; });

                    var column = svg.selectAll(".column")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "column")
                        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

                    column.append("line")
                        .style("stroke","#fff")
                        .attr("x1", -width);

                    column.append("text")
                        .attr("class","playerName")
                        .attr("x", 6)
                        .attr("y", x.rangeBand() / 2)
                        .attr("dy", ".32em")
                        .attr("text-anchor", "start")
                        .text(function(d, i) { return nodes[i].name; });

                    function row(row) {
                        var cell = d3.select(this).selectAll(".cell")
                            .data(row.filter(function(d) { return d.z; }))
                            .enter().append("g").attr("class","cell");

                        cell.append("rect")
                            .attr("class", "cell")
                            .attr("x", function(d) { return x(d.x); })
                            .attr("width", x.rangeBand())
                            .attr("height", x.rangeBand())
                            .style("fill-opacity", function(d) { return z(d.z); })
                            .style("fill", function(d) {
                                return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null;
                                //return c(matrix[d.x][d.y].z);
                            })
                            .on("mouseover", mouseover)
                            .on("mouseout", mouseout);

                        cell.append("text")
                            .attr("class","cell")
                            .attr("x", function(d) { return x(d.x) + (x.rangeBand()/2); })
                            .attr("y",(x.rangeBand()/2)+4)
                            .attr('text-anchor','middle')
                            .text(function(d) { return d.z;})
                            .on("mouseover", mouseover)
                            .on("mouseout", mouseout);
                    }

                    function mouseover(p) {
                        d3.selectAll(".row .playerName").classed("active", function(d, i) { return i == p.y; });
                        d3.selectAll(".column .playerName").classed("active", function(d, i) { return i == p.x; });
                    }

                    function mouseout() {
                        d3.selectAll("text").classed("active", false);
                    }

                      /*function order(value) {
                        x.domain(orders[value]);

                        var t = svg.transition().duration(2500);

                        t.selectAll(".row")
                            .delay(function(d, i) { return x(i) * 4; })
                            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                          .selectAll(".cell")
                            .delay(function(d) { return x(d.x) * 4; })
                            .attr("x", function(d) { return x(d.x); });

                        t.selectAll(".column")
                            .delay(function(d, i) { return x(i) * 4; })
                            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
                      }

                      //var timeout = setTimeout(function() {
                        order("name");*/

                        //d3.select("#order").property("selectedIndex", 2).node().focus();
                      //}, 5000);



                }, 200);
            };
        });
    }};
}])
