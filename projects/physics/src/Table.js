(function() {

    var Table = function() {
        this.initialize();
    }
    var p = Table.prototype = new createjs.Container();

    p.model;

    Table.prototype.Container_initialize = p.initialize;
    Table.prototype.initialize = function() {
        this.Container_initialize();

        this.width = 800;
        this.height = 400;

        this.model = new createjs.Shape();
        this.model.graphics.beginFill("#339900").drawRect(0, 0, 800, 400);

        this.addChild(this.model);
    }

    window.Table = Table;
}());