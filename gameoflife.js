/*
 * A class that describes a unique cell of
 * of the game of life.
 */
function Cell(row, col, parentGen) {
    this.row = row;
    this.col = col;
    this.isLive = false;
    this.parentGen = parentGen;

    return this;
}

/*
 * Get 4-neighbourhood of the given cell.
 */
Cell.prototype.nhood = function () {
    var nbors = [], deltas = [0, 1, -1];
    for (var i = 0; i < deltas.length; i++) {
        for (var j = 0; j < deltas.length; j++) {
            if (deltas[i] === 0 && deltas[j] === 0)
                continue;

            var c = {
                row: this.row + deltas[i],
                col: this.col + deltas[j]
            };

            if (this.goodCoordinate(c)) {
                nbors.push(this.parentGen.getCell(c.row, c.col));
            }
        }
    }

    return nbors;
};

/*
 * Check whether the coordinate fits to the grid.
 */
Cell.prototype.goodCoordinate = function (coord) {
    if (coord.row < 0 || coord.row >= this.parentGen.rows) {
        return false;
    }
    if (coord.col < 0 || coord.col >= this.parentGen.cols) {
        return false;
    }
    return true;
};

/*
 * Return the number of live neighbours in the
 * 4-neighbourhood of the cell.
 */
Cell.prototype.numLiveNbors = function () {
    var nLive = 0;
    var nbors = this.nhood();

    for (var i = 0; i < nbors.length; i++) {
        if (nbors[i].isLive)
            nLive++;
    }

    return nLive;
};

/*
 * This class describes a generation in game of life.
 */
function Generation(rows, cols) {
    this.population = [];
    this.rows = rows;
    this.cols = cols;

    this.newPopulation = function () {
        var population = [];
        for (var i = 0; i < rows; i++)
           for (var j = 0; j < cols; j++)
                population.push(new Cell(i, j, this));

        return population;
    };

    this.population = this.newPopulation();
    return this;
}

Generation.prototype.getCell = function (row, col) {
    return this.population[row * this.cols + col];
};

/*
 * Generate next population from the given one
 * according to the rules of game of life.
 */
Generation.prototype.next = function () {
    var newPop = this.newPopulation();
    for (var i = 0; i < this.population.length; i++) {
        var cell = this.population[i];
        var liveNbors = cell.numLiveNbors();

        if (cell.isLive) {
            if (liveNbors == 2 || liveNbors == 3) {
                /* 
                 * 1) Any live cell with two or three live neighbours 
                 * lives on to the next generation.
                 */
                newPop[i].isLive = true;
            }
            else {
                /*
                 * 2) any live cell with fewer than two neighbours dies
                 * 3) Any live cell with more than three live neighbours 
                 *    dies, as if by overcrowding. 
                 */
                newPop[i].isLive = false;
            }
        }
        else if (liveNbors == 3) {
            /*
             * 4) Any dead cell with exactly three live neighbours 
             *    becomes a live cell, as if by reproduction.
             */
            newPop[i].isLive = true;
        }
    }

    this.population = newPop;
};
