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
      notify.friendRequest("Request sent1")
      notify.friendRequest("Request sent2")
      notify.friendRequest("Request sent3")
      notify.friendRequest("Request sent4")
      notify.friendRequest("Request sent5")
  }
  socket.onmessage = function (e) {
      console.log("Received from server");
  }
}
App().catch((err) => console.error(err));