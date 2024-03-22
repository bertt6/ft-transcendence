export const API_URL = 'http://localhost:8000/api/v1';
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
    url: "/auth/login",
    }],
    ['register', {
    auth_required: false, url: "/auth/register"
    }],
    ['email-verification',
        {
            auth_required: false,
            url: "/auth/email-verification",
        }],
    ['logout', '/auth/logout'],
    ['home', {
    auth_required: false,
        url: '/'
    }],
    ['profile', {
    auth_required: true,
        url: '/profile'
    }],
]);
const pageHTML = new Map([
    ['login',"    <div class=\"background container-fluid\">\n" +
    "        <div class=\"d-flex align-items-center justify-content-center h-100\">\n" +
    "            <form class=\"login-wrapper p-5 gap-2\" onsubmit=\"login(event)\" id=\"content-id\">\n" +
    "                <div\n" +
    "                        style=\"\n" +
    "                display: flex;\n" +
    "                align-items: center;\n" +
    "                justify-content: center;\n" +
    "              \"\n" +
    "                >\n" +
    "                    <h1 style=\"color: white\">LOGIN</h1>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <input\n" +
    "                            type=\"text\"\n" +
    "                            class=\"login-input p-2\"\n" +
    "                            id=\"username\"\n" +
    "                            placeholder=\"USERNAME\"\n" +
    "                    />\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <input\n" +
    "                            type=\"text\"\n" +
    "                            class=\"login-input p-2\"\n" +
    "                            id=\"password\"\n" +
    "                            placeholder=\"PASSWORD\"\n" +
    "                    />\n" +
    "                </div>\n" +
    "                <div\n" +
    "                        style=\"\n" +
    "                display: flex;\n" +
    "                align-items: center;\n" +
    "                justify-content: center;\n" +
    "              \"\n" +
    "                >\n" +
    "                    <div>\n" +
    "\n" +
    "                        <button class=\"login-button\" type=\"submit\">LOGIN</button>\n" +
    "                        <pong-redirect href=\"register\">\n" +
    "                            <button class=\"login-button\" type=\"button\">REGISTER</button>\n" +
    "                        </pong-redirect>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button class=\"ecole-login-button\">\n" +
    "                    Login with 42\n" +
    "                    <div>\n" +
    "                        <img src=\"{%static'public/42.svg' %}\" alt=\"\"/>\n" +
    "                    </div>\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>" ],
    ['register', '      <div class="background container-fluid">\n' +
    '        <div class="d-flex align-items-center justify-content-center h-100">\n' +
    '          <form class="register-wrapper p-5 gap-2">\n' +
    '            <div\n' +
    '              style="\n' +
    '                display: flex;\n' +
    '                align-items: center;\n' +
    '                justify-content: center;\n' +
    '              "\n' +
    '            >\n' +
    '              <h1 style="color: white">REGISTER</h1>\n' +
    '            </div>\n' +
    '            <div class="register-input-wrapper">\n' +
    '              <label for="username">username</label>\n' +
    '              <input\n' +
    '                type="text"\n' +
    '                class="register-input p-2"\n' +
    '                placeholder="USERNAME"\n' +
    '                id="username"\n' +
    '              />\n' +
    '            </div>\n' +
    '            <div class="register-password">\n' +
    '              <div class="register-input-wrapper">\n' +
    '                <label for="password">password</label>\n' +
    '                <input\n' +
    '                  type="text"\n' +
    '                  class="register-input p-2"\n' +
    '                  placeholder="PASSWORD"\n' +
    '                  id="password"\n' +
    '                  required\n' +
    '                />\n' +
    '              </div>\n' +
    '              <div class="register-input-wrapper">\n' +
    '                <label for="password">Re enter your password</label>\n' +
    '                <input\n' +
    '                  type="text"\n' +
    '                  class="register-input p-2"\n' +
    '                  id="password"\n' +
    '                  required\n' +
    '                />\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <div class="register-input-wrapper">\n' +
    '              <label for="Email">Email</label>\n' +
    '              <input\n' +
    '                type="text"\n' +
    '                class="register-input p-2"\n' +
    '                placeholder="EMAIL"\n' +
    '                id="email"\n' +
    '                required\n' +
    '                oninvalid="this.setCustomValidity(\'Please enter valid email\')"\n' +
    '              />\n' +
    '            </div>\n' +
    '            <div\n' +
    '              style="\n' +
    '                display: flex;\n' +
    '                align-items: center;\n' +
    '                justify-content: center;\n' +
    '                gap: 10px;\n' +
    '                width: 100%;\n' +
    '              "\n' +
    '            >\n' +
    '              <div>\n' +
    '                <button class="register-button">REGISTER</button>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '          </form>\n' +
    '        </div>\n' +
    '      </div>'],
    ['profile', `      <div
        class="background container-fluid social-background"
        style="padding: 0"
      >
        <div class="profile-wrapper">
          <div class="profile-info">
            <div class="profile-info-wrapper">
              <div class="profile-photo">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt=""
                  class=""
                />
              </div>
              <div>
                <h1>Name</h1>
                <span>first last name</span>
              </div>
              <div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam
                  tempora nulla ea corrupti animi consequuntur magnam fugiat,
                  qui ipsa? Quaerat maxime iure facere necessitatibus
                  doloremque, vitae non sint ut nobis.
                </p>
              </div>
            </div>
          </div>
          <div class="profile-data">
            <div class="data-headers">
              <div class="header-wrapper">
                <span>MATCH HISTORY</span>
              </div>
              <div class="header-wrapper"><span> FRIENDS </span></div>
            </div>
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
      </div>`],
    ['profile', 'profile.html'],
    ['email-verification'],
    ['home', "      <div\n" +
    "        class=\"background container-fluid position-relative\"\n" +
    "        style=\"padding: 0\"\n" +
    "      >\n" +
    "        <div class=\"multiplayer-menu\">\n" +
    "          <button class=\"return-to-main\" id=\"multi-close-button\">X</button>\n" +
    "          <div class=\"find-match\">\n" +
    "            <img src=\"/public/Clouds 3.png\" alt=\"\" />\n" +
    "          </div>\n" +
    "          <div class=\"find-tournement\">\n" +
    "            <img src=\"/public/Clouds 7.png\" alt=\"\" />\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"main-buttons-wrapper\">\n" +
    "          <div class=\"profile-wrapper\">\n" +
    "            <img src=\"https://picsum.photos/seed/picsum/200/300\" alt=\"\" />\n" +
    "          </div>\n" +
    "          <div class=\"play-wrapper\">\n" +
    "            <div\n" +
    "              style=\"\n" +
    "                display: flex;\n" +
    "                align-items: center;\n" +
    "                justify-content: center;\n" +
    "              \"\n" +
    "            >\n" +
    "              <h1>WELCOME TO PONG</h1>\n" +
    "            </div>\n" +
    "            <div class=\"button-wrapper\">\n" +
    "              <button class=\"play-button\">LEADERBOARD</button>\n" +
    "              <button class=\"play-button\" id=\"multiplayer-button\">\n" +
    "                MULTIPLAYER\n" +
    "              </button>\n" +
    "              <button class=\"play-button\">SINGLEPLAYER</button>\n" +
    "              <button class=\"play-button\">SOCIAL</button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>"]
]);
let elements = document.querySelectorAll("pong-redirect");
for(let element of elements)
{
    element.addEventListener('click', function(event) {
        event.preventDefault();
        let fileName = element.getAttribute('href');
        let route = routes.get(fileName);
        if(!route)
            throw new Error('No route found for ' + fileName);
        history.pushState({to: fileName}, '', window.location.origin + route.url);
        loadPage(fileName);
    });
}
function checkAuth()
{
    if(!getCookie('tokens'))
    {
        history.pushState({to: 'login'}, '', window.location.origin + '/auth/login');
        loadPage('login');
    }
}
export function loadPage(fileName)
{
    if(routes.get(fileName).auth_required === true)
        checkAuth();
    history.pushState({to: fileName}, '', window.location.origin + routes.get(fileName).url);
    let pageHtml = pageHTML.get(fileName);
    let content = document.getElementById('main');
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/static/styles/' + fileName + '.css';
    document.head.appendChild(link);
    let script = document.createElement('script');
    script.src = '/static/scripts/' + fileName + '.js';
    script.type = 'module';
    document.head.appendChild(script);
    content.innerHTML = pageHtml;
}

window.addEventListener('popstate', (event ) => {
    if(event === null)
        return
    console.log(event)
    let pathName = window.location.pathname;
    console.log(pathName);
    let value = pathName[pathName.length - 1] === '/' ? pathName.slice(0, -1) : pathName;
        for (let [key, val] of routes.entries()) {
        if (val.url === value) {
            loadPage(key);
            break;
        }
    }
    }
);
