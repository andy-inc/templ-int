/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */

$(function(){

    var $rect = $("#rect");

    var initRect = function(w,h){
        $rect.empty();
        $rect.data("w", w);
        $rect.data("h", h);
        for(var y = 0; y < h; y++){
            var tr = $("<tr></tr>");
            for(var x = 0; x < w; x++){

                var r = $("<td></td>");
                r.attr("data-x", x);
                r.attr("data-y", y);
                r.attr("width", 100/w + "%");
                r.attr("height", 100/h + "%");
                tr.append(r);
            }
            $rect.append(tr);
        }
    };

    var startPart = function(n, callback){

        var w = $rect.data("w"),
            h = $rect.data("h");

        var exists = [];

        for(var i = 0; i < n; i++){
            var rn = getRandomInt(0, w*h - 1);
            while (exists.indexOf(rn) != 0){
                rn = getRandomInt(0, w*h - 1);
            }
            exists.push(rn);

            var x = Math.floor(rn / h),
                y = rn - (x * w);
            console.log(rn, y, x);
            $rect.find('[data-x="'+x+'"][data-y="'+y+'"]').text(""+x+":"+y);
        }
    };

    var newGame = function(){
        initRect(5,5);
        startPart(8);
    };

    $('[ data-type="action"][data-value="new-game"]').click(function(event){
        event.preventDefault();
        newGame();
    });

    newGame();
});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}