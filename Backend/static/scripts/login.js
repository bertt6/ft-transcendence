import {loadPage, API_URL, getCookie, setCookie, API_42_URL} from "./spa.js";
import {notify} from "../components/Notification.js";
import Spinner from "../components/spinner.js";

const clientId = 'u-s4t2ud-059b83142b8ffdfdf43962207310ae26dc27e02afbf40a1c7272c0dc6ff99282';
const redirectUrl = 'http://localhost:3000/auth/login/';
const secret = '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'


document.getElementById('ecole-login-button').addEventListener('click', async () => {
    const oauthUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = oauthUrl;
})

async function handle42APICallback(code) {
    const response = await fetch(`${API_42_URL}/oauth/token`, {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': clientId,
            'client_secret': secret,
            'redirect_uri': redirectUrl,
        })
    });
    response.json().then(async (result) => {
        if (result.access_token) {
            const response = await fetch(`${API_42_URL}/v2/me`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + result.access_token
                }
            })
            response.json().then(async (user) => {
                console.log(user)
                const response = await fetch(`${API_URL}/login-with-42`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: user.login + 'Test',
                        email: user.email,
                        image: user.image.versions.medium
                    }),
                })
                response.json().then((response) => {
                    localStorage.setItem('username', response.user.username);
                    loadPage('/auth/verification/');
                })
            })

        }
    })
}


async function loginForm(event)
{
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let formData = {
        username: username,
        password: password
    };
    const endpoint = `${API_URL}/send-email-for-verification/`;
    const loginButton = document.getElementById('login-button');
    loginButton.disabled = true;
    const spinner = new Spinner({isVisible:true,className:"login-button-loader"}, loginButton);
    spinner.render();
        try{
        let response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            let data = await response.json();
            localStorage.setItem('username', username);
            spinner.setState({isVisible:false});
            loadPage('/auth/verification/');
        } else {
            console.error('Error:', response);
            spinner.setState({isVisible:false});
            loginButton.disabled = false;
            loginButton.innerText = "Login";
            notify('Invalid username or password', 3, 'error');
        }
    } catch (error) {
        notify("An error occurred. Please try again later", 3, "error");
        console.error('Error:', error);
    }
    return false;
}



const App = async () => {
    if(getCookie("access_token"))
    {
        loadPage('/home/');
        notify('Already logged in', 3, 'success')
    }
    const form = document.getElementById('login-form');
   form.addEventListener('submit', loginForm);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        console.log(code)
        await handle42APICallback(code)
    }
}

App().catch((error) => {
    console.error(error)
});