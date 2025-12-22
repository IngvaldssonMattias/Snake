import { Utils } from "../utils/utils.js";

export class SnakeGame {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.highScore = Number(localStorage.getItem("snakeHighScore")) || 0; // Permanent rekord
    this.reset();
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = "right";
    this.food = Utils.generateFood(this.gridSize);
    this.gameSpeedDelay = 200;
  }

  move() {
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = Utils.generateFood(this.gridSize);
      this.increaseSpeed();
    } else {
      this.snake.pop();
    }

    return head;
  }

  increaseSpeed() {
    if (this.gameSpeedDelay > 150) this.gameSpeedDelay -= 5;
    else if (this.gameSpeedDelay > 100) this.gameSpeedDelay -= 3;
    else if (this.gameSpeedDelay > 50) this.gameSpeedDelay -= 2;
    else if (this.gameSpeedDelay > 25) this.gameSpeedDelay -= 1;
  }

  hasCollision(head) {
    // Kollision med vägg
    if (
      head.x < 1 ||
      head.x > this.gridSize ||
      head.y < 1 ||
      head.y > this.gridSize
    ) {
      return true;
    }

    // Kollision med sig själv
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true;
      }
    }

    return false;
  }

  updateHighScore() {
    const currentScore = this.snake.length - 1;
    if (currentScore > this.highScore) {
      this.highScore = currentScore;
      localStorage.setItem("snakeHighScore", this.highScore); // Spara permanent
    }
  }
}
