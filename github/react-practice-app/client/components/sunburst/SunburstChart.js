import React from 'react';
import * as d3 from 'd3';


class SunburstChart extends React.Component {
  componentDidMount() {
  //  this.drawChart();
    // this.drawRect();
    console.log('1 hi', this.props.data);
    // this.drawSunburst();
    this.drawFlamegraph();
  }

  componentDidUpdate() {
    // d3.select(this.svg).selectAll('g').remove();
    // this.drawChart();
    this.drawRect();
   
  }

/*
  drawChart() {
   
    // sunburst dimensions
    var width = 900;
    var height = 900;
    var radius = Math.min(width, height) / 2;
    var _self = this;

    // Breadcrumb dimensions: ... , spacing, width of tip/tail
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Mapping of step names to colors.
    var colors = {
      "home": "#5687d1",
      "product": "#7b615c",
      "search": "#de783b",
      "account": "#6ab975",
      "other": "#a173d1",
      "end": "#bbbbbb"
    };

    let color = function() {
      let ctr = 0;
      const hex = ['#53c79f', '#64b0cc', '#7a6fca', '#ca6f96', '#e58c72', '#e5c072']
      return function() {
        if (ctr === hex.length - 1) {
          ctr = 0;
          return hex[ctr]
        } else {
          ctr++
          return hex[ctr]
        }
      }
    }

    let loopColors = color()

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;

    var vis = d3.select(this.svg)
      .attr('width', width)
      .attr('height', height)
      .append('svg:g')
      .attr('id', 'container')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    d3.select('#explanation')
      .style('visibility', 'hidden');

    var partition = d3.partition()
      .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
      .startAngle(function(d) { return d.x0; })
      .endAngle(function(d) { return d.x1; })
      .innerRadius(function(d) { return Math.sqrt(d.y0); })
      .outerRadius(function(d) { return Math.sqrt(d.y1); });

    var json = buildHierarchy(this.props.data);
    createVisualization(json);

    // main function to draw and set up the visualization, once we have the data
    function createVisualization(json) {

      initializeBreadcrumbTrail();

      // Bounding circle underneath the sunburst, to make it easier to detech when the mouse leaves the parent g.
      vis.append('svg:circle')
        .attr('r', radius)
        .style('opacity', 0);
      
      // turn the data into a d3 hierarchy and calculate the sums.
      var root = d3.hierarchy(json)
        .sum(function (d) { return d.size; })
        .sort(function (a, b) { return b.value - a.value; });

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition(root).descendants()
        .filter(function (d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

      var i = 0;
      var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function (d) { return loopColors() })
        .style("opacity", 1)
        .on("mouseover", mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.datum().value;
    };
    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
        .text(percentageString);
      //ADDED FILE NAME
      d3.select("#filename")
        .text(d.data.name)

      //ADDED FILE SIZE
      d3.select("#filesize")
        .text(d.value / 1000)

      d3.select("#explanation")
        .style("visibility", "");


      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      let trickArray = sequenceArray.slice(0);
      // convert path array to a '/' seperated path string. add '/' at the end if it's a directory.
      const path = "./" + trickArray.map(node => node.data.name).join("/") + (trickArray[trickArray.length - 1].children ? "/" : "");
      _self.props.onHover(path);

      for (var i = 1; i < trickArray.length + 1; i++) {
        updateBreadcrumbs(trickArray.slice(0, i), percentageString);
      }
      // Fade all the segments.
      d3.selectAll("#chart").selectAll("path")
        .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
        .filter(function (node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
        .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("#chart").selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function () {
          d3.select(this).on("mouseover", mouseover);
        });

      d3.select("#explanation")
        .style("visibility", "hidden");

      _self.props.onHover(null);
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "trail");

      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#fff");   //controls the color of the percentage
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + d.data.name.length * 7.5 + ",0");  //CONTROLS THE SHAPE OF THE POLYGON
      points.push(b.w + d.data.name.length * 7.5 + b.t + "," + (b.h / 2));
      points.push(b.w + d.data.name.length * 7.5 + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function (d) { return d.data.name + d.depth; });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function (d) { return '#53c79f'; });

      entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function (d) { return d.data.name; });

      // Now move and update the percentage at the end.
      var nodeAryFlat = '';

      for (var i = 0; i < nodeArray.length; i++) {
        nodeAryFlat = nodeAryFlat + ' ' + nodeArray[i].data.name
      }

      var nodeAryFlatLength = 0;
      var nodeAryFlatLengthPercentage = 0;
      for (var i = 1; i < nodeArray.length; i++) {
        nodeAryFlatLength = nodeAryFlatLength + b.w + nodeArray[i - 1].data.name.length * 7.5 + b.t
        nodeAryFlatLengthPercentage = nodeAryFlatLength + b.w + nodeArray[i].data.name.length * 7.5 + b.t + 15
      }

      entering.attr("transform", function (d, i) {
        if (i === 0) {
          return "translate(0, 0)"
        } else {
          return "translate(" + nodeAryFlatLength + ", 0)";   //POSITIONING OF WORDS
        }
      });

      d3.select("#trail").select("#endlabel")
        .attr("x", (nodeAryFlatLengthPercentage))  //CONTROLS WHERE THE PERCENTAGE IS LOCATED
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
        .style("visibility", "");

    }

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    function buildHierarchy(csv) {
      var root = { "name": "root", "children": [] };
      for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
          continue;
        }
        var parts = sequence.split("/");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
            // Not yet at the end of the sequence; move down the tree.
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
              if (children[k]["name"] == nodeName) {
                childNode = children[k];
                foundChild = true;
                break;
              }
            }
            // If we don't already have a child node for this branch, create it.
            if (!foundChild) {
              childNode = { "name": nodeName, "children": [] };
              children.push(childNode);
            }
            currentNode = childNode;
          } else {
            // Reached the end of the sequence; create a leaf node.
            childNode = { "name": nodeName, "size": size };
            children.push(childNode);
          }
        }
      }
      return root;
    };

  }
*/

  drawFlamegraph() {
    var flameGraph = window.d3.flameGraph()
      .width(960)
      .cellHeight(18)
      .transitionDuration(750)
      .transitionEase(d3.easeCubic)
      .sort(true)
      //Example to sort in reverse order
      //.sort(function(a,b){ return d3.descending(a.name, b.name);})
      .title("");

    // Example on how to use custom tooltips using d3-tip.

    var tip = window.d3.tip()
      .direction("s")
      .offset([8, 0])
      .attr('class', 'd3-flame-graph-tip')
      .html(function (d) { return "name: " + d.data.name + ", value: " + d.data.value; });
    flameGraph.tooltip(tip);

    // Example on how to use custom labels
    var label = function(d) {
     return "name: " + d.data.name + ", value: " + d.data.value;
    }
    flameGraph.label(label);

    // d3.json("./data/stacks.json", function (error, data) {

      const flameData = this.props.flameData;
      console.log('flame data = ' , flameData);

      // if (error) return console.warn(error);
      d3.select("#chart")
        .datum(flameData)
        .call(flameGraph);
    // });
  }

  drawRect() {
    console.log('rect hi', this.props.data);

    var margin = { left: 80, right: 20, top: 50, bottom: 100 };

    var width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var g = d3.select("#chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


    // X Label
    // g.append("text")
    //   .attr("y", height + 50)
    //   .attr("x", width / 2)
    //   .attr("font-size", "20px")
    //   .attr("text-anchor", "middle")
    //   .text("Month");

    // Y Label
    // g.append("text")
    //   .attr("y", -60)
    //   .attr("x", -(height / 2))
    //   .attr("font-size", "20px")
    //   .attr("text-anchor", "middle")
    //   .attr("transform", "rotate(-90)")
    //   .text("Revenue");

    // d3.json("data/revenues.json", function (data) {
      // console.log(data);
      const data = this.props.rectData;
      // Clean data
      data.forEach(function (d) {
        d.revenue = +d.revenue;
      });


      // d3.interval(function () {
      //   // console.log('Hello World');
      //   update(data)
      // }, 1000);

      // run the vis for the first time
      // X Scale
      var x = d3.scaleBand()
        .domain(data.map(function (d) { return d.month }))
        .range([0, width])
        .padding(0.2);

      // Y Scale
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.revenue })])
        .range([height, 0]);

      // X Axis
      var xAxisCall = d3.axisBottom(x);
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

      // Y Axis
      var yAxisCall = d3.axisLeft(y)
        .tickFormat(function (d) { return d; });
      g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

      // Bars
      var rects = g.selectAll("rect")
        .data(data)

      rects.enter()
        .append("rect")
        .attr("y", function (d) { return y(d.revenue); })
        .attr("x", function (d) { return x(d.month) })
        .attr("height", function (d) { return height - y(d.revenue); })
        .attr("width", x.bandwidth)
        .attr("fill", "grey");


    // })
  }


  drawSunburst() {
    console.log('sun hi', this.props.sunData);
    
    // Dimensions of sunburst.
    var width = 900;
    var height = 900;
    var radius = Math.min(width, height) / 2;
    var _self = this;

    // ##?
    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Mapping of step names to colors.
    // var colors = {
    //   "home": "#5687d1",
    //   "product": "#7b615c",
    //   "search": "#de783b",
    //   "account": "#6ab975",
    //   "other": "#a173d1",
    //   "end": "#bbbbbb"
    // };
    var colors = {
      "home": "red",
      "product": "#7b615c",
      "search": "#de783b",
      "account": "#6ab975",
      "other": "#a173d1",
      "end": "#bbbbbb"
    };

    let color = function () {
      let ctr = 0;
      // const hex = ['#53c79f', '#64b0cc', '#7a6fca', '#ca6f96', '#e58c72', '#e5c072']
      const hex = ['#5687d1', '#7b615c', '#de783b', '#6ab975', '#a173d1', '#bbbbbb']
      return function () {
        if (ctr === hex.length - 1) {
          ctr = 0;
          return hex[ctr]
        } else {
          ctr++
          return hex[ctr]
        }
      }
    }

    let loopColors = color()

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;

    var vis = d3.select(this.svg)
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("id", "container")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // ##?
    d3.select("#explanation")
      .style("visibility", "hidden");

    // ##?
    var partition = d3.partition()
      .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
      .startAngle(function (d) { return d.x0; })
      .endAngle(function (d) { return d.x1; })
      .innerRadius(function (d) { return Math.sqrt(d.y0); })
      .outerRadius(function (d) { return Math.sqrt(d.y1); });

    // Use d3.text and d3.csvParseRows so that we do not need to have a header
    // row, and can receive the csv as an array of arrays.

    // var json = buildHierarchy(this.props.data);
    var json = this.props.sunData;
    console.log('json =', json);
    createVisualization(json);

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {

      // Basic setup of page elements.
      // initializeBreadcrumbTrail();

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

      // Turn the data into a d3 hierarchy and calculate the sums.
      var root = d3.hierarchy(json)
        .sum(function (d) { return d.size; })
        .sort(function (a, b) { return b.value - a.value; });

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition(root).descendants()
        .filter(function (d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

      var i = 0;
      var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function (d) { return loopColors() })
        .style("opacity", 1)
        .on("mouseover", mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.datum().value;
    };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
        .text(percentageString);
      //ADDED FILE NAME
      d3.select("#filename")
        .text(d.data.name)

      //ADDED FILE SIZE
      d3.select("#filesize")
        .text(d.value / 1000)

      d3.select("#explanation")
        .style("visibility", "");


      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      let trickArray = sequenceArray.slice(0);
      // convert path array to a '/' seperated path string. add '/' at the end if it's a directory.
      const path = "./" + trickArray.map(node => node.data.name).join("/") + (trickArray[trickArray.length - 1].children ? "/" : "");
      // _self.props.onHover(path);

      for (var i = 1; i < trickArray.length + 1; i++) {
        updateBreadcrumbs(trickArray.slice(0, i), percentageString);
      }
      // Fade all the segments.
      d3.selectAll("#chart").selectAll("path")
        .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
        .filter(function (node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
        .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("#chart").selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function () {
          d3.select(this).on("mouseover", mouseover);
        });

      d3.select("#explanation")
        .style("visibility", "hidden");

      // _self.props.onHover(null);
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "trail");

      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#fff");   //controls the color of the percentage
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + d.data.name.length * 7.5 + ",0");  //CONTROLS THE SHAPE OF THE POLYGON
      points.push(b.w + d.data.name.length * 7.5 + b.t + "," + (b.h / 2));
      points.push(b.w + d.data.name.length * 7.5 + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function (d) { return d.data.name + d.depth; });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function (d) { return '#53c79f'; });

      entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function (d) { return d.data.name; });

      // Now move and update the percentage at the end.
      var nodeAryFlat = '';

      for (var i = 0; i < nodeArray.length; i++) {
        nodeAryFlat = nodeAryFlat + ' ' + nodeArray[i].data.name
      }

      var nodeAryFlatLength = 0;
      var nodeAryFlatLengthPercentage = 0;
      for (var i = 1; i < nodeArray.length; i++) {
        nodeAryFlatLength = nodeAryFlatLength + b.w + nodeArray[i - 1].data.name.length * 7.5 + b.t
        nodeAryFlatLengthPercentage = nodeAryFlatLength + b.w + nodeArray[i].data.name.length * 7.5 + b.t + 15
      }

      entering.attr("transform", function (d, i) {
        if (i === 0) {
          return "translate(0, 0)"
        } else {
          return "translate(" + nodeAryFlatLength + ", 0)";   //POSITIONING OF WORDS
        }
      });

      d3.select("#trail").select("#endlabel")
        .attr("x", (nodeAryFlatLengthPercentage))  //CONTROLS WHERE THE PERCENTAGE IS LOCATED
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
        .style("visibility", "");

    }

    function buildHierarchy(csv) {
      var root = { "name": "root", "children": [] };
      for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
          continue;
        }
        var parts = sequence.split("/");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
            // Not yet at the end of the sequence; move down the tree.
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
              if (children[k]["name"] == nodeName) {
                childNode = children[k];
                foundChild = true;
                break;
              }
            }
            // If we don't already have a child node for this branch, create it.
            if (!foundChild) {
              childNode = { "name": nodeName, "children": [] };
              children.push(childNode);
            }
            currentNode = childNode;
          } else {
            // Reached the end of the sequence; create a leaf node.
            childNode = { "name": nodeName, "size": size };
            children.push(childNode);
          }
        }
      }
      return root;
    };




    // var width = 960,
    //   height = 700,
    //   radius = (Math.min(width, height) / 2) - 10;

    // var formatNumber = d3.format(",d");

    // var x = d3.scaleLinear()
    //   .range([0, 2 * Math.PI]);

    // var y = d3.scaleSqrt()
    //   .range([0, radius]);

    // var color = d3.scaleOrdinal(d3.schemeCategory20c);
    // console.log('color=', color);

    // var partition = d3.partition();
    // // setting partition layout, which we'll use to generate sunburst layout value
    // console.log('partition = ', partition)

    // // These values will be provided by d3.partition() 
    // var arc = d3.arc() // arc generator
    //   .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    //   .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    //   .innerRadius(function (d) { return Math.max(0, y(d.y0)); })
    //   .outerRadius(function (d) { return Math.max(0, y(d.y1)); });
    //     // max: to make sure we don't try drawing a circle with negative i angles or radius
    // console.log('arc = ', arc);

    // var svg = d3.select("#chart-area").append("svg")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .append("g")
    //   .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


    // d3.json("data/sunburst.json", function (error, root) {

      // const root = this.props.sunData;

      // if (error) throw error;

      // root = d3.hierarchy(root)
      //   .sum(function (d) { return d.size; });

      // using hierarchy layout to format into something we can use with our partition layout
      // using sum method,  get value fields according to the sum of size of all the fields in the descendents

      // y values ranging from 0 to 1(depending on node's depth in the hierarchy), x values add up to 1 for each level 

      // Add an arc for each of the nodes in our hierarchy. partition(rootdata) adds x0, x1, y0, and y1 values to each node.

      // svg.selectAll("path")
      //   .data(partition(root).descendants()) // calling descendents() method on that data
      //   .enter().append("path")
      //   .attr("d", arc)
      //   .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
      //   // giving new color, or inherit color from parent if at leaf node
      //   .on("click", click)
      //   .append("title")
      //   .text(function (d) { return d.data.name + "\n" + formatNumber(d.value); });

    // });
    
  }

  render() {
    return (
      <div>
        <div id="chart-area">

        </div>

        <div id="main">
          <div id="sequence"></div>
          <div id="chart">
            <svg width={630} height={500} className="#chart" ref={(elem) => { this.svg = elem; }}>
            </svg>

            <div id="explanation">
              <span id="filename"></span><br />
              <span id="percentage"></span><br />
              of your bundle
              <div>
                Size: <span id="filesize"></span> kb <br />
              </div>
            </div>

          </div>
        </div>

        <div className="container">
          {/* <div class="header clearfix">
            <nav>
              <div class="pull-right">
                <form class="form-inline" id="form">
                  <a class="btn" href="javascript: resetZoom();">Reset zoom</a>
                  <a class="btn" href="javascript: clear();">Clear</a>
                  <div class="form-group">
                    <input type="text" class="form-control" id="term">
                  </div>
                  <a class="btn btn-primary" href="javascript: search();">Search</a>
                </form>
              </div>
            </nav>
            <h3 class="text-muted">d3-flame-graph</h3>
          </div> */}
          <div id="chart">
          </div>
          {/* <hr> */}
          <div id="details">
          </div>
        </div>
        
      </div>
    );
  }
  
}

export default SunburstChart;
