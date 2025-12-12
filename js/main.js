// Define HTML element
const board = document.getElementById("game-board")
const instructionText = document.getElementById("instruction-text")
const logo = document.getElementById("snake-logo")

// Define game variables
const gridSize = 20
let snake = [{x: 10, y: 10}]
let food = generateFood();
let direction = "right"
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = "false";
let

// Draw game map, snake, food
function draw() {
    board.innerhtml = "";
        drawSnake();
        drawFood()
}

// Draw snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement("div",
             "snake");
             setPosition(snakeElement, segment);
             board.appendChild(snakeElement)
})
}


// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
        element.className = className;
            return element;
}

// Set the position of snake or food
 function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
 }

 // Testing draw function
  // draw();

 // Draw food function
 function drawFood() {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food)
    board.appendChild(foodElement);
 }

 // generate food
 function generateFood() {
const x = Math.floor(Math.random() * gridSize) + 1;
const y = Math.floor(Math.random() * gridSize) + 1;
return { x, y };
 }

 // Moving the snake
 function move() {
  const head = { ...snake[0] };
  switch (direction) {
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

  snake.unshift(head);

  // snake.pop();
  if(head.x === food.x && head.y == food.y) {
    food = generateFood();
    clearInterval(); // Clear past interval
    gameInterval = setInterval(() => {
        move();
        draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();    
  }
 }

 // Test moving
 // setInterval(() => {
    // move(); // Move first
    // draw(); //Then draw again new position
 // }, 200);

// Start game function
function startGame() {
    gameStarted = "true" // Keep track of a running game
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, gameSpeedDelay)

}