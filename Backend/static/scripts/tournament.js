import {BASE_URL, loadPage, WEBSOCKET_URL} from "./spa.js";
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
function handleButtons(players)
{
    console.log("players",players)
    const nickname = getActiveUserNickname();
    const buttonWrapper = document.getElementById("button-wrapper");
    let player = players.data.find(player => player.nickname === nickname)
    if(!player)
        return
    if(player.owner)
        buttonWrapper.innerHTML = `<button id="start-button">Start</button>`
    else
        buttonWrapper.innerHTML = `<button id="ready-button">Ready</button>`
}
function connectToSocket()
{
    try
    {
        const nickname = getActiveUserNickname();
        const  tournamentId =window.location.pathname.split("/").filter(Boolean)[1];
        const url = `${WEBSOCKET_URL}/tournament/?nickname=${nickname}&tournament_id=${tournamentId}`;
        const socket = new WebSocket(url);
        socket.onopen = () => {
            console.log("connected to the server");
        }
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("socket sent data", data)
            if(data.send_type === "player_list")
            {
                let parentElement = document.getElementById("tournament-participants");
                const tournamentPlayers = new TournamentPlayers({players: data.data}, parentElement);
                handleButtons(data)
                tournamentPlayers.render();
            }
            else if(data.send_type === "game_info")
            {
                handleGameRedirection(data);
            }
        }
        socket.onclose = () => {
            console.log("disconnected from the server");
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