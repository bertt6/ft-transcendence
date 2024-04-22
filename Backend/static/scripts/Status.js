let socket;

function getStatusSocket(url) {
    return new Promise((resolve, reject) => {
        if (socket) {
            resolve(socket);
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
    let socket = await getStatusSocket(`ws://localhost:8000/ws/status/`);
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
    }
}
App().catch(e => console.error(e))
export default getStatusSocket;
