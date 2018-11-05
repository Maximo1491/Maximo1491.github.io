(function() {

    var Pocket = function() {
        this.initialize();
    }
    var p = Pocket.prototype = new createjs.Container();

    p.model;

    Pocket.prototype.Container_initialize = p.initialize;
    Pocket.prototype.initialize = function() {
        this.Container_initialize();

        this.radius = 10;
        this.velocity = {x:0, y:0};

        this.mass = 999999999999999999999999999999999999999999999999;

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#000").drawCircle(0,0,20);

        this.addChild(this.model);
    }

    window.Pocket = Pocket;
}());