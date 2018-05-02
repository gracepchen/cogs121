var resize_map = {};
resize_map.mapmargin = 0;
resize_map.minHeight = 400;
resize_map.getHeight = function() {
    this.mapmargin = $('.container-fluid').height();
};

resize_map.getHeight();
$(window).bind("resize", resize);
resize();
//document.write($(window).height());

function resize(){
    if($(window).width() >= resize_map.minHeight){
        $('#map').css("height", ($(window).height() - 400));
        //document.write($(window).height() - resize_map.mapmargin);
    // Map size cannot be smaller than the width on mobile devices.
} else{
    if($(window).height() <= resize_map.minHeight){
        $('#map').css("height", resize_map.minHeight);
    } else{
        $('#map').css("height", ($(window).height() - resize_map.mapmargin));
    }
}
}
