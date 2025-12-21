import { GameRenderer } from "./component/component.js";
import { SnakeGame } from "./service/service.js";

// HTML-element
const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("snake-logo");
const startMenu = document.getElementById("start-menu");
const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const gameModeSelect = document.getElementById("game-mode");

// Instanser av renderer och spel
const renderer = new GameRenderer(board, scoreEl, highScoreEl);
const game = new SnakeGame(20);

let gameInterval = null;
let gameStarted = false;

// Rita spelet (ormen syns bara när spelet startat)
function draw() {
  renderer.clearBoard();
  if (gameStarted) {
    renderer.drawSnake(game.snake);
    renderer.drawFood(game.food);
    renderer.updateScore(game.snake);
  }
}

// Huvudloop för spelet
function gameLoop() {
  const head = game.move();

  if (game.hasCollision(head)) {
    game.updateHighScore();
    renderer.updateHighScore(game.highScore);

    stopGame();
    game.reset();
    draw();
    return;
  }

  draw();

  // Dynamisk hastighet
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

// Starta själva spelet (första gången ormen rör sig)
function beginPlaying() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  draw();
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

// Stoppa spelet
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
  draw();
}

// När man klickar på Start Game-knappen
startButton.addEventListener("click", () => {
  if (gameModeSelect.value === "single") {
    startMenu.style.display = "none";      // Dölj startmenyn
    gameContainer.style.display = "block"; // Visa spelplanen
    instructionText.textContent = "Press spacebar to start the game"; // Visa instruktion
    instructionText.style.display = "block";
    logo.style.display = "block";
  } else {
    alert("Multiplayer är inte implementerat än.");
  }
});

// Lyssna på tangenttryck
document.addEventListener("keydown", e => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) {
    beginPlaying(); // Starta spelet först när space trycks
    return;
  }

  // Riktning (förhindra 180°-vändning)
  switch (e.key) {
    case "ArrowUp": if (game.direction !== "down") game.direction = "up"; break;
    case "ArrowDown": if (game.direction !== "up") game.direction = "down"; break;
    case "ArrowLeft": if (game.direction !== "right") game.direction = "left"; break;
    case "ArrowRight": if (game.direction !== "left") game.direction = "right"; break;
  }
});

// Visa highscore direkt när sidan laddas
renderer.updateHighScore(game.highScore);
