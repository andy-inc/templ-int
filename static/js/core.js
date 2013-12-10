/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */
$(function(){

    $.getJSON("/user", function(data){
        $('[data-type="user-display-name"]').text(data.displayName);
    }).fail(function() {
        window.location = "/login";
        console.log( "Can not get current user name" );
    });

    var resizeSpace = function(){
        var $space = $('#space');
        $space.height($('#wrap').height()-52);
        var w = $space.width(),
            h = $space.height();
        if (w > h){
            $('#rect-window').width(h).height(h).css("margin-left", (w-h) / 2).css("margin-top", 0);
        } else if (h > w) {
            $('#rect-window').width(w).height(w).css("margin-top", (h-w) / 2).css("margin-left", 0);
        } else {
            $('#rect-window').width(w).height(h).css("margin-top", 0).css("margin-left", 0);
        }

    };

    resizeSpace();
    $(window).resize(resizeSpace);
});
