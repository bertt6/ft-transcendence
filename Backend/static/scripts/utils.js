import {request} from "./Request.js";
import {API_URL} from "./spa.js";

export function escapeHTML(str) {
return  str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export async function getProfile(nickname = null)
{
    if (nickname)
    {
        try{
            return await request(`${API_URL}/profile-with-nickname/${nickname}`,{method:'GET'});
        }
        catch (error)
        {
            console.error(error)
            return null;
        }
    }
    try{
       return await request(`${API_URL}/profile`,{method:'GET'});
    }
    catch (error)
    {
        console.error(error)
    }
}

export function getActiveUserNickname()
{
    const nickname = localStorage.getItem('activeUserNickname');
    if (nickname === null || nickname === undefined)
        return null;
    return nickname;
}