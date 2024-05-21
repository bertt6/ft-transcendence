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
class CurrentMatchups extends BaseComponent {
    constructor(state, parentElement) {
        super(state, parentElement);
    }

    handleHTML() {
        return `
            ${this.state.matchUps.map(matchUp => `
                <div class="matchup">
                    <div class="matchup-player">
                        <span>${matchUp.players[0]}</span>
                    </div>
                    <div class="matchup-player">
                        <span>${matchUp.players[1]}</span>
                    </div>
                </div>
            `).join("")}
            `
    }
    render() {
        this.html = this.handleHTML();
        super.render();
    }
}
function handleButtons(players, socket) {
    const nickname = getActiveUserNickname();
    const buttonWrapper = document.getElementById("button-wrapper");
    let player = players.find(player => player.nickname === nickname)
    if (!player)
        return
    if (player.owner) {
        buttonWrapper.innerHTML = `<button id="start-button">Start</button>`
        let button = document.getElementById("start-button");
        button.addEventListener("click", () => {
            socket.send(JSON.stringify({send_type: "start", data: {nickname: nickname}}));
        });
    } else {
        buttonWrapper.innerHTML = `<button id="ready-button">Ready</button>`
        let button = document.getElementById("ready-button");
        button.addEventListener("click", () => {
            socket.send(JSON.stringify({send_type: "ready", data: {nickname: nickname}}));
        });
    }
}

function handleErrorStates(data,socket) {
    socket.close();
    notify(data.message, 3, 'error')
    setTimeout(() => {
        console.log("redirecting")
        loadPage("/home/")
    }, 3000);
}
function handleMatchups(data) {
    let parentElement = document.getElementById("matchups");
    const currentMatchups = new CurrentMatchups({matchUps: data}, parentElement);
    currentMatchups.render();
}
function renderTournamentInfo(response, socket) {
    let parentElement = document.getElementById("tournament-participants");
    const tournamentPlayers = new TournamentPlayers({players: response.data.players}, parentElement);
    tournamentPlayers.render();
    handleButtons(response.data.players, socket)
    document.getElementById("tournament-header").innerText = response.data.tournament_name;
}

function handleGameRedirection(response) {
    for (let game of response.data) {
        if (game.players.includes(getActiveUserNickname())) {
            console.log("redirecting to game")
            loadPage(`/game/${game.game_id}`)
        }
    }
}

function handleFinishedTournament(response) {
    let winner = response.data.winner;
    console.log("winner", winner)
    let winnerHTML = `
          <div class="winner-wrapper">
          <div class="winner-image-wrapper">
            <img src="${BASE_URL}${winner.profile_picture}" alt="" />
          </div>
          <h1>Winner is ${winner.nickname}</h1>
        </div>
  `

    let element = document.createElement("div");
    element.id = "game-message-wrapper";
    element.innerHTML = winnerHTML;
    document.body.appendChild(element);
    setTimeout(() => {
        loadPage("/home/")
    }, 5000);
}

function connectToSocket() {
    let errorStates = [
        "invalid_profile",
        "invalid_tournament",
        "tournament_started",
        "players_not_ready",
        "invalid_params",
        "tournament_finished",
        "tournament_started",
    ]
    try {
        const nickname = getActiveUserNickname();
        const tournamentId = window.location.pathname.split("/").filter(Boolean)[1];
        const url = `${WEBSOCKET_URL}/tournament/?nickname=${nickname}&tournament_id=${tournamentId}`;
        const socket = new WebSocket(url);

        socket.onopen = () => {
            if (localStorage.getItem("tournament_id")) {
                localStorage.removeItem("tournament_id");
                socket.send(JSON.stringify({send_type: "checkMatch"}));
            }
        }
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (errorStates.includes(response.send_type))
                handleErrorStates(response,socket);
            if (response.send_type === "tournament_info")
                renderTournamentInfo(response, socket);
            else if (response.send_type === "game_info")
                handleGameRedirection(response);
             else if (response.send_type === "tournament_finished")
                handleFinishedTournament(response);
             else if(response.send_type === "current_matchups")
                handleMatchups(response.data);
        }
        socket.onclose = () => {
            console.log("disconnected from the server");
        }
        socket.onerror = (error) => {
            console.error(error);
        }
            window.addEventListener("popstate", () => {
            socket.close();
    });
    } catch (e) {
        console.error(e);
    }
}

async function App() {
    connectToSocket()
}

App().catch(e => console.error(e))