import {request} from "./Request.js";
import {API_URL} from "./spa.js";

async function fetchTournaments()
{
    try{
    let data = await request(`${API_URL}/tournaments`, {method: 'GET'});
        console.log(data)
    }
    catch (e)
    {
        console.error(e);
    }
}
async function App()
{
    await fetchTournaments();
}
App().catch(console.error)