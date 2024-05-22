import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {API_URL, checkIfAuthRequired, loadPage} from "./spa.js";
import {getActiveUserNickname, getProfile} from "./utils.js";

let socket = null;

async function handleAcceptCallback(data, request_id) {
    let {profile} = data;
    let body = {
        nickname: profile.nickname,
        request_id: request_id,
    }
    try {
        let response = await request(`profile/friends/`, {
            'method': 'POST',
            body: JSON.stringify(body),
        })
    } catch (error) {
        console.error(error)
    }
}

async function handleRejectedCallback(request_id) {
    try {
        let response = await request(`request/${request_id}/`, {
            'method': 'PUT',
            body: JSON.stringify({status: 'rejected'}),
        })
    } catch (error) {
        console.error(error)
    }
}

export async function getSocket() {
    const nickname = getActiveUserNickname();
    const url = `/ws/requests/${nickname}`;
    return new Promise((resolve, reject) => {
        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                resolve(socket);
            } else {
                socket.onopen = () => resolve(socket);
                socket.onerror = (error) => reject(error);
            }
        } else {
            socket = new WebSocket(url);

            socket.onopen = () => {
                resolve(socket);
            };

            socket.onerror = (error) => {
                reject(error);
            };
        }
    });
}

async function handleGameAcceptedCallback(data) {
    let bodyToSend = {
        player1: data.receiver,
        player2: data.sender,
        request_id: data.request_id
    }
    try {
        let response = await request(`game/create-game/`, {
            'method': 'POST',
            body: JSON.stringify(bodyToSend),
        })
        if(!response.ok)
        {
            notify('An error occurred while creating the game', 3, 'error');
            return;
        }
        let sendBody = {
            request_type: "created_game",
            sender: data.sender,
            game_id: response.game_id,
        }
        socket.send(JSON.stringify(sendBody));
        loadPage(`/game/${response.game_id}/`);
    } catch (error) {
        console.error(error)
    }
}

function addSocketTestButton() {
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
    if (!checkIfAuthRequired())
        return;
    let socket = await getSocket();
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
                    () => handleAcceptCallback({profile: sender_profile}, data.request_id),
                    () => handleRejectedCallback(data.request_id));
            else if (data.request_type === "game")
                notify.request(
                    `You have a game request from ${data.sender}`,
                    {sender_profile},
                    () => handleGameAcceptedCallback(data),
                    () => handleRejectedCallback(data.request_id)
                );
            else if (data.request_type === "created_game") {
                loadPage(`/game/${data.game_id}/`);
            }
        } catch (error) {
            console.error(error)
        }
    }
}

App().catch((err) => console.error(err));