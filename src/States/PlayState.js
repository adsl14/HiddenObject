var PlayState = new Kiwi.State('PlayState');

// Number of total images that the game will use
var totalObjects = 29;

// Number of total objects on screen at the beginning (this is the difficulty of the game)
var totalObjectsOnscreen = 5;

// Height of the background (display)
var heigh = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

// Width of the background (display)
var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

// Size of the original image (bg.jpg)
var heighBg = 1200;
var widthBg = 1200;

// This values will be used to put the objects on the screen
var objectPosX = width - 168; // Original --> 168
var objectPosY = heigh - 500; // Original --> 324

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

    this.addImage('bg', 'assets/img/Park&City/bg/bg.jpg');

	for(i=1; i<= totalObjects; ++i)
	{
		this.addImage('hidden_' + [i], 'assets/img/Park&City/svg/hidden_' + [i] + '.svg');
		this.addImage('UI_' + [i], 'assets/img/Park&City/png/UI_' + [i] + '.png');
	}

    this.addImage('UI_btn', 'assets/img/Park&City/png/UI_btn.png');

	// Loading the sound effects
	this.addAudio('wrong', './assets/audio/wrong.mp3');
	this.addAudio('correct', './assets/audio/correct.mp3');

	// Load the main theme
	this.addAudio('music', './assets/audio/music.mp3');
};

/**
* Since we have loaded all the graphics in the LoadingState, the we can skip adding in a preload method to this state and just  start at the create.
*
* @method create
* @public
*/
PlayState.create = function () {

    //Create our Hidden Object Arrays, This will store all of our hidden objects.
    this.hiddenObjects = [];
	this.totalObjects = 29;
    //Add bg
    this.bg = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.bg, (width/2)-(widthBg/2), (heigh/2)-(heighBg/2));
	this.bg.scaleY = heigh/heighBg;
	this.bg.scaleX = width/widthBg;
    this.addChild(this.bg);

    //Add a score
    this.scoreText = new Kiwi.GameObjects.Textfield( this, "0", width - 160, heigh - 80, "#000", 50, 'normal', 'Arial Black' );
    this.addChild( this.scoreText );
    this.scoreCount = 0;

    //Add a timer
    this.counterText = new Kiwi.GameObjects.Textfield(this, "60", width / 2, heigh - 80, "#000", 50, 'normal', 'Arial Black' );
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
    this.timerCount = 60;

	//Add a level text
	this.levelText = new Kiwi.GameObjects.Textfield( this, "Nivel: 1", 210, heigh - 120, "#000", 50, 'normal', 'Arial Black' );
	this.addChild( this.levelText );
	this.level = 1;

	// EXP BAR // This bar will be used to determine the next level
	this.nextLevelBar = new Kiwi.HUD.Widget.Bar ( this.game, 0, 5, 210, heigh - 50, 500, 15 );
	// Change the style of the bar
	this.nextLevelBar.bar.style.backgroundColor = '#1E90FF';
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

	if (this.timerCount > 0)
	{
		var opcion = Math.floor((Math.random() * totalObjects) + 1);

		//This will be used to know the preview option
		var Oldopcion = opcion;

		//This will add the real hiddenObject
		this.addHiddenObject([opcion], Math.random() * objectPosX, Math.random() * objectPosY);

		// When the player hits the counter.max correct clicks, the difficulty will increase (at the beginning is 5)
		if(this.nextLevelBar.counter.current == this.nextLevelBar.counter.max)
		{
			totalObjectsOnscreen = totalObjectsOnscreen + 3; // Increase level

			// Updating the text "Level: X"
			this.level = this.level + 1;
			this.levelText.text = "Nivel: " + this.level;

			this.nextLevelBar.counter.current = 0; // Set 0 the bar of progress
			this.nextLevelBar.counter.max = this.nextLevelBar.counter.max + 1; // The max bar of progress increases. This imitate the exp system. When you reach the next level, you'll need more exp to reach the next level.
		}

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

			this['object' + j] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['hidden_' + opcion], Math.random() * objectPosX, Math.random() * objectPosY);
			this['object' + j].input.onDown.add(this.clickWrongObject, this);
			this['object' + j].hiddenObjectNumber= Oldopcion;

			//SCALE
			//this['object' + j].transform.scale = (width/widthBg) - (heigh/heighBg); // We scale the object to the size of the screen
			this['object' + j].transform.scale = (width-800)/width; // The objects will be less large in order to get more images in the screen at the same time

			this.addChild(this['object' + j]);
		}
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
	this['hiddenObject' + objName].transform.scale = (width-800)/width; // The objects will be less large in order to get more images in the screen at the same time

    this.addChild(this['hiddenObject' + objName]);

    //UI Base of each preview button
    this['UIBase' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.UI_btn, 110 * this.hiddenObjects.length + 50, heigh - 160);
    this.addChild(this['UIBase' + objName])

    //UI preview image
    this['UIButton' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['UI_' + objName], 110 * this.hiddenObjects.length + 50, heigh - 160);
    this.addChild(this['UIButton' + objName]);

    //this.hiddenObjects.push(this['hiddenObject' + objName]);
}

PlayState.clickWrongObject = function (object) {

	if(this.timerCount > 0)
	{
		// We play the 'wrong' audio
		this.wrong.play();

		//Decrease score
		if (this.scoreCount > 0)
		{
			this.scoreCount = this.scoreCount - 5;
			this.scoreText.text = this.scoreCount;
		}

		// Decrease the increment of correct clicks.
		if (this.nextLevelBar.counter.current > 0)
			this.nextLevelBar.counter.current = this.nextLevelBar.counter.current - 1;


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

	if (this.timerCount > 0)
	{
		// We play the correct audio
		this.correct.play();

		//remove object and associated UI btn
		hiddenObj.destroy();
		this['UIBase' + hiddenObj.objName].destroy();
		this['UIButton' + hiddenObj.objName].destroy();

		// Add score
		this.scoreCount = this.scoreCount + 10;
		this.nextLevelBar.counter.current = this.nextLevelBar.counter.current + 1;
		this.scoreText.text = this.scoreCount;

		// Increase a little the time (+2)
		this.timerCount = this.timerCount + 2;
		this.counterText.text =  this.timerCount;

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
	if (this.timerCount != 0)
	{
		this.timerCount = this.timerCount - 1;
		this.counterText.text =  this.timerCount;
	}
	else
	{
		this.counterText.destroy();
		this.scoreText.destroy();
		this.outoftime = new Kiwi.GameObjects.Textfield( this, "¡Se acabó el tiempo!", width/2, heigh - 200, "#000", 60, 'normal', 'Arial Black' );
		this.addChild( this.outoftime );

		this.scoreText = new Kiwi.GameObjects.Textfield( this, "Puntuación final: " + this.scoreCount, width/2, heigh - 100, "#000", 60, 'normal', 'Arial Black' );
    		this.addChild( this.scoreText );
	}
}