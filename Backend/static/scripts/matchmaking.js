import {loadPage} from "./spa.js";

function handleText() {
  const BASE_TEXT = "FINDING A MATCH";
  const text = document.getElementById("matchmaking text");
  console.log(text);
  let textIndex = 0;
  return setInterval(() => {
    text.innerText = BASE_TEXT + ".".repeat(textIndex % 3);
    textIndex += 1;
  }, 1000);
}
function handleTimer() {
  const timer = document.getElementById("matchmaking-timer");
  let time = 0;
  setInterval(() => {
    time += 1;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timer.innerText = `${minutes}:${seconds}`;
  }, 1000);
}

async function matchFounded() {
  const text = document.getElementById("matchmaking text");
  const exitButton = document.getElementById('close-matchmaking')
  const timer = document.getElementById("matchmaking-timer");
  text.innerText = 'MATCH FOUND!'
  exitButton.hidden = true
  timer.hidden = true
  await new Promise(r => setTimeout(r, 5000));
}
async function connectToSocket() {
  let interval;
  const nickname = localStorage.getItem("activeUserNickname")
    const socket = new WebSocket(`ws://localhost:8000/ws/matchmaking/${nickname}`);
    socket.onopen = () => {
      interval = handleText();
      handleTimer();
    }
  socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
    clearInterval(interval)
    await matchFounded()
        loadPage(`/game/${data.game_id}`);
    }
}
async function App() {
  await connectToSocket();
}

App();
