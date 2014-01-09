function Walker(x, y, facing){
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.sprite = new createjs.Container;
	this.base = new createjs.Sprite(walkerBaseSheet, "run");
	this.gun = new createjs.Sprite(walkerGunSheet, "idle");
	if(facing == 6){
		this.sprite.scaleX = -1;
		this.firePower = 3;
	} else if(facing == 4) {
		this.firePower = -3;
	}
	this.sprite.addChild(this.gun, this.base);
	this.width = this.base.spriteSheet._frameWidth;
	this.height = this.base.spriteSheet._frameHeight;
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.maxHP = 10;
	this.HP = this.maxHP;
	this.runSpeed = 1;
	this.fireDelay = 150;
	this.sinceFired = this.fireDelay;
	this.alive = true;
	this.collided = false;
	this.collisionNormal = [0.0,0.0];
	this.groundRect = {
		x: this.x+1,
		y: this.y + this.height,
		width: this.width-2,
		height: 1
	};
	this.onGround = true;
	this.EXP = 10;
	this.fire = function(){
		this.projectileSprite = new createjs.Sprite(walkerProjectileSheet);
		this.projectileSprite.gotoAndPlay("flying");
		projectiles.push(new Projectile(this.x + this.width/2, this.y - this.gun.spriteSheet._frameHeight/2, this.firePower, 0, this.projectileSprite, 15, false));
		world.addChild(projectiles[projectiles.length-1].sprite);
	}
	this.AI = function(){
		if(facing == 4){
			this.xv -= 2;
			if(this.xv < -(this.runSpeed)){
				this.xv = -(this.runSpeed);
			}
			this.sprite.scaleX = 1;
		} else if(facing == 6){
			this.xv += 2;
			if(this.xv > this.runSpeed){
				this.xv = this.runSpeed;
			}
			this.sprite.scaleX = -1;
		}

		if(this.sinceFired >= this.fireDelay){
			this.gun.gotoAndPlay("shoot");
			this.sinceFired = 0;
		}

		if(this.gun.currentAnimation == "shoot" && Math.round(this.gun.currentAnimationFrame*10)/10 == 4){
			this.fire();
		}
	}
}

Walker.prototype = new Creature();

function Turret(){
	this.step = function(){
		if (this.HP <= 0) {
			this.alive = false; //mark for removal from array
			this.die(); //perform death function
		}

		this.sinceFired += 1;
	};
	this.die = function() {
		world.removeChild(this.sprite);
		player.configs[player.currentConfig].curEXP += this.EXP;
		player.checkLevelUp();
	};	
	this.fire = function(angle){
		if(this.sinceFired >= this.fireDelay){	
			projectiles.push(new Projectile((this.x + this.width/2)+20*Math.cos(angle*Math.PI/180), (this.y + this.height/2)+20*Math.sin(angle*Math.PI/180), Math.cos(angle*Math.PI/180)*this.firePower, Math.sin(angle*Math.PI/180)*this.firePower, this.projectileSprite, 5, false));
			world.addChild(projectiles[projectiles.length-1].sprite);
			this.sinceFired = 0;
		}
	};
	this.AI = function() {
		var radx = (player.x+player.width/2) - (this.x+this.width/2);
		var rady = ((player.y+player.height/2) - (this.y+this.height/2))*-1;
		var angle = Math.atan(rady/radx)/(Math.PI/180);
		if (radx <0) {
			angle += 180;
		}
		angle = angle*-1;
		var lowerBound = -150 + this.sprite.rotation;
		var upperBound = -30 + this.sprite.rotation;
		var withinBounds = (angle >= lowerBound && angle <= upperBound);

		if(upperBound > 90){
			lowerBound = -270 + (upperBound - 90);
			upperBound = -150 + this.sprite.rotation;
			withinBounds = (angle <= lowerBound || angle >= upperBound);
		}
		
		if(withinBounds) {
			this.barrel.rotation = angle + 90 - this.sprite.rotation;
			this.fire(angle);
		} else {
			this.barrel.rotation = 0;
		}
	};
}

Turret.prototype = new Entity();

function BulletTurret(x, y, facing){
	this.x = x;
	this.y = y;
	this.sprite = new createjs.Container();
	this.base = new createjs.Sprite(turretSheet, 0);
	this.base.stop();
	this.barrel = new createjs.Sprite(turretSheet, 1);
	this.barrel.stop();
	this.barrel.y = -3;
	this.sprite.addChild(this.barrel, this.base);	
	var cases = {
		8: 0,
		6: 90,
		2: 180,
		4: 270
	};
	if(cases[facing]){
		this.sprite.rotation = cases[facing];
	}
	this.width = this.base.spriteSheet._frameWidth;
	this.height = this.base.spriteSheet._frameHeight;
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.maxHP = 10;
	this.HP = this.maxHP;
	this.firePower = 3;
	this.fireDelay = 30;
	this.sinceFired = this.fireDelay;
	this.alive = true;
	this.EXP = 15;
}

BulletTurret.prototype = new Turret();

function LaserTurret(x, y, facing){
	this.x = x;
	this.y = y;
	this.sprite = new createjs.Container();
	this.base = new createjs.Sprite(turretSheet, 0);
	this.base.stop();
	this.barrel = new createjs.Sprite(turretSheet, 1);
	this.barrel.stop();
	this.barrel.y = -3;
	this.sprite.addChild(this.barrel, this.base);	
	var cases = {
		8: 0,
		6: 90,
		2: 180,
		4: 270
	};
	if(cases[facing]){
		this.sprite.rotation = cases[facing];
	}
	this.width = this.base.spriteSheet._frameWidth;
	this.height = this.base.spriteSheet._frameHeight;
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.maxHP = 10;
	this.HP = this.maxHP;
	this.alive = true;
	this.lockedOn = false;
	this.sinceLockedOn = 0;
	this.lockTime = 180;
	this.laserLength = 300;
	this.laserWidth = 4;
	this.damage = 25;
	this.EXP = 25;
	this.fire = function(angle){
		var laserOriginX = (this.x + this.width/2)+20*Math.cos(angle*Math.PI/180);
		var laserOriginY = (this.y + this.height/2)+20*Math.sin(angle*Math.PI/180);
		var collisionBox = {x: laserOriginX, y: laserOriginY, height:1, width:1};
		var i = 0;
		for (i; i < this.laserLength; i++) {
			collisionBox.x += Math.cos(angle*Math.PI/180);
			collisionBox.y += Math.sin(angle*Math.PI/180);

			var collided = false;
			for (var ii = walls.length - 1; ii >= 0; ii--) {
				if(checkAABB(collisionBox, walls[ii])){
					collided = true;
					break;
				}
			};

			if(collided){
				break;
			}
			
			if(checkAABB(collisionBox, player)){
				player.HP -= this.damage;
				break;
			}
		};

		projectiles.push(new Laser(laserOriginX, laserOriginY, i, this.laserWidth, "#ff0000", angle));
		world.addChild(projectiles[projectiles.length-1].sprite);
	};	
	this.AI = function() {
		var radx = (player.x+player.width/2) - (this.x+this.width/2);
		var rady = ((player.y+player.height/2) - (this.y+this.height/2))*-1;
		var angle = Math.atan(rady/radx)/(Math.PI/180);
		if (radx <0) {
			angle += 180;
		}
		angle = angle*-1;

		var adjustedRotation = angle + 90 - this.sprite.rotation;

		var lowerBound = -150 + this.sprite.rotation;
		var upperBound = -30 + this.sprite.rotation;
		var withinBounds = (angle >= lowerBound && angle <= upperBound);
		var inverseRotation = false;

		if(upperBound > 90){
			lowerBound = -270 + (upperBound - 90);
			upperBound = -150 + this.sprite.rotation;
			withinBounds = (angle <= lowerBound || angle >= upperBound);
		}

		if(adjustedRotation < -180){
			adjustedRotation += 360;
			inverseRotation = true;
		}

		if(withinBounds) {
			if(this.barrel.rotation > adjustedRotation) {
				this.barrel.rotation --;
			} else if(this.barrel.rotation < adjustedRotation) {
				this.barrel.rotation ++;
			}

			this.sinceLockedOn ++;
			if(this.sinceLockedOn >= this.lockTime){
				if(!inverseRotation){
					this.fire(this.barrel.rotation - 90 + this.sprite.rotation);
				} else {
					this.fire(this.barrel.rotation - 90 - this.sprite.rotation);
				}
				this.sinceLockedOn = 0;
			}
		} else {
			angle = 0;
			this.barrel.rotation = angle;
			this.lockedOn = false;
			this.sinceLockedOn = 0;
		}
	};
}

LaserTurret.prototype = new Turret();

function createEnemy(x, y, facing, type){
	switch(type){
		case 'Walker':
			return new Walker(x, y, facing);

		case 'BulletTurret':
			return new BulletTurret(x, y, facing);

		case 'LaserTurret':
			return new LaserTurret(x, y, facing);
	}
}