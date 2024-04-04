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
                        style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
                >
                    <div>

                        <button class="login-button" type="submit">LOGIN</button>
                        <pong-redirect href="register">
                            <button class="login-button" type="button">REGISTER</button>
                        </pong-redirect>

                    </div>
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
        <li>Go To Profile</li>
      </ul>
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
            <div class="chat-container">
              <div class="active-user-wrapper">
                <div class="user-info">
                  <div class="user-pic-wrapper">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt=""
                    />
                  </div>
                  <div class="active-user-info-wrapper">
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
                  <div id="chat-close-button" style="cursor: pointer">
                    <img  src="/static/public/go-back.svg" alt="" />
                  </div>
                </div>
              </div>
              <div class="conversation-wrapper">
                <div class="received-message-container">
                  <span>TEST6</span>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. A
                    repudiandae autem quibusdam totam numquam explicabo saepe
                    iure veritatis natus voluptas voluptate eveniet quos quasi
                    facilis laudantium suscipit, obcaecati optio illo.
                  </p>
                </div>
                <div class="sent-message-container">
                  <span>TEST2</span>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quis cumque maxime iste odio ratione aliquid nisi commodi
                    asperiores, quo nihil sint, voluptate iure vel accusamus
                    odit incidunt porro debitis illo!
                  </p>
                </div>
                <div class="sent-message-container">
                  <span>lorem</span>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quis cumque maxime iste odio ratione aliquid nisi commodi
                    asperiores, quo nihil sint, voluptate iure vel accusamus
                    odit incidunt porro debitis illo!
                  </p>
                </div>
                <div class="sent-message-container">
                  <span>TEST2</span>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Veniam accusantium fugit ad magnam, odio numquam id quidem
                    saepe, deserunt consequuntur commodi animi dolor error
                    debitis sed natus minus. Tempora, laborum?
                  </p>
                </div>
                <div class="received-message-container">
                  <span>TEST6</span>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. A
                    repudiandae autem quibusdam totam numquam explicabo saepe
                    iure veritatis natus voluptas voluptate eveniet quos quasi
                    facilis laudantium suscipit, obcaecati optio illo.
                  </p>
                </div>
                <div class="received-message-container">
                  <span>TEST6</span>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. A
                    repudiandae autem quibusdam totam numquam explicabo saepe
                    iure veritatis natus voluptas voluptate eveniet quos quasi
                    facilis laudantium suscipit, obcaecati optio illo.
                  </p>
                </div>
              </div>
              <form class="send-container" style="margin-bottom: 1px">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Send a message"
                  style="width: 100%"
                />
                <div>
                  <img  src="/static/public/send.svg"alt="" />
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
      <div
        class="background container-fluid position-relative"
        style="padding: 0"
      >
        <div class="main-buttons-wrapper">
          <pong-redirect class="profile-wrapper" href="/profile" id="profile-photo">
            <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
          </pong-redirect>
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
]);
const routeToFile = [
    [["/auth/login/"], 'login'],
    [["/auth/register/"], 'register'],
    [[/profile\/[A-Za-z]+/], 'profile'],
    [['/social/',  '/social/\\w+/g'], 'social'],
    [['/home/'], 'home']
]
const requiredScripts = [
    '/static/components/Notification.js',
    '/static/components/Component.js',
    '/static/components/spinner.js',
    '/static/scripts/Request.js',
    '/static/scripts/utils.js'
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
    debugger
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


function checkForAuth()
{
    if(getCookie('tokens'))
        return;
    const pathName = window.location.pathname;
    let value = findRouteKey(pathName);
    if(!value)
        return;
    const route = routes.get(value);
    console.log(route)
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
const App = async () => {
    loadRequiredScripts();
    checkForAuth();
    assignRouting()
}
window.addEventListener('popstate', (event ) => {
    let pathName = window.location.pathname;

    loadPage(pathName);
    }
);

document.addEventListener('DOMContentLoaded', App);