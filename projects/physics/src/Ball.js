(function() {

    var Ball = function(c) {
        this.initialize(c);
    }
    var p = Ball.prototype = new createjs.Container();

    p.model;

    Ball.prototype.Container_initialize = p.initialize;
    Ball.prototype.initialize = function(c) {
        this.Container_initialize();

        if(!c)
        {
            c = "#888";
        }

        this.radius = 10;
        this.velocity = {x:0, y:0};

        if(c == "#FFF")
        {
            this.label = "White";
        }
        else if(c == "#000")
        {
            this.label = "Black";
        }
        else if(c == "#F00")
        {
            this.label = "Red";
        }
        else if(c == "#FF0")
        {
            this.label = "Yellow";
        }

        this.norm = {x:0, y:0};

        this.mass = 10;

        this.model = new createjs.Shape();
        this.model.graphics.setStrokeStyle(0.5).beginStroke("#000").beginFill(c).drawCircle(0,0,10);

        this.addChild(this.model);
    }

    window.Ball = Ball;
}());