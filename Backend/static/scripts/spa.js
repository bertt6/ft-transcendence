import {request} from "./Request.js";
import {notify} from "../components/Notification.js";

export const API_URL = 'http://localhost:8000/api/v1';
export const BASE_URL = 'http://localhost:8000';
export function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
const routes = new Map([
    ['login', {
    auth_required:false,
    url:["/auth/login/"],
    html: `
    <div class="background container-fluid">
        <div class="d-flex align-items-center justify-content-center h-100">
            <form class="login-wrapper p-5 gap-2" id="login-form">
                <div
                        style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
                >
                    <h1 style="color: white">LOGIN</h1>
                </div>
                <div>
                    <input
                            type="text"
                            class="login-input p-2"
                            id="username"
                            placeholder="USERNAME"
                    />
                </div>
                <div>
                    <input
                            type="text"
                            class="login-input p-2"
                            id="password"
                            placeholder="PASSWORD"
                    />
                </div>
                <div
 class="buttons-wrapper"
                >
                        <button class="login-button" id="login-button" type="submit">LOGIN</button>
                        <pong-redirect href="register">
                            <button class="register-button" type="button">REGISTER</button>
                        </pong-redirect>

                </div>
                <button class="ecole-login-button">
                    Login with 42
                    <div>
                        <img src="/static/public/42.svg" alt=""/>
                    </div>
                </button>
            </form>
        </div>
    </div>`
    }],
    ['register', {
        auth_required: false,
        url: ["/auth/register/"],
        html: `
              <div class="background container-fluid">
            <div class="d-flex align-items-center justify-content-center h-100">
              <form class="register-wrapper p-5 gap-2" id="register-form">{% csrf_token %}
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <h1 style="color: white">REGISTER</h1>
                </div>
                <div class="register-input-wrapper">
                  <label for="username">username</label>
                  <input
                    type="text"
                    class="register-input p-2"
                    placeholder="USERNAME"
                    id="username"
                  />
                </div>
                <div class="register-password">
                  <div class="register-input-wrapper">
                    <label for="password">password</label>
                    <input
                      type="text"
                      class="register-input p-2"
                      placeholder="PASSWORD"
                      id="password"
                      required
                    />
                  </div>
                  <div class="register-input-wrapper">
                    <label for="password">Re enter your password</label>
                    <input
                      type="text"
                      class="register-input p-2"
                      id="password2"
                      required
                    />
                  </div>
                </div>
                <div class="register-input-wrapper">
                  <label for="Email">Email</label>
                  <input
                    type="text"
                    class="register-input p-2"
                    placeholder="EMAIL"
                    id="email"
                    required
                  />
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                  "
                >
                  <div>
                    <button class="register-button" id="register-button">
                        REGISTER
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
    `
    }],
    ['profile', {
        auth_required: true,
        url: [/profile\/[A-Za-z]+/],
        html: `
              <div
        class="background container-fluid social-background"
        style="padding: 0"
      >
        <div class="profile-wrapper">
          <div class="profile-info" id="profile-info">
            <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                        <img src="/static/public/edit.svg" alt=""></button>
                </div>
              <div class="profile-photo skeleton"></div>
              <div class="skeleton profile-data">
                <h1></h1>
                <span></span>
              </div>
              <div class="profile-bio skeleton">
                <p></p>
              </div>
            </div>
          </div>
          <div class="profile-data">
            <div class="data-headers">
              <button class="header-wrapper" id="history-button"><span>MATCH HISTORY</span></button>
              <button class="header-wrapper" id="friends-button"><span> FRIENDS </span></button>
              <button class="header-wrapper" id="stats-button"><span>STATS</span></button>
            </div>
          <div id="data-wrapper">
                <div class="friends-wrapper" style="display: none">
              <div class="friend-wrapper">
                <div class="friend-info">
                  <div class="friend-image">
                    <img src="https://picsum.photos/id/237/200/300" alt="" />
                  </div>
                  <div class="friend-data">
                    <h6>NAME</h6>
                    <span>First Last name</span>
                  </div>
                </div>
                <div class="friend-more">
                  <div><img src="/public/image.svg" alt="" /></div>
                  <div><img src="/public/chat-bubble.svg" alt="" /></div>
                  <div><img src="/public/more.svg" alt="" /></div>
                </div>
              </div>
              <div class="friend-wrapper">
                <div class="friend-info">
                  <div class="friend-image">
                    <img src="https://picsum.photos/id/237/200/300" alt="" />
                  </div>
                  <div class="friend-data">
                    <h6>NAME</h6>
                    <span>First Last name</span>
                  </div>
                </div>
                <div class="friend-more">
                  <div><img src="/public/image.svg" alt="" /></div>
                  <div><img src="/public/chat-bubble.svg" alt="" /></div>
                  <div><img src="/public/more.svg" alt="" /></div>
                </div>
              </div>
            </div>
            <div class="histories-wrapper">
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
              <div class="history-wrapper">
                <div>
                  <h5>Tournament</h5>
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
            </div>
          </div>
          </div>
        </div>
      </div>
`
    }],
    ['social',{
    auth_required: true,
    url: ['/social/',  '/social/\\w+/g'],
    html: `
      <ul class="chat-options" id="chat-options">
        <li>Invite to Pong</li>
        <pong-redirect id="options-profile">Go To Profile</pong-redirect>
          <li>Block</li>
          <li>Add Friend</li>
      </ul>
            <div class="main-profile-data">
        <pong-redirect class="profile-wrapper" id="profile-image-wrapper">
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
      </div>

      
          <div
        class="background container-fluid social-background"
        style="padding: 0"
      >
        <div class="d-flex h-100">
          <div class="d-flex position-relative">
            <div id="user-chat-friends">
                <div class="users-wrapper">
                <div>
                  <div class="chat-send-wrapper">
                    <h2>SEARCH...</h2>
                    <input type="text" placeholder="SEARCH A NAME" id="friend-search-input" />
                </div>
              </div>
              <div class="user-data-wrapper loading" id="user-data-wrapper">
              <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
              </div>
            </div>
            </div>
            <div class="chat-container" id="chat-container">
                           <div class="active-user-wrapper">
                <div class="user-info">
                  <div class="user-pic-wrapper">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                    />
                  </div>
                  <div class="active-user-info-wrapper" id="active-user-info">
                    <h6>test1</h6>
                    <span>active now</span>
                    <div class="spotify-info">
                      <img src="/static/public/music.svg" alt="" style="width: 20px" />
                      <span>Currently listening test123</span>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <img src="/static/public/more.svg" alt="" style="width: 50px" />
                  <div id="chat-close-button"  style="cursor: pointer">
                    <img  src="/static/public/go-back.svg" alt="" />
                  </div>
                </div>
              </div>
              <div class="conversation-wrapper no-chat-wrapper" id="conversation-wrapper">
                Select a user to start a conversation
              </div>
              <form class="send-container" style="margin-bottom: 1px" id="chat-send">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Send a message"
                  style="width: 100%"
                />
                <div>
                  <img  src="/static/public/send.svg" alt="" />
                </div>
              </form>
            </div>
          </div>
          <div class="social-container py-2" id="social-container">
            <div
              class="social-wrapper"
              id="social-wrapper"
            >
              <div class="d-flex flex-column gap-2">
                <div class="social-send-info">
                  <div class="user-pic-wrapper">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                    />
                  </div>
                  <h6 id="username">Test1</h6>
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
        </div>
        </div>
      </div>
`
    }],
    ['home', {
        auth_required: true,
        url: ['/home/'],
        html: `
            <div class="main-profile-data">
        <pong-redirect class="profile-wrapper" id="profile-image-wrapper">
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
      </div>

      <div
        class="background container-fluid position-relative"
        style="padding: 0"
      >
        <div class="main-buttons-wrapper">
          <div class="play-wrapper">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <h1>WELCOME TO PONG</h1>
            </div>
            <div class="button-wrapper">
              <button class="play-button">LEADERBOARD</button>
              <button class="play-button" id="multiplayer-button">
                MULTIPLAYER
              </button>
              <button class="play-button">SINGLEPLAYER</button>
              <pong-redirect href="/social/">
                  <button class="play-button">SOCIAL</button>
              </pong-redirect>
            </div>
          </div>
        </div>
      </div>

              `
    }],
    ['verification',{
        auth_required: false,
        url: ['/verification/'],
        html: `
            <div class="background container-fluid">
        <div class="d-flex align-items-center justify-content-center h-100">
            <div class="verification-wrapper">
                <h2>E-mail Verification</h2>
                
                <p>Please type verification code sent to your e-mail address</p>
                
                <p>The verification code will expire in 15 minutes</p>
                
                <div class="row">
                    <input type="number" id="singleDigitInput1">
                    <input type="number" id="singleDigitInput2">
                    <input type="number" id="singleDigitInput3">
                    <input type="number" id="singleDigitInput4">
                    <input type="number" id="singleDigitInput5">
                    <input type="number" id="singleDigitInput6">
                </div>
                
                <button type="button" id="verify">Verify</button>
                
                <p>
                    Didn't receive code? 
                    <a id="request">Send again!</a>
                </p>
            </div>
        </div>
    </div>
        `
    }]
]);
const routeToFile = [
    [["/auth/login/"], 'login'],
    [["/auth/register/"], 'register'],
    [[/profile\/[A-Za-z]+/], 'profile'],
    [['/social/',  '/social/\\w+/g'], 'social'],
    [['/home/'], 'home'],
    [['/verification/'], 'verification']
]
const requiredScripts = [
    '/static/components/Notification.js',
    '/static/scripts/Request.js',
    '/static/scripts/requests.js',
    '/static/components/Component.js',
    '/static/components/spinner.js',
    '/static/scripts/utils.js',
    //'/static/scripts/Popup.js',
    '/static/scripts/inbox.js',
]

function handleStyles(value)
{
    let style = document.getElementById('style');
    if(style)
        style.remove();
    let newStyle = document.createElement('link');
    newStyle.rel = 'stylesheet';
    newStyle.href = '/static/styles/' + value + '.css';
    newStyle.id = 'style';
    document.head.appendChild(newStyle);
}
function findRouteKey(pathName) {
    for (let [key, value] of routes) {
        for(let url of value.url)
        {
            if(url instanceof RegExp)
            {
                if(url.test(pathName))
                {
                      return key;
                }

            }
            else if(pathName.includes(url))
                return key;
        }
    }
    return null;
}
function loadRequiredScripts() {
    requiredScripts.forEach(script => {
        if (!document.getElementById(script)) {
            let newScript = document.createElement('script');
            newScript.src = script;
            newScript.id = script;
            newScript.type = 'module';
            document.body.appendChild(newScript);
        }
    });
}
function findRouteFile(pathName) {
    const route = routeToFile.find(route => route[0].some(url => {
        if (url instanceof RegExp) {
            return url.test(pathName);
        } else {
            return pathName.includes(url);
        }
    }));

    return route ? route[1] : null;
}
export function loadPage(fileName) {
    let data = findRouteFile(fileName);
    const route = routes.get(data);
    let isMatch = false;

if (Array.isArray(route.url)) {
    isMatch = route.url.some(url => {
        if (url instanceof RegExp) {
            return url.test(window.location.pathname);
        } else {
            return window.location.pathname.includes(url);
        }
    });
} else if (route.url instanceof RegExp) {
    isMatch = route.url.test(window.location.pathname);
} else {
    isMatch = window.location.pathname.includes(route.url);
}

if (!isMatch) {
    history.pushState({}, '', window.location.origin + route.url);
}
    let content = document.getElementById('main');
    content.innerHTML = route.html;
    App();
}

async function tryRefreshToken()
{
    let refresh_token = getCookie('refresh_token');
    if(!refresh_token)
        return;
    try{

    let data = await request(`${API_URL}/token/refresh`, {
        method: 'POST',
        body: JSON.stringify({
            refresh: refresh_token
        }),
    });
        setCookie('access_token', data.access, 1);
        setCookie('refresh_token', data.refresh, 1);
        return true;
    }
    catch (error)
    {
        notify('Please login again', 3, 'error')
        return false
    }
}
async function checkForAuth()
{
    if(getCookie('access_token'))
        return;
    await tryRefreshToken();
    if(getCookie('access_token'))
        return;
    const pathName = window.location.pathname;
    let value = findRouteKey(pathName);
    if(!value)
        return;
    const route = routes.get(value);
    if(route.auth_required === true)
        loadPage('/auth/login/');

}
export function assignRouting()
{
    let elements = document.querySelectorAll("pong-redirect");
    for(let element of elements)
    {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            let fileName = element.getAttribute('href');
            history.pushState({to: fileName}, '', window.location.origin + fileName);
            loadPage(fileName);
        });
    }
}
function loadSpecificScript()
{
let pathName = window.location.pathname;
    let value = findRouteKey(pathName);
    if(!value)
        return;
    if(document.getElementById('script'))
        document.getElementById('script').remove();
    let script = document.createElement('script');
    script.src = '/static/scripts/' + value + '.js?ts=' + new Date().getTime();
    script.type = 'module';
    script.id = "script";
    document.body.appendChild(script);
    handleStyles(value)
}
const App = async () => {
    loadRequiredScripts();
    loadSpecificScript();
    await checkForAuth();
    assignRouting()
}
window.addEventListener('popstate', (event ) => {
    let pathName = window.location.pathname;
    loadPage(pathName);
    }
);

document.addEventListener('DOMContentLoaded', App);