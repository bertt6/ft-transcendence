import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {API_URL} from "./spa.js";
import {getProfile} from "./utils.js";
let socket = null;

async function handleAcceptCallback(profile,request_id)
{
    let body ={
        nickname:profile.nickname,
        request_id:request_id,
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
export function getSocket() {
    if (socket === null || socket.readyState === WebSocket.CLOSED) {
        const nickname = localStorage.getItem('activeUserNickname');
        if (!nickname)
            return null;
        socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    }
        return socket;
}
function addSocketTestButton(){
    const socket = getSocket();
    let button = document.createElement('button');
    button.id = 'testButton';
    button.innerText = 'Test';
    button.addEventListener('click', async () => {
        const nickname = localStorage.getItem('activeUserNickname');
        socket.send(JSON.stringify({
            request_type: "friend",
            sender: nickname,
            receiver: nickname === 'test123' ? 'MKM' : 'test123'
        }));
    });
}
async function App() {
    let socket = getSocket();
    if (!socket)
        return;
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