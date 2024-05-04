import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {API_URL, checkIfAuthRequired, loadPage} from "./spa.js";
import {getActiveUserNickname, getProfile} from "./utils.js";
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
export function getSocket() {
    if (socket === null || socket.readyState === WebSocket.CLOSED) {
        const nickname = getActiveUserNickname();
        if (nickname === null || nickname === undefined)
            return null;
        socket = new WebSocket(`ws://localhost:8000/ws/requests/${nickname}`);
    }
        return socket;
}
async function handleGameAcceptedCallback(data)
{
    console.log(data)
    let bodyToSend = {
        player1: data.receiver,
        player2:data.sender,
        request_id:data.request_id
    }
    try{
        let response = await request(`${API_URL}/create-game/`,{
            'method':'POST',
            body:JSON.stringify(bodyToSend),
        })
        console.log("Game created",response)
        let sendBody = {
            request_type: "created_game",
            sender: data.sender,
            game_id: response.game_id,
        }
        socket.send(JSON.stringify(sendBody));
        loadPage(`/game/${response.game_id}/`);
    }
    catch (error)
    {
        console.error(error)
    }
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
    if(!checkIfAuthRequired())
        return;
    let socket = getSocket();
    if (!socket)
        return;
    socket.onopen = function (e) {
    }
    socket.onmessage = async function (e) {
        try {
            const data = JSON.parse(e.data);
            const sender_profile = await getProfile(data.sender);
            if (data.request_type === "friend")
                notify.request(
                    `You have a friend request from ${data.sender}`,
                     {sender_profile},
                     () => handleAcceptCallback({profile:sender_profile},data.request_id),
                () => handleRejectedCallback(data.request_id));
            else if (data.request_type === "game")
                notify.request(
                    `You have a game request from ${data.sender}`,
                    {sender_profile},
                    () => handleGameAcceptedCallback(data),
                    () => handleRejectedCallback(data.request_id)
                );
            else if (data.request_type === "created_game")
            {
                console.log(data)
                loadPage(`/game/${data.game_id}/`);
            }
        }
        catch (error) {
            console.error(error)
        }
    }
}
App().catch((err) => console.error(err));