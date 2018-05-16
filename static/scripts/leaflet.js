var my_map = L.map('map').setView([37.641856, -120.605543], 5);
let parkCodes = ["redw", "seki", "jotr", "cabr", "alca", "deva", "camo",
"chis", "lavo", "moja", "muwo", "pinn", "samo"];
let park, popular; // circle location variable, boolean for popular park
let parkCoordsArray = [];

// original map
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {

// hiking, more green
// L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3BjMDAxIiwiYSI6ImNqZ2JtYWphNzBnNnczMmx6bXNkeGFhYzkifQ.6dwOvoXOP5Oln1ltOiI6Bw', {

// cali topography
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

 // change column size at beginning

 $("#map-holder").addClass("col-sm-6");
 $("#map-holder").removeClass("col-sm-8");
 $("#info-holder").addClass("col-sm-6");
 $("#info-holder").removeClass("col-sm-4");

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

	// OLD ------- get park info from map
    // var idText = $('#' + e.target.id).text();
    // const reqURL = 'parks/' + idText;

    // console.log(reqURL);

    // $j.ajax({
    //     url: reqURL,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: (data) => {

    //         $('#intro').html(data.intro);

    //         // load trail names into select box
    //         if ($("#trailSelect").html() == 0 || $("#trailSelect").html() != data.trails) {
    //             $("#trailSelect").html(''); // clear select box

    //             for (var i = 0; i < data.trails.length; i++) {
    //                 // append correct trail names
    //                 let trail_option = '<option value="' + i + '">' + data.trails[i].name + '</option>';
    //                 $("#trailSelect").append(trail_option);
    //             }
    //             trail_data = data.trails;
    //         }
    //     }
    // });

      // NEW get trail names and put in box - trails API
      const parkUrl = "trails/" + e.target.id;
      console.log(parkUrl);
      const latIndex = 0;
      const lngIndex = 1;

      $j.ajax({
      	url: NPSUrlAll,
      	method: 'GET',
      }).done((result) => {
      	let parkCoords = getTrailCoords(e.target.id, result);

      	const trailURL = "https://trailapi-trailapi.p.mashape.com/?lat=" +
      	parkCoords[latIndex] + "&lon=" + parkCoords[lngIndex] +
      	"&q[activities_activity_type_name_eq]=hiking&radius=75";
      	console.log(trailURL);

      	$j.ajax({
                url: parkUrl, // trails/parkID
                method: 'POST',
                data: { parkLocation: trailURL }
            }).done((result) => {

            	console.log(result[0]);

                // clear trail select box
                $j('#trailSelect').hide();
                if ($("#trailSelect").html() != result.trails) {
                	$("#trailSelect").html('');
                }

                // load trail names into select box
                for (let i = 0; i < result.length; i++) {
                	let trail_option = '<option value="' + i + '">' + result[i] + '</option>';
                    // console.log(trail_option);
                    $("#trailSelect").append(trail_option);
                }
                $j('#trailSelect').fadeIn(500);

            }).fail((err) => {
            	console.log("Failure");
            	throw err;
            });
        }).fail((err) => {
        	console.log("Failure");
        	throw err;
        });
    };

// zoom in and highlight green button
function circleClick(e) {
	my_map.fitBounds(e.target.getBounds());
     // change selected green button based on map click
     $('#' + e.target.id).toggleClass("active");
     $(".btn-outline-success").not('#' + e.target.id).removeClass("active");
 };

// get coordinates of park and draw a circle
function getCoords(parkInfo) {
	console.log("Generating map circles...");

	for (let j = 0; j < parkInfo.data.length; j++) {
		for (let k = 0; k < parkCodes.length; k++) {
            // only put circle on map if it is one we want to have
            if (parkInfo.data[j].parkCode != parkCodes[k]) {
            	continue;
            } else {

// get lat and longitude coordinates
// JSON format is "latLong: lat:33.33333333, long: -100.0000000"
let lat = '';
let long = '';
let i = 4; // first digit of lat

if (parkInfo.data[j].latLong === "") { // validity check
	continue;
}

while (parkInfo.data[j].latLong[i] != ',') {
    lat = lat + parkInfo.data[j].latLong[i]; // get all digits of latitiude
    i++;
}

while (parkInfo.data[j].latLong[i] != ':') {
    i++; // skip extra text to get to long
}

for (i = i + 1; i < parkInfo.data[j].latLong.length; i++) {
    long = long + parkInfo.data[j].latLong[i]; // get long digits
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

		// create popups
    	park.id = parkInfo.data[j].parkCode; // set ID
    	park.bindPopup(parkInfo.data[j].fullName); // create popup
    	park.on('mouseover', function (e) {
    		this.openPopup();
    	});
    	park.on('click', function (e) {
    		this.openPopup();
    	});
    	park.on('click', dataCall); // get data when clicking circle

parkCoordsArray[j] = [lat, long]; // save coords of every park in an array for generating google maps

    }
}
}

// console.log(parkCoordsArray);
}

// draw the circle, change color and size if popular, where popular is a boolean
function createCircle(popular, lat, long) {
    let rad, col; // radius and color

    if(popular) { // change size and color of popular park
    	rad = 40000;
    	col = 'green';
    } else {
    	rad = 25000;
    	col = 'brown';
    }

    park = L.circle([lat, long], { // draw the circle
    	color: col,
    	fillColor: '#FFF',
    	fillOpacity: 0.5,
    	radius: rad
    }).addTo(my_map).on("click", circleClick);

}

// fix map on California
var maxBounds = L.latLngBounds(
    L.latLng(32.089591, -124.965293), //Southwest
    L.latLng(41.977283, -112.868058)  //Northeast
    );

my_map.setMaxBounds(maxBounds);
my_map.fitBounds(maxBounds);

