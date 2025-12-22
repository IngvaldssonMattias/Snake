import { Utils } from "../utils/utils.js";

export class GameRenderer {
  constructor(board, scoreElement, highScoreElement) {
    this.board = board;
    this.scoreElement = scoreElement;
    this.highScoreElement = highScoreElement;
  }

  clearBoard() {
    this.board.innerHTML = "";
  }

  drawSnake(snake) {
    snake.forEach((segment) => {
      const el = Utils.createGameElement("div", "snake");
      Utils.setPosition(el, segment);
      this.board.appendChild(el);
    });
  }

  drawFood(food) {
    const el = Utils.createGameElement("div", "food");
    Utils.setPosition(el, food);
    this.board.appendChild(el);
  }

  updateScore(snake) {
    const score = snake.length - 1;
    this.scoreElement.textContent = score.toString().padStart(3, "0");
  }

  updateHighScore(highScore) {
    this.highScoreElement.textContent = highScore.toString().padStart(3, "0");
    this.highScoreElement.style.display = "block";
  }
}
