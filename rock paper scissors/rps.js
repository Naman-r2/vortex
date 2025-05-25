let you;
let yourScore = 0;
let opponent;
let opponentScore = 0;

const choices = ["rock", "paper", "scissors"];

window.onload = () => {
    const choicesContainer = document.getElementById("choices");

    choices.forEach(choice => {
        const img = document.createElement("img");
        img.id = choice;
        img.src = `${choice}.png`;
        img.alt = choice;
        img.addEventListener("click", selectChoice);
        choicesContainer.appendChild(img);
    });
};

function selectChoice() {
    you = this.id;
    opponent = choices[Math.floor(Math.random() * choices.length)];

    document.getElementById("your-choice").src = `${you}.png`;
    document.getElementById("opponent-choice").src = `${opponent}.png`;

    const result = determineWinner(you, opponent);
    updateScores(result);
    checkGameOver();
}

function determineWinner(player, computer) {
    if (player === computer) return "draw";
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper")
    ) {
        return "player";
    }
    return "computer";
}

function updateScores(winner) {
    if (winner === "player") yourScore++;
    else if (winner === "computer") opponentScore++;
    else {
        yourScore++;
        opponentScore++;
    }

    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("opponent-score").innerText = opponentScore;
}

function checkGameOver() {
    if (yourScore >= 7 || opponentScore >= 7) {
        setTimeout(() => {
            if (yourScore >= 7 && opponentScore >= 7) {
                alert("It's a draw!");
            } else if (yourScore >= 7) {
                alert("You win the game!");
            } else {
                alert("Computer wins the game!");
            }
            resetGame();
        }, 100);
    }
}

function resetGame() {
    yourScore = 0;
    opponentScore = 0;
    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("opponent-score").innerText = opponentScore;
    document.getElementById("your-choice").src = "placeholder.png";
    document.getElementById("opponent-choice").src = "placeholder.png";
}
function resetGame() {
    yourScore = 0;
    opponentScore = 0;
    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("opponent-score").innerText = opponentScore;    }



