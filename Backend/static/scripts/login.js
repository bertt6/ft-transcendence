import {loadPage,API_URL} from "./spa.js";

async function loginForm(event)
{
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let formData = {
        username: username,
        password: password
    };
    try{
        let response = await fetch(`${API_URL}/send_email_for_verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            let data = await response.json();
            loadPage('email-verification').catch(console.error);
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
    const form = document.getElementById('login-form');
    form.addEventListener('submit', loginForm);
}

document.addEventListener('DOMContentLoaded', App);