import BaseComponent from "../components/Component.js";
import {API_URL, assignRouting, BASE_URL, loadPage} from "./spa.js";
import { notify } from "../components/Notification.js";
import { request } from "./Request.js";
import {calculateDate, escapeHTML, getActiveUserNickname} from "./utils.js";


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
                  <h5>VS</h5>
                  <h5>${history.player2.nickname}</h5>
                </div>
                <div class="history-score">
                 ${history.winner.nickname}
                </div>
                <div>
                  <h5>${calculateDate(history.date)}</h5>
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
class BlockedUsers extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }
    handleHTML() {
        return `
        <div class="blocked-users-wrapper">
        ${this.state.blockedUsers.map(user => `
            <div class="blocked-user-wrapper">
                <div class="blocked-user-info">
                  <div class="blocked-user-image">
                    <img src="${user.profile_picture}" alt="" />
                  </div>
                  <div class="blocked-user-data">
                    <h6>${user.nickname}</h6>
                    </div>
                    </div>
                    <button class="unblock-button">Unblock</button>
            </div>
        `).join('')}
        </div>
        `
    }
    render() {
        this.parentElement.innerHTML = this.html;
    }
}

class PaddleColor extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    handleHTML() {
        
        return `
        <form>
    <div class="paddle-color-wrapper">
        <div class="colors-text">COLORS</div>
        <div class="paddle-color-row">
            <div class="paddle-color-item">
                <input type="radio" id="red1" name="color_row1" value="red1">
                <label for="red1">
                    <div>
                        <p>Red</p>
                    </div>
                    <div class="red">
                        <img src="/static/public/SingleCloud.png" alt="">
                    </div>
                </label>
            </div>
            <div class="paddle-color-item">
                <input type="radio" id="red2" name="color_row1" value="red2">
                <label for="red2">
                    <div>
                        <p>Red</p>
                    </div>
                    <div class="red">
                        <img src="/static/public/SingleCloud.png" alt="">
                    </div>
                </label>
            </div>
        </div>
        <div class="paddle-color-row">
            <div class="paddle-color-item">
                <input type="radio" id="red3" name="color_row1" value="red3">
                <label for="red3">
                    <div>
                        <p>Red</p>
                    </div>
                    <div class="red">
                        <img src="/static/public/SingleCloud.png" alt="">
                    </div>
                </label>
            </div>
            <div class="paddle-color-item">
                <input type="radio" id="red4" name="color_row1" value="red4">
                <label for="red4">
                    <div>
                        <p>Red</p>
                    </div>
                    <div class="red">
                        <img src="/static/public/SingleCloud.png" alt="">
                    </div>
                </label>
            </div>
        </div>
    </div>
</form>
    `;
    }

    render() {
        this.parentElement.innerHTML = this.html;
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
            <h3>Points</h3>
            <p class="stats-value">${this.state.statsInfo.points}</p>
        </div>
    </div>
    <div class="stats-row">
        <div class="stats-item">
            <h3>Win Rate</h3>
            <p class="stats-value">%${calculateWinRate(parseInt((this.state.statsInfo.total_wins)), parseInt(this.state.statsInfo.total_losses))}</p>
            
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
                  <pong-redirect href="/profile/${friend.nickname}/" class="friend-data">
                    <span>${friend.nickname}</span>
                  </pong-redirect>
                </div>
                <div class="friend-more">
                  <div><img src="/static/public/image.svg" alt="" /></div>
                  <div><img src="/static/public/chat-bubble.svg" alt=""/></div>
                  <div><img src="/static/public/more.svg" alt="" /></div>
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

        try {
            let response = await request(`${API_URL}/profile/`, {
                method: 'PUT',
                body: formData
            });
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
                formData.append('nickname', document.getElementById('profile-nickname').value)
                formData.append('bio', document.getElementById('profile-bio').value)
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
        let data = await request(`${API_URL}/profile-with-nickname/${nickname}`, {
            method: 'GET',
        });
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
    paddleColorButton.addEventListener('click', () => {
        history.replaceState(null, null, '#paddlecolor')
        handleRouting()
    });
}

async function fetchBlockedUsers() {
    const users = [
        { nickname: "user1", profile_picture: "https://example.com/user1.jpg" },
        { nickname: "user2", profile_picture: "https://example.com/user2.jpg" },
        { nickname: "user3", profile_picture: "https://example.com/user3.jpg" },
        { nickname: "user4", profile_picture: "https://example.com/user4.jpg" },
        { nickname: "user5", profile_picture: "https://example.com/user5.jpg" }
    ];
    return users;
}

async function fetchPaddleColor() {
    const colors = [
        { color: "red", hex: "#FF0000" },
        { color: "green", hex: "#00FF00" },
        { color: "blue", hex: "#0000FF" },
        { color: "yellow", hex: "#FFFF00" },
        { color: "purple", hex: "#800080" }
    ];
    return colors;
}
async function fetchStats() {
    try {
        let response = await request(`${API_URL}/profile/stats/`, {
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
        let data = await request(`${API_URL}/profile/friends/`, {
            method: 'GET',

        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching friends', 3, 'error')
    }
}
async function fetchHistory()
{
    try
    {
        let data = await request(`${API_URL}/profile/history/`,{
            method:'GET',
        });
        console.log(data)

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
    if (hash === '#friends') {
        let data = await fetchFriends();
        const friends = new Friends({ friends: data }, parentElement);
        friends.render();
    }
    if (hash === '#stats') {
        let data = await fetchStats();
        const statsInfo = new Stats({ statsInfo: data }, parentElement);
        statsInfo.render();
    }
    if (hash === '#blockedusers' && activeUserNickname === getUsernameFromURL()) {
        let data = await fetchBlockedUsers();
        const blockedUsers = new BlockedUsers({ blockedUsers: data }, parentElement);
        blockedUsers.render();
    }
    if (hash == '#paddlecolor') {
        const paddleColor = await fetchPaddleColor();
        const paddleColorComponent = new PaddleColor({ colors: paddleColor }, parentElement);
        paddleColorComponent.render();
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