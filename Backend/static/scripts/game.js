const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const paddleWidth = 10;
const paddleHeight = 200;
const paddleSpeed = 4;
const ballSize = 10;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

let player1 = {
  x: 10,
  y: canvasHeight / 2 - paddleHeight / 2,
  dy: 0,
  score: 0
};

let player2 = {
  x: canvasWidth - 20,
  y: canvasHeight / 2 - paddleHeight / 2,
  dy: 0,
  score: 0
};
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Draw paddles
  ctx.fillStyle = "white";
  ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
  ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // Draw midline
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

}
function update() {
  // Move paddles
  player1.y += player1.dy;
  player2.y += player2.dy;

  // Keep paddles within canvas bounds
  player1.y = Math.max(0, Math.min(canvasHeight - paddleHeight, player1.y));
  player2.y = Math.max(0, Math.min(canvasHeight - paddleHeight, player2.y));

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY + ballSize >= canvasHeight || ballY - ballSize <= 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (
    ballX - ballSize <= player1.x + paddleWidth &&
    ballY >= player1.y &&
    ballY <= player1.y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballSize >= player2.x &&
    ballY >= player2.y &&
    ballY <= player2.y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Score
  if (ballX - ballSize <= 0) {
    resetBall();
  }

  if (ballX + ballSize >= canvasWidth) {
    resetBall();
  }
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 4;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function setCanvasSize()
{
  let parent = document.getElementById("canvas-wrapper");
    let cs = getComputedStyle(parent);
    let width = parseInt(cs.getPropertyValue('width'), 10);
    let height = parseInt(cs.getPropertyValue('height'), 10);
    canvas.width = 1200;
    canvas.height = 720;
}// Start the game loop
async function connectToServer()
{
  const id = "9864aae0-c225-4d16-b17d-2893ee66338b";
  let socket = new WebSocket(`ws://localhost:8000/ws/game/${id}`)
    socket.onopen = () => {
        console.log("Connected to server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
    };
}
async function App()
{
  await connectToServer();
  gameLoop();

}
App().catch((e) => {
    console.error(e);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "w") {
    player1.dy = -paddleSpeed;
  } else if (event.key === "s") {
    player1.dy = paddleSpeed;

  }

  if (event.key === "ArrowUp") {
    player2.dy = -paddleSpeed;
  } else if (event.key === "ArrowDown") {
    player2.dy = paddleSpeed;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "s") {
    player1.dy = 0;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    player2.dy = 0;
  }
});
