var centerOnPlayerDelay = 15;
var framesSinceMoved = 0;

var parallax = {
	images: [],
	scroll: function(distance){
		for (var i = this.images.length - 1; i >= 0; i--) {
			this.images[i].x -= distance*(i*0.5+1)*0.1;
			for (var ii = 0; ii < this.images[i].children.length; ii++) {
				var offScreenLeft = (this.images[i].children[ii].x+this.images[i].children[ii].image.width*2+this.images[i].x < 0);
				if(offScreenLeft){
					this.images[i].children[ii].x = this.images[i].children[ii].x + (this.images[i].children.length*this.images[i].children[ii].image.width); //This could probably use some paring down
				}
				var offScreenRight = (this.images[i].children[ii].x+this.images[i].children[ii].image.width*-1+this.images[i].x > CANVAS_WIDTH);
				if(offScreenRight){
					this.images[i].children[ii].x = this.images[i].children[ii].x - (this.images[i].children.length*this.images[i].children[ii].image.width);
				}
			}
		}
	}
};

function updateCamera() {
	if(player.xv === 0){
		framesSinceMoved++;
	} else {
		framesSinceMoved = 0;
	}

	var distance = Math.round(world.x);

	var targetPos;

	if(framesSinceMoved >= centerOnPlayerDelay){
		targetPos = ((player.x+player.width/2)-(CANVAS_WIDTH*0.5))*-1;
		if(world.x > targetPos) {
			world.x -= (world.x-targetPos)*0.05;
		}
		if(world.x < targetPos) {
			world.x -= (world.x-targetPos)*0.05;
		}
	} else {
		var panSpeedX = Math.round(Math.abs(player.xv)*1.5);
		var panSpeedY = 0;
		switch(player.facing){
			case 4:
				targetPos = ((player.x+player.width/2)-(CANVAS_WIDTH*0.6))*-1;
				world.x += panSpeedX;
				if(world.x > targetPos) {
					world.x = targetPos;
				}
				break;
			case 6:
				targetPos = ((player.x+player.width/2)-(CANVAS_WIDTH*0.4))*-1;
				world.x -= panSpeedX;
				if(world.x < targetPos) {
					world.x = targetPos;
				}
				break;
		}	
	}

	if(world.x > 0) {
		world.x = 0;
	}

	world.x = Math.round(world.x);
	world.y = Math.round(world.y);

	distance -= world.x;
	parallax.scroll(distance);
}

function draw() {
	updateCamera();
	stage.update();
}