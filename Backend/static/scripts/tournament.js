import {WEBSOCKET_URL} from "./spa.js";
import {getActiveUserNickname} from "./utils.js";

function connectToSocket()
{
    try{
        const nickname = getActiveUserNickname();
        const  tournamentId =window.location.pathname.split("/").filter(Boolean)[1];
        const url = `${WEBSOCKET_URL}/tournament?nickname=${nickname}tournament_id=${tournamentId}`;
    }
    catch (e)
    {
        console.error(e);
    }
}
async function App()
{
connectToSocket()
}
App().catch(e => console.error(e))