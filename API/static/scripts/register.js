import {API_URL, loadPage} from "./spa.js";
import Spinner from "../components/spinner.js";
import {notify} from "../components/Notification.js";
import {parseErrorToNotify} from "./utils.js";
import {request} from "./Request.js";

const registerSubmit = async (event) => {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        password2: document.getElementById('password2').value,
        email: document.getElementById('email').value,
    };
    const button = document.getElementById('register-button');
    const spinner = new Spinner({isVisible: true, className: 'register-loading'},button);
    spinner.render();
    button.disabled = true;
try{
    const response = await request(`register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    if (response.status === 201)
    {
        notify("Registration successful. You will be redirected to the login page", 3, "success");
        loadPage('login');
    } else {
        const data = await response.json();
        spinner.setState({isVisible: false});
        button.disabled = false;
        button.innerText = 'REGISTER';
        const message = parseErrorToNotify(data);
        notify(message, 3, 'error');
    }
    } catch (error) {
        notify("An error occurred. Please try again later", 3, "error");
    }
}
const App = async () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', registerSubmit);

}

App().catch((error) => {
    console.error(error);
});
