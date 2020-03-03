// Undefine barchart
require.undef('barchart')

define('barchart', ['d3'], function (d3 ) {
    function draw (container, data) {
        // Setup svg using Bostock's margin convention

        var margin = {top: 20, right: 160, bottom: 235, left: 50};

        var width = 960 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        var svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        
        // we expect data to look like so.
        // var data = [
        //     { podspec_field: "containers", e2e_hits: "10", conf_hits: "15"},
        //     { podspec_field: "volumes", e2e_hits: "12", conf_hits: "18"},
        //     { podspec_field: "nodes", e2e_hits: "05", conf_hits: "20"},
        //     { podspec_field: "storage", e2e_hits: "01", conf_hits: "15"},
        //     { podspec_field: "k8s", e2e_hits: "02", conf_hits: "10"},
        // ];

        // Transpose the data into layers
        var dataset = d3.layout.stack()(["e2e_hits", "conf_hits"].map(function(fruit) {
            return data.map(function(d) {
                return {x: d.podspec_field, y: +d[fruit]};
            });
        }));
        
        // Set x, y and colors
        var x = d3.scale.ordinal()
            .domain(dataset[0].map(function(d) { return d.x; }))
            .rangeRoundBands([10, width-10], 0.02);

        var y = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
            .range([height, 0]);

        var colors = ["#b33040", "#d25c4d"];


        // Define and draw axes
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-width, 0, 0)
            .tickFormat( function(d) { return d } );

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

        // Create groups for each series, rects for each segment 
        var groups = svg.selectAll("g.cost")
            .data(dataset)
            .enter().append("g")
            .attr("class", "cost")
            .style("fill", function(d, i) { return colors[i]; });

        var rect = groups.selectAll("rect")
            .data(function(d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
            .attr("width", x.rangeBand())
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = d3.mouse(this)[0] - 15;
                var yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.y);
            });


        // Draw legend
        var legend = svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
        
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colors.slice().reverse()[i];});
        
        legend.append("text")
            .attr("x", width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) { 
                switch (i) {
                case 0: return "conf_hits";
                case 1: return "e2e_hits";
                }
            });


        // Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");
        
        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");
    }
    return draw;
})

element.append('<small>&#x25C9; &#x25CB; &#x25EF; Loaded barchart.js successfully! &#x25CC; &#x25CE; &#x25CF;</small>');



