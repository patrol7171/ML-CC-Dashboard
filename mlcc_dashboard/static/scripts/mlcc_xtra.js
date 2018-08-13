/* 
var default_url = "/Total_CPI_Adjusted_Cost_Millions";
Plotly.d3.json(default_url, function(error, response) {
	if (error) return console.warn(error);
	var data = [response];
	var layout = { margin: { t: 20, b:120 } }
	Plotly.plot("bar", data, layout)
})

// Update the plot with new data
function updatePlotly(newdata) {
	var Bar = document.getElementById('bar');
	Plotly.restyle(Bar, 'x', [newdata.x])
	Plotly.restyle(Bar, 'y', [newdata.y])
}

// Get new data whenever the dropdown selection changes
function getData(route) {
	console.log(route);
	Plotly.d3.json(`/${route}`, function(error, data) {
		console.log("newdata", data);
		updatePlotly(data);
	});
}
 */
 
 var default_url = "/Total_CPI_Adjusted_Cost_Millions";
Plotly.d3.json(default_url, function(error, response) {
	if (error) return console.warn(error);
	var data = [response];
	var layout = { margin: { t: 20, b:120 } }
	Plotly.plot("bar", data, layout)
})

// Update the plot with new data
function updatePlotly(newdata) {
	var Bar = document.getElementById('bar');
	Plotly.restyle(Bar, 'x', [newdata.x])
	Plotly.restyle(Bar, 'y', [newdata.y])
}

// Get new data whenever the dropdown selection changes
function getData(route) {
	console.log(route);
	Plotly.d3.json(`/${route}`, function(error, data) {
		console.log("newdata", data);
		updatePlotly(data);
	});
}

//******* 2012 Average Temperature - BAR CHART
var data = [    
	[0, 11], //London, UK
	[1, 15], //New York, USA
	[2, 25], //New Delhi, India
	[3, 24], //Taipei, Taiwan
	[4, 13], //Beijing, China
	[5, 18]  //Sydney, AU
];

var dataset = [
	{ label: "2012 Average Temperature", data: data, color: "#5482FF" }
];

var ticks = [
	[0, "London"], [1, "New York"], [2, "New Delhi"], [3, "Taipei"],
	[4, "Beijing"], [5, "Sydney"]
];


var options = {
	series: {
		bars: {
			show: true
		}
	},
	bars: {
		align: "center",
		barWidth: 0.5
	},
	xaxis: {
		axisLabel: "World Cities",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 12,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 10,
		ticks: ticks
		
	},
	yaxis: {
		axisLabel: "Average Temperature",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 12,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 3,
		tickFormatter: function (v, axis) {
			return v + "°C";
		}
	},
	legend: {
		noColumns: 0,
		labelBoxBorderColor: "#000000",
		position: "nw"
	},
	grid: {
		hoverable: true,
		borderWidth: 2,        
		backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
	}
};

$(document).ready(function () {
	$.plot($("#flot-placeholder"), dataset, options);    
	$("#flot-placeholder").UseTooltip();
});


function gd(year, month, day) {
	return new Date(year, month, day).getTime();
}

var previousPoint = null, previousLabel = null;

$.fn.UseTooltip = function () {
	$(this).bind("plothover", function (event, pos, item) {
		if (item) {
			if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
				previousPoint = item.dataIndex;
				previousLabel = item.series.label;
				$("#tooltip").remove();

				var x = item.datapoint[0];
				var y = item.datapoint[1];

				var color = item.series.color;

				//console.log(item.series.xaxis.ticks[x].label);                
				
				showTooltip(item.pageX,
						item.pageY,
						color,
						"<strong>" + item.series.label + "</strong><br>" + item.series.xaxis.ticks[x].label + " : <strong>" + y + "</strong> °C");                
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
};

function showTooltip(x, y, color, contents) {
	$('<div id="tooltip">' + contents + '</div>').css({
		position: 'absolute',
		display: 'none',
		top: y - 40,
		left: x - 120,
		border: '2px solid ' + color,
		padding: '3px',
		'font-size': '9px',
		'border-radius': '5px',
		'background-color': '#fff',
		'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
		opacity: 0.9
	}).appendTo("body").fadeIn(200);
}

