import { GameRenderer } from "./component/component.js";
import { SnakeGame } from "./service/service.js";

/* =========================
   HTML-element
========================= */
const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("snake-logo");
const startMenu = document.getElementById("start-menu");
const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const playerNameInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");
const newRecordMsg = document.getElementById("new-record-msg");
const gameModeSelect = document.getElementById("game-mode");

/* =========================
   Multiplayer modal
========================= */
const multiplayerModal = document.getElementById("multiplayer-modal");
const closeModalBtn = document.getElementById("close-modal");

/* =========================
   Fyrverkeri container
========================= */
const fireworksContainer = document.getElementById("fireworks-container");

/* =========================
   Confetti canvas
========================= */
const confettiCanvas = document.createElement("canvas");
confettiCanvas.id = "confetti-canvas";
confettiCanvas.style.position = "fixed";
confettiCanvas.style.inset = "0";
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.style.zIndex = "9998";
document.body.appendChild(confettiCanvas);

const ctx = confettiCanvas.getContext("2d");

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   Confetti settings
========================= */
const CONFETTI_COUNT = 120;
const GRAVITY = 0.0875;
let confetti = [];
let confettiActive = false;
let gravityDirection = 1;
let waveCount = 0;
let waveLocked = false;

/* =========================
   Confetti creation
========================= */
function createConfetti() {
  const colors = ["#f2c14e","#e63946","#a8dadc","#457b9d","#ff6b6b","#ffb400"];
  confetti = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -300,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 0.5 + 0.5,
      size: 6 + Math.random() * 4,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

/* =========================
   Fyrverkerier
========================= */
function showFireworks() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const colors = ["#f2c14e","#e63946","#a8dadc","#457b9d","#ff6b6b","#ffb400"];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.classList.add("firework");
    p.style.left = Math.random() * vw + "px";
    p.style.top = Math.random() * vh + "px";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty("--x", (Math.random() - 0.5) * 500 + "px");
    p.style.setProperty("--y", (Math.random() - 0.5) * 500 + "px");
    fireworksContainer.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

/* =========================
   Confetti animation
========================= */
function updateConfetti() {
  if (!confettiActive) return;

  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let countInZone = 0;
  confetti.forEach(p => {
    p.vy += GRAVITY * gravityDirection;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;

    if (
      (gravityDirection === 1 && p.y > confettiCanvas.height * 0.75) ||
      (gravityDirection === -1 && p.y < confettiCanvas.height * 0.25)
    ) {
      countInZone++;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  if (!waveLocked && countInZone > confetti.length * 0.6) {
    gravityDirection *= -1;
    waveCount++;
    waveLocked = true;
    confetti.forEach(p => (p.vy *= -0.7));
    setTimeout(() => (waveLocked = false), 600);
  }

  if (waveCount >= 5) {
    confettiActive = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    return;
  }

  requestAnimationFrame(updateConfetti);
}

/* =========================
   Celebration (FIXAD)
========================= */
function startCelebration() {
  // Starta confetti EN gång
  waveCount = 0;
  confettiActive = true;
  gravityDirection = 1;
  waveLocked = false;

  createConfetti();
  requestAnimationFrame(updateConfetti);

  // Fyrverkerier körs parallellt
  let fireworkCount = 0;
  const interval = setInterval(() => {
    showFireworks();

    fireworkCount++;
    if (fireworkCount >= 6) clearInterval(interval);
  }, 500);
}

/* =========================
   Game setup
========================= */
const renderer = new GameRenderer(board, scoreEl, highScoreEl);
const game = new SnakeGame(20);
let gameInterval = null;
let gameStarted = false;

/* =========================
   New record
========================= */
function showNewRecordMessage(playerName) {
  newRecordMsg.textContent = `Grattis ${playerName}! Du har slagit nytt rekord!`;
  newRecordMsg.style.display = "block";
  startCelebration();
  setTimeout(() => (newRecordMsg.style.display = "none"), 6000);
}

/* =========================
   Draw & loop
========================= */
function draw() {
  renderer.clearBoard();
  if (gameStarted) {
    renderer.drawSnake(game.snake);
    renderer.drawFood(game.food);
    renderer.updateScore(game.snake);
  }
}

function gameLoop() {
  const head = game.move();
  if (game.hasCollision(head)) {
    const prevHigh = game.highScore;
    game.updateHighScore();
    renderer.updateHighScore(game.highScore);

    if (game.highScore > prevHigh) {
      const name = playerNameInput.value.trim() || "Player";
      showNewRecordMessage(name);
    }

    stopGame();
    game.reset();
    draw();
    return;
  }

  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

/* =========================
   Controls
========================= */
function beginPlaying() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  newRecordMsg.style.display = "none";
  draw();
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "Player";
  playerDisplay.textContent = name;
  startMenu.style.display = "none";
  gameContainer.style.display = "block";
});

/* =========================
   Multiplayer modal logic
========================= */
gameModeSelect.addEventListener("change", () => {
  if (gameModeSelect.value === "multi") {
    multiplayerModal.classList.remove("hidden");
    gameModeSelect.value = "single";
  }
});

closeModalBtn.addEventListener("click", () => {
  multiplayerModal.classList.add("hidden");
});

/* =========================
   Keyboard
========================= */
document.addEventListener("keydown", (e) => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) beginPlaying();
  if (e.key === "ArrowUp" && game.direction !== "down") game.direction = "up";
  if (e.key === "ArrowDown" && game.direction !== "up") game.direction = "down";
  if (e.key === "ArrowLeft" && game.direction !== "right") game.direction = "left";
  if (e.key === "ArrowRight" && game.direction !== "left") game.direction = "right";
});

/* =========================
   Init
========================= */
renderer.updateHighScore(game.highScore);
