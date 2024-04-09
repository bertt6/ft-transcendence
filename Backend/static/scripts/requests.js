import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {API_URL} from "./spa.js";
async function getProfile(nickname)
{
    try{
        let data = await request(`${API_URL}/profile/${nickname}`,{method:'GET'});
        let profilePhoto = document.getElementById('profile-photo');
        profilePhoto.setAttribute('href', `/profile/${data.nickname}`)
    }
    catch (error)
    {
        console.error(error)
    }
}
async function App()
{
    document.getElementById('testButton').addEventListener('click', async () => {
        const nickname = localStorage.getItem('activeUserNickname');
        socket.send(JSON.stringify({
            request_type:"friend",
            sender:nickname,
            receiver:nickname === 'test123' ? 'MKM' : 'test123'
        }));
    }
    );
    const nickname = localStorage.getItem('activeUserNickname');
    let socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    socket.onopen = function (e) {
  }
  socket.onmessage = function (e) {

    const data = JSON.parse(e.data);
      console.log(data)
    if(data.request_type === "friend")
    {
        notify.friendRequest(`You have a friend request from ${data.sender}`);
    }
  }
}
App().catch((err) => console.error(err));