let board;
const boardWidth = 360;
const boardHeight = 640;
let context;

// Bird properties
const birdWidth = 34;
const birdHeight = 24;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipes
let pipeArray = [];
const pipeWidth = 64;
const pipeHeight = 512;
const pipeX = boardWidth;
const pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
const velocityX = -2;  // Pipes move left speed
let velocityY = 0;     // Bird vertical speed
const gravity = 0.4;

let gameOver = false;
let score = 0;

let countdownNumber = 3;
let countdownElem;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    countdownElem = document.getElementById("countdown");

    startCountdown();
    document.addEventListener("keydown", moveBird);
};

function startCountdown() {
    countdownNumber = 3;
    countdownElem.textContent = countdownNumber;
    let countdownInterval = setInterval(() => {
        countdownNumber--;
        if (countdownNumber > 0) {
            countdownElem.textContent = countdownNumber;
            playCountdownSound();
        } else {
            countdownElem.textContent = "";
            clearInterval(countdownInterval);
            requestAnimationFrame(update);
            setInterval(placePipes, 1500);
        }
    }, 1000);
}

function playCountdownSound() {
    const beep = new Audio('./beep.wav'); // Add your beep sound file path
    beep.volume = 0.4;
    beep.play();
}

function update() {
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // Bird movement
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        showGameOver();
    }

    // Pipes movement
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Each pipe pair = 1 point total
            pipe.passed = true;
            updateScore();
            playPointSound();
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            showGameOver();
        }
    }

    // Remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

function placePipes() {
    if (gameOver) return;

    const openingSpace = board.height / 4;
    const randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityY = -6;

        if (gameOver) {
            resetGame();
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame() {
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;
    updateScore();
    startCountdown();
}

function updateScore() {
    document.getElementById("score").textContent = "Score: " + Math.floor(score);
}

function showGameOver() {
    alert("Game Over! Your score: " + Math.floor(score));
}
function playPointSound() {
    const pointSound = new Audio('./point.wav'); // Add your point sound file path
    pointSound.volume = 0.4;
    pointSound.play();
}
