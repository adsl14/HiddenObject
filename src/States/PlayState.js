var PlayState = new Kiwi.State('PlayState');

// Number of total images that the game will use
var totalObjects = 5;

// Number of total objects on screen (this is the difficulty of the game)
var totalObjectsOnscreen = 10;

// This variable will be used to save the preview option (the hidden object selected)
var Oldopcion;


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

    this.addImage('bg', 'assets/img/bg.png');

	for(i=1; i<= totalObjects; ++i)
	{
		this.addImage('hidden_' + [i], 'assets/img/hidden_' + [i] + '.png');
		this.addImage('UI_' + [i], 'assets/img/UI_' + [i] + '.png');
	}

    this.addImage('UI_btn', 'assets/img/UI_btn.png');
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

    //Add bg
    this.bg = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.bg, 0, 0);
    this.addChild(this.bg);

    //Add a score
    this.scoreText = new Kiwi.GameObjects.Textfield( this, "Puntuación: 0", 550, 980, "#000", 32, 'normal', 'Impact' );
    this.addChild( this.scoreText );
    this.scoreCount = 0;

    //Add a timer
    this.counterText = new Kiwi.GameObjects.Textfield(this, "Tiempo: 60", 320, 980, "#000", 32, 'normal', 'Impact' );
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

	//Add all the hidden objects and their corresponding UI preview images. Give the item random coordinates but inside of the game space.
	this.addObjects(totalObjects);

}

/**
 * This method adds all objects onto the game. Also, the real hidden object
 *
 * @method addHiddenObject
 */

PlayState.addObjects = function (totalObjects) {

	if (this.timerCount > 0)
	{
		var opcion = Math.floor((Math.random() * totalObjects) + 1);

		//This will be used to know the preview option
		Oldopcion = opcion;

		//This will add the real hiddenObject
		this.addHiddenObject([opcion], Math.random() * 600, Math.random() * 700);

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

			this['object' + j] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['hidden_' + opcion], Math.random() * 600, Math.random() * 700);
			this['object' + j].input.onDown.add(this.clickWrongObject, this);
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
    this.addChild(this['hiddenObject' + objName]);

    //UI Base of each preview button
    this['UIBase' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures.UI_btn, 110 * this.hiddenObjects.length + 50, 900);
    this.addChild(this['UIBase' + objName])

    //UI preview image
    this['UIButton' + objName] = new Kiwi.GameObjects.Sprite(PlayState, PlayState.textures['UI_' + objName], 110 * this.hiddenObjects.length + 50, 900);
    this.addChild(this['UIButton' + objName]);

    //this.hiddenObjects.push(this['hiddenObject' + objName]);
}

PlayState.clickWrongObject = function (object) {

	if(this.timerCount > 0)
	{
		//Decrease score
		if (this.scoreCount > 0)
		{
			this.scoreCount = this.scoreCount - 5;
			this.scoreText.text = "Puntuación: " + this.scoreCount;
		}

		//If the real hidden object was created before, then this will delete it
		if (this['hiddenObject' + Oldopcion])
		{
			this['hiddenObject' + Oldopcion].destroy();
			this['UIBase' + Oldopcion].destroy();
			this['UIButton' + Oldopcion].destroy();
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
		//remove object and associated UI btn
		hiddenObj.destroy();
		this['UIBase' + hiddenObj.objName].destroy();
		this['UIButton' + hiddenObj.objName].destroy();

		// Add score
		this.scoreCount = this.scoreCount + 10;
		this.scoreText.text = "Puntuación: " + this.scoreCount;

		// Adding again the new objects with new positions
		this.addObjects(totalObjects);

		// Reset the game and continue
		allFound = true;
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
		this.counterText.text =  "Tiempo: " + this.timerCount;
	}
	else
	{
		this.counterText.destroy();
		this.scoreText.destroy();
		this.outoftime = new Kiwi.GameObjects.Textfield( this, "¡Se acabó el tiempo!", 150, 420, "#000", 60, 'normal', 'Impact' );
		this.addChild( this.outoftime );

		this.scoreText = new Kiwi.GameObjects.Textfield( this, "Puntuación final: " + this.scoreCount, 150, 490, "#000", 60, 'normal', 'Impact' );
    		this.addChild( this.scoreText );
	}
}
