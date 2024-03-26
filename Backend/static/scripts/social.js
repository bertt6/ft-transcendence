import {API_URL, getCookie, loadPage, BASE_URL} from "./spa.js";
import {notify} from "../components/Notification.js";
import BaseComponent from "../components/Component.js";
import {request} from "./Request.js";
class ChatFriendsComponent extends  BaseComponent{
    constructor(state,parentElement = null) {
        super(state,parentElement);
        this.html = this.handleHTML()
    }
    handleHTML()
    {
        return `
              ${this.state.friends.map(friend => `
                <div class="user-wrapper">
                  <div class="user-pic-wrapper">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                    />
                  </div>
                  <div class="user-info-wrapper">
                    <div
                      class="d-flex align-items-center justify-content-center gap-2"
                    >
                      <h6>${friend.nickname.length <=0 ? friend.user.username: friend.nickname}</h6>
                      <div class="online-icon"></div>
                    </div>
                    <span>Active Now</span>
            </div>
            </div>
              `).join('')}
`
    }
    render() {
        super.render();
    }
    setState(newState)
    {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML();
        this.render();
    }
}
class SocialPostsComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }
    handleHTML() {
    return`
    ${this.state.tweets.map(tweet => `
    <div class="post-container">
                  <div class="d-flex position-relative">
                    <div class="post-info">
                      <div class="user-pic-wrapper">
                        <img
                          src="https://picsum.photos/seed/picsum/200/300"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6>TEST1</h6>
                        <span>20 MINUTE AGO</span>
                      </div>
                    </div>
                    <div>
                      <img  src="/static/public/more.svg" alt="" style="width: 50px" />
                    </div>
                  </div>
                  <div>
                    <div class="post-text">
                      <p>
                        ${tweet.content}
                      </p>
                    </div>
                    ${tweet.image ? `
                    <div class="post-image">
                      <img  src="${BASE_URL}/${tweet.image_url}" alt="" />
                    </div>
                    `: ''}
                  </div>
                  <div class="post-interaction">
                    <div>
                      <img  src="/static/public/heart.svg" alt="" />
                    </div>
                    <button class="comment-button">
                      <img  src="/static/public/chat-bubble.svg" alt="" />
                    </button>
                    <div>
                      <input
                        type="text"
                        name=""
                        id=""
                        placeholder="WRITE A COMMENT..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
            `

    }

}
const fetchChatFriends = async () => {
    const endpoint = `${API_URL}/profile/friends`;
    try {
        let response = await request(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            }
        });
        let parentElement = document.getElementById('user-data-wrapper');
        let chatFriendsComponent = new ChatFriendsComponent({friends: response},parentElement);
        let input = document.getElementById('friend-search-input');
        input.addEventListener('keyup', async (event) => {
            let value = event.target.value;
               let filteredFriends = response.filter(friend => {
        let nameToCheck = friend.nickname.length > 0 ? friend.nickname : friend.user.username;
        return nameToCheck.toLowerCase().includes(value.toLowerCase());
    });
            chatFriendsComponent.setState({friends: filteredFriends});
        });
        chatFriendsComponent.render();

    }
    catch (error) {
        console.error('Error:', error);
    }

}
const fetchSocialPosts = async () => {
 try{
        let response = await request(`${API_URL}/tweets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`,

            }})
     console.log(response.tweets);
        let parentElement = document.getElementById('posts-wrapper');
        let socialPostsComponent = new SocialPostsComponent({tweets: response.tweets}, parentElement);
        socialPostsComponent.render();
    }

    catch(error)
        {
            console.error('Error:', error);
            notify('Error fetching social posts', 3, 'error');
        }

    }

const App = async () => {
    if(!getCookie("tokens"))
    {
        loadPage('login');
        notify('Please login to continue', 3, 'error')
    }
    await fetchChatFriends();
    await fetchSocialPosts();
}

document.addEventListener('DOMContentLoaded', App);