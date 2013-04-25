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

function Base(x,y,r){
	var shape = new Shape();
	shape.color1 = 'rgba(180,250,60,1)';
	shape.color2 = 'rgba(10,190,100,0.3)';
	shape.color3 = 'rgba(10,190,180,0.1)';
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
			var side1 = side2 = 0;
			for(i in players){
				var p = players[i];
				if(p.side == 1)side1++;
				else side2++;
			}
			var dp = [];
			dp[0] = pointDistanceSquared(this.x, this.y, player1.x, player1.y);
			dp[1] = pointDistanceSquared(this.x, this.y, player2.x, player2.y);
			if(dp[0] <= this.s*this.s){
				var val = 10*Math.round(Math.sqrt(this.s*this.s - dp[0]))/side1;
				console.log(val);
				res1 += val;
				this.resources -= val;
			}
			
			if(dp[1] <= this.s*this.s){
				var val = 10*Math.round(Math.sqrt(this.s*this.s - dp[1]))/side2;
				console.log(val);
				res2 += val;
				this.resources -= val;
			}
		
			/*for(i in players){
				var p = players[i];
				var d = pointDistanceSquared(this.x, this.y, p.x, p.y);
				if(d<=this.s*this.s){
					var val = Math.round(Math.sqrt(this.s*this.s - d));
					if(p.side == 1){
						res1 += val;
						this.resources -= val;
					}
					if(p.side == 2){
						res2 += val;
						this.resources -= val;
					}
				}
			}*/
		}
		if(this.resources <= 0)this.relocate();
		if(this.timers[0] <= 0) this.timers[0] = 20;
	};
	return shape;
}

function Objective(x,y,r){
	var shape = new Shape();
	shape.color1 = 'rgba(250,120,40,1)';
	shape.color2 = 'rgba(250,20,100,0.3)';
	shape.color3 = 'rgba(220,90,180,0.1)';
	shape.graphics.beginRadialGradientFill([shape.color3,shape.color2],[0,1],0,0,r/5,0,0,r).drawCircle(0,0,r).setStrokeStyle(5, "round").beginStroke(shape.color1).drawCircle(0,0,r);
	shape.x = x;
	shape.y = y;
	shape.s = r;
	shape.timers = [0, 0];
	shape.score = 50;
	stage.addChild(shape);
	shape.relocate = function(){
		this.x = Math.random()*gamewidth;
		this.y = Math.random()*gameheight;
		this.score = 50;
	}
	shape.update = function(){
		this.timers[0] --;
		this.alpha = this.score/50;
		if(this.score>0 && this.timers[0] == 0){
			for(i in players){
				var p = players[i];
				var d = pointDistanceSquared(this.x, this.y, p.x, p.y);
				if(d<=this.s*this.s){
					if(p.side == 1){
						score1++;
						this.score--;
					}
					if(p.side == 2){
						score2++;
						this.score--;
					}
				}
			}
		}
		if(this.score <= 0)this.relocate();
		if(this.timers[0] <= 0) this.timers[0] = 60;
	};
	return shape;
}