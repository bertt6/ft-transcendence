import {request} from "./Request.js";
import {API_URL, getCookie} from "./spa.js";
import {Popup} from "../components/Popup.js";
import {getProfile} from "./utils.js";

async function handleRouting()
{

}
async function App()
{
    await handleRouting();
}

App().catch((error) => {
    console.error(error)
});