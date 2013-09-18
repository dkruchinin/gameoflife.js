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

GameOfLife.prototype.redrawGrid = function () {
    var that = this;
    this.set.forEach(function (item) {
        var cell = that.gen.getCell(item.data("row"), item.data("col"));
        var color = cell.isLive ? LIFE_COLOR : DEATH_COLOR;
        item.attr("fill", color);
    });
};

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

GameOfLife.prototype.drawPattern = function (pattern) {
    if (this.running && !this.paused)
        return;

    this.gen.reset();
    if (this.gen.rows < pattern.minRows) {
        alter(pattern.name + " requires at least " +
            pattern.minRows + " rows");
    }
    if (this.gen.cols < pattern.minCols) {
        alter(pattern.name + " requires at least" +
            pattern.minCols + " columns");
    }

    var coords = pattern.coordinates;
    var r_off = 0;
    var c_off = 0;

    if (pattern.center) {
        r_off = Math.floor(this.gen.rows / 2 - pattern.minRows / 2);
        c_off = Math.floor(this.gen.cols / 2 - pattern.minCols / 2);
    }

    for (var i = 0; i < coords.length; i++)
        this.gen.getCell(coords[i][0] + r_off, coords[i][1] + c_off).isLive = true;

    this.redrawGrid();
};

GameOfLife.prototype.clearGrid = function () {
    if (this.running && !this.paused)
        return;

    this.gen.reset();
    this.redrawGrid();
};

var PATTERNS = [
    {
        name: "none"
    },
    {
        name: "Gosper glider gun",
        center: false,
        minRows: 11,
        minCols: 37,
        coordinates: [
            [5,1], [5,2], [6,1], [6,2],
            [4,16], [3,13], [3,14], [4,12],
            [5,11], [6,11], [7,11], [8,12],
            [9,13], [9,14], [6,15], [8,16],
            [7,17], [6,17], [5,17], [6,18],
            [3,21], [3,22], [4,21], [4,22],
            [5,21], [5,22], [2,23], [6,23],
            [1,25], [2,25], [6,25], [7,25],
            [3,35], [4,35], [3,36], [4,36]
        ]
    },
    {
        name: "Glider",
        center: true,
        minRows: 5,
        minCols: 5,
        coordinates: [
            [1,2], [2,3], [3,1], [3,2], [3,3]
        ]
    },
    {
        name: "Lightweight spaceship",
        center: true,
        minRows: 7,
        minCols: 7,
        coordinates: [
            [1,2], [1,5], [2,1], [3,1], [3,5],
            [4,1], [4,2], [4,3], [4,4]
        ]
    },
    {
        name: "Blinker",
        center: true,
        minRows: 3,
        minCols: 5,
        coordinates: [
            [1,1], [1,2], [1,3]
        ]
    },
    {
        name: "Pulsar",
        center: true,
        minRows: 15,
        minCols: 15,
        coordinates: [
            [1,3], [1,4], [1,5], [1,9], [1,10],
            [1,11], [3,1], [3,6], [3,8], [3,13],
            [4,1], [4,6], [4,8], [4,13], [5,1],
            [5,6], [5,8], [5,13], [6,3], [6,4],
            [6,5], [6,9], [6,10], [6,11], [8,3], [8,4],
            [8,5], [8,9], [8,10], [8,11], [9,1], [9,6],
            [9,8], [9,13], [10,1], [10,6], [10,8],
            [10,13], [11,1], [11,6], [11,8], [11,13],
            [13,3], [13,4], [13,5], [13,9], [13,10],
            [13,11]
        ]
    },
    {
        name: "Infinite",
        center: true,
        minRows: 3,
        minCols: 40,
        coordinates: [
            [1,1], [1,2], [1,3], [1,4], [1,5],
            [1,6], [1,7], [1,8], [1,10], [1,11],
            [1,12], [1,13], [1,14], [1,18], [1,19],
            [1,20], [1,27], [1,28], [1,29], [1,30],
            [1,31], [1,32], [1,33], [1,35], [1,36],
            [1,37], [1,38]
        ]
    }
];

window.onload = function () {
    var game = new GameOfLife("holder", 30, 60, 15, 300);
    var startButton = document.getElementById("startButton");
    var selectPattern = document.getElementById("selectPattern");

    var startFn = function () {
        startButton.textContent = "Stop";
        startButton.onclick = stopFn;
        game.run();
    };

    var stopFn = function () {
        startButton.textContent = "Start";
        startButton.onclick = startFn;
        selectPattern.selectedIndex = 0;
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

    PATTERNS.forEach(function (pattern) {
        var option = document.createElement("option");
        option.text = pattern.name;
        selectPattern.add(option, null);
    });

    selectPattern.onchange = function () {
        var index = document.getElementById("selectPattern").selectedIndex;
        if (index === 0)
            game.clearGrid();
        else if (index > 0 && index < PATTERNS.length) {
            game.drawPattern(PATTERNS[index]);
        }
    };
};
