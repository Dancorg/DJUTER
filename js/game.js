
var canvas;
var stage;

var player1;
var player2;
var players;
var boxes;
var particles;
var coins;
var objectives;

var res1 = 0;
var res2 = 0;

var keyup = 38;
var keyleft = 37;
var keyright = 39;
var keydown = 40;
var keyintro = 13;
var keyw = 87;
var keya = 65;
var keyd = 68;
var keys = 83;
var keyspace = 32;
var left = 0;
var right = 0;
var jump = 0;
var gui;
var startButton = false;
var endButton = true;
var diff;
var score1;
var score2;
var endtimer;
var maincounter;
var cw;  // canvas width
var ch;  // canvas height

var gamewidth = 800;
var gameheight = 600;

/*document.ontouchstart = handleTouchStart;
document.ontouchend = handleTouchEnd;
document.ontouchleave = handleTouchEnd;*/
document.onmousedown = handleMouseDown;
document.onmousemove = handleMouseMove;
document.onmouseup = handleMouseUp;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function reset(){
	stage.removeAllChildren();
	boxes = [];
	players = [];
	particles = [];
	objectives = [];
	coins = [];
	score1 = 0;	
	score2 = 0;
	res1 = 0;
	res2 = 0;
	boxSpawn = 0;
	diff = 0;
	endtimer = -1;
	maincounter=0;
}

function resizeCanvas(){
	var cwidth = $('#body').width();
	var cheight = $('#body').height();
	if(cwidth < gamewidth || cheight < gameheight){
		switchFullscreen();
		var minim = Math.min(cwidth,cheight*(4/3));
		var w = cwidth*(minim/cwidth);
		var h = cheight*(minim/((4/3)*cheight));
		$("#canvas").css({'width':w});
		$("#canvas").css({'height':h});
	}
	else{
		$("#canvas").css({'width':'800px'});
		$("#canvas").css({'height':'600px'});
	}
	cw = cwidth;
	ch = cheight;

}

function switchFullscreen(){
	body = document.getElementById("body");
	if (body.requestFullScreen) {  
	  body.requestFullScreen();  
	} else if (body.mozRequestFullScreen) {  
	  body.mozRequestFullScreen();  
	} else if (body.webkitRequestFullScreen) {  
	  body.webkitRequestFullScreen();  
	} 
}


function init(){
	
	$(window).resize(function(){resizeCanvas();});
	setTimeout(resizeCanvas,1);
	
	canvas = document.getElementById('canvas');
	stage = new Stage(canvas);
	stage.snapToPixelEnabled = true;
	stage.mouseEventsEnabled = true;
	canvas.addEventListener("touchstart",handleTouchStart,false);
	canvas.addEventListener("touchend",handleTouchEnd,false);
	Ticker.setFPS(60);
	Ticker.addListener(window);
	startMenu();
}

function startMenu(){
	reset();
	Ticker.setPaused(true);
	var background = new Shape();
	background.graphics.beginRadialGradientFill(["#080822","#248"],[0.99,0.01],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);
	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	var startBox = new Shape();
	startBox.graphics.beginFill('rgba(220,180,50,1)').rect(0,-8,gamewidth,86).beginFill('rgba(150,20,20,0.9)').rect(0,0,gamewidth,70);
	startBox.x=0;
	startBox.y=150;
	stage.addChild(startBox);
	var startText = new Text("Z-DJUTER", "45px impact", "#EEF");
	startText.textAlign = "center";
	startText.x = gamewidth/2;
	startText.y = 155;
	stage.addChild(startText);
	var startText2 = new Text("press any key to continue", "10px Arial", "#EEF");
	startText2.textAlign = "center";
	startText2.x = gamewidth/2;
	startText2.y = 400;
	stage.addChild(startText2);
	stage.update();	
}

function startLevel(){
	reset();
	Ticker.setPaused(false);
	var background = new Shape();
	background.graphics.beginRadialGradientFill(["#112","#27B"],[0.1,0.9],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);
	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	objectives = [Objective(Math.random()*gamewidth, Math.random()*gameheight, 50),Objective(Math.random()*gamewidth, Math.random()*gameheight, 50)];
	ene = Enemy(150,150,stage, 1);
	ene1 = Enemy(130,150,stage, 1);
	ene2 = Enemy(150,130,stage, 1);
	ene3 = Enemy(180,150,stage, 1);
	ene4 = Enemy(150,180,stage, 1);
	ene5 = Enemy(30,50,stage, 1);
	ene6 = Enemy(50,30,stage, 1);
	ene7 = Enemy(80,50,stage, 1);
	ene8 = Enemy(50,80,stage, 1);
	ene9 = Enemy(30,70,stage, 1);
	ene10 = Enemy(70,30,stage, 1);
	ene11 = Enemy(80,70,stage, 1);
	ene12 = Enemy(70,80,stage, 1);
	/*player1 = new Player("Player 1", gamewidth/2-100, 60,"40,180,250", stage);
	player1.vspeed = 0;*/
	player2 = new Player("Player 2",2, gamewidth/2+100, 60+200,"250,180,40", stage);
	player3 = new Player("Player 2",2, gamewidth/2+150, 60+200,"250,180,40", stage);
	player4 = new Player("Player 2",2, gamewidth/2+150, 60+200,"250,180,40", stage);
	player5 = new Player("Player 2",2, gamewidth/2+150, 60+200,"250,180,40", stage);
	//player1 = ene;
	ene.assumeControl();
	player2.assumeControl();
	players = [ player2,player3,player4,player5,ene,ene1,ene2,ene3,ene4,ene5,ene6,ene7,ene8,ene9,ene10,ene11,ene12];
	
	
	platformFirstSpawn();
	gui = new Container();
	scoreText1 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText1.x = 10;
	scoreText1.y = 5;
	scoreText2 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText2.x = gamewidth - 140;
	scoreText2.y = 5;
	energyText1 = new Text("ENERGY: ", "12px impact", "#AFF");
	energyText1.x = 10;
	energyText1.y = 25;
	energyText2 = new Text("ENERGY: ", "12px impact", "#AFF");
	energyText2.x = gamewidth - 140;
	energyText2.y = 25;
	hpText1 = new Text("HP: ", "12px impact", "#AFF");
	hpText1.x = 10;
	hpText1.y = 40;
	hpText2 = new Text("HP: ", "12px impact", "#AFF");
	hpText2.x = gamewidth - 140;
	hpText2.y = 40;
	scoreBack = new Shape();
	scoreBack.graphics.beginFill('rgba(50,180,250,0.35)').drawRoundRectComplex(0,0,150,60,0,0,20,0).drawRoundRectComplex(gamewidth-150,0,150,60,0,0,0,20)//.rect(0,0,150,30);
	gui.addChild(scoreBack, scoreText1, scoreText2, energyText1, energyText2,hpText1,hpText2);		
	stage.addChild(gui);
	//Box(gamewidth/2-20,80,60,15,stage,"up");
	
}

function tick(){
	maincounter++;
	if (endtimer > 0)endtimer--;
	diff += 0.0002;
	scoreText1.text = "SCORE1: " + score1;
	scoreText2.text = "SCORE2: " + score2;
	energyText1.text = "ENERGY: " + player1.energy;
	energyText2.text = "ENERGY: " + player2.energy;
	hpText1.text = "HP: " + player1.hp;
	hpText2.text = "HP: " + player2.hp;
	hpText1.color = player1.hp<60?player1.hp<30?"#F44":"#FAA":"#AFF"
	hpText2.color = player2.hp<60?player2.hp<30?"#F44":"#FAA":"#AFF"
	stage.setChildIndex(gui,0);
	
	for(i in boxes){
		var box = boxes[i];
		box.y+=box.speed; //move the box

		if(box.y>gameheight+box.h){
			stage.removeChild(box);
			boxes.splice(i,1);//delete the box when out of screen
		}
		if(box.y<0-box.h){
			stage.removeChild(box);
			boxes.splice(i,1);//delete the box when out of screen
		}
	}
	
	for(var i = particles.length-1;i >= 0;i--){
		var part = particles[i];
		part.update(i);
	}
	for(i in coins){
		var c = coins[i];
		c.y++;
		if(player1.x < c.x+c.s && player1.x+player1.s > c.x && player1.y<c.y+c.s && player1.y+player1.s>c.y  ){
			score1 += 5;
			player1.energy += 10;
			coinExplosion(c.x,c.y);
			coins.splice(i,1);
			stage.removeChild(c);
		}
		if(player2.x < c.x+c.s && player2.x+player2.s > c.x && player2.y<c.y+c.s && player2.y+player2.s>c.y  ){
			score2 += 5;
			player2.energy += 10;
			coinExplosion(c.x,c.y);
			coins.splice(i,1);
			stage.removeChild(c);
		}
	}
	for(var i = players.length-1;i >= 0;i--){
		var p = players[i];
		p.update(i);
	}	
	if(res1 >= 500){
		res1-=500;
		players.push(Enemy(0,gameheight/2,stage, 1));
	}
	if(res2 >= 500){
		res2-=500;
		players.push(Player("Player 2",2, gamewidth, gameheight/2,"250,180,40", stage));
	}
	for(i in objectives){
		var o = objectives[i];
		o.update();
	}
	stage.update();
}

function platformFirstSpawn(){
	var x,y,w,h;
	for(var i=0; i<20; i++){
		h = Math.round(Math.random()*80+8);
		w = Math.round(Math.random()*80+8);
		x = Math.round(Math.random()*gamewidth-w);
		y = Math.round(Math.random()*(gameheight-80-h)+80);
		Box(x,y,w,h, stage, 0);
	}
}

function boxCollision(a,b,h,v){
	var ah = a.hspeed*h;
	var av = a.vspeed*v;
	var ax = a.x;
	var ay = a.y;
 	var div = Math.max(Math.abs(ah), Math.abs(av));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = a.x + i*ah/div;
		py = a.y + i*av/div;
		if(ax+i*ah/div < b.x+b.w && ax+a.w+i*ah/div > b.x && ay+i*av/div<b.y+b.h && ay+a.h+i*av/div>b.y ){
			return true;
		}
	}
	return false;
}

function boxCollision2(a,b,h,v){
	var ah = a.hspeed*h;
	var av = a.vspeed*v;
	var ax = a.x-a.hspeed*(1-1*h);
	var ay = a.y-a.vspeed*(1-1*v);
 	var div = Math.max(Math.abs(ah), Math.abs(av));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = a.x + i*ah/div;
		py = a.y + i*av/div;
		if(ax+i*ah/div < b.x+b.w && ax+a.w+i*ah/div > b.x && ay+i*av/div<b.y+b.h && ay+a.h+i*av/div>b.y ){
			return true;
		}
	}
	return false;
}

function playerColllision(playera, b){
	if(boxCollision(playera, b,1,1)){
		var hor = true;
		var ver = true;
		/*if(boxCollision2(playera, b,1,0)){
			hor = true;
		}
		if(boxCollision2(playera, b,0,1)){
			ver = true;
		}*/	
		if(hor){
			b.hspeed += playera.hspeed;
			//playera.x -= playera.hspeed;
			playera.hspeed += -playera.hspeed;
			//playera.x += playera.x<b.x?-((playera.x+playera.w)-b.x):((b.x+b.w)-playera.x);
			//b.x += b.x<playera.x?-((b.x+b.w)-playera.x):((playera.x+playera.w)-b.x);
		}
		if(ver){
			b.vspeed += playera.vspeed;
			//playera.y -= playera.vspeed;
			playera.vspeed += -playera.vspeed;
			//playera.y += playera.y<b.y?-((playera.y+playera.h)-b.y):((b.y+b.h)-playera.y);
			//b.y += b.y<playera.y?-((b.y+b.h)-playera.y):((playera.y+playera.h)-b.y);
		}
		playera.other = b;
		b.other = playera;
		return b;
	}	
}

function preciseColllision(player, b){
	if(boxCollision(player, b,1,1)){
		if(py<b.y){
			if(player.vspeed > 0)
				player.vspeed = 0;
		}
		if(px+player.s*0.5<b.x){ 
			if(player.hspeed > 0)
				player.hspeed = 0;
		}
		if(px+player.s*0.5>b.x+b.w){
			if(player.hspeed < 0)
				player.hspeed = 0;
		}
		else if(py+player.s>b.y+b.h){
			if(player.vspeed < 0)
				player.vspeed = 0;
		}
	}
}

function degToRad(deg){
	return deg * (Math.PI/180);
}

function radToDeg(rad){
	return rad / (Math.PI/180);
}

function death(){//player dies, score screen displayed
	player1.isAlive = false;
	endtimer = 30;
	stage.removeChild(player1);
	for(var i=0;i<10;i++){
		Particle(player1.x+i,player1.y+Math.random()*10,10,Math.random()*20-10,Math.random()*30-15,'rgba(180,40,40,1)',stage, false, 120);
	}
	
	var deathBox = new Shape();
	deathBox.graphics.beginFill('rgba(200,50,50,0.1)').rect(0,-20,gamewidth,90).beginFill('rgba(10,10,10,0.8)').rect(0,-3,gamewidth,56).beginFill('rgba(200,50,50,0.7)').rect(0,0,gamewidth,50);
	deathBox.x = 0;
	deathBox.y = 150;
	gui.addChild(deathBox);
	stage.update();
	endButton = false;
}

function coinExplosion(x,y){
	for(var i=0;i<10;i++){
		Particle(x+i,y+Math.random()*10,3,Math.random()*20-10,Math.random()*20-10,'rgba(200,170,30,1)',stage, false, 120);
	}
}

function boxExplosion(a,b){ //platform explosion
	for(var i=0;i<Math.ceil(a.w*0.1);i++){
		Particle(a.x+i*10,a.y+Math.random()*a.h,5,Math.random()*20-10,Math.random()*30-15,a.color,stage, true, 120);
	}
	for(var i=0;i<Math.ceil(b.w*0.1);i++){
		Particle(b.x+i*10,b.y+Math.random()*b.h,5,Math.random()*20-10,Math.random()*30-15,b.color,stage, true, 120);
	}
}

/*Array.prototype.remove = function(from, to) {
   var rest = this.slice((to || from) + 1 || this.length);
   this.length = from < 0 ? this.length + from : from;
   return this.push.apply(this, rest);
   };*/