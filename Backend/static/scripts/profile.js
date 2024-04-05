import BaseComponent from "../components/Component.js";
import {API_URL, BASE_URL, getCookie, loadPage} from "./spa.js";
import {notify} from "../components/Notification.js";
import {request} from "./Request.js";
import {escapeHTML} from "./utils.js";

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
                  <h5>BSAMLI</h5>
                  <h5>VS</h5>
                  <h5>OFIRAT</h5>
                </div>
                <div class="history-score">
                  <h5>4</h5>
                  <h5>-</h5>
                  <h5>0</h5>
                </div>
                <div>
                  <h5>1 DAY AGO</h5>
                </div>
              </div>
            `)}
            </div>
          </div>
`
    }

    render() {
        this.parentElement.innerHTML = this.handleHTML();
    }
}

class Stats extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    handleHTML() {
        console.log(this.state)
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
            <h3>Points</h3>
            <p class="stats-value">${this.state.statsInfo.points}</p>
        </div>
    </div>
    <div class="stats-row">
        <div class="stats-item">
            <h3>Win Rate</h3>
            <p class="stats-value">%${((parseInt(this.state.statsInfo.total_wins) / (parseInt(this.state.statsInfo.total_wins) + parseInt(this.state.statsInfo.total_losses))) * 100).toFixed(2)}</p>
        </div>
        <div class="stats-item">
            <h3 href="leaderboard" class="stats-value">Rank</>
            <p class="stats-value">#3</p>
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

    handleHTML() {
        return `
            <div class="friends-wrapper">
            ${this.state.friends.map(friend => `
              <div class="friend-wrapper">
                <div class="friend-info">
                  <div class="friend-image">
                    <img src="https://picsum.photos/id/237/200/300" alt="" />
                  </div>
                  <div class="friend-data">
                    <h6>${friend.user.first_name.length > 0 ? escapeHTML(friend.user.first_name) : "No name is set for this user"}</h6>
                    <span>${friend.nickname.length > 0 ? friend.nickname : friend.user.username}</span>
                  </div>
                </div>
                <div class="friend-more">
                  <div><img src="/static/public/image.svg" alt="" /></div>
                  <div><img src="/static/public/chat-bubble.svg"/></div>
                  <div><img src="/static/public/more.svg" alt="" /></div>
                </div>
              </div>
            `).join('')}
          </div>
        `
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        this.render();
    }
}


class ProfileInfo extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }

    handleEditHTML() {
        const {nickname, first_name, last_name, bio, profile_picture} = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                X
                    </button>
                </div>
        <form style="display: flex; flex-direction: column; align-items: center" id="update-form">
              <div class="profile-photo">
                <img
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
                <input class="transparent-input" id="profile-nickname" value="${nickname ? nickname : "no nickname is set!"}"/>
                <input class="transparent-input" id="profile-firstname"  value="${first_name ? first_name : "no first name is set"}">
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
        const {nickname, first_name, last_name, bio, profile_picture} = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                    <img src="/static/public/edit.svg" alt="">
                    </button>
                </div>
              <div class="profile-photo">
                <img
                  src="${BASE_URL}${profile_picture}"
                  alt=""
                  class=""
                />
              </div>
              <div>
                <h1>${nickname ? escapeHTML(nickname) : "no nickname is set!"}</h1>
                <span>${first_name ? escapeHTML(first_name) : "no first name is set"}</span>
              </div>
              <div>
                <p>
                ${bio ? escapeHTML(bio) : 'No bio available'}
                </p>
              </div>`
    }

    updateProfile = async (formData) => {
        const access_token = JSON.parse(getCookie('access'));
        try {
            let response = await request(`${API_URL}/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': '',
                },
                body: formData
            });
            notify('Profile updated', 3, 'success');
            this.setState({...this.state, profile: response});
        } catch (error) {
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
                }
                formData.append('nickname', document.getElementById('profile-nickname').value)
                formData.append('bio', document.getElementById('profile-bio').value)
                await this.updateProfile(formData);
            });
        }

    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        this.render();
        document.getElementById('edit-button').addEventListener('click', () => {
            this.setState({...this.state, isEditing: !this.state.isEditing});
        });
    }
}

async function fetchProfile() {
    const pathName = window.location.pathname;
    const pathParts = pathName.split('/');
    const nickname = pathParts[pathParts.length - 1];
    const access_token = getCookie('access_token');
    try {
        let data = await request(`${API_URL}/profile-with-nickname/${nickname}`, {
            method: 'GET',
        });
        const profileParentElement = document.getElementById('profile-info');
        const profile = new ProfileInfo({profile: data, isEditing: false}, profileParentElement);
        profile.render();
        const editButton = document.getElementById('edit-button');
        editButton.addEventListener('click', () => {
            profile.setState({...profile.state, isEditing: !profile.state.isEditing});
        });
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching profile', 3, 'error')
        loadPage('/home');
    }
}

async function assignDataRouting() {
    const historyButton = document.getElementById('history-button');
    const friendsButton = document.getElementById('friends-button');
    const statsButton = document.getElementById('stats-button');
    historyButton.addEventListener('click', (e) => {
        history.replaceState(null, null, '#history')
        handleRouting()
    });
    friendsButton.addEventListener('click', (e) => {
        history.replaceState(null, null, '#friends')
        handleRouting()
    });
    statsButton.addEventListener('click', (e) => {
        history.replaceState(null, null, '#stats')
        handleRouting()
    });
}

async function fetchStats() {
    try {
        let response = await request(`${API_URL}/profile/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching stats', 3, 'error')
    }
}

async function fetchFriends() {
    try {
        let data = await request(`${API_URL}/profile/friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            }
        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching friends', 3, 'error')
    }
}

async function handleRouting() {
    const hash = location.hash;
    const parentElement = document.getElementById('data-wrapper');
    if (hash === '#history') {
        const history = new History({histories: [1]}, parentElement);
        history.render();
    }
    if (hash === '#friends') {
        let data = await fetchFriends();
        const friends = new Friends({friends: data}, parentElement);
        friends.render();
    }
    if (hash === '#stats') {
        let data = await fetchStats();
        const statsInfo = new Stats({statsInfo: data}, parentElement);
        statsInfo.render();
    }
}

const App = async () => {
    await fetchProfile();
    await assignDataRouting();
    await handleRouting();
}

App().catch((error) => console.error(error));