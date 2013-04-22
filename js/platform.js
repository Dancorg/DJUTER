function Box(x, y, w, h, stage, speed){
	var color;
	var speed;
	color = 'rgba(60,80,220,0.75)';
	speed = speed;	
	var shape = new Shape();
	shape.graphics.beginFill(color).rect(0,0,w,h).beginFill(color).rect(3,3,w-6,h-6);
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

function Objective(x,y,r){
	var shape = new Shape();
	shape.color1 = 'rgba(250,120,40,1)';
	shape.color2 = 'rgba(220,90,180,0.5)';
	shape.color3 = 'rgba(220,90,180,0.1)';
	shape.graphics.beginRadialGradientFill([shape.color3,shape.color2],[0,1],0,0,r/5,0,0,r).drawCircle(0,0,r).setStrokeStyle(5, "round").beginStroke(shape.color1).drawCircle(0,0,r);
	shape.x = x;
	shape.y = y;
	shape.s = r;
	shape.timers = [0, 0];
	shape.resources = 10000;
	stage.addChild(shape);
	shape.relocate = function(){
		this.x = Math.random()*gamewidth;
		this.y = Math.random()*gameheight;
		this.resources = 10000;
	}
	shape.update = function(){
		this.timers[0] --;
		this.alpha = this.resources/10000;
		if(this.resources>0 && this.timers[0] == 0){
			for(i in players){
				var p = players[i];
				var d = pointDistanceSquared(this.x, this.y, p.x, p.y);
				if(d<=this.s*this.s){
					var val = Math.round(Math.sqrt(this.s*this.s - d));
					if(p.side == 1){
						score1++;
						res1 += val;
						this.resources -= val;
					}
					if(p.side == 2){
						score2++;
						res2 += val;
						this.resources -= val;
					}
				}
			}
		}
		if(this.resources <= 0)this.relocate();
		if(this.timers[0] <= 0) this.timers[0] = 20;
	};
	return shape;
}