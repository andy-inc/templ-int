/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */

$(function(){

    var showWindow = function(name){
        $("#start-window").hide();
        $("#score-window").hide();
        $("#rect-window").hide();
        $("#numbers-open-window").hide();
        $("#"+name+"-window").show();
    };

    var Game = function(rows, cols){
        this.options = {
            rows: rows,
            cols: cols
        };
        this.els = {
            rect: $("#rect-window"),
            continue: $('[data-type="action"][data-value="continue-game"]')
        };
        this.allowOpenNumber = false;
        this.numbers = {};
        this.current = 2;
        this.score = 0;
        this.steps = 15;
        this.history = [];
        this.end = false;
        this.koef = 1;

        if (window.navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
            this.els.rect.on("touchend", this._onClick.bind(this));
        } else {
            this.els.rect.click("td", this._onClick.bind(this));
        }

        this.els.rect.removeClass("failed").removeClass("success");


        this.els.continue.click(function(event){
            if (this.end) return;
            event.preventDefault();
            showWindow("rect");
            this.start();
        }.bind(this));
    };

    Game.prototype._onClick = function(event){
        if (this.end) return;
        event.preventDefault();
        var $el = $(event.target);
        if ($el.data("x") != null){
            this.onOpenNumber(parseInt($el.data("x")), parseInt($el.data("y")));
        }
    };

    Game.prototype.init = function(){
        if (this.end) return;
        //Init rect
        this.els.rect.empty();
        for(var y = 0; y < this.options.rows; y++){
            var tr = $("<tr></tr>");
            for(var x = 0; x < this.options.cols; x++){

                var r = $("<td></td>");
                r.attr("data-x", x);
                r.attr("data-y", y);
                r.attr("width", 100/ this.options.cols + "%");
                r.attr("height", 100/ this.options.rows + "%");
                tr.append(r);
            }
            this.els.rect.append(tr);
        }
    };

    Game.prototype.start = function(){
        if (this.end) return;
        this.allowOpenNumber = false;
        this.numbers = {};

        this.els.rect.find("td").text("").removeClass("failed");
        this.els.rect.removeClass("failed").removeClass("success");
        var exists = [];
        for(var i = 0; i < this.current; i++){
            var rn = getRandomInt(0, this.options.cols*this.options.rows - 1);
            while (exists.indexOf(rn) !== -1){
                rn = getRandomInt(0, this.options.cols*this.options.rows - 1);
            }
            exists.push(rn);

            var num = getRandomInt(1, 29);
            while( num in this.numbers){
                num = getRandomInt(1, 29);
            }

            var x = Math.floor(rn / this.options.rows),
                y = rn - (x * this.options.cols);
            this.els.rect.find('[data-x="'+x+'"][data-y="'+y+'"]').text(num);

            this.numbers[num] = {x: x, y: y, num: num, open: false};
        }

        setTimeout(function(){
            if (this.end) return;
            this.els.rect.find("td").text("");
            this.onHideNumbers();
        }.bind(this), 3000);

        if (this.onScoreChange){
            this.onScoreChange(this, this.score);
        }
        if (this.onStepsChange){
            this.onStepsChange(this, this.steps);
        }
        if (this.onCurrentChange){
            this.onCurrentChange(this, this.current);
        }

    };

    Game.prototype.onHideNumbers = function(){
        this.allowOpenNumber = true;
    };

    Game.prototype.onOpenNumber = function(x, y){
        if (!this.allowOpenNumber || this.end) return;
        var num = this._findNumber(x, y);
        if (num != null && num.open) return;
        if (num !== null && this._findMinForOpen().num != num.num){
            num = null;
        }
        var allOpen = true;
        if (num == null){
            this.els.rect.addClass("failed");
            this._onLoose({x: x, y: y});
        } else if (!num.open){
            num.open = true;
            this._showNum(num);
            this.score += 4;

            for(var key in this.numbers) if (this.numbers.hasOwnProperty(key)){
                if (!this.numbers[key].open){
                    allOpen = false;
                    break;
                }
            }
            if (allOpen){
                this.els.rect.addClass("success");
                this.koef = this.koef * 1.25;
                this.score += Math.round(Math.pow(2, this.current)*this.koef);
            }
            if (this.onScoreChange){
                this.onScoreChange(this, this.score);
            }
        }
        if (allOpen || num == null){
            this.allowOpenNumber = false;
            this.steps--;
            if (num == null){
                this.current--;
                if (this.current < 2){
                    this.current = 2;
                }
            } else {
                this.current++;
            }
            if (this.onCurrentChange){
                this.onCurrentChange(this, this.current);
            }
            if (this.onStepsChange){
                this.onStepsChange(this, this.steps);
            }
            if (this.steps === 0){
                this.end = true;
                if (this.onEnd){
                    this.onEnd(this, this.score);
                }
            } else {
                setTimeout(function(){
                    if (this.end) return;
                    showWindow("numbers-open");
                }.bind(this), 1000);
            }
        }
    };

    Game.prototype._onLoose = function(point){
        this.koef = this.koef * 0.5;
        if (this.koef < 1){
            this.koef = 1;
        }
        this.allowOpenNumber = false;
        for(var key in this.numbers) if (this.numbers.hasOwnProperty(key)){
            this._showNum(this.numbers[key]);
        }
        this._showLoose(point);
    };

    Game.prototype._showLoose = function(point){
        var num = this._findNumber(point.x, point.y) || {};
        var text = num.num || "X";
        this.els.rect.find('[data-x="'+point.x+'"][data-y="'+point.y+'"]').text(text).addClass("failed");
    };

    Game.prototype._showNum = function(num){
        this.els.rect.find('[data-x="'+num.x+'"][data-y="'+num.y+'"]').text(num.num).removeClass("failed");
    };

    Game.prototype._findMinForOpen = function(x, y){
        var result = null;
        for(var key in this.numbers) if (this.numbers.hasOwnProperty(key)){
            var value = this.numbers[key];
           if (!value.open && (result == null || result.num > value.num)){
               result = value;
           }
        }
        return result;
    };

    Game.prototype._findNumber = function(x, y){
        for(var key in this.numbers) if (this.numbers.hasOwnProperty(key)){
            var value = this.numbers[key];
            if (value.x === x && value.y === y && !value.open){
                return value;
            }
        }
        return null;
    };

    showWindow("start");

    var game = null;
    var newGame = function(){
        if (game != null){
            game.end = true;
        }
        showWindow("start");
        game = new Game(5, 5);
        game.init();

        game.onScoreChange = function(game, score){
            $('[data-type="game-score"]').text(score);
        };

        game.onStepsChange = function(game, steps){
            $('[data-type="game-steps"]').text(steps);
        };

        game.onEnd = function(game, score){
            game.onScoreChange(game, score);
            game.onStepsChange(game, game.steps);
            game.onCurrentChange(game, game.current);
            setTimeout(function(){
                showWindow("score");
            }, 1000);
        };

        game.onCurrentChange = function(game, current){
            $('[data-type="game-current"]').text(current);
        };

        game.onScoreChange(game, game.score);
        game.onStepsChange(game, game.steps);
        game.onCurrentChange(game, game.current);
    };

    $('[ data-type="action"][data-value="new-game"]').click(function(event){
        event.preventDefault();
        newGame();
    });

    $('[data-type="action"][data-value="start-game"]').click(function(event){
        event.preventDefault();
        showWindow("rect");
        game.start();
    });



    newGame();
});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}