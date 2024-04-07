import {API_URL, loadPage} from "./spa.js";
import Spinner from "../components/spinner.js";
import {notify} from "../components/Notification.js";

const registerSubmit = async (event) => {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        password2: document.getElementById('password2').value,
        email: document.getElementById('email').value,
    };
    const button = document.getElementById('register-button');
    const spinner = new Spinner({},button);
    spinner.render();
    button.disabled = true;
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
        const data = await response.json();
        console.error('Error:', data);
        spinner.setState({isVisible:false});
        button.disabled = false;
        notify(data.message, 3, 'error');
    }
    } catch (error) {
        notify("An error occurred. Please try again later", 3, "error");
    }
}
const App = async () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', registerSubmit);
}
document.addEventListener('DOMContentLoaded', App);