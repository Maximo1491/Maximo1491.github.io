var stage

var balls = new Array();
var bumpers = new Array();
var bumperEnds = new Array();
var pointBumpers = new Array();
var pockets = new Array();
var table;

var friction;

var dt;

var gameState;
var lastTurn;

var mouseX;
var mouseY;

var aim;

var player1 = "Any";
var player2 = "Any";

var gameStateText;
var gameStateDescription;
var player1Text;
var player2Text;
var uiRed = 0;
var uiYellow = 0;
var uiBalls = new Array();

var whitePotted = false;
var redPotted = false;
var yellowPotted = false;

var white = "#FFF";
var black = "#000";
var red = "#F00";
var yellow = "#FF0";

function init()
{
    //Setup Canvas
    stage = new createjs.Stage("Canvas");

    friction = 1;
    gameState = "Setup";

    table = stage.addChild(new Table());
    table.x = stage.canvas.width*0.5-400;
    table.y = stage.canvas.height*0.5-250;

    stage.on("click", handleMouseClick);
    stage.on("stagemousemove", handleMouseMove);

    var setupLine = stage.addChild(new SetupLine());
    setupLine.x = table.x + 200;
    setupLine.y = table.y;


    aim = stage.addChild(new SetupLine());

    var backgroundBox = stage.addChild(new createjs.Shape());
    backgroundBox.graphics.beginFill("#F8F8F8").drawRect(0, 0, stage.canvas.width, table.y);

    backgroundBox = stage.addChild(new createjs.Shape());
    backgroundBox.graphics.beginFill("#F8F8F8").drawRect(0, table.y + table.height, stage.canvas.width, 500);

    backgroundBox = stage.addChild(new createjs.Shape());
    backgroundBox.graphics.beginFill("#F8F8F8").drawRect(0, 0, table.x, stage.canvas.height);

    backgroundBox = stage.addChild(new createjs.Shape());
    backgroundBox.graphics.beginFill("#F8F8F8").drawRect(table.x + table.width, 0, 500, stage.canvas.height);

    gameStateText = stage.addChild(new createjs.Text("Player 1 Break!", "40px Oxygen", "#AFAFAF"));
    gameStateText.textAlign = "center";
    gameStateText.x = stage.canvas.width*0.5;
    gameStateText.y = 15;

    gameStateDescription = stage.addChild(new createjs.Text("Place the ball behind the line", "30px Oxygen", "#AFAFAF"));
    gameStateDescription.textAlign = "center";
    gameStateDescription.x = stage.canvas.width*0.5;
    gameStateDescription.y = table.y + table.height + 30;

    player1Text = stage.addChild(new createjs.Text("Player 1", "20px Oxygen", "#AFAFAF"));
    player1Text.textAlign = "center";
    player1Text.x = table.x - 65;
    player1Text.y = table.y;

    player2Text = stage.addChild(new createjs.Text("Player 2", "20px Oxygen", "#AFAFAF"));
    player2Text.textAlign = "center";
    player2Text.x = table.x + table.width + 65;
    player2Text.y = table.y;

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + 20;
    pocket.y = table.y + 20;
    pockets.push(pocket);

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + table.width - 20;
    pocket.y = table.y + 20;
    pockets.push(pocket);

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + 20;
    pocket.y = table.y + table.height - 20;
    pockets.push(pocket);

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + table.width - 20;
    pocket.y = table.y + table.height - 20;
    pockets.push(pocket);

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + table.width*0.5;
    pocket.y = table.y;
    pockets.push(pocket);

    var pocket = stage.addChild(new Pocket());
    pocket.x = table.x + table.width*0.5;
    pocket.y = table.y + table.height;
    pockets.push(pocket);

    var tableSides = stage.addChild(new TableSides());
    tableSides.x = table.x;
    tableSides.y = table.y;

    var bumper = stage.addChild(new Bumper(20, 300));
    bumper.x = stage.canvas.width*0.5-400;
    bumper.y = stage.canvas.height*0.5-200;
    bumper.start = {x: bumper.x + bumper.width, y: bumper.y};
    bumper.end = {x: bumper.x + bumper.width, y: bumper.y + bumper.height};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y, bumper.x, bumper.y - 20, bumper.x, bumper.y));
    bumperEnds.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y + bumper.height, bumper.x, bumper.y + bumper.height + 20, bumper.x, bumper.y + bumper.height));
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var bumper = stage.addChild(new Bumper(20, 300));
    bumper.x = stage.canvas.width*0.5+380;
    bumper.y = stage.canvas.height*0.5-200;
    bumper.start = {x: bumper.x, y: bumper.y};
    bumper.end = {x: bumper.x, y: bumper.y + bumper.height};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y, bumper.x + bumper.width, bumper.y - 20, bumper.x + bumper.width, bumper.y));
    bumperEnds.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y + bumper.height, bumper.x  + bumper.width, bumper.y + bumper.height + 20, bumper.x  + bumper.width, bumper.y + bumper.height));
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var bumper = stage.addChild(new Bumper(310, 20))
    bumper.x = stage.canvas.width*0.5-350;
    bumper.y = stage.canvas.height*0.5-250;
    bumper.start = {x: bumper.x, y: bumper.y + bumper.height};
    bumper.end = {x: bumper.x + bumper.width, y: bumper.y + bumper.height};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y + bumper.height, bumper.x - 20, bumper.y, bumper.x, bumper.y))
    bumpers.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y + bumper.height, bumper.x  + bumper.width + 20, bumper.y, bumper.x  + bumper.width, bumper.y))
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var bumper = stage.addChild(new Bumper(310, 20))
    bumper.x = stage.canvas.width*0.5+40;
    bumper.y = stage.canvas.height*0.5-250;
    bumper.start = {x: bumper.x, y: bumper.y + bumper.height};
    bumper.end = {x: bumper.x + bumper.width, y: bumper.y + bumper.height};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y + bumper.height, bumper.x - 20, bumper.y, bumper.x, bumper.y))
    bumperEnds.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y + bumper.height, bumper.x  + bumper.width + 20, bumper.y, bumper.x  + bumper.width, bumper.y))
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var bumper = stage.addChild(new Bumper(310, 20))
    bumper.x = stage.canvas.width*0.5-350;
    bumper.y = stage.canvas.height*0.5+130;
    bumper.start = {x: bumper.x, y: bumper.y};
    bumper.end = {x: bumper.x + bumper.width, y: bumper.y};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y, bumper.x - 20, bumper.y + bumper.height, bumper.x, bumper.y + bumper.height))
    bumperEnds.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y, bumper.x  + bumper.width + 20, bumper.y + bumper.height, bumper.x, bumper.y + bumper.height))
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var bumper = stage.addChild(new Bumper(310, 20))
    bumper.x = stage.canvas.width*0.5+40;
    bumper.y = stage.canvas.height*0.5+130;
    bumper.start = {x: bumper.x, y: bumper.y};
    bumper.end = {x: bumper.x + bumper.width, y: bumper.y};
    bumper.calcNorms();
    bumpers.push(bumper);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x, bumper.y, bumper.x - 20, bumper.y + bumper.height, bumper.x, bumper.y + bumper.height))
    bumperEnds.push(bumperEnd);

    var bumperEnd = stage.addChild(new BumperEnd(bumper.x + bumper.width, bumper.y, bumper.x  + bumper.width + 20, bumper.y + bumper.height, bumper.x, bumper.y + bumper.height))
    bumperEnds.push(bumperEnd);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.start.x;
    pointBumper.y = bumper.start.y;
    pointBumpers.push(pointBumper);

    var pointBumper = stage.addChild(new PointBumper());
    pointBumper.x = bumper.end.x;
    pointBumper.y = bumper.end.y;
    pointBumpers.push(pointBumper);

    var ball = stage.addChild(new Ball(white));
    ball.x = -100;
    ball.y = -100;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 200;
    ball.y = table.y + table.height*0.5;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 180;
    ball.y = table.y + table.height*0.5 - 10;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 180;
    ball.y = table.y + table.height*0.5 + 10;
    balls.push(ball);

    var ball = stage.addChild(new Ball(black));
    ball.x = table.x + table.width - 160;
    ball.y = table.y + table.height*0.5;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 160;
    ball.y = table.y + table.height*0.5 - 20;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 160;
    ball.y = table.y + table.height*0.5 + 20;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 140;
    ball.y = table.y + table.height*0.5 - 10;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 140;
    ball.y = table.y + table.height*0.5 + 10;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 140;
    ball.y = table.y + table.height*0.5 - 30;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 140;
    ball.y = table.y + table.height*0.5 + 30;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 120;
    ball.y = table.y + table.height*0.5;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 120;
    ball.y = table.y + table.height*0.5 + 20;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 120;
    ball.y = table.y + table.height*0.5 + 40;
    balls.push(ball);

    var ball = stage.addChild(new Ball(red));
    ball.x = table.x + table.width - 120;
    ball.y = table.y + table.height*0.5 - 20;
    balls.push(ball);

    var ball = stage.addChild(new Ball(yellow));
    ball.x = table.x + table.width - 120;
    ball.y = table.y + table.height*0.5 - 40;
    balls.push(ball);

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(30);
}

function handleMouseMove(evt)
{
    mouseX = evt.stageX;
    mouseY = evt.stageY;

    updateTable();
}

function updateTable()
{
    if(gameState == "Player1" || gameState == "Player2" || gameState == "Break")
    {
        var mouseDist = {x: balls[0].x - mouseX, y: balls[0].y - mouseY};

        var mouseMag = mag(mouseDist);

        mouseDist.x *= 1/mouseMag;
        mouseDist.y *= 1/mouseMag;

        mouseDist.x *= mouseMag*1000;
        mouseDist.y *= mouseMag*1000;

        aim.model.graphics.clear();
        aim.model.graphics.beginStroke("#000");
        aim.model.graphics.moveTo(balls[0].x, balls[0].y).lineTo(mouseDist.x, mouseDist.y);
        aim.model.graphics.endStroke();

        if(player1 == "Any" && player2 == "Any" && gameState != "Break")
        {
            gameStateDescription.text = "No balls were potted! Go for a red or yellow ball!"
        }
        else if(gameState == "Player1" && player1 == "Black")
        {
            gameStateDescription.text = "Go for a Black ball!"
        }
        else if(gameState == "Player2" && player2 == "Black")
        {
            gameStateDescription.text = "Go for a Black ball!"
        }
    }
}

function handleMouseClick(evt)
{
    if(gameState == "Setup")
    {
        if( mouseX > table.x + 30 && mouseX < table.x + 190 &&
            mouseY > table.y + 30 && mouseY < table.y + table.height - 30)
        {
            balls[0].x = mouseX;
            balls[0].y = mouseY;
            gameState = "Break";
            gameStateDescription.text = "Now using your mouse point the cue ball towards the other balls, \nthe further away you click from the ball the more power you will get \npot either a yellow or red ball!"
        }
    }
    else if(gameState == "Break")
    {
        friction = 1;
        aim.model.graphics.clear();
        hitCueBall();
        gameState = "BallsMoving";
        lastTurn = "Player1";
        gameStateText.text = "Nice shot!";
        gameStateDescription.text = "Now wait for the balls to stop moving then it is player 2's turn!"

    }
    else if(gameState == "Player1")
    {
        friction = 1;
        hitCueBall();
        aim.model.graphics.clear();
        gameState = "BallsMoving";
        lastTurn = "Player1";
        gameStateDescription.text = "Now wait for the balls to stop moving then it is player 2's turn!"
    }
    else if(gameState == "Player2")
    {
        friction = 1;
        hitCueBall();
        aim.model.graphics.clear();
        gameState = "BallsMoving";
        lastTurn = "Player2";
        gameStateDescription.text = "Now wait for the balls to stop moving then it is player 1's turn!"
    }
    else if(gameState == "PlaceBall")
    {
        if( mouseX > table.x + 30 && mouseX < table.x + 190 &&
            mouseY > table.y + 30 && mouseY < table.y + table.height - 30)
        {
            balls[0].x = mouseX;
            balls[0].y = mouseY;

            if(lastTurn == "Player1")
            {
                gameState = "Player2";
                if(player2 == "Red")
                {
                    gameStateDescription.text = "Now go for a red ball!"
                }
                else if(player2 == "Yellow")
                {
                    gameStateDescription.text = "Now go for a yellow ball!"
                }
                else
                {
                    gameStateDescription.text = "Now go for any ball!"
                }
            }
            else
            {
                gameState = "Player1";
                if(player1 == "Red")
                {
                    gameStateDescription.text = "Now go for a red ball!"
                }
                else if(player1 == "Yellow")
                {
                    gameStateDescription.text = "Now go for a yellow ball!"
                }
                else
                {
                    gameStateDescription.text = "Now go for any ball!"
                }
            }
        }
    }
}

function hitCueBall()
{
    var mouseDist = {x: balls[0].x - mouseX, y: balls[0].y - mouseY};

    var mouseMag = mag(mouseDist);

    mouseDist.x *= 1/mouseMag;
    mouseDist.y *= 1/mouseMag;

    if(mouseMag > 40)
        mouseMag = 40;

    mouseDist.x *= mouseMag*10;
    mouseDist.y *= mouseMag*10;

    balls[0].velocity.x = mouseDist.x;
    balls[0].velocity.y = mouseDist.y;
}

function testHitCircCirc(obj1, obj2)
{

    var r = obj1.radius + obj2.radius;

    r *= r;

    var dx = obj2.x - obj1.x;
    var dy = obj2.y - obj1.y;

    var dist = (dx*dx) + (dy*dy);

    if(dist < r)
    {
        var norm = {x:obj2.x - obj1.x, y:obj2.y - obj1.y};

        var sqrDist = Math.sqrt(dist);

        norm.x *= (1/sqrDist);
        norm.y *= (1/sqrDist);

        var tang = {x:-norm.y, y:norm.x};

        var v1n = dot(norm, obj1.velocity);
        var v1t = dot(tang, obj1.velocity);
        var v2n = dot(norm, obj2.velocity);
        var v2t = dot(tang, obj2.velocity);

        var v1n2 = ((v1n*(obj1.mass - obj2.mass)) + ((2 * obj2.mass) * v2n)) / (obj1.mass + obj2.mass);
        var v2n2 = ((v2n*(obj2.mass - obj1.mass)) + ((2 * obj1.mass) * v1n)) / (obj1.mass + obj2.mass);

        var newVel1n = {x:norm.x * v1n2, y:norm.y * v1n2};
        var newVel1t = {x:tang.x * v1t,  y:tang.y * v1t};
        var newVel2n = {x:norm.x * v2n2, y:norm.y * v2n2};
        var newVel2t = {x:tang.x * v2t,  y:tang.y * v2t};

        var newVel1 = {x:newVel1n.x + newVel1t.x, y:newVel1n.y + newVel1t.y};
        var newVel2 = {x:newVel2n.x + newVel2t.x, y:newVel2n.y + newVel2t.y};

        obj1.x -= dt*obj1.velocity.x;
        obj1.y -= dt*obj1.velocity.y;
        obj2.x -= dt*obj2.velocity.x;
        obj2.y -= dt*obj2.velocity.y;

        obj1.velocity = newVel1;
        obj2.velocity = newVel2;

        obj1.x += dt*obj1.velocity.x;
        obj1.y += dt*obj1.velocity.y;
        obj2.x += dt*obj2.velocity.x;
        obj2.y += dt*obj2.velocity.y;

        return true;
    }
    else
    {
        return false;
    }
}

function testHitCircPoint(obj1, obj2)
{

    var r = obj1.radius + obj2.radius;

    r *= r;

    var dx = obj2.x - obj1.x;
    var dy = obj2.y - obj1.y;

    var dist = (dx*dx) + (dy*dy);

    if(dist < r)
    {
        var norm = {x:obj2.x - obj1.x, y:obj2.y - obj1.y};

        var sqrDist = Math.sqrt(dist);

        norm.x *= (1/sqrDist);
        norm.y *= (1/sqrDist);

        var tang = {x:-norm.y, y:norm.x};

        var v1n = dot(norm, obj1.velocity);
        var v1t = dot(tang, obj1.velocity);
        var v2n = dot(norm, obj2.velocity);
        var v2t = dot(tang, obj2.velocity);

        var v1n2 = ((v1n*(obj1.mass - obj2.mass)) + ((2 * obj2.mass) * v2n)) / (obj1.mass + obj2.mass);
        var v2n2 = ((v2n*(obj2.mass - obj1.mass)) + ((2 * obj1.mass) * v1n)) / (obj1.mass + obj2.mass);

        var newVel1n = {x:norm.x * v1n2, y:norm.y * v1n2};
        var newVel1t = {x:tang.x * v1t,  y:tang.y * v1t};
        var newVel2n = {x:norm.x * v2n2, y:norm.y * v2n2};
        var newVel2t = {x:tang.x * v2t,  y:tang.y * v2t};

        var newVel1 = {x:newVel1n.x + newVel1t.x, y:newVel1n.y + newVel1t.y};
        var newVel2 = {x:newVel2n.x + newVel2t.x, y:newVel2n.y + newVel2t.y};

        obj1.velocity = newVel1;
        obj2.velocity = newVel2;

        obj1.x += dt*obj1.velocity.x;
        obj1.y += dt*obj1.velocity.y;
        obj2.x += dt*obj2.velocity.x;
        obj2.y += dt*obj2.velocity.y;

        return true;
    }
    else
    {
        return false;
    }
}

function testHitCircLine(circ, line)
{
    var c1 = {x: circ.x - line.start.x , y: circ.y - line.start.y};
    var e1 = {x: line.end.x - line.start.x, y: line.end.y - line.start.y};

    var k = dot(c1, e1);

    if(k > 0)
    {
        k /= mag(e1);

        if(k < mag(e1))
        {
            if(c1.x*c1.x + c1.y*c1.y - k*k <= circ.radius*circ.radius)
            {
                if(line.norm.x == 1)
                {
                    circ.velocity.x = -circ.velocity.x;

                    circ.x += dt*circ.velocity.x;
                    circ.y += dt*circ.velocity.y;
                    return true;
                }
                if(line.norm.y == 1)
                {
                    circ.velocity.y = -circ.velocity.y;

                    circ.x += dt*circ.velocity.x;
                    circ.y += dt*circ.velocity.y;
                    return true;
                }

                var inverseVelo = {x: -circ.velocity.x, y: -circ.velocity.y}
                var proj = dot(inverseVelo, line.norm);
                var rectProg = {x:line.norm.x*proj, y:line.norm.y*proj};

                circ.velocity.x += 2*rectProg.x;
                circ.velocity.y += 2*rectProg.y;

                circ.x += dt*circ.velocity.x;
                circ.y += dt*circ.velocity.y;

                return true;
            }
        }
    }

    return false;
}

function dot(obj1, obj2)
{
    var dotProduct;

    dotProduct = (obj1.x * obj2.x) + (obj1.y * obj2.y);

    return dotProduct;
}

function mag(vec)
{
    var mag;

    mag = Math.sqrt((vec.x*vec.x) + (vec.y*vec.y));

    return mag;
}

function pottedRed()
{
    uiRed++;
    redPotted = true;

    if(player1 == "Red")
    {
        var ball = stage.addChild(new Ball(red));
        ball.x = player1Text.x;
        ball.y = player1Text.y + 20 + (30*uiRed);
        uiBalls.push(ball);
        if(uiRed == 7)
        {
            player1 = "Black";
        }
    }
    else
    {
        var ball = stage.addChild(new Ball(red));
        ball.x = player2Text.x;
        ball.y = player2Text.y + 20 + (30*uiRed);
        uiBalls.push(ball);
        if(uiRed == 7)
        {
            player2 = "Black";
        }
    }
}

function pottedYellow()
{
    uiYellow++;
    yellowPotted = true;

    if(player1 == "Yellow")
    {
        var ball = stage.addChild(new Ball(yellow));
        ball.x = player1Text.x;
        ball.y = player1Text.y + 20 + (30*uiYellow);
        uiBalls.push(ball);
        if(uiYellow == 7)
        {
            player1 = "Black";
        }
    }
    else
    {
        var ball = stage.addChild(new Ball(yellow));
        ball.x = player2Text.x;
        ball.y = player2Text.y + 20 + (30*uiYellow);
        uiBalls.push(ball);
        if(uiYellow == 7)
        {
            player2 = "Black";
        }
    }
}

function tick(event)
{
    dt = event.delta/1000;

    var stoppedCount = 0;

    for(var i = 0; i < balls.length; i++)
    {
        balls[i].x += dt*balls[i].velocity.x;
        balls[i].y += dt*balls[i].velocity.y;

        balls[i].velocity.x *= friction;
        balls[i].velocity.y *= friction;

        friction -= dt*0.0002;

        if( balls[i].velocity.x < 1 && balls[i].velocity.x > -1 &&
            balls[i].velocity.y < 1 && balls[i].velocity.y > -1)
        {
            stoppedCount++;
        }
    }

    if(stoppedCount == balls.length && gameState == "BallsMoving")
    {
        console.log(redPotted);
        console.log(yellowPotted);
        console.log(player1);
        console.log(player2);

        if(lastTurn == "Player1")
        {
            gameState = "Player2";
            gameStateText.text = "Player 2's Turn!";

            if(player2 == "Red")
            {
                gameStateDescription.text = "Go for a red ball!"
            }
            else
            {
                gameStateDescription.text = "Go for a yellow ball!"
            }

            if(player1 == "Red" && redPotted == true && yellowPotted == false)
            {
                gameState = "Player1";
                gameStateText.text = "Player 1's Turn!";
                gameStateDescription.text = "You potted a red! You get another shot!";
            }

            if(player1 == "Yellow" && yellowPotted == true && redPotted == false)
            {
                gameState = "Player1";
                gameStateText.text = "Player 1's Turn!";
                gameStateDescription.text = "You potted a yellow! You get another shot!";
            }

            if(yellowPotted == true && redPotted == true && player2 == "Red")
            {
                gameStateDescription.text = "You potted a yellow and a red! Player 2 go for a red!";
            }

            if(yellowPotted == true && redPotted == true && player2 == "Yellow")
            {
                gameStateDescription.text = "You potted a yellow and a red! Player 2 go for a yellow!";
            }
        }
        else
        {
            gameState = "Player1";
            gameStateText.text = "Player 1's Turn!";

            if(player1 == "Red")
            {
                gameStateDescription.text = "Go for a red ball!"
            }
            else
            {
                gameStateDescription.text = "Go for a yellow ball!"
            }

            if(player2 == "Red" && redPotted == true && yellowPotted == false)
            {
                gameState = "Player2";
                gameStateText.text = "Player 2's Turn!";
                gameStateDescription.text = "You potted a red! You get another shot!";
            }

            if(player2 == "Yellow" && yellowPotted == true && redPotted == false)
            {
                gameState = "Player2";
                gameStateText.text = "Player 2's Turn!";
                gameStateDescription.text = "You potted a yellow! You get another shot!";
            }

            if(yellowPotted == true && redPotted == true && player1 == "Red")
            {
                gameStateDescription.text = "You potted a yellow and a red! Player 1 go for a red!";
            }

            if(yellowPotted == true && redPotted == true && player1 == "Yellow")
            {
                gameStateDescription.text = "You potted a yellow and a red! Player 1 go for a yellow!";
            }
        }

        if(whitePotted == true)
        {
            if(lastTurn == "Player1")
            {
                gameStateText.text = "Player 2's Turn!";
            }
            else
            {
                gameStateText.text = "Player 1's Turn!";
            }
            gameState = "PlaceBall";
            gameStateDescription.text = "You potted the White! Place it back behind the line!";
            whitePotted = false;
        }

        redPotted = false;
        yellowPotted = false;

        updateTable();
    }

    for(var i = 0; i < balls.length; i++)
    {
        for(var j = 0; j < bumpers.length; j++)
        {
            if(testHitCircLine(balls[i],bumpers[j]))
                break;
        }

        for(var j = 0; j < bumperEnds.length; j++)
        {
            if(testHitCircLine(balls[i],bumperEnds[j]))
                break;
        }

        for(var j = 0; j < pointBumpers.length; j++)
        {
            if(testHitCircPoint(balls[i],pointBumpers[j]))
                break;
        }

        var k = 0;
        var hit;
        while(k < 20)
        {
            hit = false;
            for(var j = 0; j < balls.length; j++)
            {
                if(i == j)
                    continue;
                else
                {
                    if(testHitCircCirc(balls[i], balls[j]))
                        hit = true;
                }
            }
            k++
            if(hit == false)
                break;
        }

        for(var j = 0; j < pockets.length; j++)
        {
            if(testHitCircCirc(balls[i],pockets[j]))
            {
                if(balls[i].label == "Red" || balls[i].label == "Yellow")
                {
                    if(balls[i].label == "Red" && player1 != "Any" && player2 != "Any")
                    {
                        pottedRed();
                    }
                    else if (player1 != "Any" && player2 != "Any")
                    {
                        pottedYellow();
                    }
                    else if(player1 == "Any" && player2 == "Any")
                    {
                        if(lastTurn == "Player1")
                        {
                            if(balls[i].label == "Red")
                            {
                                player1 = "Red";
                                player2 = "Yellow";
                                pottedRed();
                            }
                            else
                            {
                                player1 = "Yellow";
                                player2 = "Red";
                                pottedYellow();
                            }
                        }
                        else
                        {
                            if(balls[i].label == "Red")
                            {
                                player2 = "Red";
                                player1 = "Yellow";
                                pottedRed();
                            }
                            else
                            {
                                player2 = "Yellow";
                                player1 = "Red";
                                pottedYellow();
                            }
                        }
                    }

                    stage.removeChild(balls[i]);
                    balls.splice(i,1);
                    break;
                }

                if(balls[i].label == "White")
                {
                    balls[i].x = -100;
                    balls[i].y = -100;
                    balls[i].velocity.x = 0;
                    balls[i].velocity.y = 0;
                    whitePotted = true;
                }

                if(balls[i].label == "Black")
                {
                    gameState = "GameOver";
                    gameStateText.text = "Game Over"

                    if(lastTurn == "Player1")
                    {
                        gameStateDescription.text = "You potted the black! Player 2 Wins!"
                    }
                    else
                    {
                        gameStateDescription.text = "You potted the black! Player 1 Wins!"
                    }

                    if(player1 == "Black" && lastTurn == "Player1")
                    {
                        gameStateDescription.text = "Player 1 Wins!"
                    }
                    else if(player2 == "Black" && lastTurn == "Player2")
                    {
                        gameStateDescription.text = "Player 2 Wins!"
                    }

                    stage.removeChild(balls[i]);
                    balls.splice(i,1);
                    break;
                }
            }
        }
    }

    stage.update();
}