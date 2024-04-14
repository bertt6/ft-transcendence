import {BASE_URL} from "./spa.js";

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const paddleWidth = 10;
const paddleHeight = 200;
const ballSize = 20;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

function draw(data) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "white";
  ctx.fillRect(canvasWidth - paddleWidth, canvasHeight / 2 - data.player_one.paddle_y - paddleHeight / 2, paddleWidth, paddleHeight);
  ctx.fillRect(0, canvasHeight / 2 - data.player_two.paddle_y - paddleHeight / 2, paddleWidth, paddleHeight);
  ctx.beginPath();
  ctx.arc(data.ball.x, data.ball.y, ballSize, 0, Math.PI * 2);
  ctx.fill();
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
function setCurrentPoints(state)
{
  const {game} = state;
    let points = document.getElementById("game-points");
    points.classList.remove("skeleton")
    points.innerText =`${game.player_one.score} - ${game.player_two.score}`;
}
function setPlayerData(state)
{
  const {details} = state;
  let playerOneWrapper  = document.getElementById("player-one");
  let image = playerOneWrapper.querySelector("img");
  image.src = `${BASE_URL}${details.player1.profile_picture}`;
  let detailsWrapper = document.getElementById("player-one-details");
    let name = detailsWrapper.querySelector(".player-name");
    name.innerText = details.player1.nickname;
    let playerTwoWrapper  = document.getElementById("player-two");
    image = playerTwoWrapper.querySelector("img");
    image.src = `${BASE_URL}${details.player2.profile_picture}`;
    detailsWrapper = document.getElementById("player-two-details");
    name = detailsWrapper.querySelector(".player-name");
    name.innerText = details.player2.nickname;
}
function handleInitialState(state)
{
  setCurrentPoints(state)
  setPlayerData(state);
  draw(state.game);
}
async function connectToServer()
{
  const id = "9864aae0-c225-4d16-b17d-2893ee66338b";
  let socket = new WebSocket(`ws://localhost:8000/ws/game/${id}`)
    socket.onopen = () => {
        console.log("Connected to server");
      handleMovement(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.state_type === "initial_state")
        handleInitialState(data);
      else if(data.state_type === "game_state")
        draw(data.game);
    };
    return socket;
}
function handleMovement(socket)
{
  let currentPaddle = {
    paddle: "player_one",
    dy: 0
  }
  document.addEventListener("keydown", (event) => {
        if (event.key === "w" || event.key === "s") {
          currentPaddle.dy = event.key === "w" ? 10: -10;
        }
    });
  document.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "s") {
    currentPaddle.dy = 0;
  }
});
  setInterval(() => {
    socket.send(JSON.stringify(currentPaddle));
  }, 1000 );
}
async function App()
{
  let socket = await connectToServer();
}
App().catch((e) => {
    console.error(e);
});