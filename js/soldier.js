function Soldier(x, y, stage, side){
	shape = new Shape();
	var s = 10;
	shape.controlled = true;
	shape.name = name;
	shape.side = side;
	shape.isAlive = true;
	shape.color = 'rgba(250,180,40,1)';
	shape.graphics.beginFill('rgba(250,180,40,1)').rect(0,0,s,s).beginFill('rgba(250,180,40,0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.maxspeed = 4;
	shape.hp = 100;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
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
	shape.counters = [0];
	shape.update = aiSUpdate;
	shape.ai = function(){return true;};
	shape.defaultai = aiSUpdate;
	shape.death = playerDeath;
	stage.addChild(shape);
	return shape;
}