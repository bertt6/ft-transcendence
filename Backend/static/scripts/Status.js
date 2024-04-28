let socket;

export function getStatusSocket(url) {
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
    let nickname = localStorage.getItem('activeUserNickname');
    let socket = await getStatusSocket(`ws://localhost:8000/ws/status/${nickname}`);
}
App().catch(e => console.error(e))
