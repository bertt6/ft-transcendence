import {getActiveUserNickname} from "./utils.js";
import {checkIfAuthRequired} from "./spa.js";

let socket;

export function getStatusSocket() {
    const nickname = getActiveUserNickname();
    const url  = `ws://localhost:8000/ws/status/${nickname}`;
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

async function App()
{
    if (checkIfAuthRequired())
        return;
    let socket = await getStatusSocket();
}
App().catch(e => console.error(e))
