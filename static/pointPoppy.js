let trail_data;

$j(document).ready(() => {
  console.log('entered document ready');
  $j('.parkid').click(function(event) {

      // reset values for length and difficulty
      $("#trail_length").html('');
      $("#trail_diff").html('');
// alert(event.target.id);
    // 
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
        console.log(data.pic);
        console.log(data.trails);
        $('#intro').html(data.intro);
        
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
      $('#pics').html(data.pic);
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

