import { GameRenderer } from "./component/component.js";
import { SnakeGame } from "./service/service.js";
import { celebration } from "./utils/celebration.js";

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

const multiplayerModal = document.getElementById("multiplayer-modal");
const closeModalBtn = document.getElementById("close-modal");

/* =========================
   Game setup
========================= */
const renderer = new GameRenderer(board, scoreEl, highScoreEl);
const game = new SnakeGame(20);
let gameInterval = null;
let gameStarted = false;

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
   Game controls
========================= */
function beginPlaying() {
  gameStarted = true;
  newRecordMsg.style.display = "none";
  gameContainer.style.display = "block";
  gameContainer.style.visibility = "visible";
  board.classList.remove("hide-background");

  draw();
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

/* =========================
   New record message
========================= */
function showNewRecordMessage(playerName) {
  newRecordMsg.textContent = `Grattis ${playerName}! Du har slagit nytt rekord!`;
  newRecordMsg.style.display = "block";
  celebration.startCelebration();
  setTimeout(() => (newRecordMsg.style.display = "none"), 6000);
}

/* =========================
   Start-knapp
========================= */
startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "Player";
  playerDisplay.textContent = name;

  if (gameModeSelect.value === "multi") {
    multiplayerModal.classList.remove("hidden");

    startMenu.style.display = "none";
    gameContainer.style.display = "none";
    gameContainer.style.visibility = "hidden";
    logo.style.display = "none";
    instructionText.style.display = "none";
    playerDisplay.style.display = "none";

    board.classList.add("hide-background");

  } else {
    startMenu.style.display = "none";
    gameContainer.style.display = "block";
    gameContainer.style.visibility = "visible";
    board.classList.remove("hide-background");
    logo.style.display = "block";
  }
});

/* =========================
   Multiplayer modal
========================= */
closeModalBtn.addEventListener("click", () => {
  multiplayerModal.classList.add("hidden");

  startMenu.style.display = "flex";
  gameContainer.style.display = "none";
  gameContainer.style.visibility = "hidden";
  board.classList.add("hide-background");

  logo.style.display = "none";
  instructionText.style.display = "block";
  playerDisplay.style.display = "block";
});

/* =========================
   Keyboard
========================= */
document.addEventListener("keydown", (e) => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) {
    instructionText.style.display = "none";
    beginPlaying();
    logo.style.display = "none";
  }

  if (e.key === "ArrowUp" && game.direction !== "down") game.direction = "up";
  if (e.key === "ArrowDown" && game.direction !== "up") game.direction = "down";
  if (e.key === "ArrowLeft" && game.direction !== "right") game.direction = "left";
  if (e.key === "ArrowRight" && game.direction !== "left") game.direction = "right";
});

/* =========================
   Init
========================= */
board.classList.add("hide-background");
gameContainer.style.visibility = "hidden";
renderer.updateHighScore(game.highScore);
