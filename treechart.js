/*
level_names example: ['level_0_title', 'level_1_title', 'level_2_title', ...]
measure_1 example: 'budget_usd'. Will be used for sizing the rects in the tree.
measure_2 example: 'actual_usd'. Can be used to compute a actual/budget ratio.
*/ 
function buildHierarchy(flat_data, level_names, measure_1, measure_2=null, measure_3=null,measure_4=null,measure_5=null, 
measure_6=null,measure_7=null,percent=false, numerator=null, denom=null, color_measure=null, tooltip_measures=null) {
  var nest = d3.nest().rollup(function(leaves) {
    var sums = {};
    sums[measure_1] = d3.sum(leaves, l => l[measure_1]) ;
    if (measure_2) {
      sums[measure_2] = d3.mean(leaves, l => l[measure_2]);
    }
    if (measure_3) {
      sums[measure_3] = d3.sum(leaves, l => l[measure_3]);
    }
    if (measure_4) {
      sums[measure_4] = d3.sum(leaves, l => l[measure_4]);
    }
    if (measure_5) {
      sums[measure_5] = d3.sum(leaves, l => l[measure_5]);
    }
    if (measure_6) {
      sums[measure_6] = d3.sum(leaves, l => l[measure_6]);
    }
    if (measure_7) {
      sums[measure_7] = d3.sum(leaves, l => l[measure_7]);
    }
    return sums;
  });
  // If first level is not a unique grandparent, create one!
  var first_level = d3.map(flat_data, d => d[level_names[0]]).keys();
  if (first_level.length > 1) {
    nest = nest.key(function(d) {return 'All';});
  }
  // Add all level columns into nesting structure.
  level_names.forEach(function(level) {
    nest = nest.key(function(d) {return d[level]});
  });
  var data = nest.entries(flat_data)[0];

  // Start the d3.hierarchy magic.  
  var root = d3.hierarchy(data, (d) => d.values)
    // Computes a 'value' property for all nodes.
    .sum((d) => d['value'] ? d['value'][measure_1] : 0) 
    .sort(function(a, b) { return b.value - a.value; });
  
  if (measure_2) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_2] = leaf.data.value[measure_2];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_2] = leaf[measure_2] + (node[measure_2] || 0);
      });
    });
  }
  
  if (measure_3) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_3] = leaf.data.value[measure_3];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_3] = leaf[measure_3] + (node[measure_3] || 0);
      });
    });
  }

  if (measure_4) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_4] = leaf.data.value[measure_4];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_4] = leaf[measure_4] + (node[measure_4] || 0);
      });
    });
  }
  if (measure_5) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_5] = leaf.data.value[measure_5];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_5] = leaf[measure_5] + (node[measure_5] || 0);
      });
    });
  }
  if (measure_6) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_6] = leaf.data.value[measure_6];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_6] = leaf[measure_6] + (node[measure_6] || 0);
      });
    });
  }
  if (measure_7) {
    // Compute the second measure for all nodes, starting with leaves.
    root.leaves().forEach(function(leaf) {
      leaf[measure_7] = leaf.data.value[measure_7];
      // Accumulate this second_measure up the tree.
      leaf.ancestors().forEach(function(node, idx){
        if (idx == 0) {return;} // excluding itself
        node[measure_7] = leaf[measure_7] + (node[measure_7] || 0);
      });
    });
  }
  // Prune the tree - remove repeated leaf nodes
  prune(root);

  // console.log(root);

  function prune(node) {
    if (!node.children) { 
      return; 
    }
    if (node.children.length > 1) {
      node.children.forEach(n => prune(n));
    } else {
      delete node.children;
    }
  }

  // Compute the aggregate measure for all nodes, starting with leaves.
  root.each(function(node) {
    node[measure_1] = node.value;
    if (percent) {
      // Repeat the size_measure so that it is available for computation.
      node['percent'] = (node[numerator] / node[denom]) || 0;
      node.percent = Math.min(1, Math.max(0, node.percent));
    }
    if (color_measure) {
      node['color_metric'] = node[color_measure];
    }
  });
  return root;
}

function drawChart(hierData, color_measure=null, color_range=null, tooltip_measures=null) {
  // Clear any existing svg elements
//   d3.selectAll('svg').remove();

  var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = document.getElementById("treechart").offsetWidth,
      height = document.getElementById("treechart").offsetHeight - margin.top - margin.bottom,
      formatNumber = d3.format(",d"),
      padding = 2,
      transitioning;

  var x = d3.scaleLinear()
      .domain([0, width])
      .range([0, width]);

  var y = d3.scaleLinear()
      .domain([0, height])
      .range([0, height]);

  // A function that computes x0, x1, y0, y1 for nodes in a given hierarchy.
  const treemap = d3.treemap().size([width, height])
     .paddingOuter(padding);

  var svg = d3.select("#treechart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

  var grandparent = svg.append("g")
      .attr("class", "grandparent");

  grandparent.append("rect")
      .attr("x", padding * 2)
      .attr("y", -margin.top)
      .attr("width", width - padding * 4)
      .attr("height", margin.top);

  grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

  var color;
  var color_accessor;
  if (color_measure != null) {
    color = d3.scaleLinear()
      .range(color_range || ['#ffb300', '#ADD8E6', '#03A9F4'])
      .domain(colorDomain());
    color_accessor = function(d) { return color(d.color_metric); };
  } else {
    color = d3.scaleOrdinal().range(color_range || d3.schemeCategory20c);
    color_accessor = function(d) { return color(d.data.key); };
  }

  treemap(hierData);
  display(hierData);

  function colorDomain() {
    var root = hierData;
    color_values = [];
    if (!root.children) {
      color_values = [root.color_metric];
      return;
    }
    root.children.forEach(child => {
      if (child.children && child.children.length) {
        child.children.forEach(grandchild => {
          color_values.push(grandchild.color_metric);
        });
      } else {
        color_values.push(child.color_metric);
      }
    });
    return [d3.min(color_values), d3.mean(color_values), d3.max(color_values)];
  }

  function display(d) {
    var grandparent_color_metric = d.color_metric;
    grandparent
        // Attach zoom function -- works after 1st zoom, when node has 'parent'
        .datum(d.parent)
        .on("click", zoom)
      .select("text")
        // Name for grandparent is the hierarchical path
        .text(name(d) + ": " + formatNumber(d.value));
    grandparent.select('rect')
        .style("fill", function(d) { return color(grandparent_color_metric); });
    
    // g1 = main graphical element to hold the tree, inserted after the top g.
    // g1 is "the grandparent", even though the top g holds the text about it.
    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");
    
    // Within g1, create g's for the "parents" (children of grandparent)
    var g = g1.selectAll("g")
        .data(d.children)
      .enter().append("g");
    
    // Attach zoom function to to parents who have children.
    g.filter(function(d) { return d.children; })
        .classed("hasChildren", true)
        .on("click", zoom);
    
    // Within each parent g, add g's to hold rect + text for each child.
    var children = g.selectAll(".child")
        .data(function(d) { return d.children || [d]; })
      .enter().append("g");
    children.append("rect")
        .attr("class", "child")
        .call(rect)
        .style("fill", color_accessor)
        .on("mousemove", d => mousemove(d))
        .on("mouseout", mouseout);
      // .append("title")
      //   .text(function(d) {return d.data.key + " (" + formatNumber(d.value) + ")";});
    children.append("text")
        .attr("class", "ctext")
        .text(function(d) {return d.data.key;})
        .call(childrenText);

    // Even though all children are rects, parents are also presented as rects.
    g.append("rect")
        .attr("class", "parent")
        .call(rect);

    var t = g.append("text")
        .attr("class", "ptext")
        .attr("dy", ".75em")
    t.append("tspan")
        .text(function(d) { return d.data.key; });
    t.append("tspan")
        .attr("dy", "1.0em")
        .text(function(d) { return formatNumber(d.value); });
    t.call(parentText);

    // Draw/move child nodes on top of parent nodes.
    svg.selectAll(".depth").sort(function(a, b) {return a.depth - b.depth;});

    // FIXME: Move to private function 
    function zoom(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d);
      // At this point in time, g1 with its rects are still in place.
      // The parent that has just been promoted to grandparent now has 2 levels
      // of rects visualized, but still positioned exactly where it was.

      var t1 = g1.transition().duration(750);
      var t2 = g2.transition().duration(750);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // // Draw/move child nodes on top of parent nodes.
      // svg.selectAll(".depth").sort(function(a, b) {return a.depth - b.depth;});

      // Update the domain only after entering new elements (within display()).
      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);

      // This moves all rects into the right position & width/height.
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition texts to the new view.
      t1.selectAll(".ptext").call(parentText).style("fill-opacity", 0);
      t1.selectAll(".ctext").call(childrenText).style("fill-opacity", 0);
      t2.selectAll(".ptext").call(parentText).style("fill-opacity", 1);
      t2.selectAll(".ctext").call(childrenText).style("fill-opacity", 1);

      // Remove the old node when the transition is finished.
      t1.remove().on("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function parentText(text) {
    text.selectAll("tspan")
        .attr("x", function(d) { return x(d.x0) + 6; });
    text.attr("x", function(d) { return x(d.x0) + 6; })
        .attr("y", function(d) { return y(d.y0) + 6; })
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x1) - x(d.x0) - 6 ? 1 : 0; });
  }

  function childrenText(text) {
    text.attr("x", function(d) { return x(d.x1) - this.getComputedTextLength() - 6; })
        .attr("y", function(d) { return y(d.y1) - 6; })
        .style("opacity", function(d) { return this.getComputedTextLength() < x(d.x1) - x(d.x0) - 6 ? 1 : 0; });
  }


  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x0); })
        .attr("y", function(d) { return y(d.y0); })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); })
        .attr("height", function(d) { return y(d.y1) - y(d.y0); });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + " / " + d.data.key
        : d.data.key;
  }

  function mousemove(d) {
    var xPosition = d3.event.pageX + 5;
    var yPosition = d3.event.pageY + 5;

    d3.select("#tooltip")
      .style("width","max-content")
      .style("background-color", color(d.color_metric))
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    d3.select("#tooltip #heading")
      .text(d.data.key);
    tooltip_measures.forEach(m => {
      d3.select("#tooltip #" + m.key + "_title")
        .text(m.title);
      // console.log(m,d,d[m.key],d[m.measure])
      d3.select("#tooltip #" + m.key)
        .text(m.format ? d3.format(m.format)(d[m.measure]) : d[m.measure]);
    });
      
    d3.select("#tooltip").classed("hidden", false);
  };

  function mouseout() {
    d3.select("#tooltip").classed("hidden", true);
  };
}


d3.csv('site_enrollment_summary.csv', function(error, data) {
  // console.log(data);
  // Data source: https://datahub.io/dataset/global-city-population-estimates
  // Region lookup source: 
  // https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/master/all/all.csv
  // var hier = [
  //   'Region',
  //   'SubRegion',
  //   'CountryOrArea',
  //   'UrbanAgglomeration'
  // ];
  var hier = [
    'Region',
    'Status',
    'Site'
  ];
  // optional, but must be [min, med, max];
  color_range =  ['green', 'orange','red']; 
  var tooltip_measures = [
    {
      "key": "tooltip_measure_1",
      "title": 'Count of sites:',
      "measure": 'dummy1'
    },
    {
      "key": "tooltip_measure_2",
      "title": 'Screened (Actual Cumulative):',
      "measure": 'Screened (Actual Cumulative)'
    },
    {
      "key": "tooltip_measure_3",
      "title": 'Screen Failure:',
      "measure": 'Screen Failure'
    },
    {
      "key": "tooltip_measure_4",
      "title": 'Enrolled (Actual Cumulative):',
      "measure": 'Enrolled (Actual Cumulative)'
    },
    {
      "key": "tooltip_measure_5",
      "title": 'Early Terminated:',
      "measure": 'Early Terminated'
    },
    {
      "key": "tooltip_measure_6",
      "title": 'Completed:',
      "measure": 'Completed'
    },
    {
      "key": "tooltip_measure_7",
      "title": 'Screen Failure:',
      "measure": 'Screen Failure'
    },
    {
      "key": "tooltip_measure_8",
      "title": 'Subject Deviation Rate:',
      "measure": 'Subject Deviation Rate'
    }
  ];
  
  var hierarchical_data = 
    // buildHierarchy(
    //   data, 
    //   hier, 
    //   '2015', 
    //   '2025', 
    //   '2015_2025_delta',
    //   true, // Tell it to compute a percentage
    //   '2015_2025_delta', // numerator
    //   '2015', // denominator
    //   'percent', // color_measure
    //   tooltip_measures
    // );
    buildHierarchy(
      data, 
      hier, 
      'dummy1', 
      'Screen Failure', 
      'Subject Deviation Rate',
      'Early Terminated',
      'Completed',
      'Screened (Actual Cumulative)', // numerator
      'Enrolled (Actual Cumulative)', // denominator
      true, // Tell it to compute a percentage
      'Screened (Actual Cumulative)', // numerator
      'Enrolled (Actual Cumulative)', // denominator
      'Screen Failure', // color_measure
      tooltip_measures
    );

  drawChart(
    hierarchical_data,
    'percent',
    color_range,
    tooltip_measures
  );
});