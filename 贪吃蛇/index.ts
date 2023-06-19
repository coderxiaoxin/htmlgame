//贪吃蛇
class Snake {
    //初始化
    constructor(width: number, height: number, ctx: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        //绘制网格
        for (let i = 0; i < width * height; i++) {
            ctx.strokeStyle = "#999";
            ctx.strokeRect(i % width * 10, Math.floor(i / width) * 10, 10, 10);
            this.gameMesh.push(0);
        }
        this.food = [];
    }

    width: number = 0;
    height: number = 0;
    ctx: CanvasRenderingContext2D;
    //蛇身
    currentsnake: number[] = [];
    //网格
    gameMesh: number[] = [];
    //食物
    food: number[] = [];
    //方向
    direction: number = 0;
    //定时器
    timer: number;
    //更新
    update() {
        var head = this.currentsnake[this.currentsnake.length - 1];
        var neck = this.currentsnake[this.currentsnake.length - 2];
        var newheader = 0;
        if (this.direction == 0) {
            newheader = head + 1;
        } else if (this.direction == 1) {
            newheader = head + this.width;
        } else if (this.direction == 2) {
            newheader = head - 1;
        } else if (this.direction == 3) {
            newheader = head - this.width;
        }
        if (newheader == neck) {
            newheader = head - neck + head;
        }
        if (this.currentsnake.indexOf(newheader) != -1) {
            //撞到自己
            alert("游戏结束");
            clearInterval(this.timer);
        }
        if (newheader < 0 || newheader > this.width * this.height) {
            //超出屏幕
            alert("游戏结束");
            clearInterval(this.timer);
        }
        if (Math.floor(newheader / this.width) != Math.floor(head / this.width)
         && (this.direction == 0 || this.direction == 2)) {
            //撞墙
            alert("游戏结束");
            clearInterval(this.timer);
        }
        if (this.food.indexOf(newheader) != -1) {
            //吃到食物
            this.food.splice(this.food.indexOf(newheader), 1);
            this.currentsnake.push(newheader);
            while (true) {
                var food = Math.floor(Math.random() * this.width * this.height);
                if (this.currentsnake.indexOf(food) == -1 && this.food.indexOf(food) == -1) {
                    this.food.push(food);
                    break;
                }
            }
        } else {
            //移动
            this.currentsnake.push(newheader);
            this.currentsnake.shift();
        }
        for (var i = 0; i < this.gameMesh.length; i++) {
            this.gameMesh[i] = 0;
        }
        for (var i = 0; i < this.food.length; i++) {
            this.gameMesh[this.food[i]] = 1;
        }
        for (var i = 0; i < this.currentsnake.length; i++) {
            this.gameMesh[this.currentsnake[i]] = 1;
        }
        this.render();
    }
    //渲染
    render() {
        for (var i = 0; i < this.gameMesh.length; i++) {
            if (this.gameMesh[i] == 1) {
                this.ctx.fillStyle = "#333";
                this.ctx.fillRect(i % this.width * 10 + 1, Math.floor(i / this.width) * 10 + 1, 8, 8);
            } else {
                this.ctx.clearRect(i % this.width * 10 + 1, Math.floor(i / this.width) * 10 + 1, 8, 8);
            }
        }
    }

    starGame() {
        this.timer = setInterval(this.update.bind(this), 200);
        this.currentsnake = [0, 1, 2, 3];
        this.gameMesh[0] = 1;
        this.gameMesh[1] = 1;
        this.gameMesh[2] = 1;
        this.gameMesh[3] = 1;
        for(var i=0;i<3;i++){
            while (true) {
                var food = Math.floor(Math.random() * this.width * this.height);
                if (this.currentsnake.indexOf(food) == -1 && this.food.indexOf(food) == -1) {
                    this.food.push(food);
                    break;
                }
            }
        }
        this.update();
    }

    move(direction: number) {
        this.direction = direction;
    }
}


var gameCanvas = document.getElementById("game") as HTMLCanvasElement;
var ctx = gameCanvas.getContext("2d");
if (ctx == null) {
    alert("您的浏览器不支持");
} else {
    var game = new Snake(20, 20, ctx);
    window.onkeydown = function (e) {
        if (e.keyCode == 37) {
            game.move(2);
        } else if (e.keyCode == 38) {
            game.move(3);
        } else if (e.keyCode == 39) {
            game.move(0);
        } else if (e.keyCode == 40) {
            game.move(1);
        }
    }
    game.starGame();
}