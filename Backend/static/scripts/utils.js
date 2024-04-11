import {request} from "./Request.js";
import {API_URL} from "./spa.js";

export function escapeHTML(str) {
return  str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export async function getProfile()
{
    try{
       return await request(`${API_URL}/profile`,{method:'GET'});
    }
    catch (error)
    {
        console.error(error)
    }
}