function handleText() {
  const BASE_TEXT = "FINDING A MATCH";
  const text = document.getElementById("matchmaking text");
  console.log(text);
  let textIndex = 0;
  setInterval(() => {
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
async function App() {
  handleText();
  handleTimer();
}
App();
