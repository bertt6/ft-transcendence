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
async function handleAcceptCallback(profile,request_id)
{
    let body ={
        nickname:profile.nickname,
    }
    try{
        let response = await request(`${API_URL}/profile/friends`,{
            'method':'POST',
            body:JSON.stringify(body),
        })
        console.log(response)
    }
     catch (error)
     {
         console.log(error)
    }
    try{
        let response = await request(`${API_URL}/request/${request_id}`,{
            'method':'PUT',
            body:JSON.stringify({status:'accepted'}),
        })
        console.log(response)
    }
    catch (error)
    {
        console.error(error)
    }
}
async function handleRejectedCallback(request_id)
{
    try{
        let response = await request(`${API_URL}/request/${request_id}`,{
            'method':'PUT',
            body:JSON.stringify({status:'rejected'}),
        })
        console.log(response)
    }
    catch (error)
    {
        console.error(error)
    }
}
async function App() {
    document.getElementById('testButton').addEventListener('click', async () => {
        const nickname = localStorage.getItem('activeUserNickname');
        socket.send(JSON.stringify({
            request_type: "friend",
            sender: nickname,
            receiver: nickname === 'test123' ? 'MKM' : 'test123'
        }));
    });
    const nickname = localStorage.getItem('activeUserNickname');
    let socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    socket.onopen = function (e) {
    }
    socket.onmessage = async function (e) {
        try {
            const data = JSON.parse(e.data);
            const profile = await getProfile(data.sender);
            if (data.request_type === "friend")
                notify.request(
                    `You have a friend request from ${data.sender}`,
                     {profile},
                     () => handleAcceptCallback(profile,data.request_id),
                () => handleRejectedCallback(data.request_id));
        } catch (error) {
            console.error(error)
        }
    }
}
App().catch((err) => console.error(err));