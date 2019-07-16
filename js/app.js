// Enemy variables
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.sprite = 'images/enemy-bug.png';
};

// Enemy's position
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x >= 505) {
        this.x = 0;
    }
    this.checkCollision();
};

// Enemy draw
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Collision with player
Enemy.prototype.checkCollision = function() {
    if (player.y + 131 >= this.y + 90 &&
        player.y + 73 <= this.y + 135 &&
        player.x + 25 <= this.x + 88 &&
        player.x + 76 >= this.x + 11) {
        console.log('collision');
        gameReset();
    }
};

// Player class
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
};

// Method for Player
Player.prototype.update = function() {};

// Renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Input for the player
Player.prototype.handleInput = function(key) {
    if (key == 'left') {
        this.x = (this.x - this.speed + 505) % 505;
    } else if (key == 'right') {
        this.x = (this.x + this.speed) % 505;
    } else if (key == 'up') {
        this.y = (this.y - this.speed + 606) % 606;
        // going to water
        if (this.y <= (83 - 48)) { // line 135 engine.js
            // assuming 48 to be player height
            gameOver();
            return;
        }
    } else {
        this.y = (this.y + this.speed) % 606;
        if (this.y > 400) { // bottom limit
            this.y = 400;
        }
    }
    // x axis wrap
    if (this.x < 2.5) {
        this.x = 2.5;
    }
    if (this.x > 458) {
        this.x = 458;
    }
};

// Resets the player to default position
Player.prototype.reset = function() {
    this.x = 202.5;
    this.y = 383;
};

// Objects
var allEnemies = [];
var player = new Player(0, 0, 50);
var scoreDiv = document.createElement('div');
gameReset(); // setup defaults
var canvasDiv = document.getElementsByTagName('canvas')[0];
document.body.insertBefore(scoreDiv, canvasDiv);

// This listens for key presses and sends the keys player
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Increase enemies by score
var score = 0;

/*
 * resets the game in case of collision
 */
function gameReset() {
    player.reset();
    score = 0;
    updateDisplay();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, Math.random() * 150 + 50, Math.random() * 100 + 40),
        new Enemy(0, Math.random() * 150 + 70, Math.random() * 100 + 60)
    );
}

// Game over successfully (reached water)
function gameOver() {
    player.reset();
    score += 1;
    updateDisplay();
    if (score % 2 == 0 && allEnemies.length < 4) {
        allEnemies.push(new Enemy(0, Math.random() * 160 + 50, Math.random() * 90 + 70));
    }
}

// Updates the on screen score display
function updateDisplay() {
    scoreDiv.innerHTML = 'Score ' + score;
}
