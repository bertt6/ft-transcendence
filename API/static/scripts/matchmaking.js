import {loadPage} from "./spa.js";
import {getActiveUserNickname} from "./utils.js";


function handleText() {
  const BASE_TEXT = "FINDING A MATCH";
  const text = document.getElementById("matchmaking text");
  let textIndex = 0;
  return setInterval(() => {
      text.innerText = BASE_TEXT + ".".repeat(textIndex % 4);
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
  const nickname = getActiveUserNickname()
    const socket = new WebSocket(`/ws/matchmaking/${nickname}`);
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
  document.getElementById("close-matchmaking").addEventListener('click', () => {
    socket.send(JSON.stringify({
      request_type: "disconnect",
    }))
    loadPage('/home/')
  })
  window.addEventListener('popstate', (event) => {
    socket.close()
      }
  );
}
async function App() {
  await connectToSocket();
}

App();
