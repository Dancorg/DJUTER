//KEYS
function handleKeyDown(e){
	if(!startButton){
		startButton = true;
		startLevel();
	}
	if(!endButton && endtimer == 0){
		endButton = true;
		startLevel();
		/*startButton = false;
		startMenu();*/
	}
	switch(e.keyCode){
		case keyup:
			player2.jump = true;
			player2.canjump = false;return false;
		case keyw:
			player1.jump = true;
			player1.canjump = false;return false;
		case keyleft:
			player2.left = true;return false;
		case keya:
			player1.left = true;return false;
		case keyright:
			player2.right = true;break;
		case keyd:
			player1.right = true;break;
	}
	
}

function handleKeyUp(e){
	switch(e.keyCode){
		case keyup:
			player2.jump = false;
			player2.jumping=0;return false;
		case keyw:
			player1.jump = false;
			player1.jumping=0;return false;
		case keyleft:
			player2.left = false;return false;
		case keya:
			player1.left = false;return false;
		case keyright:
			player2.right = false;break;
		case keyd:
			player1.right = false;break;
	}
}


// TOUCH
function handleTouchStart(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(i in touches){
		var touch = touches[i];
		if(!startButton){
		startButton = true;
			startLevel();
		}
		if(!endButton && endtimer ==0){
			endButton = true;
			startLevel();
			/*startButton = false;
			startMenu();*/
		}
		if(touch.pageX  <cw/2)left = true;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			jump = true;
			player1.canjump = false;
		}
		if(touch.pageX  >cw/2)right = true;

	}
}

function handleTouchEnd(e){
	e.preventDefault();
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var	touches = e.changedTouches;
	for(i in touches){
		var touch = touches[i];
		if(touch.pageX  <cw/2)left = false;
		if((touch.pageX  >=cw/2-50 && touch.pageX  <=cw/2+50) || touch.pageY<ch/2){
			jump = false;
			player1.jumping=0;
		}
		if(touch.pageX  >cw/2)right = false;
	}
}

//COPY OF KEYBOARD EVENTS, UPDATE IF KEYBOARD EVENTS CHANGE
function handleMouseDown(e){
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	if(!startButton){
		startButton = true;
		startLevel();
	}
	if(!endButton && endtimer == 0){                                                                                                                                                                                                                                                                                                                
		endButton = true;
		startLevel();
		/*startButton = false;
		startMenu();*/
	}
	if(e.clientX  <200+canvasx)left = true;
	if((e.clientX  >=200+canvasx && e.clientX  <=440+canvasx) || e.clientY<300+canvasY){
		jump = true;
		player1.canjump = false;
	}
	if(e.clientX  >440+canvasx)right = true;
}

function handleMouseUp(e){
	var canvasx = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	if(e.clientX  <200+canvasx)left = false;
	if((e.clientX  >=200+canvasx && e.clientX  <=440+canvasx) || e.clientY<300+canvasY){
		jump = false;
		player1.jumping=0;
	}
	if(e.clientX  >440+canvasx)right = false;

}