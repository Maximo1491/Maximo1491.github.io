//Setup canvas
var stage;
var canvas;

//Setup mouse
var mouseX;
var mouseY;
var clickX;
var clickY;

//Set the start and end point variables
var startPoint;
var endPoint;

//Setup the map
var map = [[1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
		   [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
		   [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
		   [1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
		   [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
		   [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
		   [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
		   [1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
		   [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		   [1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1]];
		   
var blockArray = [[]];

var finalPath;

//Setup the yellow circle that follows the path
var follower;

//store some colours
var red = "#FF0000";
var green = "#66FF33";
var blue = "#0099FF";
var yellow = "#FFFF66";
var purple = "#CC33FF";
var pink = "#E65CB8";
var orange = "#FFA319";
var white = "#FFFFFF";
var black = "#000000";
var darkGrey = "#444444";
var grey = "#999999";

function init()
{
	//Setup Canvas
	canvas = document.getElementById("Canvas");
	stage = new Stage(canvas);
	stage.enableMouseOver();
	
	pathFinder = new PathFind;
	
	Ticker.setFPS(30);
	Ticker.addListener(window);
	
	var graphic = new Graphics();
	graphic.beginFill(black);
	graphic.drawRect(0, 0, 780, 220);
	var background = new Shape(graphic);
	stage.addChild(background);
	
	makeMap();
	
	finalPath = pathFinder.FindPath(startPoint, endPoint);
	follower = new Followers(startPoint.draw.x + 10, startPoint.draw.y + 10, finalPath);
	stage.addChild(follower.draw);
	updatePath();
	
	//Store where the mouse is on screen
    stage.onMouseMove = function(e)
    {
        mouseX = e.stageX;
        mouseY = e.stageY;
    };

    //Check where the mose is being clicked
    stage.onMouseDown = function(e)
    {
        clickX = e.stageX;
        clickY = e.stageY;
        
        if(map[toGrid(clickX, clickY)[0]][toGrid(clickX, clickY)[1]] == 2 )
        {
        	return;
        }
        if(map[toGrid(clickX, clickY)[0]][toGrid(clickX, clickY)[1]] == 3 )
        {
        	return;
        }

        //Check to see if one of the blocks has been clicked
        if(clickX < 780 && clickY < 220)
        {
            checkBlocks(clickX, clickY);
        }
        
        finalPath = pathFinder.FindPath(startPoint, endPoint);
        updatePath();
    };
}

function makeMap()
{
	var block, blockX, blockY;
	
	for(var i = 0; i < map.length; i++)
	{
		blockX = i * 20;
		blockArray[i] = [];
		for(var j = 0; j < map[i].length; j++)
		{
			blockY = j * 20;
			blockArray[i][j] = new Block(blockX, blockY);
			if(map[i][j] == 1)
			{
				blockArray[i][j].makeWall();
			}
			if(map[i][j] == 2)
			{
				blockArray[i][j].makeStart();
				startPoint = blockArray[i][j];
			}
			if(map[i][j] == 3)
			{
				blockArray[i][j].makeEnd();
				endPoint = blockArray[i][j];
			}
			
			stage.addChild(blockArray[i][j].draw);
		}
	}
}

function resetMap()
{
    //Removes the map from the screen and empties the block array
    for(var i = 0; i < blockArray.length; i++)
    {
        for(var j = 0; j < blockArray[i].length; j++)
        {
        	blockArray[i][j].pathed = false;
        	blockArray[i][j].isOpen = false;
        	blockArray[i][j].isClosed = false;
        	blockArray[i][j].f = 0;
        	blockArray[i][j].g = 0;
        	blockArray[i][j].h = 0;
        	blockArray[i][j].start = false;
        	blockArray[i][j].end = false;
        	if(map[i][j] == 0)
			{
				blockArray[i][j].makeWalkable();
			}
            if(map[i][j] == 1)
			{
				blockArray[i][j].makeWall();
			}
			if(map[i][j] == 2)
			{
				blockArray[i][j].makeStart();
				startPoint = blockArray[i][j];
			}
			if(map[i][j] == 3)
			{
				blockArray[i][j].makeEnd();
				endPoint = blockArray[i][j];
			}
        }
    }

    //Removes the follower from the screen
    //stage.removeChild(follower.draw);

    //Redraws the map
    //makeMap();
}

function updatePath()
{
    //Updates the finalPath array to make sure every object inside it shows on screen correctly
    for(var k = 0; k < finalPath.length; k++)
    {
        //Sets what needs to be pathed
        if(finalPath[k].pathed == false)
        {
            finalPath[k].pathed = true;
        }
        //Sets where the start point needs to be drawn
        finalPath[0].start = true;
        //Sets where the end point needs to be drawn
        finalPath[finalPath.length - 1].end = true;
    }

    for(var i = 0; i < blockArray.length; i++)
    {
        for(var j = 0; j < blockArray[i].length; j++)
        {
            //Search through the array and if the pathed variable is true then draw the path
            if(blockArray[i][j].pathed == true)
            {
                blockArray[i][j].showPath();
            }

            //Search through the array and if it is marked as a start point draw it
            if(blockArray[i][j].start == true)
            {
                blockArray[i][j].makeStart();
            }

            //Search through the array and if it is marked as a end point draw it
            if(blockArray[i][j].end == true)
            {
                blockArray[i][j].makeEnd();
            }
        }
    }
   
   	
	follower.draw.x = startPoint.draw.x + 10;
	follower.draw.y = startPoint.draw.y + 10;
	follower.currentPoint = 1;
	follower.path = finalPath;
		
	if(finalPath.length > 1)
		follower.active = true;
	else
		follower.active = false;
	//follower = new Followers(startPoint.draw.x + 10, startPoint.draw.y + 10, finalPath);
}

function checkBlocks(x, y)
{
	//When the user clicks somewhere, stop the current path and remove it from the screen
    for(var i = 1; i < finalPath.length - 1; i++)
    {
        finalPath[i].makeWalkable();
    }
    //Removes the path from the array
    finalPath = 0;
    
    //If the grid clicked is a walkable path make it a wall otherwise make it walkable and update the map array
    if(blockArray[toGrid(x, y)[0]][toGrid(x, y)[1]].isWalkable == true)
    {
        blockArray[toGrid(x, y)[0]][toGrid(x, y)[1]].makeWall();
        map[toGrid(x, y)[0]][toGrid(x, y)[1]] = 1;
    }
    else
    {
        blockArray[toGrid(x, y)[0]][toGrid(x, y)[1]].makeWalkable();
        map[toGrid(x, y)[0]][toGrid(x, y)[1]] = 0;
    }
}

//Converts the current X and Y of the mouse to its grid position
function toGrid(x, y)
{
    var pos = [];

    var tempX, tempY;

    tempX = x;
    tempY = y;

    //Divide the current mouse position by 25 to get it to the correct position in the block array
    tempX = tempX/20;
    tempY = tempY/20;

    //Round it down so that it can be used
    tempX = Math.floor(tempX);
    tempY = Math.floor(tempY);

    //Store it to be sent back
    pos[0] = tempX;
    pos[1] = tempY;

    return pos;
}

function getCell(x, y)
{
    //Looks through all the blocks and returns the block with the same X and Y of that of what is being searched
    if((x >= 0 && x < blockArray.length) && y >= 0 && y < blockArray[0].length)
    {
        return blockArray[x][y];
    }

    return null;
}

function tick()
{
	stage.update();
}
