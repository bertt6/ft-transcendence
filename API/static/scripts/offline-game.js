const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
// Set initial positions for paddles and ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

const paddleHeight = 200;
const paddleWidth = 10;
const paddleSpeed = 5;

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;

let pause = false
let finish = false
let firstStart = true
let frame = null
let playerOneScore = 0
let playerTwoScore = 0
let offlineHandleKeyDown;
let offlineHandleKeyUp;
let keysPressed = {};
(function() {

  function destroy() {
      clearKeyListeners()
      if(frame)
            cancelAnimationFrame(frame)
  }

  window.offlineGame = {destroy };
})();
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}
function pauseGame() {
    pause = true
    setTimeout(function () {
        pause = false
    }, 3000)
}
function draw() {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    // draw net
    drawRect(canvas.width / 2 - 1, 0, 2, 1000, 'gray');
    // draw paddles
    drawRect(0, player1Y, paddleWidth, paddleHeight, 'white');
    drawRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight, 'white');
    // draw ball
    drawCircle(ballX, ballY, 15, 'white');
    if (firstStart) {
        firstStart = false
        printCountdown()
        pauseGame()
    }
}

function update() {
    ballSpeedY *= 1.0004
    ballSpeedX *= 1.0004
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // ball collision with top and bottom walls
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // ball collision with paddles
    if (
        (ballX <= paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // ball out of bounds, reset position
    if (ballX < 0 || ballX > canvas.width) {
        setCurrentPoints()
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
        player1Y = canvas.height / 2 - paddleHeight / 2;
        player2Y = canvas.height / 2 - paddleHeight / 2;
        if (!finish) {
            printCountdown()
            pauseGame()
        }
    }
}

function gameLoop() {
    if (!pause && !finish) {
        updatePaddlePositions();
        update();
        draw();
    }
    frame = requestAnimationFrame(gameLoop);
}

gameLoop();

function setCurrentPoints() {
    if (ballX < 0) {
        playerTwoScore++

    } else {
        playerOneScore++
    }

    let points = document.getElementById("game-points");

    points.innerText = `${playerOneScore} - ${playerTwoScore}`;

    if (playerOneScore == 5) {
        printWinner("Player 1")
    } else if (playerTwoScore == 5) {
        printWinner("Player 2")
    }

}
function addKeyListeners() {
    const keysPressed = {};

    offlineHandleKeyDown = function(event) {
        keysPressed[event.key] = true;
    };

    offlineHandleKeyUp = function(event) {
        keysPressed[event.key] = false;
    };

    window.addEventListener('keydown', offlineHandleKeyDown);
    window.addEventListener('keyup', offlineHandleKeyUp);
}
function clearKeyListeners() {
    if (offlineHandleKeyDown) {
        window.removeEventListener('keydown', offlineHandleKeyDown);
    }
    if (offlineHandleKeyUp) {
        window.removeEventListener('keyup', offlineHandleKeyUp);
    }
}

window.addEventListener('keydown', function (event) {
    keysPressed[event.key] = true;
});

// Handle keyup event
window.addEventListener('keyup', function (event) {
    keysPressed[event.key] = false;
});


// Update paddle positions based on keys pressed
function updatePaddlePositions() {
    if (keysPressed['w']) {
        if (player1Y > 0) { // Check if paddle 1 is not at the top edge
            player1Y -= paddleSpeed;
        }
    }
    if (keysPressed['s']) {
        if (player1Y < canvas.height - paddleHeight) { // Check if paddle 1 is not at the bottom edge
            player1Y += paddleSpeed;
        }
    }
    if (keysPressed['ArrowUp']) {
        if (player2Y > 0) { // Check if paddle 2 is not at the top edge
            player2Y -= paddleSpeed;
        }
    }
    if (keysPressed['ArrowDown']) {
        if (player2Y < canvas.height - paddleHeight) { // Check if paddle 2 is not at the bottom edge
            player2Y += paddleSpeed;
        }
    }
}


function printCountdown() {
    let countdown = 3;
    let element = document.createElement("div");
    element.id = "game-message-wrapper";
    let textElement = document.createElement("h1");
    textElement.id = "countdown";
    textElement.innerText = countdown.toString();
    element.appendChild(textElement);
    document.body.appendChild(element);
    let interval = setInterval(() => {
        countdown -= 1;
        textElement.classList.add("fade-in");
        textElement.innerText = countdown.toString();
        if (countdown === 0) {
            clearInterval(interval);
            element.remove();
        }
    }, 1000);
}

function printWinner(winner) {
    finish = true
    let winnerHTML = `
          <div class="winner-wrapper">
          <div class="winner-image-wrapper">
            <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
          </div>
          <div class="info-area">
            <h2>Winner is ${winner}</h2>
            <h1 id="play-again" class="play-again">Play Again</h1>
          </div>
        </div>
  `
    let element = document.createElement("div");
    element.id = "game-message-wrapper";
    element.innerHTML = winnerHTML;
    document.body.appendChild(element);
    const playAgain = document.getElementById('play-again')
    playAgain.addEventListener('click', () => {
        element.remove()
        resStartGame()
    })
}


function resStartGame() {
    printCountdown()
    playerOneScore = 0
    playerTwoScore = 0
    let points = document.getElementById("game-points");
    points.innerText = `${playerOneScore} - ${playerTwoScore}`;
    pauseGame()
    finish = false
}
