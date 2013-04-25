function Player(name, side, x, y, color, stage){
	var shape = new Shape();
	var s = 10;
	shape.controlled = false;
	shape.side = side;
	shape.isAlive = true;
	shape.color = 'rgba('+color+',1)';
	shape.graphics.beginFill(shape.color).rect(0,0,s,s).beginFill('rgba('+color+',0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.melee = false;
	shape.other = null; // stores the other player it is colliding with
	shape.maxspeed = 2;
	shape.hp = 100;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
	shape.firerate = 5;
	shape.maxenergy = 100;
	shape.attack = false;
	shape.angle = 0;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.target = null;
	shape.formx = Math.round(Math.random()*60);
	shape.formy = Math.round(Math.random()*60);
	shape.counters = [0,0];
	shape.update = playerUpdate;
	shape.ai = aiSUpdate;
	shape.defaultai = aiSUpdate;
	shape.death = playerDeath;
	shape.assumeControl = assumeControl;
	shape.abandonControl = abandonControl;
	shape.halo = new Shape();
	shape.halo.graphics.setStrokeStyle(1, "round").beginStroke(shape.color).drawCircle(0,0,s-1);
	shape.halo.x = shape.x;
	shape.halo.y = shape.y;
	shape.halo.regX = -s/2;
	shape.halo.regY = -s/2;
	stage.addChild(shape.halo);
	stage.addChild(shape);
	return shape;
}

var playerDeath = function(j){
	this.isAlive = false;
		//endtimer = 30;	
		if(this.controlled){
			if(this.side == 1)setNewPlayer(1);
			else setNewPlayer(2);
		}
		stage.removeChild(this);
		stage.removeChild(this.halo);
		for(var i=0;i<10;i++){
			Particle(this.x+i,this.y+Math.random()*10,6,Math.random()*20-10,Math.random()*20-10,'rgba(180,40,40,1)',stage, false, 40);
		}
		players.splice(j,1);
		
		/*var deathBox = new Shape();
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
		endButton = false;*/
}

var playerUpdate = function(j){
	this.ai();
	if(this.isAlive){
		if(maincounter%3==0 && this.controlled){
			Particle(this.x+5,this.y+5,5,0,0,this.color,stage, false, 50);}
		if(/*!this.attack &&*/ this.energy < this.maxenergy)this.energy++;
		
		for(i in boxes ){
			b = boxes[i];	
			preciseColllision(this, b);
		}
		
		if(this.x+this.s<0 || this.x-this.s>gamewidth || this.y+this.s<0 || this.y-this.s>gameheight)
			this.death(j);
		this.y += this.vspeed;
		this.x += this.hspeed;
		if(this.halo){
			//this.halo.graphics.clear().setStrokeStyle(2, "round").beginStroke(shape.color).drawCircle(0,0,50);
			this.halo.alpha = this.hp/100;
			this.halo.x = this.x;
			this.halo.y = this.y;
		}
		var diagonal = ((this.left || this.right)&&(this.down || this.up))?0.71:1;
		
		if(this.left && this.hspeed>-this.maxspeed*diagonal)this.hspeed -= 0.5*diagonal;
		if(this.right  && this.hspeed<this.maxspeed*diagonal)this.hspeed += 0.5*diagonal;
		if(this.up && this.vspeed>-this.maxspeed*diagonal)this.vspeed -= 0.5*diagonal;
		if(this.down  && this.vspeed<this.maxspeed*diagonal)this.vspeed += 0.5*diagonal;
		if(this.hspeed>this.maxspeed*diagonal)this.hspeed = this.maxspeed*diagonal;
		if(this.hspeed<-this.maxspeed*diagonal)this.hspeed = -this.maxspeed*diagonal;
		if(this.vspeed>this.maxspeed*diagonal)this.vspeed = this.maxspeed*diagonal;
		if(this.vspeed<-this.maxspeed*diagonal)this.vspeed = -this.maxspeed*diagonal;
		if(!(this.left || this.right) ) this.hspeed/=2;
		if(!(this.up || this.down) ) this.vspeed/=2;

		this.other = null;
		for(i in players ){
			b = players[i];
			if(b != this)playerColllision(this, b);
		}
		if(!this.melee && this.attack && this.energy>=10 && maincounter%this.firerate==0){
			this.energy -= 10;
			var hspeed = Math.cos(this.angle)*20;
			var vspeed = Math.sin(this.angle)*20;
			Projectile(this,this.x+this.s/2,this.y+this.s/2,20,hspeed,vspeed,radToDeg(this.angle),20,0.95,"rgba(250,250,0,1)",3,10,stage);
		}
		//if(this == player1)console.log(this.attack);
		if(this.melee){
			if(this.attack && this.energy >= 60){
				if(this == player1)console.log("melee attack");
				this.energy -= 60;
				this.vspeed *= 4;
				this.hspeed *= 4;
			}
			if(this.other && this.other.side != this.side){
				this.other.hp -= 15;
			}
		}
		//else if(this.energy<=10)this.attack = false;
		if(this.hp<=0)this.death(j);
	}
}



var aiSUpdate = function(){
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
	if(this.target && dis<12500){
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.target.y-this.s)this.up = true;
		if(this.y > this.target.y+this.s)this.down = true;
		if(this.x < this.target.x-this.s)this.left = true;
		if(this.x > this.target.x+this.s)this.right = true;
	}else{
		this.left = this.right = this.up = this.down = false;
		if(this.y < player2.y+this.formy-this.s)this.down = true;
		if(this.y > player2.y+this.formy+this.s)this.up = true;
		if(this.x < player2.x+this.formx-this.s)this.right = true;
		if(this.x > player2.x+this.formx+this.s)this.left = true;
	}
	if((!this.target && this.counters[0]%15 == 0)|| this.counters[0]%60 == 0){
		this.target = null;
		for(var t in players){
			var p = players[t];
			if(p.side != this.side && !collisionLine(this,p,boxes)){
				this.target = p;
			}
		}
	}
	if(this.target && !collisionLine(this,this.target,boxes) && dis<20000){
		this.angle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
		this.attack = true;
	}
	else{
		this.attack = false;
	}
	
	if(this.counters[1] == 0){
		this.formx = Math.round(Math.random()*120)-60;
		this.formy = Math.round(Math.random()*120)-60;
	}
	this.counters[0]--;
	if(this.counters[0] < 0)this.counters[0] = 60;
	this.counters[1]--;
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+30);
}

function setNewPlayer(side){
	for(i in players){
		var p = players[i];
		if(p.side == side && !p.controlled){
			p.assumeControl();
			return true;
		}
	}
}