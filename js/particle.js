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
	stage.addChild(shape);
	particles.push(shape);
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
