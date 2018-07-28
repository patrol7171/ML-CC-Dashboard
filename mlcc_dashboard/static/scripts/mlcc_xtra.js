
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