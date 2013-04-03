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
	shape.canjump = false;
	shape.jumping=0;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.onfloor = false;
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.update = function(){
		if(this.isAlive){

			if(maincounter%5==0 && !this.jumping){
				Particle(this.x+5,this.y+5,5,0,0,this.color,stage, false);}
			
			if(this.vspeed<10 && !this.onfloor)
				this.vspeed += 0.5;
			
			this.onfloor = false; //by default supposed to be on air
			this.canjump = false; //by default supposed to be on 
			
			for(i in boxes ){
				b = boxes[i];	
				preciseColllision(this, b);
			}

			
			if(this.canjump)this.jumping=9;
			if(this.x+this.s<0 || this.x-this.s>640 || this.y+this.s<0 || this.y-this.s>480)
				this.death();
			this.y += this.vspeed;
			this.x += this.hspeed;
			if(this.left && this.hspeed>-4)this.hspeed -= 0.5;
			if(this.right  && this.hspeed<4)this.hspeed += 0.5;
			if(!(this.left || this.right)) this.hspeed/=2;
			if(this.jump){
				if(this.jumping > 0){
					this.vspeed -= 1.5
					this.jumping--;
				}		
			}
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
		deathBox.graphics.beginFill('rgba(200,50,50,0.1)').rect(0,-20,640,90).beginFill('rgba(10,10,10,0.8)').rect(0,-3,640,56).beginFill('rgba(200,50,50,0.7)').rect(0,0,640,50);
		deathBox.x=0;
		deathBox.y=150;
		gui.addChild(deathBox);
		var deathText = new Text(this.name + " has daid: ", "30px Impact", "#FFF");
		deathText.textAlign = "center";
		deathText.x = 320;
		deathText.y = 156;
		gui.addChild(deathText);
		stage.update();
		endButton = false;
	}
	stage.addChild(shape);
	return shape;
}