import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {API_URL} from "./spa.js";
async function getProfile(nickname)
{
    try{
        return  await request(`${API_URL}/profile-with-nickname/${nickname}`,{method:'GET'});
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
    });
    const nickname = localStorage.getItem('activeUserNickname');
    let socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    socket.onopen = function (e) {
  }
  socket.onmessage = async function (e) {

    try
    {
        const data = JSON.parse(e.data);
        const profile = await getProfile(data.sender);
        if(data.request_type === "friend")
    {
        notify(`${profile.nickname} wants to be your friend`,3,'success');
    }
    }
    catch (error)
    {
        console.error(error)
    }

  }
}
App().catch((err) => console.error(err));