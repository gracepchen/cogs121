var my_map = L.map('map').setView([37.641856, -120.605543], 6);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3BjMDAxIiwiYSI6ImNqZ2JtYWphNzBnNnczMmx6bXNkeGFhYzkifQ.6dwOvoXOP5Oln1ltOiI6Bw', {
	maxZoom: 18,
	id: 'mapbox.streets',
	detectRetina: true,
	accessToken: 'pk.eyJ1IjoiY2xvdWRtYW4iLCJhIjoiY2o0amdnOGhkMDlnMDJ2bWh0eGRrazMxMiJ9.fAHOsFqx2ZK0t07TAy8ckA'
}).addTo(my_map);


var redwood = L.polygon([
	[41.081257, -123.961847],
	[41.088244, -123.940732],
	[41.108036, -123.938844],
	[41.152515, -123.877733],
	[41.227375, -123.962984],
	[41.272418, -123.984614],
	[41.328774, -123.946676],
	[41.464286, -124.036851],
	[41.473161, -124.058308],
	[41.508522, -124.068951],
	[41.522147, -124.044575],
	[41.535769, -124.075646],
	[41.533713, -124.082169],
	[41.312187, -124.087662],
	[41.307545, -124.043889],
	[41.261107, -124.088177],
	[41.207405, -124.061055],
	[41.188805, -124.073071]
	]).addTo(my_map);

var sequoia = L.circle([36.4864, -118.5658], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 40000
}).addTo(my_map);

var joshua = L.circle([33.8734, -115.9010], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 30000
}).addTo(my_map);

var alcatraz = L.circle([37.8270, -122.4230], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 20000
}).addTo(my_map);

var cabrillo = L.circle([32.6735, -117.2425], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 10000
}).addTo(my_map);

var castlemountains = L.circle([35.3247, -115.0789], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 20000
}).addTo(my_map);

var channelislands = L.circle([34.0097, -119.8023], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 20000
}).addTo(my_map);

var deathvalley = L.circle([36.5323, -116.9325], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 30000
}).addTo(my_map);

var yosemite = L.circle([37.8651, -119.5383], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 40000
}).addTo(my_map);



// popups
redwood.bindPopup("Redwood National Park");
sequoia.bindPopup("Sequoia National Park");
joshua.bindPopup("Joshua Tree National Park");
alcatraz.bindPopup("Alcatraz Island");
cabrillo.bindPopup("Cabrillo National Monument");
castlemountains.bindPopup("Castle Mountains");
channelislands.bindPopup("Channel Islands");
deathvalley.bindPopup("Death Valley");
yosemite.bindPopup("Yosemite National Park");




