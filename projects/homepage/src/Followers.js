(function (window)
{
    //Sets up the follower
    function Followers(x, y, p)
    {
        this.initialize(x, y, p);
    }
    Followers.prototype = new Container();

    Followers.prototype.Container_initialize = Followers.prototype.initialize;
    Followers.prototype.Container_tick = Followers.prototype._tick;

    //Variables to be used
    var xPos;
    var yPos;
    var target;

    Followers.prototype.initialize = function(x, y, p)
    {
        //Sets the X and Y position
        xPos = x;
        yPos = y;
        //Stores the current path to move along
        this.path = p;
        
        this.active = true;

        //Set which part of the path to start on
        this.currentPoint = 1;

        //Draw the follower
        this.graphic = new Graphics();
        this.graphic.setStrokeStyle(1);
        this.graphic.beginStroke(darkGrey);
        this.graphic.beginFill(yellow);
        this.graphic.drawCircle(0, 0, 8);
        this.graphic.endFill();
        this.draw = new Shape(this.graphic);
        this.draw.x = xPos;
        this.draw.y = yPos;

        this.Container_initialize();
        Ticker.addListener(this);
    };

    Followers.prototype.getTarget = function()
    {
        //The current point in the path that the follower is moving towards
        target = this.path[this.currentPoint];
    };

    Followers.prototype.tick = function()
    {
    	if(this.active == true)
    	{
        	//If the follower reaches the end of the path, put it back to the beginning
        	if(this.draw.x == this.path[this.path.length - 1].draw.x + 10 && this.draw.y == this.path[this.path.length - 1].draw.y + 10)
        	{
         	   	this.draw.x = this.path[0].draw.x + 10;
        	    this.draw.y = this.path[0].draw.y + 10;
           	 	this.currentPoint = 1;
        	}
	
        	//If the path is more than just the start and end point
        	if(this.path.length > 2)
        	{
            	//Get the target to move towards
            	this.getTarget();

            	//Move towards the target
            	if(this.draw.x < target.draw.x + 10)
            	{
                	this.draw.x += 1;
            	}
            	if(this.draw.x > target.draw.x + 10)
            	{
                	this.draw.x -= 1;
            	}
            	if(this.draw.y < target.draw.y + 10)
            	{
                	this.draw.y += 1;
            	}
            	if(this.draw.y > target.draw.y + 10)
            	{
                	this.draw.y -= 1;
            	}

            	//If the follower has reached the target, get the next target
            	if(this.draw.x == target.draw.x + 10 && this.draw.y == target.draw.y + 10)
            	{
                	this.currentPoint++;
            	}
        	}
        	this.Container_tick();
       	}
        
    };

    window.Followers = Followers;

}(window));