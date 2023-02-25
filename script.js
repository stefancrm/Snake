const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 5;
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = tileCount / 2;
let headY = tileCount / 2;
const snakeParts = [];
let tailLength = 2;

let score = 0;
let oldScore = 0;

let appleX = 5;
let appleY = 6;

let xVelocity = 0;
let yVelocity = 0;

let gamePaused = false

let playMusic = true;
const bite = new Audio("./bite.mp3");
const gameOverSound = new Audio("./game_lost.mp3");
const audioLoop = audioLoopMusic("audioLoop2.mp3");

//game loop
function drawGame(){
    changeSnakePos();
    let result = isGameOver();
    if (result) {
        return
    }
    if(playMusic) {
        audioLoop.start();
    }
    clearScreen();
    checkAppleColision();
    drawApple();
    drawSnake();

    drawScore();
    if(score == oldScore + 5) {
        oldScore = score;
        speed += 0.5;
    }

    setTimeout(drawGame, 1000 / speed);
}
function audioLoopMusic(audioLoop){
    let sound = new Audio(audioLoop);
    return{
        start : function() {
            sound.volume = 0.05;
            sound.play();
        },
        stop : function() {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}
function isGameOver() {
    let gameOver = false;
    if (xVelocity === 0 && yVelocity === 0) {
        return false;
    }
    //wals
    if (headX < 0 || headX === tileCount || headY < 0 || headY === tileCount){
        gameOver = true;
    }
    //snake parts
    for (let i = 0; i< snakeParts.length; ++i) {
        let part = snakeParts[i]
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }
    if(gameOver) {
        ctx.fillStyle = "white"
        ctx.font = "50px Verdana"
        ctx.fillText("Game Over", canvas.width /6.5, canvas.height / 2);
        audioLoop.stop();
        gameOverSound.play();
    }
    return gameOver;
}
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "17px Verdana";
    ctx.fillText ("Score: " + score, canvas.width - 100, 20);
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect (0, 0, canvas.width, canvas.height);
}

function  drawSnake() {
    // draw snake body
    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; ++i){
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }
    // draw head
    ctx.fillStyle = 'orange';
    ctx.fillRect (headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePos() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect (appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleColision() {
    if(appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        bite.play();
    }
}

document.body.addEventListener('keydown', (e) => {
    switch(e.key) {
        // Up
        case "ArrowUp" :
        case "w" :
            if(yVelocity == 1)
                return;
            yVelocity = -1;
            xVelocity = 0;
            break;
        // Right
        case "ArrowRight" :
        case "d" :
            if(xVelocity == -1)
                return;
            yVelocity = 0;
            xVelocity = 1;
            break;
        // Down
        case "ArrowDown" :
        case "s" :
            if(yVelocity == -1)
                return;
            yVelocity = 1;
            xVelocity = 0;
            break;
        // Left
        case "ArrowLeft" :
        case "a" :
            if(xVelocity == 1)
                return;
            yVelocity = 0;
            xVelocity = -1;
            break;
        case "m" :
            if(!playMusic){
                playMusic = true;
                audioLoop.start();
                console.log(playMusic)
            } else if(playMusic) {
                playMusic = false;
                audioLoop.stop();
                console.log(playMusic)
            }
            break;
    }
})

drawGame();