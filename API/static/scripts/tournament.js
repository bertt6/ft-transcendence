import {BASE_URL, loadPage, WEBSOCKET_URL} from "./spa.js";
import {getActiveUserNickname} from "./utils.js";
import BaseComponent from "../components/Component.js";
import {notify} from "../components/Notification.js";
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
function handleButtons(players,socket)
{
    const nickname = getActiveUserNickname();
    const buttonWrapper = document.getElementById("button-wrapper");
    let player = players.find(player => player.nickname === nickname)
    if(!player)
        return
    if(player.owner)
    {
        buttonWrapper.innerHTML = `<button id="start-button">Start</button>`
        let button = document.getElementById("start-button");
        button.addEventListener("click", () => {
            socket.send(JSON.stringify({send_type: "start", data: {nickname: nickname}}));
        });
    }
    else
    {
        buttonWrapper.innerHTML = `<button id="ready-button">Ready</button>`
        let button = document.getElementById("ready-button");
        button.addEventListener("click", () => {
            socket.send(JSON.stringify({send_type: "ready", data: {nickname: nickname}}));
        });
    }
}
function handleErrorStates(data)
{
    notify(data.message,3,'error')
}
function renderTournamentInfo(response,socket)
{
     let parentElement = document.getElementById("tournament-participants");
    const tournamentPlayers = new TournamentPlayers({players: response.data.players}, parentElement);
    tournamentPlayers.render();
    handleButtons(response.data.players,socket)
    document.getElementById("tournament-header").innerText = response.data.tournament_name;
}
function connectToSocket()
{
    let errorStates = [
        "invalid_profile",
        "invalid_tournament",
        "tournament_started",
        "players_not_ready",
    ]
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
            const response = JSON.parse(event.data);
            console.log("socket sent data", response)
            if(errorStates.includes(response.send_type))
            {
                handleErrorStates(response);
            }
            if(response.send_type === "tournament_info")
            {
                renderTournamentInfo(response,socket);
            }
            else if(response.send_type === "game_info")
            {
                handleGameRedirection(response);
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