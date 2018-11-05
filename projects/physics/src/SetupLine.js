(function() {

    var SetupLine = function() {
        this.initialize();
    }
    var p = SetupLine.prototype = new createjs.Container();

    p.model;

    SetupLine.prototype.Container_initialize = p.initialize;
    SetupLine.prototype.initialize = function() {
        this.Container_initialize();

        this.model = new createjs.Shape();
        this.model.graphics.beginStroke("#000");
        this.model.graphics.moveTo(0, 0).lineTo(0,400);

        this.addChild(this.model);
    }

    window.SetupLine = SetupLine;
}());