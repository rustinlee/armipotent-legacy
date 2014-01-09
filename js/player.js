function initConfigs(){
	throwingWeaponConfig = {
		level: 1,
		curEXP: 0,
		levels: [
			{
				EXPtoNext: 100,
				projectileSpriteSheets: [throwing1],
				damage: 5,
				firePower: 3,
				fireDelay: 30,
				projectileCount: 1,
				projectileSpread: 30
			},
			{
				EXPtoNext: 300,
				projectileSpriteSheets: [throwing1, throwing2],
				damage: 6,
				firePower: 3,
				fireDelay: 25,
				projectileCount: 3,
				projectileSpread: 30
			},
			{
				EXPtoNext: 500,
				projectileSpriteSheets: [throwing3, throwing4],
				damage: 7,
				firePower: 3,
				fireDelay: 20,
				projectileCount: 5,
				projectileSpread: 50
			}
		],
		init: function() {
			//add the player's arm sprite once we get it
		},
		cleanup: function() {
			//and remove it
		},
		fire: function() {
			if(player.sinceFired >= this.levels[this.level-1].fireDelay){
				var radx = (currentMousePos.x - world.x) - (player.x+player.width/2);
				var rady = ((currentMousePos.y - world.y) - (player.y+player.height/2))*-1;
				var angle = Math.atan(rady/radx)/(Math.PI/180);
				if (radx <0) {
					angle += 180;
				}
				angle = angle*-1;
				if(this.levels[this.level-1].projectileCount > 1){
					for (var i = 0; i < this.levels[this.level-1].projectileCount; i++) {
						var sprite = this.levels[this.level-1].projectileSpriteSheets[0];
						if(i+1 == Math.ceil(this.levels[this.level-1].projectileCount/2) && this.levels[this.level-1].projectileSpriteSheets.length > 1){
							sprite = this.levels[this.level-1].projectileSpriteSheets[1];
						}
						tempAngle = angle - this.levels[this.level-1].projectileSpread/2 + (this.levels[this.level-1].projectileSpread/(this.levels[this.level-1].projectileCount-1)) * i;
						projectiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2, Math.cos(tempAngle*Math.PI/180)*this.levels[this.level-1].firePower, Math.sin(tempAngle*Math.PI/180)*this.levels[this.level-1].firePower, sprite, this.levels[this.level-1].damage, true));
						world.addChild(projectiles[projectiles.length-1].sprite);
					};	
				} else {
					projectiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2, Math.cos(angle*Math.PI/180)*this.levels[this.level-1].firePower, Math.sin(angle*Math.PI/180)*this.levels[this.level-1].firePower, this.levels[this.level-1].projectileSpriteSheets[0], this.levels[this.level-1].damage, true));
					world.addChild(projectiles[projectiles.length-1].sprite);
				}
				player.sinceFired = 0;
			}
		},
		step: function() {
			//will rotate player's arms once we get the proper art
		}
	}

	fistConfig = {
		level: 1,
		curEXP: 0,
		container: new createjs.Container(),
		levels: [
			{
				EXPtoNext: 100,
				damage: 3,
				firePower: 2.5,
				fireDelay: 50,
				projectileCount: 1,
				projectileSpread: 30
			},
			{
				EXPtoNext: 300,
				damage: 4,
				firePower: 3,
				fireDelay: 40,
				projectileCount: 1,
				projectileSpread: 30
			},
			{
				EXPtoNext: 500,
				damage: 5,
				firePower: 3.5,
				fireDelay: 25,
				projectileCount: 3,
				projectileSpread: 30
			}
		],
		init: function() {
			this.container.x = 9;
			this.container.y = 19;
			this.container.addChild(fistSprite);
			player.sprite.addChild(this.container);
		},
		cleanup: function() {
			player.sprite.removeChild(this.container);
		},
		fire: function() {
			if(player.sinceFired >= this.levels[this.level-1].fireDelay){
				fistSprite.gotoAndPlay("punch");
				var radx = (currentMousePos.x - world.x) - (player.x+player.width/2);
				var rady = ((currentMousePos.y - world.y) - (player.y+player.height/2))*-1;
				var angle = Math.atan(rady/radx)/(Math.PI/180);
				if (radx <0) {
					angle += 180;
				}
				angle = angle*-1;
				var projectileSprite = new createjs.Sprite(kiSheet, "flying");
				projectiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2, Math.cos(angle*Math.PI/180)*this.levels[this.level-1].firePower, Math.sin(angle*Math.PI/180)*this.levels[this.level-1].firePower, projectileSprite, this.levels[this.level-1].damage, true, true, 60));
				world.addChild(projectiles[projectiles.length-1].sprite);
				player.sinceFired = 0;
			}
		},
		step: function() {
			var radx = (currentMousePos.x - world.x) - (player.x+player.width/2);
			var rady = ((currentMousePos.y - world.y) - (player.y+player.height/2));
			var angle = Math.atan(rady/radx)/(Math.PI/180);
			if (radx <0) {
				angle += 180;
			}

			if(player.sprite.scaleX == -1){
				angle = -(angle)+180;
			}

			this.container.rotation = angle;		
		}
	}

	cannonConfig = {
		level: 1,
		curEXP: 0,
		container: new createjs.Container(),
		levels: [
			{
				EXPtoNext: 100,
				damage: 8,
				firePower: 2.5,
				fireDelay: 50,
				projectileSpread: 30,
				armSprite: cannon1
			},
			{
				EXPtoNext: 300,
				damage: 11,
				firePower: 3,
				fireDelay: 50,
				projectileSpread: 30,
				armSprite: cannon2
			},
			{
				EXPtoNext: 500,
				damage: 15,
				firePower: 3.5,
				fireDelay: 50,
				projectileSpread: 30,
				armSprite: cannon3
			}
		],
		init: function() {
			this.container.x = 9;
			this.container.y = 19;
			this.container.addChild(this.levels[this.level].armSprite);
			player.sprite.addChild(this.container);
		},
		fire: function() {
			if(player.sinceFired >= this.levels[this.level-1].fireDelay){
				var radx = (currentMousePos.x - world.x) - (player.x+player.width/2);
				var rady = ((currentMousePos.y - world.y) - (player.y+player.height/2))*-1;
				var angle = Math.atan(rady/radx)/(Math.PI/180);
				if (radx <0) {
					angle += 180;
				}
				angle = angle*-1;
				var projectileSprite = new createjs.Sprite(walkerProjectileSheet, "flying"); //placeholder
				projectiles.push(new Projectile(player.x + player.width/2, player.y + player.height/2, Math.cos(angle*Math.PI/180)*this.levels[this.level-1].firePower, Math.sin(angle*Math.PI/180)*this.levels[this.level-1].firePower, projectileSprite, this.levels[this.level-1].damage, true));
				world.addChild(projectiles[projectiles.length-1].sprite);
				player.sinceFired = 0;
			}
		},		
		cleanup: function() {
			player.sprite.removeChild(this.container);
		},		
		step: function() {
			var radx = (currentMousePos.x - world.x) - (player.x+player.width/2);
			var rady = ((currentMousePos.y - world.y) - (player.y+player.height/2));
			var angle = Math.atan(rady/radx)/(Math.PI/180);
			if (radx <0) {
				angle += 180;
			}

			if(player.sprite.scaleX == -1){
				angle = -(angle)+180;
			}

			this.container.rotation = angle;		
		}		
	}
}

function PlayerClass(x, y, maxHP, sprite) {
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.sprite = new createjs.Container();
	this.sprite.addChild(sprite);
	if(sprite !== null && sprite !== undefined){
		this.width = sprite.spriteSheet._frameWidth;
		this.height = sprite.spriteSheet._frameHeight;
	} else {
		this.width = 0;
		this.height = 0;
	}

	this.maxHP = maxHP;
	this.HP = this.maxHP;
	this.maxBoost = 250;
	this.boost = this.maxBoost;
	this.facing = 5; //numpad notation: 4 = left, 6 = right, 8 = up, 2 = down
	this.runSpeed = 6;
	this.isJumping = false;
	this.jumpHeight = 18;
	this.firePower = 3;
	this.fireDelay = 30;
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

	this.currentConfig = 1;
	this.configs = {
		1: cannonConfig,
		2: throwingWeaponConfig,
		3: fistConfig
	}
	this.die = function() {
		this.x = this.checkpointX;
		this.y = this.checkpointY;
		this.xv = 0;
		this.yv = 0;

		this.alive = true;
		this.HP = this.maxHP;
		//more consequences for death soon
	};
	this.fire = function() {
		this.configs[this.currentConfig].fire();
	};
	this.setConfig = function(config) {
		this.configs[this.currentConfig].cleanup();
		this.currentConfig = config;
		this.configs[this.currentConfig].init();
	};
	this.checkLevelUp = function() { //clean this up good lord
		if(this.configs[this.currentConfig].curEXP >= this.configs[this.currentConfig].levels[this.configs[this.currentConfig].level-1].EXPtoNext && this.configs[this.currentConfig].level < this.configs[this.currentConfig].levels.length){ 
			this.configs[this.currentConfig].level++;
			this.configs[this.currentConfig].curEXP = 0;
			this.setConfig(this.currentConfig);
		}
	};
}

PlayerClass.prototype = new Creature();