export class Utils {
  static createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  static setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
  }

  static generateFood(gridSize) {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
  }
}
