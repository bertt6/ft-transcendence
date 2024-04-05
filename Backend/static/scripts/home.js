import {request} from "./Request.js";
import {API_URL, getCookie} from "./spa.js";

async function handleRouting()
{

    try{
        let data = await request(`${API_URL}/profile`,{method:'GET'});
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