var game = new Phaser.Game(800, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create});
var myText = null;
var sprite = null;

function preload() {
  game.load.image("rabbit", "images/rabbit.png");
}

function create() {
  this.client = new Client();
  this.client.openConnection();
  myText = game.add.text(0, 0, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
  sprite = game.add.sprite(100, 100, "rabbit");
  sprite.inputEnabled = true;
  sprite.input.enableDrag(false, true);
  sprite.events.onDragStop.add(rabbitDragged, this);
  game.stage.disableVisibilityChange = true;
}

function rabbitDragged() {
  if (this.client.connected) {
    this.client.ws.send(JSON.stringify({x: sprite.x, y: sprite.y}));
  }
}
