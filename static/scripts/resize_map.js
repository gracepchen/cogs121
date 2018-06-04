/*
 * This file handles the resizing of the Leaflet map in order to make it responsive.
 * Leaflet requires you to set a hard coded height value to make the map render but
 * this script allows us to render the map with a percentage height value.
 * https://github.com/tforward/LeafShoot
 */

//initilizing the variables
var resize_map = {};
resize_map.mapmargin = 0;
resize_map.minHeight = 400;
resize_map.getHeight = function() {
    this.mapmargin = $('.container-fluid').height();
};

//run the resize function
resize_map.getHeight();
$(window).bind("resize", resize);
resize();

function resize(){
    if($(window).width() >= resize_map.minHeight){
        $('#map').css("height", ($(window).height() - 400));
    // Map size cannot be smaller than the width on mobile devices.
} else{
    if($(window).height() <= resize_map.minHeight){
        $('#map').css("height", resize_map.minHeight);
    } else{
        $('#map').css("height", ($(window).height() - resize_map.mapmargin));
    }
}
}
