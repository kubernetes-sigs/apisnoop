// Author: Rohan Fletcher <rohan@ii.coop>

// Based on work from https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8


// Dimensions of sunburst.
var width = 650;
var height = 650;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "level.alpha": "#e6194b",
  "level.beta": "#0082c8",
  "level.stable": "#3cb44b",
  "category.unused": "#e0e0e0"
}

categories = [
  "admissionregistration",
  "apiextensions",
  "apiregistration",
  "apis",
  "apps",
  "authentication",
  "authorization",
  "autoscaling",
  "batch",
  "certificates",
  "core",
  "events",
  "extensions",
  "logs",
  "networking",
  "policy",
  "rbacAuthorization",
  "scheduling",
  "settings",
  "storage",
  "version"
]

more_colors = [
  "#b71c1c", "#880E4F", "#4A148C", "#311B92", "#1A237E", "#0D47A1",
  "#01579B", "#006064", "#004D40", "#1B5E20", "#33691E", "#827717",
  "#F57F17", "#FF6F00", "#E65100", "#BF360C", "#f44336", "#E91E63",
  "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107",
  "#FF9800", "#FF5722"
]

for (catidx = 0; catidx < categories.length; catidx++) {
  var category = categories[catidx]
  colors['category.' + category] = more_colors[(catidx * 3) % more_colors.length]
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var x = d3.scaleLinear().range([0, Math.PI * 2]);
var y = d3.scaleSqrt().range([0, radius]);
var partition = d3.partition();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(Math.PI * 2, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(y(d.y1)); });


var dataHierarchy;
var currentPath = [];

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.json("/api/v1/stats/endpoints?appname=e2e",function(error,response){
  // TODO: HANDLE ERRORS
  if (error == null) {
    dataHierarchy = buildHierarchy(response);
    createVisualization(dataHierarchy);
  } else {
    console.log(error, response)
  }
});

// d3.text("output-chart.csv", function(text) {
//   var csv = d3.csvParseRows(text);
//   var json = buildHierarchy(csv);
//   createVisualization(json);
// });


// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  //initializeBreadcrumbTrail();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // Turn the data into a d3 hierarchy and calculate the sums.
  var root = d3.hierarchy(json)
      .sum(function(d) { return d.size; })
      // .sort(function(a, b) { return b.value - a.value; });

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition(root).descendants()
      // .filter(function(d) {
      //     return (d.x1 - d.x0 > 0.002); // 0.005 radians = 0.29 degrees
      // });
  console.log(nodes);

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.data.color]; })
      .style("opacity", 1)
      .on("mouseover", mouseover)
      .on('click', click);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);
  d3.select("#legend").on("mouseleave", mouseleaveKey);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;

  var percentage = (100 * root.data.tested / root.data.total).toPrecision(3);
  d3.select("#reallybigline")
      .text(percentage + "%")
  d3.select("#bigline")
      .text(root.data.tested + " / " + root.data.total + " (" + percentage + " %)")
  d3.select("#midline")
      .text("total");
  d3.select("#smallline")
      .text("tested")


  // set totalSize on the root node
  // LABEL no mouseover - 222 / 999 API endpoints + methods tested
  // LABEL mouseover label - 111 / 333 stable tested (999 total)
  // LABEL mouseover category - 45 / 139 stable category tested (999 total)
  // LABEL mouseover test - url tested
  // LABEL mouseover untested - 88 / 139 stable category untested

 };

function createVisualisationWithPath(json, path) {

}

var currentDepth = 0;
var canHover = true;
function click(d) {
  currentDepth = d.depth;
  canHover = false;
  vis.transition()
      .duration(500)
      .tween('scale', function() {
        var dx = d3.interpolate(x.domain(), [d.x0, d.x1]);
        var dy = d3.interpolate(y.domain(), [d.y1, 1]);
        var y_range = d3.interpolate(y.range(), [150, radius]);
        return function(t) {
          x.domain(dx(t));
          y.domain(dy(t)).range(y_range(t));
        }
      })
      .selectAll('path')
      .attrTween('d', function(d) { return function() { return arc(d); }})
      .style('opacity', 1)
      .attr('display', function(d) { return d.depth <= currentDepth ? 'none' : null; })
}

 function mouseoverKey(d) {
   var group = d.group
   var subgroup = d.key
   var color = group + "." + subgroup
   d3.selectAll("path").style("opacity", 0.1)
   var objs = d3.selectAll("path").filter(function(node) {
     return (node.data.color == color)
   })
   objs.style("opacity", 1.0)
   if (color == "category.unused") {
     var root = d3.select("path").datum()
     total = root.data.total
     untested = root.data.untested
     tested = root.data.tested
   } else {
     total = 0
     untested = 0
     tested = 0
     objs.each(function(obj) {
       if (obj.data.url) {
         return
       }
       total += obj.data.total
       untested += obj.data.untested
       tested += obj.data.tested
     })
   }

   if (subgroup == "unused") {
     var chosen_value = untested
     var chosen_label = "untested"
   } else {
     var chosen_value = tested
     var chosen_label = "tested"
   }

   var percent = (100 * chosen_value / total).toPrecision(3);

   d3.select("#reallybigline")
       .text(percent + "%")
   d3.select("#bigline")
       .text(chosen_value + " / " + total)
   d3.select("#midline")
       .text(subgroup + " " + group);
   d3.select("#smallline")
       .text(chosen_label)
 }

 function mouseleaveKey(d) {

   // Hide the breadcrumb trail
   d3.select("#trail")
       .style("visibility", "hidden");

   // Deactivate all segments during transition.
   d3.selectAll("path").on("mouseover", null);

   // Transition each segment to full opacity and then reactivate it.
   d3.selectAll("path")
       .transition()
       .duration(100)
       .style("opacity", 1)
       .on("end", function() {
               d3.select(this).on("mouseover", mouseover);
             });
   //
   var root = d3.selectAll("path").datum()
   var percentage = (100 * root.data.tested / root.data.total).toPrecision(3);
   d3.select("#reallybigline")
       .text(percentage + "%")
   d3.select("#bigline")
       .text(root.data.tested + " / " + root.data.total)
   d3.select("#midline")
       .text("total");
   d3.select("#smallline")
       .text("tested")

}

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
  if (!canHover) {
    return;
  }
  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = d.value + " / " + totalSize // percentage + "%";
  // if (percentage < 0.1) {
  //   percentageString = "< 0.1%";
  // }
  if (d.children == undefined) {
    if (d.data.url == "unused") {
      var percent = (100 * d.data.size / d.parent.data.total).toPrecision(3);

      d3.select("#reallybigline")
          .text(percent + "%")
      d3.select("#bigline")
          .text(d.parent.data.untested + " / " + d.parent.data.total)
      d3.select("#midline")
          .text(d.parent.data.label);
      d3.select("#smallline")
          .text("untested")
    } else {
      d3.select("#reallybigline")
          .html("<img src=\"/static/img/tick.png\">")
      d3.select("#bigline")
          .text("Tested")
      d3.select("#midline")
          .text(d.data.label);
      d3.select("#smallline")
          .text(d.data.url);
    }

  } else {
    var percent = (100 * d.data.tested / d.data.total).toPrecision(3);
    d3.select("#reallybigline")
        .text(percent + "%")
    d3.select("#bigline")
        .text(d.data.tested + " / " + d.data.total)

    d3.select("#midline")
        .text(d.data.label);
    d3.select("#smallline")
        .text("tested");
  }


  d3.select("#percentage")
      .text(percentageString);

  d3.select("#explanation")
      .style("visibility", "");

  d3.select("#category").text(d.data.label)
  d3.select("#endpoint").text(d.data.url)

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array
  //updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.1);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {
  canHover = true;
  console.log(d);
  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(100)
      .style("opacity", 1)
      .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  var root = d
  while (root.parent) {
    root = root.parent
  }
  var percentage = (100 * root.tested / root.total).toPrecision(3);
  d3.select("#reallybigline")
      .text(percentage + "%")
  d3.select("#bigline")
      .text(root.tested + " / " + root.total)
  d3.select("#midline")
      .text("total");
  d3.select("#smallline")
      .text("tested")
}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 150, h: 23, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  var entries = d3.entries(colors)

  var levels = []
  var categories = []

  for (idx = 0; idx < entries.length; idx++) {
    obj = entries[idx]
    bits = obj.key.split(".")
    obj.key = bits[1]
    obj.group = bits[0]
    if (bits[0] == "level"){
      levels.push(obj)
    } else if (bits[0] == "category") {
      categories.push(obj)
    }
  }

  levels.push({key: "", value: "#fff"})
  entries = entries.concat(categories)

  var g = legend.selectAll("g")
      .data(entries)
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           }).on("mouseover", mouseoverKey);

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });

  var legend = d3.select("#legend");
  legend.style("visibility", "");
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.



function findChild(parentNode, nodeName) {
  var children = parentNode.children;
  for (var k = 0; k < children.length; k++) {
    if (children[k]["name"] == nodeName) {
      return children[k];
    }
  }
  return null
}

function createNode(name, attrs) {
  node = {
    "name": name,
    "children": [],
    'tested': 0,
    'untested': 0,
    'total': 0,
  };
  if (attrs) {
    node = Object.assign(node, attrs)
  }
  return node
}

function createEndNode(name, attrs) {
  node = {
    "name": name,
  };
  if (attrs) {
    node = Object.assign(node, attrs)
  }
  return node
}


function buildHierarchy(csv) {
  var root = createNode('root')
  for (var i = 0; i < csv.length; i++) {
    var level = csv[i][0];
    var category = csv[i][1];
    var method_url = csv[i][2];
    var size = +csv[i][3];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }

    var node = findChild(root, level)
    if (node == null) {
      node = createNode(level, {
        'color': 'level.' + level,
        'label': level,
      })
      root['children'].push(node)
    }
    parentNode = levelNode = node

    var node = findChild(parentNode, category)
    if (node == null) {
      node = createNode(category,  {
        'color': 'category.' + category,
        'label': level + ' ' + category,
      })
      parentNode['children'].push(node)
    }
    parentNode = categoryNode = node

    var node = findChild(parentNode, method_url)
    if (node == null) {
      if (method_url == 'unused') {
        var attrs = {'color': 'category.unused'}
        categoryNode.untested += size
        levelNode.untested += size
        root.untested += size
      } else {
        var attrs = {'color': 'category.' + category}
        categoryNode.tested += size
        levelNode.tested += size
        root.tested += size
      }
      categoryNode.total += size
      levelNode.total += size
      root.total += size
      attrs.label = level + ' ' + category
      attrs.url = method_url
      node = createEndNode(method_url, attrs)
      parentNode['children'].push(node)
    }
    node['size'] = size
  }
  console.log(root);
  return root;
};
