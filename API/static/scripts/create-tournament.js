import {loadPage} from "./spa.js";
import {request} from "./Request.js";
import {notify} from "../components/Notification.js";
import Spinner from "../components/spinner.js";
import {parseErrorToNotify} from "./utils.js";

function handleValue() {
  let value = document.getElementById("range-input").value;
  let label = document.getElementById("range-value");
  label.innerHTML = value;
}
async function assignFormHandler(e)
{
  e.preventDefault();
    console.log('form submitted')
  e.stopImmediatePropagation()
    let form = e.target;
  let button = document.getElementById('create-button');
    let formData = new FormData(form);
    let data = {};
formData.forEach((value, key) => {
  data[key] = value;
});
    try
    {
      let spinner = new Spinner({isVisible:true,className:"create-button-loader"}, button);
        spinner.render();
      let response = await request(`tournaments/`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
        console.log(response.ok)
      if(!response.ok)
        {
            let message = parseErrorToNotify(response);
            spinner.setState({isVisible:false});
            button.disabled = false;
            button.innerText = "CREATE";
            notify(message,3,'error');
            return;
        }
        notify('Tournament created', 3, 'success');
        button.disabled = false;
        button.innerText = "CREATE";
        loadPage(`/tournament/${response.id}`)
    }
    catch(e)
    {
        console.error(e)
        notify('An error occurred', 3, 'error');
        button.disabled = false;
        button.innerText = "CREATE";
    }
}
async function App() {
    let range = document.getElementById("range-input");
    range.value = 4;
  document.getElementById("range-input").addEventListener("input", handleValue);
  let form = document.getElementById("create-form");
  form.addEventListener("submit",assignFormHandler)
}
App().catch(console.error);
