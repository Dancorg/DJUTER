function Particle(x,y,s,vspeed,hspeed,color,stage, collider){
	shape = new Shape();//
	shape.graphics.beginFill(color).rect(0,0,s,s);
	shape.x = x-s/2;
	shape.y = y-s/2;
	shape.vspeed = vspeed;
	shape.hspeed = hspeed;
	shape.collider = collider;
	shape.timer = 120;
	shape.snapToPixel = true;
	shape.cache(0,0,s,s);
	shape.glow = new Shape();
	if(!collider){
		shape.glow.graphics.beginFill(color).rect(-s/2,-s/2,s*2,s*2);
		shape.glow.alpha=0.25;
		shape.glow.snapToPixel = true;
		shape.glow.cache(-s/2,-s/2,s*2,s*2);
		shape.glow.x = x;55
		shape.glow.y = y;
		stage.addChild(shape.glow);
	}
	shape.update = function(i){	
		this.x += this.hspeed;
		this.y += this.vspeed;
		this.hspeed *= 0.9;
		this.vspeed *= 0.9;
		this.alpha -= 1/120;
		this.timer--;
		this.glow.x = this.x;
		this.glow.y = this.y;
		this.glow.alpha -= 1/480;
		this.glow.alpha+=Math.random()*0.1-0.05;
		if(this.timer <=0 ){
			particles.splice(i,1);
			stage.removeChild(this.glow);
			stage.removeChild(this);
		}
	}
	stage.addChild(shape);
	particles.push(shape);
}

function BulletDeath(i){
	//particles.splice(i,1);
	particles[i] = null;
	stage.removeChild(this);
}

function Coin(x,y,stage){
	shape = new Shape();
	shape.s = 10;
	shape.graphics.beginFill('rgba(230,190,40,1)').rect(0,0,shape.s,shape.s).beginFill('rgba(250,230,30,0.15)').rect(-3,-3,shape.s+6,shape.s+6);
	shape.x = x;
	shape.y = y;
	shape.snapToPixel = true;
	shape.cache(-3,-3,shape.s+6,shape.s+6);
	stage.addChild(shape);
	coins.push(shape);
}

function Projectile(owner,x,y,damage,hspeed,vspeed,angle,time,drop,color,size1,size2,stage){
	shape = new Shape();
	shape.graphics.setStrokeStyle(size1,"butt").beginStroke(color).moveTo(0,0).lineTo(size2,0);
	shape.x = x;
	shape.y = y;
	shape.rotation = angle;
	shape.drop = drop;
	shape.time = time;
	shape.damage = damage;
	shape.hspeed = hspeed;
	shape.vspeed = vspeed;
	shape.owner = owner;
	shape.side = owner.side;
	stage.addChild(shape);
	shape.death = BulletDeath;
	shape.update = function(i){
		this.time--;
		this.x += this.hspeed;
		this.y += this.vspeed;
		for(i in boxes){
			var box = boxes[i];
			if(collisionLinePoints(this.x,this.y,this.x+this.hspeed,this.y+this.vspeed,box)){
				this.death(i);
			}
		}
		for(i in players){
			var p = players[i];
			if(p.side != this.side && collisionLinePoints(this.x,this.y,this.x+this.hspeed,this.y+this.vspeed,p)){
				this.death(i);
			}
		}
	};
	particles.push(shape);
}