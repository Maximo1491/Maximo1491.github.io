(function() {

    var Bumper = function(w, h) {
        this.initialize(w, h);
    }
    var p = Bumper.prototype = new createjs.Container();

    p.model;

    Bumper.prototype.Container_initialize = p.initialize;
    Bumper.prototype.initialize = function(w, h) {
        this.Container_initialize();

        this.width = w;
        this.height = h;

        this.start = {x:0, y:0};
        this.end = {x:0, y:0};

        this.norm = {x:0, y:0};

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#228800").drawRect(0, 0, w, h);

        this.addChild(this.model);
    }

    Bumper.prototype.calcNorms = function()
    {
        var nx = this.end.x - this.start.x;
        var ny = this.end.y - this.start.y;

        this.norm = {x: -ny, y: nx};

        nx = this.norm.x;
        ny = this.norm.y;

        nx = nx / mag(this.norm);
        ny = ny / mag(this.norm);

        this.norm = {x: Math.abs(nx), y: Math.abs(ny)};
    }

    window.Bumper = Bumper;
}());