let board;
let playerO = "O";
let playerX = "X";
let currPlayer = playerO;
let gameOver = false;

window.onload = function () {
	setGame();
};

function setGame() {
	board = [
		[' ', ' ', ' '],
		[' ', ' ', ' '],
		[' ', ' ', ' ']
	];

	for (let r = 0; r < 3; r++) {
		for (let c = 0; c < 3; c++) {
			let tile = document.createElement("div");
			tile.id = `${r}-${c}`;
			tile.classList.add("tile");
			tile.innerText = "";
			tile.addEventListener("click", setTile);
			document.getElementById("board").appendChild(tile);
		}
	}
	updateTurnDisplay();
}

function setTile() {
	if (gameOver) return;

	let coords = this.id.split("-");
	let r = parseInt(coords[0]);
	let c = parseInt(coords[1]);

	if (board[r][c] != ' ') return;

	board[r][c] = currPlayer;
	this.innerText = currPlayer;

	checkWinner();

	currPlayer = currPlayer === playerO ? playerX : playerO;
	updateTurnDisplay();
}

function updateTurnDisplay() {
	if (!gameOver) {
		document.getElementById("turn-display").innerText = "Turn: " + currPlayer;
	}
}

function checkWinner() {
	// Rows
	for (let r = 0; r < 3; r++) {
		if (board[r][0] == board[r][1] && board[r][1] == board[r][2] && board[r][0] != ' ') {
			for (let i = 0; i < 3; i++) {
				document.getElementById(`${r}-${i}`).classList.add("winner");
			}
			endGame();
			return;
		}
	}
	// Columns
	for (let c = 0; c < 3; c++) {
		if (board[0][c] == board[1][c] && board[1][c] == board[2][c] && board[0][c] != ' ') {
			for (let i = 0; i < 3; i++) {
				document.getElementById(`${i}-${c}`).classList.add("winner");
			}
			endGame();
			return;
		}
	}
	// Diagonal
	if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') {
		for (let i = 0; i < 3; i++) {
			document.getElementById(`${i}-${i}`).classList.add("winner");
		}
		endGame();
		return;
	}
	// Anti-diagonal
	if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') {
		document.getElementById("0-2").classList.add("winner");
		document.getElementById("1-1").classList.add("winner");
		document.getElementById("2-0").classList.add("winner");
		endGame();
		return;
	}
}

function endGame() {
	gameOver = true;
	document.getElementById("turn-display").innerText = "Game Over!";
}

// Spacebar to restart
document.addEventListener("keydown", function (event) {
	if (event.code === "Space") {
		location.reload();
	}
});
