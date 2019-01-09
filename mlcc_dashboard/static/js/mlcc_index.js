
//---------------------------------------------- Aeris API SCRIPT --------------------------------------------------------------->
function GetWeather(info) {
	var codeStr = info['weatherPrimaryCoded'];
	var allCodes = codeStr.split(':');
	var weatherCode = allCodes[2];
	if (info['isDay'] == "True") {
	  var iconAdd = DayWeatherIcon(weatherCode);
	} else {
	  var iconAdd = NightWeatherIcon(weatherCode);
	}
	var time = parseInt(info['timestamp']);
	var timeStamp = new Date(time*1000);
	
	$('#temp h3').html(info['tempF'] + '<i class="wi wi-fahrenheit wi-4x"></i>');
	$('#humidity h3').html(info['humidity'] + '%');
	$('#precip h3').html(info['precipMM'] + ' mm');
	$('#weather h3').html(info['weatherShort']);
	$('#timestamp').html(timeStamp);
	$('#weather h1').html(iconAdd);
}

function DayWeatherIcon(code) {
  var newHtml;
  switch (code) {
    case 'CL':
      newHtml = '<i class="wi wi-day-sunny wi-4x"></i>';
      break;
    case 'FW':
      newHtml = '<i class="wi wi-day-sunny-overcast wi-4x"></i>';
      break;
    case 'SC':
      newHtml = '<i class="wi wi-day-sunny-overcast wi-4x"></i>';
      break;
    case 'BK':
      newHtml = '<i class="wi wi-day-cloudy-high wi-4x"></i>';
      break;
    case 'OV':
      newHtml = '<i class="wi wi-day-cloudy wi-4x"></i>';
      break;
    case 'A':
      newHtml = '<i class="wi wi-day-hail wi-4x"></i>';
      break;
    case 'BD':
      newHtml = '<i class="wi wi-dust wi-4x"></i>';
      break;
    case 'BN':
      newHtml = '<i class="wi wi-sandstorm wi-4x"></i>';
      break;
    case 'BR':
      newHtml = '<i class="wi wi-day-sprinkle wi-4x"></i>';
      break;
    case 'BS':
      newHtml = '<i class="wi wi-day-snow-wind wi-4x"></i>';
      break;
    case 'BY':
      newHtml = '<i class="wi wi-day-rain-wind wi-4x"></i>';
      break;
    case 'F':
      newHtml = '<i class="wi wi-day-fog wi-4x"></i>';
      break;
    case 'FR':
      newHtml = '<i class="wi wi-snowflake-cold wi-4x"></i>';
      break;
    case 'H':
      newHtml = '<i class="wi wi-day-haze wi-4x"></i>';
      break;
    case 'IC':
      newHtml = '<i class="wi wi-snowflake-cold wi-4x"></i>';
      break;
    case 'IF':
      newHtml = '<i class="wi wi-fog wi-4x"></i>';
      break;
    case 'IP':
      newHtml = '<i class="wi wi-day-sleet wi-4x"></i>';
      break;
    case 'K':
      newHtml = '<i class="wi wi-smoke wi-4x"></i>';
      break;
    case 'L':
      newHtml = '<i class="wi wi-day-sprinkle wi-4x"></i>';
      break;
    case 'R':
      newHtml = '<i class="wi wi-day-rain wi-4x"></i>';
      break;
    case 'RW':
      newHtml = '<i class="wi wi-day-showers wi-4x"></i>';
      break;
    case 'RS':
      newHtml = '<i class="wi wi-day-rain-mix wi-4x"></i>';
      break;
    case 'SI':
      newHtml = '<i class="wi wi-day-sleet wi-4x"></i>';
      break;
    case 'WM':
      newHtml = '<i class="wi wi-day-sleet wi-4x"></i>';
      break;
    case 'S':
      newHtml = '<i class="wi wi-day-snow wi-4x"></i>';
      break;
    case 'SW':
      newHtml = '<i class="wi wi-day-snow wi-4x"></i>';
      break;
    case 'T':
      newHtml = '<i class="wi wi-day-thunderstorm wi-4x"></i>';
      break;
    case 'UP':
      newHtml = '<i class="wi wi-cloud wi-4x"></i>';
      break;
    case 'VA':
      newHtml = '<i class="wi wi-volcano wi-4x"></i>';
      break;
    case 'WP':
      newHtml = '<i class="wi wi-tornado wi-4x"></i>';
      break;
    case 'ZF':
      newHtml = '<i class="wi wi-day-fog wi-4x"></i>';
      break;
    case 'ZL':
      newHtml = '<i class="wi wi-day-sprinkle wi-4x"></i>';
      break;
    case 'ZR':
      newHtml = '<i class="wi wi-day-rain wi-4x"></i>';
      break;
    case 'ZY':
      newHtml = '<i class="wi wi-day-showers wi-4x"></i>';
      break;
    default:
      newHtml = '<i class="wi wi-day-sunny wi-4x"></i>';
  }
  return newHtml;
}

function NightWeatherIcon(code) {
  var newHtml;
  switch (code) {
    case 'CL':
      newHtml = '<i class="wi wi-night-clear wi-4x"></i>';
      break;
    case 'FW':
      newHtml = '<i class="wi wi-night-alt-partly-cloudy wi-4x"></i>';
      break;
    case 'SC':
      newHtml = '<i class="wi wi-night-alt-partly-cloudy wi-4x"></i>';
      break;
    case 'BK':
      newHtml = '<i class="wi wi-night-alt-cloudy-high wi-4x"></i>';
      break;
    case 'OV':
      newHtml = '<i class="wi wi-night-alt-cloudy wi-4x"></i>';
      break;
    case 'A':
      newHtml = '<i class="wi wi-night-alt-hail wi-4x"></i>';
      break;
    case 'BD':
      newHtml = '<i class="wi wi-dust wi-4x"></i>';
      break;
    case 'BN':
      newHtml = '<i class="wi wi-sandstorm wi-4x"></i>';
      break;
    case 'BR':
      newHtml = '<i class="wi wi-night-alt-sprinkle wi-4x"></i>';
      break;
    case 'BS':
      newHtml = '<i class="wi wi-night-alt-snow-wind wi-4x"></i>';
      break;
    case 'BY':
      newHtml = '<i class="wi wi-night-alt-rain-wind wi-4x"></i>';
      break;
    case 'F':
      newHtml = '<i class="wi wi-night-fog wi-4x"></i>';
      break;
    case 'FR':
      newHtml = '<i class="wi wi-snowflake-cold wi-4x"></i>';
      break;
    case 'H':
      newHtml = '<i class="wi wi-night-clear wi-4x"></i>';
      break;
    case 'IC':
      newHtml = '<i class="wi wi-snowflake-cold wi-4x"></i>';
      break;
    case 'IF':
      newHtml = '<i class="wi wi-night-fog wi-4x"></i>';
      break;
    case 'IP':
      newHtml = '<i class="wi wi-night-alt-sleet wi-4x"></i>';
      break;
    case 'K':
      newHtml = '<i class="wi wi-smoke wi-4x"></i>';
      break;
    case 'L':
      newHtml = '<i class="wi wi-night-sprinkle wi-4x"></i>';
      break;
    case 'R':
      newHtml = '<i class="wi wi-night-rain wi-4x"></i>';
      break;
    case 'RW':
      newHtml = '<i class="wi wi-night-showers wi-4x"></i>';
      break;
    case 'RS':
      newHtml = '<i class="wi wi-night-alt-rain-mix wi-4x"></i>';
      break;
    case 'SI':
      newHtml = '<i class="wi wi-night-alt-sleet wi-4x"></i>';
      break;
    case 'WM':
      newHtml = '<i class="wi wi-night-alt-sleet wi-4x"></i>';
      break;
    case 'S':
      newHtml = '<i class="wi wi-night-alt-snow wi-4x"></i>';
      break;
    case 'SW':
      newHtml = '<i class="wi wi-night-alt-snow wi-4x"></i>';
      break;
    case 'T':
      newHtml = '<i class="wi wi-night-alt-thunderstorm wi-4x"></i>';
      break;
    case 'UP':
      newHtml = '<i class="wi wi-cloud wi-4x"></i>';
      break;
    case 'VA':
      newHtml = '<i class="wi wi-volcano wi-4x"></i>';
      break;
    case 'WP':
      newHtml = '<i class="wi wi-tornado wi-4x"></i>';
      break;
    case 'ZF':
      newHtml = '<i class="wi wi-night-fog wi-4x"></i>';;
      break;
    case 'ZL':
      newHtml = '<i class="wi wi-night-alt-sprinkle wi-4x"></i>';
      break;
    case 'ZR':
      newHtml = '<i class="wi wi-night-alt-rain wi-4x"></i>';
      break;
    case 'ZY':
      newHtml = '<i class="wi wi-night-alt-showers wi-4x"></i>';
      break;
    default:
      newHtml = '<i class="wi wi-night-clear wi-4x"></i>';
  }
  return newHtml;
}



//---------------------------------------------- D3 GAUGE SCRIPT --------------------------------------------------------------->
var gauge = function(container, configuration) {
	var that = {};
	var config = {
		size						: 710,
		clipWidth					: 200,
		clipHeight					: 110,
		ringInset					: 20,
		ringWidth					: 20,
		
		pointerWidth				: 10,
		pointerTailLength			: 5,
		pointerHeadLengthPercent	: 0.9,
		
		minValue					: 0,
		maxValue					: 12,
		
		minAngle					: -90,
		maxAngle					: 90,
		
		transitionMs				: 750,
		
		majorTicks					: 4,
		labelFormat					: d3.format('d'),
		labelInset					: 10,
		
		arcColorFn					: d3.interpolateHsl(d3.rgb('#00b300'), d3.rgb('#e7004e'))
	};
	var range = undefined;
	var r = undefined;
	var pointerHeadLength = undefined;
	var value = 0;
	
	var svg = undefined;
	var arc = undefined;
	var scale = undefined;
	var ticks = undefined;
	var tickData = undefined;
	var pointer = undefined;

	var donut = d3.pie();
	
	function deg2rad(deg) {
		return deg * Math.PI / 180;
	}
	
	function newAngle(d) {
		var ratio = scale(d);
		var newAngle = config.minAngle + (ratio * range);
		return newAngle;
	}
	
	function configure(configuration) {
		var prop = undefined;
		for ( prop in configuration ) {
			config[prop] = configuration[prop];
		}
		
		range = config.maxAngle - config.minAngle;
		r = config.size / 2;
		pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

		// a linear scale that maps domain values to a percent
		scale = d3.scaleLinear()
			.range([0,1])
			.domain([config.minValue, config.maxValue]);
			
		/* ticks = scale.ticks(config.majorTicks); */
		ticks = [0,3,6,9,12];	
		tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
		
		arc = d3.arc()
			.innerRadius(r - config.ringWidth - config.ringInset)
			.outerRadius(r - config.ringInset)
			.startAngle(function(d, i) {
				var ratio = d * i;
				return deg2rad(config.minAngle + (ratio * range));
			})
			.endAngle(function(d, i) {
				var ratio = d * (i+1);
				return deg2rad(config.minAngle + (ratio * range));
			});
	}
	that.configure = configure;
	
	function centerTranslation() {
		return 'translate('+r +','+ r +')';
	}
	
	function isRendered() {
		return (svg !== undefined);
	}
	that.isRendered = isRendered;
	
	function render(newValue) {
		svg = d3.select(container)
				.append('svg:svg')
				.attr('class', 'gauge')
				.attr('width', config.clipWidth)
				.attr('height', config.clipHeight);
		
		var centerTx = centerTranslation();
		
		var arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);
		
				arcs.selectAll('path')
				.data(tickData)
				.enter().append('path')
				.attr('fill', function(d, i) {
					return config.arcColorFn(d * i);
				})
				.attr('d', arc);
		
		var lg = svg.append('g')
				.attr('class', 'label')
				.attr('transform', centerTx);
				lg.selectAll('text')
				.data(ticks)
				.enter().append('text')
				.attr('transform', function(d) {
					var ratio = scale(d);
					var newAngle = config.minAngle + (ratio * range);
					return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
				})
				.text(config.labelFormat);

		var lineData = [ [config.pointerWidth / 2, 0], 
						[0, -pointerHeadLength],
						[-(config.pointerWidth / 2), 0],
						[0, config.pointerTailLength],
						[config.pointerWidth / 2, 0] ];
		var pointerLine = d3.line().curve(d3.curveLinear)
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('transform', centerTx);
				
		pointer = pg.append('path')
			.attr('d', pointerLine)
			.attr('transform', 'rotate(' +config.minAngle +')');
			
		update(newValue === undefined ? 0 : newValue);
	}
	that.render = render;
	
	function update(newValue, newConfiguration) {
		if ( newConfiguration  !== undefined) {
			configure(newConfiguration);
		}
		var ratio = scale(newValue);
		var newAngle = config.minAngle + (ratio * range);
		pointer.transition()
			.duration(config.transitionMs)
			.ease(d3.easeElastic)
			.attr('transform', 'rotate(' +newAngle +')');
	}
	that.update = update;

	configure(configuration);
	
	return that;
};



//---------------------------------------------- TOP 10 PIE CHART SCRIPT --------------------------------------------------------------->
function pieChartTop10(datasetOption1, datasetOption2){	
	d3.selectAll("input").on("change", selectDataset); 
		
  	var width = 480,
		height = 220,
		radius = Math.min(width, height) / 2;
		
	var svg = d3.select("#svg1")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "labelName");
	svg.append("g")
		.attr("class", "lines");	

	var pie = d3.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.4);

	var outerArc = d3.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	var tooltip = d3.select("#piechart").append("div").attr("class", "toolTip");	

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	
	var percFormat = d3.format(',.2%');
	
	change(datasetOption1);	
    d3.select("input[value=\"option1\"]").property("checked", true);	
	
		
	function selectDataset()
	{
		var value = this.value;
		if (value == "option1")
		{
			change(datasetOption1);
		}
		else
		{
			change(datasetOption2);
		}
	}		
		
	function change(data) {
		/* ------- PIE SLICES -------*/
		var slice = svg.select(".slices").selectAll("path.slice")
			.data(pie(data), function(d){ 
				return d.data.label });
				
		// Exit
		slice.exit().remove();
				
		// Enter and merge with udpate selection:
		slice = slice.enter()
    			.insert("path")
    			.style("fill", function(d) { return color(d.data.label); })
    				.style("opacity", 0.7)
    			.attr("class", "slice").merge(slice);

		slice
			.transition().duration(1000)
			.attrTween("d", function(d) {
				var node = this;
				node._current = node._current || d;
				var interpolate = d3.interpolate(node._current, d);
				node._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			})
		slice
			.on("mousemove", function(d){
                tooltip.style("left", (d3.event.pageX - 200) + "px")		
                tooltip.style("top", (d3.event.pageY - 600) + "px");	
				tooltip.style("display", "inline-block");
				tooltip.html((d.data.label) + "<br>" + (d.data.total));
			});
		slice
			.on("mouseout", function(d){
				tooltip.style("display", "none");
			});

		slice.exit().remove();

		
		/* ------- TEXT LABELS -------*/
		var text = svg.select(".labelName").selectAll("text")
			.data(pie(data), function(d){ return d.data.label });
			
		// Exit
		text.exit().remove();
				
		//Enter and merge
		text = text.enter()
			.append("text")
			.attr("dy", ".35em").merge(text)
			.text(function(d) {
				return (d.data.label + ": " + d.value + "%");
			});

		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		text
			.transition().duration(1000)
			.attrTween("transform", function(d) {
				var node = this;
				node._current = node._current || d;
				var interpolate = d3.interpolate(node._current, d);
				node._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				var node = this;
				node._current = node._current || d;
				var interpolate = d3.interpolate(node._current, d);
				node._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			})
			.text(function(d) {
				return (d.data.label + ": " + d.value + "%");
			});

		text.exit().remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/
		var polyline = svg.select(".lines").selectAll("polyline")
			.data(pie(data), function(d){ return d.data.label });
			
		// Exit
		polyline.exit().remove();		

		//Enter and merge
		polyline = polyline.enter()
			.append("polyline")
			.attr("class", "lines").merge(polyline);

		polyline.transition().duration(1000)
			.attrTween("points", function(d){
				var node = this;
				node._current = node._current || d;
				var interpolate = d3.interpolate(node._current, d);
				node._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

		polyline.exit()
			.remove();
	};
		

}