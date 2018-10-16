let startButton = null;
let gameInProgress = false;
let snake = null;
let spacer = 20;

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('app');
    startButton = document.getElementById('startButton');
    startButton.onclick = start;
    frameRate(10);
}

function draw() {
    if (!gameInProgress) return;

    if (snake.check()) {
        clear();
        drawGrid();
        snake.draw();
        snake.move();
    }
}

function drawGrid() {
    stroke(50);
    for (let x = spacer; x < width; x += spacer) {
        line(x, 0, x, width);
    }
    for (let y = spacer; y < height; y += spacer) {
        line(0, y, height, y);
    }
}

function Snake(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = 'up';
    this.length = 1;
    this.speed = 1;

    this.check= function() {
        if (this.y < 0 ||
            this.y > height - this.size ||
            this.x < 0 ||
            this.x > width - this.size) {

            triggerLoss();
            return false;
        }
        return true;
    }

    this.draw = function() {
        noStroke();
        fill(255);
        rect(this.x, this.y, this.size, this.size);
    },

    this.move = function() {
        switch (this.direction) {
            case 'up':
                this.y -= this.size;
                break;
            case 'down':
                this.y += this.size;
                break;
            case 'left':
                this.x -= this.size;
                break;
            case 'right':
                this.x += this.size;
                break;
        }
    }
}

function start() {
    snake = new Snake(snap(width/2), snap(height/2), spacer);
    startButton.classList.add('wink-out');
    setTimeout(function() {
        startButton.style.display = 'none';
        gameInProgress = true;
    }, 1500);
}

function triggerLoss() {
    gameInProgress = false;
    startButton.innerHTML = 'TRY AGAIN';
    startButton.style.display = 'inline-block';
    startButton.classList.remove('wink-out');
}

function keyPressed() {
    switch (keyCode) {
        case UP_ARROW:
            snake.direction = 'up';
            break;
        case DOWN_ARROW:
            snake.direction = 'down';
            break;
        case LEFT_ARROW:
            snake.direction = 'left';
            break;
        case RIGHT_ARROW:
            snake.direction = 'right';
            break;
    }

    return false;
}

// Utilities
function snap(val, spacing = spacer) {
    return spacing * Math.round(val/spacing);
}
