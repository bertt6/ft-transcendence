import BaseComponent from "../components/Component.js";
import {API_URL, assignRouting, BASE_URL, loadPage} from "./spa.js";
import { notify } from "../components/Notification.js";
import { request } from "./Request.js";
import {calculateDate, escapeHTML, getActiveUserNickname, parseErrorToNotify} from "./utils.js";

class History extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.handleHTML()
    }

    handleHTML() {
        return `
            <div class="histories-wrapper">
            ${this.state.histories.map(history => `
              <div class="history-wrapper">
                <div class="friend-info">
                  <div class="history-type"><h5>1v1</h5></div>
                </div>
                <div class="history-data">
                  <h5>${history.player1.nickname}</h5>
                  <h4>VS</h4>
                  <h5>${history.player2.nickname}</h5>
                </div>
                <div class="history-score">
                 <h5>${history.winner.nickname}</h5>
                </div>
                <div>
                  <h5>${calculateDate(history.date)}</h5>
                </div>
              </div>
            `).join('')}
            </div>
          </div>
`
    }

    render() {
        this.parentElement.innerHTML = this.handleHTML();
    }
}
class BlockedUsers extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    async removeBlockedUser(nickname, index) {
        try {
            let data = await request('profile/block/', {
                method: "POST",
                body: JSON.stringify({
                    nickname: nickname
                })
            });
            if(!data.ok)
            {
                notify('Error removing blocked user',3,'error');
                return
            }
            let wrapper = document.getElementById(`${index}-blocked-user-wrapper`)
            wrapper.remove()
            notify('User unblocked', 3, 'success');
        } catch (error) {
            console.error('Error:', error);
            notify('Error fetching friends', 3, 'error');
        }
    }

    handleHTML() {
        return `
        <div class="blocked-users-wrapper">
            ${this.state.blockedUsers.map((user, index) => `
                <div id="${index}-blocked-user-wrapper" class="blocked-user-wrapper">
                    <div class="blocked-user-info">
                        <div class="blocked-user-image">
                            <img src="${user.profile_picture}" alt="" />
                        </div>
                        <div class="blocked-user-data">
                            <h6>${user.nickname}</h6>
                        </div>
                    </div>
                    <button id="${index}-button" class="friends-button" >Unblock</button>
                </div>
            `).join('')}
        </div>
        `;
    }

    render() {
        this.parentElement.innerHTML = this.html;
        for (let i = 0; this.state.blockedUsers.length > i; i++) {
            console.log(this.state.blockedUsers[i].id)
            document.getElementById(`${i}-button`).addEventListener("click", () =>
                this.removeBlockedUser(this.state.blockedUsers[i].nickname, i)
            )
        }

    }
}


function calculateWinRate(wins, losses) {
    let winRate = wins + losses === 0 ? 0 : (wins / (wins + losses)) * 100;
    return parseFloat(winRate.toFixed(2));
}

class Stats extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    handleHTML() {
        return `
    <div class="stats-wrapper">
    <div class="stats-row">
        <div class="stats-item">
            <h3>Total Games</h3>
            <p class="stats-value">${this.state.statsInfo.total_games}</p>
        </div>
        <div class="stats-item">
            <h3>Total Win</h3>
            <p class="stats-value">${this.state.statsInfo.total_wins}</p>
        </div>
    </div>
    <div class="stats-row">
        <div class="stats-item">
            <h3>Total Losses</h3>
            <p class="stats-value">${this.state.statsInfo.total_losses}</p>
        </div>
         <div class="stats-item">
            <h3>Win Rate</h3>
            <p class="stats-value">%${calculateWinRate(parseInt((this.state.statsInfo.total_wins)), parseInt(this.state.statsInfo.total_losses))}</p>
        </div> 
    </div>
</div>
    `;
    }

    render() {
        this.parentElement.innerHTML = this.html;
    }
}
class Friends extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML()
    }


    async removeFriend(id, index) {
        try {
            let data = await request('profile/friends/', {
                method: "DELETE",
                body: JSON.stringify({
                    friend_id: id
                })
            });
            let wrapper = document.getElementById(`${index}-friend-wrapper`)

            wrapper.remove()
            return data;
        } catch (error) {
            console.error('Error:', error);
            notify('Error fetching friends', 3, 'error');
        }
    }
    

    handleHTML() {
        return `
            <div class="friends-wrapper">
            ${this.state.friends.map((friend, index) => `
              <div id="${index}-friend-wrapper" class="friend-wrapper">
                <div class="friend-info">
                  <div class="friend-image">
                    <img src="${friend.profile_picture}" alt="" />
                  </div>
                  <pong-redirect href="/profile/${friend.nickname}/" class="friend-data">
                    <span>${friend.nickname}</span>
                  </pong-redirect>
                </div>
                <div class="friend-more">
                  <div><button id="${index}-button" class="friends-button">Unfriend</button></div>
                </div>
              </div>
            `).join('')}
          </div>
        `
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    render() {
        super.render();
        assignRouting();
        for (let i = 0; this.state.friends.length > i; i++) {
            console.log(this.state.friends[i].id)
            document.getElementById(`${i}-button`).addEventListener("click", () =>
                this.removeFriend(this.state.friends[i].id, i)
            )
        }
    }
}
class ProfileInfo extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }


    handleEditHTML() {
        const { nickname, first_name, bio, profile_picture } = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                X
                    </button>
                </div>
        <form style="display: flex; flex-direction: column; align-items: center" id="update-form">
              <div class="profile-photoo">
                <img
                    id='profile-photoo'
                  src="${BASE_URL}${profile_picture}"
                  alt=""
                  class=""
                />
                <div>
                    <label for="profile-photo" class="custom-file-upload">
                    </label>
                    <input id="profile-photo" type="file" style="display: none"/>
                </div>
              </div>
              <div>
                <input class="transparent-input" id="profile-nickname" value="${nickname}"/>
              </div>
              <div>
                <textarea id="profile-bio" cols="30" rows="5"  class="transparent-input">${bio ? bio : 'No bio available'}</textarea>  
              </div>
        <button class="pong-button" id="save-button" type="submit">save</button>
            </form>
        </div>
        `
    }
    handleHTML() {
        const { nickname, first_name, bio, profile_picture } = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                    <img src="/static/public/edit.svg" alt="">
                    </button>
                </div>
              <div class="profile-photoo">
                <img
                  src="${BASE_URL}${profile_picture}"
                  alt=""
                />
              </div>
              <div class='${nickname.length > 10 ? "profile-nickname" : ''}'>
                <h1>${nickname}</h1>
              </div>
              <div>
                <p>
                ${bio ? bio : 'No bio available'}
                </p>
              </div>`
    }

    updateProfile = async (formData) => {
        try {
            let response = await request(`profile/`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Content-Type': '',
                }
            });
            console.log(response)
            if(!response.ok)
            {
                let message = parseErrorToNotify(response)
                notify(message, 3, 'error')
                return
            }
            notify('Profile updated', 3, 'success');

            this.setState({ ...this.state, profile: response });
            localStorage.setItem('activeUserNickname', response.nickname);
        }
        catch (error) {
            console.error('Error:', error);
            notify('Error updating profile', 3, 'error')
        }
    }


    render() {
        this.parentElement.innerHTML = this.state.isEditing ? this.handleEditHTML() : this.handleHTML();
        const updateForm = document.getElementById('update-form');

        if (updateForm) {
            updateForm.addEventListener('submit', async (e) => {
                e.preventDefault()
                let formData = new FormData();
                let image = document.getElementById('profile-photo')
                if (image.files.length > 0) {
                    formData.append('profile_picture', image.files[0]);
                    console.log(image.files[0])
                }
                formData.append('nickname', escapeHTML(document.getElementById('profile-nickname').value))
                formData.append('bio',escapeHTML(document.getElementById('profile-bio').value))
                await this.updateProfile(formData);
            });

            document.getElementById('profile-photo').addEventListener('change', function () {
                document.getElementById('profile-photoo').src = URL.createObjectURL(document.getElementById('profile-photo').files[0])
            })
        }

    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
        document.getElementById('edit-button').addEventListener('click', () => {
            this.setState({ ...this.state, isEditing: !this.state.isEditing });
        });
    }
}


async function fetchProfile() {
    const pathName = window.location.pathname;
    const pathParts = pathName.split('/');
    const urlArray = pathParts.filter(Boolean);
    const nickname = urlArray[urlArray.length - 1];
    try {
        let data = await request(`profile-with-nickname/${nickname}/`, {
            method: 'GET',
        });
        if(!data.ok)
        {
            notify('Error fetching profile', 3, 'error')
            loadPage('/home/');
            return
            }
        const profileParentElement = document.getElementById('profile-info');
        const profile = new ProfileInfo({ profile: data, isEditing: false }, profileParentElement);
        profile.render();
        const editButton = document.getElementById('edit-button');
        editButton.addEventListener('click', () => {
            profile.setState({ ...profile.state, isEditing: !profile.state.isEditing });
        });
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching profile', 3, 'error')
        loadPage('/home/');
    }
}

async function assignDataRouting() {
    const historyButton = document.getElementById('history-button');
    const friendsButton = document.getElementById('friends-button');
    const statsButton = document.getElementById('stats-button');
    const blockedUsersButton = document.getElementById('blocked-users-button');
    const paddleColorButton = document.getElementById('paddle-color-button');

    historyButton.addEventListener('click', () => {
        history.replaceState(null, null, '#history')
        handleRouting()
    });
    friendsButton.addEventListener('click', () => {
        history.replaceState(null, null, '#friends')
        handleRouting()
    });
    statsButton.addEventListener('click', () => {
        history.replaceState(null, null, '#stats')
        handleRouting()
    });
    blockedUsersButton.addEventListener('click', () => {
        history.replaceState(null, null, '#blockedusers')
        handleRouting()
    });
}

async function fetchStats() {
    try {
        let response = await request(`profile/stats/`, {
            method: 'GET',

        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching stats', 3, 'error')
    }
}

async function fetchFriends() {
    try {
        let data = await request(`profile/friends/`, {
            method: 'GET',

        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching friends', 3, 'error')
    }
}

async function fetchBlockedUsers() {
    try {
        let data = await request('profile/block/', {
            method: "GET"
        })
        console.log(data)
        return data
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching friends', 3, 'error')
    }
}

async function fetchHistory()
{
    try
    {
        let data = await request(`profile/history/`,{
            method:'GET',
        });
        if(!data.ok)
        {
            notify('Error fetching history',3,'error');
            return [];
        }
        return data;
    }
    catch(error)
    {
        notify('Error fetching history',3,'error')
        console.error('Error:',error);
    return []
        }
}

async function handleRouting() {
    const hash = location.hash;
    const parentElement = document.getElementById('data-wrapper');
    const activeUserNickname = getActiveUserNickname()
    if (hash === '#history') {
        let data = await fetchHistory();
        const history = new History({ histories: data }, parentElement);
        history.render();
    }
    else if (hash === '#friends') {
        let data = await fetchFriends();
        const friends = new Friends({ friends: data }, parentElement);
        friends.render();
    }
    else if (hash === '#stats') {
        let data = await fetchStats();
        const statsInfo = new Stats({ statsInfo: data }, parentElement);
        statsInfo.render();
    }
    else if (hash === '#blockedusers' && activeUserNickname === getUsernameFromURL()) {
        let data = await fetchBlockedUsers();
        const blockedUsers = new BlockedUsers({ blockedUsers: data }, parentElement);
        blockedUsers.render();
    }
    else {
        let data = await fetchHistory();
        const history = new History({ histories: data }, parentElement);
        history.render();
    }
}
function getUsernameFromURL() {
    const pathName = window.location.pathname;
    const pathParts = pathName.split('/');
    return pathParts[pathParts.length - 1];
}
const App = async () => {
    await fetchProfile();
    await fetchBlockedUsers();
    await assignDataRouting();
    await handleRouting();
}

App().catch((error) => console.error(error));