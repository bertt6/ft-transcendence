import {API_URL, loadPage} from "./spa.js";
import Spinner from "../components/spinner.js";

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
    setTimeout(() => {
        spinner.setState({isError: true});
    }, 5000);
}
const App = async () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', registerSubmit);
}

document.addEventListener('DOMContentLoaded', App);