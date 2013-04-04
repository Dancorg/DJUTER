function Player(name, x, y, color, stage){
	shape = new Shape();
	var s = 10;
	shape.name = name;
	shape.isAlive=true;
	shape.color = 'rgba('+color+',1)';
	shape.graphics.beginFill(shape.color).rect(0,0,s,s).beginFill('rgba('+color+',0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.x = x;
	shape.y = y;
	shape.left = 0;
	shape.right = 0;
	shape.jump = 0;
	shape.drop = 0;
	shape.energy = 0;
	shape.maxenergy = 10;
	shape.canjump = false;
	shape.candrop = false;
	shape.jumping=0;
	shape.droping=0;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.onfloor = false;
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.update = function(){
		if(this.isAlive){

			if(maincounter%3==0 && (this.energy>0 &&(this.jump || this.drop))){
				Particle(this.x+5,this.y+5,5,0,0,this.color,stage, false);}
			
			if(this.vspeed<10 && !this.onfloor)
				this.vspeed += 0.5;
			
			if(this.onfloor && this.energy<this.maxenergy)
				this.energy+=this.maxenergy/5;
			
			this.onfloor = false; //by default supposed to be on air
			this.canjump = false; //by default supposed to be on air
			this.candrop = true; //by default supposed to be on air

			
			for(i in boxes ){
				b = boxes[i];	
				preciseColllision(this, b);
			}
			for(i in players ){
				b = players[i];
				//if(b != this)
				playerColllision(this, b);
			}

			
			if(this.canjump)this.jumping=8;
			if(this.candrop)this.droping=8;
			if(this.x+this.s<0 || this.x-this.s>gamewidth || this.y+this.s<0 || this.y-this.s>gameheight)
				this.death();
			this.y += this.vspeed;
			this.x += this.hspeed;
			if(this.left && this.hspeed>-4)this.hspeed -= 0.5;
			if(this.right  && this.hspeed<4)this.hspeed += 0.5;
			if(!(this.left || this.right)) this.hspeed/=2;
			if(this.jump){
				if(this.energy > 0){
					this.vspeed -= 1.5;
					this.energy--;
				}
				/*if(this.jumping > 0){
					this.vspeed -= 1.5;
					this.jumping--;
				}*/		
			}
			if(this.drop){
				if(this.energy > 0){
					this.vspeed += 1.5;
					this.energy--;
				}
			}
			/*if(this.drop && this.candrop){
				this.vspeed += 3;
				this.drop = false;
				this.candrop = false;
					
			}*/
		}
	};
	shape.death = function (){//player dies, score screen displayed
		this.isAlive = false;
		endtimer = 30;
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
	stage.addChild(shape);
	return shape;
}