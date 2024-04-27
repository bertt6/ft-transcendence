import {API_URL} from "./spa.js";
import {request} from "./Request.js";

function handleValue() {
  let value = document.getElementById("range-input").value;
  let label = document.getElementById("range-value");
  label.innerHTML = value;
}
async function assignFormHandler(e)
{
  e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let data = {};
    formData.forEach((value,key) => {
      data[key] = value;
    });
    try{
      let response = await request(`${API_URL}/tournaments/`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log(response)
    }
    catch(e)
    {
      console.error(e);
    }
}
async function App() {
  document.getElementById("range-input").addEventListener("input", handleValue);
  let form = document.getElementById("create-form");
  form.addEventListener("submit",assignFormHandler)
}
App().catch(console.error);
