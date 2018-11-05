(function() {

    var BumperEnd = function(sx, sy, ex, ey, px, py) {
        this.initialize(sx, sy, ex, ey, px, py);
    }
    var p = BumperEnd.prototype = new createjs.Container();

    p.model;

    BumperEnd.prototype.Container_initialize = p.initialize;
    BumperEnd.prototype.initialize = function(sx, sy, ex, ey, px, py) {
        this.Container_initialize();

        this.start = {x:sx, y:sy};
        this.end = {x:ex, y:ey};

        var nx = this.end.x - this.start.x;
        var ny = this.end.y - this.start.y;

        this.norm = {x: -ny, y: nx};

        nx = this.norm.x;
        ny = this.norm.y;

        nx = nx / mag(this.norm);
        ny = ny / mag(this.norm);

        this.norm = {x: nx, y: ny};

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#228800");
        this.model.graphics.moveTo(sx, sy).lineTo(ex,ey).lineTo(px,py).lineTo(sx,sy);

        this.addChild(this.model);
    }

    window.BumperEnd = BumperEnd;
}());