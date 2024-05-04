import {request} from "./Request.js";
import {API_URL, assignRouting, BASE_URL} from "./spa.js";
import BaseComponent from "../components/Component.js";
import {escapeHTML} from "./utils.js";
class TournamentList extends BaseComponent{
    constructor(state,parentElement)
    {
        super(state,parentElement);
    }
    handleHtml()
    {
        return `
     ${this.state.tournaments.map(tournament => `
          <pong-redirect href="/tournament/${tournament.id}/" class="tournament-element">
                <div class="element-data">
                  <div>
                    <h2>${escapeHTML(tournament.name)}</h2>
                  </div>
                </div>
                <div class="images-style">
                  ${
                    tournament.current_participants.map(participant => `
                    <div class="players-img">
                    <img
                      src="${BASE_URL}${participant.profile_picture}"
                      alt=""
                    />
                  </div>
                  `).join('')
        }
                </div>
                <div class="tournament-point">
                  <h2>IN GAME</h2>
                </div>
                <div class="tournament-order">
                  <h2>3 MIN AGO</h2>
                </div>
                <div>
                  <img src="/static/public/more.svg" alt="" />
                </div>
              </pong-redirect>
     `).join('')} 
        `;
    }
    render() {
        this.html = this.handleHtml();
        super.render();
        assignRouting();
    }
}
async function fetchTournaments()
{
    try{
    let data = await request(`${API_URL}/tournaments/`, {method: 'GET'});
    let tournamentList = new TournamentList({tournaments: data}, document.getElementById("tournament-wrapper"));
    tournamentList.render();
    }
    catch (e)
    {
        console.error(e);
    }
}
async function App()
{
    await fetchTournaments();
}
App().catch(console.error)