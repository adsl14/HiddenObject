var myGame = new Kiwi.Game('content', 'HiddenObjectBlueprint', null, { renderer: Kiwi.RENDERER_CANVAS });
var PlayState = new Kiwi.State("PlayState");

myGame.states.addState(PlayState);
myGame.states.switchState("PlayState");

// GLOBAL VARS

// The level (stage of the game)
// Park&City --> 1
// Forest --> 2
// Landscape --> 3
// Beach --> 4
// Ocean --> 5
var level = 1;

// Height of the background (display)
var heigh = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
var auxHeigh;

// Width of the background (display)
var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
var auxWidth;

if(width > heigh)
	var sizeRef = width;
else
	var sizeRef = heigh;

// BACKGROUND
var bg;

// This values will be used to put the objects on the screen.

// For the width, the objects only will be moved between maxX and minX
var maxX = width - 300; // Original --> 168, 300
var minX = 10;

// For the height, the objects only will be moved between maxY and minY
var maxY = heigh - 300; // Original --> 324, 500
var minY = heigh/2-100;

switch(level)
{
	case 1:

		// Size of the original image (bg.jpg)
		var heighBg = 1200;
		var widthBg = 1200;

		// Number of total images that the game will use
		var totalObjects = 29;

		// Number of total objects on screen at the beginning (this is the difficulty of the game)
		var totalObjectsOnscreen = 2;

		// The scale of the objects on to screen
		var scale = 0.045;

		break;

	case 2:

		// Size of the original image (bg.jpg)
		var heighBg = 2000;
		var widthBg = 2000;

		// Number of total images that the game will use
		var totalObjects = 90;

		// Number of total objects on screen at the beginning (this is the difficulty of the game)
		var totalObjectsOnscreen = 12;

		var scale = 0.03;

		break;

	case 3:

		// Size of the original image (bg.jpg)
		var heighBg = 1300;
		var widthBg = 1300;

		// Number of total images that the game will use
		var totalObjects = 80;

		// Number of total objects on screen at the beginning (this is the difficulty of the game)
		var totalObjectsOnscreen = 22;

		var scale = 0.045;

		break;

	case 4:

		// Size of the original image (bg.jpg)
		var heighBg = 2000;
		var widthBg = 2000;

		// Number of total images that the game will use
		var totalObjects = 73;

		// Number of total objects on screen at the beginning (this is the difficulty of the game)
		var totalObjectsOnscreen = 32;

		var scale = 0.045;

		break;

	case 5:

		// Size of the original image (bg.jpg)
		var heighBg = 1300;
		var widthBg = 1300;

		// Number of total images that the game will use
		var totalObjects = 90;

		// Number of total objects on screen at the beginning (this is the difficulty of the game)
		var totalObjectsOnscreen = 42;

		var scale = 0.03;

		break;
}


/**
* The PlayState in the core state that is used in the game.
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
*
*
* @class playState
* @extends State
* @namespace Kiwi.BluePrints.HiddenObject
* @constructor
*/

/**
* This preload method is responsible for preloading all your in game assets.
* @method preload
* @private
*/
PlayState.preload = function () {

	//Make sure to call the super at the top.
	//Otherwise the loading graphics will load last, and that defies the whole point in loading them.
	KiwiLoadingScreen.prototype.preload.call(this);

    this.logo = new Kiwi.GameObjects.StaticImage(this, this.textures[ "loadingImage" ], 150, 50 );

	auxWidth = width;
	auxHeigh = heigh;

    this.game.stage.resize(width,heigh);

    // Loading the sound effects
    this.addAudio('wrong', './assets/audio/wrong.mp3');
    this.addAudio('correct', './assets/audio/correct.mp3');

    // Load the main theme
    this.addAudio('music', './assets/audio/music.mp3');

	switch (level)
	{
		case 1:

			this.addImage('bg', 'assets/img/Park&City/bg/bg.jpg');

			for(i=1; i<= totalObjects; ++i)
				this.addImage('hidden_' + [i], 'assets/img/Park&City/svg/hidden_' + [i] + '.svg');

			this.addImage('UI_btn', 'assets/img/Park&City/UI_btn.png');

			break;

		case 2:

			this.addImage('bg', 'assets/img/Forest/bg/bg.jpg');

			for(i=1; i<= totalObjects; ++i)
				this.addImage('hidden_' + [i], 'assets/img/Forest/svg/hidden_' + [i] + '.svg');

			this.addImage('UI_btn', 'assets/img/Forest/UI_btn.png');

			break;

		case 3:

			this.addImage('bg', 'assets/img/Landscape/bg/bg.jpg');

			for(i=1; i<= totalObjects; ++i)
				this.addImage('hidden_' + [i], 'assets/img/Landscape/svg/hidden_' + [i] + '.svg');

			this.addImage('UI_btn', 'assets/img/Landscape/UI_btn.png');

			break;

		case 4:

			this.addImage('bg', 'assets/img/Beach/bg/bg.jpg');

			for(i=1; i<= totalObjects; ++i)
				this.addImage('hidden_' + [i], 'assets/img/Beach/svg/hidden_' + [i] + '.svg');

			this.addImage('UI_btn', 'assets/img/Beach/UI_btn.png');

			break;

		case 5:

			this.addImage('bg', 'assets/img/Ocean/bg/bg.jpg');

			for(i=1; i<= totalObjects; ++i)
				this.addImage('hidden_' + [i], 'assets/img/Ocean/svg/hidden_' + [i] + '.svg');

			this.addImage('UI_btn', 'assets/img/Ocean/UI_btn.png');

			break;
	}

}

/**
* Since we have loaded all the graphics in the LoadingState, the we can skip adding in a preload method to this state and just  start at the create.
*
* @method create
* @public
*/
PlayState.create = function () {

    //Add bg
    bg = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.bg, (width/2)-(widthBg/2), (heigh/2)-(heighBg/2));
	bg.scaleY = heigh/heighBg;
	bg.scaleX = width/widthBg;
    this.addChild(bg);

    //Add a score
    this.scoreText = new Kiwi.GameObjects.Textfield( this, "0", width * 0.91666666, 0, "#000", width*0.026041666, 'normal', 'Arial Black' );
    this.addChild( this.scoreText );
    this.scoreCount = 0;

    //Add a timer
    this.counterText = new Kiwi.GameObjects.Textfield(this, "Tiempo: " + 120, 170, 0, "#000", width*0.026041666, 'normal', 'Arial Black' );
    this.addChild( this.counterText );

    // You can call the createTimer method on any clock to attach a timer to the clock.
    /**
    * Param 1 - Name of Timer.
    * Param 2 - Delay Between Counts.
    * Param 3 - Repeat amount. If set to -1 will repeat infinitely.
    * Param 4 - If the timer should start.
    */
    this.timer = this.game.time.clock.createTimer('tiempo', 1, -1, true);
    this.timer.createTimerEvent( Kiwi.Time.TimerEvent.TIMER_COUNT, this.onTimerCount, this );
    this.timerCount = 120;

	//Add a level text
    this.progres = new Kiwi.GameObjects.Textfield( this, "Progreso:", 175, width * 0.03125, "#000", width*0.026041666, 'normal', 'Arial Black' );
    this.addChild(this.progres);
    this.levelText = new Kiwi.GameObjects.Textfield( this, "0/25", 170, width * 0.0625, "#000", width*0.015625, 'normal', 'Arial Black' );
	this.addChild( this.levelText );

	// EXP BAR // This bar will be used to determine the next level
	this.nextLevelBar = new Kiwi.HUD.Widget.Bar (this.game, 0, 25, width*0.138020833, 143, width*0.260416666, width*0.0078125 );

	// Change the style of the bar
	switch (level)
	{
		case 1:

			this.nextLevelBar.bar.style.backgroundColor = '#1E90FF';

			break;

		case 2:

			this.nextLevelBar.bar.style.backgroundColor = "#5f2302";

			break;

		case 3:

			this.nextLevelBar.bar.style.backgroundColor = "#169a22";

			break;

		case 4:

			this.nextLevelBar.bar.style.backgroundColor = "#00e4f2";

			break;

		case 5:

			this.nextLevelBar.bar.style.backgroundColor = "#043ee5";

			break;
	}

	// Change the style of the HUD object
	this.nextLevelBar.style.backgroundColor = '#C0C0C0';
	this.nextLevelBar.style.boxShadow = '5px 5px 10px #000';
	this.game.huds.defaultHUD.addWidget( this.nextLevelBar );

	// MUSIC
	// We create the audios
	this.correct = new Kiwi.Sound.Audio(this.game, 'correct', 1, false); //false = replay audio. true = no replay audio
	this.wrong = new Kiwi.Sound.Audio(this.game, 'wrong', 1, false);

	// Playing the main song
	this.music = new Kiwi.Sound.Audio(this.game, 'music', 1, true);

	// Plays the music.
	this.music.play();

	//Add all the hidden objects and their corresponding UI preview images. Give the item random coordinates but inside of the game space.
	this.addObjects();

}

/**
 * This method adds all objects onto the game. Also, the real hidden object
 *
 * @method addObjects
 */

PlayState.addObjects = function () {

	if (25 != this.nextLevelBar.counter.current && this.timerCount > 0)
	{
		var opcion = Math.floor((Math.random() * totalObjects) + 1);

		//This will be used to know the preview option
		var Oldopcion = opcion;

		// When the player hits the 5, 10 or 15 correct clicks, the difficulty will increase
		if(this.nextLevelBar.counter.current%6 == 0 && this.nextLevelBar.counter.current != 0)
			totalObjectsOnscreen = totalObjectsOnscreen + 2; // Increase level

		// Now each increase will be the same (would be very boring in high levels i think, so i comment this line)
		//this.nextLevelBar.counter.max = this.nextLevelBar.counter.max + 1; // The max bar of progress increases. This imitate the exp system. When you reach the next level, you'll need more exp to reach the next level.

		//This 'for' will add all the objects excepts the hidden one
		for (j = 1; j <= totalObjectsOnscreen-1; ++j)
		{
			do
			{
				opcion = Math.floor((Math.random() * totalObjects) + 1);

			}while(Oldopcion == opcion);

			// Check if the object was created before and delete it
			if (this['object' + j])
				this['object' + j].destroy();

			this['object' + j] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['hidden_' + opcion], Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY);

			// UNCOMMENT THIS IF YOU WANT TO PENALIZE!!!
			//this['object' + j].input.onDown.add(this.clickWrongObject, this);
			this['object' + j].hiddenObjectNumber= Oldopcion;

			//SCALE
			//this['object' + j].transform.scale = (width/widthBg) - (heigh/heighBg); // We scale the object to the size of the screen
			this['object' + j].transform.scale = (sizeRef*scale/177); // The objects will be less large in order to get more images in the screen at the same time

			this.addChild(this['object' + j]);
		}

		//This will add the real hiddenObject
		this.addHiddenObject([Oldopcion], Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY);
	}
}

/**
* This method adds a new hidden object and its preview image onto the game.
*
* @method addHiddenObject
* @public
* @param objName{String}
* @param objX{Number}
* @param objY{Number}
*/
PlayState.addHiddenObject = function (objName, objX, objY) {

    //Object hidden on the stage
    this['hiddenObject' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['hidden_' + objName], objX, objY);
    this['hiddenObject' + objName].objName = objName;
    this['hiddenObject' + objName].input.onDown.add(this.clickObject, this);

	//this['hiddenObject' + objName].transform.scale = (width/widthBg) - (heigh/heighBg); // We scale the object to the size of the screen
	this['hiddenObject' + objName].transform.scale = (sizeRef*scale/177); // The objects will be less large in order to get more images in the screen at the same time
    this.addChild(this['hiddenObject' + objName]);

    //UI Base of each preview button
    this.UIBase = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.UI_btn,10,10); // 50, heigh - 160
    this.addChild(this.UIBase);

    //UI preview image
    this['UIButton' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['hidden_' + objName]);

	// We calculate and scale the new preview sprite and put it into the square box. This 'if' will be used to scale perfectly the new size of the sprite.
	if(this['UIButton' + objName].width > this['UIButton' + objName].height)
	{
		this['UIButton' + objName].scaleX = 150 / this['UIButton' + objName].width;
		this['UIButton' + objName].x = (-((this['UIButton' + objName].width/2)-75)) + 10; // The first one will move the sprite witch has a new scale to the original place (x=0,y=0). The second one (+50) will move the sprite

		this['UIButton' + objName].scaleY = this['UIButton' + objName].scaleX;
		this['UIButton' + objName].y = (-((this['UIButton' + objName].height/2)-75)) + (10); // (heigh - 160)
	}
	else
	{
		this['UIButton' + objName].scaleY = 150 / this['UIButton' + objName].height;
		this['UIButton' + objName].y = (-((this['UIButton' + objName].height/2)-75)) + (10); // (heigh - 160)

		this['UIButton' + objName].scaleX = this['UIButton' + objName].scaleY;
		this['UIButton' + objName].x = (-((this['UIButton' + objName].width/2)-75)) + 10;
	}

	this.addChild(this['UIButton' + objName]);

    //this.hiddenObjects.push(this['hiddenObject' + objName]);
}

PlayState.clickWrongObject = function (object) {

	if(25 != this.nextLevelBar.counter.current && this.timerCount > 0)
	{
		// We play the 'wrong' audio
		this.wrong.play();

		//Decrease score
		if (this.scoreCount > 0)
		{
			this.scoreCount = this.scoreCount - 5;
			this.scoreText.text = this.scoreCount;
		}

		//If the real hidden object was created before, then this will delete it
		if (this['hiddenObject' + object.hiddenObjectNumber])
		{
			this['hiddenObject' + object.hiddenObjectNumber].destroy();
			this['UIBase' + object.hiddenObjectNumber].destroy();
			this['UIButton' + object.hiddenObjectNumber].destroy();
		}

		this.addObjects(totalObjects);
	}

}

/**
* This method removes located object from the background image and UI, for when they have found a image and reset the objects.
*
* @method clickObject
* @public
* @param hiddenObj{Sprite}
*/
PlayState.clickObject = function (hiddenObj) {

	if (25 != this.nextLevelBar.counter.current && this.timerCount > 0)
	{
		// We play the correct audio
		this.correct.play();

		//remove object and associated UI btn
		hiddenObj.destroy();
		this.UIBase.destroy();
		this['UIButton' + hiddenObj.objName].destroy();

		// Add score
		this.scoreCount = this.scoreCount + 10;
        this.scoreText.text = this.scoreCount;

        // Updating bar
        this.nextLevelBar.counter.current = this.nextLevelBar.counter.current + 1;

        // Updating the text "0/25"
        this.levelText.text = this.nextLevelBar.counter.current + "/25";

		// Increase a little the time (+2)
		this.timerCount = this.timerCount + 2;
		this.counterText.text =  "Tiempo: " + this.timerCount;

		// Adding again the new objects with new positions
		this.addObjects();
	}

}

/**
* This method decrease the time
*
* @method onTimerCount
* @public
*/
PlayState.onTimerCount = function () {

	// We will stop the game when the player finish it
	if (25 != this.nextLevelBar.counter.current && this.timerCount != 0)
	{
		this.timerCount = this.timerCount - 1;
		this.counterText.text =  "Tiempo: " + this.timerCount;
	}
	else
	{
	    this.levelText.destroy();
	    this.progres.destroy();
        this.game.huds.hideHUD();
		this.counterText.destroy();
		this.scoreText.destroy();

		if(this.limitLevel != this.level)
			this.outoftime = new Kiwi.GameObjects.Textfield( this, "¡Nivel no completado!", (width/2), 0, "#000", 40, 'normal', 'Arial Black' );
		else if(this.timerCount == 0)
			this.outoftime = new Kiwi.GameObjects.Textfield( this, "¡Se acabó el tiempo!", (width/2), 0, "#000", 40, 'normal', 'Arial Black' );
		else
			this.outoftime = new Kiwi.GameObjects.Textfield( this, "¡Nivel completado!", (width/2), 0, "#000", 40, 'normal', 'Arial Black' );

		this.addChild( this.outoftime );

		this.finalscore = (this.timerCount*5)+this.scoreCount;
		this.addChild( new Kiwi.GameObjects.Textfield( this, "Tiempo: " + this.timerCount + " segundos", (width/2), 40, "#000", 40, 'normal', 'Arial Black' ));
		this.addChild( new Kiwi.GameObjects.Textfield( this, "Puntuación final: " + this.finalscore + " puntos", width/2, 80, "#000", 40, 'normal', 'Arial Black'));
	}
}

/**
 * This method verify the size of the screen every time and fix it
 *
 * @method update
 * @public
 */
PlayState.update = function ()
{
	Kiwi.State.prototype.update.call(this);

	// Height of the background (display)
	var heigh = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		// Width of the background (display)
	var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	// We will verify if the screen has changed and then, we will fix all the images
	if(auxHeigh != heigh || auxWidth != width)
	{
		// This values will be used to put the objects on the screen.
		// For the width, the objects only will be moved between maxX and minX
		var auxMaxX = maxX;
		maxX = width - 300; // Original --> 168, 300
		minX = 10;

		// For the height, the objects only will be moved between maxY and minY
		var auxMaxY = maxY;
		var auxMinY = minY;
		maxY = heigh - 300; // Original --> 324, 500
		minY = heigh/2-100;


		this.scoreText.fontSize = width * 0.026041666;
		this.scoreText.transform.x = width * 0.91666666;

		this.counterText.fontSize = width * 0.026041666;
		//this.counterText.transform.x = width * (0.088541666);

		this.progres.fontSize = width * 0.026041666;
		//this.progres.transform.x = width * 0.091145833;
		this.progres.transform.y = width * 0.03125;

		this.levelText.fontSize = width * 0.015625;
		//this.levelText.transform.x = width * 0.088541666;
		this.levelText.transform.y = width * 0.0625;

		this.nextLevelBar.width = width * 0.260416666;
		this.nextLevelBar.height = width * 0.0078125;
		this.nextLevelBar.y = width * 0.074479166;
		//this.nextLevelBar.x = width * 0.127604166;


		// This will scale the objects to the new size of the screen
		if(width > heigh)
			sizeRef = width;
		else
			sizeRef = heigh;

		// This will scale and move the object to the new screen which has a new size
		for (j = 1; j <= totalObjectsOnscreen-1; ++j)
		{
			// First, we get the random pos of each image, and then we will do the exact thing before; get a new position for the images
			this['object' + j].transform.x = (this['object' + j].transform.x/(((auxMaxX)-minX)+minX)) * ((maxX-minX)+minX);
			this['object' + j].transform.y = (this['object' + j].transform.y/(((auxMaxY)-auxMinY)+auxMinY)) * ((maxY-minY)+minY);
			this['object' + j].transform.scale = (sizeRef*scale/177);
		}

		this['hiddenObject' + this['object' + 1].hiddenObjectNumber].transform.y = (this['hiddenObject' + this['object' + 1].hiddenObjectNumber].transform.y/(((auxMaxY)-auxMinY)+auxMinY)) * ((maxY-minY)+minY);
		this['hiddenObject' + this['object' + 1].hiddenObjectNumber].transform.x = (this['hiddenObject' + this['object' + 1].hiddenObjectNumber].transform.x/(((auxMaxX)-minX)+minX)) * ((maxX-minX)+minX);
		this['hiddenObject' + this['object' + 1].hiddenObjectNumber].transform.scale = (sizeRef*scale/177);


		// We update our aux height and width
		auxHeigh = heigh;
		auxWidth = width;

		// We scale the game screen
		this.game.stage.resize(width,heigh);

		//We scale the background with the new size of the screen
		bg.transform.x = (width/2)-(widthBg/2);
		bg.transform.y = (heigh/2)-(heighBg/2);
		bg.transform.scaleX = width/widthBg;
		bg.transform.scaleY = heigh/heighBg;
	}
}