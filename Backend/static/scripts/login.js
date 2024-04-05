import {loadPage, API_URL,getCookie, setCookie} from "./spa.js";
import {notify} from "../components/Notification.js";

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
            loadPage('/auth/verification/');
        } else {
            console.error('Error:', response);
            let data = await response.json();
        }
    } catch (error) {
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