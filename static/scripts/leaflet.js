var my_map = L.map('map').setView([37.641856, -120.605543], 6);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					    maxZoom: 18,
					    id: 'mapbox.streets',
					    detectRetina: true,
					    accessToken: 'pk.eyJ1IjoiY2xvdWRtYW4iLCJhIjoiY2o0amdnOGhkMDlnMDJ2bWh0eGRrazMxMiJ9.fAHOsFqx2ZK0t07TAy8ckA'
					}).addTo(my_map);
