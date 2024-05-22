import BaseComponent from "../components/Component.js";
import {request} from "./Request.js";
import {assignRouting, BASE_URL, checkIfAuthRequired, loadPage, setCookie, getCookie} from "./spa.js";
import {getActiveUserNickname, getProfile} from "./utils.js";

class ProfileData extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }

    handleHtml() {
        return `
    <div class="main-profile-data" id="inbox-data-wrapper">
        <pong-redirect class="inbox-profile-wrapper" id="profile-image-wrapper">
          <img src="" id="profile-image" alt="" />
        </pong-redirect>
        <div class="inbox-wrapper">
          <input type="checkbox" id="input-button" />
          <label for="input-button" class="input-label">
            <img src="/static/public/inbox.svg" alt="cannot load" />
          </label>
          <ul class="inbox-list" id="inbox-list">
          </ul>
        </div>
        <div class="logout-wrapper" id="logout-wrapper">
            <label id="logout-button">
                <img src="/static/public/logout.svg" alt="cannot load">
            </label>
        </div>
      </div>
        `
    }

    render() {
        this.html = this.handleHtml();

        let tmpWrapper = document.createElement('div');
        tmpWrapper.innerHTML = this.html;
        document.body.insertAdjacentHTML('afterbegin', this.html);
        document.getElementById('logout-wrapper')?.addEventListener('click', async () => {
            const refresh_token = getCookie('refresh_token')
            if (refresh_token === 'null')
                return
            await request(`auth/token/blacklist/`, {
                method: 'POST',
                body: JSON.stringify({
                    refresh: refresh_token
                }),
            });
            localStorage.clear()
            setCookie('access_token', null, 1);
            setCookie('refresh_token', null, 1);
            loadPage('/auth/login/')
        })
        assignRouting();
    }
}

class Inbox extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }

    handleEmptyInboxHTML() {
        return `
            <li class="inbox-list-item">
              <span>No new notifications</span>
            </li>
        `
    }

    parseMessage(request) {
        switch (request.type) {
            case 'friend':
                return `You have a friend request from ${request.sender.nickname}`;
            case 'game':
                return `${request.sender.nickname} invited you to a game of pong`;
            default:
                return `You have a new notification from ${request.sender.nickname}`;
        }
    }

    handleInboxHTML() {
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
        if (this.state.requests.length === 0) {
            this.parentElement.innerHTML = this.handleEmptyInboxHTML();
        } else {
            this.parentElement.innerHTML = this.handleInboxHTML();
        }
        let buttonWrapper = this.parentElement.querySelector('.inbox-element-interactions');
        if (!buttonWrapper) {
            return
        }
        let acceptButton = buttonWrapper.querySelector('[data-type="accept"]');
        let rejectButton = buttonWrapper.querySelector('[data-type="reject"]');
        acceptButton.addEventListener('click', async () => {
            let response = await request(`request/${request.sender.nickname}/`, {
                'method': 'PUT',
                body: JSON.stringify({status: 'accepted'}),
            })
        })
        rejectButton.addEventListener('click', async () => {
            let response = await request(`request/${request.sender.nickname}/`, {
                'method': 'PUT',
                body: JSON.stringify({status: 'rejected'}),
            })
        })
    }
}

function getRequests() {
    try {
        return request(`request/`, {
            method: 'GET',
        });
    } catch (error) {
        console.error(error)
    }
}

async function handleProfileImage() {
    const profile = await getProfile();
    let image = document.getElementById('profile-image');
    if (image) {
        image.src = `${BASE_URL}${profile.profile_picture}`;
    }
    document.getElementById('profile-image-wrapper').setAttribute('href', `/profile/${profile.nickname}`)
}

function checkInboxRequired() {
    let nonRequiredPaths = ['/login/', '/register/', '/auth/verification/'];
    return !nonRequiredPaths.includes(window.location.pathname);

}

export async function createInbox() {
    if (getActiveUserNickname() === null || !checkIfAuthRequired(window.location.pathname) && checkInboxRequired(window.location.pathname))
        return;
    if(document.getElementById('inbox-data-wrapper'))
        return;
    let profile = new ProfileData({}, document.getElementById('profile-data'));
    profile.render();
    const inboxList = document.getElementById('inbox-list');
    if (!inboxList) {
        throw new Error("Inbox Error: Inbox list not found or user not logged in")
    }
    await handleProfileImage();
    let requests = await getRequests();
    const inbox = new Inbox({requests: requests}, inboxList);
    inbox.render();
}

window.addEventListener('popstate', () => {
    if (checkInboxRequired()) {
        if (document.getElementById("inbox-data-wrapper"))
            return
        let profile = new ProfileData({}, document.getElementById('profile-data'));
        profile.render();
    } else {
        document.getElementById('data-wrapper').remove();
    }
})
createInbox().catch(console.error)