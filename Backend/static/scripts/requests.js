import {notify} from "../components/Notification.js";

async function App()
{
    const nickname = localStorage.getItem('activeUserNickname');
    let socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    socket.onopen = function (e) {
    let data = {
        'sender':nickname,
        'receiver':nickname === 'MKM' ? 'test123' : 'MKM',
        'request_type':"friend"
    }
  }
  socket.onmessage = function (e) {
      console.log("Received from server");
      notify("New request", 3, "success")
  }
}
App().catch((err) => console.error(err));