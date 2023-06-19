class GameObject {
    constructor() {

    }
    //宽度
    width: number;
    //高度
    height: number;
    //游戏
    game: game;
    //x坐标
    x: number;
    //y坐标
    y: number;
    //方向
    direction: number;
    //速度
    speed: number;
    //行动方向
    nextdirection: number;
    //渲染层级
    zindex: number;

    //队伍
    team: number;
    //是否能碰撞
    collision: number;

    getSrc(): string {
        return "";
    }

    update() {

    }

    onCollisionEnter(gameobj: GameObject) {

    }
}

//游戏组件
class game {
    //宽度
    width: number;
    //高度
    height: number;
    //敌人
    enemy: GameObject[];
    //画笔
    ctx: CanvasRenderingContext2D;
    //敌人出生点
    enemyBornX: number[];

    timer: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.init()
        this.update = this.update.bind(this);
        this.enemyBornX = [0, 37, 75];
    }

    init() {
        this.width = 80;
        this.height = 46;
    }

    //开始游戏
    starGame() {
        var player = new tank(this, 0);
        player.x = 32;
        player.y = 42;
        this.enemy = [];
        this.enemy.push(player);
        //设置定时器,每秒24帧
        this.timer=setInterval(this.update, 1000 / 24);
    }

    gameover(lose: boolean) {
        clearInterval(this.timer);
        if(lose){
            alert("你输了");
        }else{
            alert("你赢了");
        }
    }

    initMap() {
        this.ctx.clearRect(0, 0, 640, 368);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, 640, 368);
    }

    //产生一个敌人
    genenratorEnemy() {
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
    }
    //更新游戏
    update() {
        //当场上的敌人小于6个时,产生一个敌人
        if (this.enemy.filter(a=>a instanceof tank).length < 7) {
            //产生一个敌人
            //不一定能产生成功,如果出生点有坦克,则不产生
            this.genenratorEnemy();
        }
        this.enemy.forEach((e) => e.update());
        this.initMap();
        //渲染
        this.render();
    }
    //移动对象
    move(gameobj: GameObject) {
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
                        gameobj.x -= gameobj.speed; break;
                    case 1:
                        if (gameobj.y == 0 && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.y -= gameobj.speed; break;
                    case 2:
                        if (gameobj.x == gameobj.game.width - gameobj.width && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.x += gameobj.speed; break;
                    case 3:
                        if (gameobj.y == gameobj.game.height - gameobj.height && gameobj.collision == 1) {
                            return;
                        }
                        gameobj.y += gameobj.speed; break;
                }
            }
        }
    }
    //检测对象是否能移动
    canMove(gameobj: GameObject, direction: number) {
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
    }

    getCollision(gameobj: GameObject, direction: number): GameObject | null {
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
    }
    remove(gameobj: GameObject) {
        this.enemy = this.enemy.filter((item) => item != gameobj);
    }
    add(gameobj: GameObject) {
        this.enemy.push(gameobj);
    }
    //渲染游戏
    render() {
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
    }
    //绘制网格
    drawBlock(j: number, i: number) {
        var x = j * 8;
        var y = i * 8;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x, y, 8, 8);
    }
    //清除网格
    clearBlock(j: number, i: number) {
        var x = j * 8;
        var y = i * 8;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(x, y, 8, 8);
    }
}

//坦克
class tank extends GameObject {
    constructor(game: game, auto: number) {
        super();
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.direction = 1;
        this.speed = 1;
        this.hp = 1;
        this.cd = 0;
        this.auto = auto;
        this.setup = -1;
        this.width = 4;
        this.height = 4;
        this.team = auto;
        this.zindex = 1;

        this.attack = this.attack.bind(this);
        var _this = this;
        if (auto < 1) {
            window.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 37: _this.nextdirection = 0; break;
                    case 38: _this.nextdirection = 1; break;
                    case 39: _this.nextdirection = 2; break;
                    case 40: _this.nextdirection = 3; break;
                    case 32: _this.attack(); break;
                }
            }
        }
        this.collision = 1;
        this.srcs = [
            "./img/tank0.png",
            "./img/tank1.png",
            "./img/tank2.png",
            "./img/tank3.png"
        ];
    }
    auto: number;
    direction: number;
    hp: number;
    cd: number;
    setup: number;
    srcs: string[];

    override getSrc(): string {
        return this.srcs[this.direction];
    }

    override onCollisionEnter(gameobj: GameObject): void {
        if (gameobj instanceof Ammo) {
            this.onattack(gameobj.owner);
        }
    }

    onattack(owner: GameObject) {
        //被攻击
        if (owner.team != this.team) {
            this.hp--;
            if (this.hp < 1) {
                this.game.remove(this);
                if(this.auto==0){
                    this.game.gameover(true);
                }
            }
        }
    }

    attack() {
        //攻击
        if (this.cd > 0) {
            return;
        }
        this.cd = 0.5;
        var _this = this;
        setTimeout(() => {
            _this.cd = 0;
        }, 500);
        var ammo = new Ammo(this.game, this.direction, this);
        this.game.add(ammo);
    }
    //更新
    override update() {
        if (this.auto == 1 && this.setup < 1) {
            this.nextdirection = Math.floor(Math.random() * 4);
            this.setup = Math.floor(Math.random() * 10);
        }
        if (this.auto == 1&&this.cd==0) {
            var willattack=Math.random();
            this.attack();
        }
        if (this.nextdirection != -1) {
            this.game.move(this);
        }
        if (this.auto == 1) {
            this.setup--;
        } else {
            this.nextdirection = -1;
        }
    }
}

//子弹
class Ammo extends GameObject {
    constructor(game: game, direction: number, ower: GameObject) {
        super();
        this.game = game;
        this.x = ower.x;
        this.y = ower.y;
        this.zindex = 2;
        this.srcs = [
            "./img/ammo0.png",
            "./img/ammo1.png",
            "./img/ammo2.png",
            "./img/ammo3.png"
        ];
        switch (ower.direction) {
            case 0:
                this.y += Math.floor(ower.height / 2);
                //this.x -= 1;
                break;
            case 1:
                this.x += Math.floor(ower.width / 2);
                //this.y -= 1;
                break;
            case 2:
                this.y += Math.floor(ower.height / 2);
                this.x += ower.width;
                break;
            case 3:
                this.x += Math.floor(ower.width / 2);
                this.y += ower.height;
        }
        this.direction = direction;
        this.nextdirection = direction;
        this.speed = 1;
        this.owner = ower;
        this.width = 1;
        this.height = 1;
        this.collision = 2;
    }
    owner: GameObject;
    speed: number;
    srcs: string[];
    override getSrc(): string {
        return this.srcs[this.direction];
    }
    override onCollisionEnter(gameobj: GameObject): void {
        this.game.remove(this);
    }

    //更新
    override update() {
        if (this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
            this.game.remove(this);
            console.log("移除");
            return;
        }
        this.game.move(this);
    }
}

class brick extends GameObject{
    constructor(game:game,x:number,y:number){
        super();
        this.game=game;
        this.x=x;
        this.y=y;
        this.width=2;
        this.height=2;
        this.src="./img/brick.png";
        this.collision=1;
        this.zindex=1;
        this.direction=-1;
        this.nextdirection=-1;
    }

    src:string;

    override getSrc(): string {
        return this.src;
    }
    override update(): void {
        
    }

    override onCollisionEnter(gameobj: GameObject): void {
        if(gameobj instanceof Ammo){
            this.game.remove(this);
        }
    }
}
class metal extends GameObject{
    constructor(game:game,x:number,y:number){
        super();
        this.game=game;
        this.x=x;
        this.y=y;
        this.width=2;
        this.height=2;
        this.src="./img/metal.png";
        this.collision=1;
        this.zindex=1;
        this.direction=-1;
        this.nextdirection=-1;
    }

    src:string;

    override getSrc(): string {
        return this.src;
    }
    override update(): void {
        
    }

    override onCollisionEnter(gameobj: GameObject): void {
    }
}

class king extends GameObject{
    constructor(game:game,x:number,y:number){
        super();
        this.game=game;
        this.x=x;
        this.y=y;
        this.width=4;
        this.height=4;
        this.src="./img/king.png";
        this.collision=1;
        this.zindex=1;
        this.direction=-1;
        this.nextdirection=-1;
    }

    src:string;

    override getSrc(): string {
        return this.src;
    }
    override update(): void {
        
    }

    override onCollisionEnter(gameobj: GameObject): void {
        if(gameobj instanceof Ammo){
            alert("你输了");
            //this.game.remove(this);
            this.game.gameover(true);
        }
    }
}

var canvas = document.getElementById("game") as HTMLCanvasElement;
var ctx = canvas.getContext("2d");
if (ctx != null) {
    var g = new game(ctx);
    g.starGame();
    for(var i=0;i<80;i=i+2){
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

    g.enemy.push(new metal(g,34,24));
    g.enemy.push(new metal(g,34,26));
    g.enemy.push(new metal(g,36,24));
    g.enemy.push(new metal(g,36,26));
    g.enemy.push(new metal(g,38,24));
    g.enemy.push(new metal(g,38,26));
    g.enemy.push(new metal(g,40,24));
    g.enemy.push(new metal(g,40,26));
    g.enemy.push(new metal(g,42,24));
    g.enemy.push(new metal(g,42,26));
    g.enemy.push(new metal(g,44,24));
    g.enemy.push(new metal(g,44,26));

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