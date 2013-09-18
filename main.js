var DEATH_COLOR = "white";
var LIFE_COLOR = "red";
var SEL_COLOR = "gray";

function GameOfLife(divid, rows, cols, sqSize, delay) {
    var paper = Raphael(divid, cols * sqSize, rows * sqSize);

    this.gen = new Generation(rows, cols);
    this.delay = delay;
    this.paused = false;
    this.running = false;
    this.set = paper.set();

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var rect = paper.rect(j * sqSize, i * sqSize,
                sqSize, sqSize);
            rect.data("row", i);
            rect.data("col", j);
            this.set.push(rect);
        }
    }

    this.set.attr("fill", DEATH_COLOR);
    this.set.mouseover(function() {
        this.attr("fill", SEL_COLOR);
    });

    var that = this;
    this.set.mouseout(function() {
        var cell = that.gen.getCell(this.data("row"), this.data("col"));
        var color = LIFE_COLOR;
        if (!cell.isLive)
            color = DEATH_COLOR;

        this.attr("fill", color);
    });

    this.set.click(function() {
        if (that.running && !that.paused)
            return;

        var cell = that.gen.getCell(this.data("row"), this.data("col"));
        var color = null;
        if (cell.isLive)
            color = DEATH_COLOR;
        else
            color = LIFE_COLOR;

        cell.isLive = !cell.isLive;
        this.attr("fill", color);
    });
}

GameOfLife.prototype.run = function () {
    this.paused = false;
    this.running = true;
    var that = this;
    this.intervalId = setInterval(function () {
        if (!that.paused)
            that.tick();
    }, that.delay);
};

GameOfLife.prototype.stop = function () {
    if (this.running) {
        clearInterval(this.intervalId);
        this.gen = new Generation(this.gen.rows, this.gen.cols);
        this.running = false;
        this.set.attr("fill", DEATH_COLOR);
    }
};

GameOfLife.prototype.tick = function () {
    this.gen.next();
    var gen = this.gen;
    this.set.forEach(function (item) {
        var cell = gen.getCell(item.data("row"), item.data("col"));
        var color = DEATH_COLOR;
        if (cell.isLive)
            color = LIFE_COLOR;

        item.attr("fill", color);
    });
};

window.onload = function () {
    var game = new GameOfLife("holder", 30, 60, 15, 200);
    var startButton = document.getElementById("startButton");

    var startFn = function () {
        startButton.textContent = "Stop";
        startButton.onclick = stopFn;
        game.run();
    };

    var stopFn = function () {
        startButton.textContent = "Start";
        startButton.onclick = startFn;
        game.stop();
    };

    startButton.textContent = "Start";
    startButton.onclick = startFn;
    var pauseButton = document.getElementById("pauseButton");

    var pauseFn = function () {
        if (game.running) {
            pauseButton.textContent = "Resume";
            pauseButton.onclick = resumeFn;
            game.paused = true;
        }
    };
    
    var resumeFn = function () {
        pauseButton.textContent = "Pause";
        pauseButton.onclick = pauseFn;
        game.paused = false;
    };

    pauseButton.textContent = "Pause";
    pauseButton.onclick = pauseFn;
};
