let startScreen = null;
let gameStarted = false;
let snake = {
    direction: 'up',
    length: 1
}

function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent('app');
    startScreen = document.getElementById('start-button');
    startScreen.querySelector('button').onclick = start;
}

function draw() {
    if (gameStarted) {

    }

}

function drawGrid() {
}

function start() {
    startScreen.classList.add('wink-out');
    // start sequence
    let timer = 3;
    fill(255);
    setTimeout(function() {
        text(timer, 10, 30);
    }, 1000)
}
