import {request} from "./Request.js";
import {API_URL, getCookie} from "./spa.js";

async function handleRouting()
{
    getCookie()
    let tokens = JSON.parse(getCookie('tokens'))
    try{
        let data = await request(`${API_URL}/profile`,{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens.access}`
            }
        });
        console.log(data)
            document.getElementById('profile-photo').href = `/profile/${data.id}`;
    }
    catch (error)
    {
        console.error(error)
    }


}
async function App()
{
    await handleRouting();
}
document.addEventListener('DOMContentLoaded', App);