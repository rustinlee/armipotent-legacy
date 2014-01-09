function Entity() {
}

Entity.prototype = {
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
	}
};

function Wall(width, height, x, y, sprite, collision) {
	this.sprite = sprite;
	this.width = width*32;
	this.height = height*32;
	this.x = x;
	this.y = y;
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.collision = collision;
}

Wall.prototype = new Entity();

var walls = [];