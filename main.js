window.onload = function () {
    console.log("script loaded!");
};

window.onkeydown = function (e) {
    var direction = Utils.keyboardKeysToDirection(e.code);
    if (direction) {
        this.game.movePlayer(direction);
    }
}

function startGame() {
    if (this.game == null) {
        this.game = new Game();
    }
    this.game.startGame();
    var elem = document.getElementById('main-menu');
    elem.style.display = "none";
}

this.game = null;