$j(document).ready(() => {
  console.log('entered document ready');
  $j('.parkid').click(() => {
    // const reqURL = 'parks/#id';
    // console.log('making ajax request to: ' + $('#parkid'));
    // console.log($('#parkid'));
    $j('#parkName').text(document.getElementById("parkName").innerHTML);


    $j.ajax({
      url:'parks/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('ajax success' + data);
        $('#test').html(data);
      }
    });
  });
  $j(document).ajaxError(() => { //catch-all
    $j('#status').html('Error: unknown ajaxError!');
  });
});
