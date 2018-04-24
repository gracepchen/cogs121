$j(document).ready(() => {
  console.log('entered document ready');
  $j('.parkid').click(function(event) {

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
        $("#trails").html(data.trails);
        $("#parkPic").attr("src", data.pic);

      }
    });

  });

  $j(document).ajaxError(() => { //catch-all
    $j('#status').html('Error: unknown ajaxError!');
  });
});
