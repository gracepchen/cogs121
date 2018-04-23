$j(document).ready(() => {
  console.log('entered document ready');
  $j('.parkid').click(() => {
    // 
    // console.log('making ajax request to: ' + $('#parkid'));
    // console.log($('#parkid'));

    // change name of info
    $j('#parkName').text(document.getElementById("parkName").innerHTML);

    // get name of park
    $j.ajax({
      url:'parks/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('ajax success ' + data);
        $('#test').html(data[0]);
      }
    });

    // get park info
    
    // change $Redwood to something that will select calling object
    // or select correct park from array
    const reqURL = 'parks/' + $('#Redwood').text();
  
    $j.ajax({
      url: reqURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log(data.pic);
        console.log(data.trails);
        $("#test3").attr("src", data.pic);
        $("#test2").html(data.trails);
        // $('#test2').innerHTML = "test";
        // const parkPic = '<img src=\"' + data.pic + '\">';
        // document.getElementById("test2").innerHTML = parkPic;
      }
    });

  });

  $j(document).ajaxError(() => { //catch-all
    $j('#status').html('Error: unknown ajaxError!');
  });
});
