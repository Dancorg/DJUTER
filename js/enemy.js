function Enemy(x, y, color, stage, side,hp,damage,energy){
	var shape = new Shape();
	var s = 10;	
	shape.controlled = false;
	shape.side = side;
	shape.isAlive = true;
	shape.color = 'rgba('+color+',1)';//'rgba(220,50,80,1)';
	shape.graphics.beginFill(shape.color).rect(0,0,s,s).beginFill('rgba('+color+',0.1)').rect(-3,-3,s+6,s+6);
	shape.s = s;
	shape.w = s;
	shape.h = s;
	shape.x = x;
	shape.y = y;
	shape.moveHelper = {"prevX":x,"prevY":y,"moveToX":x,"moveToY":y,"next":0};
	shape.path = null;
	shape.other = null; // stores the other player it is colliding with	
	shape.hp = hp;
	shape.maxhp = hp;
	shape.left = 0;
	shape.right = 0;
	shape.up = 0;
	shape.down = 0;
	shape.energy = 0;
	shape.firerate = 5;
	shape.maxenergy = energy;
	shape.damage = damage;
	shape.attack = false;
	shape.angle = 0;
	shape.cache(-3,-3,s+6,s+6);
	shape.snapToPixel = true;
	shape.vspeed = 0;
	shape.hspeed = 0;
	shape.speedfactor = 1;
	shape.acelfactor = 1;
	shape.target = null;
	if(side == 1){
		shape.maxspeed = 3;
		shape.melee = true;
		shape.formx = Math.round(Math.random()*120)-60;
		shape.formy = Math.round(Math.random()*120)-60;		
		shape.ai = aiZUpdate;
		shape.defaultai = aiZUpdate;
	}
	if(side == 2){
		shape.maxspeed = 2;
		shape.melee = false;
		shape.formx = Math.round(Math.random()*60);
		shape.formy = Math.round(Math.random()*60);		
		shape.ai = aiZUpdate;
		shape.defaultai = aiZUpdate;
	}
	shape.counters = [0,0,0,0];
	shape.update = playerUpdate;
	shape.death = playerDeath;
	shape.assumeControl = assumeControl;
	shape.abandonControl = abandonControl;
	shape.switchSides = switchSides;
	shape.halo = new Shape();
	shape.halo.graphics.setStrokeStyle(1, "round").beginStroke(shape.color).drawCircle(0,0,s);
	shape.halo.x = shape.x;
	shape.halo.y = shape.y;
	shape.halo.regX = -s/2;
	shape.halo.regY = -s/2;
	shape._flag = true;
	stage.addChild(shape.halo);
	stage.addChild(shape);
	return shape;
}

var aiZUpdate = function(){
	this.leader = this.side==1?player1:player2;
	if(this.target)
		var dis = pointDistanceSquared(this.x,this.y,this.target.x,this.target.y);
		
	var moveX,moveY;
	if(this.target && dis<22500){
		moveX = this.target.x;
		moveY = this.target.y;
	}else{	
		if( collisionLine(this,this.leader,boxes)){
			if(!this.path && this._flag /*&& this.counters[2] == 0*/){
				console.log("path");
				this.path = returnPath([this.x+this.s/2,this.y+this.s/2],[this.leader.x+this.leader.s/2, this.leader.y+this.leader.s/2]);
				this.moveHelper.next=0;
			}else{
				if(this.counters[2] == 0)this._flag = true;
			}
			this._flag = false;
			if(this.path && this.path.length>0){
				moveX = this.path[this.moveHelper.next].pos[1]*10;
				moveY = this.path[this.moveHelper.next].pos[0]*10;
				if(closePos(this.x,this.y,moveX,moveY)){
					this.moveHelper.next++;
					/*console.log("next");*/
					if(this.moveHelper.next >= this.path.length-1){
						this.path = null;
						this._flag = true;
						console.log("path end");
					}
				}
			}
			/*moveX = this.moveHelper.moveToX;
			moveY = this.moveHelper.moveToY;*/
		}else{
			this._flag = true;
			this.path = null;
			moveX = this.leader.x+this.formx;
			moveY = this.leader.y+this.formy;
		}
	}
	
	if(this.side == 1){
		this.left = this.right = this.up = this.down = false;
		if(this.y < moveY-this.s)this.down = true;
		if(this.y > moveY+this.s)this.up = true;
		if(this.x < moveX-this.s)this.right = true;
		if(this.x > moveX+this.s)this.left = true;
	}else{
		if(this.target && dis<12500){
			this.left = this.right = this.up = this.down = false;
			if(this.y < this.target.y-this.s)this.up = true;
			if(this.y > this.target.y+this.s)this.down = true;
			if(this.x < this.target.x-this.s)this.left = true;
			if(this.x > this.target.x+this.s)this.right = true;
		}else{
			this.left = this.right = this.up = this.down = false;
			if(this.y < moveY-this.s)this.down = true;
			if(this.y > moveY+this.s)this.up = true;
			if(this.x < moveX-this.s)this.right = true;
			if(this.x > moveX+this.s)this.left = true;
		}
	}
	
	if((!this.target && this.counters[0]%15 == 0)|| this.counters[0]%60 == 0){
		this.target = null;
		for(var t in players){
			var p = players[t];
			if(p.side != this.side && !collisionLine(this,p,boxes)){
				this.target = p;
				//this.counters[2] = 60;
			}
		}
	}
	if(this.side == 1){
		if(this.target && dis<20000){
			this.attack = true;
		}
		else this.attack = false;
	}else{
		if(this.target && !collisionLine(this,this.target,boxes) && dis<30000){
			this.angle = Math.atan2(this.target.y-this.y,this.target.x-this.x);
			this.attack = true;
		}
		else{
			this.attack = false;
		}
	}
	
	if(this.counters[1] == 0){
		this.formx = Math.round(Math.random()*120)-60;
		this.formy = Math.round(Math.random()*120)-60;
	}
	
	this.counters[0]--;
	if(this.counters[0] < 0)this.counters[0] = 60;
	this.counters[1]--;
	if(this.counters[1] < 0)this.counters[1] = Math.round(Math.random()*120+60);
	this.counters[2]--;
	if(this.counters[2] < 0)this.counters[2] = 60;
}

function similarPos(obj){
	if(Math.abs(obj.x - obj.moveHelper.prevX)<5 && Math.abs(obj.y - obj.moveHelper.prevY)<5)
		return true;
	else
		return false;
}

function getRandomAvoidPos(obj){
	var pos=[0,0];
	/*pos[0] = Math.random()*(100*obj.left+100*obj.right)-100*obj.left;
	pos[1] = Math.random()*(100*obj.up+100*obj.down)-100*obj.up;*/
	pos[0] = Math.random()*(200)-100;
	pos[1] = Math.random()*(200)-100;
	return pos;
}

function assumeControl(){
	this.ai = function(){return true;};
	this.controlled = true;
	this.left = this.right = this.up = this.down = false;
	if(this.side == 1)player1 = this;
	if(this.side == 2)player2 = this;
	if(ai1)if(this.side == 1){this.ai = aistratZUpdate;}//commander AI
	if(ai2)if(this.side == 2){this.ai = aistratSUpdate;}//commander AI
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
    for (var j in p){ 
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
