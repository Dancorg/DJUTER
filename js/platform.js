function Box(x, y, w, h, stage, speed){
	var color;
	var speed;
	color = 'rgba(60,80,220,0.75)';
	speed = speed;	
	shape = new Shape();
	shape.graphics.beginFill(color).drawRoundRect(0,0,w,h,4).beginFill(color).drawRoundRect(3,3,w-6,h-6,3);
	shape.color = color;
	shape.x = x;
	shape.y = y;
	shape.h = h;
	shape.w = w;
	shape.speed = speed;
	shape.snapToPixel = true;
	shape.cache(0,0,w,h);
	stage.addChild(shape);
	boxes.push(shape);

}