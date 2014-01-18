function Projectile(x, y, xv, yv, sprite, damage, friendly, penetrating, ttl) {
	this.x = x;
	this.y = y;
	this.xv = xv;
	this.yv = yv;
	if(sprite !== null && sprite !== undefined){
		if(sprite instanceof createjs.SpriteSheet){
			this.sprite = new createjs.Sprite(sprite);
		} else if(sprite instanceof createjs.Sprite){
			this.sprite = sprite;
		}
	} else {
		this.sprite = new createjs.Sprite(defaultProjectile);
	}
	this.width = this.sprite.spriteSheet._frameWidth;
	this.height = this.sprite.spriteSheet._frameHeight;
	this.sprite.x = this.x;
	this.sprite.y = this.y;	
	//this.width = 4; //these should be defined by the object that's firing
	//this.height = 4; //
	this.friendly = friendly;
	this.damage = damage;
	if(!penetrating){
		this.penetrating = false;
	} else {
		this.penetrating = true;
	}
	if(!ttl){
		this.ttl = 300;
	} else {
		this.ttl = ttl;
	}
	this.alive = true;
	this.step = function() {
		this.x += this.xv;
		this.y += this.yv;

		this.sprite.x = this.x;
		this.sprite.y = this.y;

		this.sprite.rotation = Math.atan(this.yv/this.xv)/(Math.PI/180);
		if (this.xv < 0) {
			this.sprite.rotation += 180;
		}

		this.ttl -= 1;
		if(this.ttl <= 0) {
			this.alive = false;
		}

		var elementsToTest = mainTree.retrieve(this);

		for (var i = elementsToTest.length - 1; i >= 0; i--) {
			if(elementsToTest[i] instanceof Wall && !this.penetrating){
				for (var j = elementsToTest[i].sprite.children.length - 1; j >= 0; j--) {
					if(ndgmr.checkPixelCollision(this.sprite,elementsToTest[i].sprite.children[j])){
						this.alive = false;
					}
				}
			} else if(elementsToTest[i] instanceof Creature && !(elementsToTest[i] instanceof PlayerClass) &&this.friendly){
				if(ndgmr.checkPixelCollision(this.sprite,elementsToTest[i].sprite.children[0])){
					elementsToTest[i].HP -= this.damage;
					if(!this.penetrating) {
						this.alive = false;
					}
				}
			} else if(elementsToTest[i] instanceof PlayerClass && !this.friendly){
				if(ndgmr.checkPixelCollision(this.sprite,elementsToTest[i].sprite.children[0])){
					elementsToTest[i].HP -= this.damage;
					this.alive = false;
				}
			}
		}
	};
}

Projectile.prototype = new Entity();

var projectiles = [];

function Laser(x, y, length, width, color, angle) {
	this.sprite = new createjs.Shape();
	this.sprite.graphics.beginFill(color).drawRect(0, 0, length, width);
	this.sprite.regX = 0;
	this.sprite.regY = width/2;
	this.sprite.x = x;
	this.sprite.y = y;
	this.sprite.rotation = angle;
	this.ttl = 60;
	this.alive = true;
	this.step = function() {
		this.ttl -= 1;
		if(this.ttl <= 0) {
			this.alive = false;
		}
	};
}