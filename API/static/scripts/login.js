import {loadPage, API_URL, getCookie, API_42_URL} from "./spa.js";
import {notify} from "../components/Notification.js";
import Spinner from "../components/spinner.js";
import {request} from "./Request.js";

document.getElementById('ecole-login-button').addEventListener('click', async () => {
    localStorage.removeItem("timer")
    const response = await request(`auth/direct-42-login-page/`, {
        method: 'POST',
    })
    if (response.oauth_url) {
        window.location.href = response.oauth_url
    }
})

async function handle42APICallback(code) {
    const response = await request(`auth/login-with-42/${code}/`, {
        method: "POST",
    })
    if (response) {
        localStorage.setItem('username', response.user.username);
        loadPage('/auth/verification/');
    }
}

async function loginForm(event)
{
    localStorage.removeItem("timer")
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let formData = {
        username: username,
        password: password
    };
    const endpoint = `auth/send-email-for-verification/`;
    const loginButton = document.getElementById('login-button');
    loginButton.disabled = true;
    const spinner = new Spinner({isVisible:true,className:"login-button-loader"}, loginButton);
    spinner.render();
        try{
        let response = await request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            localStorage.setItem('username', username);
            spinner.setState({isVisible:false});
            loadPage('/auth/verification/');
        } else {
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
        let spinner = new Spinner({isVisible: true, className: "create-button-loader"}, form);
        spinner.render();
        await handle42APICallback(code)
    }
    localStorage.removeItem("timer")
}

App().catch((error) => {
    console.error(error)
});