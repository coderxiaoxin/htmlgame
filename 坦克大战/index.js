var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = /** @class */ (function () {
    function GameObject() {
    }
    GameObject.prototype.getSrc = function () {
        return "";
    };
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.onCollisionEnter = function (gameobj) {
    };
    return GameObject;
}());
//游戏组件
var game = /** @class */ (function () {
    function game(ctx) {
        this.ctx = ctx;
        this.init();
        this.update = this.update.bind(this);
        this.enemyBornX = [0, 37, 75];
    }
    game.prototype.init = function () {
        this.width = 80;
        this.height = 46;
    };
    //开始游戏
    game.prototype.starGame = function () {
        var player = new tank(this, 0);
        player.x = 32;
        player.y = 42;
        this.enemy = [];
        this.enemy.push(player);
        //设置定时器,每秒24帧
        this.timer = setInterval(this.update, 1000 / 24);
    };
    game.prototype.gameover = function (lose) {
        clearInterval(this.timer);
        if (lose) {
            alert("你输了");
        }
        else {
            alert("你赢了");
        }
    };
    game.prototype.initMap = function () {
        this.ctx.clearRect(0, 0, 640, 368);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, 640, 368);
    };
    //产生一个敌人
    game.prototype.genenratorEnemy = function () {
        //随机出一个出生点
        var index = Math.floor(Math.random() * 3);
        var x = this.enemyBornX[index];
        var y = 0;
        //循环检测是否有坦克在出生点附近
        for (var i = 0; i < this.enemy.length; i++) {
            //循环判断坦克是否在出生点附近,根据坐标来检测,如果坦克的x坐标在出生点的左右5个单位,
            //并且y坐标在出生点的上下5个单位,则判断为在出生点附近,直接返回
            if (this.enemy[i].x + this.enemy[i].width >= x && this.enemy[i].x <= x + 5
                && this.enemy[i].y + this.enemy[i].height >= y && this.enemy[i].y <= y + 5) {
                return;
            }
        }
        //产生一个敌人
        var enemy = new tank(this, 1);
        enemy.x = this.enemyBornX[index];
        enemy.y = 0;
        //将敌人添加到敌人数组中
        this.enemy.push(enemy);
    };
    //更新游戏
    game.prototype.update = function () {
        //当场上的敌人小于6个时,产生一个敌人
        if (this.enemy.filter(function (a) { return a instanceof tank; }).length < 7) {
            //产生一个敌人
            //不一定能产生成功,如果出生点有坦克,则不产生
            this.genenratorEnemy();
        }
        this.enemy.forEach(function (e) { return e.update(); });
        this.initMap();
        //渲染
        this.render();
    };
    //移动对象
    game.prototype.move = function (gameobj) {
        if (gameobj.nextdirection > -1) {
            for (var i = 0; i < gameobj.speed; i++) {
                //检测坦克是否能移动,判断目标位置是否有障碍物
                if (!this.canMove(gameobj, gameobj.nextdirection)) {
                    var targetGameobj = this.getCollision(gameobj, gameobj.nextdirection);
                    if (targetGameobj) {
                        gameobj.onCollisionEnter(targetGameobj);
                        targetGameobj.onCollisionEnter(gameobj);
                    }
                    else {
                    }
                    return;
                }
                gameobj.direction = gameobj.nextdirection;
                switch (gameobj.nextdirection) {
                    case 0:
                        if (gameobj.x == 0 && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.x -= gameobj.speed;
                        break;
                    case 1:
                        if (gameobj.y == 0 && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.y -= gameobj.speed;
                        break;
                    case 2:
                        if (gameobj.x == gameobj.game.width - gameobj.width && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.x += gameobj.speed;
                        break;
                    case 3:
                        if (gameobj.y == gameobj.game.height - gameobj.height && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.y += gameobj.speed;
                        break;
                }
            }
        }
    };
    //检测对象是否能移动
    game.prototype.canMove = function (gameobj, direction) {
        if (gameobj.collision == 0) {
            return true;
        }
        if (gameobj.nextdirection > -1 && gameobj.collision == 1) {
            gameobj.direction = gameobj.nextdirection;
            switch (gameobj.nextdirection) {
                case 0:
                    if (gameobj.x == 0) {
                        return false;
                    }
                    break;
                case 1:
                    if (gameobj.y == 0) {
                        return false;
                    }
                    break;
                case 2:
                    if (gameobj.x == gameobj.game.width - gameobj.width) {
                        return false;
                    }
                    break;
                case 3:
                    if (gameobj.y == gameobj.game.height - gameobj.height) {
                        return false;
                    }
                    break;
            }
        }
        var x = -1;
        var y = -1;
        switch (direction) {
            case 0:
                x = gameobj.x - 1;
                y = gameobj.y;
                break;
            case 1:
                x = gameobj.x;
                y = gameobj.y - 1;
                break;
            case 2:
                x = gameobj.x + 1;
                y = gameobj.y;
                break;
            case 3:
                x = gameobj.x;
                y = gameobj.y + 1;
                break;
        }
        for (var i = 0; i < this.enemy.length; i++) {
            if (this.enemy[i] != gameobj) {
                if (this.enemy[i].collision == 0) {
                    continue;
                }
                if (x + gameobj.width > this.enemy[i].x && x < this.enemy[i].x + this.enemy[i].width
                    && y + gameobj.height > this.enemy[i].y && y < this.enemy[i].y + this.enemy[i].height) {
                    return false;
                }
            }
        }
        return true;
    };
    game.prototype.getCollision = function (gameobj, direction) {
        if (gameobj.collision == 0) {
            return null;
        }
        if (gameobj.nextdirection > -1) {
            gameobj.direction = gameobj.nextdirection;
            switch (gameobj.nextdirection) {
                case 0:
                    if (gameobj.x == 0) {
                        return null;
                    }
                    break;
                case 1:
                    if (gameobj.y == 0) {
                        return null;
                    }
                    break;
                case 2:
                    if (gameobj.x == gameobj.game.width - 5) {
                        return null;
                    }
                    break;
                case 3:
                    if (gameobj.y == gameobj.game.height - 5) {
                        return null;
                    }
                    break;
            }
            //tank.nextdirection = -1;
        }
        var x = -1;
        var y = -1;
        switch (direction) {
            case 0:
                x = gameobj.x - 1;
                y = gameobj.y;
                break;
            case 1:
                x = gameobj.x;
                y = gameobj.y - 1;
                break;
            case 2:
                x = gameobj.x + 1;
                y = gameobj.y;
                break;
            case 3:
                x = gameobj.x;
                y = gameobj.y + 1;
                break;
        }
        for (var i = 0; i < this.enemy.length; i++) {
            if (this.enemy[i] != gameobj) {
                if (this.enemy[i].collision == 0) {
                    continue;
                }
                if (x + gameobj.width > this.enemy[i].x
                    && x < this.enemy[i].x + this.enemy[i].width
                    && y + gameobj.height > this.enemy[i].y
                    && y < this.enemy[i].y + this.enemy[i].height) {
                    return this.enemy[i];
                }
            }
        }
        return null;
    };
    game.prototype.remove = function (gameobj) {
        this.enemy = this.enemy.filter(function (item) { return item != gameobj; });
    };
    game.prototype.add = function (gameobj) {
        this.enemy.push(gameobj);
    };
    //渲染游戏
    game.prototype.render = function () {
        for (var i = 0; i < this.enemy.length; i++) {
            var src = this.enemy[i].getSrc();
            var _this = this;
            var img = new Image();
            img.src = src;
            var enemy = this.enemy[i];
            //img.onload = function () {
            _this.ctx.drawImage(img, enemy.x * 8, enemy.y * 8, enemy.width * 8, enemy.height * 8);
            //}
        }
    };
    //绘制网格
    game.prototype.drawBlock = function (j, i) {
        var x = j * 8;
        var y = i * 8;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, 8, 8);
    };
    //清除网格
    game.prototype.clearBlock = function (j, i) {
        var x = j * 8;
        var y = i * 8;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(x, y, 8, 8);
    };
    return game;
}());
//坦克
var tank = /** @class */ (function (_super) {
    __extends(tank, _super);
    function tank(game, auto) {
        var _this_1 = _super.call(this) || this;
        _this_1.game = game;
        _this_1.x = 0;
        _this_1.y = 0;
        _this_1.direction = 1;
        _this_1.speed = 1;
        _this_1.hp = 1;
        _this_1.cd = 0;
        _this_1.auto = auto;
        _this_1.setup = -1;
        _this_1.width = 4;
        _this_1.height = 4;
        _this_1.team = auto;
        _this_1.zindex = 1;
        _this_1.attack = _this_1.attack.bind(_this_1);
        var _this = _this_1;
        if (auto < 1) {
            window.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 37:
                        _this.nextdirection = 0;
                        break;
                    case 38:
                        _this.nextdirection = 1;
                        break;
                    case 39:
                        _this.nextdirection = 2;
                        break;
                    case 40:
                        _this.nextdirection = 3;
                        break;
                    case 32:
                        _this.attack();
                        break;
                }
            };
        }
        _this_1.collision = 1;
        _this_1.srcs = [
            "./img/tank0.png",
            "./img/tank1.png",
            "./img/tank2.png",
            "./img/tank3.png"
        ];
        return _this_1;
    }
    tank.prototype.getSrc = function () {
        return this.srcs[this.direction];
    };
    tank.prototype.onCollisionEnter = function (gameobj) {
        if (gameobj instanceof Ammo) {
            this.onattack(gameobj.owner);
        }
    };
    tank.prototype.onattack = function (owner) {
        //被攻击
        if (owner.team != this.team) {
            this.hp--;
            if (this.hp < 1) {
                this.game.remove(this);
                if (this.auto == 0) {
                    this.game.gameover(true);
                }
            }
        }
    };
    tank.prototype.attack = function () {
        //攻击
        if (this.cd > 0) {
            return;
        }
        this.cd = 0.5;
        var _this = this;
        setTimeout(function () {
            _this.cd = 0;
        }, 500);
        var ammo = new Ammo(this.game, this.direction, this);
        this.game.add(ammo);
    };
    //更新
    tank.prototype.update = function () {
        if (this.auto == 1 && this.setup < 1) {
            this.nextdirection = Math.floor(Math.random() * 4);
            this.setup = Math.floor(Math.random() * 10);
        }
        if (this.auto == 1 && this.cd == 0) {
            var willattack = Math.random();
            // if(willattack<0.8){
            //     this.attack();
            // }
            this.attack();
        }
        if (this.nextdirection != -1) {
            this.game.move(this);
        }
        if (this.auto == 1) {
            this.setup--;
        }
        else {
            this.nextdirection = -1;
        }
    };
    return tank;
}(GameObject));
//子弹
var Ammo = /** @class */ (function (_super) {
    __extends(Ammo, _super);
    function Ammo(game, direction, ower) {
        var _this_1 = _super.call(this) || this;
        _this_1.game = game;
        _this_1.x = ower.x;
        _this_1.y = ower.y;
        _this_1.zindex = 2;
        _this_1.srcs = [
            "./img/ammo0.png",
            "./img/ammo1.png",
            "./img/ammo2.png",
            "./img/ammo3.png"
        ];
        switch (ower.direction) {
            case 0:
                _this_1.y += Math.floor(ower.height / 2);
                //this.x -= 1;
                break;
            case 1:
                _this_1.x += Math.floor(ower.width / 2);
                //this.y -= 1;
                break;
            case 2:
                _this_1.y += Math.floor(ower.height / 2);
                _this_1.x += ower.width;
                break;
            case 3:
                _this_1.x += Math.floor(ower.width / 2);
                _this_1.y += ower.height;
        }
        _this_1.direction = direction;
        _this_1.nextdirection = direction;
        _this_1.speed = 1;
        _this_1.owner = ower;
        _this_1.width = 1;
        _this_1.height = 1;
        _this_1.collision = 2;
        return _this_1;
    }
    Ammo.prototype.getSrc = function () {
        return this.srcs[this.direction];
    };
    Ammo.prototype.onCollisionEnter = function (gameobj) {
        this.game.remove(this);
    };
    //更新
    Ammo.prototype.update = function () {
        if (this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
            this.game.remove(this);
            console.log("移除");
            return;
        }
        this.game.move(this);
    };
    return Ammo;
}(GameObject));
var brick = /** @class */ (function (_super) {
    __extends(brick, _super);
    function brick(game, x, y) {
        var _this_1 = _super.call(this) || this;
        _this_1.game = game;
        _this_1.x = x;
        _this_1.y = y;
        _this_1.width = 2;
        _this_1.height = 2;
        _this_1.src = "./img/brick.png";
        _this_1.collision = 1;
        _this_1.zindex = 1;
        _this_1.direction = -1;
        _this_1.nextdirection = -1;
        return _this_1;
    }
    brick.prototype.getSrc = function () {
        return this.src;
    };
    brick.prototype.update = function () {
    };
    brick.prototype.onCollisionEnter = function (gameobj) {
        if (gameobj instanceof Ammo) {
            this.game.remove(this);
        }
    };
    return brick;
}(GameObject));
var metal = /** @class */ (function (_super) {
    __extends(metal, _super);
    function metal(game, x, y) {
        var _this_1 = _super.call(this) || this;
        _this_1.game = game;
        _this_1.x = x;
        _this_1.y = y;
        _this_1.width = 2;
        _this_1.height = 2;
        _this_1.src = "./img/metal.png";
        _this_1.collision = 1;
        _this_1.zindex = 1;
        _this_1.direction = -1;
        _this_1.nextdirection = -1;
        return _this_1;
    }
    metal.prototype.getSrc = function () {
        return this.src;
    };
    metal.prototype.update = function () {
    };
    metal.prototype.onCollisionEnter = function (gameobj) {
    };
    return metal;
}(GameObject));
var king = /** @class */ (function (_super) {
    __extends(king, _super);
    function king(game, x, y) {
        var _this_1 = _super.call(this) || this;
        _this_1.game = game;
        _this_1.x = x;
        _this_1.y = y;
        _this_1.width = 4;
        _this_1.height = 4;
        _this_1.src = "./img/king.png";
        _this_1.collision = 1;
        _this_1.zindex = 1;
        _this_1.direction = -1;
        _this_1.nextdirection = -1;
        return _this_1;
    }
    king.prototype.getSrc = function () {
        return this.src;
    };
    king.prototype.update = function () {
    };
    king.prototype.onCollisionEnter = function (gameobj) {
        if (gameobj instanceof Ammo) {
            alert("你输了");
            //this.game.remove(this);
            this.game.gameover(true);
        }
    };
    return king;
}(GameObject));
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
if (ctx != null) {
    var g = new game(ctx);
    g.starGame();
    for (var i = 0; i < 80; i = i + 2) {
        g.enemy.push(new brick(g, i, 20));
        g.enemy.push(new brick(g, i, 22));
    }
    g.enemy.push(new brick(g, 20, 16));
    g.enemy.push(new brick(g, 20, 18));
    g.enemy.push(new brick(g, 22, 16));
    g.enemy.push(new brick(g, 22, 18));
    g.enemy.push(new brick(g, 52, 16));
    g.enemy.push(new brick(g, 52, 18));
    g.enemy.push(new brick(g, 54, 16));
    g.enemy.push(new brick(g, 54, 18));
    g.enemy.push(new metal(g, 34, 24));
    g.enemy.push(new metal(g, 34, 26));
    g.enemy.push(new metal(g, 36, 24));
    g.enemy.push(new metal(g, 36, 26));
    g.enemy.push(new metal(g, 38, 24));
    g.enemy.push(new metal(g, 38, 26));
    g.enemy.push(new metal(g, 40, 24));
    g.enemy.push(new metal(g, 40, 26));
    g.enemy.push(new metal(g, 42, 24));
    g.enemy.push(new metal(g, 42, 26));
    g.enemy.push(new metal(g, 44, 24));
    g.enemy.push(new metal(g, 44, 26));
    g.enemy.push(new brick(g, 36, 42));
    g.enemy.push(new brick(g, 36, 44));
    g.enemy.push(new brick(g, 36, 40));
    g.enemy.push(new brick(g, 38, 40));
    g.enemy.push(new brick(g, 40, 40));
    g.enemy.push(new brick(g, 42, 40));
    g.enemy.push(new brick(g, 42, 42));
    g.enemy.push(new brick(g, 42, 44));
    g.enemy.push(new king(g, 38, 42));
}
