function Enemy(x, y, stage, side){
	var shape = new Shape();
	var s = 10;	
	shape.controlled = false;
	shape.side = side;
	shape.isAlive = true;
	shape.color = 'rgba(220,50,80,1)';
	shape.graphics.beginFill('rgba(220,50,80,1)').rect(0,0,s,s).beginFill('rgba(220,50,80,0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.melee = true;
	shape.other = null; // stores the other player it is colliding with
	shape.maxspeed = 3;
	shape.hp = 100;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
	shape.maxenergy = 100;	
	shape.attack = false;
	shape.snapToPixel = true;
	shape.cache(-3,-3,s+6,s+6);
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.target = null;
	shape.formx = Math.round(Math.random()*120)-60;
	shape.formy = Math.round(Math.random()*120)-60;
	shape.counters = [0,0];
	shape.update = playerUpdate;
	shape.ai = aiZUpdate;
	shape.defaultai = aiZUpdate;
	shape.death = playerDeath;
	shape.assumeControl = assumeControl;
	shape.abandonControl = abandonControl;
	shape.halo = new Shape();
	shape.halo.graphics.setStrokeStyle(1, "round").beginStroke(shape.color).drawCircle(0,0,s);
	shape.halo.x = shape.x;
	shape.halo.y = shape.y;
	shape.halo.regX = -s/2;
	shape.halo.regY = -s/2;
	stage.addChild(shape.halo);
	stage.addChild(shape);
	return shape;
}

var aiZUpdate = function(){
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
	if(this.target && dis<22500){
		this.left = this.right = this.up = this.down = false;
		if(this.y < this.target.y-this.s)this.down = true;
		if(this.y > this.target.y+this.s)this.up = true;
		if(this.x < this.target.x-this.s)this.right = true;
		if(this.x > this.target.x+this.s)this.left = true;
	}else{
		this.left = this.right = this.up = this.down = false;
		if(this.y < player1.y+this.formy-this.s)this.down = true;
		if(this.y > player1.y+this.formy+this.s)this.up = true;
		if(this.x < player1.x+this.formx-this.s)this.right = true;
		if(this.x > player1.x+this.formx+this.s)this.left = true;
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
	if(this.target && dis<20000){
		this.attack = true;
	}
	else this.attack = false;
	
	if(this.counters[1] == 0){
		this.formx = Math.round(Math.random()*120)-60;
		this.formy = Math.round(Math.random()*120)-60;
	}
	this.counters[0]--;
	if(this.counters[0] < 0)this.counters[0] = 60;
	this.counters[1]--;
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+30);
	

}

function assumeControl(){
	this.ai = function(){return true;};
	this.controlled = true;
	this.left = this.right = this.up = this.down = false;
	if(this.side == 1)player1 = this;
	if(this.side == 2)player2 = this;
}

function abandonControl(){
	this.controlled = false;
	this.ai = this.defaultai;
}

function pointDistanceSquared(x1,y1,x2,y2){
	return ((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2));
}

function collisionLine(s,t,p){ // s,t = start and end objects, p = walls
    var r = true;
	var a1 = [s.x, s.y];
	var a2 = [t.x, t.y];
    //var dis1 = pointDistanceSquared(a1[0],a1[1],a2[0],a2[1]);
    function scanB(dat1,dat2,dat3,dat4){
        var den = ((dat4[1]-dat3[1])*(dat2[0]-dat1[0]))-((dat4[0]-dat3[0])*(dat2[1]-dat1[1]));
        if (den == 0)
            return false;
        else{
            var ua = (((dat4[0]-dat3[0]) * (dat1[1]-dat3[1])) - ((dat4[1]-dat3[1]) * (dat1[0]-dat3[0])))/den;
            var ub = (((dat2[0]-dat1[0]) * (dat1[1]-dat3[1])) - ((dat2[1]-dat1[1]) * (dat1[0]-dat3[0])))/den;

            if ((ua<0)||(ua>1)||(ub<0)||(ub>1))
                return false;
            else
                return true;
		}
	}	
    for (j in p){ 
		var i = p[j];
        //var dis2 = pointDistanceSquared(a1[0],a1[1],i.x,i.y);
        var iix = i.x+i.w/2;
		var iiy = i.y+i.h/2;
		var ww = i.w/2;
		var hh = i.h/2;
		var b1 = [iix - ww, iiy - hh];
		var b2 = [iix + ww, iiy + hh];

		var c1 = [iix - ww, iiy + hh];
		var c2 = [iix + ww, iiy - hh];

		if (!scanB(a1,a2,b1,b2) && !scanB(a1,a2,c1,c2))
			r = false;
		else{
			return true;
		}
		r = false;
	}
    return r;
}

function collisionLinePoints(s1,s2,t1,t2,i, type){ // s,t = start and end objects, p = walls
    var r = true;
	var a1 = [s1, s2];
	var a2 = [t1, t2];
    //var dis1 = pointDistanceSquared(a1[0],a1[1],a2[0],a2[1]);

    function scanB(dat1,dat2,dat3,dat4){
        var den = ((dat4[1]-dat3[1])*(dat2[0]-dat1[0]))-((dat4[0]-dat3[0])*(dat2[1]-dat1[1]));
        if (den == 0)
            return false;
        else{
            var ua = (((dat4[0]-dat3[0]) * (dat1[1]-dat3[1])) - ((dat4[1]-dat3[1]) * (dat1[0]-dat3[0])))/den;
            var ub = (((dat2[0]-dat1[0]) * (dat1[1]-dat3[1])) - ((dat2[1]-dat1[1]) * (dat1[0]-dat3[0])))/den;

            if ((ua<0)||(ua>1)||(ub<0)||(ub>1))
                return false;
            else
                return true;
		}
	}
	
	//var dis2 = pointDistanceSquared(a1[0],a1[1],i.x+i.w/2,i.y+i.h/2);
	var iix = i.x+i.w/2;
	var iiy = i.y+i.h/2;
	var ww = i.w/2;
	var hh = i.h/2;

	var b1 = [iix - ww, iiy - hh];
	var b2 = [iix + ww, iiy + hh];

	var c1 = [iix - ww, iiy + hh];
	var c2 = [iix + ww, iiy - hh];

	if(type == "cross"){
		if (!scanB(a1,a2,b1,b2) && !scanB(a1,a2,c1,c2))
			r = false;
		else{
			return true;
		}
	}
	if(type == "box"){
		if (!scanB(a1,a2,b1,c2) && !scanB(a1,a2,c2,b2) && !scanB(a1,a2,b2,c1) && !scanB(a1,a2,c1,b1))
			r = false;
		else{
			return true;
		}
	}

	r = false;
	
    return r;
}