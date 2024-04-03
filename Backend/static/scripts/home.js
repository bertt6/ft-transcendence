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
        let profilePhoto = document.getElementById('profile-photo');
        profilePhoto.setAttribute('href', `/profile/${data.nickname}`)
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
App().catch((error) => {
    console.error(error)
});