function Enemy(x, y, stage){
	shape = new Shape();
	var s = 10;
	shape.isAlive=true;
	shape.graphics.beginFill('rgba(220,50,80,1)').rect(0,0,s,s).beginFill('rgba(220,50,80,0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.x = x;
	shape.y = y;
	shape.canjump = false;
	shape.jumping=0;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.onfloor = false;
	shape.vspeed = 0;
	shape.hspeed = 0;
	stage.addChild(shape);
	return shape;
}