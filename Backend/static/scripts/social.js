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
        this.html = "";
    }
    handleHTML() {
        if(this.state.tweets === undefined)
            return "";
        let userId = this.state.userId;
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
                        <h6>${tweet.from_user.nickname}</h6>
                        <span>${calculateDate(tweet)}</span>
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
                      <img  src="${BASE_URL}${tweet.image_url}" alt="" />
                    </div>
                    `: ''}
                  </div>
                  <div class="post-interaction">
                    <div class="like-button" data-tweet-id="${tweet.id}">
                      <img  src="/static/public/${tweet.liked_users.includes(userId) ? "liked" :"not-liked"}.svg" alt="" />
                    </div>
                    <button class="comment-button" data-tweet-id="${tweet.id}"">
                      <img  src="/static/public/chat-bubble.svg"  alt="" />
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
            `
    }
    setState(newState)
    {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML()
        this.render()
    }
}
class PostTweetFormComponent extends  BaseComponent
{
    constructor(state,parentElement = null) {
        super(state,parentElement);
        this.html = this.handleHTML();
    }
    handleHTML()
    {
        if(this.state.imageUrl === undefined)
            return '';
        return `
            <div class="uploaded-image">

                <button class="image-close-button" id="preview-close-button" type="button">
                    X
                </button>
            <img src=${this.state.imageUrl} alt=""  />
         </div>

        `
    }
 render() {
        if(this.state.imageUrl === undefined)
        {
            document.getElementById('image-preview')?.remove();
            return;
        }
        if(document.getElementById('image-preview'))
        {
            document.getElementById('image-preview').remove();
        }
     let div = document.createElement('div');
    div.innerHTML = this.html;
    this.parentElement.appendChild(div);
    div.id = 'image-preview';
    let previewCloseButton = document.getElementById('preview-close-button');
    if(previewCloseButton)
    {
        previewCloseButton.addEventListener('click', (event) => {
            postTweetFormComponent.setState({imageUrl: undefined});
        });
    }
}

    setState(newState)
    {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML();
        this.render();
    }

}
class SelectedPostComponent extends BaseComponent{
    constructor(state, parentElement = null)
    {
        super(state, parentElement);
        this.html = this.handleHTML();
    }
    handleHTML()
    {
        const {results} = this.state.tweet;
        const {tweet, comments} = results;
        return `
            <div class="selected-post">
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
                      <span>${calculateDate(tweet)}</span>
                    </div>
                  </div>
                  <div>
                    <img src="/static/public/more.svg" alt="" style="width: 50px" />
                  </div>
                  <div id="comment-back-button" style="cursor: pointer">
                    <img src="/static/public/go-back.svg" alt="" />
                  </div>
                </div>
                <div>
                  <div class="post-text">
                    <p>
                    ${tweet.content}
                    </p>
                  </div>
                  <div class="post-image">
                    <img src="${BASE_URL}${tweet.image_url}" alt="" />
                  </div>
                </div>
                <div class="post-interaction">
                  <div>
                    <img src="/static/public/liked.svg" alt="" />
                  </div>
                  <div>
                    <img src="/static/public/chat-bubble.svg" alt="" />
                  </div>
                  <div>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="WRITE A COMMENT..."
                    />
                  </div>
                </div>
                <div class="post-comments">
            ${comments.map(comment => `
          <div class="post-comment">
                <div class="user-pic-wrapper" style="height: 3rem">
                  <img
                    src="https://picsum.photos/seed/picsum/200/300"
                    alt=""
                  />
                </div>
                <div style="flex: 1">
                <div style="display: flex;justify-content: space-between">          
              <h6>${comment.from_user.nickname}</h6>
                <span>${calculateDate(comment)}</span>
</div>
                  <p>
                    ${comment.content}
                  </p>
                </div>
              </div>
        `).join('')}
        
                </div>
              </div>
            </div>
        `
    }
}
let parentElement = document.getElementById('posts-wrapper');
let socialPostsComponent = new SocialPostsComponent({}, parentElement);
let parentFormElement = document.getElementById('social-send-form');
let postTweetFormComponent = new PostTweetFormComponent({}, parentFormElement);
function   calculateDate(tweet)
    {
    let tweetDate = new Date(tweet.date);
    let currentDate = new Date();
    let differenceInSeconds = Math.floor((currentDate - tweetDate) / 1000);

    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    if (differenceInSeconds < minute) {
        return `${differenceInSeconds} seconds ago`;
    }
    else if (differenceInSeconds < hour) {
        return `${Math.floor(differenceInSeconds / minute)} minutes ago`;
    }
    else if (differenceInSeconds < day) {
        return `${Math.floor(differenceInSeconds / hour)} hours ago`;
        }
    else if (differenceInSeconds < week) {
        return `${Math.floor(differenceInSeconds / day)} days ago`;
    }
    else {
        return `${Math.floor(differenceInSeconds / week)} weeks ago`;
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
        let nameToCheck = friend.user.username;
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
        socialPostsComponent.setState({tweets: response.results.tweets});
    }
    catch(error)
        {
            console.error('Error:', error);
            notify('Error fetching social posts', 3, 'error');
        }

    }
    async function submitTweet(event) {
     event.preventDefault();
        let inputValue = document.getElementById('social-text-input').value;
        let image = document.getElementById("image-add");
        let formData = new FormData();
        formData.append('content', inputValue);
        formData.append('image', image.files[0]);
        try{
        let data = await request(`${API_URL}/post_tweet`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            },
            body: formData
        });
        notify('Tweet posted successfully', 3, 'success');
        //find a solution for this
        //socialPostsComponent.setState({tweets: [data, ...socialPostsComponent.state.tweets]});
        }
        catch(error)
        {
            console.error('Error:', error);
            notify('Error posting tweet', 3, 'error');
        }
}

async function assignEventListeners() {
    let form = document.getElementById('social-send-form');
    form.addEventListener('submit', submitTweet);
    let imageAdd = document.getElementById('image-add');
    imageAdd.addEventListener('change', (event) => {
        let file = event.target.files[0];
        let url = URL.createObjectURL(file);
        postTweetFormComponent.setState({imageUrl : url});
    });
    async function assignLikeButtons()
    {
        let likeButtons = document.getElementsByClassName('like-button');
        for(let button of likeButtons)
        {
            let tweetId = button.getAttribute('data-tweet-id');
            button.addEventListener('click', async (event) => {
                try{
                    let data = await request(`${API_URL}/like_tweet/${tweetId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
                        }
                    });
                    button.children[0].src = button.children[0].src.includes('not') ?  '/static/public/liked.svg' : '/static/public/not-liked.svg';
                }
                catch(error)
                {
                    console.error('Error:', error);
                    notify('Error liking tweet', 3, 'error');
                }
            });
        }
    }
    async function assignCommentButtons()
    {
        let commentButtons = document.getElementsByClassName('comment-button');
        for(let button of commentButtons)
        {
            let tweetId = button.getAttribute('data-tweet-id');
            button.addEventListener('click', async (event) => {
                history.pushState({}, '', `/socialmedia/tweet/${tweetId}`);
            });
        }
    }
    await assignLikeButtons();
    await assignCommentButtons();
}
async function getProfile()
{
    try{
        let data = await request(`${API_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            }
        });
        //find a better solution for this it's not good
        socialPostsComponent.setState({userId: data.id})
        let nickname = document.getElementById('username');
        nickname.innerText = data.nickname;
    }
    catch(error)
    {
        console.error('Error:', error);
        notify('Error fetching profile', 3, 'error');
    }
}
const App = async () => {
    if(!getCookie("tokens"))
    {
        loadPage('login');
        notify('Please login to continue', 3, 'error')
        return;
    }

    let regex = /\/tweet\/(\d+)/;
    let match = window.location.pathname.match(regex);
    if (match) {
        let tweetId = match[1]; // The first group in the regex contains the tweetId
        let response = await request(`${API_URL}/get-tweet-and-comments/${tweetId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(getCookie('tokens')).access}`
            }
        });
        console.log(response)
        let parentElement = document.getElementById('social-container');
        let selectedPostComponent = new SelectedPostComponent({tweet: response}, parentElement);
        selectedPostComponent.render();
    }
else
    {
        await getProfile();
        await fetchChatFriends();
        await fetchSocialPosts();
        await assignEventListeners();
    }
}

document.addEventListener('DOMContentLoaded', App);