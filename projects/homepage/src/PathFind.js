(function (window)
{
    //Sets up the PathFind
    function PathFind()
    {
        this.initialize();
    }

    PathFind.prototype = new Container();

    PathFind.prototype.Container_initialize = PathFind.prototype.initialize;

    //Sets up the variables
    var open, closed, currentCell, path;

    PathFind.prototype.initialize = function ()
    {

        Ticker.addListener(this);
    };

    PathFind.prototype.FindPath = function(start, end)
    {
       this.Container_initialize();
       //Resets the map to make sure there are no paths already drawn
       resetMap();
       //Adds the start point to the list to be checked
       open = [getCell(startPoint.draw.x/20, startPoint.draw.y/20)];
       //Sets the start point to open
       open[0].isOpen = true;
       //Initialises the closed array
       closed = [];
       //Initialises the path array
       path = [];
       //Keep looping until it finds the end point
       while(true)
       {
           //If there are no more cells to look out it means that a path could not be found
           if(open.length == 0)
           {
               break;
           }
           //returns the cell with the lowest F value
           currentCell = this.getLowestF(open);
           //If the current cell is the end point
           if(currentCell.draw.x/20 == endPoint.draw.x/20 && currentCell.draw.y/20 == endPoint.draw.y/20)
           {
               //Adds the current cell to the path
               path = [currentCell];
               //Keep looping until it gets back to the start point
               while(true)
               {
                   //Add the cell that was searched before the current cell
                   path.push(currentCell.parent);
                   //Set the current cell to the parent cell
                   currentCell = currentCell.parent;
                   //If the cell does not have a parent (start point)
                   if(!currentCell.parent)
                   {
                       //Reverse the path so that it starts at the start point
                       path.reverse();
                       break;
                   }
               }
               break;
           }
           //Add the current cell to the checked list
           closed.push(currentCell);
           currentCell.isClosed = true;
           //Store the current cells neighbours
           var n = currentCell.getNeighbours();
           //For every neighbour the current cell has
           for(var i = 0; i < n.length; i++)
           {
               //Skip the neighbour if it is null or is a wall
               if([i] == null || n[i].isWalkable == false)
               {
                   continue;
               }
               //If the neighbour has not been checked yet and is not waiting to be checked
               if(n[i].isOpen == false && n[i].isClosed == false)
               {
                   //Add it to the list to be checked
                   open.push(n[i]);
                   n[i].isOpen = true;
                   //How much it costs to move to this neighbour
                   n[i].g = 1;
                   //Sets the neighbours parent to the current cell
                   n[i].parent = currentCell;
                   //Adds the cost to move to the current cell to the neighbour giving it a total movement cost
                   n[i].g += n[i].parent.g;
                   //Sets the estimated distance from the neighbour to the end point
                   n[i].h = Math.abs((n[i].draw.x/20) - (endPoint.draw.x/20)) + Math.abs((n[i].draw.y/20) - (endPoint.draw.y/20));
                   //Adds the estimated end distance to the current moved distance to give it an heuristic value
                   n[i].f = n[i].g + n[i].h;
               }
               else
               {
                   //If the neighbour has already been checked see if it has quicker way back to the start
                   var tg = 1;
                   tg += currentCell.g;
                   //If the neighbour can get back quicker through the current cell
                   if(tg < n[i].g)
                   {
                       n[i].g = tg;
                       n[i].f = n[i].g + n[i].h;
                       n[i].parent = currentCell;
                   }
               }
           }
       }
       return path;
    };

     PathFind.prototype.compare = function (a, b)
    {
        //Compares the array and sorts it in descending order
        if (a.f > b.f)
        {
            return -1;
        }
        if (a.f < b.f)
        {
            return 1;
        }
        return 0;
    };

     PathFind.prototype.getLowestF = function (list)
    {
        //Sorts the array
        list.sort(this.compare);
        //Returns the array object with the lowest F value
        return list.pop();
    };

     PathFind.prototype.tick = function ()
    {
        //this.Container_tick();
    };

    window.PathFind = PathFind;

}(window));