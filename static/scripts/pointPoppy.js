/*
 * This file handles most of the data calls and organization for the app. It also handles most of the
 * button functionality for the app. The app makes requests for information from the NPS (national parks
 * service) and TrailApi APIs to find and display park and trail locations, descriptions and weather
 * conditions. Furthermore, this file defines functions to organize the relevant information into 
 * lists after retrieval to allow the app to quickly display information. 
 *
 */

let trail_data;
let i = 0;
let trail_array = [];
let parkCoords = [];
const latIndex = 0;
const lngIndex = 1;

// NPS API stuff ----------------------
// URL to specifically return pictures of the national parks
const NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&" +
"fields=images%2C%20weatherInfo&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

// URL for more general NPS api calls, to grab latitude and longitude information
const NPSUrlAll = "https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

// var source = tinify.fromUrl(result.data[0].images[0].url);
// source.toFile("optimized.jpg");

$j(document).ready(() => {
	console.log('entered document ready');

    // FIREBASE STUFF
    const database = firebase.database();

    $('#send_suggestion').click(() => {
    	const name = $('#insertNameBox').val();
    	database.ref('name_of_place/' + name).set({
    		description: $('#insertDescBox').val(),
    		reason_to_add: $('#insertReasonBox').val()
    	});

        // clear fields
        $('#insertNameBox').val("");
        $('#insertDescBox').val("");
        $('#insertReasonBox').val("");
    });

    $("#suggest").click(function() {
    	$j('#visitor_form').fadeIn(500);
    });

    $("#send_suggestion").click(function() {
    	alert("Recommendation received! Thank you for your suggestion.");
    	$j('#visitor_form').fadeOut(500);
    });

    $("#close_suggestion").click(function() {
    	$j('#visitor_form').fadeOut(500);
    });

    // PAGE PREP FUNCTIONS
    $(".title").hide();
    $j(".title").fadeIn(800);
    $("#map").hide();
    $j("#map").delay(400).fadeIn(800);
    $(".btnbg").hide();
    $j(".btnbg").delay(800).fadeIn(800);
    $(".bg").hide();
    $j(".bg").delay(1200).fadeIn(800);

    //active button toggler
    $(".btn-outline-success").click(function() {
    	$(this).toggleClass("active");
    	$(".btn-outline-success").not(this).removeClass("active");
    });
    $(".btn-outline-secondary").click(function() {
    	$(this).toggleClass("active");
    	$(".btn-outline-secondary").not(this).removeClass("active");
    });

    //Populate park information when clicking on buttons
    $j('.parkid').click(function(event) { 
        // Get trail names and put in box - trails API, generalize later for other parks
        const parkUrl = "trails/" + event.target.id;

        // Grab lat and lng for park
        $j.ajax({
        	url: NPSUrlAll,
        	method: 'GET',
        }).done((result) => {
            // Generate a new url for second api call based on lat and lng
        	parkCoords = getTrailCoords(event.target.id, result);

        	const trailURL = "https://trailapi-trailapi.p.mashape.com/?lat=" +
        	parkCoords[latIndex] + "&lon=" + parkCoords[lngIndex] +
        	"&q[activities_activity_type_name_eq]=hiking&radius=40";

        	console.log(trailURL);

            // Generate park list for each trail
        	$j.ajax({
        		url: parkUrl,
        		method: 'POST',
        		data: { parkLocation: trailURL }
        	}).done((result) => {

                trail_array = result; // save this value so that we can get the descriptions later

                // clear trail select box
                $j('#trailSelect').hide();
                if ($("#trailSelect").html() != result.trails) {
                	$("#trailSelect").html('');
                }

                // clear spot select box
                $j('#spotSelect').hide();
                if ($("#spotSelect").html() != result.trails) {
                    $("#spotSelect").html('');
                }

                // load trail names into select box
                for (let i = 0; i < result.length; i++) {
                    //if (result[i][1] === null) continue;  // skip the ones without descriptions
                    if (result[i][0].includes("Trail")){
                        let trail_option = '<option value="' + i + '">' + result[i][0] + '</option>';
                        $("#trailSelect").append(trail_option);
                    }
                }
			
                //load spot names
			    for (let i = 0; i < result.length; i++) {
                    if (result[i][1] === null) {
                        continue;  // skip the ones without descriptions
                    }
                    if (!result[i][0].includes("Trail")){
                        let spot_option = '<option value="' + i + '">' + result[i][0] + '</option>';
                        $("#spotSelect").append(spot_option);
                    }
                }

                $j('#trailSelect').fadeIn(500);
                $j('#spotSelect').fadeIn(500);

            }).fail((err) => {
                throw err;
            });
        }).fail((err) => {
            console.log("Failure");
            throw err;
        });

    });

    // Display park description, pictures and weather information
    $j('.parkid').click(function(event) { // on park button click
    	$j.ajax({
    		url: NPSurl,
    		method: 'GET',
    	}).done((result) => {

            // refreshes the title, intro, gallery, weather
            displayParkInfo(event.target.id, result);

            //Test method call, do not use!
            //displayTestMethod(event.target.id, result);
        }).fail((err) => {
        	throw err;
        }); // End of NPS API stuff ----------------------

        // change column size at beginning
        $('#map-holder').click(function(){
            $("#map-holder").addClass("col-sm-6");
            $("#map-holder").removeClass("col-sm-8");
            $("#info-holder").addClass("col-sm-6");
            $("#info-holder").removeClass("col-sm-4");
        });

        // select Trails button, make active
        $('#trailButton').addClass("active").siblings().removeClass("active");
        $('#trail_desc').html('');

        // reset to Trails select
        document.getElementById("Trails").style.display = "block";
        document.getElementById("Spots").style.display = "none";
        document.getElementById("Weather").style.display = "none";
        document.getElementById("Gallery").style.display = "none";
        document.getElementById("Hours").style.display = "none";

    });

    $j(document).ajaxError(() => { //catch-all
    	$j('#status').html('Error: unknown ajaxError!');
    });
});

// Take an image URL, downscale it to the given width, and return a new image URL.
function downscaleImage(dataUrl, newWidth, imageType, imageArguments) {
	"use strict";
	var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

    // Provide default values
    imageType = imageType || "image/jpeg";
    imageArguments = imageArguments || 0.7;

    // Create a temporary image so that we can compute the height of the downscaled image.
    image = new Image();
    image.src = dataUrl;
    oldWidth = image.width;
    oldHeight = image.height;
    newHeight = Math.floor(oldHeight / oldWidth * newWidth)

    // Create a temporary canvas to draw the downscaled image on.
    canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the downscaled image on the canvas and return the new data URL.
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    newDataUrl = canvas.toDataURL(imageType, imageArguments);
    return newDataUrl;
}


// this function changes the title, intro, gallery, and weather
function displayParkInfo(parkId, parkInfo) {
	console.log("Button clicked: " + parkId);

    // find appropriate park data corresponding to park button
    for (i = 0; i < parkInfo.data.length; i++) {
    	if (parkInfo.data[i].parkCode === parkId) {
            break; // get value of i
        }
    }

    // change intro
    $j('#intro').hide();

    // generate google maps link
    $('#intro').html(parkInfo.data[i].description + " <a href='http://www.google.com/maps/place/" +
    	parkCoordsArray[i][0] + "," + parkCoordsArray[i][1] + "' target='_blank'>Let's go! → </a>");
    $j('#intro').fadeIn(500);

    // change title
    $j('#parkName').hide();
    $('#parkName').html(parkInfo.data[i].fullName);
    $j('#parkName').fadeIn(500);

    $j('#pics').hide();
    $('#pics').html(''); // erase old gallery and reload pics

    /*
    for (let j = 0; j < parkInfo.data[i].images.length; j++) {

      $('#pics').append('<img src="' + parkInfo.data[i].images[j].url +
        '" width="33%" altText="' + parkInfo.data[i].images[j].altText +
        '" class="img-thumbnail">');
    }
    */
    //carousel
    $('.carousel-inner').html('');
    $(document).ready(function(){
    	for(let j = 0; j < parkInfo.data[i].images.length; j++) {
    		$('<div class="carousel-item"><img src="'+parkInfo.data[i].images[j].url+'" width="100%">   </div>').appendTo('.carousel-inner');
          //$('<li data-target="#carousel" data-slide-to="'+i+'"></li>').appendTo('.carousel-indicators')

        }
        $('.carousel-item').first().addClass('active');
        //$('.carousel-indicators > li').first().addClass('active');
        $('#carousel').carousel();
    });


    $j('#pics').fadeIn(500);
    $('#weatherInfo').html(parkInfo.data[i].weatherInfo); // change weather
	$('#hoursInfo').html(parkInfo.data[i].operatingHours);	// change hours info
}

// Set up click listeners on the carousel buttons
$j('.carousel-control-prev').click(function() {
    $('#carousel').carousel('prev');
});

$j('.carousel-control-next').click(function() {
    $('#carousel').carousel('next');
});

// This Function grabs the latitude and longitude data of a specific park from the list of all parks
// provided by the NPS api
function getTrailCoords(parkIdToSearch, parkVals) {
    let coords = 0;
    const latOffset = 4;
    const lngOffset = 7;

    for(const i of parkVals.data) {
    	if(i.parkCode === parkIdToSearch) {
    		let comma = i.latLong.indexOf(",");
    		let lat = i.latLong.substring(latOffset, comma);
    		let lng = i.latLong.substring(comma + lngOffset, i.latLong.length);

    		if(lat === ''){
    			console.log("no lat/lng data available");
    		}

    		coords = [lat, lng];
    		break;
    	}
    }

    return coords;
}

// trail/gallery/weather tab functions
function getParkData(trailgallery) { //shows tabs
	var i;
	var x = document.getElementsByClassName("parkinfo");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	document.getElementById(trailgallery).style.display = "block";
};

// select trail box - insert description into box
function showTrailInfo(trail_name, parkTrails) {
	console.log("Showing trail information...");

    // reset values
    $("#trail_desc").hide();
    $("#trail_desc").html('');

    $('#trail_desc').html("<h5>Description: </h5>");

    // if Trail Description == null, say "No description available"
    if(parkTrails == 0) {
        if (trail_array[trail_name][1] === null) {
            $('#trail_desc').append("No description available. Try another trail!");
        } else {   // else, display trail description
            $('#trail_desc').append(trail_array[trail_name][1]);
            $j("#trail_desc").fadeIn(500);
        }
    }
    else {
        if (parkTrails[trail_name][1] === null) {
            $('#trail_desc').append("No description available. Try another trail!");
        } else {   // else, display trail description
            $('#trail_desc').append(parkTrails[trail_name][1]);
            $j("#trail_desc").fadeIn(500);
        }
    }
};

//Separate function for displaying information about spots, rather than trails
function showSpotInfo(spot_name, parkTrails) {
	console.log("Showing spot information...");

    // reset values
    $("#spot_desc").hide();
    $("#spot_desc").html('');

    $('#spot_desc').html("<h5>Description: </h5>");

    // if Trail Description == null, say "No description available"
    if(parkTrails == 0) {
        if (trail_array[spot_name][1] === null) {
            $('#trail_desc').append("No description available. Try another trail!");
        } else {   // else, display trail description
            $('#trail_desc').append(trail_array[spot_name][1]);
            $j("#trail_desc").fadeIn(500);
        }
    }
    else {
        if (parkTrails[spot_name][1] === null) {
            $('#spot_desc').append("No description available. Try another spot!");
        } else {   // else, display trail description
            $('#spot_desc').append(parkTrails[spot_name][1]);
            $j("#spot_desc").fadeIn(500);
        }
    }
};
