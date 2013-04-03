
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
var keyw = 87;
var keya = 65;
var keyd = 68;
var left = 0;
var right = 0;
var jump = 0;
var gui;
var startButton = false;
var endButton = true;
var boxSpawn;
var diff;
var score1;
var score2;
var endtimer;
var maincounter;
var cw;  // canvas width
var ch;  // canvas height

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
	if(cwidth < 640 || cheight < 480){
		switchFullscreen();
		var minim = Math.min(cwidth,cheight*(4/3));
		var w = cwidth*(minim/cwidth);
		var h = cheight*(minim/((4/3)*cheight));
		$("#canvas").css({'width':w});
		$("#canvas").css({'height':h});
	}
	else{
		$("#canvas").css({'width':'640px'});
		$("#canvas").css({'height':'480px'});
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
	startBox.graphics.beginFill('rgba(120,180,250,1)').rect(0,-8,640,86).beginFill('rgba(220,120,10,0.9)').rect(0,0,640,70);
	startBox.x=0;
	startBox.y=150;
	stage.addChild(startBox);
	var startText = new Text("DJUTER", "45px impact", "#EEF");
	startText.textAlign = "center";
	startText.x = 300;
	startText.y = 155;
	stage.addChild(startText);
	var startText2 = new Text("press any key to continue", "10px Arial", "#EEF");
	startText2.textAlign = "center";
	startText2.x = 320;
	startText2.y = 400;
	stage.addChild(startText2);
	stage.update();
	
}

function startLevel(){
	reset();
	Ticker.setPaused(false);
	background = new Shape();
	background.graphics.beginRadialGradientFill(["#112","#27B"],[0.1,0.9],320,240,50,320,240,600).rect(0,0,640,480);
	background.cache(0,0,640,480);
	stage.addChild(background);
	
	player1 = new Player("Player 1", 320, 100,"40,180,250", stage);
	player1.vspeed = 0;
	player2 = new Player("Player 2", 320, 100,"250,180,40", stage);
	player2.vspeed = 0;
	players = [player1, player2];
	
	gui = new Container();
	scoreText1 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText1.x = 10;
	scoreText1.y = 5;
	scoreText2 = new Text("SCORE: ", "17px impact", "#AFF");
	scoreText2.x = 640 - 140;
	scoreText2.y = 5;
	scoreBack = new Shape();
	scoreBack.graphics.beginFill('rgba(50,180,250,0.35)').drawRoundRectComplex(0,0,150,30,0,0,30,0).drawRoundRectComplex(640-150,0,150,30,0,0,0,30)//.rect(0,0,150,30);
	gui.addChild(scoreBack, scoreText1,scoreText2);		
	stage.addChild(gui);
	Box(300,120,60,15,stage,"up");
}

function tick(){
	maincounter++;
	if (endtimer > 0)endtimer--;
	diff += 0.0002;
	scoreText1.text = "SCORE1: " + score1;
	scoreText2.text = "SCORE2: " + score2;
	stage.setChildIndex(gui,0);
	
	for(i in boxes){
		var box = boxes[i];
		box.y+=box.speed; //move the box

		if(box.y>480+box.h){
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
		part.vspeed += 0.1;
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
			coinExplosion(c.x,c.y);
			coins.splice(i,1);
			stage.removeChild(c);
		}		
	}
	for(i in players){
		var p = players[i];
		p.update();
	}
	if(boxSpawn <= 0){
		platformSpawner();
		boxSpawn = 20-10*(Math.sin(diff));
	}
	else
		boxSpawn--;
	
	stage.update();
	
}

function platformSpawner(){
	var x,y,w,h;
	if(Math.round(Math.random()*5)==0){
		Coin(Math.round(Math.random()*640),-10,stage);
	}
	h = Math.round(Math.random()*30+8);
	y = -h;
	w = Math.round(Math.random()*(40*(8*diff/(1+diff)))+20-(16*(diff/(1+diff))));
	x = Math.round(320+Math.sin(maincounter*diff)*320) - w/2;
	Box(x,y,w,h, stage);

	Math.random();
}

function preciseColllision(player1, b){
	var choque="none"; //by default
	var div = Math.max(Math.abs(player1.hspeed), Math.abs(player1.vspeed));
	if(div == 0)div = 1;
	for(var i=0; i<div; i++){
		px = player1.x + i*player1.hspeed/div;
		py = player1.y + i*player1.vspeed/div;
		if(player1.x+i*player1.hspeed/div < b.x+b.w && player1.x+player1.s+i*player1.hspeed/div > b.x && player1.y+i*player1.vspeed/div<b.y+b.h && player1.y+player1.s+i*player1.vspeed/div>b.y ){
			if(py<b.y)
				choque = "floor";
			else if(px+player1.s*0.5<b.x) 
				choque = "lwall";
			else if(px+player1.s*0.5>b.x+b.w)
				choque = "rwall";
			else if(py+player1.s>b.y+b.h && b.speed-player1.vspeed>0)
				choque = "ceiling";
			break;
		}
	}
	
	switch(choque){
		case "floor":
			player1.canjump = true;
			player1.onfloor = true;
			player1.vspeed = b.speed;
			player1.y = b.y-player1.s;
			break;
		case "ceiling":
			player1.vspeed = b.speed;//*1.1
			player1.jumping = 0;
			if(player1.onfloor)death();
			break;
		case "lwall":
			if(player1.hspeed>0)
				player1.hspeed = 0;
			//player.canjump = false;
			break;
		case "rwall":
			if(player1.hspeed<0)
				player1.hspeed = 0;
			//player.canjump = false;
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
	deathBox.graphics.beginFill('rgba(200,50,50,0.1)').rect(0,-20,640,90).beginFill('rgba(10,10,10,0.8)').rect(0,-3,640,56).beginFill('rgba(200,50,50,0.7)').rect(0,0,640,50);
	deathBox.x = 0;
	deathBox.y = 150;
	gui.addChild(deathBox);
	/*var deathText = new Text("YOR DED!.... SCORE: " + score, "30px Impact", "#FFF");
	deathText.textAlign = "center";
	deathText.x = 320;
	deathText.y = 156;
	gui.addChild(deathText);*/
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
