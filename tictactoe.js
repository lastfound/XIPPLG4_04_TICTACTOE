let board, statusText, startScreen, gameContainer, winnerMessage, fireworks;
let currentPlayer, gameActive, gameState;
let playerXName, playerOName;
let scoresPvP = JSON.parse(localStorage.getItem("scoresPvP")) || {};
let scoresBot = JSON.parse(localStorage.getItem("scoresBot")) || {};
let clickSound, winSound;
let drawSound, drawMessage, drawFireworks;
let lobbyScreen, lobbyMusic; // tambahan untuk lobby
let startScreenBot; // screen untuk mode lawan bot
let isPlayingAgainstBot = false; // flag untuk mode lawan bot
let botDifficulty = "easy"; // default difficulty

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("board");
    statusText = document.getElementById("status");
    startScreen = document.getElementById("start-screen");
    startScreenBot = document.getElementById("start-screen-bot");
    gameContainer = document.getElementById("game-container");
    winnerMessage = document.getElementById("winner-message");
    fireworks = document.getElementById("fireworks");
    drawSound = document.getElementById("draw-sound");
    drawMessage = document.getElementById("draw-message");
    drawFireworks = document.getElementById("draw-fireworks");

    // --- Tambahan untuk lobby ---
    lobbyScreen = document.getElementById("lobby-screen");
    const modeSelectionScreen = document.getElementById("mode-selection-screen");
    lobbyMusic = document.getElementById("lobby-music");

    if (lobbyMusic) {
        lobbyMusic.volume = 0.5;
    }
    
    // Tombol START di lobby
    const startLobbyBtn = document.getElementById("start-lobby-btn");
    if (startLobbyBtn) {
        startLobbyBtn.addEventListener("click", () => {
            // sembunyikan lobby, tampilkan pilihan mode permainan
            lobbyScreen.style.display = "none";
            modeSelectionScreen.style.display = "flex";
            
            // mulai musik baru setelah tombol ditekan
            if (lobbyMusic) {
                lobbyMusic.currentTime = 0;
                lobbyMusic.play();
            }
        });
    }

    // Tombol mode permainan
    const playVsPlayerBtn = document.getElementById("play-vs-player");
    const playVsBotBtn = document.getElementById("play-vs-bot");
    
    if (playVsPlayerBtn) {
        playVsPlayerBtn.addEventListener("click", () => {
            // sembunyikan pilihan mode, tampilkan input nama untuk mode player vs player
            modeSelectionScreen.style.display = "none";
            startScreen.style.display = "flex";
            isPlayingAgainstBot = false;
        });
    }
    
    if (playVsBotBtn) {
        playVsBotBtn.addEventListener("click", () => {
            // sembunyikan pilihan mode, tampilkan input nama untuk mode player vs bot
            modeSelectionScreen.style.display = "none";
            startScreenBot.style.display = "flex";
            isPlayingAgainstBot = true;
        });
    }
    
    // Setup tombol tingkat kesulitan
    const easyModeBtn = document.getElementById("easy-mode");
    const hardModeBtn = document.getElementById("hard-mode");
    
    easyModeBtn.addEventListener("click", () => {
        botDifficulty = "easy";
        easyModeBtn.classList.add("selected");
        hardModeBtn.classList.remove("selected");
    });
    
    hardModeBtn.addEventListener("click", () => {
        botDifficulty = "hard";
        hardModeBtn.classList.add("selected");
        easyModeBtn.classList.remove("selected");
    });
    // --- akhir tambahan ---

    document.getElementById("draw-continue-btn").addEventListener("click", continueGame);

    // Inisialisasi elemen audio game
    clickSound = document.getElementById("click-sound");
    winSound = document.getElementById("win-sound");

    document.getElementById("start-btn").addEventListener("click", () => startGame(false));
    document.getElementById("start-bot-btn").addEventListener("click", () => startGame(true));
    
    // Tombol kembali ke pilihan mode
    document.getElementById("back-to-mode-btn").addEventListener("click", () => {
        startScreen.style.display = "none";
        modeSelectionScreen.style.display = "flex";
    });
    
    document.getElementById("back-to-mode-btn-bot").addEventListener("click", () => {
        startScreenBot.style.display = "none";
        modeSelectionScreen.style.display = "flex";
    });
    document.getElementById("reset-btn").addEventListener("click", resetGame);
    document.getElementById("continue-btn").addEventListener("click", continueGame);
    
    // Setup tab leaderboard
    const tabPvP = document.getElementById("tab-pvp");
    const tabBot = document.getElementById("tab-bot");
    const leaderboardPvP = document.getElementById("leaderboard-pvp");
    const leaderboardBot = document.getElementById("leaderboard-bot");
    
    tabPvP.addEventListener("click", () => {
        tabPvP.classList.add("active");
        tabBot.classList.remove("active");
        leaderboardPvP.classList.add("active");
        leaderboardBot.classList.remove("active");
    });
    
    tabBot.addEventListener("click", () => {
        tabBot.classList.add("active");
        tabPvP.classList.remove("active");
        leaderboardBot.classList.add("active");
        leaderboardPvP.classList.remove("active");
    });

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

function startGame(vsBot) {
    isPlayingAgainstBot = vsBot;
    
    if (vsBot) {
        playerXName = document.getElementById("playerXBot").value.trim() || "Player X";
        playerOName = "Bot";
        startScreenBot.style.display = "none";
    } else {
        playerXName = document.getElementById("playerX").value.trim() || "Player X";
        playerOName = document.getElementById("playerO").value.trim() || "Player O";
        startScreen.style.display = "none";
    }

    localStorage.setItem("playerX", playerXName);
    localStorage.setItem("playerO", playerOName);

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
    
    // Jika bermain melawan bot dan permainan masih aktif, bot akan membuat gerakan
    if (isPlayingAgainstBot && gameActive && currentPlayer === "O") {
        setTimeout(() => {
            makeBotMove();
        }, 700); // Delay untuk memberikan kesan bot sedang berpikir
    }
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

function resetGame() {
    createBoard();
}

function continueGame() {
    winnerMessage.style.display = "none";
    drawMessage.style.display = "none";
    resetGame();
}

function updateLeaderboard() {
    // Update leaderboard untuk mode Player vs Player
    const listPvP = document.getElementById("leaderboard-list-pvp");
    listPvP.innerHTML = "";

    const sortedPvP = Object.entries(scoresPvP).sort((a, b) => b[1] - a[1]);
    sortedPvP.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score} menang`;
        listPvP.appendChild(li);
    });
    
    // Update leaderboard untuk mode Player vs Bot
    const listBot = document.getElementById("leaderboard-list-bot");
    listBot.innerHTML = "";

    const sortedBot = Object.entries(scoresBot).sort((a, b) => b[1] - a[1]);
    sortedBot.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score} menang`;
        listBot.appendChild(li);
    });
}

function createDrawFireworks() {
    if (drawFireworks) {
        drawFireworks.innerHTML = "";

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");

            const x = Math.random() * 100;
            const y = Math.random() * 100;

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

const closeBtn = document.getElementById("closeLeaderboard");

closeBtn.addEventListener("click", () => {
  mm.style.display = "none";
});

function checkResult() {
    let roundWon = false;
    let winner;
    let winningPattern = null; 

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            winner = currentPlayer;
            winningPattern = condition; 
            highlightWinningCells(condition);
            break;
        }
    }

    if (!gameState.includes("") && !roundWon) {
        gameActive = false;

        drawSound.currentTime = 0;
        drawSound.play();

        setTimeout(() => {
            drawMessage.style.display = "flex";
            createDrawFireworks();
        }, 500);

        return;
    }

    if (roundWon) {
        gameActive = false;
        const winnerName = winner === "X" ? playerXName : playerOName;

        // Update skor berdasarkan mode permainan
        if (isPlayingAgainstBot) {
            if (!scoresBot[winnerName]) scoresBot[winnerName] = 0;
            scoresBot[winnerName]++;
            localStorage.setItem("scoresBot", JSON.stringify(scoresBot));
        } else {
            if (!scoresPvP[winnerName]) scoresPvP[winnerName] = 0;
            scoresPvP[winnerName]++;
            localStorage.setItem("scoresPvP", JSON.stringify(scoresPvP));
        }
        updateLeaderboard();

        winSound.currentTime = 0;
        winSound.play();

        
        const cells = winningPattern.map(index =>
            document.querySelector(`[data-index="${index}"]`)
        );
        drawWinningLine(cells);

        board.classList.add("glitch-win");
        setTimeout(() => board.classList.remove("glitch-win"), 1000);

        setTimeout(() => {
            document.getElementById("winner-player").textContent = winnerName;
            winnerMessage.style.display = "flex";
            createFireworks();
        }, 500);

        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
    
    // Jika bermain melawan bot dan sekarang giliran bot
    if (isPlayingAgainstBot && currentPlayer === "O" && gameActive) {
        setTimeout(() => {
            makeBotMove();
        }, 700);
    }
}

function drawWinningLine(cells) {
    
    const boardRect = board.getBoundingClientRect();

   
    const firstRect = cells[0].getBoundingClientRect();
    const lastRect = cells[2].getBoundingClientRect();

    
    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const line = document.createElement("div");
    line.classList.add("winning-line");
    Object.assign(line.style, {
        position: "absolute",
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        height: "4px",
        background: "cyan",
        transformOrigin: "0 50%",
        transform: `rotate(${angle}deg)`,
        boxShadow: "0 0 10px #0ff, 0 0 20px #f0f",
        zIndex: 10
    });

    
    board.appendChild(line);
}

// Fungsi untuk bot membuat gerakan
function makeBotMove() {
    if (!gameActive || currentPlayer !== "O") return;
    
    let index;
    
    // Logika bot berdasarkan tingkat kesulitan
    if (botDifficulty === "hard") {
        // Mode sulit: Bot akan mencoba menang atau memblokir pemain
        index = findBestMove();
    } else {
        // Mode mudah: Bot akan memilih gerakan secara acak
        const availableMoves = gameState.map((cell, i) => cell === "" ? i : null).filter(i => i !== null);
        index = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Animasi klik
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add("clicked");
    setTimeout(() => {
        cell.classList.remove("clicked");
    }, 150);
    
    // Putar suara klik
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Update state
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("o-mark");
    
    // Periksa hasil
    checkResult();
}

// Fungsi untuk mencari gerakan terbaik untuk bot (algoritma minimax sederhana)
function findBestMove() {
    // Cek apakah bot bisa menang dalam satu langkah
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O";
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "O") {
                    gameState[i] = "";
                    return i; // Bot bisa menang, ambil langkah ini
                }
            }
            gameState[i] = "";
        }
    }
    
    // Cek apakah pemain bisa menang dalam satu langkah dan blokir
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "X";
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "X") {
                    gameState[i] = "";
                    return i; // Pemain bisa menang, blokir langkah ini
                }
            }
            gameState[i] = "";
        }
    }
    
    // Ambil tengah jika tersedia
    if (gameState[4] === "") {
        return 4;
    }
    
    // Ambil sudut yang tersedia
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Ambil sisi yang tersedia
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => gameState[i] === "");
    if (availableSides.length > 0) {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
    
    // Jika tidak ada gerakan yang bagus, pilih secara acak
    const availableMoves = gameState.map((cell, i) => cell === "" ? i : null).filter(i => i !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}