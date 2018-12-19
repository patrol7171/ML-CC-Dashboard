
//*************************  GRAPH 1 ******************************
function chartSet(id, cData){
	var barColor = '#403D3C';
	function segColor(c){ return {Drought:"#8224b5",Flooding:"#e08214",Freeze:"#3133c4",'Severe Storm':"#f442f4",'Tropical Cyclone':"#42ebf4",Wildfire:"#2b8223",'Winter Storm':"#f4e542"}[c]; }
	
	// compute total for each years set.
	var sumValues = obj => Object.values(obj).reduce((a, b) => a + b);
	cData.forEach(function(d){d.total = sumValues(d.event)});
	
	// function to handle histogram.
	function histoGram(fD){
		var hG={},    hGDim = {t: 60, r: 0, b: 60, l: 0};
		hGDim.w = 450 - hGDim.l - hGDim.r, 
		hGDim.h = 300 - hGDim.t - hGDim.b;
			
		//create svg for histogram.
		var hGsvg = d3.select("#barsvg")
			.attr("width", hGDim.w + hGDim.l + hGDim.r)
			.attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
			.attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

		// create function for x-axis mapping.
		var x = d3.scaleBand()
			.rangeRound([0, hGDim.w])
			.padding([0.1])
			.domain(fD.map(function(d) { return d[0]; }));
			
		// Add x-axis to the histogram svg.
		hGsvg.append("g").attr("class", "x axis")
			.attr("transform", "translate(0," + hGDim.h + ")")
			.call(d3.axisBottom().scale(x)) 			
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");

		// Create function for y-axis map.
		var y = d3.scaleLinear().range([hGDim.h, 0])
				.domain([0, d3.max(fD, function(d) { return d[1]; })]);

		// Create bars for histogram to contain rectangles and event labels.
		var bars = hGsvg.selectAll(".bar").data(fD).enter()
				.append("g").attr("class", "bar");
		
		//create the rectangles.
		bars.append("rect")
			.attr("x", function(d) { return x(d[0]); })
			.attr("y", function(d) { return y(d[1]); })
			.attr("width", x.bandwidth()) 
			.attr("height", function(d) { return hGDim.h - y(d[1]); })
			.attr('fill',barColor)
			.on("mouseover",mouseover)// mouseover is defined below.
			.on("mouseout",mouseout);// mouseout is defined below.
			
		//Create the event totals labels above the rectangles.
		bars.append("text").text(function(d){ return d3.format("$,")(d[1])})
			.attr("x", function(d) { return x(d[0])+x.bandwidth()/2; }) 
			.attr("y", function(d) { return y(d[1])-5; })
			.attr("text-anchor", "middle");
		
		function mouseover(d){  // utility function to be called on mouseover.
			// filter for selected years.
			var st = cData.filter(function(s){ return s.Years == d[0];})[0],		
				nD = d3.keys(st.event).map(function(n){						
					return {type:n, cost:st.event[n]};});	
			// sort the data keys to match the legend table
			nD.sort( function( a, b ) {
				return a.type < b.type ? -1 : a.type > b.type ? 1 : 0;
			});						
			// call update functions of pie-chart and legend.    
			pC.update(nD);
			legTbl.update(nD);
		}
		
		function mouseout(d){  // utility function to be called on mouseout.
			// reset the pie-chart and legend   
			pC.update(tF);
			legTbl.update(tF);
		}
		
		// create function to update the bars. This will be used by pie-chart.
		hG.update = function(nD, color){
			// update the domain of the y-axis map to reflect change in event totals.
			y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
			
			// Attach the new data to the bars.
			var bars = hGsvg.selectAll(".bar").data(nD);
			
			// transition the height and color of rectangles.
			bars.select("rect").transition().duration(500)
				.attr("y", function(d) {return y(d[1]); })
				.attr("height", function(d) { return hGDim.h - y(d[1]); })
				.attr("fill", color);

			// transition the event total labels location and change value.
			bars.select("text").transition().duration(500)
				.text(function(d){ return d3.format("$,")(d[1])})
				.attr("y", function(d) {return y(d[1])-5; });            
		}        
		return hG;
	}
	
	// function to handle pieChart
	function pieChart(pD){
		var pC ={}, pieDim ={w:250, h: 250};
		pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
				
		// create svg for pie chart.
		var piesvg = d3.select("#piesvg")
			.attr("width", pieDim.w).attr("height", pieDim.h).append("g")
			.attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
		
		// create function to draw the arcs of the pie slices.
		var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

		// create a function to compute the pie slice angles.
		var pie = d3.pie().sort(null).value(function(d) { return d.cost; });

		// Draw the pie slices.
		piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
			.each(function(d) { this._current = d; })
			.style("fill", function(d) { return segColor(d.data.type); })
			.on("mouseover",mouseover).on("mouseout",mouseout);

		// create function to update pie-chart. This will be used by histogram.
		pC.update = function(nD){
			piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
				.attrTween("d", arcTween);
		}        
		// Utility function to be called on mouseover a pie slice.
		function mouseover(d){
			// call the update function of histogram with new data.
			hG.update(cData.map(function(v){ 
				return [v.Years,v.event[d.data.type]];}),segColor(d.data.type));
		}
		//Utility function to be called on mouseout a pie slice.
		function mouseout(d){
			// call the update function of histogram with all data.
			hG.update(cData.map(function(v){
				return [v.Years,v.total];}), barColor);
		}
		// Animating the pie-slice requiring a custom function which specifies
		// how the intermediate paths should be drawn.
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) { return arc(i(t));    };
		}    
		return pC;
	}
	
	// function to handle legend
	function legend(lD){
		var leg = {};	
		// create table for legend.
		var legend = d3.select(id).append("table").attr('class','legend');
		
		// create one row per segment.
		var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
			
		// create the first column for each segment.
		tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
			.attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
			
		// create the second column for each segment.
		tr.append("td").text(function(d){ return d.type;});

		// create the third column for each segment.
		tr.append("td").attr("class",'legendCost')
			.text(function(d){ return d3.format("$,")(d.cost);});

		// create the fourth column for each segment.
		tr.append("td").attr("class",'legendPerc')
			.text(function(d){ return getLegendPerc(d,lD);});

		// Utility function to be used to update the legend.
		leg.update = function(nD){
			// update the data attached to the row elements.
			var l = legend.select("tbody").selectAll("tr").data(nD);

			// update the event cost totals
			l.select(".legendCost").text(function(d){ return d3.format("$,")(d.cost);});

			// update the percentage column.
			l.select(".legendPerc").text(function(d){ return getLegendPerc(d,nD);});        
		}
		
		function getLegendPerc(d,aD){ // Utility function to compute percentage.
			return d3.format(".1%")(d.cost/d3.sum(aD.map(function(v){ return v.cost; })));
		}
		
		return leg;
	}
			
	// calculate total of events by segment for all year ranges.  
	const disasters = ['Drought','Flooding','Freeze','Severe Storm','Tropical Cyclone','Wildfire','Winter Storm']
	var tF = disasters.map(function(d){
		return {type:d, cost: d3.sum(cData.map(function(t){ 
			if (!t.event[d]) {t.event[d] = 0;}; 
			return t.event[d];}))}; 			
	}); 		
	// calculate total event cost per capita by years for all segments.
	var sF = cData.map(function(d){return [d.Years,d.total];});		
	var hG = histoGram(sF), // create the histogram.
		pC = pieChart(tF), // create the pie-chart
		legTbl = legend(tF);  // create the legend.
		
}


//*********************************************  GRAPH 2  *********************************************
function graph2(id, dData){
	function flatten (obj) {
	  var newObj = {};
	  for (var key in obj) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
		  var temp = flatten(obj[key])
		  for (var key2 in temp) {
			newObj[key2] = temp[key2];
		  }
		} else {
		  newObj[key] = obj[key];
		}
	  }
	  return newObj;
	}
	
	var data = [];
	dData.forEach(function(d){
		var newObj = flatten(d);
		data.push(newObj);
	});
		
	var svg = d3.select("#svg2"),
	margin = {
	  top: 5,
	  right: 25,
	  bottom: 65,
	  left: 100
	},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(30," + margin.top + ")");

	var x = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.05)
	.align(0.1);

	var y = d3.scaleLinear()
	.rangeRound([height, 0]);

	var z = d3.scaleOrdinal()
	.range(["#8224b5", "#e08214", "#3133c4", "#f442f4", "#42ebf4", "#2b8223", "#f4e542"]);

	var keys = ['Drought','Flooding','Freeze','Severe Storm','Tropical Cyclone','Wildfire','Winter Storm'];
	
	data.forEach(function(d){
		d.total = 0;
		keys.forEach(function(k){
		  if (!d[k]) { d[k] = 0;}; 
		  d.total += d[k];
		})
	});

	x.domain(data.map(function(d) {
		return d.Years;
	}));
	
	y.domain([0, d3.max(data, function(d) {
		return d.total;
	})]).nice();
	
	z.domain(keys);

	g.append("g")
	.selectAll("g")
	.data(d3.stack().keys(keys)(data))
	.enter().append("g")
	.attr("fill", function(d) {
	  return z(d.key);
	})
	.selectAll("rect")
	.data(function(d) {
	  return d;
	})
	.enter().append("rect")
	.attr("x", function(d) {
	  return x(d.data.Years);
	})
	.attr("y", function(d) {
	  return y(d[1]);
	})
	.attr("height", function(d) {
	  return y(d[0]) - y(d[1]);
	})
	.attr("width", x.bandwidth())	
	// tooltip code
	.on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });
		
	g.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
	.attr("font-size", 10)
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", "rotate(-50)");

	g.append("g")
	.attr("class", "axis")
	.call(d3.axisLeft(y).ticks(null, "s"))
	.append("text")
	.attr("x", 2)
	.attr("y", y(y.ticks().pop()) + 0.5)
	.attr("dy", "0.32em")
	.attr("fill", "#000")
	.attr("font-weight", "bold")
	.attr("font-size", 10)
	.attr("text-anchor", "start")
	.text("Death Toll");
	
	var legendHolder = svg.append('g')
	  // translate the legend holder to the right side of the graph
	  .attr('transform', "translate(120,0)");	  

	var legend = legendHolder.selectAll(".legend")
		.data(keys.slice())		
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")

		legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z);

		legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) {
		  return d;
		});

	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	.attr("class", "tooltip1")
	.style("display", "none");
	  
	tooltip.append("rect")
	.attr("width", 60)
	.attr("height", 20)
	.attr("fill", "white")
	.style("opacity", 0.7);

	tooltip.append("text")
	.attr("x", 30)
	.attr("dy", "1.2em")
	.style("text-anchor", "middle")
	.attr("font-size", "12px")
	.attr("font-weight", "bold");	
		
}



//********************************************  GRAPH 3  *********************************************
function graph3(id, data1, data2){
	d3.selectAll("input").on("change", selectDataset);	
	function selectDataset() {
        var value = this.value;
        if (value == "option1")
        { change(data1);}
        else
        { change(data2);}
    }
	
	var div = d3.select("#svg3"), 
	margin = {top: 20, right: 10, bottom: 30, left: 275},
	width = +div.attr("width") - margin.left - margin.right,
	height = +div.attr("height") - margin.top - margin.bottom;
		  
	var tooltip = d3.select("body").append("div").attr("class", "tooltip2");
	  
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleBand().range([height, 0]);
	
	var xAxis = d3.axisBottom(x).ticks(10).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]);
    var yAxis = d3.axisLeft(y);
	
	var svg = d3.selectAll("#svg3")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
	d3.select("input[value=\"option1\"]").property("checked", true);
    change(data1);	
		
    function change(dataset) {		
		dataset.sort(function(a, b) { return a.value - b.value; });	
		
		svg.selectAll("g > *").remove();		
		
		y.domain(dataset.map(function(d) { return d.label; })).padding(0.1);			
		x.domain([0, d3.max(dataset, function(d) { return d.value; })]);	
		
		svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);				

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(0)")
			.attr("x", 50)
			.attr("dx", ".1em");				
			
		var bar = svg.selectAll(".bar")
			.data(dataset, function(d) { return d.label; });
			
		bar.enter()
			.append("rect")
			.attr("class", "bar")
			.on("mousemove", function(d){
				tooltip
				  .style("left", d3.event.pageX - 50 + "px")
				  .style("top", d3.event.pageY - 70 + "px")
				  .style("display", "inline-block")
				  .html((d.label) + "<br>" + (d.value));
				})
			.on("mouseout", function(d){ tooltip.style("display", "none");})
			.attr("x", 0)
			.attr("y", function(d) { return y(d.label); })
			.transition().duration(1000)
			.ease(d3.easeLinear)
			.attr("width", function(d) { return x(d.value); })	
			.attr("height", y.bandwidth());			
	};

}