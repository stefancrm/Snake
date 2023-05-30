const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// game constants
const blockSize = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const gameSpeed = 8;

//game variables
let score = 0;
let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
];
let dx = 1;
let dy = 0;
let food = { x: 10, y: 10 };
let playMusic = true;
const bite = new Audio("./bite.mp3");
const gameOverSound = new Audio("./game_lost.mp3");
const audioLoop = audioLoopMusic("audioLoop2.mp3");

// Initialize the game
function init() {
    setInterval(gameLoop, 1000 / gameSpeed);
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

// Game loop
function gameLoop() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();

    // Check for collision with food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
        ++score;
        bite.play();
    }
    
    // Check for collision with walls or self
    if (isCollision()) {
        gameOver();
        return;
    }

    // display the score
    document.getElementById("score").innerHTML = "Score: " + score;
    if(playMusic) {
        audioLoop.start();
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

// Draw the snake
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "#000";
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// Check for collision with walls or self
function isCollision() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= canvasWidth / blockSize ||
        head.y < 0 || head.y >= canvasHeight / blockSize ||
        isSelfCollision(head)
    ) {
        return true;
    }
    return false;
}

// Check for self-collision
function isSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
        }
    }
    return false;
}

// Generate random food location
function generateFood() {
    food.x = Math.floor(Math.random() * (canvasWidth / blockSize));
    food.y = Math.floor(Math.random() * (canvasHeight / blockSize));
}

// Handle key events to change snake direction
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;
    if (key === "w" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (key === "s" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (key === "a" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (key === "d" && dx !== -1) {
        dx = 1;
        dy = 0;
    } else if (key === "m") {
        if(!playMusic){
            playMusic = true;
            audioLoop.start();
            console.log(playMusic);
        } else if(playMusic) {
            playMusic = false;
            audioLoop.stop();
            console.log(playMusic);
        }
    }
}

// Handle food consumption
function eatFood() {
    snake.push({});
    generateFood();
}

// Game over
function gameOver() {
    alert("Game Over. Score: " + score);
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      dx = 1;
      dy = 0;
      score = 0;
      generateFood();
      playMusic = false;
      document.getElementById("score").innerHTML = "Score: " + score;
      gameOverSound.play();
}