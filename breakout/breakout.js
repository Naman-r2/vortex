// Board setup
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Player paddle
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX
};

// Ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
};

// Blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    createBlocks();
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
};

// Main update loop
function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // Draw player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    // Draw ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Ball collision with paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;
    } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;
    }

    // Ball boundary collision
    if (ball.y <= 0) {
        ball.velocityY *= -1;
    } else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= boardHeight) {
        context.font = "20px sans-serif";
        context.fillStyle = "white";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    // Draw and handle blocks
    context.fillStyle = "skyblue";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;
                score += 100;
                blockCount -= 1;
            } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    // Next level
    if (blockCount === 0) {
        score += 100 * blockRows * blockColumns;
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    // Draw score
    context.font = "20px sans-serif";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 10, 25);
}

// Player movement
function movePlayer(e) {
    if (gameOver) {
        if (e.code === "Space") {
            resetGame();
        }
        return;
    }

    if (e.code === "ArrowLeft") {
        let nextX = player.x - player.velocityX;
        if (!outOfBounds(nextX)) {
            player.x = nextX;
        }
    } else if (e.code === "ArrowRight") {
        let nextX = player.x + player.velocityX;
        if (!outOfBounds(nextX)) {
            player.x = nextX;
        }
    }
}

// Helper collision detection
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + player.width > boardWidth);
}

// Create blocks for current level
function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * blockWidth + c * 10,
                y: blockY + r * blockHeight + r * 10,
                width: blockWidth,
                height: blockHeight,
                break: false
            };
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

// Reset game after game over
function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX
    };
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    };
    score = 0;
    blockRows = 3;
    createBlocks();
}

// Reload on 'R'
document.addEventListener("keydown", function (event) {
    if (event.code === "KeyR") {
        location.reload();
    }
});
