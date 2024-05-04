import {BASE_URL, WEBSOCKET_URL} from "./spa.js";
import {getActiveUserNickname} from "./utils.js";
import BaseComponent from "../components/Component.js";
class TournamentPlayers extends BaseComponent {
    constructor(state, parentElement) {
        super(state, parentElement);
    }

    handleHTML() {
        return `
            ${this.state.players.map(player => `
                           <div class="tournament-participant">
                  <div class="participant-details">
                    <div class="participant-image-wrapper">
                      <img
                        src="${BASE_URL}${player.profile_picture}"
                        alt=""
                      />
                    </div>
                    <span>${player.nickname}</span>
                  </div>
                </div>
            `).join("")}
        `;
    }
    render() {
        this.html = this.handleHTML();
        super.render();

    }
}
function connectToSocket()
{
    try{
        const nickname = getActiveUserNickname();
        const  tournamentId =window.location.pathname.split("/").filter(Boolean)[1];
        const url = `${WEBSOCKET_URL}/tournament/?nickname=${nickname}&tournament_id=${tournamentId}`;
        const socket = new WebSocket(url);
        let parentElement = document.getElementById("tournament-participants");
        socket.onopen = () => {
            console.log("connected to the server");
        }
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const tournamentPlayers = new TournamentPlayers({players: data}, parentElement);
            tournamentPlayers.render();
        }
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