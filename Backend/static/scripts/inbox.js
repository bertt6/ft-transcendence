import BaseComponent from "../components/Component.js";
import {request} from "./Request.js";
import {API_URL, BASE_URL} from "./spa.js";

class Inbox  extends BaseComponent{
    constructor(state,parentElement=null){
        super(state,parentElement);
    }
    handleEmptyInboxHTML(){
        return `
            <li class="inbox-list-item">
              <span>No new notifications</span>
            </li>
        `
    }
    parseMessage(request){
        switch (request.type){
            case 'friend':
                return `You have a friend request from ${request.sender.nickname}`;
            case 'pong':
                return `${request.sender} invited you to a game of pong`;
            default:
                return `You have a new notification from ${request.sender.nickname}`;
        }
    }
    handleInboxHTML(){
        return `
            ${this.state.requests.map(request => `
          <li class="inbox-element">
              <div>
                <div class="inbox-sender-image">
                  <img src="${BASE_URL}${request.sender.profile_picture}" alt="" />
                </div>
                <div>
                 ${this.parseMessage(request)}
              </div>
              </div>
              <div class="inbox-element-interactions">
                <button id="interaction-accept">Accept</button>
                <button id="interaction-reject">Reject</button>
              </div>
        </li>`).join('')}
        `
    }
    render() {
        if(this.state.requests.length === 0){
            this.parentElement.innerHTML = this.handleEmptyInboxHTML();
        }
        else{
            this.parentElement.innerHTML = this.handleInboxHTML();
        }
    }
}
function getRequests() {
    try{

    return request(`${API_URL}/request/`, {
        method: 'GET',
    });
    }
    catch (error)
    {
        console.error(error)
    }
}
async function App(){
    const inboxList = document.getElementById('inbox-list');
    if(!inboxList){
        throw new Error("No inbox list found")
    }
    let requests = await getRequests();
    console.log(requests);
    const inbox = new Inbox({requests:requests},inboxList);
    inbox.render();
}

App().catch(console.error)