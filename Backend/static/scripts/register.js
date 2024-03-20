import {API_URL, loadPage} from "./spa.js";

const registerSubmit = async (event) => {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        password2: document.getElementById('password2').value,
        email: document.getElementById('email').value,
    };
    try{
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    if (response.ok) {
        const data = await response.json();
        loadPage('login');
    } else {
        console.error('Error:', response);
        const data = await response.json();
    }
    } catch (error) {
        console.error('Error:', error);
    }
}
const App = async () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', registerSubmit);
}

document.addEventListener('DOMContentLoaded', App);