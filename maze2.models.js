class Maze {
    constructor(width, height) {
        this.mazeArr = [];
        this.mazeMaxX = width;
        this.mazeMaxY = height;
        this.player = null;
        this.collectable = null;
        this.mazeSections = [];
        this.onGameEnd = null;

        this.createMaze();
    }

    createMazeHTML() {
        var result = "<div class='maze-box'>";
        for (var y = 0; y < this.mazeMaxY; y++) {
            result += "<div class='maze-row'>";
            for (var x = 0; x < this.mazeMaxX; x++) {
                result += this.mazeArr[y][x].toHTML();
            }
            result += "</div>";
        }
        result += "</div>";
        return result;
    }

    placePlayer(x, y) {
        const playerX = x ?? 0;
        const playerY = y ?? 0;

        // if moveing the player
        if(this.player){
            // remove old pointer from the array
            this.mazeArr[this.player.position.y][this.player.position.x].occupant = null;
            this.player.position.x = playerX;
            this.player.position.y = playerY;
        }
        else{
            this.player = new Player(playerX, playerY);
        }
        this.mazeArr[playerY][playerX].occupant = this.player;
    }

    movePlayer(direction){
        var moveX = this.player.position.x + direction.x;
        var moveY = this.player.position.y + direction.y;
        if(0 <= moveX && moveX < this.mazeMaxX && 
            0 <= moveY && moveY < this.mazeMaxY)
        {
            // check for walls by the direction
            var currCell = this.mazeArr[this.player.position.y][this.player.position.x];
            var nextCell = this.mazeArr[moveY][moveX];
            
            // left check for right wall in nextCell
            if(direction == DIRECTION.LEFT){
                if(nextCell.walls.filter(w => w.wallType == WALLS.RIGHT).length > 0){
                    return false;
                }
            }
            // up check for top wall in currCell
            else if(direction == DIRECTION.UP){
                if(currCell.walls.filter(w => w.wallType == WALLS.TOP).length > 0){
                    return false;
                }
            }
            // right check for right wall in currCell
            else if(direction == DIRECTION.RIGHT){
                if(currCell.walls.filter(w => w.wallType == WALLS.RIGHT).length > 0){
                    return false;
                }
            }
            // down check for top wall in nextCell
            else if(direction == DIRECTION.DOWN){
                if(nextCell.walls.filter(w => w.wallType == WALLS.TOP).length > 0){
                    return false;
                }
            }
            if(nextCell.occupant != null && nextCell.occupant instanceof Collectable){
                if(this.onGameEnd){
                    this.onGameEnd();
                }
            }
            this.placePlayer(moveX,moveY);
            return true;
        }
        return false;
    }

    placeCollectable() {
        var randSection = this.getRandomMazeSectionWithoutPlayer();
        var collectX = Utils.getRandomNumber(randSection.minPoint.x, randSection.maxPoint.x);
        var collectY = Utils.getRandomNumber(randSection.minPoint.y, randSection.maxPoint.y);
        this.collectable = new Collectable(collectX, collectY);
        this.mazeArr[collectY][collectX].occupant = this.collectable;
    }

    getRandomMazeSectionWithoutPlayer(){
        var possibleSections = [];
        for(var i=0;i<this.mazeSections.length;i++){
            if(!this.mazeSections[i].isPointInsideSection(this.player.position)){
                possibleSections.push(this.mazeSections[i]);
            }
        }
        var randIndex = Utils.getRandomNumber(0, possibleSections.length);
        return possibleSections[randIndex];
    }

    createMaze() {
        this.createMazeWalls();
        this.createPathMaze();
        this.createMazeSections();
        this.placePlayer();
        this.placeCollectable();
    }

    createMazeSections(){
        var mazeMiddleX = Math.floor(this.mazeMaxX / 2);
        var mazeMiddleY = Math.floor(this.mazeMaxY / 2);
        this.mazeSections.push(new MazeSection(new Point(0,0), new Point(mazeMiddleX, mazeMiddleY)));
        this.mazeSections.push(new MazeSection(new Point(mazeMiddleX,0), new Point(this.mazeMaxX, mazeMiddleY)));
        this.mazeSections.push(new MazeSection(new Point(0,mazeMiddleY), new Point(mazeMiddleX, this.mazeMaxY)));
        this.mazeSections.push(new MazeSection(new Point(mazeMiddleX,mazeMiddleY), new Point(this.mazeMaxX, this.mazeMaxY)));
    }

    createPathMaze() {
        var randY = Utils.getRandomNumber(0, this.mazeMaxY);
        var randX = Utils.getRandomNumber(0, this.mazeMaxX);
        var startCell = this.mazeArr[randY][randX];
        var openSet = [startCell];
        var closedSet = [];

        while (openSet.length > 0) {
            var currCell = openSet[openSet.length - 1];

            var currCellNeighbors = this.getCellNeighbors(currCell);
            var currNeighbor = this.getRandomNotVistedNeighbor(currCellNeighbors, closedSet, openSet);
            if (currNeighbor != null) {
                this.createPathFromCurrCellToNeighbor(currCell, currNeighbor);

                openSet.push(currNeighbor);
            }
            else {
                Utils.removeFromArrayByValue(openSet, currCell);
                closedSet.push(currCell);
            }
        }
    }

    createPathFromCurrCellToNeighbor(currCell, currNeighbor) {
        // neighbor is above the currCell
        // remove currCell top wall
        if (currCell.y > currNeighbor.y) {
            currCell.removeWall(WALLS.TOP);
        }
        // neighbor is under the currCell
        // remove currNeighbor top wall
        if (currCell.y < currNeighbor.y) {
            currNeighbor.removeWall(WALLS.TOP);
        }
        // neighbor is left to the currCell
        // remove currNeighbor right wall
        if (currCell.x > currNeighbor.x) {
            currNeighbor.removeWall(WALLS.RIGHT);
        }
        // neighbor is right to the currCell
        // remove currCell right wall
        if (currCell.x < currNeighbor.x) {
            currCell.removeWall(WALLS.RIGHT);
        }
    }

    getRandomNotVistedNeighbor(currCellNeighbors, closedSet, openSet) {
        var currNeighbor = null;
        while (currCellNeighbors.length > 0) {
            var randIndex = Utils.getRandomNumber(0, currCellNeighbors.length);
            var currTempNeighbor = Utils.removeFromArrayByIndex(currCellNeighbors, randIndex);
            if (!closedSet.includes(currTempNeighbor) && !openSet.includes(currTempNeighbor)) {
                currNeighbor = currTempNeighbor;
            }
        }
        return currNeighbor;
    }

    getCellNeighbors(currCell) {
        var neighbors = [];

        if (currCell.x > 0) {
            neighbors.push(this.mazeArr[currCell.y][currCell.x - 1]);
        }
        if (currCell.y > 0) {
            neighbors.push(this.mazeArr[currCell.y - 1][currCell.x]);
        }
        if (currCell.x < this.mazeMaxX - 1) {
            neighbors.push(this.mazeArr[currCell.y][currCell.x + 1]);
        }
        if (currCell.y < this.mazeMaxY - 1) {
            neighbors.push(this.mazeArr[currCell.y + 1][currCell.x]);
        }

        return neighbors;
    }

    createMazeWalls() {
        for (var y = 0; y < this.mazeMaxY; y++) {
            this.mazeArr[y] = [];
            for (var x = 0; x < this.mazeMaxX; x++) {
                var cell = new Cell(x, y);
                cell.addWall(new Wall(WALLS.TOP));
                cell.addWall(new Wall(WALLS.RIGHT));
                if (y === (this.mazeMaxY - 1)) {
                    cell.addWall(new Wall(WALLS.BOTTOM));
                }
                if (x === 0) {
                    cell.addWall(new Wall(WALLS.LEFT));
                }
                this.mazeArr[y][x] = cell;
            }
        }
    }

}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [];
        this.occupant = null;
    }

    addWall(wall) {
        if (!(wall instanceof Wall)) {
            throw "wall is not of Wall type;";
        }
        if (this.walls.find(w => w.wallType === wall.wallType)) {
            return;
        }
        this.walls.push(wall);
    }

    removeWall(wallType) {
        for (var i = 0; i < this.walls.length; i++) {
            if (this.walls[i].wallType == wallType) {
                Utils.removeFromArrayByIndex(this.walls, i);
                break;
            }
        }
    }

    addOccupant(obj) {
        this.occupant = obj;
    }

    toHTML() {
        var wallsClassValue = this.walls.map(w => w.toHtmlClassValue()).join(" ");
        var divValue = this.occupant ? this.occupant.toHTML() : "";
        return `<div class="maze-cell ${wallsClassValue}">${divValue}</div>`;
    }
}

class PositionBaseObject{
    constructor(x, y) {
        this.position = new Point(x,y);
    }

    toHTML() {
        return "";
    }
}

class Player extends PositionBaseObject {
    constructor(x,y){
        super(x,y);
        this.points = 0;
    }
    
    toHTML() {
        return "&#128512;";
    }
}

class Collectable extends PositionBaseObject {
    toHTML() {
        return "&#127827;";
    }
}

class Wall {
    constructor(wallType) {
        this.wallType = wallType;
    }

    toHtmlClassValue() {
        return `maze-wall-${this.wallType}`;
    }
}

class MazeSection{
    constructor(min, max){
        this.minPoint = min;
        this.maxPoint = max;
    }

    isPointInsideSection(point){
        if(this.minPoint.x <= point.x && point.x < this.maxPoint.x &&
            this.minPoint.y <= point.y && point.y < this.maxPoint.y){
                return true;
        }
        return false;
    }
}

class Game {
    constructor(){
        this.maze = null;
        this.gameStarted = false;
        this.startGame();
    }

    startGame() {
        let mazeWidth = 10;
        let mazeHeight = 10;
        this.gameStarted = true;
        this.maze = new Maze(mazeWidth, mazeHeight);
        this.maze.onGameEnd = () => {
            this.gameStarted = false;

            // show message and restart button
            var elem = document.getElementById('main-menu');
            elem.style.display = "block";
        }
        this.refreshMazeHTML();
    }

    movePlayer(direction){
        if(this.gameStarted){
            var isMoved = this.maze.movePlayer(direction);
            if (isMoved) {
                this.refreshMazeHTML();
            }
        }
    }

    refreshMazeHTML() {
        var mazeHTML = this.maze.createMazeHTML();
        var elem = document.getElementById('main');
        elem.innerHTML = mazeHTML;
    }
}