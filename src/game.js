
/**
* The core HiddenObject blueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/


//Initialise the Kiwi Game. 
var game = new Kiwi.Game('content', 'HiddenObjectBlueprint', null, { renderer: Kiwi.RENDERER_CANVAS });

//Add all the States we are going to use.
game.states.addState(LoadingState);
game.states.addState(IntroState);
game.states.addState(PlayState);

//Switch to/use the Preloader state. 
game.states.switchState("LoadingState");