let trail_data;
let i = 0;

// NPS API stuff ----------------------
const NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&" +
"fields=images%2C%20weatherInfo&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

// For experimenting with the NPS API, do not use
const NPSUrlAll = "https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

// var source = tinify.fromUrl(result.data[0].images[0].url);
// console.log(source);
// source.toFile("optimized.jpg");

$j(document).ready(() => {
    console.log('entered document ready');

    //active button toggler
    $(".btn-outline-success").click(function() {
        $(this).toggleClass("active");
        $(".btn-outline-success").not(this).removeClass("active");
    });
    $(".btn-outline-secondary").click(function() {
        $(this).toggleClass("active");
        $(".btn-outline-secondary").not(this).removeClass("active");
    });

    $j('.parkid').click(function(event) { // when clicking Sequoia button
        // NEW get trail names and put in box - trails API, generalize later for other parks
        const parkUrl = "trails/" + event.target.id;
        const latIndex = 0;
        const lngIndex = 1;

        $j.ajax({
            url: NPSUrlAll,
            method: 'GET',
        }).done((result) => {
            let parkCoords = getTrailCoords(event.target.id, result);

            const trailURL = "https://trailapi-trailapi.p.mashape.com/?lat=" +
            parkCoords[latIndex] + "&lon=" + parkCoords[lngIndex] + 
            "&q[activities_activity_type_name_eq]=hiking&radius=75";

            console.log(trailURL);
            $j.ajax({
                url: parkUrl,
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
                throw err;
            });
        }).fail((err) => {
            console.log("Failure");
            throw err;
        });
        
        /* 
        (result) => {

            console.log(result[0]);
            for (let i = 0; i < result.length; i++) {
                let trail_option = '<option value="' + i + '">' + result[i] + '</option>';
                $("#trailSelect").append(trail_option);
            }

        }).fail((err) => {
            throw err;
        });*/
    });

    $j('.parkid').click(function(event) { // on park button click
        $j.ajax({
            url: NPSurl,
            method: 'GET',
        }).done((result) => {
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


    // show trail select box
    if (document.getElementById("Gallery").style.display === "none") {
        document.getElementById("Trails").style.display = "block";
        document.getElementById("Weather").style.display = "none";
    } else {
        document.getElementById("Trails").style.display = "none";
        document.getElementById("Weather").style.display = "none";
    }

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
$('#intro').html(parkInfo.data[i].description); 
$j('#intro').fadeIn(500);

    // change title
    $j('#parkName').hide();
    $('#parkName').html(parkInfo.data[i].fullName); 
    $j('#parkName').fadeIn(500);

    $j('#pics').hide();
    $('#pics').html(''); // erase old gallery and reload pics
    for (let j = 0; j < parkInfo.data[i].images.length; j++) {
      $('#pics').append('<img src="' + parkInfo.data[i].images[j].url +
        '" width="33%" altText="' + parkInfo.data[i].images[j].altText +
        '" class="img-thumbnail">');
  }
  $j('#pics').fadeIn(500);

    $('#weatherInfo').html(parkInfo.data[i].weatherInfo); // change weather
}

function getTrailCoords(parkIdToSearch, parkVals) {        
    let coords = 0;
    const latOffset = 4;
    const lngOffset = 7;

    //console.log(parkVals);
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
/*
//Test Method for working with NPS data, do not use!

function displayTestMethod(parkId, parkInfo) {
    console.log(parkInfo.data);
    for(const i of parkInfo.data) {
        let comma = i.latLong.indexOf(",");
        let lat = i.latLong.substring(0 + 4, comma);
        let lng = i.latLong.substring(comma + 1 + 6, i.latLong.length);

    }
}*/


// trail/gallery/weather tab functions
function getParkData(trailgallery) { //shows tabs
  var i;
  var x = document.getElementsByClassName("parkinfo");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
}
document.getElementById(trailgallery).style.display = "block";
};

// select trail box - insert length and difficulty into box // Grace is fixing this rn
function showTrailInfo(trail_name) {
  // reset values
  $("#trail_length").html('');
  $("#trail_diff").html('');

  console.log("showTrailInfo() - trail name is: " + trail_name);
    // console.log($('#trailSelect').val(trail_name).html());

  // change the data
  $("#trail_length").html(trail_data[trail_name].length);
  $("#trail_diff").html(trail_data[trail_name].difficulty);
};
