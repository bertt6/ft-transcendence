const routes = new Map([
    ['login', '/auth/login'],
    ['register', '/auth/register'],
    ['logout', '/auth/logout'],
    ['home', '/home'],
    ['profile', '/profile'],
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
    "                        <img src=\"{% static 'public/42.svg' %}\" alt=\"\"/>\n" +
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
    ['home', 'home.html'],
    ['profile', 'profile.html'],
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
        history.pushState({to: fileName}, '', window.location.origin + route);
        loadPage(fileName).catch(console.error);
    });
}

async function loadPage(fileName)
{
    let pageHtml = pageHTML.get(fileName);
    let content = document.getElementById('main');
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/static/styles/' + fileName + '.css';
    document.head.appendChild(link);
    content.innerHTML = pageHtml;
}

window.addEventListener('popstate', (event ) => {
        let fileName = event.state.to;
        console.log(fileName)
    }
);