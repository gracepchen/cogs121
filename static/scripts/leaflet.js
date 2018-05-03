var my_map = L.map('map').setView([37.641856, -120.605543], 5);
let parkCodes = ["redw", "seki", "jotr", "cabr", "alca", "deva", "camo", 
"chis", "lavo", "moja", "muwo", "pinn", "samo"];
let park, popular;

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
// L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3BjMDAxIiwiYSI6ImNqZ2JtYWphNzBnNnczMmx6bXNkeGFhYzkifQ.6dwOvoXOP5Oln1ltOiI6Bw', {
 L.tileLayer('https://api.mapbox.com/styles/v1/gpc001/cjgq7ujnj00042sq8tff8s1i8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3BjMDAxIiwiYSI6ImNqZ2JtYWphNzBnNnczMmx6bXNkeGFhYzkifQ.6dwOvoXOP5Oln1ltOiI6Bw', {
     maxZoom: 18,
     id: 'mapbox.streets',
     detectRetina: true,
     accessToken: 'pk.eyJ1IjoiY2xvdWRtYW4iLCJhIjoiY2o0amdnOGhkMDlnMDJ2bWh0eGRrazMxMiJ9.fAHOsFqx2ZK0t07TAy8ckA'
 }).addTo(my_map);

// popup functions
// populate map with circles
$j.ajax({
    url: NPSurl,
    method: 'GET',
}).done((result) => {
      getCoords(result); // create map circles
  }).fail((err) => {
    throw err;
});

// display park info on the right side
function dataCall(e) {
    $j.ajax({
        url: NPSurl,
        method: 'GET',
    }).done((result) => {
        displayParkInfo(e.target.id, result);
    }).fail((err) => {
        throw err;
    });

    // show trail select box
    if (document.getElementById("Gallery").style.display === "none") {
        document.getElementById("Trails").style.display = "block";
        document.getElementById("Weather").style.display = "none";
    } else {
        document.getElementById("Trails").style.display = "none";
        document.getElementById("Weather").style.display = "none";
    }

	// get park info from map
    var idText = $('#' + e.target.id).text();
    const reqURL = 'parks/' + idText;

    console.log(reqURL);

    $j.ajax({
        url: reqURL,
        type: 'GET',
        dataType: 'json',
        success: (data) => {

            $('#intro').html(data.intro);

            // load trail names into select box
            if ($("#trailSelect").html() == 0 || $("#trailSelect").html() != data.trails) {
                $("#trailSelect").html(''); // clear select box

                for (var i = 0; i < data.trails.length; i++) {
                    // append correct trail names
                    let trail_option = '<option value="' + i + '">' + data.trails[i].name + '</option>';
                    $("#trailSelect").append(trail_option);
                }
                trail_data = data.trails;
            }
        }
    });
}

function circleClick(e) {
    my_map.fitBounds(e.target.getBounds());
     // change selected green button based on map click
     $('#' + e.target.id).toggleClass("active");
     $(".btn-outline-success").not('#' + e.target.id).removeClass("active");
 }

// get coordinates of park and draw a circle
function getCoords(parkInfo) {
    for (let j = 0; j < parkInfo.data.length; j++) {
        for (let k = 0; k < parkCodes.length; k++) {
            // only put circle on map if it is one we want to have
            if (parkInfo.data[j].parkCode != parkCodes[k]) {
                continue;
            } else {

// get lat and longitude coordinates
let lat = '';
let long = '';
let i = 0;

if (parkInfo.data[j].latLong === "") { // validity check
    continue;
}

// parse out lat and long coordinates
while (parkInfo.data[j].latLong[i] != ':') {
    i++;
}

while (parkInfo.data[j].latLong[i + 1] != ',') {
    lat = lat + parkInfo.data[j].latLong[i + 1];
    i++;
}

while (parkInfo.data[j].latLong[i] != ':') {
    i++;
}

for (i; i < parkInfo.data[j].latLong.length - 1; i++) {
    long = long + parkInfo.data[j].latLong[i + 1];
}

// check if park is popular
if (parkInfo.data[j].parkCode === 'redw' || 
    parkInfo.data[j].parkCode === 'seki' ||
    parkInfo.data[j].parkCode === 'jotr' ||
    parkInfo.data[j].parkCode === 'deva' ||
    parkInfo.data[j].parkCode === 'yose') {
    popular = 1;
} else {
  popular = 0;
}

// create clickable circle
createCircle(popular, lat, long);

park.id = parkInfo.data[j].parkCode; // set ID
park.bindPopup(parkInfo.data[j].fullName); // create popup
park.on('mouseover', function (e) {
    this.openPopup();
});
park.on('click', function (e) {
    this.openPopup();
});
park.on('click', dataCall); // get data when clicking circle
}
}
}
}

// draw the circle, change color and size if popular, where popular is a boolean
function createCircle(popular, lat, long) { 
    let rad, col; // radius and color

    if(popular) { // change size and color of popular park
        rad = 40000;
        col = 'blue';
    } else {
        rad = 25000;
        col = 'red';
    }

    park = L.circle([lat, long], { // draw the circle
        color: col,
        fillColor: '#FFF',
        fillOpacity: 0.5,
        radius: rad
    }).addTo(my_map).on("click", circleClick);
}



// // add polygons to map
// var redwood = L.polygon([
//  [41.081257, -123.961847],
//  [41.088244, -123.940732],
//  [41.108036, -123.938844],
//  [41.152515, -123.877733],
//  [41.227375, -123.962984],
//  [41.272418, -123.984614],
//  [41.328774, -123.946676],
//  [41.464286, -124.036851],
//  [41.473161, -124.058308],
//  [41.508522, -124.068951],
//  [41.522147, -124.044575],
//  [41.535769, -124.075646],
//  [41.533713, -124.082169],
//  [41.312187, -124.087662],
//  [41.307545, -124.043889],
//  [41.261107, -124.088177],
//  [41.207405, -124.061055],
//  [41.188805, -124.073071]
//  ]).addTo(my_map).on("click", circleClick);
// redwood.id = "redw"

// var sequoia = L.circle([36.4864, -118.5658], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 40000
// }).addTo(my_map).on("click", circleClick);
// sequoia.id = "seki";

// var joshua = L.circle([33.8734, -115.9010], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 30000
// }).addTo(my_map).on("click", circleClick);
// joshua.id = "jotr";

// var alcatraz = L.circle([37.8270, -122.4230], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 20000
// }).addTo(my_map).on("click", circleClick);
// alcatraz.id = "alca";

// var cabrillo = L.circle([32.6735, -117.2425], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 10000
// }).addTo(my_map).on("click", circleClick);
// cabrillo.id = "cabr"

// var castlemountains = L.circle([35.3247, -115.0789], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 20000
// }).addTo(my_map).on("click", circleClick);
// castlemountains.id = "camo";

// var channelislands = L.circle([34.0097, -119.8023], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 20000
// }).addTo(my_map).on("click", circleClick);
// channelislands.id = "chis";

// var deathvalley = L.circle([36.5323, -116.9325], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 30000
// }).addTo(my_map).on("click", circleClick);
// deathvalley.id = "deva";

// var yosemite = L.circle([37.8651, -119.5383], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 40000
// }).addTo(my_map).on("click", circleClick);
// yosemite.id = "yose";

// popups for each site
// redwood.bindPopup("Redwood");
// sequoia.bindPopup("Sequoia");
// joshua.bindPopup("Joshua Tree");
// alcatraz.bindPopup("Alcatraz Island");
// cabrillo.bindPopup("Cabrillo National Monument");
// castlemountains.bindPopup("Castle Mountains");
// channelislands.bindPopup("Channel Islands");
// deathvalley.bindPopup("Death Valley");
// yosemite.bindPopup("Yosemite National Park");
