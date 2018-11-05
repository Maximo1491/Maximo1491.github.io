(function (window)
{
    //Sets up the block
    function Block(x, y)
    {
        this.initialize(x, y);
    }
    Block.prototype = new Container();

    Block.prototype.Container_initialize = Block.prototype.initialize;
    Block.prototype.Container_tick = Block.prototype._tick;

    //Set variables to be used
    var graphic, draw, xPos, yPos;

    //Used for path finding
    var f, g, h;
    var isClosed, isOpen, isWalkable, pathed, start, end;
    //An array with all the blocks neighbouring it
    var neighbours;
    //Stores the block which got searched before this one
    var parent;

    Block.prototype.initialize = function(x, y)
    {
        this.Container_initialize();
        //store the X and Y position
        xPos = x;
        yPos = y;

        /*Used for path finding*/

        //Total of G + H
        this.f = 0;
        //G is how far from the start the path has come
        this.g = 0;
        //H is approximately how long is left until the end point
        this.h = 0;
        //If this is true then that means that this cell has already been checked
        this.isClosed = false;
        //If this is true then that means that this cell is waiting to be checked
        this.isOpen = false;
        //If this is true then the Path Finder can search this cell
        this.isWalkable = true;

        //Used for storing the path and where the start and end points are
        this.pathed = false;
        this.start = false;
        this.end = false;

        //Used as the graphic for the default block
        this.graphic = new Graphics();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(grey);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
        this.draw = new Shape(this.graphic);
        this.draw.x = xPos;
        this.draw.y = yPos;

        Ticker.addListener(this);
    };

    Block.prototype.makeWall = function()
    {
        //Sets the block to unwalkable so that it cant be used in the pathfinder and makes it dark grey
        this.isWalkable = false;
        this.graphic.clear();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(darkGrey);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
    };

    Block.prototype.makeWalkable = function()
    {
        //Allows the block to be used in the path finder and sets the colour to grey
        this.isWalkable = true;
        this.graphic.clear();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(grey);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
    };

    Block.prototype.showPath = function()
    {
        //Changes colour to signify this block as path of the path from the start to the end
        this.graphic.clear();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(green);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
    };

    Block.prototype.makeStart = function()
    {
        //Changes the colour to blue to signify the start point
        this.graphic.clear();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(blue);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
    };

    Block.prototype.makeEnd = function()
    {
        //Changes the colour to red to signify the end point
        this.graphic.clear();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(red);
        this.graphic.drawRect(0, 0, 20, 20);
        this.graphic.endFill();
    };

    Block.prototype.getNeighbours = function()
    {
        //If the neighbours have not been found yet
        if(!this.neighbours)
        {
            this.neighbours = [];
            //Get all the neighbours above and below this current block
            this.neighbours.push(getCell((this.draw.x/20) - 1, this.draw.y/20));
            this.neighbours.push(getCell((this.draw.x/20) + 1, this.draw.y/20));
            this.neighbours.push(getCell(this.draw.x/20, (this.draw.y/20) + 1));
            this.neighbours.push(getCell(this.draw.x/20, (this.draw.y/20) - 1));

            //If any of the neighbours are null (not part of the grid) then remove them
            var len = this.neighbours.length;
            for(var i = len - 1; i >= 0; i--)
            {
                if(this.neighbours[i] == null)
                {
                    this.neighbours.splice(i, 1);
                }
            }
        }

        //Return the neighbours
        return this.neighbours;
    };

    Block.prototype.tick = function()
    {

        this.Container_tick();
    };

    window.Block = Block;

}(window));