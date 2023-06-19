var Game = /** @class */ (function () {
    function Game(ctx) {
        this.y = -4;
        this.score = 0;
        this.gameMesh = [];
        this.width = 10;
        this.height = 20;
        this.ctx = ctx;
        for (var i = 0; i < this.width * this.height; i++) {
            ctx.fillStyle = "#333";
            ctx.strokeRect(i % this.width * 30, Math.floor(i / this.width) * 30, 30, 30);
        }
    }
    Game.prototype.starGame = function () {
        var _this = this;
        this.initMesh();
        this.addGameBox();
        this.timer = setInterval(function () {
            _this.Update();
        }, 1000);
    };
    Game.prototype.stopGame = function () {
        clearInterval(this.timer);
    };
    Game.prototype.addGameBox = function () {
        this.gameBox = new GameBox();
    };
    Game.prototype.changeGameBox = function () {
        this.ClearBox();
        this.gameBox.changeBox(1);
        var temmesh = this.gameBox.getMesh();
        var temgameMesh = this.gameMesh.slice();
        for (var i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for (var i = 0; i < temgameMesh.length; i++) {
            if (temgameMesh[i] > 1) {
                this.gameBox.changeBox(-1);
                this.AddBoxToMesh();
                return;
            }
        }
        this.AddBoxToMesh();
    };
    Game.prototype.initMesh = function () {
        this.gameMesh = [];
        for (var i = 0; i < this.height * this.width; i++) {
            this.gameMesh.push(0);
        }
        for (var i = 0; i < this.width; i++) {
            this.gameMesh.push(1);
        }
        this.Render();
    };
    Game.prototype.InEnd = function () {
        var temMesh = this.gameMesh.slice();
        var temy = this.y + 1;
        var mesh = this.gameBox.getMesh();
        for (var i_1 = 0; i_1 < this.gameBox.getMesh().length; i_1++) {
            if (this.y * this.width + i_1 >= 0) {
                temMesh[this.y * this.width + i_1] -= mesh[i_1];
            }
        }
        for (var i_2 = 0; i_2 < this.gameBox.getMesh().length; i_2++) {
            if (temy * this.width + i_2 >= 0) {
                temMesh[temy * this.width + i_2] += mesh[i_2];
            }
        }
        for (var i = 0; i < temMesh.length; i++) {
            if (temMesh[i] > 1) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.MoveDown = function () {
        if (this.InEnd()) {
            //计算分数
            this.AddScore();
            //添加新的方块
            this.addGameBox();
            this.y = -4;
            return;
        }
        else {
            this.ClearBox();
            this.y++;
            this.AddBoxToMesh();
        }
    };
    Game.prototype.Update = function () {
        this.MoveDown();
        this.Render();
    };
    Game.prototype.Render = function () {
        for (var i = 0; i < this.width * this.height; i++) {
            if (this.gameMesh[i] == 1) {
                this.ctx.fillStyle = "#333";
                this.ctx.fillRect(i % this.width * 30 + 1, Math.floor(i / this.width) * 30 + 1, 28, 28);
            }
            else {
                this.ctx.clearRect(i % this.width * 30 + 1, Math.floor(i / this.width) * 30 + 1, 28, 28);
            }
        }
    };
    Game.prototype.ClearBox = function () {
        var gameBox = this.gameBox.getMesh();
        for (var i = 0; i < gameBox.length; i++) {
            if (i + this.y * this.width >= 0) {
                this.gameMesh[i + this.y * this.width] -= gameBox[i];
            }
        }
    };
    Game.prototype.AddBoxToMesh = function () {
        var gameBox = this.gameBox.getMesh();
        for (var i = 0; i < gameBox.length; i++) {
            if (i + this.y * this.width >= 0) {
                this.gameMesh[i + this.y * this.width] += gameBox[i];
            }
        }
        this.Render();
    };
    Game.prototype.MoveLeft = function () {
        this.ClearBox();
        var temmesh = this.gameBox.getMesh().slice(1, 999);
        var temgameMesh = this.gameMesh.slice();
        for (var i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for (var i = 0; i < temgameMesh.length; i++) {
            if (temgameMesh[i] > 1) {
                this.AddBoxToMesh();
                return;
            }
        }
        this.gameBox.MoveLeft();
        this.AddBoxToMesh();
    };
    Game.prototype.MoveRight = function () {
        this.ClearBox();
        var temmesh = [0].concat(this.gameBox.getMesh());
        var temgameMesh = this.gameMesh.slice();
        for (var i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for (var i = 0; i < temgameMesh.length; i++) {
            if (temgameMesh[i] > 1) {
                this.AddBoxToMesh();
                return;
            }
        }
        this.gameBox.MoveRight();
        this.AddBoxToMesh();
    };
    Game.prototype.AddScore = function () {
        var fullLine = this.FullLine();
        if (fullLine.length > 0) {
            this.score += fullLine.length * 100 * fullLine.length;
            for (var i = 0; i < fullLine.length; i++) {
                this.gameMesh.splice(fullLine[i] * this.width, 10);
                for (var j = 0; j < 10; j++) {
                    this.gameMesh.unshift(0);
                }
            }
        }
    };
    Game.prototype.FullLine = function () {
        var fullLine = [];
        for (var i = 0; i < this.height; i++) {
            var flag = true;
            for (var j = 0; j < this.width; j++) {
                if (this.gameMesh[i * 10 + j] == 0) {
                    flag = false;
                }
            }
            if (flag) {
                fullLine.push(i);
            }
        }
        return fullLine;
    };
    return Game;
}());
var GameBox = /** @class */ (function () {
    function GameBox() {
        this.GameBoxList = [
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0]],
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 1],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]],
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0]],
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0],
            ], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1]
            ], [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1]
            ]
        ];
        this.currentBox = [];
        this.currentChildrenIndex = 0;
        var index = Math.floor(Math.random() * this.GameBoxList.length);
        for (var i = 0; i < this.GameBoxList[index].length; i++) {
            this.currentBox.push(this.GameBoxList[index][i].slice());
        }
        this.currentChildrenIndex = Math.floor(Math.random() * this.currentBox.length);
    }
    GameBox.prototype.getMesh = function () {
        return this.currentBox[this.currentChildrenIndex];
    };
    GameBox.prototype.changeBox = function (i) {
        this.currentChildrenIndex += i;
        if (this.currentChildrenIndex >= this.currentBox.length) {
            this.currentChildrenIndex = 0;
        }
        else if (this.currentChildrenIndex < 0) {
            this.currentChildrenIndex = this.currentBox.length - 1;
        }
    };
    GameBox.prototype.Inleft = function (gameBox) {
        for (var i = 0; i < 4; i++) {
            if (i * 10 >= gameBox.length) {
                return false;
            }
            if (gameBox[i * 10] === 1) {
                return true;
            }
        }
        return false;
    };
    GameBox.prototype.InRight = function (gameBox) {
        for (var i = 0; i < 4; i++) {
            if (i * 10 + 9 >= gameBox.length) {
                return false;
            }
            if (gameBox[i * 10 + 9] === 1) {
                return true;
            }
        }
        return false;
    };
    GameBox.prototype.MoveLeft = function () {
        if (this.Inleft(this.currentBox[this.currentChildrenIndex])) {
            return;
        }
        for (var i = 0; i < this.currentBox.length; i++) {
            if (this.Inleft(this.currentBox[i])) {
                continue;
            }
            this.currentBox[i].shift();
        }
    };
    GameBox.prototype.MoveRight = function () {
        if (this.InRight(this.currentBox[this.currentChildrenIndex])) {
            return;
        }
        for (var i = 0; i < this.currentBox.length; i++) {
            if (this.InRight(this.currentBox[i])) {
                continue;
            }
            //this.currentBox[i].pop();
            this.currentBox[i].unshift(0);
        }
    };
    return GameBox;
}());
var canvas = document.getElementById("game");
if (canvas == null) {
    throw new Error("game is null");
}
var ctx = canvas.getContext("2d");
var game = new Game(ctx);
window.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            game.MoveLeft();
            break;
        case 38:
            game.changeGameBox();
            break;
        case 39:
            game.MoveRight();
            break;
        case 40:
            game.MoveDown();
            break;
    }
};
game.starGame();
