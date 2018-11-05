(function() {

    var TableSides = function() {
        this.initialize();
    }
    var p = TableSides.prototype = new createjs.Container();

    p.model;

    TableSides.prototype.Container_initialize = p.initialize;
    TableSides.prototype.initialize = function() {
        this.Container_initialize();

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#B0731E").drawRect(-20, -20, 840, 20);
        this.model.graphics.beginFill("#B0731E").drawRect(-20, 400, 840, 20);
        this.model.graphics.beginFill("#B0731E").drawRect(-20, -20, 20, 440);
        this.model.graphics.beginFill("#B0731E").drawRect(800, -20, 20, 440);

        this.addChild(this.model);
    }

    window.TableSides = TableSides;
}());