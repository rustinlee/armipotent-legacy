function sweptAABB(b1, b2) {
    var xInvEntry, yInvEntry;
    var xInvExit, yInvExit;

    if (b1.xv > 0.0)
    {
        xInvEntry = b2.x - (b1.x + b1.width);
        xInvExit = (b2.x + b2.width) - b1.x;
    }
    else 
    {
        xInvEntry = (b2.x + b2.width) - b1.x;
        xInvExit = b2.x - (b1.x + b1.width);
    }

    if (b1.yv > 0.0)
    {
        yInvEntry = b2.y - (b1.y + b1.height);
        yInvExit = (b2.y + b2.height) - b1.y;
    }
    else
    {
        yInvEntry = (b2.y + b2.height) - b1.y;
        yInvExit = b2.y - (b1.y + b1.height);
    }

    var xEntry, yEntry;
    var xExit, yExit;

    if (b1.xv == 0.0)
    {
        xEntry = Number.NEGATIVE_INFINITY;
        xExit = Number.POSITIVE_INFINITY;
    }
    else
    {
        xEntry = xInvEntry / b1.xv;
        xExit = xInvExit / b1.xv;
    }

    if (b1.yv == 0.0)
    {
        yEntry = Number.NEGATIVE_INFINITY;
        yExit = Number.POSITIVE_INFINITY;
    }
    else
    {
        yEntry = yInvEntry / b1.yv;
        yExit = yInvExit / b1.yv;
    }

	var entryTime = Math.max(xEntry, yEntry);
	var exitTime = Math.min(xExit, yExit);

	var normalx;
	var normaly;

	if (entryTime > exitTime || xEntry < 0.0 && yEntry < 0.0 || xEntry > 1.0 || yEntry > 1.0)
	{
		normalx = 0.0;
		normaly = 0.0;
		b1.setNormal(normalx, normaly);
		return 1.0;
	}

	else // if there was a collision
    {        		
        // calculate normal of collided surface
        if (xEntry > yEntry)
        {
            if (xInvEntry < 0.0)
            {
                normalx = 1.0;
                normaly = 0.0;
                b1.setNormal(normalx, normaly);
            }
	        else
            {
                normalx = -1.0;
                normaly = 0.0;
                b1.setNormal(normalx, normaly);
            }
        }
        else
        {
            if (yInvEntry < 0.0)
            {
                normalx = 0.0;
                normaly = 1.0;
                b1.setNormal(normalx, normaly);
            }
	        else
            {
                normalx = 0.0;
		        normaly = -1.0;
		        b1.setNormal(normalx, normaly);
            }
        }

        // return the time of collision
        return entryTime;
    }
}

function box(x, y, width, height, xv, yv){
	var x, y;
	var width, height;
	var xv, yv;
}

function getSweptBroadphaseBox(b){
	var broadphasebox = new box();
	broadphasebox.x = b.xv > 0 ? b.x : b.x + b.xv;
	broadphasebox.y = b.yv > 0 ? b.y : b.y + b.yv;
	broadphasebox.width = b.xv > 0 ? b.xv + b.width : b.width - b.xv;
	broadphasebox.height = b.yv > 0 ? b.yv + b.height : b.height - b.yv;

	return broadphasebox;
}

function checkAABB (b1, b2){
	return !(b1.x + b1.width < b2.x || b1.x > b2.x + b2.width || b1.y + b1.height < b2.y || b1.y > b2.y + b2.height);
}
