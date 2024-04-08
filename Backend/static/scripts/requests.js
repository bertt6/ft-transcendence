import {notify} from "../components/Notification.js";

async function App()
{
    const nickname = localStorage.getItem('activeUserNickname');
      let socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
  socket.onopen = function (e) {
    console.log("Sending to server");
    let data = {
        'sender':nickname,
        'receiver':'test123',
        'request_type':"friend"
    }
    socket.send(JSON.stringify(data));
  }
  socket.onmessage = function (e) {
      notify("New request", 3, "success")
  }
}

App().catch((err) => console.error(err));