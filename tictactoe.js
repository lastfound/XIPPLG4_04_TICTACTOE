// Cyberpunk Tic Tac Toe Game Logic

// Elemen DOM
let board;
let statusText;
let startScreen;
let gameContainer;
let winnerMessage;
let winnerText;
let fireworks;

// Variabel game
let currentPlayer;
let gameActive;
let gameState;
let winningCells = [];

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  board = document.getElementById("board");
  statusText = document.getElementById("status");
  startScreen = document.getElementById("start-screen");
  gameContainer = document.getElementById("game-container");
  winnerMessage = document.getElementById("winner-message");
  winnerText = document.getElementById("winner-text");
  fireworks = document.getElementById("fireworks");
  
  // Add event listeners for buttons
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("reset-btn").addEventListener("click", resetGame);
  document.getElementById("continue-btn").addEventListener("click", continueGame);
  
  // Initialize game
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
});

// Kombinasi kemenangan
const winningConditions = [
  [0, 1, 2], // Baris atas
  [3, 4, 5], // Baris tengah
  [6, 7, 8], // Baris bawah
  [0, 3, 6], // Kolom kiri
  [1, 4, 7], // Kolom tengah
  [2, 5, 8], // Kolom kanan
  [0, 4, 8], // Diagonal kiri atas ke kanan bawah
  [2, 4, 6]  // Diagonal kanan atas ke kiri bawah
];

// Mulai game
function startGame() {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  createBoard();
}

// Lanjutkan game setelah menang
function continueGame() {
  winnerMessage.style.display = "none";
  resetGame();
}

// Buat papan
function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  winningCells = [];
  statusText.innerHTML = `Giliran: <span class="highlight">${currentPlayer}</span>`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    
    // Tambahkan event listeners
    cell.addEventListener("click", cellClick);
    cell.addEventListener("mouseenter", cellHover);
    cell.addEventListener("mouseleave", cellLeave);
    
    board.appendChild(cell);
  }
}

// Efek hover pada sel
function cellHover(e) {
  const index = parseInt(e.target.getAttribute("data-index"));
  if (gameState[index] === "" && gameActive) {
    e.target.textContent = currentPlayer;
    e.target.style.opacity = "0.5";
    if (currentPlayer === "X") {
      e.target.style.color = "var(--neon-blue)";
      e.target.style.textShadow = "0 0 5px var(--neon-blue)";
    } else {
      e.target.style.color = "var(--neon-pink)";
      e.target.style.textShadow = "0 0 5px var(--neon-pink)";
    }
  }
}

// Hapus efek hover
function cellLeave(e) {
  const index = parseInt(e.target.getAttribute("data-index"));
  if (gameState[index] === "") {
    e.target.textContent = "";
    e.target.style.opacity = "1";
    e.target.style.textShadow = "none";
  }
}

// Klik pada sel
function cellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute("data-index"));

  if (gameState[index] !== "" || !gameActive) return;

  // Tambahkan efek glitch saat klik
  cell.classList.add("glitch-click");
  setTimeout(() => {
    cell.classList.remove("glitch-click");
  }, 300);

  // Update state dan tampilan
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.style.opacity = "1";
  cell.classList.add("taken");
  
  // Tambahkan kelas untuk styling berdasarkan pemain
  if (currentPlayer === "X") {
    cell.classList.add("x-mark");
  } else {
    cell.classList.add("o-mark");
  }

  checkResult();
}

// Buat efek kembang api untuk perayaan kemenangan
function createFireworks() {
  if (fireworks) {
    fireworks.innerHTML = "";
    
    // Buat 20 partikel kembang api
    for (let i = 0; i < 20; i++) {
      createParticle(fireworks);
    }
  }
}

// Buat partikel kembang api
function createParticle(container) {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  
  // Posisi acak
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  
  // Warna acak (neon blue atau neon pink)
  const color = Math.random() > 0.5 ? "var(--neon-blue)" : "var(--neon-pink)";
  
  // Atur properti partikel
  particle.style.left = `${x}%`;
  particle.style.top = `${y}%`;
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 10px ${color}`;
  
  container.appendChild(particle);
  
  // Hapus partikel setelah animasi selesai
  setTimeout(() => {
    particle.remove();
  }, 1000 + Math.random() * 1000);
}

// Periksa hasil setelah setiap gerakan
function checkResult() {
  let roundWon = false;
  let winningPattern = [];

  // Periksa kemenangan
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningPattern = [a, b, c];
      winningCells = winningPattern;
      break;
    }
  }

  // Jika ada pemenang
  if (roundWon) {
    gameActive = false;
    highlightWinningCells(winningPattern);
    
    // Tampilkan pesan kemenangan setelah delay
    setTimeout(() => {
      document.getElementById("winner-player").textContent = currentPlayer;
      document.getElementById("winner-player").className = currentPlayer === "X" ? "x-color" : "o-color";
      winnerMessage.style.display = "flex";
      
      // Mulai animasi kembang api
      createFireworks();
    }, 1000);
    
    return;
  }

  // Periksa seri
  if (!gameState.includes("")) {
    gameActive = false;
    statusText.textContent = "Permainan berakhir seri!";
    return;
  }

  // Ganti pemain
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerHTML = `Giliran: <span class="${currentPlayer === "X" ? "x-color" : "o-color"}">${currentPlayer}</span>`;
}

// Sorot sel yang menang
function highlightWinningCells(pattern) {
  pattern.forEach(index => {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add("winning-cell");
  });
}

// Reset permainan
function resetGame() {
  // Tambahkan efek glitch saat reset
  board.classList.add("glitch-reset");
  setTimeout(() => {
    board.classList.remove("glitch-reset");
    createBoard();
  }, 500);
}