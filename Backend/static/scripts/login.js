import {loadPage, API_URL,getCookie, setCookie} from "./spa.js";
import {notify} from "../components/Notification.js";
import Spinner from "../components/spinner.js";

async function loginForm(event)
{
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let formData = {
        username: username,
        password: password
    };
    const endpoint = `${API_URL}/send-email-for-verification`;
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
            notify('Invalid username or password', 3, 'error');
            let data = await response.json();
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
}

App().catch((error) => {
    console.error(error)
});