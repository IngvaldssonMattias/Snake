import { GameRenderer } from "./component/component.js";
import { SnakeGame } from "./service/service.js";
import { celebration } from "./utils/celebration.js";
import { UI } from "./utils/ui.js";

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
      UI.showNewRecordMessage(newRecordMsg, name);
      celebration.startCelebration();
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
  UI.showGame(gameContainer, board);

  draw();
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  UI.showStartScreen(instructionText, logo);
}

/* =========================
   Start-knapp
========================= */
startButton.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "Player";
  playerDisplay.textContent = name;

  if (gameModeSelect.value === "multi") {
    UI.showMultiplayerModal(
      multiplayerModal,
      startMenu,
      gameContainer,
      board,
      logo,
      instructionText,
      playerDisplay
    );
  } else {
    UI.showSinglePlayer(startMenu, gameContainer, board, logo);
  }
});

/* =========================
   Multiplayer modal
========================= */
closeModalBtn.addEventListener("click", () => {
  UI.hideMultiplayerModal(
    multiplayerModal,
    startMenu,
    gameContainer,
    board,
    logo,
    instructionText,
    playerDisplay
  );
});

/* =========================
   Keyboard
========================= */
document.addEventListener("keydown", (e) => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) {
    UI.hideInstructionText(instructionText);
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
UI.init(board, gameContainer);
renderer.updateHighScore(game.highScore);
