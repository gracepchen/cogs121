let trail_data;
let i = 0;

// var source = tinify.fromUrl(result.data[0].images[0].url);
// console.log(source);
// source.toFile("optimized.jpg");

$j(document).ready(() => {
  console.log('entered document ready');

$('#map-holder').click(function(){
   $("#map-holder").addClass("col-sm-5");
   $("#map-holder").removeClass("col-sm-8");
   $("#info-holder").addClass("col-sm-7");
   $("#info-holder").removeClass("col-sm-4");
});

  $j('.parkid').click(function(event) { // on park button click

    // NPS API stuff ----------------------
    var NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&fields=images%2C%20weatherInfo&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";
    $j.ajax({
      url: NPSurl,
      method: 'GET',
    }).done(function(result) {

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

    }).fail(function(err) {
      throw err;
    }); // End of NPS API stuff ----------------------


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

    // console.log('making ajax request to: ' + $('#parkid'));
    // console.log($('#parkid'));

    // change name of info
    $j('#parkName').text(document.getElementById("parkName").innerHTML);

    // get name of park
    /* $j.ajax({
    url:'parks/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
    console.log('ajax success ' + data);
    $('#test').html(event.target.id);
    }
    });
    */

    // get park info
    var idText = $('#' + event.target.id).text();
    const reqURL = 'parks/' + idText;

    $j.ajax({
      url: reqURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        // console.log(data.pic);
        // console.log(data.trails);
        // $('#intro').html(data.intro);

        // load trail names into select box
        if ($("#trailSelect").html() == 0 || $("#trailSelect").html() != data.trails) {
          $("#trailSelect").html(''); // clear select box
          for (var i = 0; i < data.trails.length; i++) {
            // append correct trail names
            let trail_option = '<option value="' + i + '">' + data.trails[i].name + '</option>';
            $("#trailSelect").append(trail_option);
          }
        }
        trail_data = data.trails;
        // $('#pics').html(data.pic);
      }
    });

  });

  $j(document).ajaxError(() => { //catch-all
    $j('#status').html('Error: unknown ajaxError!');
  });

});

// trail/gallery tab functions
function getParkData(trailgallery) {
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
