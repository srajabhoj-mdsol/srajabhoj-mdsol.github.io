
// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 30, left: 50};
var width = document.getElementById("bubble-chart").offsetWidth * 0.9 - margin.left - margin.right;
var height = document.getElementById("bubble-chart").offsetHeight * 0.9 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("study_subject_enrollment_by_month.csv", function(data) {

  // Add X axis
  var x = d3.scaleTime()
    .domain([new Date("2014/10/1"), new Date("2016/5/1")])
    .range([ 0, width ]);
  x.ticks(20);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %y")));

 
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 250])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 10])
    .range([ 2, 20]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Screen Failed", "Early Terminated", "Completed"])
    .range(d3.schemeSet1);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Type: " + d.TYPE + "<br>" + "Subject Screened: " + d.COUNT+ "<br>" + "MAX SAE: " + d.MAX_SAES)
      .style("left", (d3.event.pageX + 10) + "px")
      .style("top", (d3.event.pageY + 10) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY + 10) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(new Date(d.MEASURE_DATE_YYYY_MM_DD)); })
      .attr("cy", function (d) { return y(d.COUNT); })
      .attr("r", function (d) { return z(d.MAX_SAES); })
      .style("fill", function (d) { return myColor(d.TYPE); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )




  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height * 1.1)
  .text("month");

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", - width * 0.07)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("count of subject screened");

    var size = 20
    var keys=["Completed","Early Terminated","Screen Failed"]
    svg.selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 100)
        .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return myColor(d)})
    
    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 100 + size*1.2)
        .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

      svg
      .append("text")
      .attr("x", 75 + size*1.2)
      .attr("y", function(i=3.5){ return 100 + i*(size+5) + (size/2)})
      .text("Bubble size depends om MAX SAEs")

  })


// ==================================================
  // set the dimensions and margins of the graph
  // var margin = { top: 10, right: 20, bottom: 30, left: 50 },
  //   width = 500 - margin.left - margin.right,
  //   height = 420 - margin.top - margin.bottom;

  // // append the svg object to the body of the page
  // var svg = d3.select("#my_dataviz")
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform",
  //     "translate(" + margin.left + "," + margin.top + ")");

  // //Read the data
  // d3.csv("study_subject_enrollment_by_month.csv", function (data) {

  //   // Add X axis
  //   var x = d3.scaleLinear()
  //     .domain([0, 13])
  //     .range([0, width]);
  //   svg.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x));

  //   // Add Y axis
  //   var y = d3.scaleLinear()
  //     .domain([0, 10])
  //     .range([height, 0]);
  //   svg.append("g")
  //     .call(d3.axisLeft(y));

  //   // Add a scale for bubble size
  //   var z = d3.scaleLinear()
  //     .domain([0, 10])
  //     .range([1, 40]);

  //   // Add dots
  //   svg.append('g')
  //     .selectAll("dot")
  //     .data(data)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", function (d) { return x(new Date(d.MEASURE_DATE).getMonth()); })
  //     .attr("cy", function (d) { return y(d.COUNT); })
  //     .attr("r", function (d) { return z(d.COUNT); })
  //     .style("fill",function (d) {return getColor(d.TYPE);})
  //     .style("opacity", "0.7")
  //     .attr("stroke", "black")

  //   function getColor(type) {
  //     switch (type) {
  //       case "Screen Failed":
  //         return "yellow"
  //         break;
  //       case "Early Terminated":
  //         return "red"
  //         break;
  //       case "Completed":
  //         return "red"
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  // })