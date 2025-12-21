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
const playerNameInput = document.getElementById("player-name");
const playerDisplay = document.getElementById("player-display");
const newRecordMsg = document.getElementById("new-record-msg");

// Skapa container för fyrverkerier
let fireworksContainer = document.createElement("div");
fireworksContainer.id = "fireworks-container";
document.body.appendChild(fireworksContainer);

// Instanser av renderer och spel
const renderer = new GameRenderer(board, scoreEl, highScoreEl);
const game = new SnakeGame(20);

let gameInterval = null;
let gameStarted = false;

// Funktion för att visa nytt rekord-meddelande
function showNewRecordMessage(playerName) {
  newRecordMsg.textContent = `Grattis ${playerName}! Du har slagit nytt rekord!`;
  newRecordMsg.style.display = "block";

  // Spela upp fyrverkerier 3 gånger med blink och färg
  playFireworksMultiple(3, 700);

  // Dölj meddelandet efter 6 sekunder
  setTimeout(() => {
    newRecordMsg.style.display = "none";
  }, 6000);
}

// Spela upp fyrverkerier flera gånger
function playFireworksMultiple(times, interval) {
  let count = 0;
  const fireworkInterval = setInterval(() => {
    showFireworks();
    count++;
    if (count >= times) clearInterval(fireworkInterval);
  }, interval);
}

// Skapa fyrverkerier över hela skärmen
function showFireworks() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("firework");

    // Slumpmässig startposition
    particle.style.left = Math.random() * vw + "px";
    particle.style.top = Math.random() * vh + "px";

    // Slumpmässig spridning
    const x = (Math.random() - 0.5) * 300 + "px";
    const y = (Math.random() - 0.5) * 300 + "px";
    particle.style.setProperty("--x", x);
    particle.style.setProperty("--y", y);

    // Slumpmässig färg och blink-animation
    const colors = ["#f2c14e", "#e63946", "#a8dadc", "#457b9d", "#ff6b6b", "#ffb400"];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
    particle.style.opacity = Math.random();

    fireworksContainer.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }
}

// Rita spelet
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
    const previousHighScore = game.highScore;
    game.updateHighScore();
    renderer.updateHighScore(game.highScore);

    if (game.highScore > previousHighScore) {
      const playerName = playerNameInput.value.trim() || "Player";
      showNewRecordMessage(playerName);
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

// Starta spelet när space trycks
function beginPlaying() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  newRecordMsg.style.display = "none";
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

// Startknapp
startButton.addEventListener("click", () => {
  if (gameModeSelect.value === "single") {
    const playerName = playerNameInput.value.trim() || "Player";
    playerDisplay.textContent = playerName;

    startMenu.style.display = "none";
    gameContainer.style.display = "block";
    instructionText.textContent = "Press spacebar to start the game";
    instructionText.style.display = "block";
    logo.style.display = "block";
  } else {
    alert("Multiplayer är inte implementerat än.");
  }
});

// Tangenttryck
document.addEventListener("keydown", e => {
  if (!gameStarted && (e.code === "Space" || e.key === " ")) {
    beginPlaying();
    return;
  }

  switch (e.key) {
    case "ArrowUp": if (game.direction !== "down") game.direction = "up"; break;
    case "ArrowDown": if (game.direction !== "up") game.direction = "down"; break;
    case "ArrowLeft": if (game.direction !== "right") game.direction = "left"; break;
    case "ArrowRight": if (game.direction !== "left") game.direction = "right"; break;
  }
});

// Visa highscore direkt
renderer.updateHighScore(game.highScore);
