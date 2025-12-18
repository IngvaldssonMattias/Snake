import { GameRenderer } from "./component/component.js";
import { SnakeGame } from "./service/service.js";


// HTML-element
const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("snake-logo");

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
    // Uppdatera rekord
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

// Starta spelet
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";

  draw(); // Rita ormen direkt vid start
  gameInterval = setInterval(gameLoop, game.gameSpeedDelay);
}

// Stoppa spelet
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";

  draw(); // Rensa ormen från brädet vid stopp
}

// Lyssna på tangenttryck
document.addEventListener("keydown", e => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) {
    startGame();
    return;
  }

  switch (e.key) {
    case "ArrowUp": game.direction = "up"; break;
    case "ArrowDown": game.direction = "down"; break;
    case "ArrowLeft": game.direction = "left"; break;
    case "ArrowRight": game.direction = "right"; break;
  }
});

// Rita bara startskärm utan ormen
renderer.updateHighScore(game.highScore);
