import {API_URL, BASE_URL, assignRouting} from "./spa.js";
import {notify} from "../components/Notification.js";
import BaseComponent from "../components/Component.js";
import {request} from "./Request.js";
import Spinner from "../components/spinner.js";
import {getSocket} from "./requests.js";
import {calculateDate, escapeHTML, getActiveUserNickname, getProfile} from "./utils.js";
import {getStatusSocket} from "./Status.js";

class ChatFriendsComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML()
    }

    handleHTML() {
        return `
              ${this.state.friends.map(friend => `
                <div class="user-wrapper">
                  <div class="user-pic-wrapper">
                    <img
                      src="${friend.profile_picture}"
                      alt=""
                    />
                  </div>
                  <div class="user-info-wrapper">
                    <div
                      class="d-flex align-items-center justify-content-center gap-2"
                    >
                      <h6>${friend.nickname}</h6>
                      ${this.checkStatus(friend.nickname) ? `<div class="online-icon"></div>` : ''}
                    </div>
                    <span>${this.checkStatus(friend.nickname) ? this.getStatus(friend.nickname) : 'Offline'}</span>
            </div>
            </div>
              `).join('')}
`
    }

    getStatus(nickname) {
        return this.state.status.online_users.find(user => user.nickname === nickname).status;
    }

    checkStatus(nickname) {
        return this.state.status.online_users.some(user => user.nickname === nickname);
    }

    render() {
        super.render();
        let allUsers = document.getElementsByClassName("user-wrapper");
        for (let i = 0; i < allUsers.length; i++) {
            allUsers[i].addEventListener("click", toggleChat);
        }
        for (let element of allUsers) {
            element.addEventListener("contextmenu", (event) => handleRightClick(event, element));
        }
    }

    setState(newState) {
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
        if (this.state.tweets === undefined)
            return "";
        let userId = this.state.userId;
        return `
    ${this.state.tweets.map(tweet => `
            <div class="post-container">
                  <div class="d-flex position-relative">
                    <pong-redirect class="post-info" href="/profile/${tweet.from_user.nickname}">
                      <div class="user-pic-wrapper">
                        <img
                            src="${BASE_URL}${tweet.from_user.profile_picture}"
                            alt=""
                        />
                      </div>
                      <div>
                        <h6>${tweet.from_user.nickname}</h6>
                        <span>${calculateDate(tweet.date)}</span>
                      </div>
                    </pong-redirect>
                    ${
            tweet.from_user.id === userId ? `
                    <button class="post-delete-button" data-tweet-id="${tweet.id}">
                      <img  src="/static/public/trash.svg" alt="" style="width: 32px" />
                    </button>
                    ` : ''
        }
                  </div>
                  <div>
                    <div class="post-text">
                      <p>
                        ${tweet.content}
                      </p>
                    </div>
                    ${tweet.image ? `
                    <div class="post-image">
                      <img  src="${BASE_URL}${tweet.image}" alt="There is a problem with the image" />
                    </div>
                    ` : ''}
                  </div>
                  <div class="post-interaction">
                    <div class="like-button" data-tweet-id="${tweet.id}">
                      <img  src="/static/public/${tweet.liked_users.includes(userId) ? "liked" : "not-liked"}.svg" alt="" />
                    </div>
                    <button class="comment-button" data-tweet-id="${tweet.id}"">
                      <img  src="/static/public/chat-bubble.svg"  alt="" />
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
            <div id="load-more"">Please wait...</div>
            `
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML()
        this.render()
    }

    addObserver() {
        let loading = document.getElementById('load-more');
        if (!loading)
            return;
        let observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                let response = await request(this.state.next, {method: 'GET'});
                this.setState({tweets: [...this.state.tweets, ...response.results.tweets], next: response.next});
                await assignLikeButtons();
                await assignCommentButtons();
            }
        }, {threshold: 1});
        observer.observe(loading);
    }

    render() {
        if (this.html === null)
            throw new Error('Component Should have an html');
        this.parentElement.innerHTML = this.html;
        if (this.state.next !== null)
            this.addObserver();
        else
            document.getElementById('load-more').remove();
    }
}

class PostTweetFormComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    handleHTML() {
        if (this.state.imageUrl === undefined)
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
        if (this.state.imageUrl === undefined) {
            document.getElementById('image-preview')?.remove();
            return;
        }
        if (document.getElementById('image-preview')) {
            document.getElementById('image-preview').remove();
        }
        let div = document.createElement('div');
        div.innerHTML = this.html;
        this.parentElement.appendChild(div);
        div.id = 'image-preview';
        let previewCloseButton = document.getElementById('preview-close-button');
        if (previewCloseButton) {
            previewCloseButton.addEventListener('click', () => {
                postTweetFormComponent.setState({imageUrl: undefined});
                document.getElementById('image-add').value = '';
            });
        }
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML();
        this.render();
    }

}

class SelectedPostComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.html = this.handleHTML();
    }

    handleHTML() {
        let {tweet, userId, comments} = this.state;
        return `
            <div class="selected-post">
              <div class="post-container">
                <div class="d-flex position-relative">
                  <div class="post-info">
                    <div class="user-pic-wrapper">
                      <img
                        src="${tweet.from_user.profile_picture}"
                        alt=""
                      />
                    </div>
                    <div>
                      <h6>TEST1</h6>
                      <span>${calculateDate(tweet.date)}</span>
                    </div>
                  </div>

                  <div id="comment-back-button" style="cursor: pointer">
                    <img src="/static/public/go-back.svg" alt="Load Failed" />
                  </div>
                </div>
                <div>
                  <div class="post-text">
                    <p>
                    ${tweet.content}
                    </p>
                  </div>
                  ${tweet.image ?
            `<div class="post-image">
                    <img src="${BASE_URL}${tweet.image}" alt="There was a problem with the image" />
              </div>` : ''}
                </div>
                <div class="post-interaction">
                  <div class="like-button" data-tweet-id="${tweet.id}">
                    <img src="/static/public/${tweet.liked_users.includes(userId) ? "liked" : "not-liked"}.svg" alt="" />
                  </div>
                  <div>
                    <img src="/static/public/chat-bubble.svg" alt="" />
                  </div>
                  <form id="comment-send-form">
                    <input
                      type="text"
                      name=""
                      id="comment-input"
                      placeholder="WRITE A COMMENT..."
                    />
                  </form>
                </div>
                <div class="post-comments" id="post-comments">
                </div>
              </div>
            </div>
        `
    }
    setState(newState) {
        this.state = {...this.state, ...newState};
        this.html = this.handleHTML();
        this.render();
    }

    render() {
        super.render();
        let backButton = document.getElementById('comment-back-button');
        backButton.addEventListener('click', () => {
            history.pushState({}, '', '/social');
            renderAllPosts();
        });
    }
}
class CommentsComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }
    handleHtml()
    {
        const {comments} = this.state;
        return `
       ${comments.map(comment => `
          <div class="post-comment">
                <div class="user-pic-wrapper" style="height: 3rem">
                  <img
                    src="${comment.from_user.profile_picture}"
                    alt=""
                  />
                </div>
                <div style="flex: 1">
                <div style="display: flex;justify-content: space-between">          
              <h6>${comment.from_user.nickname}</h6>
                <span>${calculateDate(comment.date)}</span>
            </div>
                  <p>
                    ${comment.content}
                  </p>
                </div>
              </div>
        `).join('')}
        <div id="comment-loading">Please wait...</div>
        `
    }
    render() {
        this.html = this.handleHtml();
        super.render();
        if(this.state.next !== null)
            this.addObserver();
        else
            document.getElementById('comment-loading').remove();
    }
    setState(newState) {
        this.state = {...this.state, ...newState};
        this.render();
    }
    addObserver() {
        let loading = document.getElementById('comment-loading');
        if (!loading)
            return;
        let observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                let response = await request(this.state.next, {method: 'GET'});
                this.setState({comments: [...this.state.comments, ...response.results.comments], next: response.next});
            }
        }, {threshold: 0.9});
        observer.observe(loading);
    }
}

class ConversationComponent extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }

    handleHtml() {
        let username = getActiveUserNickname();
        return `
        ${
            this.state.messages.toReversed().map(message => `
             ${message.user.nickname === username ? `
              <div class="sent-message-container">
                  <div class="message-data-wrapper">
                    <span class="sent-message-date">${calculateDate(message.created_date)}</span>
                    <span class="sent-message-name">${message.user.nickname}</span>
                </div>
                  <p>
                    ${message.content}
                  </p>
                </div>
                ` : `
                <div class="received-message-container">
                  <div class="message-data-wrapper">
                  <span class="received-message-name">${message.user.nickname}</span>
                  <span class="received-message-date">${calculateDate(message.created_date)}</span>
                </div>
                  <p>
                    ${message.content}
                  </p>
                </div>
                `}
            `).join('')
        }
        <div id="chat-loading">Please wait...</div>
        `
    }
    render() {
        this.html = this.handleHtml();
        this.parentElement.innerHTML = this.html;
        if(this.state.next !== null)
            this.addObserver();
        else
            document.getElementById('chat-loading').remove();
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
        this.render();
    }
    addObserver() {
    let loading = document.getElementById('chat-loading');
        console.log(loading)
        if (!loading)
            return;
        let observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                console.log(this.state.next)
                let response = await request(this.state.next, {method: 'GET'});
                this.setState({messages: [...this.state.messages, ...response.results.messages], next: response.next});
            }
        }, {threshold: 0.9});
        observer.observe(loading);
    }
}

let parentElement = document.getElementById('posts-wrapper');
let socialPostsComponent = new SocialPostsComponent({}, parentElement);
let parentFormElement = document.getElementById('social-send-form');
let postTweetFormComponent = new PostTweetFormComponent({}, parentFormElement);
const fetchChatFriends = async () => {
    const endpoint = `profile/friends`;
    try {
        let response = await request(endpoint, {
            method: 'GET',
        });
        try {
            let statusSocket = await getStatusSocket();
            statusSocket.send(JSON.stringify({request_type: 'get_user_status', from: "social"}));
            statusSocket.addEventListener('message', (event) => {
                let userStatus = JSON.parse(event.data);
                let parentElement = document.getElementById('user-data-wrapper');
                let chatFriendsComponent = new ChatFriendsComponent({
                    friends: response,
                    status: userStatus
                }, parentElement);
                chatFriendsComponent.render();
            });
        } catch (e) {
            console.error(e);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
const fetchSocialPosts = async () => {
    try {
        let response = await request(`tweets/`, {method: 'GET'})
        let profile = await getProfile();
        socialPostsComponent.setState({tweets: response.results.tweets, next: response.next, userId: profile.id});
    } catch (error) {
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
    if (image.files.length > 0)
        formData.append('image', image.files[0]);
    try {
        let data = await request(`post-tweet/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': '',
            }
        });
        notify('Tweet posted successfully', 3, 'success');
        let {tweet} = data;
        socialPostsComponent.setState({tweets: [tweet, ...socialPostsComponent.state.tweets]});
    } catch (error) {
        console.error('Error:', error);

        notify('Error posting tweet', 3, 'error');
    }
}

async function assignLikeButtons() {
    let likeButtons = document.getElementsByClassName('like-button');
    for (let button of likeButtons) {
        let tweetId = button.getAttribute('data-tweet-id');
        button.addEventListener('click', async () => {
            try {
                let data = await request(`like-tweet/${tweetId}/`, {
                    method: 'PATCH',

                });
                button.children[0].src = button.children[0].src.includes('not') ? '/static/public/liked.svg' : '/static/public/not-liked.svg';
                if (!data.ok) {
                    notify(data.message, 3, 'error');
                    button.children[0].src = button.children[0].src.includes('not') ? '/static/public/liked.svg' : '/static/public/not-liked.svg';
                }
            } catch (error) {
                console.error('Error:', error);
                notify('Error liking tweet', 3, 'error');
            }
        });
    }
}

async function assignCommentButtons() {
    let commentButtons = document.getElementsByClassName('comment-button');
    for (let button of commentButtons) {
        let tweetId = button.getAttribute('data-tweet-id');
        button.addEventListener('click', async () => {
            history.pushState({}, '', `/social/tweet/${tweetId}`);
            await renderIndividualPost(tweetId);
        });
    }
}

async function assignDeleteButtons() {
    let buttons = document.getElementsByClassName('post-delete-button');
    for (let button of buttons) {
        let tweetId = button.getAttribute('data-tweet-id');
        button.addEventListener('click', async () => {
            try {
                let data = await request(`delete-tweet/${tweetId}/`, {
                    method: 'DELETE',
                });
                console.log(data)
                if (!data.ok) {
                    notify(data.error, 3, 'error');
                    return;
                }
                notify('Tweet deleted successfully', 3, 'success');
                let parentElement = button.parentElement.parentElement;
                parentElement.remove();
            } catch (error) {
                console.error('Error:', error);
                notify('Error deleting tweet', 3, 'error');
            }
        });
    }
}

async function assignPostTweetForm() {
    let form = document.getElementById('social-send-form');
    form.addEventListener('submit', submitTweet);
    let imageAdd = document.getElementById('image-add');
    imageAdd.addEventListener('change', (event) => {
        if (event.target.files.length === 0)
            return;
        if (event.target.files[0].size > 1000000) {
            notify('Image size should be less than 1MB', 3, 'error');
            return;
        }
        let file = event.target.files[0];
        let url = URL.createObjectURL(file);
        postTweetFormComponent.setState({imageUrl: url});
    });
}

async function assignEventListeners() {
    await assignPostTweetForm();
    await assignLikeButtons();
    await assignCommentButtons();
    await assignDeleteButtons();
}
async function commentSubmit(e,commentsComponent,tweetId)
{
            e.preventDefault();
            let inputValue = document.getElementById('comment-input').value;
            try {
                let data = await request(`post-comment/`, {
                    method: 'POST',
                    body: JSON.stringify({content: inputValue, tweet: tweetId})
                });
                if(!data.ok)
                {
                    notify(data.error, 3, 'error');
                    return;
                }
                notify('Comment posted successfully', 3, 'success');
                let newComments = [data, ...commentsComponent.state.comments];
                commentsComponent.setState({
                    comments: newComments
                });
            } catch (error) {
                console.error('Error:', error);
                notify('Error posting comment', 3, 'error');
            }
}
const renderIndividualPost = async (tweetId) => {
    let response = await request(`get-tweet-and-comments/${tweetId}/`, {
        method: 'GET',
    });
    let data = await getProfile();
    let parentElement = document.getElementById('social-container');
    let selectedPostComponent = new SelectedPostComponent({
        tweet: response.results.tweet,
        userId: data.id,
    }, parentElement);
    selectedPostComponent.render();
    let commentsComponent = new CommentsComponent({
        comments: response.results.comments,
        next: response.next
    },document.getElementById('post-comments'));
    commentsComponent.render();
    await assignLikeButtons();
    await fetchChatFriends()
    let form = document.getElementById('comment-send-form');
    form.addEventListener('submit', (e) => commentSubmit(e,commentsComponent,tweetId));
}

async function getProfile2() {
    try {
        let data = await request(`profile/`, {
            method: 'GET'
        });
        return data.profile_picture;
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching profile', 3, 'error');
        return null;
    }
}

const renderAllPosts = async () => {
    let profile_picture_url = await getProfile2();
    const nickname = getActiveUserNickname();
    let container = document.getElementById('social-container');
    container.innerHTML = `
                  <div
              class="social-wrapper"
              id="social-wrapper"
            >
              <div class="d-flex flex-column gap-2">
                <div class="social-send-info">
                  <div class="user-pic-wrapper">
                    <img
                      src="${BASE_URL}${profile_picture_url}"
                     alt=""
                    />
                  </div>
                  <h6 id="username"></h6>
                </div>
                <form class="social-send" id="social-send-form">
                  <input
                    type="text"
                    name=""
                    id="social-text-input"
                    style="background-color: rgba(126, 126, 126, 0.397)"
                    placeholder="What do you think"
                  />
                    <div class="form-input-wrapper">
                    <label for="image-add" class="custom-file-upload"></label>
                    <input
                    type="file" id="image-add"
                    src="{% static '/public/image.svg' %}" alt="" style="width: 35px"
                    accept="image/jpeg,image/png,image/gif"
                    >
                <button type="submit" id="send-button">
                    <img src="/static/public/send.svg" alt="" />
                </button>
                    </div>
                </form>
              </div>
              
              <div class="posts-container" id="posts-wrapper">
                <div class="post-container skeleton" id="post-wrapper">
                </div>
              </div>
            </div>
    `
    document.getElementById('username').innerText = nickname;
    socialPostsComponent.parentElement = document.getElementById('posts-wrapper');
    postTweetFormComponent.parentElement = document.getElementById('social-send-form');
    await Promise.all([fetchChatFriends(), fetchSocialPosts(), getProfile()]);
    await assignEventListeners();
}

async function handleAddFriend(element) {
    const socket = await getSocket();
    let nickname = element.children[1].children[0].innerText;
    let friendRequestButton = document.getElementById('options-add-friend');
    try {
        let spinner = new Spinner({isVisible: true, className: "options-spinner"}, friendRequestButton);
        spinner.render();
        let activeUserNickname = getActiveUserNickname()
        let body = {
            request_type: "friend",
            sender: activeUserNickname,
            receiver: nickname
        }
        socket.send(JSON.stringify(body));
        spinner.setState({isVisible: false});
        friendRequestButton.innerText = 'Add Friend'
        notify('Friend request sent', 3, 'success');
    } catch (error) {
        console.error('Error:', error);
        notify('Error adding friend', 3, 'error');
    }
}

async function handleInviteToPong(element) {
    let socket = await getSocket();
    let nickname = element.children[1].children[0].innerText;
    let sendBody = {
        request_type: "game",
        sender: getActiveUserNickname(),
        receiver: nickname
    }
    socket.send(JSON.stringify(sendBody));
    notify('Invite sent', 3, 'success');
}

function addContextListeners(element) {
    let addFriendButton = document.getElementById('options-add-friend');
    let blockUserButton = document.getElementById('options-block-user');
    let inviteToPongButton = document.getElementById('options-invite-to-pong');
    addFriendButton.addEventListener('click', () => handleAddFriend(element));
    inviteToPongButton.addEventListener('click', () => handleInviteToPong(element));
}

function handleRightClick(event, element) {
    event.preventDefault();
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let chatOptions = document.getElementById("chat-options");
    chatOptions.style.top = `${mouseY}px`;
    chatOptions.style.left = `${mouseX}px`;
    chatOptions.classList.add("chat-options-open");
    chatOptions.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    function handleChatContext() {
        let redirect = document.getElementById('profile-redirect');
        redirect.setAttribute('href', `/profile/${element.children[1].children[0].innerText}`)
    }

    handleChatContext()
    addContextListeners(element)
    document.addEventListener(
        "click",
        function closeMenu(event) {
            chatOptions.classList.remove("chat-options-open");
            document.removeEventListener("click", closeMenu);
        },
        {once: true}
    );
}

async function fetchMessages(roomId) {
    try {
        let response = await request(`chat/get-messages/${roomId}/`, {
            method: 'GET'
        });
        return response
    } catch (error) {
        console.error('Error:', error);
        notify('Error fetching messages', 3, 'error');
    }
}

async function connectToRoom(room, conversationComponent) {
    const nickname = getActiveUserNickname()
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${room.id}/${nickname}`);
    let chatSendForm = document.getElementById('chat-send');
    let chatInput = document.getElementById('chat-input');
    chatSendForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let content = chatInput.value;
        if (content.length <= 0)
            return;
        socket.send(JSON.stringify({message: content}));
        chatInput.value = '';
    });
    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        let message = {
            content: data.message,
            user: {nickname: data.user, id: data.id},
            created_date: new Date()
        }
        conversationComponent.setState({messages: [...conversationComponent.state.messages, message]});
    }
}

async function fetchRoomData(element) {
    let nickname = element.children[1].children[0].innerText;
    let profilePicture = element.children[0].children[0].src;
    let wrapper = document.getElementById('conversation-wrapper');
    let activeUserInfoWrapper = document.getElementById('active-user-info');
    let image = activeUserInfoWrapper.children[0].children[0]
    let name = activeUserInfoWrapper.children[1].children[0]
    name.innerText = nickname;
    image.src = profilePicture;
    let spinner = new Spinner({isVisible: true}, wrapper);
    spinner.render();
    try {
        let data = await request(`chat/start-chat/`, {
            method: 'POST',
            body: JSON.stringify({nickname: nickname})
        });
        let {room} = data;
        let response = await fetchMessages(room.id);
        let conversationWrapper = document.getElementById('conversation-wrapper');
        conversationWrapper.classList.remove('no-chat-wrapper')
        let conversationComponent = new ConversationComponent(
            {
                senderId: localStorage.getItem("activeUserId"),
                receiverId: room.second_user,
                messages: response.results.messages,
                next: response.next
            },
            conversationWrapper);
        spinner.setState({isVisible: false});
        conversationComponent.render();
        await connectToRoom(room, conversationComponent);
    } catch (err) {
        console.error('Error:', err);
        spinner.setState({isVisible: false});
        notify('Error starting chat', 3, 'error');
    }
}

async function toggleChat() {
    let chatContainer = document.getElementById("chat-container");
    let socialWrapper = document.getElementById("social-container");
    await fetchRoomData(this);
    if (chatContainer.classList.contains("chat-closed")) {
        chatContainer.classList.add("chat-transition");
        setTimeout(() => {
            chatContainer.classList.remove("chat-transition");
            chatContainer.classList.remove("chat-closed");
        }, 1000);
        socialWrapper.classList.add("social-wrapper-open");
        socialWrapper.classList.remove("social-wrapper-chat-closed");
    }
}

function handleChatState() {

}

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function handleInput(event) {
    let searchInput = document.getElementById('user-search-input');
    event.preventDefault();
    let searchValue = searchInput.value.trim(); // Trim to remove extra spaces
    let parentElement = document.getElementById('user-data-wrapper');

    if (searchValue) {
        let params = new URLSearchParams();
        params.append('search', searchValue);
        let url = `profile-search/?${params.toString()}`;
        let response = await request(url, {method: 'GET'});
        let statusSocket = await getStatusSocket();
        statusSocket.send(JSON.stringify({request_type: 'get_user_status', from: "social"}));
        statusSocket.addEventListener('message', (event) => {
            let userStatus = JSON.parse(event.data);
            let chatFriendsComponent = new ChatFriendsComponent({
                friends: response,
                status: userStatus
            }, parentElement);
            chatFriendsComponent.render();
        });
    }
}

function handleChatEvents() {
    let searchInput = document.getElementById('user-search-input');
    searchInput.addEventListener('keyup', (e) => {
        if (e.key.length === 1 || searchInput.value.length > 0) {
            return;
        }
        fetchChatFriends()
    });
    searchInput.addEventListener('input', debounce(handleInput, 2000));
}

const App = async () => {
    let regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;
    let match = window.location.pathname.match(regex);
    if (match)
        await renderIndividualPost(match[0]);
    else
        await renderAllPosts();
    assignRouting();
    handleChatState();
    handleChatEvents();
    //I don't know if this make sense but, I added this to prevent the form from submitting when
    //there is no chat active
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (event) => event.preventDefault());
    })
}
App().catch(error => console.error('Error:', error));

window.addEventListener('popstate', async (event) => {
    if (window.location.pathname === '/social/')
        await renderAllPosts();
    else {
        let regex = /\/tweet\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;
        let match = window.location.pathname.match(regex);
        if (match) {
            await renderIndividualPost(match[1]);
        }
    }
});
