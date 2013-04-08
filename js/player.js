function Player(name, x, y, color, stage){
	shape = new Shape();
	var s = 10;
	shape.controllable = true;
	shape.name = name;
	shape.isAlive = true;
	shape.color = 'rgba('+color+',1)';
	shape.graphics.beginFill(shape.color).rect(0,0,s,s).beginFill('rgba('+color+',0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.hp = 100;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
	shape.maxenergy = 10;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.target = null;
	shape.formx = Math.round(Math.random()*60);
	shape.formy = Math.round(Math.random()*60);
	shape.counters = [0];
	shape.update = playerUpdate;
	shape.ai = function(){return true;};
	shape.defaultai = aiSUpdate;
	shape.death = playerDeath;
	stage.addChild(shape);
	return shape;
}

var playerDeath = function(){
	this.isAlive = false;
		//endtimer = 30;
		stage.removeChild(this);
		for(var i=0;i<10;i++){
			Particle(this.x+i,this.y+Math.random()*10,10,Math.random()*20-10,Math.random()*30-15,'rgba(180,40,40,1)',stage);
		}
		
		var deathBox = new Shape();
		deathBox.graphics.beginFill('rgba(200,50,50,0.1)').rect(0,-20,gamewidth,90).beginFill('rgba(10,10,10,0.8)').rect(0,-3,gamewidth,56).beginFill('rgba(200,50,50,0.7)').rect(0,0,gamewidth,50);
		deathBox.x=0;
		deathBox.y=150;
		gui.addChild(deathBox);
		var deathText = new Text(this.name + " has daid: ", "30px Impact", "#FFF");
		deathText.textAlign = "center";
		deathText.x = gamewidth/2;
		deathText.y = 156;
		gui.addChild(deathText);
		stage.update();
		endButton = false;
}

var playerUpdate = function(){
	this.ai();
	if(this.isAlive){
		/*if(maincounter%3==0){
			Particle(this.x+5,this.y+5,5,0,0,this.color,stage, false);}*/	
		
		for(i in boxes ){
			b = boxes[i];	
			preciseColllision(this, b);
		}
		for(i in players ){
			b = players[i];
			if(b != this)playerColllision(this, b);
		}
		if(this.x+this.s<0 || this.x-this.s>gamewidth || this.y+this.s<0 || this.y-this.s>gameheight)
			this.death();
		this.y += this.vspeed;
		this.x += this.hspeed;
		var diagonal = (((this.left || this.right)&&(this.down || this.up)))?0.71:1;
		
		if(this.left && this.hspeed>-4*diagonal)this.hspeed -= 0.5*diagonal;
		if(this.right  && this.hspeed<4*diagonal)this.hspeed += 0.5*diagonal;
		if(this.up && this.vspeed>-4*diagonal)this.vspeed -= 0.5*diagonal;
		if(this.down  && this.vspeed<4*diagonal)this.vspeed += 0.5*diagonal;
		if(!(this.left || this.right) || Math.abs(this.hspeed)>4*diagonal) this.hspeed/=2;
		if(!(this.up || this.down)|| Math.abs(this.vspeed)>4*diagonal) this.vspeed/=2;
	}
}



var aiSUpdate = function(){
}