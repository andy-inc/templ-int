/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */

$(function(){

    var $rect = $("#rect");

    var allowOpen = false;
    var numbers = {};

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

        $rect.find("td").text("").removeClass("failed");

        var w = $rect.data("w"),
            h = $rect.data("h");

        var exists = [];

        var numbers = {};

        for(var i = 0; i < n; i++){
            var rn = getRandomInt(0, w*h - 1);
            while (exists.indexOf(rn) !== -1){
                rn = getRandomInt(0, w*h - 1);
            }
            exists.push(rn);

            var num = getRandomInt(1, 29);
            while( num in numbers){
                num = getRandomInt(1, 29);
            }

            var x = Math.floor(rn / h),
                y = rn - (x * w);
            $rect.find('[data-x="'+x+'"][data-y="'+y+'"]').text(num);

            numbers[num] = {x: x,y : y, value: num, open: false};
        }

        setTimeout(function(){
            $rect.find("td").text("");
            callback(numbers);
        }, 3000);
    };

    var newGame = function(){
        allowOpen = false;
        initRect(5,5);
        startPart(4, function(n){
            numbers = n;
            allowOpen = true;
        });
    };

    var onOpen = function(x, y){
        if (!allowOpen) return;
        var num = null;
        for(var key in numbers){
            var value = numbers[key];
            if (value.x === x && value.y === y){
                num = value;
                break;
            }
        }
        if (num == null){
            $rect.find('[data-x="'+x+'"][data-y="'+y+'"]').text("X").addClass("failed");
            for(var key in numbers){
                openNum(key);
            }
            onFailed();
        } else {
            openNum(num.value)
        }
    };

    var openNum = function(key){
        numbers[key].open = true;
        $rect.find('[data-x="'+numbers[key].x+'"][data-y="'+numbers[key].y+'"]').text(numbers[key].value).removeClass("failed");
    };

    var onFailed = function(){
        alert("Game Over!");
    };

    $rect.click("td", function(event){
        event.preventDefault();
        var $el = $(event.target);
        onOpen(parseInt($el.data("x")), parseInt($el.data("y")));
    });

    $('[ data-type="action"][data-value="new-game"]').click(function(event){
        event.preventDefault();
        newGame();
    });

    newGame();
});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}