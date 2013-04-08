
var canvas;
var stage;

var player1;
var player2;
var players;
var boxes;
var particles;
var coins;

var keyup = 38;
var keyleft = 37;
var keyright = 39;
var keydown = 40;
var keyintro = 13;
var keyw = 87;
var keya = 65;
var keyd = 68;
var keys = 83;
var keyspace = 83;
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
document.ontouchleave = handleTouchEnd;
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;*/
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function reset(){
	stage.removeAllChildren();
	boxes = [];
	players = [];
	particles = [];
	coins = [];
	score1 = 0;	
	score2 = 0;
	boxSpawn = 0;
	diff = 0;
	endtimer = -1;
	maincounter=0;
}

function resizeCanvas(){
	var cwidth = $('#screen').width();
	var cheight = $('#screen').height();
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
	var startBox = new Shape();
	startBox.graphics.beginFill('rgba(120,180,250,1)').rect(0,-8,gamewidth,86).beginFill('rgba(220,120,10,0.9)').rect(0,0,gamewidth,70);
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
	background = new Shape();
	background.graphics.beginRadialGradientFill(["#112","#27B"],[0.1,0.9],gamewidth/2,gameheight/2,50,gamewidth/2,gameheight/2,600).rect(0,0,gamewidth,gameheight);
	background.cache(0,0,gamewidth,gameheight);
	stage.addChild(background);
	ene = Enemy(50,50,stage, 2);
	ene1 = Enemy(30,50,stage, 2);
	ene2 = Enemy(50,30,stage, 2);
	ene3 = Enemy(80,50,stage, 2);
	ene4 = Enemy(50,80,stage, 2);
	/*player1 = new Player("Player 1", gamewidth/2-100, 60,"40,180,250", stage);
	player1.vspeed = 0;*/
	player2 = new Player("Player 2", gamewidth/2+100, 60+200,"250,180,40", stage);
	player2.vspeed = 0;
	player1 = ene;
	ene.assumeControl();
	players = [ player2,ene,ene1,ene2,ene3,ene4];
	
	
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
	scoreBack = new Shape();
	scoreBack.graphics.beginFill('rgba(50,180,250,0.35)').drawRoundRectComplex(0,0,150,50,0,0,30,0).drawRoundRectComplex(gamewidth-150,0,150,50,0,0,0,30)//.rect(0,0,150,30);
	gui.addChild(scoreBack, scoreText1, scoreText2, energyText1, energyText2);		
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
	
	for(i in particles){
		var part = particles[i];
		part.x += part.hspeed;
		part.y += part.vspeed;
		part.hspeed *= 0.9;
		part.vspeed *= 0.9;
		part.alpha -= 1/120;
		part.timer--;
		part.glow.x = part.x;
		part.glow.y = part.y;
		part.glow.alpha -= 1/480;
		part.glow.alpha+=Math.random()*0.1-0.05;
		if(part.timer <=0 ){
			particles.splice(i,1);
			stage.removeChild(part.glow);
			stage.removeChild(part);
		}

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
	for(i in players){
		var p = players[i];
		p.update();
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

function boxCollision(a,b){
	var choque="none";
	var div = Math.max(Math.abs(a.hspeed), Math.abs(a.vspeed));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = a.x + i*a.hspeed/div;
		py = a.y + i*a.vspeed/div;
		if(a.x+i*a.hspeed/div < b.x+b.w && a.x+a.w+i*a.hspeed/div > b.x && a.y+i*a.vspeed/div<b.y+b.h && a.y+a.h+i*a.vspeed/div>b.y ){
			return true;
		}
	}
	return false;
}


function playerColllision(playera, b){
	if(boxCollision(playera, b)){
		b.vspeed += playera.vspeed;
		playera.y -= playera.vspeed;
		playera.vspeed += -playera.vspeed;

		b.hspeed += playera.hspeed;
		playera.x -= playera.hspeed;
		playera.hspeed += -playera.hspeed;
	}
}

function preciseColllision(player, b){
	var choque;
	if(boxCollision(player, b)){
		if(py<b.y)
			choque = "floor";
		else if(px+player.s*0.5<b.x) 
			choque = "lwall";
		else if(px+player.s*0.5>b.x+b.w)
			choque = "rwall";
		else if(py+player.s>b.y+b.h && b.speed-player.vspeed>0)
			choque = "ceiling";
	}
	
	switch(choque){
		case "floor":
			if(player.vspeed>0)
				player.vspeed = 0;
			break;
		case "ceiling":
			if(player.vspeed<0)
				player.vspeed = 0;
			break;
		case "lwall":
			if(player.hspeed>0)
				player.hspeed = 0;
			break;
		case "rwall":
			if(player.hspeed<0)
				player.hspeed = 0;
			break;
	}
}


function death(){//player dies, score screen displayed
	player1.isAlive = false;
	endtimer = 30;
	stage.removeChild(player1);
	for(var i=0;i<10;i++){
		Particle(player1.x+i,player1.y+Math.random()*10,10,Math.random()*20-10,Math.random()*30-15,'rgba(180,40,40,1)',stage);
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
		Particle(x+i,y+Math.random()*10,3,Math.random()*20-10,Math.random()*20-10,'rgba(200,170,30,1)',stage, false);
	}
}

function boxExplosion(a,b){ //platform explosion
	for(var i=0;i<Math.ceil(a.w*0.1);i++){
		Particle(a.x+i*10,a.y+Math.random()*a.h,5,Math.random()*20-10,Math.random()*30-15,a.color,stage, true);
	}
	for(var i=0;i<Math.ceil(b.w*0.1);i++){
		Particle(b.x+i*10,b.y+Math.random()*b.h,5,Math.random()*20-10,Math.random()*30-15,b.color,stage, true);
	}
}

/*Array.prototype.remove = function(from, to) {
   var rest = this.slice((to || from) + 1 || this.length);
   this.length = from < 0 ? this.length + from : from;
   return this.push.apply(this, rest);
   };*/