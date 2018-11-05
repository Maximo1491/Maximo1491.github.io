var GAME_WIDTH = 480;
var GAME_HEIGHT = 640;

var state = {
    init: init,
    preload: preload,
    update: update,
    create: create
};

var PHASER_GAME = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'container', state);
var TAXI_GAME = new TTT_GAME(PHASER_GAME);

function init()
{
    TAXI_GAME.init();
}

function preload()
{
    TAXI_GAME.preload();
}

function update()
{
    TAXI_GAME.update();
}

function create()
{
    TAXI_GAME.create();
}