// Description: 俄罗斯方块
// 游戏类
class Game {
    constructor(ctx: CanvasRenderingContext2D) {
        this.width = 10;
        this.height = 20;
        this.ctx = ctx;
        for (let i = 0; i < this.width * this.height; i++) {
            ctx.fillStyle = "#333";
            //绘制网格
            ctx.strokeRect(i % this.width * 30, Math.floor(i / this.width) * 30, 30, 30);
        }
    }
    //游戏网格的宽度
    width: number;
    //游戏网格的高度
    height: number;
    //当前方块的y坐标
    y: number = -4;
    //当前分数
    score: number = 0;
    //画笔
    ctx: CanvasRenderingContext2D;
    //定时器
    timer: any;

    //游戏网格
    gameMesh: number[] = [];
    //游戏方块
    gameBox: GameBox;

    //开始游戏
    starGame() {
        //初始化游戏网格
        this.initMesh();
        //添加方块
        this.addGameBox();
        //启动定时器
        this.timer = setInterval(() => {
            //每一秒自动更新一次
            this.Update();
        }, 1000);
    }
    //结束游戏
    stopGame() {
        //清除定时器
        clearInterval(this.timer);
    }
    //添加方块
    addGameBox() {
        this.gameBox = new GameBox();
    }
    //旋转方块
    changeGameBox() {
        this.ClearBox();

        this.gameBox.changeBox(1);
        let temmesh = this.gameBox.getMesh();
        let temgameMesh = this.gameMesh.slice();
        for (let i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for(let i=0;i<temgameMesh.length;i++){
            if(temgameMesh[i]>1){
                this.gameBox.changeBox(-1);
                this.AddBoxToMesh();
                return;
            }
        }
        this.AddBoxToMesh();
    }
    //初始化游戏网格
    initMesh() {
        this.gameMesh = [];
        for (let i = 0; i < this.height * this.width; i++) {
            this.gameMesh.push(0);
        }
        for (let i = 0; i < this.width; i++) {
            this.gameMesh.push(1);
        }
        this.Render();
    }

    //判断是否到底
    InEnd(): Boolean {
        let temMesh = this.gameMesh.slice();
        var temy = this.y + 1;

        var mesh = this.gameBox.getMesh();
        for (let i = 0; i < this.gameBox.getMesh().length; i++) {
            if (this.y * this.width + i >= 0) {
                temMesh[this.y * this.width + i] -= mesh[i];
            }
        }
        for (let i = 0; i < this.gameBox.getMesh().length; i++) {
            if (temy * this.width + i >= 0) {
                temMesh[temy * this.width + i] += mesh[i];
            }
        }
        for (var i = 0; i < temMesh.length; i++) {
            if (temMesh[i] > 1) {
                return true;
            }
        }
        return false;
    }



    //下落
    MoveDown() {
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
    }
    //更新游戏界面,相当于按一下向下键
    Update() {
        this.MoveDown();
        this.Render();
    }
    //渲染游戏界面
    Render() {
        for (let i = 0; i < this.width * this.height; i++) {
            if (this.gameMesh[i] == 1) {
                //数据为1的渲染为黑色
                this.ctx.fillStyle = "#333";
                this.ctx.fillRect(i % this.width * 30 + 1,
                     Math.floor(i / this.width) * 30 + 1, 28, 28);
            }
            else {
                //数据为0的渲染为白色
                this.ctx.clearRect(i % this.width * 30 + 1, 
                    Math.floor(i / this.width) * 30 + 1, 28, 28);
            }
        }
    }
    //清除方块
    ClearBox() {
        let gameBox = this.gameBox.getMesh();
        for (let i = 0; i < gameBox.length; i++) {
            if (i + this.y * this.width >= 0) {
                this.gameMesh[i + this.y * this.width] -= gameBox[i];
            }
        }
    }
    //添加方块
    AddBoxToMesh() {
        let gameBox = this.gameBox.getMesh();
        for (let i = 0; i < gameBox.length; i++) {
            if (i + this.y * this.width >= 0) {
                this.gameMesh[i + this.y * this.width] += gameBox[i];
            }
        }
        this.Render();
    }
    //左移
    MoveLeft() {
        this.ClearBox();
        let temmesh = this.gameBox.getMesh().slice(1, 999);
        let temgameMesh = this.gameMesh.slice();
        for (let i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for (let i = 0; i < temgameMesh.length; i++) {
            if (temgameMesh[i] > 1) {
                this.AddBoxToMesh();
                return;
            }
        }
        this.gameBox.MoveLeft();
        this.AddBoxToMesh();
    }
    //右移
    MoveRight() {
        this.ClearBox();
        let temmesh = [0].concat(this.gameBox.getMesh());
        let temgameMesh = this.gameMesh.slice();
        for (let i = 0; i < temmesh.length; i++) {
            temgameMesh[i + this.y * this.width] += temmesh[i];
        }
        for (let i = 0; i < temgameMesh.length; i++) {
            if (temgameMesh[i] > 1) {
                this.AddBoxToMesh();
                return;
            }
        }
        this.gameBox.MoveRight();
        this.AddBoxToMesh();
    }
    //计算分数
    AddScore() {
        let fullLine = this.FullLine();
        if (fullLine.length > 0) {
            this.score += fullLine.length * 100 * fullLine.length;
            for (let i = 0; i < fullLine.length; i++) {
                this.gameMesh.splice(fullLine[i] * this.width, 10);
                for (let j = 0; j < 10; j++) {
                    this.gameMesh.unshift(0);
                }
            }
        }
    }
    //判断是否有满行
    FullLine(): number[] {
        let fullLine: number[] = [];
        for (let i = 0; i < this.height; i++) {
            let flag = true;
            for (let j = 0; j < this.width; j++) {
                if (this.gameMesh[i * 10 + j] == 0) {
                    flag = false;
                }
            }
            if (flag) {
                fullLine.push(i);
            }
        }
        return fullLine;
    }

}
//方块类
class GameBox {
    constructor() {
        let index = Math.floor(Math.random() * this.GameBoxList.length);
        for (let i = 0; i < this.GameBoxList[index].length; i++) {
            this.currentBox.push(this.GameBoxList[index][i].slice());
        }
        this.currentChildrenIndex = Math.floor(Math.random() * this.currentBox.length);
    }
    //方块列表
    GameBoxList = [
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
        ]];

    currentBox: number[][] = [];
    currentChildrenIndex = 0;
    //获取当前方块
    getMesh(): number[] {
        return this.currentBox[this.currentChildrenIndex];
    }
    //方块变形
    changeBox(i): void {
        this.currentChildrenIndex += i;
        if (this.currentChildrenIndex >= this.currentBox.length) {
            this.currentChildrenIndex = 0;
        }
        else if (this.currentChildrenIndex < 0) {
            this.currentChildrenIndex = this.currentBox.length - 1;
        }
    }
    //是否在最左边
    Inleft(gameBox: number[]): Boolean {
        for (let i = 0; i < 4; i++) {
            if (i * 10 >= gameBox.length) {
                return false;
            }
            if (gameBox[i * 10] === 1) {
                return true;
            }
        }
        return false;
    }
    //是否在最右边
    InRight(gameBox: number[]): Boolean {
        for (let i = 0; i < 4; i++) {
            if (i * 10 + 9 >= gameBox.length) {
                return false;
            }
            if (gameBox[i * 10 + 9] === 1) {
                return true;
            }
        }
        return false;
    }
    //左移
    MoveLeft() {
        if (this.Inleft(this.currentBox[this.currentChildrenIndex])) {
            //如果在最左边则不移动
            return;
        }
        for (let i = 0; i < this.currentBox.length; i++) {
            if (this.Inleft(this.currentBox[i])) {
                //判断其他形状的方块是否在最左边,如果在最左边则不移动
                continue;
            }
            //移除第一个元素
            this.currentBox[i].shift();
        }
    }
    //右移
    MoveRight() {
        if (this.InRight(this.currentBox[this.currentChildrenIndex])) {
            //如果在最右边则不移动
            return;
        }
        for (let i = 0; i < this.currentBox.length; i++) {
            if (this.InRight(this.currentBox[i])) {
                //判断其他形状的方块是否在最右边,如果在最右边则不移动
                continue;
            }
            //在数据头部添加一个0
            this.currentBox[i].unshift(0);
        }
    }
}

//获取画布
var canvas = document.getElementById("game");
if (canvas == null) {
    throw new Error("game is null");
}
//获取画笔
var ctx = canvas.getContext("2d");
//创建游戏对象
var game = new Game(ctx);
//添加键盘事件
window.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            //左移
            game.MoveLeft();
            break;
        case 38:
            //旋转
            game.changeGameBox();
            break;
        case 39:
            //右移
            game.MoveRight();
            break;
        case 40:
            //下落
            game.MoveDown();
            break;
    }
}
//开始游戏
game.starGame();