function Client() {

}

Client.prototype.openConnection = function() {
  this.ws = new WebSocket("ws://127.0.0.1:8080");
  this.connected = false;
  this.ws.onmessage = this.onMessage.bind(this);
  this.ws.onerror = this.displayError.bind(this);
  this.ws.onopen = this.connectionOpen.bind(this);
};

Client.prototype.connectionOpen = function() {
  this.connected = true;
  //myText.text = 'connected\n';
};

Client.prototype.onMessage = function(message) {
  //myText.text = myText.text + message.data;
  //var msg = JSON.parse(message.data);
  //sprite.x = msg.x;
  //sprite.y = msg.y;
  var msg = JSON.parse(message.data);
  for (var key in msg) {
    if (key in players) {
      players[key].x = msg[key].x;
      players[key].y = msg[key].y;
    } else {
      players[key] = game.add.sprite(48, 48, 'player', 1);
      players[key].x = msg[key].x;
      players[key].y = msg[key].y;
    }
  }

};

Client.prototype.displayError = function(err) {
  console.log('Websocketerror: ' + err);
};


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/catastrophi_tiles_16.png');
    game.load.spritesheet('player', 'assets/spaceman.png', 16, 16);

}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var map;
var layer;
var cursors;
var players= {};
var id = guid();
players[id] = {};
var player=players[id];

function create() {
	
	 this.client=new Client();
	 this.client.openConnection();

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 16, 16);

    //  Now add in the tileset
    map.addTilesetImage('tiles');
    
    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();

    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    //  Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [8,9], 10, true);
    player.animations.add('right', [1,2], 10, true);
    player.animations.add('up', [11,12,13], 10, true);
    player.animations.add('down', [4,5,6], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(10, 14, 2, 1);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var help = game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
    help.fixedToCamera = true;

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else
    {
        player.animations.stop();
    }
    
    if (this.client.connected){
			this.client.ws.send(JSON.stringify({
				uuid: id,
				x: player.x,
				y: player.y
				}));
    
    }

}

function render() {

    // game.debug.body(player);

}