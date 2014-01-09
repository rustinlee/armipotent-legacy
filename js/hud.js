function HeadsUpDisplay() {
	this.container = new createjs.Container();

	this.container.addChild(HUDSprite);

	xpBarSprite.x = 13;
	xpBarSprite.y = 16;
	this.container.addChild(xpBarSprite);
	hpBarSprite.x = 11;
	hpBarSprite.y = 30;
	this.container.addChild(hpBarSprite);
	boostBarSprite.x = 13;
	boostBarSprite.y = 44;	
	this.container.addChild(boostBarSprite);

	this.init = function(){
		this.container.x = (CANVAS_WIDTH - HUDSprite.image.width) / 2;
		this.container.y = CANVAS_HEIGHT - (HUDSprite.image.height + 30);		
		stage.addChild(this.container);
	};
	this.step = function(){
		//xp, boost and life bars
		var xpBarScale = player.configs[player.currentConfig].curEXP / player.configs[player.currentConfig].levels[player.configs[player.currentConfig].level-1].EXPtoNext;
		xpBarSprite.cache(0, 0, xpBarSprite.image.width * (xpBarScale) + 1, xpBarSprite.image.height);
		var hpBarScale = player.HP / player.maxHP;
		hpBarSprite.cache(0, 0, hpBarSprite.image.width * (hpBarScale) + 1, hpBarSprite.image.height);
		var boostBarScale = player.boost / player.maxBoost;
		boostBarSprite.cache(0, 0, boostBarSprite.image.width * (boostBarScale), boostBarSprite.image.height);
	};
}