let board, statusText, startScreen, gameContainer, winnerMessage, fireworks;
let currentPlayer, gameActive, gameState;
let playerXName, playerOName;
let scores = JSON.parse(localStorage.getItem("scores")) || {};
let clickSound, winSound;
let drawSound, drawMessage, drawFireworks;

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("board");
    statusText = document.getElementById("status");
    startScreen = document.getElementById("start-screen");
    gameContainer = document.getElementById("game-container");
    winnerMessage = document.getElementById("winner-message");
    fireworks = document.getElementById("fireworks");
    drawSound = document.getElementById("draw-sound");
    drawMessage = document.getElementById("draw-message");
    drawFireworks = document.getElementById("draw-fireworks");
    document.getElementById("draw-continue-btn").addEventListener("click", continueGame);

    // Inisialisasi elemen audio
    clickSound = document.getElementById("click-sound");
    winSound = document.getElementById("win-sound");

    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("reset-btn").addEventListener("click", resetGame);
    document
        .getElementById("continue-btn")
        .addEventListener("click", continueGame);

    currentPlayer = "X";
    gameState = Array(9).fill("");
    gameActive = true;

    updateLeaderboard();
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function startGame() {
    playerXName = document.getElementById("playerX").value.trim() || "Player X";
    playerOName = document.getElementById("playerO").value.trim() || "Player O";

    localStorage.setItem("playerX", playerXName);
    localStorage.setItem("playerO", playerOName);

    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    createBoard();
}

function createBoard() {
    board.innerHTML = "";
    gameState = Array(9).fill("");
    gameActive = true;
    currentPlayer = "X";
    updateStatus();

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", cellClick);
        board.appendChild(cell);
    }
}

function cellClick(e) {
    const index = e.target.dataset.index;
    if (gameState[index] !== "" || !gameActive) return;

    // Tambahkan efek animasi klik
    e.target.classList.add("clicked");
    setTimeout(() => {
        e.target.classList.remove("clicked");
    }, 150);

    // Putar suara klik
    clickSound.currentTime = 0;
    clickSound.play();

    gameState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winner;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            winner = currentPlayer;
            highlightWinningCells(condition);
            break;
        }
    }

    if (!gameState.includes("")) {
        gameActive = false;

        // Putar suara seri
        drawSound.currentTime = 0;
        drawSound.play();

        // Tampilkan pesan seri
        setTimeout(() => {
            drawMessage.style.display = "flex";
            createDrawFireworks();
        }, 500);

        return;
    }

    if (roundWon) {
        gameActive = false;
        const winnerName = winner === "X" ? playerXName : playerOName;

        if (!scores[winnerName]) scores[winnerName] = 0;
        scores[winnerName]++;
        localStorage.setItem("scores", JSON.stringify(scores));
        updateLeaderboard();

        winSound.currentTime = 0;
        winSound.play();

        board.classList.add("glitch-win");
        setTimeout(() => board.classList.remove("glitch-win"), 1000);

        setTimeout(() => {
            document.getElementById("winner-player").textContent = winnerName;
            winnerMessage.style.display = "flex";
            createFireworks();
        }, 500);

        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        statusText.textContent = "Seri!";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function updateStatus() {
    const name = currentPlayer === "X" ? playerXName : playerOName;
    const colorClass = currentPlayer === "X" ? "x-mark" : "o-mark";
    statusText.innerHTML = `Giliran: <span class="${colorClass}">${name}</span>`;
}

function highlightWinningCells(pattern) {
    pattern.forEach((i) =>
        document.querySelector(`[data-index="${i}"]`).classList.add("winning-cell")
    );
}

// ...existing code...
// ...existing code...

function resetGame() {
    createBoard();
}




function continueGame() {
    winnerMessage.style.display = "none";
    drawMessage.style.display = "none";
    resetGame();
}

function updateLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score} menang`;
        list.appendChild(li);
    });
}

// Efek draw fireworks
function createDrawFireworks() {
    if (drawFireworks) {
        drawFireworks.innerHTML = "";

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // Gunakan warna ungu untuk efek seri
            const colors = ["var(--neon-purple)"];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 12px ${color}`;

            drawFireworks.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);

          drawExtraSound = document.getElementById("draw-extra-sound");
            if (drawExtraSound) {
                drawExtraSound.currentTime = 0;
                drawExtraSound.play();
            }
        }
    }
}

// Efek fireworks
function createFireworks() {
    if (fireworks) {
        fireworks.innerHTML = "";

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");

            const x = Math.random() * 100;
            const y = Math.random() * 100;

            const colors = [
                "var(--neon-blue)",
                "var(--neon-pink)",
                "var(--neon-purple)",
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 12px ${color}`;

            fireworks.appendChild(particle);
            setTimeout(() => particle.remove(), 1200);
        }
    }
}

const btn = document.getElementById("openLeaderboard");
const overlay = document.getElementById("mm");

btn.addEventListener("click", () => {
  mm.style.display = "flex"; 
});


mm.addEventListener("click", (e) => {
  if (e.target === mm) {
    mm.style.display = "none";
  }
});
