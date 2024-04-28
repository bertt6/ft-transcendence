import BaseComponent from "../components/Component.js";
import {request} from "./Request.js";
import {API_URL, BASE_URL, checkIfAuthRequired} from "./spa.js";
import {getActiveUserNickname} from "./utils.js";

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
        console.log(request.type)
        switch (request.type){
            case 'friend':
                return `You have a friend request from ${request.sender.nickname}`;
            case 'game':
                return `${request.sender.nickname} invited you to a game of pong`;
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
                <button data-type="accept">Accept</button>
                <button data-type="reject">Reject</button>
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
        let buttonWrapper = this.parentElement.querySelector('.inbox-element-interactions');
        if(!buttonWrapper){
            return
        }
        let acceptButton = buttonWrapper.querySelector('[data-type="accept"]');
        let rejectButton = buttonWrapper.querySelector('[data-type="reject"]');
        acceptButton.addEventListener('click',async ()=>{
            let response = await request(`${API_URL}/request/${request.sender.nickname}/`,{
                'method':'PUT',
                body:JSON.stringify({status:'accepted'}),
            })
            console.log(response)
        })
        rejectButton.addEventListener('click',async ()=>{
            let response = await request(`${API_URL}/request/${request.sender.nickname}/`,{
                'method':'PUT',
                body:JSON.stringify({status:'rejected'}),
            })
            console.log(response)
        })
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
async function handleProfileImage(){
        let profile = await request(`${API_URL}/profile/`,{
        method:'GET',
    })
    let image = document.getElementById('profile-image');
    if(image)
    {
        image.src = `${BASE_URL}${profile.profile_picture}`;
    }
    document.getElementById('profile-image-wrapper').setAttribute('href',`/profile/${profile.nickname}`)
}
async function App(){
    if(getActiveUserNickname() === null || !checkIfAuthRequired(window.location.pathname))
        return;
    const inboxList = document.getElementById('inbox-list');
    if(!inboxList)
    {
        throw new Error("Inbox Error: Inbox list not found or user not logged in")
    }

    await handleProfileImage();
    let requests = await getRequests();
    const inbox = new Inbox({requests:requests},inboxList);
    inbox.render();
}

App().catch(console.error)