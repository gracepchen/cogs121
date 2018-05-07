let trail_data;
let i = 0;

// NPS API stuff ----------------------
const NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&" +
"fields=images%2C%20weatherInfo&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

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


    $j('#seki').click(function(event) { // when clicking Sequoia button
    // NEW get trail names and put in box - trails API, generalize later for other parks
    $j.ajax({
        url: 'trails',
        method: 'GET',
    }).done((result) => {

        console.log(result[0]);
        for (let i = 0; i < result.length; i++) {
            let trail_option = '<option value="' + i + '">' + result[i] + '</option>';
            $("#trailSelect").append(trail_option);
        }

    }).fail((err) => {
        throw err;
    });
});





    $j('.parkid').click(function(event) { // on park button click
        $j.ajax({
            url: NPSurl,
            method: 'GET',
        }).done((result) => {
            displayParkInfo(event.target.id, result);
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

        // reset values for length and difficulty
        $("#trail_length").html('');
        $("#trail_diff").html('');

        // get park info
        var idText = $('#' + event.target.id).text();
        const reqURL = 'parks/' + idText;

        // OLD load trails
        $j.ajax({
            url: reqURL,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log(data);

                // load trail names into select box
                if ($("#trailSelect").html() == 0 || $("#trailSelect").html() != data.trails) {
                    // $("#trailSelect").html(''); // clear select box

                    // for (var i = 0; i < data.trails.length; i++) {
                    //     // append correct trail names
                    //     let trail_option = '<option value="' + i + '">' + data.trails[i].name + '</option>';
                    //     $("#trailSelect").append(trail_option);
                    // }
                }
                trail_data = data.trails;
            }
        });

    });

    $j(document).ajaxError(() => { //catch-all
        $j('#status').html('Error: unknown ajaxError!');
    });
});

function displayParkInfo(parkId, parkInfo) {
  console.log("Button clicked: " + parkId);

    // find appropriate park data corresponding to park button
    for (i = 0; i < parkInfo.data.length; i++) {
      if (parkInfo.data[i].parkCode === parkId) {
            break; // get value of i
        }
    }

    $('#intro').html(parkInfo.data[i].description); // change intro
    $('#parkName').html(parkInfo.data[i].fullName); // change title

    $('#pics').html(''); // erase old gallery and reload pics
    for (let j = 0; j < parkInfo.data[i].images.length; j++) {
      $('#pics').append('<img src="' + parkInfo.data[i].images[j].url +
        '" width="33%" altText="' + parkInfo.data[i].images[j].altText +
        '" class="img-thumbnail">');
  }

    $('#weatherInfo').html(parkInfo.data[i].weatherInfo); // change weather
}
/* A backup
function displayParkInfo(result) {
    // find appropriate park data corresponding to park button
    for (i = 0; i < result.data.length; i++) {
        if (result.data[i].parkCode === event.target.id) {
            break; // get value of i
        }
    }

    $('#intro').html(result.data[i].description); // change intro
    $('#parkName').html(result.data[i].fullName); // change title

    $('#pics').html(''); // erase old gallery and reload pics
    for (let j = 0; j < result.data[i].images.length; j++) {
        $('#pics').append('<img src="' + result.data[i].images[j].url +
            '" width="33%" altText="' + result.data[i].images[j].altText +
            '" class="img-thumbnail">');
    }

    $('#weatherInfo').html(result.data[i].weatherInfo); // change weather
}*/

// trail/gallery tab functions
function getParkData(trailgallery) { //shows tabs
  var i;
  var x = document.getElementsByClassName("parkinfo");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
}
document.getElementById(trailgallery).style.display = "block";
};

// select trail box - insert length and difficulty into box
function showTrailInfo(trail_name) {
  // reset values
  $("#trail_length").html('');
  $("#trail_diff").html('');

  // change the data
  $("#trail_length").html(trail_data[trail_name].length);
  $("#trail_diff").html(trail_data[trail_name].difficulty);
};
