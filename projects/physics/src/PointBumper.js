(function() {

    var PointBumper = function() {
        this.initialize();
    }
    var p = PointBumper.prototype = new createjs.Container();

    p.model;

    PointBumper.prototype.Container_initialize = p.initialize;
    PointBumper.prototype.initialize = function() {
        this.Container_initialize();

        this.radius = 0.5;
        this.velocity = {x:0, y:0};

        this.mass = 999999999999999999999999999999999999999999999999;

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#228800").drawCircle(0,0,0.5);

        this.addChild(this.model);
    }

    window.PointBumper = PointBumper;
}());